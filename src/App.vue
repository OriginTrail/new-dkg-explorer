<template>
  <div class="background-wrapper"></div>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";

export default {
  components: {
    IonApp,
    IonRouterOutlet,
  },
};
</script>

<style scoped></style>
