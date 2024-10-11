<template>
  <div class="error-component-wrapper">
    <img
      class="user-icon"
      src="/images/chatdkg/icons/origintrail.svg"
      alt="OriginTrail brand logo"
    />
    <div class="message-box">
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorComponent",
  props: {
    errorMessage: {
      type: String,
      default: "An error occurred",
    },
  },
};
</script>

<style lang="scss" scoped>
.error-component-wrapper {
  display: flex;
  align-items: center;
  column-gap: 16px;
  padding-bottom: 16px;

  @media screen and (min-width: 1024px) {
    padding-bottom: 24px;
  }

  .user-icon {
    width: 32px;
    height: 32px;
  }

  .message-box {
    display: flex;
    align-items: center;
    padding: 12px;
    flex: 1 0 0;
    border-radius: 8px;
    border: 1px solid #de3860;
    background: #feebeb;
    height: 56px;
    color: #131415;
    font-size: 14px;
    font-weight: 700;
    line-height: 16px;
  }
}
</style>
