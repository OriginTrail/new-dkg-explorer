<template>
  <div class="file-editor">
    <div class="line-count">
      <span
        v-for="line in lineCount"
        :key="line"
        :class="{ active: line === activeLine }"
      >
        {{ line }}
      </span>
    </div>
    <textarea
      ref="inputRef"
      v-model="text"
      @keydown="keyPressed"
      @mousedown="updateActiveLine"
      @focusout="finishedEdit"
      :rows="lineCount"
      :readonly="readonly"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["edit-finished"],
  data() {
    return {
      text: this.value,
      activeLine: null,
    };
  },
  computed: {
    lineCount() {
      let lineCount = 1;
      for (let i = 0; i < this.text.length; i++)
        if (this.text[i] === "\n") lineCount++;

      return lineCount;
    },
  },
  watch: {
    value(newVal) {
      this.text = newVal;
    },
  },
  methods: {
    keyPressed(e) {
      if (e.key === "Tab") {
        e.preventDefault();
        this.text =
          e.target.value.substring(0, e.target.selectionStart) +
          "    " +
          e.target.value.substring(e.target.selectionEnd);

        const start = e.target.selectionStart;
        setTimeout(() => {
          this.$refs.inputRef.selectionStart =
            this.$refs.inputRef.selectionEnd = start + 4;
        }, 10);
      }

      this.updateActiveLine();
    },
    updateActiveLine() {
      setTimeout(() => {
        let activeLine = 0;
        const nthChar = this.$refs.inputRef.selectionStart;
        for (let i = 0; i < this.text.length; i++)
          if (this.text[i] === "\n")
            if (i < nthChar) activeLine++;
            else break;

        this.activeLine = activeLine + 1;
      }, 10);
    },
    finishedEdit() {
      this.activeLine = null;
      this.$emit("edit-finished", this.text);
    },
  },
};
</script>

<style scoped lang="scss">
.file-editor {
  width: 100%;
  align-self: flex-start;

  .line-count {
    display: inline-block;
    width: 60px;
    vertical-align: top;

    span {
      display: block;
      text-align: right;
      padding-right: 16px;
      color: #ffffff80;
      font-weight: 700;
      font-size: 14px;
      line-height: 1.5;
      &.active {
        color: #ffffff;
      }
    }
  }

  textarea {
    display: inline-block;
    width: calc(100% - 60px);
    height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    padding: 0;
    resize: none;

    font-family: monospace;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: #669cbb;
  }
}
</style>
