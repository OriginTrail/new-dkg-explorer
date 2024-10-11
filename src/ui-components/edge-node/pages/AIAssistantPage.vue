<template>
  <ion-page>
    <ion-content class="background">
      <div class="d-flex flex-column position-relative">
        <div class="w-100 position-absolute z-1" v-if="!isChatActive">
          <div class="row">
            <div class="col"></div>
            <div class="col-12 col-sm-6 col-lg-4">
              <page-heading-component
                title="Knowledge Assistant"
                :subtitle="`Here, you can explore ${'knowledge asset data'} by asking questions or picking one from the suggestions.`"
              />
            </div>
          </div>
        </div>
        <div class="flex-grow-1">
          <MainChatComponent
            v-if="!isChatActive"
            @question-selected="handleSelectedQuestion"
          />
          <QuestionAndAnswerComponent
            v-else
            :question="question"
            :files="files"
            @start-again="handleStartAgain"
          />
        </div>
        <div v-if="!isChatActive">
          <footer-component></footer-component>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage } from "@ionic/vue";
import PageHeadingComponent from "../single-components/PageHeadingComponent.vue";
import FooterComponent from "../single-components/FooterComponent.vue";
import MainChatComponent from "../../ai-assistant/MainChatComponent.vue";
import QuestionAndAnswerComponent from "../../ai-assistant/QuestionAndAnswerComponent.vue";
import {
  getURLParams,
  removeUrlArgument,
  setUrlArgument,
} from "@/utils/browserUtils";
import { configMixin } from "@/services/config";

export default {
  components: {
    IonContent,
    IonPage,
    PageHeadingComponent,
    FooterComponent,
    MainChatComponent,
    QuestionAndAnswerComponent,
  },
  mixins: [configMixin],
  data() {
    return {
      isChatActive: false,
      question: "",
      files: null,
    };
  },
  computed: {},
  created() {
    this.getQuestionFromParam();
  },
  methods: {
    getQuestionFromParam() {
      const question = getURLParams("question");
      if (question) {
        this.handleSelectedQuestion(question);
      }
    },
    handleSelectedQuestion(question, files = null) {
      this.isChatActive = true;
      this.question = question;
      this.files = files;
      setUrlArgument("question", question);
    },
    handleStartAgain() {
      this.isChatActive = false;
      this.question = null;
      removeUrlArgument("question");
    },
  },
};
</script>

<style scoped lang="scss"></style>
