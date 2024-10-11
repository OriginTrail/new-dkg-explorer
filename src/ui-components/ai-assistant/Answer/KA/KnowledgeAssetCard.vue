<template>
  <div
    class="knowledge-asset-card d-flex justify-content-start align-items-center"
    @click="viewKnowledgeAsset"
  >
    <div class="knowledge-asset-icon" />
    <div class="knowledge-asset-info">
      <el-tooltip
        :content="formatText(knowledgeAsset.assetName)"
        placement="top"
        effect="dark"
        :disabled="isTouchCapableDevice"
      >
        <div class="knowledge-asset-name overused">
          {{ formatText(knowledgeAsset.assetName) }}
        </div>
      </el-tooltip>
      <div class="knowledge-asset-issuer overused">
        Issuer:
        <el-tooltip
          :content="knowledgeAsset.issuerName"
          placement="bottom"
          effect="dark"
          :disabled="isTouchCapableDevice"
        >
          <span class="overused">
            {{ knowledgeAsset.issuerName }}
          </span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { isTouchCapableDevice } from "@/utils/browserUtils";
import { removeQuotes } from "@/utils/stringUtils";

export default {
  name: "KnowledgeAssetCardComponent",
  props: {
    knowledgeAsset: {
      type: Object,
      required: true,
    },
  },
  emits: ["ka-click"],
  data() {
    return {
      isTouchCapableDevice: isTouchCapableDevice(),
    };
  },
  methods: {
    viewKnowledgeAsset() {
      this.$emit(
        "ka-click",
        this.knowledgeAsset.assetUAL,
        this.knowledgeAsset.chunk,
      );
    },
    formatText(text) {
      return removeQuotes(text);
    },
  },
};
</script>

<style lang="scss" scoped>
.knowledge-asset-card {
  flex-direction: row;
  min-width: 100%;
  height: 64px;
  padding: 8px;
  gap: 8px;
  border-radius: 16px;
  border: 1px solid $primary-color-light;
  backdrop-filter: blur(22px);
  background: $primary-color-dark;
  color: $text-color-default;

  &:hover {
    background-color: $primary-color-light;
    cursor: pointer;
  }

  @media screen and (min-width: 1024px) {
    width: 184px;
    min-width: unset;
  }

  @media screen and (min-width: 1440px) {
    width: 220px;
  }

  .knowledge-asset-info {
    display: inline-flex;
    flex-direction: column;
    align-items: start;
    gap: 8px;

    font-size: 12px;
    line-height: 16px;

    .knowledge-asset-name {
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: start;
      max-height: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      z-index: 20;
    }

    .knowledge-asset-issuer {
      align-self: stretch;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 400;
      text-align: start;
      max-height: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      line-clamp: 1;
      -webkit-line-clamp: 1;
    }
  }

  img {
    height: 48px;
  }
}
</style>
