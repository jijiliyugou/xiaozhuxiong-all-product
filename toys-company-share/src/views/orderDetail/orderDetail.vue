<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-14 14:27:13
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\views\orderDetail\orderDetail.vue
 * @LastEditTime: 2021-06-18 18:17:51
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="contentBox">
    <template v-if="isMobile">
      <home-top-component-mb
        :showTitle="$route.path === '/index/home' ? true : false"
      />
      <orderDetailComponentMb
        :item="$route.query.item"
        class="orderDetailBox"
      />
    </template>
    <template v-else>
      <home-top-component />
      <orderDetailComponent :item="$route.query.item" class="orderDetailBox" />
      <myFoot class="myFoot" />
    </template>
  </div>
</template>

<script>
import homeTopComponent from "@/components/homeTopComponent/homeTopComponent.vue";
import homeTopComponentMb from "@/components/homeTopComponent/homeTopComponentMb.vue";
import myFoot from "@/components/myFoot/myFoot.vue";
import orderDetailComponent from "@/components/orderDetailComponent/orderDetailComponent.vue";
import orderDetailComponentMb from "@/components/orderDetailComponent/orderDetailComponentMb.vue";
import util from "@/assets/js/utils/util.js";
export default {
  components: {
    homeTopComponent,
    homeTopComponentMb,
    orderDetailComponent,
    orderDetailComponentMb,
    myFoot
  },
  data() {
    return {
      isMobile: false //是否移动端
    };
  },
  methods: {},
  created() {
    this.isMobile = util.isMobile();
    document.title = this.orderDetailLang.orderDetails;
  },
  mounted() {},
  watch: {
    "$store.state.globalLang"(val) {
      if (val) document.title = this.orderDetailLang.orderDetails;
    }
  },
  computed: {
    orderDetailLang() {
      return this.$t("lang.myOrder");
    }
  }
};
</script>
<style scoped lang="less">
.contentBox {
  height: 100%;
  .orderDetailBox {
    min-height: calc(100% - 343px) !important;
  }
  .myFoot {
    margin-top: 20px;
  }
}
</style>
