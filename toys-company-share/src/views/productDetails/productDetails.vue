<template>
  <div class="contentBox">
    <home-top-component />
    <!-- <keep-alive> -->
    <productDetailComponent
      v-if="showProductDetails"
      class="productDetailBox"
    />
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
      showProductDetails: true
    };
  },
  methods: {},
  created() {
    document.title = this.productDetailLang.title;
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
