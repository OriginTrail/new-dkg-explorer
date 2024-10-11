<template>
  <div class="d-flex flex-column gap-4">
    <div class="row g-4 flex-grow-1">
      <div
        class="col-12 col-lg-4 text-center text-lg-start d-flex justify-content-center align-items-top"
      >
        <div class="box w-100 h-100 p-4">
          <h1>My Network Dashboard</h1>
          <dl class="landing-stats" ref="dashboardStats">
            <template v-for="(value, key) in stats" :key="key">
              <dt>{{ key }}:</dt>
              <dd>{{ value }}</dd>
              <br />
            </template>
          </dl>
        </div>
      </div>
      <div class="col-12 col-lg-8">
        <div class="box w-100 h-100 d-flex align-items-center">
          <node-graph
            :count="nodes.length"
            :width="650"
            :height="450"
            view-box="0,50,650,450"
            :graph-size="350"
            class="node-graph"
          >
            <template #node="nodeProps">
              <circle
                :cx="nodeProps.cx"
                :cy="nodeProps.cy"
                r="5"
                :class="{
                  node: true,
                  isMe: isMe(nodeProps.index),
                  active: isNodeActive(nodeProps.index),
                  disabled: isNodeDisabled(nodeProps.index),
                }"
                @click="activateNode(nodeProps.index)"
              />
              <circle
                :cx="nodeProps.cx"
                :cy="nodeProps.cy"
                r="12"
                fill="transparent"
                :style="
                  'cursor: ' +
                  (isNodeDisabled(nodeProps.index) ? 'not-allowed' : 'pointer')
                "
                @click="activateNode(nodeProps.index)"
              />
              <rect
                :="
                  getNodeLabelProps(nodeProps.index, nodeProps.cx, nodeProps.cy)
                "
                :class="{
                  'node-label': true,
                  isMe: isMe(nodeProps.index),
                  active: isNodeActive(nodeProps.index),
                  disabled: isNodeDisabled(nodeProps.index),
                }"
                @click="activateNode(nodeProps.index)"
              />
              <text
                :class="{
                  'node-label-text': true,
                  isMe: isMe(nodeProps.index),
                  active: isNodeActive(nodeProps.index),
                  disabled: isNodeDisabled(nodeProps.index),
                }"
                :="
                  getNodeLabelTextProps(
                    nodeProps.index,
                    nodeProps.cx,
                    nodeProps.cy,
                  )
                "
              >
                {{ nodes[nodeProps.index].label }}
              </text>
              <image
                v-if="nodes[nodeProps.index].image"
                :class="{
                  'node-label-image': true,
                  isMe: isMe(nodeProps.index),
                  active: isNodeActive(nodeProps.index),
                  disabled: isNodeDisabled(nodeProps.index),
                }"
                :="
                  getNodeLabelImageProps(
                    nodeProps.index,
                    nodeProps.cx,
                    nodeProps.cy,
                  )
                "
                @click="activateNode(nodeProps.index)"
              />
            </template>
            <template #line="lineProps">
              <line
                :x1="lineProps.x1"
                :y1="lineProps.y1"
                :x2="lineProps.x2"
                :y2="lineProps.y2"
                :class="{
                  'node-graph__line': true,
                  active:
                    isNodeActive(lineProps.n1) && isNodeActive(lineProps.n2),
                }"
              />
            </template>
            <text
              x="15"
              y="330"
              class="node-graph__title"
              v-if="nodeGraphTitle"
            >
              {{ nodeGraphTitle }}
            </text>
          </node-graph>
        </div>
      </div>
    </div>
    <div>
      <footer-component></footer-component>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NodeGraph from "@/ui-components/common/NodeGraph.vue";
import FooterComponent from "@/ui-components/edge-node/single-components/FooterComponent.vue";
import { getTimeZone } from "@/utils/dateUtils";
import { configMixin } from "@/services/config";

export default {
  components: { NodeGraph, FooterComponent },
  mixins: [configMixin],
  props: {
    activeNodeIds: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: ["activated-nodes"],
  data() {
    return {
      stats: {},
      nodeGraphTitle: "",
      myNodeIndex: null,
      nodes: [],
      observer: null,
    };
  },
  created() {
    const allNodes = this.getGlobalConfigOption_Array("all_nodes_names");
    const myNodeName = this.getGlobalConfigOption("edge_node_name");
    const myNodeIndex = allNodes.indexOf(myNodeName);

    this.myNodeIndex = myNodeIndex;
    this.nodes = [
      ...allNodes.map((v, i) => {
        const isMe = i === myNodeIndex;
        return {
          id: (i + 1).toString(),
          active: true,
          label: v,
          image: undefined,
          disabled: !isMe,
        };
      }),
    ];
  },
  computed: {
    activeNodes() {
      return this.nodes.filter((n) => n.active).map((n) => n.id);
    },
  },
  watch: {
    activeNodes(val) {
      this.$emit("activated-nodes", val);
    },
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) this.fetchStats();
      });
    });
    this.observer.observe(this.$refs.dashboardStats);
  },
  unmounted() {
    this.observer?.disconnect();
    this.observer = null;
  },
  methods: {
    fetchStats() {
      const userLocale = navigator.languages?.at(0) ?? navigator.language;
      axios
        .get(this.endpoints.edgeNodeBackend + "/dashboard/dashboard-data", {
          params: {
            locale: userLocale,
            timezone: getTimeZone(),
          },
          withCredentials: true,
        })
        .then((r) => (this.stats = r.data));
    },
    isMe(index) {
      return index === this.myNodeIndex;
    },
    isBottomNode(index) {
      return index === 0;
    },
    activateNode(index) {
      if (this.isMe(index) || this.isNodeDisabled(index)) return;

      this.nodes[index].active = !this.nodes[index].active;
    },
    isNodeActive(index) {
      return this.nodes[index].active;
    },
    isNodeDisabled(index) {
      return this.nodes[index].disabled;
    },
    getNodeLabelProps(index, cx, cy) {
      const text = this.nodes[index].label;
      const isLeft = index < this.nodes.length / 2;
      const width = text.length * 7 + 16;
      const height = 32;
      const d = 10;
      return {
        width,
        height,
        rx: 8,
        ry: 8,
        x: this.isBottomNode(index)
          ? cx - width / 2
          : isLeft
            ? cx - (width + d)
            : cx + d,
        y: this.isBottomNode(index) ? cy + d : cy - height / 2,
      };
    },
    getNodeLabelTextProps(index, cx, cy) {
      const isLeft = index < this.nodes.length / 2;
      const { width, height, x, y } = this.getNodeLabelProps(index, cx, cy);
      return {
        width,
        height,
        x: this.isBottomNode(index) ? cx : x + width / 2,
        y: this.isBottomNode(index) ? cy + height - 1 : cy + 4,
        "text-anchor": "middle",
      };
    },
    getNodeLabelImageProps(index, cx, cy) {
      const isLeft = index < this.nodes.length / 2;
      const { width, height, x, y } = this.getNodeLabelTextProps(index, cx, cy);
      const d = 5;
      return {
        x:
          isLeft && index !== 0
            ? x - (width / 2 + d) - 100
            : x + (width / 2 + d),
        y: y - height / 2 - 3,
        href: this.nodes[index].image,
        height: height - 3,
        width: 100,
        preserveAspectRatio:
          isLeft && index !== 0 ? "xMaxYMid meet" : "xMinYMid meet",
      };
    },
  },
};
</script>

<style scoped lang="scss">
h1 {
  margin-bottom: 24px;
  font-family: $headlines-font;
}

.landing-stats {
  dt {
    display: inline-block;
    color: $text-color-default;
    font-weight: normal;
    margin-right: 5px;
    margin-top: 12px;
  }
  dd {
    display: inline;
    color: $secondary-color;
    font-weight: bold;
  }
}

.node-graph {
  width: 100%;
  border-radius: 16px;

  .node {
    fill: #67808e;
    filter: drop-shadow(0px 0px 11.38px #ab8dec80);
    &.active {
      fill: #b3e8ff;
      filter: drop-shadow(0px 0px 11.38px #ab8dec40);
    }
    &.isMe {
      fill: $secondary-color;
    }

    cursor: pointer;
    &.disabled {
      cursor: not-allowed;
    }

    transition: all 300ms;
  }

  .node-label {
    fill: $primary-color-dark;
    stroke: $primary-color-light;
    stroke-width: 1px;

    cursor: pointer;
    &.disabled {
      cursor: not-allowed;
    }
  }

  .node-label-text {
    font-family: "Overused Grotesk", sans-serif;
    font-weight: 300;
    font-size: 14px;
    pointer-events: none;

    fill: $text-color-dark;
    &.active {
      fill: $text-color-default;
      font-weight: bold;
    }
    &.isMe {
      fill: $secondary-color;
    }
    transition: all 0.3s;
  }

  .node-label-image {
    opacity: 0.5;
    &.active {
      opacity: 1;
    }

    cursor: pointer;
    &.disabled {
      cursor: not-allowed;
    }

    transition: all 0.3s;
  }

  .node-graph__line {
    stroke: $text-color-default;
    stroke-opacity: 0.5;
    stroke-width: 0.55;
    stroke-dasharray: 1.5;

    &.active {
      stroke-opacity: 1;
      stroke-dasharray: none;
    }
    transition: all 300ms;
  }

  .node-graph__title {
    font-family: "Overused Grotesk", sans-serif;
    font-size: 20px;
    font-weight: 500;
    fill: $text-color-default;
  }
}
</style>
