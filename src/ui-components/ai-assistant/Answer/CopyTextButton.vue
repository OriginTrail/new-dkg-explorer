<template>
  <el-tooltip
    :disabled="!textToCopy"
    placement="top"
    :content="isCopied ? copiedText : copyText"
    effect="dark"
    :auto-close="isTouchCapableDevice ? 800 : 0"
  >
    <button
      type="icon"
      :size="buttonSize"
      class="copy-share-icon-wrapper btn"
      @click.stop="copy(textToCopy)"
    >
      <slot> </slot>
    </button>
  </el-tooltip>
</template>

<script>
import { isTouchCapableDevice } from "@/utils/browserUtils";

export default {
  name: "CopyTextButton",
  props: {
    copyText: {
      type: String,
      default: "Copy answer",
    },
    copiedText: {
      type: String,
      default: "Copied!",
    },
    textToCopy: {
      type: String,
      default: null,
    },
    buttonSize: {
      type: String,
      default: "mini",
    },
  },
  data() {
    return {
      isCopied: false,
      isTouchCapableDevice: isTouchCapableDevice(),
    };
  },
  methods: {
    copy(textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.isCopied = true;
        setTimeout(() => {
          this.isCopied = false;
        }, 800);
      });
    },
  },
};
</script>

<style scoped>
button:focus {
  box-shadow: none;
}
</style>
