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
        </div>
      </div>
      <!-- 产品列表 -->
      <div class="productListWrap">
        <div class="number">
          {{ productLang.numberOfProducts }}
          <span style="margin-left:10px;color:#FF760E;">{{ totalCount }}</span>
        </div>
        <!-- 产品列表 -->
        <component
          :is="isThumbnail"
          :productList="productList"
          @get-search-company-share-product-page="
            getSearchCompanyShareProductPage
          "
          :loading="loading"
          :noMore="noMore"
        ></component>
      </div>
    </div>
    <!-- 分页 -->
    <!-- <center class="paginationWrap" v-if="!$store.state.imageSearchValue">
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
    </center> -->
  </div>
</template>

<script>
import productJs from "@/mixins/product.js";

export default {
  name: "mbProduct",
  mixins: [productJs],
  data() {
    return {
      loading: false,
      noMore: false
    };
  },
  methods: {
    //因为移动端改为滚动加载，方法复写params{ flag:是否移动端触发滚动，isRest:是否点击搜索是重置条件}
    async getSearchCompanyShareProductPage(flag, isRest) {
      var me = this;
      if (!flag) return;
      if (isRest) {
        me.isDate = 0;
        me.isPrice = 0;
        me.sortOrder = "";
        me.currentPage = 1;
        this.productList = [];
      }
      if (this.$route.path != "/index/product") return;
      this.loading = true;
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
        productType: this.$route.query.productType
          ? this.$route.query.productType
          : 1,
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
        for (var i = 0; i < data.items.length; i++) {
          this.productList.push(data.items[i]);
        }
        // this.productList = data.items;
        this.totalCount = data.totalCount;
        this.currentPage++;
        this.loading = false;
        this.noMore = data.items.length ? false : true;
        this.$root.eventHub.$emit("resetSearch");
      } else {
        this.$message.error(message);
        this.noMore = true;
        this.loading = false;
      }
    },
    // 时间排序
    sortDate(number) {
      this.currentPage = 1;
      this.sortOrder = number;
      this.sortType = this.isDate =
        this.isDate === 0 ? 1 : this.isDate === 1 ? 2 : 0;
      if (this.isDate === 0) this.sortOrder = "";
      this.isPrice = 0;
      this.productList = [];
      this.getSearchCompanyShareProductPage(true);
    },
    // 价格排序
    sortPrice(number) {
      this.currentPage = 1;
      this.sortOrder = number;
      this.sortType = this.isPrice =
        this.isPrice === 0 ? 1 : this.isPrice === 1 ? 2 : 0;
      if (this.isPrice === 0) this.sortOrder = "";
      this.isDate = 0;
      this.productList = [];
      this.getSearchCompanyShareProductPage(true);
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.productWrap {
  width: 100%;
  min-height: calc(100% - 482px) !important;
  //   margin-top: 88px;
  padding-top: 76px;
  .productList {
    margin: 0 auto;
    max-width: 1240px;
    // margin-top: 20px;
    background-color: #fff;
    padding-bottom: 70px;
    .filterBar {
      width: 100%;
      height: 37px;
      background: #f5f5f5;
      border: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2.5%;
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
            width: 160px;
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
      width: 95%;
      margin: 2.5%;
      .number {
        height: 40px;
        line-height: 30px;
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
