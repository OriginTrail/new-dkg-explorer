<template>
  <div class="box w-100">
    <div class="d-flex" :class="{ collapsed }">
      <div class="p-3">
        <InfoIcon @click="triggerCollapsed" class="info" />
      </div>
      <hgroup class="pe-3">
        <h1 @click="triggerCollapsed">{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </hgroup>
    </div>
  </div>
</template>

<script>
import InfoIcon from "@/ui-components/common/icons/InfoIcon.vue";

export default {
  components: { InfoIcon },
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      collapsed: true,
    };
  },
  methods: {
    triggerCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
};
</script>

<style scoped lang="scss">
.collapsed {
  max-height: 64px;
  overflow: hidden;

  p {
    visibility: hidden;
  }
}

.info {
  width: 32px;
  height: 32px;
  max-width: unset;
  cursor: pointer;
}

hgroup {
  h1 {
    color: $text-color-default;
    font-size: 16px;
    margin-top: 22px;
    user-select: none;
    cursor: pointer;
  }
  p {
    color: $text-color-light;
    font-size: 14px;
  }
}
</style>
