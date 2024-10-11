<template>
  <el-button
    class="button"
    @click="downloadCsv"
    :style="buttonStyle"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <el-icon class="el-icon--left">
      <download-icon :fillColor="isHovered ? '#000000' : color" />
    </el-icon>
    {{ buttonText }}
  </el-button>
</template>

<script>
import DownloadIcon from "@/ui-components/common/icons/DownloadIcon.vue";

export default {
  name: "DownloadButtonComponent",
  components: { DownloadIcon },
  props: {
    csvContent: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      default: "download.csv",
    },
    buttonText: {
      type: String,
      default: "Download CSV",
    },
    type: {
      type: String,
      default: "neutral",
      validator: (value) => ["neutral", "safe", "unsafe"].includes(value),
    },
  },
  data() {
    return {
      color: this.getColor(),
      isHovered: false,
    };
  },
  computed: {
    buttonStyle() {
      return {
        border: `2px solid ${this.color}`,
        backgroundColor: this.isHovered ? this.color : "transparent",
        color: this.isHovered ? "#000000" : this.color,
      };
    },
  },
  methods: {
    getColor() {
      switch (this.type) {
        case "unsafe":
          return "#CA3838";
        case "safe":
          return "#21AE94";
        case "neutral":
        default:
          return "#FF9100";
      }
    },
    downloadCsv() {
      const blob = new Blob([this.csvContent], { type: "text/csv" });

      const link = document.createElement("a");

      const url = URL.createObjectURL(blob);
      link.href = url;

      link.setAttribute("download", this.fileName);

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style scoped>
.button {
  height: auto;
  display: flex;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;
  transition: all 0.3s ease;
}

.el-icon--left {
  transition: all 0.3s ease;
  width: 16px;
  height: 16px;

  svg {
    width: 16px;
    height: 16px;
  }
}
</style>
