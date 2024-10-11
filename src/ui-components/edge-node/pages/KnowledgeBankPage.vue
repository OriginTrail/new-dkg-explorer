<template>
  <ion-page>
    <ion-content class="background">
      <div class="d-flex flex-column" v-if="availableTabs.length">
        <div class="w-100" v-if="showHeaderSection">
          <div class="row gx-4">
            <div class="col-12 col-md-8 order-2 order-md-1">
              <div
                class="w-100 h-100 d-flex justify-content-start align-items-end"
              >
                <a
                  v-for="tab in availableTabs"
                  :key="tab.id"
                  @click="activeTab = tab"
                  :class="{ active: activeTab.id === tab.id }"
                >
                  {{ tab.name }}
                </a>
              </div>
            </div>
            <div class="col-12 col-md-4 order-1 order-md-2">
              <page-heading-component
                :title="activeTab.heading"
                :subtitle="activeTab.subheading"
              />
            </div>
          </div>
        </div>
        <div class="flex-grow-1">
          <keep-alive>
            <component
              :is="activeTab.component"
              v-bind="{ fullScreen: !showHeaderSection }"
            />
          </keep-alive>
        </div>
        <div class="w-full">
          <footer-component></footer-component>
        </div>
      </div>
      <p v-else class="h3 text-center my-5">Nothing to see here...</p>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed, markRaw, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { IonContent, IonPage } from "@ionic/vue";
import PageHeadingComponent from "../single-components/PageHeadingComponent.vue";
import FooterComponent from "../single-components/FooterComponent.vue";
import TableView from "./KnowledgeBankPage/TableView.vue";
import KnowledgeGraph from "./KnowledgeBankPage/KnowledgeGraph.vue";
import AvailableToMine from "./KnowledgeBankPage/AvailableToMine.vue";
import { getURLParams, setUrlArgument } from "@/utils/browserUtils";
import { useConfig } from "@/services/config";

const route = useRoute();
function onBeforeRouteEnter(exec) {
  watch(
    () => route.name === "Contribute",
    (entered) => {
      if (entered) exec();
    },
  );
}

const { config } = useConfig();
const KNOWLEDGE_BANK_SHOW_GRAPH = config.getBool("kb_graph_is_turned_on");
const KNOWLEDGE_BANK_SHOW_TABLE = config.getBool("kb_table_is_turned_on");
const KNOWLEDGE_BANK_SHOW_AVAILABLE_TO_MINE = config.getBool(
  "kb_available_to_mine_is_turned_on",
);

const allTabs = computed(() => [
  {
    id: "knowledge-graph",
    name: "Knowledge Graph",
    component: markRaw(KnowledgeGraph),
    heading: "Knowledge Graph",
    subheading: `Here, you can interact with knowledge assets and view basic information about them.
        You can also search for assets by name or UAL.`,
    show: KNOWLEDGE_BANK_SHOW_GRAPH.value,
  },
  {
    id: "table-view",
    name: "Table view",
    component: markRaw(TableView),
    heading: "Table view",
    subheading: `Here, you can see an overview of your Knowledge Assets presented in a table format.
          You can check the JSON file for each asset or explore them through an interactive graph.`,
    show: KNOWLEDGE_BANK_SHOW_TABLE.value,
  },
  {
    id: "available-to-mine",
    name: "Available to mine",
    component: markRaw(AvailableToMine),
    heading: "Available to mine",
    subheading: `Here, you can view scientific papers and check how many times they’ve been cited.
          Some papers have already been mined, while others are still available.
          If you're interested, you can choose to mine some of them and earn additional rewards.`,
    show: KNOWLEDGE_BANK_SHOW_AVAILABLE_TO_MINE.value,
  },
]);

const availableTabs = computed(() => allTabs.value.filter((t) => t.show));
const activeTab = ref(availableTabs.value.at(0));
const showHeaderSection = computed(() => availableTabs.value.length > 1);

function setActiveTabFromURL() {
  const newActiveTabId = getURLParams("tab");
  if (newActiveTabId)
    activeTab.value =
      availableTabs.value.find((t) => t.id === newActiveTabId) ?? activeTab;
}

setActiveTabFromURL();
onBeforeRouteEnter(() => setActiveTabFromURL());

watch(
  () => activeTab.value.id,
  (newValue) => setUrlArgument("tab", newValue),
);
</script>

<style scoped lang="scss">
a {
  color: $text-color-light;
  padding: 12px;
  border-bottom: 3px solid transparent;
  transition: all 300ms;
  cursor: pointer;
  user-select: none;

  &.active {
    font-weight: bold;
    border-bottom: 3px solid $secondary-color;
  }
}
</style>
