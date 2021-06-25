<template>
  <div>
    <el-form ref="shenheForm" label-width="100px" :model="formData">
      <el-form-item label="用户名称：" prop="userName">
        <el-input v-model="formData.userName" disabled></el-input>
      </el-form-item>
      <el-form-item label="举报类型：" prop="reportType">
        <el-input v-model="formData.reportType" disabled></el-input>
      </el-form-item>
      <el-form-item label="举报日期：" prop="createdOn">
        <el-input v-model="formData.createdOn" disabled></el-input>
      </el-form-item>
      <el-form-item label="处理意见：" prop="handleResult">
        <el-input
          type="textarea"
          resize="none"
          v-model="formData.handleResult"
          show-word-limit
          suffix="123"
          :maxlength="$store.state.globalJson.Json.UserRestrictions[0].itemCode"
          class="txtWrap"
        ></el-input>
      </el-form-item>
      <center>
        <template>
          <el-button type="primary" @click="review(true)">审核通过</el-button>
          <el-button type="danger" @click="review(false)">审核不通过</el-button>
        </template>
      </center>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    currentRow: {
      currentRow: Object
    }
  },
  data() {
    return {
      formData: {}
    };
  },
  methods: {
    async review(flag) {
      this.formData.reportState = flag;
      const res = await this.$http.post(
        "/api/UpdateMessageReport",
        this.formData
      );
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "审核成功",
          type: "success"
        });
        this.$emit("sub");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.currentRow));
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.oneInput {
  width: 100%;
  display: flex;
  @{deep} .el-form-item {
    width: 50%;
    .el-select {
      width: 100%;
    }
  }
}
.btns {
  .el-button {
    width: 120px;
  }
}
</style>
