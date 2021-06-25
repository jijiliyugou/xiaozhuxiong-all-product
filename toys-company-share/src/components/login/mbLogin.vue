<template>
  <div class="login_middle_mb">
    <div class="loginBox" :class="[shareInfo.isCustomerInfo ? 'lg' : '']">
      <div class="title">
        <el-image :src="userLogo.companyLogo"></el-image>
        <div class="titleText">
          <div class="text_content">
            <marqueeLeft :list="[currentLang.companyName]" />
          </div>
        </div>
      </div>
      <div class="minTitle">
        <el-image
          style="width: 30px; height: 37px"
          :src="require('@/assets/images/minTitleText.png')"
        ></el-image>
        <div class="titleText">{{ loginLang.SignIn }}</div>
      </div>
      <div class="formBox">
        <el-form
          ref="myFormRef"
          label-position="top"
          :rules="loginFormRules"
          label-width="80px"
          :model="formLabelAlign"
          @submit.native.prevent
        >
          <el-form-item prop="verifyCode" :label="loginLang.InvitationCode">
            <el-input
              v-model.trim="formLabelAlign.verifyCode"
              @keyup.native.enter="toHome"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item v-if="shareInfo.isCustomerInfo">
            <div class="myEmail">
              {{ loginLang.contact }}
            </div>
            <el-input
              v-model.trim="formLabelAlign.email"
              clearable
              @keyup.native.enter="toHome"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="loginBtn" @click="toHome" type="primary">{{
              loginLang.loginBtn
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import loginJs from "@/mixins/login.js";
export default {
  name: "mbLogin",
  components: {},
  mixins: [loginJs],
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {}
};
</script>
<style scoped lang="less">
.login_middle_mb {
  width: 80%;
  height: 513px;
  left: 0;
  position: relative;
  padding: 35% 10% 10% 10%;
  .lg {
    height: 463px;
  }
  .loginBox {
    background-color: #fff;
    box-shadow: 0px 3px 6px rgb(0 0 0 / 16%);
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    border-radius: 9px;
    width: 100%;
    .title {
      margin-top: 20px;
      min-height: 55px;
      height: 55px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      .el-image {
        width: 51px;
        height: 55px;
        min-width: 51px;
        min-height: 55px;
        img {
          width: 51px;
          height: 55px;
        }
      }
      .titleText {
        margin-left: 20px;
        width: 200px;
        .text_content {
          width: 200px;
          height: 35px;
          font-size: 25px;
          overflow: hidden;
        }
      }
    }
    .minTitle {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24x;
      font-weight: 400;
      .titleText {
        margin-left: 18px;
      }
    }
    .formBox {
      width: 100%;
      height: 180px;
      position: relative;
      margin-top: 20px;
      box-sizing: border-box;
      ::v-deep .el-form {
        width: 250px;
        position: absolute;
        left: 50%;
        // top: 50px;
        transform: translate(-50%, 0);
        .el-form-item {
          .el-form-item__label {
            padding: 0;
          }
          .el-form-item__content {
            .el-input {
              border: none;
              .el-input__inner {
                border-color: #707070;
              }
            }
          }
        }
        .el-input {
          font-size: 12px;
          width: 100%;
          height: 46px;
          background: #ffffff;
          border: 1px solid #707070;
          border-radius: 5px;
        }
        // .myEmail {
        // font-size: 14px;
        // .remak {
        //   font-size: 12px;
        //   color: #7a7a7a;
        // }
        // }
        .loginBtn {
          width: 100%;
          background-color: #3368a9;
          border-color: #3368a9;
        }
      }
    }
  }
}
</style>
