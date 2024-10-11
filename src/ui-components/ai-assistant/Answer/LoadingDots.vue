<template>
  <div class="loading-dots">
    <div v-for="index in dotCount" :key="index" class="dot">.</div>
  </div>
</template>

<script>
export default {
  name: "LoadingDots",
  props: {
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      numOfDots: 0,
      loadingInterval: null,
    };
  },
  computed: {
    dotCount() {
      if (!this.isLoading) {
        return 0;
      }

      return this.numOfDots;
    },
  },
  mounted() {
    this.loadingInterval = setInterval(() => {
      this.numOfDots = (this.numOfDots + 1) % 4;
    }, 500);
  },
  beforeUnmount() {
    clearInterval(this.loadingInterval);
  },
};
</script>

<style scoped lang="scss">
.loading-dots {
  display: inline-flex;

  .dot {
    margin-right: 2px;
  }
}
</style>
