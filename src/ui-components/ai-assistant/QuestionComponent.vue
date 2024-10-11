<template>
  <div class="question-component-wrapper">
    <el-icon class="user-icon" color="black">
      <UserFilled />
    </el-icon>
    <p class="overused">{{ questionText }}</p>
  </div>
</template>

<script>
import { UserFilled } from "@element-plus/icons-vue";
export default {
  name: "QuestionComponent",
  components: { UserFilled },
  props: {
    questionText: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.question-component-wrapper {
  display: flex;
  align-items: center;
  column-gap: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  overflow-wrap: anywhere;

  @media screen and (min-width: 1024px) {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  .user-icon {
    min-width: 32px;
    width: 32px;
    height: 32px;
    align-self: self-start;
    background-color: $secondary-color;
    border-radius: 50%;
  }

  p {
    color: $text-color-default;
    margin: 0;
    font-size: 16px;
    line-height: 150%;
  }
}
</style>
