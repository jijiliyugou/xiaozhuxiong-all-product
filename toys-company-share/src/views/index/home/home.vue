<template>
  <div class="homeWrap">
    <new-productList
      v-if="homeData.newProducts.length"
      :products="homeData.newProducts"
    />
    <homeProduct
      v-if="homeData.products.length"
      :products="homeData.products"
    />
  </div>
</template>

<script>
import newProductList from "@/components/newProductList/newProductList.vue";
import homeProduct from "@/components/homeProduct/homeProduct.vue";
import { mapState } from "vuex";
export default {
  components: {
    newProductList,
    homeProduct
  },
  data() {
    return {
      homeData: {
        newProducts: [],
        products: []
      }
    };
  },
  methods: {
    // 获取首页数据
    async getCompanyShareIndex() {
      const res = await this.$http.get(
        "/api/WebsiteShare/GetCompanyShareIndex?loginName=" +
          this.userInfo.loginEmail
      );
      const { data, code } = res.data.result;
      if (code === 200) {
        this.homeData = data;
      }
    }
  },
  created() {
    document.title = this.homeLang.home;
  },
  computed: {
    homeLang() {
      return this.$t("lang.home");
    },
    ...mapState(["userInfo"])
  },
  watch: {
    "$store.state.globalLang"(val) {
      if (val) document.title = this.homeLang.home;
    }
  },
  mounted() {
    this.getCompanyShareIndex();
  }
};
</script>
<style scoped lang="less">
.homeWrap {
  min-height: calc(100% - 482px) !important;
}
</style>
