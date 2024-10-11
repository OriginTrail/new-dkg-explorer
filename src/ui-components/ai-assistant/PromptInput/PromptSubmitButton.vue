<template>
  <div class="icon-wrapper d-flex justify-content-top align-items-center glow">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
    >
      <g id="24/arrows/arrow-up">
        <path
          d="M14.0006 21.9672V6.03223M14.0006 6.03223L8.30957 12.0078M14.0006 6.03223L19.6917 12.0078"
          stroke="url(#paint0_linear_1248_253)"
          stroke-width="1.82927"
          stroke-linecap="square"
          fill="#000000"
        />
      </g>
      <defs fill="#000000">
        <linearGradient
          id="paint0_linear_1248_253"
          x1="8.94191"
          y1="6.03223"
          x2="22.5352"
          y2="17.4545"
          gradientUnits="userSpaceOnUse"
          fill="#000000"
        >
          <stop stop-color="#e7e3f4" fill="#000000" />
          <stop offset="1" stop-color="#e7e3f4" fill="#000000" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.icon-wrapper {
  width: 56px;
  height: 56px;
  padding: 0px 14px;
  @media screen and (max-width: 767px) {
    width: 48px;
    height: 48px;
  }
  border-radius: 50%;
  background-color: $primary-color-dark;
  svg path {
    stroke: $secondary-color;
  }

  cursor: pointer;
  user-select: none;
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(231, 227, 244, 0.5); /* Change the shadow color here */
    fill: rgba(231, 227, 244, 0.8); /* Change the fill color here */
  }
  50% {
    box-shadow: 0 0 10px rgba(231, 227, 244, 0.8); /* Change the shadow color here */
    fill: rgba(231, 227, 244, 1); /* Change the fill color here */
  }
  100% {
    box-shadow: 0 0 5px rgba(231, 227, 244, 0.5); /* Change the shadow color here */
    fill: rgba(231, 227, 244, 0.8); /* Change the fill color here */
  }
}

.glow {
  animation: glow 2s infinite alternate ease-in-out; /* Use ease-in-out timing function for smoother transition */
}
</style>
