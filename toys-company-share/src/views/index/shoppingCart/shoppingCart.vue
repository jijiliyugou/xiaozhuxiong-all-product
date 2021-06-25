<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-14 14:27:13
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\views\index\shoppingCart\shoppingCart.vue
 * @LastEditTime: 2021-06-18 09:29:57
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="myCartWrap">
    <mb-shopping-cart v-if="isMobile"></mb-shopping-cart>
    <pc-shopping-cart v-else></pc-shopping-cart>
  </div>
</template>

<script>
import pcShoppingCart from "@/components/shoppingCart/pcShoppingCart.vue";
import mbShoppingCart from "@/components/shoppingCart/mbShoppingCart.vue";
import util from "@/assets/js/utils/util.js";
export default {
  components: {
    pcShoppingCart,
    mbShoppingCart
  },
  data() {
    return {
      isMobile: false //是否移动端
    };
  },
  methods: {},
  created() {
    this.isMobile = util.isMobile();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
@media screen and (min-width: 768px) {
  .myCartWrap {
    width: 100%;
    margin-top: 20px;
  }
}
@media (max-width: 767px) {
  .myCartWrap {
    width: 100%;
  }
}
</style>
