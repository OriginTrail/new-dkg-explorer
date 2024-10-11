<template>
  <svg
    :viewBox="viewBox ?? '0,0,' + width + ',' + height"
    :width="width + 'px'"
    :height="height + 'px'"
    style="user-select: none"
  >
    <template v-for="i in count" :key="'t' + i">
      <slot
        v-for="j in count - i"
        :key="j"
        name="line"
        :n1="i - 1"
        :n2="j + i - 1"
        :="lineBetweenNodes(i, j + i)"
      >
        <line
          :="lineBetweenNodes(i, j + i)"
          stroke="#ffffff80"
          stroke-width="0.55"
          stroke-dasharray="1.5"
        />
      </slot>
    </template>
    <slot
      v-for="i in count"
      :key="i"
      name="node"
      :index="i - 1"
      :="nthNodeCenter(i)"
    >
      <circle
        :="nthNodeCenter(i)"
        r="5"
        :fill="i === 1 ? '#AB8DEC' : '#67808E'"
        style="filter: drop-shadow(0px 0px 11.38px #ab8dec80)"
      />
    </slot>
    <slot></slot>
  </svg>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true,
    },
    width: {
      default: 200,
    },
    height: {
      default: 100,
    },
    graphSize: {
      type: Number,
      required: false,
    },
    viewBox: {
      type: String,
      required: false,
    },
    /**
     * Values: 'top' | 'bottom' | 'left' | 'right' | number (radians)
     */
    start: {
      default: "bottom",
    },
  },
  computed: {
    radius() {
      return this.graphSize
        ? this.graphSize / 2
        : Math.min(this.width, this.height) / 2;
    },
    center() {
      return { x: this.width / 2, y: this.height / 2 };
    },
    circumference() {
      return 2 * this.radius * Math.PI;
    },
    phi() {
      return (2 * Math.PI) / this.count;
    },
    startOffset() {
      switch (this.start) {
        case "right":
          return 0;
        case "bottom":
          return 0.5 * Math.PI;
        case "left":
          return 1 * Math.PI;
        case "top":
          return 1.5 * Math.PI;
        default:
          return typeof this.start === "number" ? this.start : 0;
      }
    },
  },
  methods: {
    nthNodeCenter(n) {
      return {
        cx:
          this.center.x +
          Math.cos((n - 1) * this.phi + this.startOffset) * this.radius,
        cy:
          this.center.y +
          Math.sin((n - 1) * this.phi + this.startOffset) * this.radius,
      };
    },
    lineBetweenNodes(n1, n2) {
      n1 = this.nthNodeCenter(n1);
      n2 = this.nthNodeCenter(n2);
      return {
        x1: n1.cx,
        y1: n1.cy,
        x2: n2.cx,
        y2: n2.cy,
      };
    },
  },
};
</script>
