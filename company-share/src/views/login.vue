<template>
  <div class="content">
    <div class="middle">
      <div class="bgImg"></div>
      <div class="loginBox">
        <div class="title">
          <el-image :src="userLogo.companyLogo"></el-image>
          <span class="titleText">{{ userLogo.companyName }}</span>
        </div>
        <div class="minTitle">
          <el-image
            style="width:30px;height:37px"
            :src="require('@/assets/images/minTitleText.png')"
          ></el-image>
          <span class="titleText">{{ loginLang.SignIn }}</span>
        </div>
        <div class="formBox">
          <el-form
            ref="myFormRef"
            label-position="top"
            :rules="loginFormRules"
            label-width="80px"
            :model="formLabelAlign"
          >
            <el-form-item prop="verifyCode" :label="loginLang.InvitationCode">
              <el-input
                v-model="formLabelAlign.verifyCode"
                @keyup.native.enter="toHome"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div class="myEmail">
                {{ loginLang.email }}
                <span class="remak">{{ loginLang.emailExplain }}</span>
              </div>
              <el-input
                v-model="formLabelAlign.email"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      userLogo: {
        companyLogo: "",
        companyName: ""
      },
      formLabelAlign: {
        verifyCode: "",
        email: "",
        url: location.href.replace(/%2F/, "/")
      },
      loginFormRules: {
        verifyCode: [
          { required: true, message: "请输入邀请码", trigger: "blur" }
        ]
      },
      options: [
        {
          value: "zh-CN",
          label: "中文"
        },
        {
          value: "en",
          label: "英文"
        }
      ]
    };
  },
  methods: {
    // 登录提交
    toHome() {
      this.$refs.myFormRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            "/api/Account/CompanyShareLogin",
            this.formLabelAlign
          );
          const { code, message, data } = res.data.result;
          if (code === 200) {
            this.$store.commit("handlerUserInfo", data);
            this.$router.push({ path: "/index" });
          } else this.$message.error(message);
        }
      });
    },
    // 获取公司logo和名字
    async getCompanyLogo() {
      //  + location.href
      // 设置默认图片和文字
      this.userLogo = {
        companyLogo: require("@/assets/images/logo.png"),
        companyName: this.loginLang.PreferredToys
      };
      const res = await this.$http.get(
        "/api/WebsiteShare/GetCompanyInfoOnLogin?url=" + location.href
      );
      const { code, data } = res.data.result;
      if (code === 200) this.userLogo = data;
    }
  },
  created() {
    document.title = this.loginLang.title;
    this.getCompanyLogo();
  },
  mounted() {},
  watch: {
    "$store.state.screenWidth"(val) {
      console.log(val);
    }
  },
  computed: {
    loginLang() {
      return this.$t("lang.login");
    }
  }
};
</script>
<style scoped lang="less">
.content {
  font-size: 16px;
  height: 100vh;
  position: relative;
  color: #333;
  .middle {
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
      height: 550px;
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
        font-size: 32px;
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
        width: 326px;
        height: 268px;
        position: relative;
        left: 50%;
        top: 50px;
        transform: translate(-50%, 0);
        box-sizing: border-box;
        ::v-deep .el-form {
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
          .myEmail {
            font-size: 12px;
            .remak {
              font-size: 12px;
              color: #7a7a7a;
            }
          }
          .loginBtn {
            width: 100%;
            background-color: #3368a9;
            border-color: #3368a9;
          }
        }
      }
    }
  }
}
</style>
