<template>
  <div>
    <el-table
      :data="persinnelList"
      style="width: 100%; min-height: 300px"
      :header-cell-style="{ backgroundColor: '#f9fafc', color: '#666' }"
      :default-sort="{ prop: 'createdOn', order: 'descending' }"
    >
      <el-table-column prop="client_acc_nu" label="员工账号"></el-table-column>
      <el-table-column prop="client_nu" label="员工编号"></el-table-column>
      <el-table-column prop="hallNumber" label="展厅编号"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column label="新增日期" prop="createdOn" width="180">
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
  </div>
</template>

<script>
export default {
  props: {
    phoneNumber: {
      type: String
    },
    companyNumber: {
      type: String
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      persinnelList: []
    };
  },
  methods: {
    // 获取要绑定的员工列表
    async getPersinnelList() {
      const res = await this.$http.post("/api/SearchPersinnel", {
        Client_acc_nu: this.phoneNumber, // 手机
        companyNumber: this.companyNumber // 公司companyNumber
      });
      if (res.data.result.code === 200) {
        this.persinnelList = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 绑定员工
    async bindEmployee() {
      const res = await this.$http.post("/api/BindPersinnel", {
        personnelNo: this.isBind ? this.relatedConfig.id : null,
        id: this.id
      });
      console.log(res);
    }
  },
  created() {},
  mounted() {
    this.getPersinnelList();
  }
};
</script>
<style scoped lang="less"></style>
