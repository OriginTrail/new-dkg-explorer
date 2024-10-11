<template>
  <div
    class="knowledge-asset-item d-flex justify-content-start align-items-center"
  >
    <div class="knowledge-asset-icon" />
    <div class="knowledge-asset-info">
      <el-tooltip
        :content="formatText(knowledgeAsset.assetName)"
        placement="top"
        effect="dark"
        :auto-close="isSmallDevice ? 2000 : 0"
      >
        <div class="knowledge-asset-name overused mb-1">
          {{ formatText(knowledgeAsset.assetName) }}
        </div>
      </el-tooltip>

      <div class="knowledge-asset-issuer overused">
        Issuer:
        <el-tooltip
          :content="knowledgeAsset.issuerName"
          placement="bottom"
          effect="dark"
          :auto-close="isSmallDevice ? 2000 : 0"
        >
          <a
            class="issuer-name"
            :href="
              DKG_EXPLORER_URL + '/explore?ual=' + knowledgeAsset.issuerUAL
            "
            target="_blank"
            v-if="knowledgeAsset.issuerUAL"
          >
            {{ knowledgeAsset.issuerName }}
          </a>
          <span v-else>{{ knowledgeAsset.issuerName }}</span>
        </el-tooltip>
      </div>
    </div>
    <a
      :href="DKG_EXPLORER_URL + '/explore?ual=' + knowledgeAsset.assetUAL"
      target="_blank"
      style="text-decoration: none"
      v-if="false"
      ><!-- TODO -->
      <button
        v-bind="$attrs"
        class="explorer-btn lg d-flex justify-content-center align-items-center"
      >
        {{ isSmallDevice ? "DKG" : "DKG Explorer" }}
      </button>
    </a>
  </div>
</template>

<script>
import { DKG_EXPLORER_URL } from "@/utils/constants";
import { isSmallDevice } from "@/utils/browserUtils.js";
import { removeQuotes } from "@/utils/stringUtils.js";

export default {
  name: "KnowledgeAssetItemComponent",
  props: {
    knowledgeAsset: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      DKG_EXPLORER_URL,
      isSmallDevice: isSmallDevice(),
    };
  },
  methods: {
    formatText(text) {
      return removeQuotes(text);
    },
  },
};
</script>

<style lang="scss" scoped>
.knowledge-asset-item {
  backdrop-filter: blur(22px);
  background: transparent;
  color: $text-color-light;
  width: 88%;
  gap: 8px;
  padding: 16px 16px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;

  img {
    height: 48px;
  }

  .knowledge-asset-info {
    display: inline-flex;
    flex-direction: column;
    align-items: start;
    width: 240px;
    color: $text-color-light;
    font-size: 14px;
    line-height: 16px;

    .knowledge-asset-name {
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: start;
      max-height: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      line-clamp: 1;
      -webkit-line-clamp: 1;
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

      .issuer-name {
        color: $secondary-color;
        text-decoration: underline;
      }

      @media screen and (max-width: 768px) {
        font-size: 12px;
      }
    }
  }
  .explorer-btn {
    font-size: 14px;
    line-height: 16px;
    font-weight: 600;
    @media screen and (max-width: 768px) {
      font-size: 10px;
      padding: 8px 16px;
    }
    padding: 12px 16px;
    border-radius: 32px;
    border: 1px solid $primary-color-light;
    background: transparent;
    color: $text-color-default;
    text-align: center;

    &:hover {
      background-color: $primary-color-light;
      cursor: pointer;
    }
  }
}
</style>
