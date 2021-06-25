<template>
  <div>
    <el-input
      type="textarea"
      :rows="5"
      placeholder="请输入内容"
      v-model="reasonsForApplication"
    >
    </el-input>
    <center style="margin-top: 20px;">
      <el-button
        type="primary"
        size="medium"
        @click="$emit('submitAddFriend', reasonsForApplication)"
      >
        确定
      </el-button>
      <el-button size="medium" @click="$emit('closeAddFriend')">
        取消
      </el-button>
    </center>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["myName"],
  data() {
    return {
      reasonsForApplication: ""
    };
  },
  methods: {},
  created() {},
  mounted() {
    this.reasonsForApplication =
      "我是" + (this.userInfo.userInfo.linkman || "");
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less"></style>
