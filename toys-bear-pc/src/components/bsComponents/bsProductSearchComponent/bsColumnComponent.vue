<template>
  <div class="bsColumnComponent">
    <bsColumnItem
      v-for="item in productList"
      :key="item.productNumber"
      :item="item"
    />
    <div class="kong"></div>
    <div class="kong"></div>
    <div class="kong"></div>
    <div class="kong"></div>
    <div class="kong"></div>
  </div>
</template>

<script>
import bsColumnItem from "@/components/bsComponents/bsProductSearchComponent/bsColumnItem.vue";
export default {
  components: {
    bsColumnItem
  },
  props: {
    productList: {
      type: Array
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
.bsColumnComponent {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .kong {
    width: 255px;
    min-width: 255px;
  }
}
</style>
