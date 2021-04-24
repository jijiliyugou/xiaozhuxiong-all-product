<template>
  <div class="contentBox">
    <home-top-component />
    <!-- <keep-alive> -->
    <productDetailComponent class="productDetailBox" />
    <!-- </keep-alive> -->
    <myFoot class="myFoot" />
  </div>
</template>

<script>
import homeTopComponent from "@/components/homeTopComponent/homeTopComponent.vue";
import myFoot from "@/components/myFoot/myFoot.vue";
import productDetailComponent from "@/components/productDetailComponent/productDetailComponent.vue";
export default {
  components: {
    homeTopComponent,
    productDetailComponent,
    myFoot
  },
  data() {
    return {
      product: {}
    };
  },
  methods: {},
  created() {
    document.title = this.productDetailLang.title;
  },
  mounted() {},
  watch: {
    "$store.state.globalLang"(val) {
      if (val) document.title = this.productDetailLang.title;
    }
  },
  computed: {
    productDetailLang() {
      return this.$t("lang.productDetail");
    }
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
