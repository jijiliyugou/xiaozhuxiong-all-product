<template>
  <div>
    <div class="BsSpotProducts">
      <div class="title">
        <div class="left">现货产品 ({{ totalCount }})</div>
        <div class="right">
          <el-button type="warning" size="medium" @click="toShoppingCart">
            <i class="whiteCart"></i>
            <span>购物车</span>
            <span>({{ myShoppingCartCount }})</span>
          </el-button>
        </div>
      </div>
      <div class="searchBox">
        <div class="left">
          <div class="item" style="min-width: 350px">
            <span class="label">关键字：</span>
            <el-input
              v-focus
              type="text"
              size="medium"
              clearable
              v-model="keyword"
              placeholder="输入关键词+空格可模糊搜索"
              @keyup.native.enter="search"
            ></el-input>
          </div>
          <div class="item">
            <span class="label">时间段：</span>
            <el-date-picker
              size="medium"
              value-format="yyyy-MM-ddTHH:mm:ss"
              v-model="dateTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
          <div class="item">
            <el-button
              @click="search"
              type="primary"
              icon="el-icon-search"
              size="medium"
            >
              搜索
            </el-button>
          </div>
        </div>
        <div class="right">
          <div class="searchTime">
            查询用时：<span>{{ searchHttpTime }}</span
            >秒
          </div>
          <div
            :class="{ grid: true, active: isGrid === 'bsGridComponent' }"
            @click="handerIsGrid('bsGridComponent')"
          ></div>
          <div
            :class="{ column: true, active: isGrid === 'bsColumnComponent' }"
            @click="handerIsGrid('bsColumnComponent')"
          ></div>
        </div>
      </div>
      <div class="tableBox">
        <!-- 产品列表 -->
        <component
          ref="componentRef"
          :is="isGrid"
          :productList="productList"
        ></component>
        <!-- 分页 -->
        <center
          :class="{
            myPagination: true,
            leftCheckbox: isGrid === 'bsColumnComponent'
          }"
        >
          <div class="left" v-show="isGrid === 'bsColumnComponent'">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>

            <el-button class="purchased" size="small" @click="handelrPurchased">
              <i class="selectionCart"></i>
              <span>本页选中一键加购</span>
            </el-button>
          </div>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[12, 24, 36, 48]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
          >
          </el-pagination>
        </center>
      </div>
    </div>
    <div class="footer" v-if="totalCount >= 7">
      <img src="@/assets/images/footerBg.png" alt="" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsColumnComponent";
import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsTableItem";
import bsGridComponent from "@/components/bsComponents/bsProductSearchComponent/bsGridComponent";
import eventBus from "@/assets/js/common/eventBus";
export default {
  name: "bsSpotProducts",
  components: {
    bsColumnComponent,
    bsGridComponent
  },
  data() {
    return {
      isGrid: "bsGridComponent",
      keyword: null,
      dateTime: null,
      productList: [],
      totalCount: 0,
      pageSize: 12,
      currentPage: 1,
      selectTableData: null,
      isIndeterminate: false,
      checkAll: false,
      searchHttpTime: null
    };
  },
  methods: {
    // 获取列表
    async getProductsList() {
      let startDate = Date.now();
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        typeId: 3,
        parentCode: "all",
        keyword: this.keyword,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/GetProductsByTypePage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.productList = res.data.result.item.items;
        let endDate = Date.now();
        this.searchHttpTime = (endDate - startDate) / 1000;
      }
    },
    // 去购物车
    toShoppingCart() {
      this.$router.push("/bsIndex/bsShoppingCart");
      const fd = {
        name: "/bsIndex/bsShoppingCart",
        linkUrl: "/bsIndex/bsShoppingCart",
        component: "bsShoppingCart",
        refresh: true,
        label: "购物车"
      };
      this.$store.commit("myAddTab", fd);
    },
    // 切换产品列表样式
    handerIsGrid(type) {
      this.isGrid = type;
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getProductsList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getProductsList();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getProductsList();
    },
    // 点击全选
    handleCheckAllChange(val) {
      let myTableRef = this.$refs.componentRef.$refs.bsTableItemRef.$refs
        .myTableRef;
      if (val) myTableRef.toggleAllSelection();
      else myTableRef.clearSelection();
      this.isIndeterminate = false;
    },
    // 一键加购
    handelrPurchased() {
      this.$confirm("确定要加购选中的产品吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const selectProducts = this.$refs.componentRef.$refs.bsTableItemRef
            .$refs.myTableRef.selection;

          let productNumber = [];
          for (let i = 0; i < selectProducts.length; i++) {
            productNumber.push(selectProducts[i].productNumber);
          }
          const fd = {
            userID: this.userInfo.userInfo.id,
            companyNumber: this.userInfo.commparnyList[0].companyNumber,
            sourceFrom: "active",
            number: 1,
            currency: "￥",
            Price: 0,
            shopType: "companysamples",
            productNumber: productNumber.join()
          };
          const res = await this.$http.post("/api/AddShoppingCart", fd);
          if (res.data.result.code === 200) {
            this.$store.commit(
              "handlerShoppingCartCount",
              res.data.result.item
            );
            this.$common.handlerMsgState({
              msg: " 一键加购成功",
              type: "success"
            });
            this.getProductsList();
          } else {
            this.$common.handlerMsgState({
              msg: " 一键加购失败",
              type: "danger"
            });
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "已取消一键加购",
            type: "warning"
          });
        });
    }
  },
  created() {
    this.getProductsList();
  },
  mounted() {
    // 选择中的产品
    eventBus.$on("handleSelectionChangeBus", selection => {
      this.selectTableData = selection;
      if (selection.length) {
        if (selection.length === this.productList.length) {
          this.isIndeterminate = false;
          this.checkAll = true;
        } else this.isIndeterminate = true;
      } else {
        this.isIndeterminate = false;
        this.checkAll = false;
      }
    });
    // 取消收藏/刷新页面
    eventBus.$on("resetProductCollection", item => {
      // this.getProductsList();
      for (let i = 0; i < this.productList.length; i++) {
        if (this.productList[i].productNumber == item.productNumber) {
          this.productList[i].isFavorite = item.isFavorite;
        }
      }
    });
    // 取消或加购样式/刷新页面
    eventBus.$on("resetProductIsShop", item => {
      for (let i = 0; i < this.productList.length; i++) {
        if (this.productList[i].productNumber == item.productNumber) {
          this.productList[i].isShop = item.isShop;
        }
      }
    });
  },
  computed: { ...mapState(["userInfo", "myShoppingCartCount"]) },
  watch: {},
  beforeDestroy() {
    eventBus.$off("resetProductCollection");
    eventBus.$off("resetProductIsShop");
    eventBus.$off("handleSelectionChangeBus");
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.BsSpotProducts {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .title {
    height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      flex: 1;
    }
    &::before {
      width: 4px;
      height: 14px;
      background-color: #3368a9;
      position: absolute;
      left: 0;
      top: 50%;
      content: "";
      transform: translate(0, -50%);
    }
    .right {
      .whiteCart {
        display: inline-block;
        vertical-align: bottom;
        width: 14px;
        height: 14px;
        background: url("~@/assets/images/whiteCart.png") no-repeat center;
        background-size: contain;
        margin-right: 10px;
      }
    }
  }
  .searchBox {
    height: 76px;
    display: flex;
    align-items: center;
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      .item {
        display: flex;
        align-items: center;
        max-width: 290px;
        margin-right: 20px;
        .label {
          width: 58px;
          min-width: 58px;
        }
      }
    }
    .right {
      display: flex;
      width: 250px;
      min-width: 250px;
      .searchTime {
        margin-right: 40px;
        span {
          color: #3368a9;
        }
      }
      .grid,
      .column {
        width: 17px;
        height: 17px;
        cursor: pointer;
      }
      .grid {
        margin-right: 25px;
        background: url("~@/assets/images/gridIcon.png") no-repeat center;
        background-size: contain;
        &.active {
          background: url("~@/assets/images/gridActiveIcon.png") no-repeat
            center;
          background-size: contain;
        }
      }
      .column {
        background: url("~@/assets/images/columnIcon.png") no-repeat center;
        background-size: contain;
        &.active {
          background: url("~@/assets/images/columnActiveIcon.png") no-repeat
            center;
          background-size: contain;
        }
      }
    }
  }
  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
      .imgBox {
        text-align: left;
        display: flex;
        font-size: 14px;
        .productName {
          width: 190px;
          height: 60px;
          margin-left: 15px;
          .name,
          .factory {
            width: 190px;
            max-width: 190px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .factory {
            color: #3368a9;
          }
          .name {
            margin-top: 8px;
          }
        }
      }
    }
    .errorImg {
      img {
        width: 80px;
        height: 60px;
      }
    }
  }
  .myPagination {
    padding: 30px 0;
  }
  .leftCheckbox {
    display: flex;
    align-items: center;
    width: 80%;

    .left {
      display: flex;
      align-items: center;
      padding: 0 300px 0 20px;
      .purchased {
        margin-left: 30px;
        color: #3368a9;
        border: 1px solid #3368a9;
        .selectionCart {
          display: inline-block;
          vertical-align: bottom;
          width: 14px;
          height: 14px;
          background: url("~@/assets/images/selectionCart.png") no-repeat center;
          background-size: contain;
          margin-right: 10px;
        }
      }
    }
  }
}
.footer {
  margin-top: 20px;
  background-color: #f1f3f6;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
