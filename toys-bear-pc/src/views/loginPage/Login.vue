<template>
  <div class="login">
    <div class="topLauot">
      <login-top />
    </div>
    <div class="myMiddle">
      <div class="loginContent">
        <div class="loginTitle">
          <h1>小竹熊致力于玩具行业高效服务</h1>
          <p>Xiaozhuxiong is committed to efficient service in toy industry</p>
        </div>
        <div class="loginbox">
          <loginForm />
        </div>
      </div>
    </div>
    <loginFooter />
  </div>
</template>

<script>
import loginForm from "@/components/loginComponents/LoginForm.vue";
import loginTop from "@/components/loginComponents/LoginTop.vue";
import loginFooter from "@/components/loginComponents/LoginFooter.vue";
export default {
  components: {
    loginForm,
    loginTop,
    loginFooter
  },
  data() {
    return {};
  },
  mounted() {
    if (this.$route.query.id === "signOut") {
      this.$store.commit("removeLoginItems");
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  .topLauot {
    width: 100%;
    height: 106px;
    background-color: #fff;
  }
  .myMiddle {
    height: calc(100% - 200px);
    .loginContent {
      width: 100%;
      height: 620px;
      background: url("~@/assets/images/homeBg.png") no-repeat center;
      background-size: 100% 100%;
      position: relative;
      .loginTitle {
        position: absolute;
        left: 417px;
        top: 103px;
        color: #fff;
        h1 {
          font-weight: bold;
          font-size: 36px;
        }
        p {
          margin-top: 18px;
          font-size: 17px;
        }
      }
      .loginbox {
        width: 450px;
        height: 450px;
        position: absolute;
        left: 60%;
        top: 50%;
        padding: 50px;
        box-sizing: border-box;
        transform: translate(0, -50%);
        background-color: #fff;
        border-radius: 6px;
        box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.15);
      }
    }
  }
}
</style>
