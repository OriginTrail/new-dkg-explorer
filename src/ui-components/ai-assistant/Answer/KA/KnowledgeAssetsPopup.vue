<template>
  <div
    class="popup-backdrop d-flex justify-content-center align-items-center"
    @click="closePopup"
  >
    <div class="popup d-flex align-items-start" @click.stop>
      <div class="close-section d-flex justify-content-end align-items-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="close-icon"
          @click="closePopup"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.7073 6.70726L19.4144 6.00015L18.0002 4.58594L17.293 5.29304L12.0002 10.5859L6.70726 5.29304L6.00015 4.58594L4.58594 6.00015L5.29304 6.70726L10.5859 12.0002L5.29304 17.293L4.58594 18.0002L6.00015 19.4144L6.70726 18.7073L12.0002 13.4144L17.293 18.7073L18.0002 19.4144L19.4144 18.0002L18.7073 17.293L13.4144 12.0002L18.7073 6.70726Z"
          />
        </svg>
      </div>
      <el-collapse v-model="activeItems" class="knowledge-asset-list d-flex">
        <el-scrollbar class="custom-scrollbar">
          <el-collapse-item
            v-for="asset in sourceKnowledgeAssets"
            :disabled="!asset.chunk"
            :key="asset.assetUAL"
            :ref="asset.assetUAL"
            :name="asset.assetUAL"
            class="list-item"
          >
            <template #title>
              <KnowledgeAssetItem :knowledge-asset="asset"></KnowledgeAssetItem>
            </template>

            <div v-if="asset.chunk" class="description overused">
              <el-scrollbar class="chunk-scrollbar">
                <div
                  v-for="(chunk, index) in asset.chunk.split('\n\n\n\n')"
                  :key="asset.defaultIdentifier + '' + index"
                  class="chunk"
                >
                  <a
                    v-if="asset.defaultIdentifier"
                    class="chunk-name overused"
                    :href="asset.defaultIdentifier"
                    target="_blank"
                    >{{ asset.assetName }}</a
                  >
                  <p v-else class="chunk-name overused">
                    {{ asset.assetName }}
                  </p>
                  <p v-html="sanitizeChunk(chunk)" class="overused"></p>
                </div>
              </el-scrollbar>
            </div>
          </el-collapse-item>
        </el-scrollbar>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { scrollIntoView } from "seamless-scroll-polyfill";
import KnowledgeAssetItem from "./KnowledgeAssetItem.vue";

export default {
  name: "KnowledgeAssetsPopupComponent",
  components: {
    KnowledgeAssetItem,
  },
  props: {
    sourceKnowledgeAssets: {
      type: Array,
      required: true,
    },
    expanded: {
      type: String,
      default: "",
    },
  },
  emits: ["close"],
  data() {
    return {
      activeItems: [],
    };
  },
  mounted() {
    if (this.expanded) {
      this.activeItems = [this.expanded];

      this.$nextTick(() => {
        scrollIntoView(this.$refs[this.expanded][0].$el, {
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      });
    }
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    sanitizeChunk(chunk) {
      return chunk
        .replace(
          /(https?:\/\/[^\s)]+)(?![^(]*\))/g,
          '<a href="$1" target="_blank">$1</a>',
        )
        .replace(
          /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
          '<a href="$2" target="_blank">$1</a>',
        )
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/(;)(Location:)/g, "\n$2")
        .replace(/(;)(Start Date:)/g, "\n$2");
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.popup {
  flex-direction: column;
  flex-shrink: 0;
  background-color: $primary-color-dark;
  width: 360px;
  height: 500px;
  border-radius: 16px;
  overflow: hidden;

  @media screen and (min-width: 768px) {
    width: 600px;
  }
  @media screen and (min-width: 1024px) {
    width: 800px;
  }
  @media screen and (min-width: 1440px) {
    width: 900px;
    height: 560px;
  }

  .close-section {
    width: 100%;
    position: sticky;
    background-color: $primary-color-dark;
    padding: 8px;
    z-index: 2;
    top: 0;

    .close-icon {
      fill: $secondary-color;
      &:hover {
        cursor: pointer;
      }
    }
  }

  .knowledge-asset-list {
    padding: 12px 0;
    width: 100%;
    flex-direction: column;
    gap: 24px;
    overflow: auto;
    height: 100%;
    border: none;
  }

  .list-item {
    width: 100%;
    list-style-type: none;

    & > * {
      height: 100%;
      border: none;
    }

    border-radius: 16px;
    border: 1px solid $secondary-color;
    overflow: hidden;
  }
}

.description {
  text-align: left;
  line-height: 150%;
  text-wrap: wrap;
  white-space: pre-wrap;
  overflow: auto;
  max-height: 298px;
  font-size: 12px;
  line-height: 16px;

  .chunk {
    font-size: 16px;
    line-height: 16px;
    &:nth-child(n + 2) {
      padding-top: 16px;
      border-top: 1px solid $primary-color;
    }

    ::v-deep(a) {
      color: $secondary-color;
    }
    .chunk-name {
      color: $text-color-default;
    }

    p {
      margin-top: 8px;
      line-height: 150%;
      @media screen and (max-width: 768px) {
        font-size: 12px;
      }
    }
  }
}

:deep(.el-collapse-item__content) {
  padding: 0 16px 16px 16px;
}

:deep(.el-collapse-item__arrow) {
  margin-right: 16px;
  fill: $secondary-color;
  color: $secondary-color;
}

:deep(.custom-scrollbar) {
  padding: 0 24px;
  .el-scrollbar__view {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .el-scrollbar__thumb {
    opacity: 1;
  }
  .el-scrollbar__bar {
    margin-right: 5px;
  }
}

:deep(.chunk-scrollbar) {
  .el-scrollbar__wrap {
    margin-right: 20px;
  }
  .el-scrollbar__view {
    max-height: 298px;
  }
  .el-scrollbar__thumb {
    opacity: 1;
  }
}
</style>
