<template>
  <div class="voice-recorder-wrapper">
    <div v-if="isRecording || isConvertingVoiceToText" class="counter">
      <span v-if="isRecording">
        {{ formatDuration(recordingDuration) }}
      </span>
      <span
        class="loading-indicator"
        :class="{ active: isConvertingVoiceToText }"
      >
        <img src="/images/chatdkg/icons/chatdkg-spinner.svg" alt="" />
      </span>
    </div>
    <el-tooltip
      :visible="recordTooltipVisibility"
      :show-arrow="false"
      placement="top"
      effect="light"
      popper-class="header-tooltip"
    >
      <template #content>
        <div><b>Hold to record</b></div>
      </template>

      <microphone-icon
        class="microphone-icon"
        :with-background="isRecording"
        :class="{
          disabled: isConvertingVoiceToText || inputDisabled,
          safari: isSafari,
        }"
        @mousedown.stop.capture="startRecordingOnClick"
        @mouseup.stop.capture="stopRecording"
        @mouseleave.stop.capture="stopRecording"
        @touchstart.stop.capture="startRecordingOnHold"
        @touchend.stop.capture="stopRecording"
        @contextmenu.stop.prevent.capture="stopEventPropagation"
      />
    </el-tooltip>
  </div>
</template>

<script>
import axios from "axios";
import MicrophoneIcon from "./MicrophoneIcon.vue";
import { isSafari, isTouchCapableDevice } from "@/utils/browserUtils.js";
import { VOICE_RECORDING_STATUS } from "@/utils/constants.js";
import { configMixin } from "@/services/config";

export default {
  name: "VoiceRecorder",
  components: { MicrophoneIcon },
  mixins: [configMixin],
  props: {
    inputDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["audio-recorded", "recording-status"],
  data() {
    return {
      isRecording: false,
      isConvertingVoiceToText: false,
      isHolding: false,
      isSafari: isSafari(),
      safariPermissionsGained: false,
      recordTooltipVisibility: false,
      recordingDuration: 0,
      timer: null,
      chunks: [],
    };
  },
  methods: {
    startRecording() {
      if (!isTouchCapableDevice() && this.isRecording) {
        this.saveAudio();
        this.clearRecordingInfo();
        return;
      }

      this.clearRecordingInfo();
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          const doSetSafariPermissions =
            isSafari() &&
            isTouchCapableDevice() &&
            !this.safariPermissionsGained;
          if (doSetSafariPermissions) {
            if (isSafari() && isTouchCapableDevice()) {
              this.safariPermissionsGained = true;
            }
          }
          if (
            (isTouchCapableDevice() && !this.isHolding) ||
            doSetSafariPermissions
          ) {
            this.shoRecordButtonHoldTooltip();
            throw "not holding anymore";
          }

          this.$emit("recording-status", VOICE_RECORDING_STATUS.RECORDING);
          this.timer = setInterval(() => {
            this.recordingDuration++;
          }, 1000);
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.chunks.push(event.data);
            }
          };
          this.mediaRecorder.addEventListener("dataavailable", (event) => {
            this.onRecordingStop(event.data);
          });
          this.mediaRecorder.start();
          this.isRecording = true;
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error("Error accessing the microphone:", err);
          this.$emit("recording-status", VOICE_RECORDING_STATUS.FINISHED);
          this.clearRecordingInfo();
        });
    },
    startRecordingOnClick() {
      if (!isTouchCapableDevice()) {
        this.startRecording();
      } else {
        if (!this.isHolding) {
          this.shoRecordButtonHoldTooltip();
        }
      }
    },
    startRecordingOnHold() {
      if (isTouchCapableDevice()) {
        this.isHolding = true;
        this.startRecording();
      }
    },
    clearRecordingInfo() {
      clearInterval(this.timer);
      this.recordingDuration = 0;
      this.isRecording = false;
    },
    stopRecording() {
      if (isTouchCapableDevice()) {
        this.saveAudio();
        this.clearRecordingInfo();
        this.isHolding = false;
      }
    },
    shoRecordButtonHoldTooltip() {
      this.recordTooltipVisibility = true;
      setTimeout(() => {
        this.recordTooltipVisibility = false;
      }, 1000);
    },
    releaseMicrophone() {
      //stop all tracks to release the microphone access
      const streamTracks = this.mediaRecorder.stream.getTracks();
      streamTracks.forEach((e) => e.stop());
    },
    async onRecordingStop(blobData) {
      this.releaseMicrophone();
      this.$emit("recording-status", VOICE_RECORDING_STATUS.PROCESSING);
      this.isConvertingVoiceToText = true;

      const formData = new FormData();
      formData.append("wavFile", blobData, "audio.wav");
      formData.append("isSafari", isSafari());
      axios
        .post(`${this.endpoints.dRAG}/server/api/audio`, formData, {
          withCredentials: true,
        })
        .then(({ question }) => {
          this.$emit("audio-recorded", question);
          this.$emit("recording-status", VOICE_RECORDING_STATUS.FINISHED);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
          // add error indicator
          this.$emit("recording-status", VOICE_RECORDING_STATUS.FINISHED);
          throw Error(err.message);
        })
        .finally(() => {
          this.isConvertingVoiceToText = false;
        });
    },
    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
      const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
      return `${minutes}:${remainingSeconds}`;
    },
    saveAudio() {
      // Save audio logic (generate audio file and attach to API request)
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.isRecording = false;
      }
    },
    stopEventPropagation(event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.returnValue = false;
      event.cancelBubble = false;
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.voice-recorder-wrapper {
  display: flex;
  column-gap: 8px;
  user-select: none;

  .counter {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;
    width: 76px;
    border-radius: 100px;
    background-color: $text-color-default;
    color: $primary-color-dark;
    font-size: 14px;
    font-weight: 400;
    line-height: 150%;
  }

  .loading-indicator {
    display: none;
    animation: rotate 1.5s linear infinite;

    &.active {
      display: block;
    }
  }

  .microphone-icon {
    width: 48px;
    height: 48px;
    @media screen and (min-width: 768px) {
      width: 56px;
      height: 56px;
    }

    z-index: 8;
    position: relative;
    &.safari {
      -webkit-user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent;
      -moz-user-select: -moz-none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    cursor: pointer;
    &.disabled {
      opacity: 0.5;
      pointer-events: none;
      cursor: not-allowed;
    }
  }
}
</style>
