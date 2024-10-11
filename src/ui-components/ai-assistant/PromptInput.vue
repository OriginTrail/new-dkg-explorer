<template>
  <div class="prompt-input-wrapper d-flex align-items-center w-100">
    <input
      v-model="inputValue"
      type="text"
      class="input flex-grow-1 overused"
      :placeholder="inputPlaceholder"
      :disabled="shouldDisableInput"
      @input="handleInput"
      @keyup.enter="askQuestionOnEnter"
    />

    <VoiceRecorder
      :input-disabled="shouldDisableInput"
      @audio-recorded="handleAudioRecorded"
      @recording-status="handleRecordingStatus"
    />

    <prompt-submit-button @click="askQuestion" />
  </div>
</template>

<script>
import VoiceRecorder from "./PromptInput/VoiceRecorder.vue";
import PromptSubmitButton from "./PromptInput/PromptSubmitButton.vue";
import { VOICE_RECORDING_STATUS_LABEL } from "@/utils/constants.js";

export default {
  name: "PromptInput",
  components: { VoiceRecorder, PromptSubmitButton },
  props: {
    placeholderText: {
      type: String,
      default: "Ask anything...",
    },
    value: {
      type: String,
      default: "",
    },
    shouldDisableInput: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:value", "ask-question", "audio-question-asked"],
  data() {
    return {
      inputValue: this.value,
      inputPlaceholder: this.placeholderText,
      isDragging: false,
    };
  },
  watch: {
    value(newValue) {
      this.inputValue = newValue;
    },
    placeholderText(newValue) {
      this.inputPlaceholder = newValue;
    },
  },
  methods: {
    handleInput() {
      this.$emit("update:value", this.inputValue);
    },
    askQuestion() {
      this.$emit("ask-question", this.inputValue);
    },
    askQuestionOnEnter() {
      if (this.inputValue.trim() !== "") {
        this.askQuestion();
      }
    },
    handleAudioRecorded(question) {
      this.$emit("audio-question-asked", question);
    },
    handleRecordingStatus(status) {
      this.inputPlaceholder =
        VOICE_RECORDING_STATUS_LABEL[status] ?? this.placeholderText;
    },
  },
};
</script>

<style lang="scss" scoped>
.prompt-input-wrapper {
  height: 72px;
  position: relative;
  @media screen and (max-width: 767px) {
    height: 56px;
  }

  border-radius: 100px;
  border: 1px solid $primary-color-light;
  background-color: $background-color;
  gap: 8px;
  padding: 8px;
  padding-left: 24px;
  font-size: 16px;
  line-height: 16px;

  .video-icon {
    width: 36px;
  }

  input {
    border: 0;
    outline: 0;
    padding: 8px;
    padding-left: 0px;
    background: transparent;
    color: $text-color-default;
    text-overflow: ellipsis;

    &:focus {
      outline: 0;
    }

    &:disabled {
      opacity: 1;
    }

    &::placeholder {
      color: $text-color-dark;
      opacity: 1;

      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      font-feature-settings:
        "clig" off,
        "liga" off;
    }
  }

  .attach-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
}

.drag-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: inherit;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
}
</style>
