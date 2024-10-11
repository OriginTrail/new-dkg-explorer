<template>
  <div class="image-preview-overlay" @click.self="closeImagePreview">
    <div class="image-preview-container">
      <slot><img :src="imageUrl" alt="Image Preview" /></slot>
      <div class="header">
        <div
          v-if="closeIconUrl"
          class="icon-wrapper d-flex justify-content-center align-items-center"
          @click="closeImagePreview()"
        >
          <img :src="closeIconUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String,
      default: null,
    },
    closeIconUrl: {
      type: String,
      default: null,
    },
  },
  emits: ["close"],
  methods: {
    closeImagePreview() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(12, 12, 12, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: default;

  .image-preview-container {
    max-width: 90%;
    max-height: 90%;
    img {
      width: auto;
      max-height: 90vh;
    }
    position: relative;
  }

  .header {
    top: 2px;
    right: 2px;
    position: absolute;

    .icon-wrapper {
      background: $primary-color-dark;
      border-radius: 50%;
      padding: 2px;
      cursor: pointer;
    }
  }
}
</style>
