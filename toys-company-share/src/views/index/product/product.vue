<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-14 14:27:13
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\views\index\product\product.vue
 * @LastEditTime: 2021-06-17 11:30:53
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="productWrap">
    <mbProduct v-if="isMobile"></mbProduct>
    <pcProduct v-else></pcProduct>
  </div>
</template>

<script>
import pcProduct from "@/components/product/pcProduct.vue";
import mbProduct from "@/components/product/mbProduct.vue";
import util from "@/assets/js/utils/util.js";

export default {
  name: "product",
  components: {
    pcProduct,
    mbProduct
  },

  data() {
    return {
      isMobile: false //是否移动端
    };
  },
  created() {
    this.isMobile = util.isMobile();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.productWrap {
  width: 100%;
  min-height: calc(100% - 482px) !important;
}
</style>
