<template>
  <ion-page>
    <ion-content class="background">
      <component :is="landingPage" />
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage } from "@ionic/vue";
import MyNetworkPage from "./LandingPage/MyNetworkPage.vue";

export default {
  components: { IonContent, IonPage },
  computed: {
    landingPage() {
      return MyNetworkPage;
    },
  },
};
</script>

<style scoped lang="scss"></style>
