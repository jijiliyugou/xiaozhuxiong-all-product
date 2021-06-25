<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-14 14:27:13
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\components\thumbnailProducts\thumbnailProducts.vue
 * @LastEditTime: 2021-06-19 14:31:11
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div
    class="thumbnailProducts"
    v-infinite-scroll="load"
    infinite-scroll-disabled="disabled"
  >
    <template v-if="isMobile">
      <gonggeProductItemMb
        v-for="item in productList"
        :key="item.id"
        :item="item"
      />
      <div v-if="loading" class="load_tip">{{ commonLang.loading }}</div>
      <div v-if="noMore" class="load_tip">{{ commonLang.noMore }}</div>
    </template>
    <template v-else>
      <gonggeProductItem
        v-for="item in productList"
        :key="item.id"
        :item="item"
      />
    </template>
    <!-- <div class="kong"></div>
    <div class="kong"></div>
    <div class="kong"></div> -->
  </div>
</template>

<script>
import gonggeProductItem from "@/components/gonggeProductItem/gonggeProductItem.vue";
import gonggeProductItemMb from "@/components/gonggeProductItem/gonggeProductItemMb.vue";
import util from "@/assets/js/utils/util.js";

export default {
  components: {
    gonggeProductItem,
    gonggeProductItemMb
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
.thumbnailProducts {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .load_tip {
    margin-bottom: 60px;
    text-align: center;
    flex: 1;
  }
  .kong {
    width: 283px;
    border: 1px solid transparent;
  }
}
</style>
