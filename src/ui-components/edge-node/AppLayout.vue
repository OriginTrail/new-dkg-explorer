<template>
  <ion-page>
    <NavigationComponent></NavigationComponent>
  </ion-page>
</template>

<script setup>
import { IonPage } from "@ionic/vue";
import NavigationComponent from "@/ui-components/edge-node/single-components/NavigationComponent.vue";
</script>

<style scoped lang="scss">
.ion-page {
  background-image: url($background-image);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
