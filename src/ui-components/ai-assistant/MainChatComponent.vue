<template>
  <div
    class="main-chat container h-100 d-flex flex-column justify-content-center align-items-center text-center"
  >
    <div
      class="brand-logo d-flex flex-column align-items-center justify-content-center"
    >
      <img :src="logoImage" :alt="logoTitle + ' logo'" />
    </div>
    <div class="logo-title">{{ logoTitle }}</div>
    <prompt-input
      class="prompt-input"
      placeholder-text="Ask anything..."
      :value="promptInputValue"
      @update:value="updatePromptInputValue"
      @ask-question="askQuestion"
      @audio-question-asked="handleAudioQuestion"
    />
    <prompt-suggestions
      class="prompt-suggestions"
      :prompt-suggestions="promptSuggestions"
      @select-prompt="handleSelectPrompt"
    />
  </div>
</template>

<script>
import PromptInput from "./PromptInput.vue";
import PromptSuggestions from "./PromptSuggestions.vue";
import {
  THREE_RECOMMENDED_QUESTIONS,
  FIVE_RECOMMENDED_QUESTIONS,
} from "@/utils/constants";
import { configMixin } from "@/services/config";

export default {
  name: "MainChatComponent",
  components: { PromptInput, PromptSuggestions },
  mixins: [configMixin],
  data() {
    return {
      promptInputValue: "",
      windowInnerWidth: window?.innerWidth,
    };
  },
  computed: {
    logoImage() {
      return this.appConfig["$logo-graphic-only"];
    },
    logoTitle() {
      return this.appConfig["$logo-title"];
    },
    promptSuggestions() {
      return this.isMobileScreen
        ? THREE_RECOMMENDED_QUESTIONS
        : FIVE_RECOMMENDED_QUESTIONS;
    },
    isMobileScreen() {
      return this.windowInnerWidth < 768;
    },
  },
  emits: ["question-selected"],
  mounted() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    handleWindowResize() {
      this.windowInnerWidth = window.innerWidth;
    },
    updatePromptInputValue(promptInputValue) {
      this.promptInputValue = promptInputValue;
    },
    handleSelectPrompt(selectedPrompt) {
      this.promptInputValue = selectedPrompt;
      this.askQuestion();
    },
    handleAudioQuestion(audioQuestion) {
      this.promptInputValue = audioQuestion;
      this.askQuestion();
    },
    askQuestion(inputValue, files) {
      if (this.promptInputValue.trim() !== "") {
        this.$emit("question-selected", this.promptInputValue, files);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main-chat {
  .logo-title {
    font-size: 24px;
    font-family: $logo-font;
    margin-top: -18px;
  }

  gap: 24px;
  .brand-logo {
    width: 76px;
    height: 76px;
  }
  @media screen and (min-width: 768px) {
    gap: 32px;

    .brand-logo {
      width: 104px;
      height: 104px;
    }
  }

  max-width: 100%;
  @media screen and (min-width: 1024px) {
    max-width: 1024px;
  }
}
</style>
