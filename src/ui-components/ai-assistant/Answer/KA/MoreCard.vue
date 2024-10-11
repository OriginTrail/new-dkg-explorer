<template>
  <div class="more-card overused">+{{ number }} more</div>
</template>

<script>
export default { props: ["number"] };
</script>

<style scoped lang="scss">
.more-card {
  text-decoration: underline;
  padding: 16px;
  font-size: 12px;
  line-height: 16px;

  border-radius: 16px;
  border: 1px solid $primary-color-light;
  backdrop-filter: blur(22px);
  background: $primary-color-dark;
  color: $text-color-default;

  &:hover {
    background-color: $primary-color-light;
    cursor: pointer;
  }

  height: 64px;
  min-width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  @media screen and (min-width: 1024px) {
    justify-content: center;
    min-width: 92px;
  }
}
</style>
