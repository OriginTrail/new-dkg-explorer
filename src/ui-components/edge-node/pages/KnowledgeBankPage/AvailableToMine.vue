<template>
  <el-table
    :data="shownData"
    :border="true"
    style="width: 100%"
    table-layout="auto"
    :default-sort="defaultSort"
    @sort-change="sortData"
  >
    <el-table-column
      prop="name"
      sortable
      label="Paper name"
      width="420"
      show-overflow-tooltip
    />
    <el-table-column
      prop="url"
      sortable
      label="URL"
      min-width="150"
      max-width="200"
      show-overflow-tooltip
    >
      <template #default="scope">
        <el-button link type="primary">{{ scope.row.url }}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      prop="citations"
      sortable
      label="Number of citations"
      show-overflow-tooltip
    />
    <el-table-column
      prop="citations"
      sortable
      label="Number of citations"
      show-overflow-tooltip
    />
  </el-table>
  <div class="row my-4 gy-2 footer">
    <div class="col-12 text-center text-md-start col-md-2">
      <span>
        Showing {{ firstShownIndex + 1 }}-{{ lastShownIndex + 1 }}
        out of
        {{ data.length }}
      </span>
    </div>
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      size="default"
      :background="true"
      layout="prev, pager, next"
      :total="data.length"
      class="col justify-content-center"
    />
    <div class="col-12 text-center text-md-end col-md-2"></div>
  </div>
</template>

<script>
export default {
  methods: {
    sortData(sort) {
      if (!sort) return;

      const { column, prop, order } = sort;
      this.data.sort(
        (a, b) =>
          (order === "descending" ? -1 : order === "ascending" ? 1 : 0) *
          a[prop].localeCompare(b[prop]),
      );
    },
  },
  computed: {
    firstShownIndex() {
      return (this.currentPage - 1) * this.pageSize;
    },
    lastShownIndex() {
      return Math.min(
        this.firstShownIndex + this.pageSize - 1,
        this.data.length - 1,
      );
    },
    shownData() {
      return this.data.slice(this.firstShownIndex, this.lastShownIndex + 1);
    },
  },
  created() {
    if (this.defaultSort) this.sortData(this.defaultSort);
  },
  props: {
    fullScreen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 8,
      defaultSort: null, // { prop: "createdAt", order: "descending" },
      data: ((rows) =>
        Array(30)
          .fill(0)
          .map((_, i) => ({ ...rows[i % rows.length] })))([
        {
          name: "The Role of CRISPR-Cas9 in Genome Editing: Applications and Ethical Implications",
          url: "https://example.com/images/crispr-dna-editing.png",
          citations: "###",
          createdAt: "2024-10-26T12:36:00.000",
        },
        {
          name: "Climate Change and Its Impact on Global Biodiversity: A Comprehensive Review",
          url: "https://example.com/images/crispr-dna-editing.png",
          citations: "###",
          createdAt: "2024-10-26T12:34:00.000",
        },
        {
          name: "Machine Learning Algorithms for Predicting Stock Market Trends: A Comparative Study",
          url: "https://example.com/images/crispr-dna-editing.png",
          citations: "###",
          createdAt: "2024-10-26T12:33:00.000",
        },
        {
          name: "Exploring the Relationship Between Microbiome Diversity and Human Health",
          url: "https://example.com/images/crispr-dna-editing.png",
          citations: "###",
          createdAt: "2024-10-26T12:33:00.000",
        },
        {
          name: "Nanotechnology in Medicine: Innovations in Drug Delivery Systems",
          url: "https://example.com/images/crispr-dna-editing.png",
          citations: "###",
          createdAt: "2024-10-26T12:32:00.000",
        },
        {
          name: "The Effects of Ocean Acidification on Coral Reef Ecosystems",
          url: "https://example.com/images/crispr-dna-editing.png",
          citations: "###",
          createdAt: "2024-10-26T12:30:00.000",
        },
        {
          name: "Renewable Energy Technologies: Evaluating the Efficiency of Solar and Wind Power",
          url: "https://example.com/images/crispr-dna-editing.png",
          citations: "###",
          createdAt: "2024-10-26T12:30:00.000",
        },
        {
          name: "Advances in Quantum Computing: Implications for Cryptography and Data Security",
          url: "https://example.com/images/crispr-dna-editing.png",
          citations: "###",
          createdAt: "2024-10-26T12:29:00.000",
        },
      ]),
    };
  },
};
</script>

<style scoped lang="scss">
.footer {
  color: $text-color-default;
}
</style>
