<template>
  <div class="listProducts">
    <listProductItem v-for="item in productList" :key="item.id" :item="item" />
    <div class="kong"></div>
  </div>
</template>

<script>
import listProductItem from "@/components/listProductItem/listProductItem.vue";
export default {
  components: {
    listProductItem
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
.listProducts {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .kong {
    width: 45%;
    border: 1px solid transparent;
  }
}
</style>
