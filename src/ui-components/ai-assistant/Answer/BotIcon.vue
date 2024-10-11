<template>
  <div class="bot-icon" />
</template>

<style scoped lang="scss">
.bot-icon {
  display: flex;
  max-width: 32px;
  width: 100%;
  height: 32px;
  align-self: flex-start;

  //   background-image: url($logo-graphic-only);
  //   background-position: center;
  //   background-size: cover;

  background-color: $secondary-color;
  mask-image: url(/images/chatdkg/icons/origintrail.svg);
  mask-repeat: no-repeat;
  mask-size: 100%;
}
</style>
