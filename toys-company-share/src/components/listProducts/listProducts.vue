<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-14 14:27:13
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\components\listProducts\listProducts.vue
 * @LastEditTime: 2021-06-19 14:30:03
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div
    class="listProducts"
    v-infinite-scroll="load"
    infinite-scroll-disabled="disabled"
  >
    <template v-if="isMobile">
      <listProductItemMb
        v-for="item in productList"
        :key="item.id"
        :item="item"
      />
      <div v-if="loading" class="load_tip">{{ commonLang.loading }}</div>
      <div v-if="noMore" class="load_tip">{{ commonLang.noMore }}</div>
    </template>
    <template v-else>
      <listProductItem
        v-for="item in productList"
        :key="item.id"
        :item="item"
      />
      <div class="kong"></div>
    </template>
  </div>
</template>

<script>
import listProductItem from "@/components/listProductItem/listProductItem.vue";
import listProductItemMb from "@/components/listProductItem/listProductItemMb.vue";
import util from "@/assets/js/utils/util.js";

export default {
  components: {
    listProductItem,
    listProductItemMb
  },
  props: {
    productList: {
      type: Array
    },
    loading: {
      type: Boolean,
      default: false
    },
    noMore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isMobile: false //是否移动端
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
    commonLang() {
      return this.$t("lang.common");
    }
  },
  methods: {
    load() {
      if (this.isMobile) {
        this.$emit("get-search-company-share-product-page", true);
      }
    }
  },
  created() {
    this.isMobile = util.isMobile();
  },
  mounted() {}
};
</script>
<style scoped lang="less">
.listProducts {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .load_tip {
    margin-bottom: 70px;
    text-align: center;
    width: 100%;
  }
  .kong {
    width: 45%;
    border: 1px solid transparent;
  }
}
</style>
