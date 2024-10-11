<template>
  <div class="prompt-suggestions-wrapper d-flex flex-column w-100">
    <div
      v-for="(prompt, index) in promptSuggestions"
      :key="index"
      class="prompt-suggestion d-flex justify-content-between align-items-center text-start"
      @click="selectPrompt(prompt)"
    >
      <p class="overused m-0">{{ prompt }}</p>
      <div class="add-button d-none d-sm-flex align-items-center">
        <span>+</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PromptSuggestions",
  props: {
    promptSuggestions: {
      type: Array,
      required: true,
    },
  },
  emits: ["select-prompt"],
  methods: {
    selectPrompt(prompt) {
      this.$emit("select-prompt", prompt);
    },
  },
};
</script>

<style lang="scss" scoped>
.prompt-suggestions-wrapper {
  padding: 0px 16px 24px 16px;
  z-index: 2;

  .prompt-suggestion {
    color: $text-color-light;
    border-bottom: 1px solid $primary-color-light;
    &:last-child {
      border: none;
    }
    padding: 8px 0px;
    gap: 10px;
    cursor: pointer;
    transition: all 300ms;
    font-size: 16px;
    overflow-wrap: anywhere;

    .add-button {
      font-family: Arial, sans-serif;
      font-size: 24px;
      line-height: 1;
      font-weight: 400;
      padding: 0 10px;
      color: $secondary-color;

      transition: all 300ms;
    }

    &:hover,
    &:active {
      color: $text-color-default;

      .add-button {
        filter: brightness(1.5);
      }
    }
  }
}
</style>
