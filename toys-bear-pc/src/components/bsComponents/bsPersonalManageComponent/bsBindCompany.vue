<template>
  <div>
    <el-table
      :data="userManList"
      style="width: 100%; min-height: 300px"
      :header-cell-style="{ backgroundColor: '#f9fafc', color: '#666' }"
    >
      <el-table-column
        v-if="userManList.companyNumber"
        prop="companyNumber"
        label="公司编码"
      ></el-table-column>
      <el-table-column prop="hallNumber" label="展厅编号"></el-table-column>
      <el-table-column prop="client_nu" label="客户编号"></el-table-column>
      <el-table-column prop="client_na" label="客户名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column prop="handset" label="联系电话"></el-table-column>
      <el-table-column label="新增日期" prop="createdOn" sortable width="180">
        <template slot-scope="scope">
          {{
            scope.row.createdOn ? scope.row.createdOn.replace(/T/gi, " ") : ""
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="关联"
        prop="companyNumber"
        width="50"
        align="center"
      >
        <template slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.companyNumber"
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
            v-if="!scope.row.companyNumber"
            @click="Related(scope.row, 1)"
            >关联</el-button
          >
          <el-button
            size="mini"
            type="danger"
            v-else
            @click="Related(scope.row, 2)"
            >取消关联</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: ["companyNumber", "companyType"],
  data() {
    return {
      userManList: [] // 用户管理列表
    };
  },
  methods: {
    // 关联或取消关联
    // 点击关联
    async Related(row, code) {
      if (code === 1) {
        const res = await this.$http.post("/api/BindCompany", {
          companyNumber: this.UserManConfig.companyNumber,
          CompanyType: row.companyType,
          id: row.id
        });
        console.log(res);
        if (res.data.result.code === 200) {
          this.$common.handlerMsgState({
            msg: "关联成功",
            type: "success"
          });
        } else {
          this.$common.handlerMsgState({
            msg: res.data.result.msg,
            type: "danger"
          });
        }
        this.getUserMan();
      } else {
        const res = await this.$http.post("/api/BindCompany", {
          companyNumber: null,
          id: row.id
        });
        if (res.data.result.code === 200) {
          this.$common.handlerMsgState({
            msg: "取消关联成功",
            type: "success"
          });
        } else {
          this.$common.handlerMsgState({
            msg: res.data.result.msg,
            type: "danger"
          });
        }
        this.getUserMan();
      }
    },
    // 获取用户管理列表
    async getUserMan() {
      const res = await this.$http.post("/api/SearchCompany", {
        companyNumber: this.companyNumber,
        companyType: this.companyType
      });
      if (res.data.result.code === 200) {
        this.userManList = res.data.result.item;
      }
    }
  },
  created() {},
  mounted() {
    this.getUserMan();
  }
};
</script>
<style scoped lang="less"></style>
