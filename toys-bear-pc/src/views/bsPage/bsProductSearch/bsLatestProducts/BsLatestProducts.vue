<template>
  <div class="bsMyCollection">
    <div class="title">
      <div class="titleLeft">
        <span>最新产品 ({{ totalCount }})</span>
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
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            type="text"
            size="medium"
            v-model="keyword"
            clearable
            placeholder="请输入关键词"
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
      <component :is="isGrid" :productList="tableData"></component>
      <!-- 分页 -->
      <center style="padding:20px 0;">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[12, 24, 36, 48]"
          background
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
  </div>
</template>

<script>
import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsColumnComponent";
import bsGridComponent from "@/components/bsComponents/bsProductSearchComponent/bsGridComponent";
import { mapGetters } from "vuex";
import eventBus from "@/assets/js/common/eventBus";
export default {
  name: "bsLatestProducts",
  components: {
    bsColumnComponent,
    bsGridComponent
  },
  data() {
    return {
      isGrid: "bsGridComponent",
      keyword: null,
      dateTime: null,
      tableData: [],
      totalCount: 0,
      pageSize: 12,
      currentPage: 1
    };
  },
  methods: {
    // 获取列表
    async getProductsList() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        typeId: 2,
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
        if (this.shoppingList) {
          const item = res.data.result.item;
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
        this.tableData = res.data.result.item.items;
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
    }
  },
  created() {
    this.getProductsList();
  },
  mounted() {
    // 取消收藏
    eventBus.$on("resetProducts", list => {
      if (list.length) {
        for (let i = 0; i < this.tableData.length; i++) {
          for (let j = 0; j < list.length; j++) {
            if (this.tableData[i].productNumber == list[j].productNumber) {
              this.tableData[i].isFavorite = true;
              break;
            } else {
              this.tableData[i].isFavorite = false;
            }
          }
        }
      } else {
        this.tableData.forEach(val => {
          val.isFavorite = false;
        });
      }
    });
    // 删除购物车
    eventBus.$on("resetMyCart", list => {
      if (list.length) {
        for (let i = 0; i < this.tableData.length; i++) {
          for (let j = 0; j < list.length; j++) {
            if (this.tableData[i].productNumber == list[j].productNumber) {
              this.tableData[i].isShopping = true;
              break;
            } else {
              this.tableData[i].isShopping = false;
            }
          }
        }
      } else {
        this.tableData.forEach(val => {
          val.isShopping = false;
        });
      }
    });
  },
  computed: {
    ...mapGetters({
      shoppingList: "myShoppingList"
    })
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
      width: 60px;
      min-width: 60px;
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
}
</style>
