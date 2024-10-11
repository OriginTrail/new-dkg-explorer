<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="18" height="18" rx="9" fill="#FFF" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5ZM8.25 8.25C8.25 7.83579 8.58579 7.5 9 7.5C9.41421 7.5 9.75 7.83579 9.75 8.25V12.75C9.75 13.1642 9.41421 13.5 9 13.5C8.58579 13.5 8.25 13.1642 8.25 12.75V8.25ZM9 4.5C8.58579 4.5 8.25 4.83579 8.25 5.25C8.25 5.66421 8.58579 6 9 6C9.41421 6 9.75 5.66421 9.75 5.25C9.75 4.83579 9.41421 4.5 9 4.5Z"
      fill="#0C0C0C"
    />
  </svg>
</template>

<style scoped lang="scss">
svg {
  rect {
    fill: $secondary-color;
  }
  path {
    fill: $primary-color-dark;
  }
}
</style>
