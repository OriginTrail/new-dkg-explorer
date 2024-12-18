require('dotenv').config();
const DKG = require('dkg.js');

const {
    ASSET_VERSION,
    OLD_CONTRACTS,
    NEW_CONTRACTS,
    V6_NODE_ENDPOINT,
    V8_NODE_ENDPOINTS,
    GET_QUERIES,
    toJSONLD
} = require('../helpers/dkgUtils');

class DKGService {
    constructor() {
        this.dkgClient = null;
        this.version = null;

        this.init();
    }

    init() {
        if (!this.dkgClient) {
            this.dkgClient = new DKG({
                environment: process.env.DKG_ENV,
                port: 8900,
                maxNumberOfRetries: 30,
                frequency: 2,
                contentType: 'all',
                nodeApiVersion: '/v0'
            });
        }
    }

    async query(query, queryType, options) {
        console.log(`Querying ${options.endpoint} using query: ${query}`);
        try {
            const response = await this.dkgClient.graph.query(
                query,
                queryType,
                options
            );
            return response.data;
        } catch (e) {
            console.error(
                `Error querying ${this.version} node: ${e}, using query: ${query} on node ${options.endpoint}`
            );
            return [];
        }
    }

    async raceQuery(query, queryType, endpoints) {
        const v8Queries = endpoints.map(endpoint =>
            this.query(query, queryType, { endpoint }).catch(error => {
                console.error(`Error querying V8 node at ${endpoint}:`, error);
                return null;
            })
        );

        try {
            return await Promise.race(v8Queries);
        } catch (error) {
            console.error('Error querying V8 nodes:', error);
            return [];
        }
    }

    async getAssetByUal(ual = null) {
        const { blockchain, version } = parseUal(ual);
        this.version = version;

        let data, assertion, response;

        //v6 assets
        if (this.version === ASSET_VERSION.v6) {
            //find assertion on v6 sync node

            response = await this.query(
                GET_QUERIES.V6_QUERY_ASSERTION(ual),
                'SELECT',
                {
                    endpoint: V6_NODE_ENDPOINT
                }
            );
            assertion = response[0]?.g;
            console.log(`Got assertion for ${ual}`, assertion);

            if (assertion) {
                //if assertion is found, query for the content
                data = await this.query(
                    GET_QUERIES.V6_QUERY_CONTENT(assertion),
                    'CONSTRUCT',
                    {
                        endpoint: V6_NODE_ENDPOINT
                    }
                );
            } else {
                console.log(
                    `Assertion not found for ${ual} on ${V6_NODE_ENDPOINT}`
                );
            }

            //if asset was not found query v8 nodes (old repositories)
            if (!data || !data.length) {
                response = await this.raceQuery(
                    GET_QUERIES.V6_QUERY_ASSERTION(ual),
                    'SELECT',
                    V8_NODE_ENDPOINTS
                );

                assertion = response[0]?.g;
                console.log(`Got assertion for ${ual}`, assertion);

                if (assertion) {
                    data = await this.raceQuery(
                        GET_QUERIES.V6_QUERY_CONTENT(assertion),
                        'CONSTRUCT',
                        V8_NODE_ENDPOINTS
                    );
                } else {
                    console.log(
                        `Assertion not found for ${ual} on `,
                        V8_NODE_ENDPOINTS
                    );
                }
            }
        }

        //v8 assets or v6 assets that were not found on the sync node or v8 old repositories
        if (this.version === ASSET_VERSION.v8 || !data || !data.length) {
            //query v8 new repositories
            data = await this.raceQuery(
                GET_QUERIES.V8_QUERY(ual),
                'CONSTRUCT',
                V8_NODE_ENDPOINTS
            );

            if (!data || !data.length) {
                console.log(
                    'Knowledge Asset not found on V8 nodes: ',
                    V8_NODE_ENDPOINTS
                );

                //if no assets are found using query, try with get on v8 nodes
                try {
                    data = await this.dkgClient.graph.get(ual, {
                        endpoint: V8_NODE_ENDPOINTS[0],
                        blockchain: {
                            name: blockchain.name
                        }
                    });

                    if (!data || !data.assertion?.length) {
                        console.log(`Get did not return any data for ${ual}`);
                    }

                    return returnAssertion(data.assertion);
                } catch (e) {
                    console.error(`Error getting ${ual} from v8 nodes:`, e);
                    return [];
                }
            }
        }

        const jsonld = await toJSONLD(data);
        return returnAssertion(jsonld);
    }
}

function returnAssertion(data) {
    console.log('Knowledge Asset found! Returning: ', data);
    return { assertion: data };
}

function parseUal(ual) {
    const segments = ual.split(':');
    const argsString =
        segments.length === 3 ? segments[2] : `${segments[2]}:${segments[3]}`;
    const args = argsString.split('/');

    if (args.length !== 3) {
        throw new Error(`UAL doesn't have correct format: ${ual}`);
    }

    const version = OLD_CONTRACTS.includes(args[1])
        ? ASSET_VERSION.v6
        : ASSET_VERSION.v8;

    return {
        blockchain: {
            name: args[0]
        },
        version
    };
}

module.exports = new DKGService();
