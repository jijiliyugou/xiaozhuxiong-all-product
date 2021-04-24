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
        <div class="item">
          <span class="label">操作人员：</span>
          <el-input
            type="text"
            size="medium"
            clearable
            v-model="searchForm.Linkman"
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
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
        <el-table
          :data="tableData"
          style="width: 100%"
          ref="collecTable"
          :header-cell-style="{ backgroundColor: '#f9fafc' }"
        >
          <el-table-column label="序号" type="index" align="center" width="70">
          </el-table-column>
          <el-table-column label="报价单号" min-width="150">
            <template slot-scope="scope">
              <span
                @click="goDetails(scope.row)"
                style="color: #3368a9; cursor: pointer"
              >
                {{ scope.row.offerNumber }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="customerName"
            label="客户名称"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createdOn"
            width="150"
            label="报价时间"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.createdOn.replace(/T/, " ") }}
            </template>
          </el-table-column>
          <el-table-column width="200" align="center" label="操作人员">
            <template slot-scope="scope">
              <span>
                {{ scope.row.linkman }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="报价总数"
            prop="total"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column label="总金额" align="center" width="100">
            <template slot-scope="scope">
              <span style="color: #eb1515">
                {{ scope.row.cu_de }}
              </span>
              <span style="color: #eb1515">
                {{ scope.row.offerTotalAmount }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="币种" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.cu_deName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="汇率" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.exchange }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="profit"
            label="利润"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              {{
                scope.row.status === 0
                  ? "未审核"
                  : scope.row.status === 1
                  ? "审核通过"
                  : "审核不通过"
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            align="center"
            width="300"
          >
            <template slot-scope="scope">
              <el-button
                v-show="scope.row.offerNumber.indexOf('S') < 0"
                size="mini"
                type="success"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                v-show="scope.row.offerNumber.indexOf('S') < 0"
                size="mini"
                type="info"
                >推送</el-button
              >
              <el-button
                size="mini"
                @click="exportOrder(scope.row)"
                type="warning"
              >
                导出
              </el-button>
              <el-button
                v-show="scope.row.offerNumber.indexOf('S') < 0"
                style="margin-left: 10px"
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
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
        title="订单模板"
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        top="60px"
        width="80%"
      >
        <bsExportOrder :options="orderRow" />
      </el-dialog>
    </transition>
  </div>
</template>

<script>
import bsExportOrder from "@/components/commonComponent/exportOrderComponent";
import eventBus from "@/assets/js/common/eventBus.js";
export default {
  name: "bsSampleQuotation",
  components: {
    bsExportOrder
  },
  data() {
    return {
      orderRow: {},
      exportTemplateDialog: false,
      rowUpdata: {},
      searchForm: {
        orderNumber: null,
        OfferNumber: null,
        CustomerName: null,
        Linkman: null,
        clientName: null,
        contacts: null,
        dateTime: null
      },
      tableData: [],
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
        Linkman: this.searchForm.Linkman,
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
        this.tableData = res.data.result.item.items;
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
        noPush: true,
        label: "详情" + row.offerNumber,
        value: row
      };
      this.$store.commit("myAddTab", fd);
    },
    //编辑报价跳转
    async handleEdit(index, row) {
      const fd = {
        name: "编辑" + row.offerNumber,
        linkUrl: "/bsIndex/bsSampleQuotation",
        component: "bsSampleUpdata",
        refresh: true,
        noPush: true,
        label: "编辑" + row.offerNumber,
        value: row
      };
      this.$store.commit("myAddTab", fd);
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getCompanySamplelistPage();
    }
  },
  created() {},
  mounted() {
    this.getCompanySamplelistPage();
    eventBus.$on("resetSamplelist", () => {
      this.getCompanySamplelistPage();
    });
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
