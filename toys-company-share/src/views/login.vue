<template>
  <div class="content">
    <div class="middle">
      <div class="bgImg"></div>
      <div class="loginBox">
        <div class="title">
          <el-image :src="userLogo.companyLogo"></el-image>
          <div class="titleText">
            <notice-bar
              v-if="currentLang.companyName"
              :text="currentLang.companyName"
              :startRoll="currentLang.companyName.length > 7"
            />
          </div>
        </div>
        <div class="minTitle">
          <el-image
            style="width:30px;height:37px"
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
                {{ loginLang.userName }}
                <!-- <span class="remak">{{ loginLang.emailExplain }}</span> -->
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
import { mapState } from "vuex";
import NoticeBar from "@/components/noticeBar/notice-bar";
export default {
  components: {
    NoticeBar
  },
  data() {
    return {
      companyNameLength: false,
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
      }
    };
  },
  methods: {
    // 初始化项目搜索条件
    initProduct() {
      this.$store.commit("resetSearchProduct");
    },
    // 获取购物车数量
    async getShopLength({ loginEmail, shareId }) {
      const tokenRes = await this.$toys.post("/api/GetToken", {
        companyNum: "LittleBearWeb",
        platForm: "PC"
      });
      if (tokenRes.data.result.code === 200) {
        console.log(tokenRes.data.result.item);
        this.$store.commit("handlerTemporaryToken", tokenRes.data.result.item);
        const res = await this.$toys.post("/api/ShoppingCartCount", {
          shareID: shareId,
          customerRemarks: loginEmail,
          sourceFrom: "share",
          shopType: "customersamples"
        });
        console.log(res);
        if (res.data.result.code === 200) {
          this.$store.commit("handlerShopLength", res.data.result.item);
        } else {
          this.$message.error(tokenRes.data.result.msg);
        }
      } else {
        this.$message.error(tokenRes.data.result.msg);
      }
    },
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
            await this.getShopLength(data);
            this.$router.push({ path: "/index" });
          } else this.$message.error(message);
        }
      });
    },
    // 获取公司logo和名字
    async getCompanyLogo() {
      // 设置默认图片和文字
      this.userLogo = {
        companyLogo: require("@/assets/images/logo.png"),
        companyName: this.loginLang.PreferredToys
      };
      const res = await this.$http.get(
        "/api/WebsiteShare/GetCompanyInfoOnLogin?url=" + location.href
      );
      const { code, data } = res.data.result;
      if (code === 200) {
        this.userLogo = data;
        // data.websiteLanguage ? this.$store.commit("localLangs",  || []);
        if (data.websiteLanguage) {
          const list = JSON.parse(data.websiteLanguage);
          if (list.length) {
            this.$store.commit("localLangs", list);
            const flag = list.find(val => val.parameter == this.globalLang);
            console.log(flag, list);
            if (!flag) {
              this.$store.commit("setLang", list[0].parameter);
            }
          } else {
            this.$store.commit("localLangs", []);
          }
        } else {
          this.$store.commit("localLangs", []);
        }
        this.$store.commit("initLangs", data.contactInfoList || []);
        // 如果存在
        if (data.contactInfoList) {
          let currentLang = data.contactInfoList.find(
            val => val.language == this.globalLang
          );
          // 如果上次的语言存在  用上次的
          if (currentLang) {
            this.$store.commit("handleCurrentLang", currentLang);
          } else {
            currentLang = data.contactInfoList.find(
              val => val.language == "en"
            );
            // 有英文用英文
            if (currentLang) {
              this.$store.commit("handleCurrentLang", currentLang);
            } else {
              // 没有英文用第一个
              this.$store.commit("handleCurrentLang", data.contactInfoList[0]);
            }
          }
        }
      }
    }
  },
  created() {
    document.title = this.loginLang.title;
    this.getCompanyLogo();
  },
  mounted() {
    this.initProduct();
  },
  watch: {
    "$store.state.screenWidth"(val) {
      console.log(val);
    }
  },
  computed: {
    ...mapState(["globalLang", "currentLang", "langs"]),
    loginLang() {
      return this.$t("lang.login");
    }
    // companyNameLength() {
    //   if (this.currentLang.companyName) {
    //     console.log(this.currentLang.companyName);
    //     return this.currentLang.companyName.length > 7;
    //   } else {
    //     return false;
    //   }
    // }
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
          width: 250px;
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
}
</style>
