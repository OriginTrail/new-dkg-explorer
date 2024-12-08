<template>
  <div ref="graphContainer" class="graph-container"></div>
</template>

<script>
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three"; // Import three.js
import {
  generateGraphData,
  getNodeMesh,
  getLinkMesh,
  linkTypes,
  CAMERA,
  NODE_ZOOM,
  GRAPH_OPTIONS,
} from "@/utils/graphUtils.js";

export default {
  name: "GraphComponent",
  mounted() {
    this.graph = null;
    this.$nextTick(() => {
      this.initializeGraph();
    });
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    search: {
      type: String,
      default: "",
    },
    zoomOut: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["selected-node"],
  data() {
    return {
      searchNodeId: this.search,
      targetNode: null,
      idMap: {},
    };
  },
  watch: {
    search(newVal) {
      this.searchNodeId = newVal;
      if (newVal) {
        this.searchAndZoomNode();
      }
    },
    data(newVal) {
      this.initializeGraph();
    },
    zoomOut(newVal) {
      if (newVal) {
        this.zoomOutOnNode();
      }
    },
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
.graph-container {
  width: 100%;
  height: 100%;
}
</style>
