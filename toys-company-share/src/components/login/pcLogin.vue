<template>
  <div class="login_middle">
    <div class="bgImg"></div>
    <div class="loginBox">
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
  name: "pcLogin",
  components: {},
  mixins: [loginJs],
  data() {
    return {};
  }
};
</script>
<style scoped lang="less">
.login_middle {
  width: 100%;
  height: 550px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
  .bgImg {
    width: 100%;
    height: 320px;
    background: url("~@/assets/images/loginBgImg.png") no-repeat center;
    background-size: 100% 100%;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
  }
  .loginBox {
    width: 504px;
    // height: 550px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #e9e9e9;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    box-sizing: border-box;
    .title {
      min-height: 105px;
      height: 105px;
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
        width: 250px;
        .text_content {
          width: 250px;
          height: 35px;
          font-size: 25px;
          overflow: hidden;
        }
      }
    }
    .minTitle {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 27px;
      font-weight: 400;
      .titleText {
        margin-left: 18px;
      }
    }
    .formBox {
      width: 100%;
      height: 368px;
      position: relative;
      margin-top: 50px;
      box-sizing: border-box;
      ::v-deep .el-form {
        width: 326px;
        position: absolute;
        left: 50%;
        top: 50px;
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
