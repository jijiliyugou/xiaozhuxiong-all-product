<template>
  <div class="bsSampleQuotation">
    <div class="bsMyCollection">
      <div class="title">找样报价 ({{ totalCount }})</div>
      <div class="searchBox">
        <div class="item">
          <span class="label">报价单号：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            clearable
            v-model="searchForm.OfferNumber"
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
        </div>
        <div class="item">
          <span class="label">客户名称：</span>
          <el-input
            type="text"
            clearable
            size="medium"
            v-model="searchForm.CustomerName"
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
        </div>
        <div class="item" v-if="userInfo.userInfo.isMain">
          <span class="label">业务员：</span>
          <el-select
            v-model="searchForm.staffId"
            filterable
            size="medium"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in staffList"
              :key="item.id"
              :label="item.linkman"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="item" style="max-width: 300px">
          <span class="label">时间段：</span>
          <el-date-picker
            size="medium"
            value-format="yyyy-MM-ddTHH:mm:ss"
            v-model="searchForm.dateTime"
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
      <div class="tableBox">
        <bsTables :table="tableData" />
        <center style="padding: 20px 0">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 40]"
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
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        class="exportOrder"
        title="导出列表"
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        width="1200px"
      >
        <bsExportOrder :options="orderRow" />
      </el-dialog>
    </transition>
  </div>
</template>

<script>
import bsExportOrder from "@/components/commonComponent/exportOrderComponent/gongsizhaoyangbaojia.vue";
import eventBus from "@/assets/js/common/eventBus.js";
import bsTables from "@/components/table";
import { mapState } from "vuex";
import { proEnv, testEnv, devEnv } from "@/assets/js/config/config.js";
export default {
  name: "bsSampleQuotation",
  components: {
    bsExportOrder,
    bsTables
  },
  data() {
    return {
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: this.size,
        isIndex: true,
        columns: [
          {
            prop: "offerNumber",
            minWidth: 100,
            isHiden: true,
            label: "报价单号",
            event: row => {
              const fd = {
                name: "详情" + row.offerNumber,
                linkUrl: "/bsIndex/bsSampleQuotation",
                component: "bsSampleQuotationDetails",
                refresh: true,
                label: "详情" + row.offerNumber,
                value: row
              };
              this.$store.commit("myAddTab", fd);
            },
            isCallback: row => {
              return (
                "<span style='color: #3368a9; cursor: pointer;'>" +
                row.offerNumber +
                "</span>"
              );
            }
          },
          {
            prop: "customerName",
            isHiden: true,
            label: "客户名称"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "报价时间",
            render: row => {
              return row.createdOn ? row.createdOn.replace(/T.*/, "") : "";
            }
          },
          {
            prop: "linkman",
            isHiden: true,
            label: "业务员"
          },
          {
            prop: "total",
            isHiden: true,
            label: "报价总数"
          },
          {
            prop: "orgPersonnelName",
            isHiden: true,
            label: "总金额",
            color: "#eb1515",
            render: row => {
              return row.cu_de + row.offerTotalAmount;
            }
          },
          {
            prop: "cu_deName",
            isHiden: true,
            label: "币种"
          },
          {
            prop: "exchange",
            isHiden: true,
            label: "汇率"
          },
          {
            prop: "profit",
            isHiden: true,
            label: "利润"
          },
          {
            prop: "status",
            isHiden: true,
            label: "状态",
            render(row) {
              let str = "";
              switch (row.status) {
                case 0:
                  str = "未审核";
                  break;
                case 1:
                  str = "审核通过";
                  break;
                case 2:
                  str = "审核不通过";
                  break;
              }
              return str;
            }
          }
        ],
        actions: [
          {
            type: "success",
            textWrapper() {
              return "编辑";
            },
            hidden(row) {
              return row.offerNumber[0] != "S";
            },
            methods: row => {
              const fd = {
                name: "编辑" + row.offerNumber,
                linkUrl: "/bsIndex/bsSampleQuotation",
                component: "bsSampleUpdata",
                refresh: true,
                label: "编辑" + row.offerNumber,
                value: row
              };
              this.$store.commit("myAddTab", fd);
            }
          },
          {
            type: "info",
            textWrapper() {
              return "推送";
            },
            hidden(row) {
              return row.offerNumber[0] != "S";
            },
            methods: row => {
              console.log(row);
            }
          },
          {
            type: "danger",
            textWrapper() {
              return "删除";
            },
            hidden(row) {
              return row.offerNumber[0] != "S";
            },
            methods: row => {
              this.handleDelete(row);
            }
          },
          {
            type: "warning",
            textWrapper() {
              return "导出";
            },
            methods: row => {
              this.exportOrder(row);
            }
          },
          {
            type: "warning",
            color: "#F9AE3E",
            textWrapper() {
              return "分享";
            },
            methods: row => {
              this.copyShare(row);
            },
            class: "copy"
          }
        ]
      },
      staffList: [],
      orderRow: {},
      exportTemplateDialog: false,
      rowUpdata: {},
      searchForm: {
        orderNumber: null,
        OfferNumber: null,
        CustomerName: null,
        staffId: null,
        clientName: null,
        contacts: null,
        dateTime: null
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  methods: {
    // 导出找样
    exportOrder(row) {
      if (!row.total) {
        this.$common.handlerMsgState({
          msg: "该报价单没有产品信息",
          type: "danger"
        });
        return false;
      }
      this.orderRow = {
        sampleNumber: row.offerNumber,
        name: row.customerName,
        api: "/api/ExportSampleOfferToExcel"
      };
      this.exportTemplateDialog = true;
    },
    // 获取列表
    async getCompanySamplelistPage() {
      const fd = {
        OfferNumber: this.searchForm.OfferNumber,
        CustomerName: this.searchForm.CustomerName,
        staffId: this.searchForm.staffId,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        startTime: this.searchForm.dateTime && this.searchForm.dateTime[0],
        endTime: this.searchForm.dateTime && this.searchForm.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/ProductOfferListByPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData.data = res.data.result.item.items;
      }
    },
    // 删除找样报价
    async handleDelete(row) {
      this.$confirm("此操作将永久删除该订单, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post("/api/DeleteProductOffer", {
            id: row.id
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.getCompanySamplelistPage();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "取消删除",
            type: "warning"
          });
        });
    },
    // 获取公司下的员工列表
    async getStaffList() {
      const res = await this.$http.post("/api/CompanyUserList", {
        orgCompanyID: this.currentComparnyId
      });
      if (res.data.result.code === 200) {
        this.staffList = res.data.result.item.personnels;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      this.getCompanySamplelistPage();
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getCompanySamplelistPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getCompanySamplelistPage();
    },
    // 报价详情跳转
    async goDetails(row) {
      const fd = {
        name: "详情" + row.offerNumber,
        linkUrl: "/bsIndex/bsSampleQuotation",
        component: "bsSampleQuotationDetails",
        refresh: true,
        label: "详情" + row.offerNumber,
        value: row
      };
      this.$store.commit("myAddTab", fd);
    },
    // 推送跳转
    // toPushDetails(index, row) {
    //   const fd = {
    //     name: row.offerNumber + "报价推送",
    //     linkUrl: "/bsIndex/bsSampleQuotation",
    //     component: "bsPushIndex",
    //     refresh: true,
    //     noPush: true,
    //     label: "报价推送" + row.offerNumber,
    //     value: row
    //   };
    //   console.log(fd);
    //   this.$store.commit("myAddTab", fd);
    // },
    toPushDetails() {
      return false;
    },
    //编辑报价跳转
    async handleEdit(index, row) {
      console.log(row, "row");
      const fd = {
        name: "编辑" + row.offerNumber,
        linkUrl: "/bsIndex/bsSampleQuotation",
        component: "bsSampleUpdata",
        refresh: true,
        label: "编辑" + row.offerNumber,
        value: row
      };
      this.$store.commit("myAddTab", fd);
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getCompanySamplelistPage();
    },
    //分享链接
    copyShare(row) {
      const env = process.env.NODE_ENV;
      let target = devEnv.hosturl;

      // 默认是本地环境
      switch (env) {
        case "production": // 生产环境
          target = proEnv.hosturl;
          break;
        case "test": // 测试环境
          target = testEnv.hosturl;
          break;
        default:
          // 本地环境
          target = devEnv.hosturl;
          break;
      }
      var url = target + "share/#/offerSharing?id=" + row.offerNumber;
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.setAttribute("value", url);
      input.select();
      if (document.execCommand("Copy")) {
        document.execCommand("Copy");
        this.$message({
          message: "温馨提示：复制找样报价分享链接成功！",
          type: "success"
        });
      }
      document.body.removeChild(input);
    }
  },
  created() {},
  mounted() {
    this.getStaffList();
    eventBus.$on("resetSamplelist", () => {
      this.getCompanySamplelistPage();
    });
  },
  computed: {
    ...mapState(["currentComparnyId", "userInfo"])
  },
  beforeDestroy() {
    eventBus.$off("resetSamplelist");
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsSampleQuotation {
  padding: 0 20px;
  min-height: 100%;
  background-color: #fff;
  .title {
    height: 55px;
    line-height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
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
  }
  .searchBox {
    height: 76px;
    display: flex;
    align-items: center;
    .item {
      display: flex;
      align-items: center;
      max-width: 290px;
      margin-right: 20px;
      .label {
        width: 70px;
        min-width: 70px;
      }
    }
  }
  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
      .cell {
        padding: 0 2px;
      }
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
  @{deep} .exportOrder {
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
