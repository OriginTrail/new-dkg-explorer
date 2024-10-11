<template>
  <el-table
    :data="tableData"
    class="answer-table"
    table-layout="auto"
    :fit="false"
    :border="true"
    :tree-props="{ children: '_children' }"
    row-key="_id"
  >
    <el-table-column
      v-for="(heading, index) in tableHeadings"
      :key="index"
      :label="camelToTitleCase(heading)"
      class-name="custom-table-row"
    >
      <template #default="scope">
        {{ scope.row[heading] }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { camelToTitleCase } from "@/utils/stringUtils";

export default {
  name: "TableComponent",
  props: {
    tableData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tableHeadings:
        this.tableData.length > 0
          ? Object.keys(this.tableData[0]).filter(
              (k) => !["_id", "_children"].includes(k),
            )
          : [],
    };
  },
  methods: {
    camelToTitleCase,
  },
};
</script>

<style lang="scss" scoped>
.answer-table {
  width: 100%;
  max-width: 100%;

  :deep(.custom-table-row) {
    padding: 16px 0;
  }

  :deep(.el-scrollbar__view) {
    display: block !important;
  }

  :deep(table) {
    width: 100% !important;
  }

  :deep(.el-table__row) {
    &:last-child {
      td {
        border-bottom: none;
      }
    }
  }

  :deep(.cell) {
    text-wrap: nowrap;
  }
}
</style>
