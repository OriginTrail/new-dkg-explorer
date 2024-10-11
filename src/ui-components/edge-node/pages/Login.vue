<template>
  <ion-page>
    <ion-content class="background">
      <div class="d-flex flex-column gap-4">
        <div class="box flex-grow-1 w-100 p-5">
          <form class="d-flex flex-column gap-3" @submit.prevent="loginSubmit">
            <hgroup>
              <h1>Login</h1>
              <p>Enter your details to get started.</p>
            </hgroup>
            <input type="text" v-model="form.username" placeholder="Username" />
            <input
              type="password"
              v-model="form.password"
              placeholder="Password"
            />
            <div class="d-flex gap-2 align-items-center my-3">
              <input id="remember_me" type="checkbox" v-model="remember_me" />
              <label for="remember_me">Remember me</label>
            </div>
            <div class="d-flex flex-column gap-2">
              <el-button native-type="submit" type="primary" size="large" round>
                Login
              </el-button>
              <el-button
                native-type="button"
                size="large"
                round
                class="ms-0"
                v-if="allowSignup"
              >
                Sign up
              </el-button>
              <el-button
                native-type="button"
                type="primary"
                link
                class="ms-0 my-2"
                v-if="allowPasswordReset"
              >
                Forgot password?
              </el-button>
            </div>
          </form>
        </div>
        <div>
          <footer-component></footer-component>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import { IonContent, IonPage } from "@ionic/vue";
import { ElNotification } from "element-plus";
import FooterComponent from "@/ui-components/edge-node/single-components/FooterComponent.vue";

export default defineComponent({
  name: "LoginPage",
  components: { IonPage, IonContent, FooterComponent },
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      remember_me: true,
      allowSignup: import.meta.env.VITE_AUTH_ALLOW_SIGNUP === "true",
      allowPasswordReset:
        import.meta.env.VITE_AUTH_ALLOW_PASSWORD_RESET === "true",
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getUser"]),
  },
  methods: {
    ...mapActions(["login"]),
    loginSubmit() {
      axios
        .post(
          `${import.meta.env.VITE_AUTH_SERVICE_ENDPOINT}/login`,
          this.form,
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          this.login(response.data.user);
          this.$router.push("/");
        })
        .catch((err) => {
          ElNotification({
            type: "error",
            title: "Unable to authenticate",
            message: `Error: ${
              [400, 401].includes(err?.response?.status)
                ? "Invalid credentials!"
                : (err?.message ?? "unknown error.")
            }`,
          });
        });
    },
  },
});
</script>

<style scoped lang="scss">
form {
  width: 100%;
  max-width: 400px;
  margin: auto;

  hgroup {
    text-align: center;
    color: $text-color-light;
    font-size: 20px;

    h1 {
      color: $secondary-color;
      font-weight: 900;
      font-size: 40px;
    }
  }

  label {
    color: $text-color-light;
    user-select: none;
    cursor: pointer;
  }

  input {
    &[type="checkbox"] {
      width: 20px;
      height: 20px;
      border-color: $text-color-default;
      outline-color: $text-color-default;
      accent-color: $secondary-color;
      cursor: pointer;
    }

    border: 1px solid $primary-color-light;
    border-radius: 32px;
    outline: 0;
    padding: 8px 16px;
    background: $primary-color;
    color: $text-color-default;
    text-overflow: ellipsis;

    &:focus {
      outline: 0;
    }

    &:disabled {
      opacity: 1;
    }

    &::placeholder {
      color: $text-color-dark;
      opacity: 1;

      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      font-feature-settings:
        "clig" off,
        "liga" off;
    }
  }
}
</style>
