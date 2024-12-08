<template>
  <ion-tabs class="container mt-4">
    <ion-router-outlet></ion-router-outlet>
    <ion-tab-bar slot="top" class="box">
      <router-link to="/" class="header-logo-wrapper">
        <img
          :src="appConfig['$logo-graphic-only']"
          alt="logo"
          class="header-logo"
        />
        <p class="header-logo-title">
          {{ appConfig["$logo-title"] }}{{ nodeName ? ": " : "" }}
          <span v-if="nodeName" class="node-name">{{ nodeName }}</span>
        </p>
      </router-link>
      <div class="tabs" v-if="isAuthenticated"></div>
      <div class="d-flex align-items-center justify-content-start">
        <router-link :to="{ name: 'KnowledgeGraphPage' }">
          <el-button type="primary" round size="large">Explore</el-button>
        </router-link>
      </div>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import {
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/vue";
import { useConfig } from "@/services/config";

const { appConfig, config } = useConfig();

const store = useStore();
const isAuthenticated = computed(() => store.getters.isAuthenticated);
const nodeName = config.getString("edge_node_name");
</script>

<style scoped lang="scss">
.mr-3 {
  margin-right: 10px;
}
ion-tab-bar {
  height: 25px;
  padding: 25px;
  border-radius: 50px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow-x: hidden;
  overflow-y: hidden;

  background: transparent;

  .tabs {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin: 0 10px;
    align-items: center;

    ion-tab-button {
      background-color: transparent;
      text-wrap: nowrap;
    }
  }
}

ion-label {
  color: $text-color-default;
  text-align: center;
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-wrap: nowrap;
}

a.router-link-exact-active ion-label {
  color: $secondary-color;
}

.router-link {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
