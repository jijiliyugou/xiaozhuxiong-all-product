<template>
  <div>
    <div class="BsBrowsingFootprints">
      <div class="title">
        <div class="titleLeft">
          <span>浏览足迹 ({{ totalCount }})</span>
        </div>
        <div class="right">
          <el-button type="warning" size="medium" @click="toShoppingCart">
            <i class="whiteCart"></i>
            <span>购物车</span>
            <span>( {{ myShoppingCartCount }})</span>
          </el-button>
        </div>
      </div>
      <div class="searchBox">
        <div class="left">
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
          <div class="track" @click="emptyBrowse">
            <i class="el-icon-delete"></i>
            清空浏览足迹
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
      <div class="productListBox" v-infinite-scroll="scrollBrowsing">
        <!-- 产品列表 -->
        <div v-for="item in productList" :key="item.index">
          <div class="dateClassify">
            <div class="left">
              <i class="el-icon-date"></i>
              <h4>{{ item.browseDate }}</h4>
              <p>{{ item.dayCount }}件产品</p>
            </div>
            <p class="center"></p>
            <el-button
              class="btn"
              type="danger"
              size="medium"
              @click="deleteAllBrowse(item.browseDate)"
            >
              删除当天
            </el-button>
          </div>
          <component
            :is="isGrid"
            :selection="selection"
            :productList="item.list"
          ></component>
        </div>

        <!-- 分页 -->
        <!-- <center class="myPagination">
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
        </center> -->
      </div>
    </div>
    <div class="footer" v-if="totalCount >= 7">
      <img src="@/assets/images/footerBg.png" alt="" />
    </div>
  </div>
</template>

<script>
import eventBus from "@/assets/js/common/eventBus";
// import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsColumnComponent";
import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsTableItem";
import bsGridComponent from "@/components/bsComponents/bsProductSearchComponent/bsGridComponent";
import { mapState } from "vuex";
export default {
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
      pageSize: 48,
      currentPage: 1,
      productList: [],
      selection: false
      //   footprintArr: [],
    };
  },
  computed: {
    ...mapState(["myShoppingCartCount"])
  },
  watch: {},
  methods: {
    // 获取列表
    async getCollectList() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/GetBrowseProductRecordPage", fd);
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        let footprintArr = [];
        for (let i = 0; i < item.items.length; i++) {
          footprintArr.push(item.items[i]);
        }
        this.dataResort(footprintArr);
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.totalCount = 0;
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    },
    // 按照时间分类
    dataResort(items) {
      let newArr = [];
      items.forEach(function(item) {
        let index = -1;
        let alreadyExists = newArr.some(function(newData, j) {
          if (item.browseDate === newData.browseDate) {
            index = j;
            return true;
          }
        });
        if (!alreadyExists) {
          let list = [];
          list.push(item);
          newArr.push({
            dayCount: item.dayCount,
            browseDate: item.browseDate,
            list: list
          });
        } else {
          newArr[index].list.push(item);
        }
      });
      for (let i = 0; i < newArr.length; i++) {
        this.$set(this.productList, i, newArr[i]);
      }
    },
    // 清空登录记录
    async emptyBrowse() {
      const fd = {
        type: 3
      };
      this.$confirm("确定要清空吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post("/api/DeleteProductRecord", {
            fd
          });
          if (res.data.result.code === 200) {
            this.getCollectList();
            this.$common.handlerMsgState({
              msg: "清空成功",
              type: "success"
            });
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              error: "danger"
            });
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "已取消清空",
            type: "warning"
          });
        });
    },
    // 删除当天浏览记录
    async deleteAllBrowse(DeleteDate) {
      const fd = {
        deleteDate: DeleteDate,
        type: 1
      };
      const res = await this.$http.post("/api/DeleteProductRecord", fd);
      if (res.data.result.code === 200) {
        this.getCollectList();
        this.$common.handlerMsgState({
          msg: "删除成功",
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: "删除失败",
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
    // 下拉加载
    scrollBrowsing() {
      if (this.productList.length < this.currentPage) {
        return false;
      } else {
        this.currentPage++;
        if (this.currentPage * this.pageSize > this.totalCount) {
          if (
            this.currentPage >=
            Math.ceil(this.totalCount / this.pageSize) + 1
          ) {
            return false;
          }
        }
      }
      this.getCollectList();
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

    // 收藏
    eventBus.$on("resetProductCollection", item => {
      // this.getCollectList();
      for (let index = 0; index < this.productList.length; index++) {
        for (let i = 0; i < this.productList[index].list.length; i++) {
          if (
            this.productList[index].list[i].productNumber == item.productNumber
          ) {
            this.productList[index].list[i].isFavorite = item.isFavorite;
          }
        }
      }
    });
    // 刷新页面
    eventBus.$on("refreshHtml", () => {
      //   this.footprintArr = [];
      this.getCollectList();
    });
    // 取消或加购样式/刷新页面
    eventBus.$on("resetProductIsShop", item => {
      // console.log(this.productList);
      for (let i = 0; i < this.productList.length; i++) {
        for (let j = 0; j < this.productList[i].list.length; j++) {
          if (this.productList[i].list[j].productNumber == item.productNumber) {
            this.productList[i].list[j].isShop = item.isShop;
          }
        }
      }
      this.$forceUpdate();
    });
  },

  beforeDestroy() {
    eventBus.$off("refreshHtml");
    eventBus.$off("resetProductIsShop");
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.BsBrowsingFootprints {
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
      align-items: center;
      .track {
        margin-right: 55px;
        text-align: center;
        color: #666666;
        cursor: pointer;
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
    padding-bottom: 90px;
    .dateClassify {
      margin-top: 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        line-height: 30px;
        h4 {
          height: 30px;
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          color: #333333;
          margin: 0 12px;
        }
        p {
          color: #999999;
        }
      }
      .center {
        flex: 1;
        margin: 0 20px;
        width: 100%;
        height: 1px;
        background-color: #dcdfe6;
      }
    }

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
