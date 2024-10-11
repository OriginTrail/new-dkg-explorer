<template>
  <div ref="thinkingRef" class="thinking-component-wrapper">
    <BotIcon />
    <div>
      <div
        v-if="streamedSKAs.length"
        class="knowledge-assets-section-wrapper d-flex flex-wrap gap-2"
      >
        <div class="overused flex-fill pb-2">Source Knowledge Assets</div>
        <div
          class="knowledge-assets-wrapper flex-fill d-flex justify-content-start align-items-center"
        >
          <KnowledgeAssetCard
            v-for="(knowledgeAsset, index) in displayedSourceKnowledgeAssets"
            :key="'sourceKA' + index"
            ref="kaCard"
            :knowledge-asset="knowledgeAsset"
          />
          <MoreCard v-if="leftoverAssetNumber" :number="leftoverAssetNumber" />
        </div>
      </div>
      <div :class="streamedSKAs.length > 0 ? 'thinking-text' : ''">
        <div
          v-if="
            thinkingMessage === THINKING_MESSAGE &&
            !sourceKnowledgeAssets?.length
          "
          class="overused"
        >
          <Transition mode="out-in" name="fade">
            <div v-if="loadingStage >= 0">
              Retrieving Knowledge Assets from the OriginTrail Decentralized
              Knowledge Graph<loading-dots :is-loading="loadingStage === 0" />
            </div>
          </Transition>
          <Transition mode="out-in" name="fade">
            <div v-if="loadingStage === 1">
              Generating an AI-enhanced answer with verifiable
              provenance<loading-dots />
            </div>
          </Transition>
        </div>
        <p
          v-else
          ref="messageRef"
          class="thinking-message overused"
          v-html="sanitizedAnswer"
        ></p>
      </div>
    </div>
  </div>
</template>

<script>
import BotIcon from "./BotIcon.vue";
import LoadingDots from "./LoadingDots.vue";
import KnowledgeAssetCard from "./KA/KnowledgeAssetCard.vue";
import MoreCard from "./KA/MoreCard.vue";
import { THINKING_MESSAGE, MAX_KAS_TO_SHOW } from "@/utils/constants.js";

export default {
  name: "ThinkingComponent",
  components: {
    KnowledgeAssetCard,
    LoadingDots,
    BotIcon,
    MoreCard,
  },
  props: {
    thinkingMessage: {
      type: String,
      default: THINKING_MESSAGE,
    },
    streamedSKAs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      THINKING_MESSAGE,
      maxKAsToShow: 3,
      displayedSourceKnowledgeAssets: [],
      leftoverAssetNumber: 0,
      loadingStage: -1,
    };
  },
  computed: {
    sanitizedAnswer() {
      return this.thinkingMessage
        .replace(
          /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)(?![^(]*\))/g,
          function (match, markdownText, plainUrl) {
            if (markdownText) {
              return (
                '<a href="' +
                plainUrl +
                '" target="_blank">' +
                markdownText +
                "</a>"
              );
            } else {
              return (
                '<a href="' + match + '" target="_blank">' + match + "</a>"
              );
            }
          },
        )
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(
          /\[Color\/(#[0-9A-Fa-f]{3,6}|rgba?\([^\)]*\)|[a-zA-Z]+)\](.*?)\[Color\]/g,
          function (match, color, text) {
            const colorCode = color.toLowerCase();
            return '<span style="color:' + colorCode + '">' + text + "</span>";
          },
        );
    },
  },
  watch: {
    thinkingMessage(newValue, oldValue) {
      if (oldValue === THINKING_MESSAGE) {
        this.$nextTick(() => {
          this.$refs.messageRef?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    },
    streamedSKAs() {
      this.displayedSourceKnowledgeAssets = this.streamedSKAs.slice(
        0,
        MAX_KAS_TO_SHOW,
      );
      this.leftoverAssetNumber =
        this.streamedSKAs.length - this.displayedSourceKnowledgeAssets.length;
    },
  },
  mounted() {
    setTimeout(() => {
      this.loadingStage = 0;
      setTimeout(() => {
        this.loadingStage = 1;
      }, this.generateWaitTime());
    }, 0);

    this.$nextTick(() => {
      this.maxKAsToShow = Math.max(
        1,
        Math.round((this.$refs.thinkingRef?.clientWidth ?? 0) / 220) - 1,
      );
      this.displayedSourceKnowledgeAssets = this.streamedSKAs.slice(0, 3);
      this.leftoverAssetNumber =
        this.streamedSKAs.length - this.displayedSourceKnowledgeAssets.length;
    });
  },
  methods: {
    generateWaitTime() {
      const min = 600;
      const max = 800;
      return Math.floor(Math.random() * (max - min)) + min;
    },
  },
};
</script>

<style lang="scss" scoped>
.thinking-component-wrapper {
  display: flex;
  align-items: flex-start;
  column-gap: 16px;
  padding-bottom: 16px;
  @media screen and (min-width: 1024px) {
    padding-bottom: 24px;
  }

  .knowledge-assets-section-wrapper {
    flex-direction: column;

    .knowledge-assets-wrapper {
      width: 100%;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8px;

      @media screen and (min-width: 1024px) {
        flex-wrap: nowrap;
      }
    }
  }

  .thinking-text {
    margin-top: 32px;
  }
}

.thinking-message {
  margin-top: 8px;
  white-space: pre-line;
  overflow-wrap: anywhere;
  font-size: 16px;
  line-height: 150%;
}

::v-deep(a) {
  color: $secondary-color !important;
}
</style>
