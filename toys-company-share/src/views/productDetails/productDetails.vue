<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-14 14:27:13
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\views\productDetails\productDetails.vue
 * @LastEditTime: 2021-06-16 16:59:41
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="contentBox">
    <template v-if="isMobile">
      <home-top-component-mb :showTitle="false" />
      <productDetailComponentMb
        v-if="showProductDetails"
        class="productDetailBox"
      />
    </template>
    <template v-else>
      <home-top-component />
      <!-- <keep-alive> -->
      <productDetailComponent
        v-if="showProductDetails"
        class="productDetailBox"
      />
      <!-- </keep-alive> -->
      <myFoot class="myFoot" />
    </template>
  </div>
</template>

<script>
import homeTopComponent from "@/components/homeTopComponent/homeTopComponent.vue";
import homeTopComponentMb from "@/components/homeTopComponent/homeTopComponentMb.vue";
import myFoot from "@/components/myFoot/myFoot.vue";
import productDetailComponent from "@/components/productDetailComponent/productDetailComponent.vue";
import productDetailComponentMb from "@/components/productDetailComponent/productDetailComponentMb.vue";
import util from "@/assets/js/utils/util.js";

export default {
  components: {
    homeTopComponent,
    homeTopComponentMb,
    productDetailComponent,
    productDetailComponentMb,
    myFoot
  },
  data() {
    return {
      showProductDetails: true,
      isMobile: false //是否移动端
    };
  },
  methods: {},
  created() {
    document.title = this.productDetailLang.title;
    this.isMobile = util.isMobile();
  },
  mounted() {
    this.$root.eventHub.$on("resetRelatedProducts", () => {
      this.showProductDetails = false;
      this.$nextTick(() => {
        this.showProductDetails = true;
      });
    });
  },
  watch: {
    "$store.state.globalLang"(val) {
      if (val) document.title = this.productDetailLang.title;
    }
  },
  computed: {
    productDetailLang() {
      return this.$t("lang.productDetail");
    }
  },
  beforeDestroy() {
    this.$root.eventHub.$off("resetRelatedProducts");
  }
};
</script>
<style scoped lang="less">
.contentBox {
  height: 100%;
  .productDetailBox {
    min-height: calc(100% - 343px);
  }
  .myFoot {
    margin-top: 20px;
  }
}
</style>
