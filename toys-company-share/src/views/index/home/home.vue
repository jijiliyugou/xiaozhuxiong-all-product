<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-14 14:27:13
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\views\index\home\home.vue
 * @LastEditTime: 2021-06-19 11:44:44
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="homeWrap">
    <template v-if="isMobile">
      <new-productList-mb
        v-if="homeData.newProducts.length"
        :products="homeData.newProducts"
      />
      <home-product-mb
        v-if="homeData.products.length"
        :products="homeData.products"
      />
    </template>
    <template v-else>
      <new-productList
        v-if="homeData.newProducts.length"
        :products="homeData.newProducts"
      />
      <homeProduct
        v-if="homeData.products.length"
        :products="homeData.products"
      />
    </template>
  </div>
</template>

<script>
import newProductList from "@/components/newProductList/newProductList.vue";
import homeProduct from "@/components/homeProduct/homeProduct.vue";
import newProductListMb from "@/components/newProductList/newProductListMb.vue";
import homeProductMb from "@/components/homeProduct/homeProductMb.vue";
import { mapState } from "vuex";
import util from "@/assets/js/utils/util.js";

export default {
  components: {
    newProductList,
    homeProduct,
    newProductListMb,
    homeProductMb
  },
  data() {
    return {
      homeData: {
        newProducts: [],
        products: []
      },
      isMobile: false //是否移动端
    };
  },
  methods: {
    // 获取首页数据
    async getCompanyShareIndex() {
      const res = await this.$http.get(
        "/api/WebsiteShare/GetCompanyShareIndex?loginName=" +
          this.customerInfo.id
      );
      const { data, code } = res.data.result;
      if (code === 200) {
        this.homeData = data;
      }
    }
  },
  created() {
    document.title = this.homeLang.home;
    this.isMobile = util.isMobile();
  },
  computed: {
    homeLang() {
      return this.$t("lang.home");
    },
    ...mapState(["userInfo", "customerInfo"])
  },
  watch: {
    "$store.state.globalLang"(val) {
      if (val) document.title = this.homeLang.home;
    }
  },
  mounted() {
    this.getCompanyShareIndex();
    this.$root.eventHub.$on("resetAll", () => {
      this.getCompanyShareIndex();
    });
  }
};
</script>
<style scoped lang="less">
.homeWrap {
  min-height: calc(100% - 482px) !important;
  padding-bottom: 53px;
}
</style>
