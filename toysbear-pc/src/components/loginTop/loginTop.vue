<template>
  <div class="loginTop">
    <el-image
      style="width: 213px; height: 53px"
      :src="require('@/assets/images/loginTopImg.png')"
      fit="contain"
    >
    </el-image>
    <div class="line"></div>
    <div class="welcome">欢迎登录</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.loginTop {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  .el-image {
    margin-left: 361px;
  }
  .line {
    width: 1px;
    height: 37px;
    background-color: #c6c6c6;
    margin-left: 25px;
    margin-top: 15px;
  }
  .welcome {
    color: #666666;
    font-size: 26px;
    margin-left: 15px;
    margin-top: 18px;
  }
}
</style>
