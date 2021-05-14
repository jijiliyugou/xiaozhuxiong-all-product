<template>
  <div class="boxWrap">
    <!-- 嵌套新增员工 -->
    <el-dialog
      width="50%"
      top="50px"
      :title="employeeMan.employeeTitle"
      :visible.sync="innerVisible"
      v-if="innerVisible"
      destroy-on-close
      append-to-body
    >
      <!-- 新增编辑员工 -->
      <handlerStaff
        @submit="submit"
        @close="close"
        :row="addEmployeeForm"
        :isEdit="isEdit"
      />
    </el-dialog>
    <div class="addStaffBtn">
      <div class="left">
        <el-input
          clearable
          style="width: 250px;margin: 0 20px;"
          @keyup.enter.native="searchStaffList"
          v-model="staffKeyword"
          placeholder="输入关键字"
        ></el-input>
        <el-button type="primary" @click="searchStaffList">搜 索</el-button>
      </div>
      <div class="right">
        <el-button type="primary" @click="openAddemployee">新 增</el-button>
      </div>
    </div>
    <el-table
      :data="employeeList"
      style="width: 100%; font-size: 12px"
      :default-sort="{ prop: 'createdOn', order: 'descending' }"
    >
      <!-- v-loading="$store.state.vueElementLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" -->
      <el-table-column prop="userImage" label="头像" align="center" width="80">
        <template slot-scope="scope">
          <el-image
            shape="square"
            style="background-color: #165af7;width:50px;height:50px;color:#fff;"
            :src="scope.row.userImage"
            :key="scope.row.userImage"
            fit="cover"
          >
            <div
              slot="error"
              class="image-slot"
              style="width:100%;height:100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding:0 5px;
                  text-align:center;"
            >
              <span
                style="display: -webkit-box;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  text-overflow: clip;
                  -webkit-box-orient: vertical;"
                >{{ scope.row.linkman }}</span
              >
            </div>
            <div
              slot="placeholder"
              class="image-slot"
              style="width:100%;height:100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding:0 5px;
                  text-align:center;"
            >
              <span
                style="display: -webkit-box;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  text-overflow: clip;
                  -webkit-box-orient: vertical;"
                >{{ scope.row.linkman }}</span
              >
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="员工账号"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="linkman"
        label="昵称"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column
        prop="isMain"
        label="是否主账号"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.isMain ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="50" align="center">
        <template slot-scope="scope">{{
          scope.row.sex === 1 ? "男" : "女"
        }}</template>
      </el-table-column>
      <el-table-column
        prop="birthday"
        label="生日"
        align="center"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="enabled"
        label="是否激活"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.enabled ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="250" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="openBindEmployees(scope.row)"
            >绑定员工</el-button
          >
          <!-- <el-button size="mini" type="warning" @click="bindEmployees(scope.row,2)">解绑</el-button> -->
          <el-button
            size="mini"
            type="primary"
            @click="editEmployees(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            style="margin-left: 10px"
            title="确定要删除该员工吗？"
            @confirm="deleteEmployees(scope.row)"
          >
            <el-button size="mini" type="danger" slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <center style="margin-top: 20px">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        background
        :page-sizes="[10, 20, 30, 50]"
        :page-size="employeeMan.pageSize"
        :total="employeeMan.totalCount"
        :current-page.sync="employeeMan.currentPage"
        @current-change="employeeManCurrentChange"
        @size-change="employeeManSizeChange"
      ></el-pagination>
    </center>
    <!-- 嵌套员工关联dialog -->
    <el-dialog
      :title="relatedConfig.title"
      destroy-on-close
      :visible.sync="relatedConfig.relatedDialog"
      width="70%"
      append-to-body
    >
      <el-table
        :data="relatedConfig.relatedDataList"
        style="width: 100%; min-height: 300px"
        :default-sort="{ prop: 'createdOn', order: 'descending' }"
      >
        <el-table-column
          prop="client_acc_nu"
          label="员工账号"
        ></el-table-column>
        <el-table-column prop="client_nu" label="员工编号"></el-table-column>
        <el-table-column prop="hallNumber" label="展厅编号"></el-table-column>
        <el-table-column prop="linkman" label="联系人"></el-table-column>
        <el-table-column label="新增日期" prop="createdOn" sortable width="180">
          <template slot-scope="scope">
            {{
              scope.row.createdOn ? scope.row.createdOn.replace(/T/gi, " ") : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="personnelNo"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.personnelNo"
              style="color: #85ce61"
            ></i>
            <i class="el-icon-error" v-else style="color: #f581b0"></i>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          min-width="180"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-if="!scope.row.personnelNo"
              @click="bindEmployee(scope.row, 1)"
              >绑定</el-button
            >
            <el-button
              size="mini"
              type="danger"
              v-else
              @click="bindEmployee(scope.row, 2)"
              >取消绑定</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import handlerStaff from "@/components/staffManage/handlerStaff";
export default {
  components: {
    handlerStaff
  },
  props: ["currentCompany"],
  data() {
    return {
      isEdit: false,
      employeeList: [],
      staffKeyword: null,
      relatedConfig: {
        title: "员工绑定",
        relatedDialog: false,
        relatedDataList: [],
        totalCount: 10,
        currentPage: 1,
        pageSize: 10,
        id: null,
        phoneNumber: null
      },
      employeeMan: {
        title: "员工管理",
        dialog: false,
        totalCount: 100,
        currentPage: 1,
        pageSize: 10,
        companyNumber: null,
        phoneNumber: null,
        id: null,
        employeeTitle: "新增员工"
      },
      innerVisible: false,
      addEmployeeForm: {
        // 新增员工表单
        phoneNumber: "",
        password: "123456",
        sex: 1,
        isMain: false,
        enabled: true,
        remark: "",
        birthday: "",
        userImage: "",
        linkman: null
      }
    };
  },
  methods: {
    // 获取当前日期
    getCurrentDate() {
      var now = new Date();
      var year = now.getFullYear(); // 得到年份
      var month = now.getMonth(); // 得到月份
      var date = now.getDate(); // 得到日期
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date}`;
      this.$set(this.addEmployeeForm, "birthday", defaultDate);
    },
    // 搜索员工列表
    searchStaffList() {
      this.getEmployeeList();
    },
    // 员工管理分页
    employeeManCurrentChange(page) {
      this.employeeMan.currentPage = page;
      this.getEmployeeList();
    },
    // 员工管理修改每页条数
    employeeManSizeChange(pageSize) {
      this.employeeMan.pageSize = pageSize;
      if (this.employeeMan.currentPage * pageSize > this.employeeMan.totalCount)
        return false;
      this.getEmployeeList();
    },
    // 获取员工列表
    async getEmployeeList() {
      const fd = {
        orgCompanyID: this.currentCompany.id,
        keyword: this.staffKeyword,
        skipCount: this.employeeMan.currentPage,
        maxResultCount: this.employeeMan.pageSize
      };
      for (const key in fd) {
        if (fd[key] === undefined || fd[key] === null || fd[key] === "")
          delete fd[key];
      }
      try {
        const res = await this.$http.post("/api/CompanyUserPage", fd);
        if (res.data.result.code === 200) {
          this.employeeList = res.data.result.item.items || [];
          this.employeeMan.totalCount = res.data.result.item.totalCount;
        } else {
          this.$message.error(res.data.result.msg);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 绑定员工
    async bindEmployee(row, code) {
      console.log(code);
      const res = await this.$http.post("/api/BindPersinnel", {
        personnelNo: code === 1 ? this.relatedConfig.id : null,
        id: row.id
      });
      this.getPersinnelList(this.relatedConfig.phoneNumber);
      console.log(res);
    },
    // 取消
    close() {
      this.innerVisible = false;
    },
    // 提交新增 | 编辑员工
    async submit(form) {
      let api = "/api/CreateOrgPersonnel",
        msg = "新增成功";
      if (this.isEdit) (api = "/api/UpdateOrgPersonnel"), (msg = "编辑成功");
      const res = await this.$http.post(api, form);
      if (res.data.result.code === 200) {
        this.$message.success(msg);
        this.getEmployeeList();
        this.innerVisible = false;
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    // 打开编辑员工
    editEmployees(row) {
      this.isEdit = true;
      this.employeeMan.employeeTitle = "员工编辑";
      for (const key in row) {
        this.addEmployeeForm[key] = row[key];
      }
      this.addEmployeeForm.companyId = this.currentCompany.id;
      this.innerVisible = true;
    },
    // 打开绑定员工
    async openBindEmployees(row) {
      this.relatedConfig.id = row.id;
      this.relatedConfig.phoneNumber = row.phoneNumber;
      this.relatedConfig.relatedDialog = true;
      this.getPersinnelList(row.phoneNumber);
    },
    // 获取弹出员工列表
    async getPersinnelList(phoneNumber) {
      const res = await this.$http.post("/api/SearchPersinnel", {
        Client_acc_nu: phoneNumber,
        companyNumber: this.currentCompany.companyNumber
      });
      if (res.data.result.code === 200) {
        this.relatedConfig.relatedDataList = res.data.result.item;
      }
    },
    // 打开新增员工
    openAddemployee() {
      this.isEdit = false;
      this.employeeMan.employeeTitle = "新增员工";
      this.addEmployeeForm = {
        // 新增员工表单
        phoneNumber: "",
        companyId: this.currentCompany.id,
        sex: 1,
        isMain: false,
        enabled: true,
        remark: "",
        birthday: "",
        userImage: "",
        linkman: null
      };
      // 获取当前日期
      this.getCurrentDate();
      this.innerVisible = true;
    },
    // 删除员工
    async deleteEmployees(row) {
      const res = await this.$http.post("/api/DeleteCompanyUser", {
        OrgCompanyID: this.currentCompany.id,
        OrgPersonnelID: row.id
      });
      if (res.data.result.code === 200) {
        this.$message.success("删除成功");
        this.getEmployeeList();
      } else {
        this.$message.error(res.data.result.msg);
      }
    }
  },
  created() {},
  mounted() {
    this.getEmployeeList();
  }
};
</script>
<style scoped lang="less">
.boxWrap {
  .addStaffBtn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      flex: 1;
    }
  }
}
</style>
