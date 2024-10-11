<template>
  <div class="notification-bell">
    <el-dropdown
      trigger="click"
      popper-class="notification-dropdown is-dark"
      placement="bottom"
      :disabled="notifications.length === 0"
      @visible-change="storeSeenNotifications"
    >
      <span class="el-dropdown-link">
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="vertical-align: middle"
        >
          <path
            d="M5.66663 9H4.66663H5.66663ZM19.6666 9H20.6666H19.6666ZM14.3966 21L15.2616 21.5018L16.1328 20H14.3966V21ZM10.9366 21V20H9.20047L10.0716 21.5018L10.9366 21ZM22.6666 16H2.66663V18H22.6666V16ZM2.66663 18C4.87577 18 6.66663 16.2091 6.66663 14H4.66663C4.66663 15.1046 3.7712 16 2.66663 16V18ZM6.66663 14V9H4.66663V14H6.66663ZM6.66663 9C6.66663 5.68629 9.35292 3 12.6666 3V1C8.24835 1 4.66663 4.58172 4.66663 9H6.66663ZM12.6666 3C15.9803 3 18.6666 5.68629 18.6666 9H20.6666C20.6666 4.58172 17.0849 1 12.6666 1V3ZM18.6666 9V14H20.6666V9H18.6666ZM18.6666 14C18.6666 16.2091 20.4575 18 22.6666 18V16C21.5621 16 20.6666 15.1046 20.6666 14H18.6666ZM13.5316 20.4982C13.3527 20.8066 13.0232 20.9965 12.6666 20.9965V22.9965C13.7362 22.9965 14.7249 22.427 15.2616 21.5018L13.5316 20.4982ZM12.6666 20.9965C12.3101 20.9965 11.9805 20.8066 11.8016 20.4982L10.0716 21.5018C10.6083 22.427 11.597 22.9965 12.6666 22.9965V20.9965ZM10.9366 22H14.3966V20H10.9366V22Z"
            :fill="appConfig['$secondary-color']"
          />
        </svg>
        <span v-if="hasNewNotifications" class="new-notifications"></span>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="notification in notifications"
            :key="notification.id"
          >
            <div class="single-notification-wrapper">
              <!-- <InfoIcon class="icon" /> -->
              <div class="icon">
                <InfoIcon />
              </div>
              <div class="position-relative">
                <p class="notification-title">{{ notification.title }}</p>
                <p class="notification-time">
                  {{ formatDateLocal(notification.created_at) }}
                </p>
                <p class="notification-message">{{ notification.message }}</p>
                <span
                  class="new-notification-badge"
                  v-if="!notification.seen"
                ></span>
              </div>
            </div>
          </el-dropdown-item>
          <div class="d-flex justify-content-end all-notifications-wrapper">
            <a class="view-all-notifications mt-2" href="/notifications">
              View all notifications
            </a>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import axios from "axios";
import InfoIcon from "@/ui-components/common/icons/InfoIcon.vue";
import { formatDateLocal } from "@/utils/dateUtils";
import { configMixin } from "@/services/config";

export default {
  components: { InfoIcon },
  mixins: [configMixin],
  data() {
    return {
      pageSize: 3,
      notifications: [],
      currentPage: 1,
    };
  },
  computed: {
    firstShownIndex() {
      return (this.currentPage - 1) * this.pageSize;
    },
    lastShownIndex() {
      return Math.min(this.firstShownIndex + this.pageSize, this.total) - 1;
    },
    notificationIds() {
      return this.notifications.map((item) => item.id);
    },
    hasNewNotifications() {
      return this.notifications.some((notification) => !notification.seen);
    },
  },
  mounted() {
    this.getNotifications();
  },
  methods: {
    formatDateLocal,
    async getNotifications() {
      try {
        this.dataLoading = true;
        const offset = this.firstShownIndex;
        const limit = this.pageSize;
        const res = await axios.get(
          `${this.endpoints.edgeNodeBackend}/notifications?offset=${offset}&limit=${limit}&seenFilter=false`,
          { withCredentials: true },
        );

        this.notifications = res.data.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.dataLoading = false;
      }
    },
    async storeSeenNotifications(visible) {
      if (visible) {
        await this.getNotifications();
      } else {
        try {
          await axios.post(
            `${this.endpoints.edgeNodeBackend}/notifications`,
            { notificationIds: this.notificationIds },
            { withCredentials: true },
          );
          await this.getNotifications();
        } catch (e) {
          console.error(e);
        } finally {
          this.dataLoading = false;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.notification-bell {
  position: relative;
  cursor: pointer;

  .new-notifications {
    background-color: #ca3838;
    border-radius: 100%;
    padding: 4px;
    position: absolute;
    top: 1px;
    left: 3px;
  }
}

.new-notification-badge {
  background-color: #ca3838;
  border-radius: 100%;
  padding: 4px;
  position: absolute;
  top: 0;
  right: 0;
}

.notification-dropdown {
  max-width: 331px;
  background-color: $primary-color-dark;

  .el-scrollbar {
    border-radius: 24px;
  }

  .el-dropdown-menu {
    background-color: $primary-color-dark;

    .el-dropdown-menu__item {
      padding: 5px 10px;
    }
  }

  .el-dropdown-menu__item:not(.is-disabled):hover,
  .el-dropdown-menu__item:not(.is-disabled):focus {
    background-color: $background-color;
    color: white;
  }

  .single-notification-wrapper {
    width: 100%;
    position: relative;

    display: flex;
    padding: 14px 16px;
    align-items: flex-start;
    gap: 16px;
    border-radius: 16px;
    background: $background-color;
    box-shadow: 0px 4px 4px 0px rgba(9, 11, 33, 0.02);

    p {
      word-wrap: break-word;
      word-break: break-word;
      max-width: 100%;
      white-space: normal;
      padding-bottom: 0;
      margin-bottom: 4px;
    }

    .icon {
      background: $secondary-color;
      padding: 7px;
      border-radius: 11px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .notification-title {
      color: $secondary-color;
      font-family: Manrope;
      font-size: 14.5px;
      font-style: normal;
      font-weight: 700;
      line-height: 140%;
    }

    .notification-time {
      color: $text-color-dark;
      font-family: Manrope;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%;
    }

    .notification-message {
      color: $text-color-light;
      font-family: Manrope;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%;
    }
  }
}

.view-all-notifications {
  color: $primary-color-dark;
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%; /* 18px */
  max-width: 55%;

  display: flex;
  height: 42px;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;

  border-radius: 82px;
  background: $secondary-color;
}

.all-notifications-wrapper {
  margin-bottom: 10px;
  padding: 0 10px;
}
</style>
