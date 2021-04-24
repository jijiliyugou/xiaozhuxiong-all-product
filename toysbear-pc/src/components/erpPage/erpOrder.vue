<template>
  <div class="erpOrderBox">
    <!-- 头部 -->
    <div class="toplauotBox">
      <div class="toplauot">
        <div class="left">
          <el-image
            style="width: 76px; height: 76px"
            :src="require('@/assets/images/logo.png')"
            fit="contain"
          ></el-image>
          <div class="titleBox">
            <div class="chTitle">
              小竹熊订单同步管理
            </div>
            <div class="enTitle">
              Shenzhen Little Bamboo Bear Technology co.,Ltd.
            </div>
          </div>
        </div>
        <div class="right">
          <div class="shouyeBox">
            <i class="homeIcon"></i>
            <span class="homeText" @click="toHome">首页</span>
          </div>
          <div class="shouyeBox" @click="resetSample">
            <i class="mySampleIcon"></i>
            <span class="sampleText">
              我的订单
            </span>
          </div>
          <!-- <div class="loginBtn" @click="toLogins">登录系统</div> -->
          <div class="signOutBox">
            <el-image
              class="userImg"
              :src="$store.state.userInfo.userInfo.userImage"
            >
              <div slot="error" class="image-slot">
                <img
                  style="width: 40px; height: 40px; borderRadius: 50%;"
                  :src="require('@/assets/images/logo.png')"
                  alt
                />
              </div>
            </el-image>
            <span class="signOut" @click="signOut">退出</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表区 -->
    <template v-if="!isOrderDetial">
      <!-- 条件搜索区 -->
      <div class="searchBox">
        <el-form
          :inline="true"
          label-position="right"
          label-width="100px"
          size="small"
          :model="searchFD"
          class="demo-form-inline"
        >
          <div class="items">
            <div class="itemBox">
              <el-form-item label="关键查询：">
                <el-input
                  clearable
                  @keyup.enter.native="search"
                  v-model="searchFD.keyword"
                  placeholder="输入关键字"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </div>
            <div class="itemBox">
              <el-form-item label="来源：">
                <el-select
                  v-model="searchFD.orderFrom"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in [
                      {
                        label: '全部',
                        value: '全部'
                      },
                      {
                        label: '展厅',
                        value: 'Hall'
                      },
                      {
                        label: '小竹熊',
                        value: 'LittleBear'
                      }
                    ]"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="itemBox">
              <el-form-item label="订单类型：">
                <el-select
                  v-model="searchFD.orderType"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in [
                      {
                        label: '全部',
                        value: '全部'
                      },
                      {
                        label: '择样',
                        value: 'Sample'
                      },
                      {
                        label: '找样',
                        value: 'CompanySample'
                      },
                      {
                        label: '客户订单',
                        value: 'ShareOrder'
                      }
                    ]"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="items">
            <div class="itemBox">
              <el-form-item label="订单编号：">
                <el-input
                  clearable
                  @keyup.enter.native="search"
                  v-model="searchFD.orderNumber"
                  placeholder="请输入"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </div>
            <div class="itemBox">
              <el-form-item label="日期：">
                <!-- type="daterange" -->
                <el-date-picker
                  v-model="dateTile"
                  value-format="yyyy-MM-ddTHH:mm:ss"
                  :picker-options="pickerOptions"
                  type="daterange"
                  range-separator="—"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="itemBox">
              <el-button
                type="primary"
                class="searchBtn"
                size="small"
                @click="search"
                >搜索</el-button
              >
            </div>
          </div>
        </el-form>
      </div>
      <!-- table表格区 -->
      <div class="tableBox">
        <div class="tableWrap">
          <el-table
            :max-height="600"
            @sort-change="sort_change"
            :header-cell-style="{ backgroundColor: '#2D60B3', color: '#fff' }"
            :data="tableList"
            id="myTable"
            ref="singleTable"
            size="medium"
            tooltip-effect="dark"
            highlight-current-row
            @current-change="handleSelectionChange"
          >
            <el-table-column label="选择" width="50" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="hall_na" label="订单来源" align="center">
              <template slot-scope="scope">
                {{ scope.row.hall_na }}
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="订单类型" align="center">
              <template slot-scope="scope">
                {{
                  scope.row.orderType == "Sample"
                    ? "择样"
                    : scope.row.orderType == "CompanySample2"
                    ? "找样"
                    : scope.row.orderType == "CompanySample"
                    ? "找样"
                    : scope.row.orderType == "ShareOrder"
                    ? "客户订单"
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column prop="toCompanyName" label="客户" align="center">
              <template slot-scope="scope">
                {{ scope.row.toCompanyName }}
              </template>
            </el-table-column>
            <el-table-column prop="the_nu" label="本次代号" align="center">
              <template slot-scope="scope">
                {{ scope.row.the_nu }}
              </template>
            </el-table-column>
            <el-table-column prop="orderCount" label="订单数量" align="center">
              <template slot-scope="scope">
                {{ scope.row.orderCount }}
              </template>
            </el-table-column>
            <el-table-column prop="number" label="订单编号" align="center">
              <template slot-scope="scope">
                {{ scope.row.number }}
              </template>
            </el-table-column>
            <el-table-column
              prop="number"
              width="200"
              label="订单备注"
              align="center"
            >
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.remark"
                  placement="top"
                >
                  <div class="remarkClass">
                    {{
                      scope.row.remark && scope.row.orderType != "Sample"
                        ? scope.row.remark
                        : ""
                    }}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="happenDate"
              label="日期"
              sortable="custom"
              align="center"
            >
              <template slot-scope="scope">
                {{
                  scope.row.happenDate &&
                    scope.row.happenDate.replace(/t[\s\S]+/gi, " ")
                }}
              </template>
            </el-table-column>
            <el-table-column label="订单明细" align="center">
              <template slot-scope="scope">
                <span class="openDetail" @click.stop="openDetail(scope.row)"
                  >点击查看</span
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="erweimaWrap">
            <erweimaComponent />
          </div>
        </div>
        <center class="paginationWrap">
          <el-pagination
            layout="total, sizes, prev, pager, next"
            background
            :total="totalCount"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            @current-change="currentChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </center>
      </div>
    </template>
    <!-- 详情 -->
    <div v-else>
      <erpSampleDetails
        @resetCurrentValue="resetCurrentValue"
        @fanhui="fanhui"
        :option="currentSample"
      />
    </div>
    <!-- 隐藏的输入框 -->
    <el-input
      id="SampleOrder"
      v-model="currentValue"
      placeholder="隐藏域"
      type="hidden"
    ></el-input>
    <!-- 旧版模板 -->
    <!-- <div class="erweimaApp" @mouseenter="hoverLogo" @mouseleave="hoverIsLogo">
      <img class="jiaerweima" :src="jiaerweima" alt="" />
      <div class="saomaDiv" v-show="isActive">
        <div class="saoma"></div>
      </div>
    </div>
    <div class="titleBox">
      <div class="logo">
        <img src="~@/assets/images/logo.png" alt="" />
      </div>
      <h1 class="title">同步择样订单</h1>
      <div class="titleEn">
        <span class="titleEnSpan">Synchronize orders</span>
      </div>
    </div>
    <div class="synchronizeOrders">
      <el-table
        :header-cell-style="{ backgroundColor: '#8bc4ff', color: '#fff' }"
        :data="tableList"
        id="myTable"
        border
        ref="singleTable"
        size="medium"
        height="570"
        tooltip-effect="dark"
        highlight-current-row
        @current-change="handleSelectionChange"
      >
        <el-table-column label="选择" width="50" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="hall_na"
          label="择样来源"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="the_nu"
          label="本次代号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="number"
          label="择样编号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="happenDate"
          label="择样时间"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            {{
              scope.row.happenDate &&
                scope.row.happenDate.replace(/t[\s\S]+/gi, "")
            }}
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;">
        <div class="myPagination">
          <div class="total">
            共
            <span style="color:#165af7;font-weight:bold;">{{ totalCount }}</span>
            条
          </div>
          <div class="pages" v-show="tableList && tableList.length > 1">
            <div class="shouye" @click="toOnePage">首页</div>
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              background
              prev-text="上一页"
              next-text="下一页"
              :total="totalCount"
              :page-size="pageSize"
              :current-page.sync="currentPage"
              :page-sizes="[6, 9, 15, 30]"
              @current-change="currentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </div>
        </div>
      </center>
      <el-input
        id="SampleOrder"
        v-model="currentValue"
        placeholder="隐藏域"
        type="hidden"
      ></el-input>
    </div> -->
  </div>
</template>

<script>
import erweimaComponent from "./erweimaComponent";
import erpSampleDetails from "./erpSampleDetails";
export default {
  components: {
    erweimaComponent,
    erpSampleDetails
  },
  data() {
    return {
      sortOrder: null,
      sortType: null,
      dateTile: null,
      searchFD: {
        keyword: null,
        orderFrom: "全部",
        orderType: "全部",
        startTime: null,
        endTime: null,
        orderNumber: null
      },
      currentSample: null,
      isOrderDetial: false,
      jiaerweima: require("@/assets/images/erweimaicon@2x.png"),
      isActive: false,
      value: null,
      currentSelectItem: {
        // 选中的值
        token:
          this.$store.state.userInfo && this.$store.state.userInfo.accessToken,
        number: null,
        orderType: null
      },
      tableList: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {
    currentValue() {
      return JSON.stringify(this.currentSelectItem);
    }
  },
  methods: {
    // 返回事件
    fanhui() {
      this.isOrderDetial = false;
      this.currentSelectItem = {
        number: null,
        orderType: null,
        token:
          this.$store.state.userInfo && this.$store.state.userInfo.accessToken
      };
    },
    // 详情选择可导出
    resetCurrentValue(val) {
      this.currentSelectItem = val;
    },
    // 时间排序
    sort_change(column) {
      this.sortOrder = 2;
      switch (column.order) {
        case "descending": // 降序
          this.sortType = 1;
          break;
        case "ascending": // 升序
          this.sortType = 2;
          break;
        default:
          this.sortOrder = null;
          this.sortType = null;
          break;
      }
      this.currentPage = 1;
      this.getOrderList();
    },
    resetSample() {
      this.isOrderDetial = false;
    },
    // 退出登录
    signOut() {
      this.$router.push("/erpLogin?id=signOut");
    },
    // 去详情页
    openDetail(item) {
      this.currentSample = item;
      this.isOrderDetial = true;
    },
    // 去主页
    toHome() {
      this.$router.push("/erpHome");
    },
    // 去登录页
    toLogins() {
      this.$router.push("/erpLogin");
    },
    toOnePage() {
      if (this.currentPage === 1) {
        this.$message.error("已经在首页了呢");
        return;
      }
      this.currentPage = 1;
      this.getOrderList();
    },
    hoverLogo() {
      this.isActive = true;
      this.jiaerweima = require("@/assets/images/erweima2.png");
    },
    hoverIsLogo() {
      this.jiaerweima = require("@/assets/images/erweimaicon@2x.png");
      this.isActive = false;
    },
    async waitTime(s) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, 1000 * s);
      });
    },
    currentChange(page) {
      this.currentPage = page;
      this.getOrderList();
    },
    handleSizeChange(pages) {
      this.pageSize = pages;
      if (this.currentPage * pages > this.totalCount && this.currentPage != 1)
        return;
      this.getOrderList();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getOrderList();
    },
    // 获取列表
    async getOrderList() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        sortOrder: this.sortOrder,
        sortType: this.sortType,
        ...this.searchFD
      };
      if (this.dateTile) {
        fd.startTime = this.dateTile[0];
        fd.endTime = this.dateTile[1];
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "")
          delete fd[key];
      }
      const res = await this.$http.post("/api/SampleOrderERPPage", fd);
      if (res.data.result.code === 200) {
        this.tableList = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$message.error(res.data.result.message);
      }
    },
    handleSelectionChange(row) {
      if (row) {
        this.tableList.forEach(item => {
          // 排他,每次选择时把其他选项都清除
          switch (item.orderNumber) {
            case row.orderNumber:
              item.checked = true;
              break;
            default:
              item.checked = false;
              break;
          }
        });
        this.currentSelectItem.number = row.orderNumber;
        this.currentSelectItem.orderType = row.orderType;
      }
    }
  },
  mounted() {
    this.getOrderList();
  },
  async beforeDestroy() {
    //  this.$store.dispatch("getToken");
  }
};
</script>

<style lang="less" scoped>
@import "./erpOrder.less";
// @deep: ~">>>";
// .erpOrderBox {
//   width: 800px;
//   height: 800px;
//   background: url("~@/assets/images/erpbg.png") no-repeat center;
//   background-size: 100%;
//   margin: 0 auto;
//   box-sizing: border-box;
//   padding: 60px 40px 0 40px;
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   .erweimaApp {
//     position: absolute;
//     right: 0;
//     width: 34px;
//     top: 110px;
//     height: 34px;
//     border: 1px solid #165af7;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     transform: translate(0, -50%);
//     &:hover {
//       background-color: #165af7;
//     }
//     .jiaerweima {
//       width: 18px;
//       height: 18px;
//       left: -50%;
//       top: 50%;
//     }
//     .saomaDiv {
//       position: absolute;
//       width: 120px;
//       height: 100px;
//       left: -110px;
//       .saoma {
//         width: 100px;
//         height: 100px;
//         position: absolute;
//         box-sizing: border-box;
//         background: url("~@/assets/images/erweimaxiazai.png") no-repeat center;
//         background-size: 100%;
//         &::after {
//           content: "";
//           display: block;
//           position: absolute;
//           right: -19px;
//           top: 50%;
//           width: 0;
//           height: 0;
//           border: 10px solid transparent;
//           border-left-color: #fff;
//         }
//       }
//     }
//   }
//   .titleBox {
//     height: 100px;
//     width: 100%;
//     text-align: center;
//     box-sizing: border-box;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     position: relative;
//     .logo {
//       position: absolute;
//       top: 50%;
//       height: 72px;
//       left: 0;
//       transform: translate(0, -50%);
//       img {
//         height: 72px;
//       }
//     }
//     .title {
//       width: 100%;
//       font-size: 25px;
//       padding: 0;
//       margin: 0;
//       vertical-align: top;
//       font-family: Source Han Sans CN;
//       font-weight: 500;
//       margin-bottom: 12px;
//       color: #000000;
//     }
//     .titleEn {
//       width: 100%;
//       font-size: 20px;
//       font-family: Source Han Sans CN;
//       font-weight: 400;
//       .titleEnSpan {
//         position: relative;
//         padding: 0 10px;
//         &::before,
//         &::after {
//           content: "";
//           position: absolute;
//           width: 60px;
//           height: 2px;
//           background-color: #165af7;
//           top: 50%;
//         }
//         &::before {
//           left: 100%;
//         }
//         &::after {
//           right: 100%;
//         }
//       }
//     }
//   }
//   .synchronizeOrders {
//     font-size: 12px;
//     width: 100%;
//     box-sizing: border-box;
//     @{deep} #myTable {
//       background: transparent;

//       @{deep} .el-table__body tr.current-row > td {
//         background-color: #e0f2ff !important;

//         /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
//       }
//       @{deep} tr.el-table__row {
//         background-color: transparent;
//       }

//       @{deep} .el-table__empty-block {
//         background: url("~@/assets/images/无数据.png") no-repeat center;
//         @{deep} .el-table__empty-text {
//           opacity: 0;
//         }
//       }
//     }
//     @{deep} .el-table--enable-row-hover .el-table__body tr:hover > td {
//       background-color: #f5fbff !important;
//       /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
//     }
//     @{deep} .el-table .sort-caret.ascending {
//       border-bottom-color: #fff;
//       top: 5px;
//     }
//     @{deep} .el-table .ascending .sort-caret.ascending {
//       border-bottom-color: #409eff;
//     }
//     @{deep} .el-table .sort-caret.descending {
//       border-top-color: #fff;
//     }
//     @{deep} .el-table .descending .sort-caret.descending {
//       border-top-color: #409eff;
//     }
//     .el-pagination {
//       position: relative;
//       @{deep} .el-pagination__total {
//         position: absolute;
//         left: 0;
//         font-weight: 400;
//         color: #606266;
//       }
//       @{deep} .el-pagination__jump,
//       @{deep}.btn-prev,
//       @{deep}.el-pager,
//       @{deep}.btn-next {
//         float: right;
//       }
//     }
//   }
// }
// .myPagination {
//   height: 32px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   font-size: 13px;
//   .pages {
//     display: flex;
//     align-items: center;
//     .shouye {
//       font-size: 13px;
//       margin-right: 10px;
//       cursor: pointer;
//     }
//     @{deep} .btn-next,
//     @{deep} .btn-prev {
//       background-color: transparent;
//       color: #000;
//     }
//   }
// }
// @media screen and (max-width: 1025px) {
//   .SynchronizeOrders {
//     width: 80%;
//     font-size: 20px;
//     #myTable {
//       width: 100%;
//     }
//   }
// }
// @media screen and (max-width: 415px) {
//   .SynchronizeOrders {
//     width: 100%;
//     font-size: 16px;
//     #myTable {
//       width: 100%;
//     }
//   }
// }
@{deep} .sort-caret {
  &.descending {
    border-top-color: #c0c4cc;
  }
  &.ascending {
    border-bottom-color: #c0c4cc;
  }
}
@{deep} .el-table .descending .sort-caret.descending {
  border-top-color: #fff;
}
@{deep} .el-table .ascending .sort-caret.ascending {
  border-bottom-color: #fff;
}
</style>
