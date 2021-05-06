<template>
  <div class="productWrap">
    <div class="productList">
      <div class="filterBar">
        <div class="left">
          <div
            :class="{ dateBox: true, active: sortOrder === 2 }"
            @click="sortDate(2)"
          >
            <span>{{ productLang.data }}</span>
            <span style="margin-left:10px;">
              <i v-show="isDate === 0" class="el-icon-d-caret"></i>
              <i class="el-icon-caret-bottom" v-show="isDate === 1"></i>
              <i v-show="isDate === 2" class="el-icon-caret-top"></i>
            </span>
          </div>
          <div
            :class="{ priceBox: true, active: sortOrder === 1 }"
            @click="sortPrice(1)"
          >
            <span>{{ productLang.price }}</span>
            <span style="margin-left:10px;">
              <i v-show="isPrice === 0" class="el-icon-d-caret"></i>
              <i v-show="isPrice === 1" class="el-icon-caret-bottom"></i>
              <i v-show="isPrice === 2" class="el-icon-caret-top"></i>
            </span>
          </div>
          <div class="updateTime">
            <div class="title">{{ advancedSearchLang.updateTime }}</div>
            <el-date-picker
              size="mini"
              value-format="yyyy-MM-ddTHH:mm:ss"
              v-model="datetime"
              type="daterange"
              range-separator="-"
              :start-placeholder="advancedSearchLang.startDate"
              :end-placeholder="advancedSearchLang.endDate"
            ></el-date-picker>
          </div>
          <div class="priceRange">
            <div class="title">{{ advancedSearchLang.priceRange }}</div>
            <div class="myInput">
              <el-input
                size="mini"
                :placeholder="advancedSearchLang.miniPrice"
                @keyup.enter.native="search"
                v-model="searchForm.minPrice"
              >
              </el-input>
              <span class="middleLine">-</span>
              <el-input
                size="mini"
                :placeholder="advancedSearchLang.maxPrice"
                @keyup.enter.native="search"
                v-model="searchForm.maxPrice"
              >
              </el-input>
            </div>
          </div>
          <div class="config">
            <el-button type="warning" @click="confirmSearch" size="mini">{{
              advancedSearchLang.confirm
            }}</el-button>
          </div>
        </div>
        <div class="right">
          <div class="checkView">
            <div
              :class="{
                thumbnail: true,
                active: isThumbnail === 'thumbnailProducts'
              }"
              @click="isThumbnail = 'thumbnailProducts'"
            >
              <i class="iconfont icon-split-screen-compare"></i>
              <!-- <span class="text">{{ productLang.thumbnail }}</span> -->
            </div>
            <div
              :class="{ list: true, active: isThumbnail === 'listProducts' }"
              @click="isThumbnail = 'listProducts'"
            >
              <i class="iconfont icon-liebiao"></i>
              <!-- <span class="text">{{ productLang.list }}</span> -->
            </div>
          </div>
          <div class="myPagination" v-if="!$store.state.imageSearchValue">
            <div @click="firstEvent" class="first el-icon-arrow-left"></div>
            <div class="count">
              <span class="pageIndex">{{ currentPage }}</span>
              <span>/</span>
              <span>{{ Math.ceil(totalCount / pageSize) }}</span>
            </div>
            <div @click="nextEvent" class="next el-icon-arrow-right"></div>
          </div>
        </div>
      </div>
      <!-- 产品列表 -->
      <div class="productListWrap">
        <div class="number">
          {{ productLang.numberOfProducts }}
          <span style="margin-left:10px;color:#FF760E;">{{ totalCount }}</span>
        </div>
        <!-- 产品列表 -->
        <component :is="isThumbnail" :productList="productList"></component>
      </div>
    </div>
    <!-- 分页 -->
    <center class="paginationWrap" v-if="!$store.state.imageSearchValue">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[16, 32, 64]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </center>
  </div>
</template>

<script>
import thumbnailProducts from "@/components/thumbnailProducts/thumbnailProducts.vue";
import listProducts from "@/components/listProducts/listProducts.vue";
import { mapState, mapGetters } from "vuex";
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
        pageSize: this.pageSize
      };
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
        if (this.shoppingList) {
          for (let i = 0; i < data.items.length; i++) {
            for (let j = 0; j < this.shoppingList.length; j++) {
              if (data.items[i].id === this.shoppingList[j].id)
                data.items[i].isShopping = true;
            }
          }
        }

        this.productList = data.items;
        this.totalCount = data.totalCount;
      } else this.$message.error(message);
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      $("#app").animate({ scrollTop: 0 }, 10);
      this.pageSize = pageSize;
      if (this.currentPage * pageSize > this.totalCount) return false;
      this.getSearchCompanyShareProductPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      $("#app").animate({ scrollTop: 0 }, 10);
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
      for (let i = 0; i < _that.productList.length; i++) {
        _that.productList[i].isShopping = false;
      }
      if (_that.shoppingList.length) {
        for (let i = 0; i < _that.productList.length; i++) {
          for (let j = 0; j < _that.shoppingList.length; j++) {
            if (_that.productList[i].id === _that.shoppingList[j].id)
              _that.productList[i].isShopping = true;
          }
        }
      }
      _that.$root.eventHub.$emit("resetProductsItem", _that.productList);
      // _that.getSearchCompanyShareProductPage();
    });
  },
  mounted() {
    this.$root.eventHub.$on("resetProducts", () => {
      this.currentPage = 1;
      this.getSearchCompanyShareProductPage();
    });
    if (this.$store.state.imageSearchValue instanceof Array) {
      this.productList = this.$store.state.imageSearchValue;
      this.totalCount = this.$store.state.imageSearchValue.length;
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
    "$store.state.imageSearchValue"(newVal) {
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
    ...mapGetters({
      shoppingList: "myShoppingList"
    }),
    ...mapState(["searchForm"])
  },
  beforeDestroy() {
    this.$root.eventHub.$off("resetProductsItem");
    this.$root.eventHub.$off("resetProducts");
    this.$root.eventHub.$off("resetProductsForeach");
    this.$store.commit("imageSearch", null);
    this.$store.commit("handlerSearchImgPreview", null);
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.productWrap {
  width: 100%;
  min-height: calc(100% - 482px) !important;
  .productList {
    margin: 0 auto;
    max-width: 1240px;
    margin-top: 20px;
    background-color: #fff;
    .filterBar {
      width: 100%;
      height: 47px;
      background: #f5f5f5;
      border: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-sizing: border-box;
      .left,
      .right {
        display: flex;
        align-items: center;
        .priceBox {
          cursor: pointer;
          margin-left: 40px;
          &.active {
            color: #ff760e;
          }
        }
        .updateTime,
        .priceRange {
          display: flex;
          margin-left: 40px;
          align-items: center;
          .title {
            margin-right: 10px;
          }
          @{deep} .myInput {
            display: flex;
            width: 145px;
            align-items: center;
            .middleLine {
              margin: 0 5px;
            }
          }
          .el-date-editor--daterange.el-input,
          .el-date-editor--daterange.el-input__inner,
          .el-date-editor--timerange.el-input,
          .el-date-editor--timerange.el-input__inner {
            width: 210px;
          }
        }
        .config {
          margin-left: 10px;
        }
        .dateBox {
          cursor: pointer;
          &.active {
            color: #ff760e;
          }
        }
      }
      .left {
        flex: 1;
      }
      .right {
        justify-content: flex-end;
        margin-left: 10px;
        .checkView {
          color: #666666;
          display: flex;
          .thumbnail,
          .list {
            cursor: pointer;
            .text {
              margin-left: 10px;
            }
            &.active {
              color: #ff760e;
            }
          }
          .list {
            margin-left: 30px;
          }
        }
        .myPagination {
          width: 110px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          margin-left: 20px;
          .first,
          .next {
            cursor: pointer;
          }
          .count {
            .pageIndex {
              color: #ff760e;
            }
          }
        }
      }
    }
    .productListWrap {
      padding: 20px 20px 0 20px;
      .number {
        height: 40px;
        color: #333;
      }
    }
  }
  .paginationWrap {
    padding: 30px 0;
  }
}

@media screen and (max-width: 1024px) {
  .myInput {
    width: 140px !important;
  }
  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 140px !important;
  }
  .priceBox,
  .updateTime,
  .priceRange {
    margin-left: 20px !important;
  }
}
</style>
