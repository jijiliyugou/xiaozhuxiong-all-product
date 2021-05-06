<template>
  <div class="bsPurchaseOrder">
    <div class="title">采购订单 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="left">
        <div class="item">
          <span class="label">采购单号：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            v-model="searchForm.keyword"
            placeholder="请输入"
            clearable
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
      <div class="right">
        <el-button type="success" size="medium" @click="importOrder">
          <i class="iconfont icon-daochujinruchukou"></i>
          导入列表
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
        <el-table-column label="采购单号" width="200">
          <template slot-scope="scope">
            <div
              style="color: #3368a9; cursor: pointer"
              @click="toDetails(scope.row)"
            >
              {{ scope.row.orderNumber }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="业务员"
          prop="orgPersonnelName"
          align="center"
        ></el-table-column>
        <el-table-column label="操作时间" align="center" min-width="150">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.happenDate && scope.row.happenDate.replace(/T/, " ")
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sumAmountOu_lo"
          label="采购总数"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column label="总金额" align="center" width="100">
          <template slot-scope="scope">
            <div style="color: #eb1515">￥{{ scope.row.sumFa_pr_pr }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="pushContent"
          label="备注"
          align="center"
          min-width="200"
        >
        </el-table-column>
        <el-table-column prop="state" label="状态" align="center" width="100">
          <template slot-scope="scope">
            <span style="color: #f56c6c" v-if="scope.row.readStatus == 0">
              未读
            </span>
            <span style="color: #f56c6c" v-else-if="scope.row.readStatus == 1">
              已读
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="primary"> 推送 </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="exportOrder(scope.row)"
            >
              导出
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handlerDelete(scope.row)"
            >
              删除
            </el-button>
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
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        title="订单模板"
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        width="1200px"
      >
        <bsExportOrder
          :options="{
            orderNumber: orderRow.orderNumber,
            the_nu: orderRow.the_nu,
            name: orderRow.fromCompanyName,
            api: '/api/GetSampleOrderExcel'
          }"
        />
      </el-dialog>
    </transition>
  </div>
</template>

<script>
import bsExportOrder from "@/components/commonComponent/exportOrderComponent/caigoudingdan.vue";
import { mapState } from "vuex";
export default {
  name: "bsPurchaseOrder",
  components: {
    bsExportOrder
  },
  data() {
    return {
      staffList: [],
      orderRow: {},
      exportTemplateDialog: false,
      searchForm: {
        keyword: null,
        staffId: null,
        dateTime: null
      },
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  methods: {
    // 查看详情
    toDetails(row) {
      const fd = {
        name: row.orderNumber,
        linkUrl: this.$route.path,
        component: "bsPurchaseOrderDetails",
        refresh: true,
        label: row.orderNumber,
        value: row
      };
      this.$store.commit("myAddTab", fd);
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
      this.getTableDataList();
    },
    // 导入菜单
    importOrder() {
      alert("敬请期待");
    },
    // 删除
    handlerDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post("/api/DeleteERPOrder", {
            id: row.erpOrderID
          });
          const { code, msg } = res.data.result;
          if (code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.exportTemplateDialog = false;
            this.getTableDataList();
          } else {
            this.$common.handlerMsgState({
              msg: msg,
              type: "danger"
            });
            this.exportTemplateDialog = false;
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "取消删除",
            type: "warning"
          });
        });
    },
    // 导出
    exportOrder(row) {
      this.orderRow = row;
      this.exportTemplateDialog = true;
    },
    // 获取列表
    async getTableDataList() {
      const fd = {
        readStatus: "-1",
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.searchForm.keyword,
        staffId: this.searchForm.staffId,
        messageExt: 7,
        messageModel: 7,
        startTime: this.searchForm.dateTime && this.searchForm.dateTime[0],
        endTime: this.searchForm.dateTime && this.searchForm.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/GetERPOrderListByPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData = res.data.result.item.items;
      }
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getTableDataList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getTableDataList();
    }
  },
  created() {},
  computed: {
    ...mapState(["currentComparnyId", "userInfo"])
  },
  mounted() {
    this.getStaffList();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsPurchaseOrder {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
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
    .left {
      flex: 1;
      display: flex;
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
    .right {
      width: 150px;
      min-width: 150px;
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
