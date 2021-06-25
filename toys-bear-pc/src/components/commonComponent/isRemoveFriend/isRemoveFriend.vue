<template>
  <div>
    <h3 class="msgBox">
      {{ msg }}
    </h3>
    <center style="margin-top: 20px;">
      <el-button type="primary" size="medium" @click="$emit('yesEvent')">
        确定
      </el-button>
      <el-button size="medium" @click="$emit('noneEvent')">
        取消
      </el-button>
    </center>
  </div>
</template>

<script>
export default {
  props: ["msg"],
  data() {
    return {
      reasonsForApplication: ""
    };
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.msgBox {
  font-weight: 600;
  text-align: center;
  margin: 20px 0px 40px 0px;
}
</style>
