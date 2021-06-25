<template>
  <div class="editMyGroupName">
    <div class="groupNameBox">
      <el-input
        placeholder="请输入群昵称"
        style="width:500px;"
        v-model="nameValue"
        @keyup.native.enter="submit"
        clearable
      >
      </el-input>
    </div>
    <center class="btns">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="$emit('onclose')">取消</el-button>
    </center>
  </div>
</template>

<script>
export default {
  props: ["groupName"],
  data() {
    return {
      nameValue: ""
    };
  },
  methods: {
    submit() {
      this.$emit("onsubmit", this.nameValue);
    }
  },
  created() {},
  mounted() {
    this.nameValue = this.groupName;
  }
};
</script>
<style scoped lang="less">
.editMyGroupName {
  height: 200px;
  .groupNameBox {
    box-sizing: border-box;
    padding-top: 50px;
    display: flex;
    justify-content: center;
  }
  .btns {
    margin-top: 50px;
    .el-button {
      width: 120px;
    }
  }
}
</style>
