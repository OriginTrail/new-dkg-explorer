<template>
  <div
    ref="answerWrapper"
    class="answer-component-wrapper"
    :class="{ 'no-bottom-border': isLatestAnswer }"
  >
    <div ref="answerSide" class="answer-side">
      <BotIcon />
      <div ref="answerSectionRef" class="answer-section d-flex">
        <div
          v-if="sourceKnowledgeAssets.length"
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
              @ka-click="handleKAClick"
            />
            <MoreCard
              v-if="leftoverAssetNumber"
              :number="leftoverAssetNumber"
              @click="viewAllKnowledgeAssets"
            />
          </div>
        </div>
        <div
          v-if="answer"
          class="answer-body overused"
          v-html="sanitizedAnswer"
        ></div>
        <div v-if="files" class="download-file-buttons d-flex">
          <download-button-component
            :csvContent="files.safeCsv"
            fileName="safeVideosCSV"
            buttonText="Download Verified Safe list"
            type="safe"
          ></download-button-component>
          <download-button-component
            :csvContent="files.csamCsv"
            fileName="csamVideosCSV"
            buttonText="Download CSAM List"
            type="unsafe"
          ></download-button-component>
          <download-button-component
            :csvContent="files.allCsv"
            fileName="allVideosCSV"
            buttonText="Download entire labeled List"
            type="neutral"
          ></download-button-component>
        </div>
        <div
          v-if="!error"
          class="copy-share-section d-flex justify-content-end align-items-center"
          :class="{ latest: isLatestAnswer }"
        >
          <copy-text-button :text-to-copy="answer" copy-text="Copy answer">
            <img src="/images/chatdkg/icons/copy.svg" />
          </copy-text-button>
        </div>
        <div v-if="tableData && tableData.length > 0" class="answer-table">
          <TableComponent :table-data="tableData" />
        </div>
        <div
          v-if="images && images?.length"
          ref="carouselContainerRef"
          class="carousel-container"
        >
          <div ref="sliderContainer" :class="isSliderDisabled">
            <div class="answer-images">
              <el-scrollbar
                ref="carouselScrollbarRef"
                v-dragscroll.x="{
                  target: '.el-scrollbar__wrap',
                  active: !isImagePreviewOpen && mouseOverScrollBar,
                }"
                class="carousel-scrollbar"
                @dragscrollmove="addGrabbingClass()"
                @dragscrollend="removeGrabbingClass"
                @dragend="removeGrabbingClass"
                @mouseleave="setMouseStatusOverScrollbar(false)"
                @mouseenter="setMouseStatusOverScrollbar(true)"
              >
                <div
                  v-for="(image, index) in images"
                  :key="'image' + index"
                  class="card-type-2 image-wrapper"
                  :class="
                    images.length > 1 ? 'drag-slider-card fixed-width' : ''
                  "
                  @click.stop="openImagePreview(image)"
                  @dragend="removeGrabbingClass"
                  @dragstart="stopImageDragging"
                >
                  <img :src="image.url" :alt="image.name" />
                  <div v-if="image.artwork" class="image-overlay">
                    <h4 class="overused artwork-name">
                      {{ formatArtworkInfo(image.artworkName) }}
                    </h4>
                    <div class="overused artwork-author">
                      {{ formatArtworkInfo(image.authorName) }}
                    </div>
                  </div>
                </div>
                <ImagePreview
                  v-if="isImagePreviewOpen && !selectedImage.artwork"
                  :image-url="selectedImage.url"
                  @close="closeImagePreview"
                />
                <ImagePreview
                  v-if="isImagePreviewOpen && selectedImage.artwork"
                  close-icon-url="/images/chatdkg/icons/close.svg"
                  @close="closeImagePreview"
                >
                  <div
                    class="carousel-image-preview-container"
                    v-if="selectedImage"
                  >
                    <div class="image-cover">
                      <img
                        class="head-image"
                        :src="selectedImage.url"
                        :alt="selectedImage.name"
                      />
                    </div>
                    <div class="preview-asset-info-wrapper">
                      <KnowledgeAssetItem
                        class="preview-asset"
                        v-if="selectedImage.assetName"
                        :knowledgeAsset="{
                          assetName: selectedImage.assetName,
                          issuerName: selectedImage.issuerName,
                          assetUAL: selectedImage.assetUAL,
                          issuerUAL: selectedImage.issuerUAL,
                        }"
                      />
                      <div v-if="selectedImage.artwork" class="preview-info">
                        <el-scrollbar class="artwork-info-scrollbar">
                          <div class="info-item">
                            <div class="title overused">
                              <b>Artwork Name</b>
                            </div>
                            <div class="value overused">
                              {{ formatArtworkInfo(selectedImage.artworkName) }}
                            </div>
                          </div>
                          <div class="info-item">
                            <div class="title overused">
                              <b>Artist</b>
                            </div>
                            <div class="value overused">
                              {{ formatArtworkInfo(selectedImage.authorName) }}
                            </div>
                          </div>
                          <div class="info-item">
                            <div class="title overused">
                              <b>Description</b>
                            </div>
                            <div class="value overused">
                              {{ selectedImage.description }}
                            </div>
                          </div>
                          <div class="info-item">
                            <div class="title overused">
                              <b>Artform</b>
                            </div>
                            <div class="value overused">
                              {{ formatArtworkInfo(selectedImage.artform) }}
                            </div>
                          </div>
                        </el-scrollbar>
                      </div>
                    </div>
                  </div>
                </ImagePreview>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div v-if="videos && videos.length" class="answer-videos">
          <div
            v-for="(video, index) in cleanVideos(videos)"
            :key="'video' + index"
            class="video-wrapper"
          >
            <iframe
              :src="video.url"
              frameborder="0"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div v-if="coordinates?.length > 0" class="trail-map-wrapper">
          <div class="expand-button" @click="isTrailMapOpen = true">
            <img src="/images/chatdkg/icons/expand-map-icon.svg" />
          </div>
          <TrailMap
            :stops="coordinates?.length === 1 ? coordinates : []"
            :coordinates="coordinates"
            :initial-zoom="9"
            :map-id="'map' + answerIndex"
          />
        </div>
        <div
          v-if="getSentimentScore"
          class="half-circle-sentiment-gage half-circle-wrapper"
        >
          <half-circle-chart :value="getSentimentScore" />
        </div>
        <div v-if="chartData" class="charts-wrapper">
          <LineCharts :chart-data="chartData" :chart-options="chartOptions" />
        </div>
        <ImagePreview
          v-if="isTrailMapOpen"
          class="map-preview"
          :image-url="null"
          @close="closeTrailMapPreview"
        >
          <TrailMap
            v-if="isTrailMapOpen && coordinates?.length > 0"
            :map-id="'previewMap' + answerIndex"
            class="preview-map"
            :stops="coordinates?.length === 1 ? coordinates : []"
            :coordinates="coordinates"
            :initial-zoom="9"
          />
        </ImagePreview>

        <PromptSuggestions
          v-if="isLatestAnswer"
          class="prompt-suggestions"
          :prompt-suggestions="followUpPromptSuggestions"
          @select-prompt="handleSelectPrompt"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { dragscroll } from "vue-dragscroll";
import PromptSuggestions from "./PromptSuggestions.vue";
import BotIcon from "./Answer/BotIcon.vue";
import ImagePreview from "./Answer/ImagePreview.vue";
import TrailMap from "./Answer/TrailMap.vue";
import TableComponent from "./Answer/TableComponent.vue";
import LineCharts from "./Answer/LineCharts.vue";
import HalfCircleChart from "./Answer/HalfCircleChart.vue";
import KnowledgeAssetCard from "./Answer/KA/KnowledgeAssetCard.vue";
import KnowledgeAssetItem from "./Answer/KA/KnowledgeAssetItem.vue";
import MoreCard from "./Answer/KA/MoreCard.vue";
import CopyTextButton from "./Answer/CopyTextButton.vue";
import { MAX_KAS_TO_SHOW } from "@/utils/constants.js";
import { removeQuotes } from "@/utils/stringUtils.js";
import DownloadButtonComponent from "../edge-node/single-components/DownloadButtonComponent.vue";

export default {
  name: "AnswerComponent",
  directives: {
    dragscroll,
  },
  components: {
    BotIcon,
    HalfCircleChart,
    LineCharts,
    TrailMap,
    PromptSuggestions,
    ImagePreview,
    TableComponent,
    KnowledgeAssetCard,
    CopyTextButton,
    KnowledgeAssetItem,
    DownloadButtonComponent,
    MoreCard,
  },
  props: {
    answer: {
      type: String,
      required: true,
    },
    files: {
      type: Object,
      default: () => {},
    },
    tableData: {
      type: Array,
      default: null,
    },
    images: {
      type: Array,
      default: null,
    },
    videos: {
      type: Array,
      default: null,
    },
    followUpPromptSuggestions: {
      type: Array,
      default: null,
    },
    sourceKnowledgeAssets: {
      type: Array,
      default: null,
    },
    isLatestAnswer: {
      type: Boolean,
      required: true,
    },
    error: {
      type: Boolean,
      default: false,
    },
    coordinates: {
      type: Array,
      default: () => [],
    },
    chartData: {
      type: Object,
      default: null,
    },
    chartOptions: {
      type: Object,
      default: () => ({
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: "category",
            ticks: {
              autoSkip: true,
              autoSkipPadding: 50,
            },
          },
          y: {
            title: { display: true, text: "°C", minRotation: 90 },
          },
        },
      }),
    },
    answerIndex: {
      type: Number,
      default: 0,
    },
    answerMaxHeight: {
      type: Number,
      default: 0,
    },
    sentimentScore: {
      type: Number,
      default: 0,
    },
  },
  emits: ["select-prompt", "open-ka-list"],
  data() {
    return {
      isImagePreviewOpen: false,
      isTrailMapOpen: false,
      selectedImage: {},
      maxAnswerHeight: Infinity,
      displayedSourceKnowledgeAssets: [],
      leftoverAssetNumber: 0,
      mouseOverScrollBar: false,
      isDraggingCarousel: false,
    };
  },
  computed: {
    sanitizedAnswer() {
      return this.answer
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
    getSentimentScore() {
      return this.sentimentScore != null &&
        typeof this.sentimentScore !== "undefined"
        ? this.sentimentScore
        : null;
    },
    isSliderDisabled() {
      const maxVisibleImages = window.innerWidth < 1024 ? 1 : 2;
      return this.images && this.images.length <= maxVisibleImages
        ? "disable-scroll"
        : "";
    },
  },
  watch: {
    answerMaxHeight(n) {
      this.maxAnswerHeight = n;
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleWindowResize);
    this.maxAnswerHeight = this.$refs.answerWrapper.offsetHeight;
    this.displayedSourceKnowledgeAssets = this.sourceKnowledgeAssets.slice(
      0,
      MAX_KAS_TO_SHOW,
    );
    this.leftoverAssetNumber =
      this.sourceKnowledgeAssets.length -
      this.displayedSourceKnowledgeAssets.length;
    this.handleWindowResize();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    handleWindowResize() {
      if (this.$refs.carouselContainerRef) {
        const width = this.$refs.answerSide.clientWidth - 64;
        this.$refs.carouselContainerRef.style.width = `${width}px`;
      }
    },
    handleSelectPrompt(selectedPrompt) {
      this.$emit("select-prompt", selectedPrompt);
    },
    openImagePreview(image) {
      if (!this.isDraggingCarousel) {
        this.selectedImage = image;
        this.isImagePreviewOpen = true;
      }
    },
    closeImagePreview() {
      this.isImagePreviewOpen = false;
    },
    closeTrailMapPreview() {
      this.isTrailMapOpen = false;
    },
    handleKAClick(clickedAssetUal, clickedAssetChunk) {
      clickedAssetChunk
        ? this.$emit(
            "open-ka-list",
            this.sourceKnowledgeAssets,
            clickedAssetUal,
          )
        : this.$emit("open-ka-list", this.sourceKnowledgeAssets);
    },
    viewAllKnowledgeAssets() {
      this.$emit("open-ka-list", this.sourceKnowledgeAssets);
    },
    cleanVideos(videos) {
      return videos.map(({ url }) => {
        let cleanUrl = url;
        if (cleanUrl.includes("&t")) {
          cleanUrl = cleanUrl.replace(/(&t=\w+)|(")/g, "");
        }
        cleanUrl = cleanUrl.replace(/"/g, "");
        return { url: cleanUrl };
      });
    },
    addGrabbingClass() {
      if (this.mouseOverScrollBar) {
        this.$refs.carouselScrollbarRef.$el.children[0].classList.add(
          "grabbing",
        );
      }
    },
    removeGrabbingClass() {
      this.$refs.carouselScrollbarRef.$el.children[0].classList.remove(
        "grabbing",
      );
      setTimeout(() => {
        this.isDraggingCarousel = false;
      }, 10);
    },
    startDragging() {
      this.isDraggingCarousel = true;
    },
    stopImageDragging(event) {
      this.startDragging();
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    },
    setMouseStatusOverScrollbar(status) {
      this.mouseOverScrollBar = status;
    },
    formatArtworkInfo(text) {
      return removeQuotes(text);
    },
  },
};
</script>

<style lang="scss" scoped>
.answer-component-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  .preview-map {
    max-height: 90vh;
    height: 100%;
    width: 90vw;
  }
  &.no-bottom-border {
    border-bottom: none;
  }

  @media screen and (min-width: 992px) {
    flex-direction: row;
    column-gap: max(6%, 40px);
  }

  .answer-side {
    width: 100%;
    display: flex;
    column-gap: 16px;

    .answer-section {
      min-width: 0;
      width: 100%;
      flex-direction: column;
      gap: 16px;

      ::v-deep(a) {
        color: $secondary-color;
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

      .answer-body {
        margin-top: 8px;
        white-space: pre-line;
        overflow-wrap: anywhere;
        font-size: 16px;
        line-height: 150%;
      }

      .copy-share-section.latest {
        margin: -16px 0;
      }

      .answer-table {
        overflow-y: auto;
        width: 100%;
        max-width: 100%;
        margin-bottom: 16px;
      }

      .answer-videos {
        margin: 16px 0;
        .video-wrapper {
          iframe {
            border-radius: 8px;
            width: 100%;
            height: 300px;
          }
        }
      }

      .carousel-container {
        @media screen and (min-width: 612px) {
          max-width: 512px;
        }
        @media screen and (min-width: 1024px) {
          max-width: 704px;
        }
        @media screen and (min-width: 1440px) {
          max-width: 804px;
        }
        .answer-images {
          display: flex;
          row-gap: 8px;
          column-gap: 10px;
          margin-top: 30px;
          align-items: center;

          .image-wrapper {
            border-radius: 8px;
            position: relative;
            overflow: hidden;

            .artwork-name,
            .artwork-author {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              min-width: 0;
            }
            .artwork-name {
              font-weight: 700;
              font-size: 20px;
              line-height: 26px;
              @media screen and (min-width: 1280px) {
                font-size: 24px;
                line-height: 30px;
              }
            }
            .artwork-author {
              font-size: 16px;
              line-height: 16px;
            }

            &:hover {
              cursor: pointer;
            }

            .card-type-1 {
              img {
                margin-bottom: 30px;
              }
            }
            .card-type-2 {
              margin-right: 16px;
            }

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              max-width: 300px;
              max-height: 300px;
            }

            .image-overlay {
              position: absolute;
              display: flex;
              flex-direction: column;
              bottom: 0;
              background: rgba(0, 0, 0, 0.8); /* Black see-through */
              color: $text-color-default;
              width: 100%;
              padding: 12px 12px 16px 12px;
              text-align: left;
            }
          }

          .fixed-width {
            width: 300px;
            height: 300px;
          }
        }
      }

      .trail-map-wrapper {
        position: relative;
        .expand-button {
          z-index: 9998;
          top: 12px;
          right: 12px;
          position: absolute;
          padding: 6px;
          img {
            width: 48px;
            height: 48px;
          }
          &:hover {
            cursor: pointer;
          }
        }
      }
      .half-circle-wrapper {
        position: relative;
      }
      .half-circle-sentiment-gage {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      :deep(.map-preview) {
        .image-preview-container {
          height: 100%;
        }
      }
    }
  }

  .disable-scroll {
    overflow: hidden;
    justify-content: flex-start;
    align-items: center;
    display: flex;
  }
}

.carousel-scrollbar {
  width: 100%;
}

:deep(.carousel-scrollbar) {
  .el-scrollbar__wrap {
    cursor: grab;
  }
  .el-scrollbar__view {
    display: flex;
    gap: 24px;
    width: max-content;
    max-height: fit-content !important;
  }
  .el-scrollbar__thumb {
    opacity: 1;
  }
  .el-scrollbar__bar {
    margin-left: 0px !important;
  }
}

.image-preview-overlay {
  :deep(.image-preview-container) {
    overflow-y: auto;
    .carousel-image-preview-container {
      width: 100%;
      border-radius: 8px;

      .image-cover {
        height: 385px;
        overflow: hidden;
        border-radius: 8px 8px 0px 0px;
        img {
          background-color: $primary-color-dark;
          object-fit: cover;
          height: 100%;
          width: 100%;
          object-position: center center;
        }
        @media screen and (min-width: 768px) {
          height: 485px;
        }
        @media screen and (min-width: 768px) and (max-height: 900px) {
          height: 40vh;
        }
      }
      .head-image {
        width: 100%;
      }
      .preview-asset-info-wrapper {
        padding: 24px;
        background: $primary-color-dark;
        display: flex;
        gap: 24px;
        flex-direction: column;
        height: 200px;
        border-radius: 0px 0px 8px 8px;

        @media screen and (min-width: 768px) {
          height: 240px;
        }
      }
      .preview-asset {
        width: 100%;

        button {
          padding: 12px 16px;
          @media screen and (min-width: 768px) {
            margin-left: 44px;
          }
        }
      }
      .preview-info {
        padding-top: 0px;
        display: flex;
        flex-direction: column;
        color: $text-color-default;
        gap: 16px;

        .info-item {
          display: flex;
          gap: 16px;
          .title {
            flex-shrink: 0;
            flex-basis: 122px;
            text-align: right;
            font-size: 16px;
            line-height: 16px;
          }
          .value {
            text-align: left;
            max-width: 360px;
            font-size: 14px;
            line-height: 14px;
          }
        }
      }
    }

    @media screen and (min-width: 768px) {
      width: 558px;
    }
  }
}

:deep(.artwork-info-scrollbar) {
  .el-scrollbar__wrap {
    max-height: 80px;

    @media screen and (min-width: 768px) {
      max-height: 120px;
    }
  }
  .el-scrollbar__view {
    display: flex;
    gap: 24px;
    width: 100%;
    flex-direction: column;
  }
  .el-scrollbar__thumb {
    opacity: 1;
  }
}
</style>
