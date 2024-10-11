<template>
  <div class="half-circle-chart-wrapper" ref="mainElement">
    <div class="pie">
      <div class="label low">
        Very <br />
        negative
      </div>
      <span class="label guarded"></span>
      <span class="label elevated">Neutral</span>
      <span class="label high"></span>
      <span class="label severe">
        Very <br />
        positive
      </span>
      <div class="label overlay" ref="overlay">
        <div class="inner-overlay"></div>
      </div>
    </div>
    <div
      class="arrow-circle"
      :style="{ transform: 'rotate(' + arrowPosition + 'deg)' }"
    >
      <img :src="riskArrow" alt="" />
    </div>
  </div>
</template>

<script>
import riskArrow from "../../../../public/images/chatdkg/icons/risk-assessment-arrow.svg";
export default {
  name: "HalfCircleChart",
  props: {
    value: {
      default: 0,
      type: Number,
    },
  },
  data() {
    return {
      range: [-1, 1],
      arrowPosition: 0,
      maxHeight: 0,
      riskArrow,
    };
  },
  watch: {
    value() {
      this.calculateArrowPosition();
    },
  },
  mounted() {
    this.calculateArrowPosition();
    this.$nextTick(() => {
      setTimeout(() => {
        this.calculateMaxHeight();
      }, 200);
    });
  },
  methods: {
    calculateArrowPosition() {
      this.arrowPosition = (Math.min(Math.max(this.value, -1), 1) + 1) * 90;
    },
    calculateMaxHeight() {
      const radius = this.$refs.mainElement.clientWidth / 2;
      this.maxHeight = radius + "px";
    },
  },
};
</script>

<style scoped lang="scss">
.half-circle-chart-wrapper {
  position: relative;
  width: 63%;
  height: 60%;
  max-height: 150px;
  max-width: 300px;
  @media screen and (max-width: 768px) {
    max-height: 134px;
  }
  @media screen and (max-width: 570px) {
    max-height: v-bind(maxHeight);
  }
  .arrow-circle {
    transform: rotate(0deg);
    display: flex;
    width: 62%;
    height: 191px;
    top: -3px;
    margin: -93px auto 0 auto;
    position: relative;
    z-index: 2;
    border-radius: 50%;
    align-items: center;
    img {
      position: absolute;
      left: 6px;
      width: 20px;
      height: 20%;
      transform: rotate(315deg);
    }
  }

  .text-circle {
    width: 307px;
    height: 153px;
    background-color: #6a9e3b;
  }

  .pie {
    margin: 0 auto;
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 200px 200px 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    .low {
      position: absolute;
      top: calc(100% + 10px);
      left: calc(0% - 35px);
    }

    .guarded {
      position: absolute;
      top: 27px;
      left: -41px;
    }

    .elevated {
      position: absolute;
      top: calc(0% - 30px);
      left: calc(50% - 25px);
    }

    .high {
      position: absolute;
      top: 27px;
      left: 298px;
    }

    .severe {
      position: absolute;
      top: calc(100% + 10px);
      left: 100%;
    }
  }
  .pie::after {
    background: linear-gradient(
      90deg,
      rgba(238, 49, 35, 1) 0%,
      rgba(244, 208, 53, 1) 50%,
      rgba(118, 176, 66, 1) 100%
    );
    transform-origin: center bottom;
  }
  .pie .overlay {
    //position: absolute;
    top: 60px;
    left: 60px;
    width: calc(60%);
    height: calc(60%);
    overflow: hidden;
    z-index: 1;
    .inner-overlay {
      height: 200%;
      width: 100%;
      border-radius: 100%;
      background-color: white;
    }
  }
  .pie::before,
  .pie::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    border-radius: inherit;
    box-sizing: border-box;
  }
}
</style>
