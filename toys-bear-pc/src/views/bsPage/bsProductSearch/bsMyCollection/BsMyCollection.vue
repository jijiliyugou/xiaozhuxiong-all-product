<template>
  <div>
    <div class="bsMyCollection">
      <div class="title">
        <div class="titleLeft">
          <span>我的收藏 ({{ totalCount }})</span>
        </div>
        <div class="right">
          <el-button type="warning" size="medium" @click="toShoppingCart">
            <i class="whiteCart"></i>
            <span>购物车</span>
            <span>({{ shoppingList.length }})</span>
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
              v-model="keyword"
              clearable
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
      <div class="productListBox">
        <!-- 产品列表 -->
        <component :is="isGrid" :productList="productList"></component>
        <!-- 分页 -->
        <center class="myPagination">
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
import eventBus from "@/assets/js/common/eventBus";
import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsColumnComponent";
import bsGridComponent from "@/components/bsComponents/bsProductSearchComponent/bsGridComponent";
import { mapGetters } from "vuex";
export default {
  name: "bsMyCollection",
  components: {
    bsColumnComponent,
    bsGridComponent
  },
  data() {
    return {
      isGrid: "bsGridComponent",
      keyword: null,
      dateTime: null,
      totalCount: 0,
      pageSize: 12,
      currentPage: 1,
      productList: [],
      searchHttpTime: null
    };
  },
  computed: {
    ...mapGetters({
      shoppingList: "myShoppingList"
    })
  },
  watch: {
    shoppingList: {
      deep: true,
      handler() {
        eventBus.$emit("upDateProductView");
      }
    }
  },
  methods: {
    // 获取列表
    async getCollectList() {
      let startDate = Date.now();
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.keyword,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/ProductCollectionPage", fd);
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        if (this.shoppingList) {
          for (let i = 0; i < item.items.length; i++) {
            for (let j = 0; j < this.shoppingList.length; j++) {
              if (
                item.items[i].productNumber ===
                this.shoppingList[j].productNumber
              )
                item.items[i].isShopping = true;
            }
          }
        }
        this.totalCount = res.data.result.item.totalCount;
        this.productList = res.data.result.item.items;
        let endDate = Date.now();
        this.searchHttpTime = (endDate - startDate) / 1000;
      } else {
        this.totalCount = 0;
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
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
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getCollectList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getCollectList();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getCollectList();
    },
    // 切换产品列表样式
    handerIsGrid(type) {
      this.isGrid = type;
    }
  },
  created() {},
  mounted() {
    this.getCollectList();
    // 取消收藏/刷新页面
    eventBus.$on("resetMyCollectionMenu", () => {
      this.getCollectList();
    });
    // 加购删除购物车
    eventBus.$on("resetMyCart", item => {
      if (Object.prototype.toString.call(item) === "[object Array]") {
        // 数组
        if (item.length) {
          for (let i = 0; i < this.productList.length; i++) {
            for (let j = 0; j < item.length; j++) {
              if (this.productList[i].productNumber == item[j].productNumber) {
                this.productList[i].isShopping = true;
                break;
              } else {
                this.productList[i].isShopping = false;
              }
            }
          }
        } else {
          this.productList.forEach(val => {
            val.isShopping = false;
          });
        }
      } else if (Object.prototype.toString.call(item) === "[object Object]") {
        // 对象
        for (let i = 0; i < this.productList.length; i++) {
          if (item.productNumber == this.productList[i].productNumber) {
            this.productList[i].isShopping = item.isShopping;
          }
        }
      }
    });
  },
  beforeDestroy() {
    eventBus.$off("resetMyCollectionMenu");
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsMyCollection {
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
    .titleLeft {
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
  .productListBox {
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;
    .myPagination {
      padding: 30px 0;
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
