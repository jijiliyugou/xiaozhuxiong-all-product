<template>
  <div class="bsQuotationSettings">
    <div class="title">报价设置 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="left">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            clearable
            v-model="keyword"
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
        </div>
        <div class="item" v-if="userInfo.userInfo.isMain">
          <span class="label">业务员：</span>
          <el-select
            v-model="staffId"
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
      <el-button
        @click="openAddFormula"
        type="primary"
        icon="el-icon-plus"
        size="medium"
      >
        新增报价公式
      </el-button>
    </div>
    <div class="tableBox">
      <Table :table="tableData"></Table>
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
    <!-- 新增报价公式dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      v-if="showDialog"
      width="800px"
    >
      <bsAddOfferFormula
        :editRow="editRow"
        :isEdit="isEdit"
        @submit="submit"
        @close="close"
      />
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/table";
import bsAddOfferFormula from "@/components/bsComponents/bsPersonalManageComponent/bsAddOfferFormula";
import { mapState } from "vuex";
export default {
  name: "bsQuotationSettings",
  components: {
    bsAddOfferFormula,
    Table
  },
  data() {
    return {
      staffList: [],
      staffId: null,
      dialogTitle: "新增报价公式",
      isEdit: false,
      editRow: {},
      showDialog: false,
      keyword: null,
      dateTime: null,
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: true,
        columns: [
          { prop: "name", label: "模板名称" },
          { prop: "offerMethod", label: "报价方式", isHiden: true },
          { prop: "cu_deName", label: "币种" },
          { prop: "exchange", label: "汇率" },
          { prop: "profit", label: "利润率" },
          { prop: "size", label: "每车尺码" },
          { prop: "rejectionMethod", label: "取舍方式" },
          { prop: "miniPrice", label: "价格小于" },
          { prop: "staffName", label: "业务员" },
          {
            prop: "createdOn",
            label: "创建时间",
            width: 150,
            render: row => {
              return row.createdOn && row.createdOn.replace(/T.*/, "");
            }
          }
        ],
        btnWidth: 200,
        actions: [
          {
            classWrapper: () => {
              return "primary";
            },
            textWrapper: () => {
              return "编辑";
            },
            methods: row => {
              this.openEdit(row);
            }
          },
          {
            classWrapper: () => {
              return "danger";
            },
            textWrapper: () => {
              return "删除";
            },
            methods: row => {
              this.handleDelete(row);
            }
          }
        ]
      }
    };
  },
  methods: {
    // 搜索
    search() {
      this.currentPage = 1;
      this.getOfferFormula();
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
      this.getOfferFormula();
    },
    // 提交新增
    async submit(formData) {
      console.log(formData);
      let msg = "新增报价公式成功";
      let url = "/api/CreateProductOfferFormula";
      if (this.isEdit) {
        msg = "编辑报价公式成功";
        url = "/api/UpdateProductOfferFormula";
      }
      const res = await this.$http.post(url, formData);
      if (res.data.result.code === 200) {
        this.getOfferFormula();
        this.showDialog = false;
        this.$common.handlerMsgState({
          msg: msg,
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 删除报价公式
    async handleDelete(row) {
      this.$confirm("确定要删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post("/api/DeleteProductOfferFormula", {
            isdelete: true,
            id: row.id
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.getOfferFormula();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "已取消删除",
            type: "warning"
          });
        });
    },
    // 关闭新增报价公式
    close() {
      this.showDialog = false;
    },
    // 打开编辑报价公式
    openEdit(row) {
      this.editRow = row;
      this.isEdit = true;
      this.dialogTitle = "编辑报价公式";
      this.showDialog = true;
    },
    // 打开新增报价公式
    openAddFormula() {
      this.isEdit = false;
      this.dialogTitle = "新增报价公式";
      this.showDialog = true;
    },
    // 获取报价公式
    async getOfferFormula() {
      const fd = {
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1],
        keyword: this.keyword,
        staffId: this.staffId,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/ProductOfferFormulaPage", fd);
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
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
      this.getOfferFormula();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getOfferFormula();
    }
  },
  created() {},
  mounted() {
    this.getStaffList();
  },
  computed: {
    ...mapState(["userInfo", "currentComparnyId"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsQuotationSettings {
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
