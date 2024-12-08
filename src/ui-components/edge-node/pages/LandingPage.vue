<template>
  <ion-page>
    <ion-content class="background">
      <component :is="landingPage" />
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage } from "@ionic/vue";
import ExplorerLandingPage from "./LandingPage/ExplorerLandingPage.vue";

export default {
  components: { IonContent, IonPage },
  computed: {
    landingPage() {
      return ExplorerLandingPage;
    },
  },
};
</script>

<style scoped lang="scss"></style>
