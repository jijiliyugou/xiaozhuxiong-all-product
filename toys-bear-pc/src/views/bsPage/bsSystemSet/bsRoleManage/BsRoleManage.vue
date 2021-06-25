<template>
  <div class="bsMyCollection">
    <div class="title">
      角色管理

      <el-button
        class="btnList"
        size="medium"
        type="primary"
        icon="el-icon-plus"
        @click="openAddRole"
        >新增</el-button
      >
    </div>

    <div class="tableBox">
      <Table :table="tableData"></Table>
    </div>

    <!-- 新增角色dialog -->
    <el-dialog
      :title="roleDialogOptions.roleDialogTitle"
      :visible.sync="roleDialogOptions.openRoleDialog"
      v-if="roleDialogOptions.openRoleDialog"
      width="50%"
    >
      <el-form
        style="max-height:500px;overflow: auto;"
        :rules="roleRules"
        ref="roleRef"
        :model="addRoleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="addRoleForm.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="超级管理员" prop="isAdmin">
          <el-radio-group v-model="addRoleForm.isAdmin">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否激活" prop="enabled">
          <el-radio-group v-model="addRoleForm.enabled">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 拥有权限 -->
        <el-form-item label="拥有权限">
          <el-tree
            ref="refRole"
            :data="allAuthList"
            default-expand-all
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="defaultChecked"
          ></el-tree>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="addRoleForm.description"
          ></el-input>
        </el-form-item>
      </el-form>
      <center>
        <el-button type="primary" @click="addRoles">确认</el-button>
        <el-button @click="roleDialogOptions.openRoleDialog = false"
          >取消</el-button
        >
      </center>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/table";
export default {
  name: "bsRoleManage",
  components: {
    Table
  },
  data() {
    return {
      allAuthList: [], // 所有权限列表
      setRoleRid: null, // 设置权限的id
      defaultChecked: [], // 默认选中项
      roleRules: {
        // 新增规则
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, message: "长度在 1 个字符以上", trigger: "blur" }
        ],
        roleCode: [
          { required: true, message: "请输入角色编码", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        isAdmin: [
          { required: true, message: "请选择是不是超级管理员", trigger: "blur" }
        ],
        enabled: [
          { required: true, message: "请选择是否激活", trigger: "blur" }
        ]
      },
      defaultProps: {
        // tree配置项
        children: "children",
        label: "name"
      },
      roleDialogOptions: {
        // 新增角色面板配置
        openRoleDialog: false, // 新增角色dialog
        roleDialogTitle: "新增角色" // 新增/编辑 角色标题
      },
      addRoleForm: {
        // 新增角色表单
        isAdmin: null,
        roleName: null,
        roleCode: null,
        enabled: null,
        moduleIdList: [],
        description: null
      },
      tableData: {
        data: [],
        sizeMini: "mini",
        columns: [
          { prop: "roleName", label: "角色名称" },
          { prop: "description", label: "描述" },
          {
            prop: "enabled",
            label: "是否激活",
            isHiden: true,
            isSwitch: true,
            activeValue: true,
            inactiveValue: false,
            value: "enabled",
            handlerChange: row => {
              this.switchState(row);
            }
          },
          {
            prop: "createdOn",
            label: "新增日期",
            render: row => {
              return row.createdOn.replace(/T/, " ");
            }
          }
        ],
        actions: [
          {
            classWrapper: () => {
              return "primary";
            },
            textWrapper: () => {
              return "编辑";
            },
            methods: row => {
              //编辑方法
              this.handleEdit(row);
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
              //删除方法
              this.handleDelete(row);
            }
          }
        ]
      }
    };
  },
  methods: {
    // 删除列表
    async handleDelete(index, row) {
      const res = await this.$http.post("/api/DeleteUserRoleMenu", {
        id: row.id
      });
      if (res.data.result.code === 200) {
        this.$message.success("删除成功");
        this.getRoleList();
      } else {
        this.$message.error("删除失败");
      }
    },
    // 修改角色状态
    async switchState(row) {
      const res = await this.$http.post("/api/UpdateRoleState", {
        id: row.id,
        enabled: row.enabled
      });
      if (res.data.result.code === 200) {
        this.$message.success("修改状态成功");
      } else {
        this.$message.error("修改状态失败，请检查网络");
      }
      this.getRoleList();
    },
    // 获取所有权限
    async getAllAuth() {
      const res = await this.$http.post("/api/Auth_ModuleList", {});
      if (res.data.result.code === 200) {
        this.allAuthList = res.data.result.item.map(val => {
          return {
            ...val.parent,
            children: val.children
          };
        });
      } else {
        this.$message.error("获取权限列表失败，请检查网络");
      }
    },

    // 打开新增角色
    openAddRole() {
      this.roleDialogOptions.openRoleDialog = true;
      this.roleDialogOptions.roleDialogTitle = "新增角色";
      this.addRoleForm = {
        // 新增角色表单
        isAdmin: null,
        roleName: null,
        enabled: null,
        moduleIdList: [],
        description: null
      };
      this.defaultChecked = [];
      this.$nextTick(() => {
        this.$refs.refRole.setCheckedKeys([]);
      });
    },

    // 新增角色 | 编辑角色
    async addRoles() {
      this.$refs.roleRef.validate(async valid => {
        if (valid) {
          const checkedKeys = this.$refs.refRole.getCheckedKeys();
          const halfCheckedKeys = this.$refs.refRole.getHalfCheckedKeys();
          this.addRoleForm.moduleIdList = [...checkedKeys, ...halfCheckedKeys];
          if (this.roleDialogOptions.roleDialogTitle === "新增角色") {
            const res = await this.$http.post(
              "/api/CreateAuth_Role",
              this.addRoleForm
            );
            if (res.data.result.code === 200) {
              this.getRoleList();
              this.$message.success("新增角色成功");
            } else {
              this.$message.error("新增角色失败");
            }
          } else {
            const res = await this.$http.post("/api/UpdateUserRoleMenu", {
              ...this.addRoleForm,
              id: this.setRoleRid
            });
            if (res.data.result.code === 200) {
              this.getRoleList();
              this.$message.success("编辑角色成功");
            } else {
              this.$message.error("编辑角色失败");
            }
          }
          this.roleDialogOptions.openRoleDialog = false;
        }
      });
    },

    // 获取当前角色的所有权限子id
    async getCurrentMenuList(id) {
      return await this.$http.post("/api/GetUserRoleMenuById", { id });
    },

    // 打开编辑列表
    async handleEdit(row) {
      this.defaultChecked = []; // 重定项
      this.setRoleRid = row.id; // 当前角色id
      this.roleDialogOptions.roleDialogTitle = "角色编辑";
      for (const key in row) {
        this.addRoleForm[key] = row[key];
      }
      const res = await this.getCurrentMenuList(row.id);
      if (res.data.result.code === 200) {
        this.defaultChecked = res.data.result.item.moduleIdList || [];
        this.roleDialogOptions.openRoleDialog = true;
        this.$nextTick(() => {
          this.$refs.refRole.setCheckedKeys(this.defaultChecked);
        });
      } else {
        this.$message.error("获取权限失败");
      }
    },

    // 获取系统角色列表
    async getRoleList() {
      const fd = {};
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/Auth_RolePage", fd);
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
      }
    }
  },
  created() {},
  mounted() {
    this.getRoleList();
    this.getAllAuth();
  },
  computed: {}
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
  .btnList {
    float: right;
    margin-top: 10px;
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
