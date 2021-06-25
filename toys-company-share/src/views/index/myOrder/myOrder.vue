<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-14 14:27:13
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\views\index\myOrder\myOrder.vue
 * @LastEditTime: 2021-06-18 14:50:59
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="myOrderWrap">
    <mbMyOrder v-if="isMobile"></mbMyOrder>
    <pcMyOrder v-else></pcMyOrder>
  </div>
</template>

<script>
import pcMyOrder from "@/components/myOrder/pcMyOrder.vue";
import mbMyOrder from "@/components/myOrder/mbMyOrder.vue";
import util from "@/assets/js/utils/util.js";
export default {
  name: "myOrder",
  components: {
    pcMyOrder,
    mbMyOrder
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
.myOrderWrap {
  width: 100%;
}
</style>
