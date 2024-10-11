<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 19 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style="vertical-align: middle"
  >
    <path
      d="M12.1242 0.75C12.9281 0.75 13.6708 1.17885 14.0728 1.875L16.9595 6.87491C17.3614 7.57106 17.3614 8.42876 16.9595 9.12491L14.0728 14.1248C13.6708 14.821 12.9281 15.2498 12.1242 15.2498H6.3508C5.54696 15.2498 4.80417 14.821 4.40225 14.1248L1.51554 9.12491C1.11362 8.42876 1.11362 7.57107 1.51554 6.87491L4.40225 1.875C4.80417 1.17885 5.54695 0.75 6.3508 0.75L12.1242 0.75Z"
      :stroke="color"
      stroke-width="1.5"
    />
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#FFFFFF",
    },
    size: {
      type: Number,
      default: 16,
    },
  },
};
</script>
