<template>
  <div class="bsMyClients">
    <div class="title">
      <div class="left">我的客户</div>
    </div>
    <div class="searchBox">
      <div class="left">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            v-model="keyword"
            clearable
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
      <div class="right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="medium"
          @click.stop="openAddMyClient"
        >
          新增客户
        </el-button>
      </div>
    </div>
    <div class="tableBox">
      <!-- 客户列表 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f9fafc' }"
      >
        <el-table-column label="序号" type="index" align="center" width="70">
        </el-table-column>
        <el-table-column prop="name" label="客户姓名" width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phoneNumber"
          label="电话"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="staffName"
          label="业务员"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column align="center" prop="createdOn" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="remark" label="备注">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
    <!-- 弹框编辑 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="closeDialog"
    >
      <el-form
        ref="formDataRef"
        :label-position="labelPosition"
        label-width="80px"
        :model="formData"
        :rules="rules"
      >
        <el-form-item label="客户姓名" prop="name">
          <el-input
            placeholder="请输入客户姓名"
            v-model="formData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户电话">
          <el-input
            placeholder="请输入客户电话"
            v-model="formData.phoneNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            placeholder="请输入客户邮箱"
            v-model="formData.email"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="formData.remark"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div style="margin: 20px"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogTitle == '新增客户' ? handleAdd() : handleUpdate()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "bsMyClients",
  data() {
    return {
      staffList: [],
      staffId: null,
      dialogTitle: "新增客户",
      dialogVisible: false,
      editRow: {},
      totalCount: 0,
      pageSize: 12,
      currentPage: 1,
      keyword: null,
      dateTime: null,
      showOpen: false,
      labelPosition: "right",
      tableData: [],
      formData: {
        name: null,
        PhoneNumber: null,
        email: null,
        remark: null
      },
      rules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    async getClientsListPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        staffId: this.staffId,
        keyword: this.keyword,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SearchCustomerInfosPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData = res.data.result.item.items;
      }
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
      this.getClientsListPage();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getClientsListPage();
    },

    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false;
    },
    //新增弹框
    openAddMyClient() {
      this.formData = {
        name: null,
        phoneNumber: null,
        remark: null
      };
      this.dialogTitle = "新增客户";
      this.dialogVisible = true;
    },
    //创建客户
    async handleAdd() {
      this.$refs.formDataRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            "/api/CreateCustomerInfo",
            this.formData
          );
          if (res.data.result.code === 200) {
            this.closeDialog();
            this.$common.handlerMsgState({
              msg: "新增操作成功",
              type: "success"
            });
            this.getClientsListPage();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        }
      });
    },
    //编辑客户
    handleEdit(index, row) {
      this.formData = JSON.parse(JSON.stringify(row));
      this.dialogTitle = "编辑客户";
      this.dialogVisible = true;
    },
    //编辑客户
    async handleUpdate() {
      this.$refs.formDataRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            "/api/UpdateCustomerInfo",
            this.formData
          );
          if (res.data.result.code === 200) {
            this.closeDialog();
            this.getClientsListPage();
            this.$common.handlerMsgState({
              msg: "编辑操作成功",
              type: "success"
            });
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        }
      });
    },
    //删除客户
    async handleDelete(row) {
      this.$confirm("此操作将永久删除该客户, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post(
            "/api/DeleteCustomerInfo?id=" + row.id
          );
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.getClientsListPage();
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
      this.getClientsListPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getClientsListPage();
    }
  },
  created() {},
  mounted() {
    this.getStaffList();
  },
  computed: {
    ...mapState(["currentComparnyId", "userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
@{deep} .el-table {
  color: #666;
  .nameBox {
    width: 300px;
    display: flex;
    align-items: center;
    .el-avatar {
      color: #3368a9;
      img {
        width: 40px;
        min-height: 40px;
      }
    }
  }
}
.el-dialog__header {
  border-bottom: 1px solid #ebebeb;
}
.bsMyClients {
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
    .left::before {
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
    .right {
      display: flex;
      width: 122px;
      min-width: 122px;
      margin-right: 50px;
    }
  }
}
</style>
