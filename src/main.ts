import { createApp } from "vue";
import { IonicVue } from "@ionic/vue";
import ElementPlus from "element-plus";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "bootstrap/dist/css/bootstrap.css";
// import "element-plus/dist/index.css";
import "leaflet/dist/leaflet.css";
import "@ionic/vue/css/core.css";
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";
import "./sass/app.scss";

const app = createApp(App)
  .use(ElementPlus)
  .use(IonicVue, {
    animated: false, // Disable all animations globally
  })
  .use(router)
  //   .use(dkgExplorerLib)
  .use(store);

router.isReady().then(() => {
  app.mount("#app");
});
