const { parseEnvArray } = require('./utils');
const jsonld = require('jsonld');

const ASSET_VERSION = {
    v6: 'v6',
    v8: 'v8'
};

// base main, base sepolia dev, base sepolia test, gnosis chiado dev, gnosis chiado test,
// gnosis main, otp dev, otp main, otp test
const OLD_CONTRACTS = [
    '0x3bdfa81079b2ba53a25a6641608e5e1e6c464597',
    '0xbe08a25dcf2b68af88501611e5456571f50327b4',
    '0x9e3071dc0730cb6dd0ce42969396d716ea33e7e1',
    '0x3db64dd0ac054610d1e2af9cca0fbc1a7f4c2d8',
    '0xea3423e02c8d231532dab1bce5d034f3737b3638',
    '0xf81a8c0008de2dcdb73366cf78f2b178616d11dd',
    '0xabd59a9aa71847f499d624c492d3903da953d67a',
    '0x5cac41237127f94c2d21dae0b14bfefa99880630',
    '0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f'
];

const NEW_CONTRACTS = [];

const V8_NODE_ENDPOINTS = parseEnvArray(process.env.V8_NODE_ENDPOINTS);
const V6_NODE_ENDPOINT = parseEnvArray(process.env.V6_NODE_ENDPOINTS)[0];

const GET_QUERIES = {
    V6_QUERY_ASSERTION: ual => `
        SELECT ?g
        WHERE { 
            GRAPH <assets:graph> { 
                <${ual.trim()}> schema:assertion ?g . 
            }
        }`,
    V6_QUERY_CONTENT: assertion => `
        CONSTRUCT { ?s ?p ?o } 
        WHERE { 
            GRAPH <${assertion.trim()}> { 
                ?s ?p ?o 
            }
        }`,
    V8_QUERY: ual => `
        CONSTRUCT { ?s ?p ?o }
        WHERE {
            GRAPH ?g {
                ?s ?p ?o .
            }
            FILTER (STRSTARTS(STR(?g), "${ual.trim()}"))
        }`
};

async function toJSONLD(nquads) {
    return jsonld.fromRDF(nquads, {
        algorithm: 'URDNA2015',
        format: 'application/n-quads'
    });
}

module.exports = {
    ASSET_VERSION,
    OLD_CONTRACTS,
    NEW_CONTRACTS,
    V6_NODE_ENDPOINT,
    V8_NODE_ENDPOINTS,
    GET_QUERIES,
    toJSONLD
};
