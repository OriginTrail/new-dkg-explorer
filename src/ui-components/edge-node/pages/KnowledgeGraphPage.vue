<template>
  <ion-page>
    <ion-content class="background">
      <div class="d-flex flex-column position-relative">
        <div class="page">
          <div class="sidebar">
            <div class="input">
              <input type="search" placeholder="Search by UAL" />
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M19.3333 13.25C15.9736 13.25 13.25 15.9736 13.25 19.3333C13.25 22.6931 15.9736 25.4167 19.3333 25.4167C20.7429 25.4167 22.0404 24.9373 23.0719 24.1326L25.4696 26.5303L25.9999 27.0607L27.0606 26L26.5303 25.4697L24.1326 23.072C24.9372 22.0405 25.4167 20.7429 25.4167 19.3333C25.4167 15.9736 22.6931 13.25 19.3333 13.25ZM22.7427 22.3966C23.4726 21.5848 23.9167 20.5109 23.9167 19.3333C23.9167 16.802 21.8646 14.75 19.3333 14.75C16.802 14.75 14.75 16.802 14.75 19.3333C14.75 21.8646 16.802 23.9167 19.3333 23.9167C20.5109 23.9167 21.5848 23.4726 22.3966 22.7427L22.7427 22.3966Z"
                  fill="#8B85F4"
                />
              </svg>
            </div>
            <hgroup>
              <h1>Knowledge Asset profile</h1>
              <p>Latest update: 02/06/2023</p>
            </hgroup>
            <div class="info box">
              <div class="main">
                <img src="/images/ka.svg" />
                <div>
                  <dl>
                    <dt>Name:</dt>
                    <dd>
                      “Machine Learning Algorithms for Predicting Stock Market
                      Trends: A Comparative Study”
                    </dd>
                    <dt>Owner:</dt>
                    <dd><a>Machine entusiast</a></dd>
                    <dt>UAL:</dt>
                    <dd><a>did:otp:0xDbF8e9d36A73C.../32145</a></dd>
                    <dt>Blockchain:</dt>
                    <dd><img /> Base</dd>
                  </dl>
                </div>
              </div>
              <hr />
              <dl class="description">
                <dt>Description:</dt>
                <dd>
                  “Dopamine plays important roles in cognitive function and
                  inflamation and therefore is involved in the pathogenesis of
                  neurodegenerative diseases, including Alzheimer’s disease
                  (AD). Drugs that increase or maintain dopamine levels in the
                  brain could be a therapeutic strategy for AD. However, the
                  effects of dopamine and its precursor levodopa (L_DOPA) on
                  Ab/tau pathology in vivo and the underlying molecular)"
                </dd>
              </dl>
            </div>
          </div>
          <div ref="graphContainer" class="box graph-container"></div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage } from "@ionic/vue";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three"; // Import three.js
import {
  generateGraphData,
  getNodeMesh,
  getLinkMesh,
  CAMERA,
  NODE_ZOOM,
  GRAPH_OPTIONS,
} from "@/utils/graphUtils";

export default {
  components: { IonPage, IonContent },
  name: "KnowledgeGraphPage",
  props: {
    ual: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      targetNode: null,
      // idMap: {},
    };
  },
  watch: {},
  mounted() {
    this.graph = null;
    this.$nextTick(() => {
      this.initializeGraph();
    });
  },
  beforeDestroy() {
    if (this.graph) {
      this.graph._destructor();
      this.graph = null;
    }
  },
  methods: {
    initializeGraph() {
      const gData = generateGraphData();

      const graph = ForceGraph3D({
        controlType: "orbit",
        worker: true,
      })(this.$refs.graphContainer)
        .showNavInfo(false)
        .backgroundColor(GRAPH_OPTIONS.backgroundColor);

      graph.width(1);
      graph.height(1);
      setTimeout(() => {
        graph.width(this.$refs.graphContainer.clientWidth);
        graph.height(this.$refs.graphContainer.clientHeight);
      }, 50);

      // Customize graph options based on your requirements
      // graph
      //   .warmupTicks(GRAPH_OPTIONS.warmupTicks)
      //   .cooldownTicks(GRAPH_OPTIONS.cooldownTicks)
      //   .cooldownTime(GRAPH_OPTIONS.cooldownTime)
      //   .enableNodeDrag(GRAPH_OPTIONS.enableNodeDrag);

      // graph.d3Force("link").distance(GRAPH_OPTIONS.linkDistance);
      // graph.d3Force("charge").strength(GRAPH_OPTIONS.chargeStrength);

      // Set node mesh and properties
      graph.nodeThreeObject((node) => {
        return getNodeMesh(node);
      });

      graph.linkThreeObject((link) => {
        return getLinkMesh(link);
      });

      graph.graphData(gData);

      let lights = [];
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      lights.push(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
      directionalLight.position.set(100, 100, 100);
      lights.push(directionalLight);

      graph.lights(lights);
      graph.onNodeClick((node) => {
        this.zoomInOnNode(node);
      });

      this.graph = graph;
      this.loadGraphForUAL(this.ual);
    },
    loadGraphForUAL(ual) {
      // TODO
      const getResult = {
        assertion: [
          {
            "@id": "uuid:1",
            "http://schema.org/city": [{ "@id": "uuid:belgrade" }],
            "http://schema.org/company": [
              { "@value": "OT" },
              { "@value": "TraceLabs" },
            ],
            "http://schema.org/user": [{ "@id": "uuid:user:1" }],
          },
          {
            "@id": "uuid:61e4e65b-954b-4e61-9ed5-0cd0cb4f8f19",
            "http://schema.org/problem": [{ "@value": "empty" }],
            "https://ontology.origintrail.io/dkg/1.0#privateAssertionID": [
              {
                "@value":
                  "0xeefb437b24e5c5efe25eae42fe0aef075ddf49a3246c27fb8ceb371df92b6592",
              },
            ],
          },
          {
            "@id": "uuid:7967c058-2409-4414-917a-8e792996e8c7",
            "http://schema.org/solution": [{ "@value": "generate" }],
            "https://ontology.origintrail.io/dkg/1.0#privateAssertionID": [
              {
                "@value":
                  "0x55d0e89b9c2bde84af95fc30735bcb835e3f652e52a4222179ce7271bfd9c69a",
              },
            ],
          },
          {
            "@id": "uuid:belgrade",
            "http://schema.org/postCode": [{ "@value": "11000" }],
            "http://schema.org/title": [{ "@value": "Belgrade" }],
            "https://ontology.origintrail.io/dkg/1.0#privateAssertionID": [
              {
                "@value":
                  "0xcc144908f7c85b1318bb600517d077a5fcf122d84901e0508180752802334a6b",
              },
            ],
          },
          {
            "@id": "uuid:user:1",
            "http://schema.org/lastname": [{ "@value": "Smith" }],
            "http://schema.org/name": [{ "@value": "Adam" }],
            "https://ontology.origintrail.io/dkg/1.0#privateAssertionID": [
              {
                "@value":
                  "0xbd63fb177e23a4a90cf8fe60567aa5da19db3ebde18d51893acf92f04b6878d6",
              },
            ],
          },
        ],
        operation: {
          get: {
            operationId: "32d9ad1a-7c16-40be-a0de-5e25f7e4ae21",
            status: "COMPLETED",
          },
        },
      };

      console.log("Loading graph for UAL:", ual);

      const createNode = (typeKey, id) => {
        const type = nodeTypes[typeKey];
        return {
          id,
          type: type.name,
          color: type.color,
          shape: type.shape,
          size: type.size,
          glow: Math.random() >= 0.5 ? true : false,
        };
      };
      const nodes = [];
      const links = [];
      for (const a of getResult.assertion) {
        const id = a["@id"];
      }
    },
    zoomInOnNode(node) {
      if (this.targetNode?.id === node.id) {
        this.graph.cameraPosition(
          CAMERA.position,
          CAMERA.target,
          CAMERA.duration,
        );
        node.isClicked = false;
        this.targetNode = null;
      } else {
        if (this.targetNode) {
          this.targetNode.isClicked = false;
        }
        this.targetNode = node;
        this.graph.cameraPosition(
          { x: node.x, y: node.y, z: node.z + NODE_ZOOM },
          node,
          3000,
        );
        node.isClicked = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  gap: 24px;

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 400px;
    height: 100%;

    dl {
      margin: 0;
    }

    .input {
      & > input {
        background: $background-color;
        outline: none;
        border: 1.5px solid $primary-color-light;
        border-radius: 50px;
        height: 48px;
        padding: 8px 16px;
        width: 100%;
      }

      position: relative;

      & > svg {
        position: absolute;
        right: 8px;
        height: 48px;
        width: 48px;
      }
    }
    hgroup {
      padding: 12px;
      background: url(/images/ka-profile-background.svg);
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      h1 {
        font-weight: bold;
        font-size: 16px;
        font-family: "Manrope";
      }
      p {
        font-size: 12px;
        font-family: "Manrope";
      }
    }
    .info {
      padding: 24px 12px;
      .main {
        display: flex;
        align-items: start;
        gap: 12px;

        dl {
          display: grid;
          grid-template-columns: auto 1fr;

          dt {
            font-weight: 400;
          }

          dd {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            color: #fff;
            font-weight: 600;

            a {
              font-weight: 500;
              color: #8b85f4;
              text-decoration: underline;
            }
          }
        }
      }
      hr {
        margin: 24px 0;
        height: 1.5px;
        background-color: $primary-color-light;
      }
      dl.description {
        dt {
          padding-right: 12px;
        }

        display: grid;
        grid-template-columns: auto 1fr;
        max-height: 200px;
        overflow: scroll;
      }
    }

    flex-basis: 0;
  }

  .graph-container {
    height: 100%;
    flex: 1;
  }
}
</style>
