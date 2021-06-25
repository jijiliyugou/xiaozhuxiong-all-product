<template>
  <div class="bsGridComponent">
    <bsGridItem
      :productType="productType"
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
    },
    productType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {
    console.log(this.productList);
  }
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
