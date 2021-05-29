<template>
  <div class="bsGridComponent">
    <bsGridItem
      v-for="item in productList"
      :key="item.productNumber"
      :item="item"
    />
    <div class="kong"></div>
    <div class="kong"></div>
    <div class="kong"></div>
    <div class="kong"></div>
  </div>
</template>

<script>
import bsGridItem from "@/components/bsComponents/bsProductSearchComponent/bsGridItem.vue";
export default {
  components: {
    bsGridItem
  },
  props: {
    productList: {
      type: Array
    },
    selection: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.bsGridComponent {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .kong {
    width: 255px;
    min-width: 255px;
  }
}
</style>
