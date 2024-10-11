<template>
  <teleport to="body">
    <el-dialog title="Logout" v-model="logoutDialog" style="max-width: 400px">
      Are you sure you want to logout?
      <template #footer>
        <el-button type="primary" round @click="logout">Logout</el-button>
        <el-button round @click="logoutDialog = false">Cancel</el-button>
      </template>
    </el-dialog>
  </teleport>

  <div class="user-badge">
    <div class="fix-scale" />
    <el-dropdown
      trigger="click"
      popper-class="user-dropdown is-dark"
      placement="bottom-end"
    >
      <span class="el-dropdown-link">
        <el-icon :size="24" style="vertical-align: middle">
          <UserFilled />
        </el-icon>
      </span>
      <template #dropdown>
        <div class="d-flex flex-column gap-3 p-3 wrapper">
          <div class="d-flex gap-2 align-items-center user-wrapper">
            <div class="user-icon"></div>
            <div class="d-flex flex-column">
              <span class="user">{{ userName }}</span>
              <span class="user-name">Node: {{ nodeName }}</span>
            </div>
          </div>
          <div class="d-flex gap-2 buttons-wrapper">
            <el-button type="primary" size="large" round disabled>
              Change name
            </el-button>
            <el-button size="large" round @click.prevent="logout" class="m-0">
              Logout
            </el-button>
          </div>
        </div>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import axios from "axios";
import { UserFilled } from "@element-plus/icons-vue";
import { configMixin } from "@/services/config";

export default {
  components: { UserFilled },
  mixins: [configMixin],
  data() {
    return {
      logoutDialog: false,
    };
  },
  computed: {
    nodeName() {
      return this.globalConfig.find((o) => o.option === "edge_node_name")
        ?.value;
    },
    userName() {
      return this.getUser?.username;
    },
  },
  methods: {
    logout() {
      if (!this.logoutDialog) {
        this.logoutDialog = true;
        return;
      }

      return axios
        .post(`${import.meta.env.VITE_AUTH_SERVICE_ENDPOINT}/logout`, {
          withCredentials: true,
        })
        .then(() => {
          this.$store.dispatch("logout");
          this.$router.push("/login");
        })
        .finally(() => {
          this.logoutDialog = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.user-badge {
  position: relative;
  cursor: pointer;
  display: flex;
}

.el-dropdown-link {
  background: $secondary-color;
  border-radius: 50%;

  i {
    color: $primary-color-dark;
    padding: 25%;
  }

  transform: scale(2);
}
.fix-scale {
  width: 12px;
  display: inline-block;
}

:global(.user-dropdown) {
  margin-top: 12px;
}
.wrapper {
  padding: 10px;

  .user-wrapper {
    .user-icon {
      background: $primary-color-light;
      border-radius: 50%;
      position: relative;
      width: 32px;
      height: 32px;

      &::after {
        content: "";
        display: block;
        background: $secondary-color;
        border-radius: 50%;
        position: absolute;
        left: 20%;
        top: 20%;
        padding-left: 1px;
        width: 60%;
        height: 60%;
      }
    }
    .user {
      color: $text-color-default;
      font-weight: bold;
      font-size: 20px;
    }
    .user-name {
      color: $text-color-default;
      font-size: 14px;
    }
  }

  .buttons-wrapper > * {
    flex: 1;
    min-width: 0;
  }
}
</style>
