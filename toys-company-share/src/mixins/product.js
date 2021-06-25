import thumbnailProducts from "@/components/thumbnailProducts/thumbnailProducts.vue";
import listProducts from "@/components/listProducts/listProducts.vue";
import { mapState } from "vuex";
export default {
  components: {
    thumbnailProducts,
    listProducts
  },
  data() {
    return {
      clientWidth: 0,
      datetime: null,
      isDate: 0,
      isPrice: 0,
      sortOrder: "",
      isThumbnail: "thumbnailProducts",
      pageSize: 32,
      currentPage: 1,
      totalCount: 0,
      productList: []
    };
  },
  methods: {
    // 过滤搜索
    confirmSearch() {
      let dateFd;
      if (this.datetime) {
        dateFd = {
          startTime: this.datetime[0],
          endTime: this.datetime[1]
        };
      } else {
        dateFd = {
          startTime: "",
          endTime: ""
        };
      }
      this.$store.commit("handlerSearchDate", dateFd);
      this.getSearchCompanyShareProductPage();
    },
    // 上一页
    firstEvent() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.getSearchCompanyShareProductPage();
      } else {
        this.$message.error(this.publicLang.itsTheFirstPage);
      }
    },
    // 下一页
    nextEvent() {
      if (this.currentPage < Math.ceil(this.totalCount / this.pageSize)) {
        this.currentPage++;
        this.getSearchCompanyShareProductPage();
      } else {
        this.$message.error(this.productLang.itsTheLastPage);
      }
    },
    // 时间排序
    sortDate(number) {
      this.sortOrder = number;
      this.sortType = this.isDate =
        this.isDate === 0 ? 1 : this.isDate === 1 ? 2 : 0;
      if (this.isDate === 0) this.sortOrder = "";
      this.isPrice = 0;
      this.getSearchCompanyShareProductPage();
    },
    // 价格排序
    sortPrice(number) {
      this.sortOrder = number;
      this.sortType = this.isPrice =
        this.isPrice === 0 ? 1 : this.isPrice === 1 ? 2 : 0;
      if (this.isPrice === 0) this.sortOrder = "";
      this.isDate = 0;
      this.getSearchCompanyShareProductPage();
    },
    // 获取产品列表
    async getSearchCompanyShareProductPage() {
      this.$store.commit("imageSearch", null);
      this.$store.commit("handlerSearchImgPreview", null);
      const dateFd = {
        startTime: this.datetime && this.datetime[0],
        endTime: this.datetime && this.datetime[1]
      };
      this.$store.commit("handlerSearchDate", dateFd);
      const fd = {
        ...this.searchForm,
        sortOrder: this.sortOrder,
        sortType: this.sortType,
        productType: this.$route.query.productType,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        loginName: this.customerInfo.id
      };
      console.log(fd, 123456);
      if (fd.pa_nu) {
        const { packChMethods, packNumber } = JSON.parse(fd.pa_nu);
        fd.ch_pa = packChMethods;
        fd.pa_nu = packNumber;
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.get(
        "/api/WebsiteShare/SearchCompanyShareProductPage",
        {
          params: fd
        }
      );
      const { data, code, message } = res.data.result;
      if (code === 200) {
        this.productList = data.items;
        this.totalCount = data.totalCount;
      } else this.$message.error(message);
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      $("#app").animate(
        {
          scrollTop: 0
        },
        10
      );
      this.pageSize = pageSize;
      if (this.currentPage * pageSize > this.totalCount) return false;
      this.getSearchCompanyShareProductPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      $("#app").animate(
        {
          scrollTop: 0
        },
        10
      );
      this.currentPage = page;
      this.getSearchCompanyShareProductPage();
    }
  },
  created() {
    document.title = this.productLang.title;
    this.clientWidth = document.body.clientWidth;
  },
  beforeRouteEnter(to, from, next) {
    next(_that => {
      _that.getSearchCompanyShareProductPage();
    });
  },
  mounted() {
    this.$root.eventHub.$on("resetProducts", flag => {
      this.currentPage = 1;
      this.getSearchCompanyShareProductPage(flag, true);
    });
    this.$root.eventHub.$on("resetAll", () => {
      this.$nextTick(() => {
        this.getSearchCompanyShareProductPage();
      });
    });
    if (this.imageSearchValue instanceof Array) {
      this.productList = this.imageSearchValue;
      this.totalCount = this.imageSearchValue.length;
      // this.$store.commit("imageSearch", null);
      // this.$store.commit("handlerSearchImgPreview", null);
    } else {
      this.getSearchCompanyShareProductPage();
    }
  },
  watch: {
    "$store.state.globalLang"(val) {
      if (val) document.title = this.productLang.title;
    },
    imageSearchValue(newVal) {
      if (newVal) {
        this.productList = newVal;
        this.totalCount = newVal.length;
      }
    }
  },
  computed: {
    productLang() {
      return this.$t("lang.product");
    },
    publicLang() {
      return this.$t("lang.publicLang");
    },
    advancedSearchLang() {
      return this.$t("lang.advancedSearch");
    },

    ...mapState([
      "searchForm",
      "imageSearchValue",
      "userInfo",
      "shopLength",
      "customerInfo"
    ])
  },
  beforeDestroy() {
    this.$root.eventHub.$off("resetProducts");
    this.$store.commit("imageSearch", null);
    this.$store.commit("handlerSearchImgPreview", null);
  }
};
