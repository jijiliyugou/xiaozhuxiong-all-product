/*
 * @Description:
 * @Author: gaojiahao
 * @Date: 2021-06-15 17:07:45
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\mixins\login.js
 * @LastEditTime: 2021-06-15 17:09:42
 * @LastEditors: sueRimn
 * @Descripttion:
 * @version: 1.0.0
 */

import { mapState } from "vuex";
import marqueeLeft from "@/components/marqueeLeft/marqueeLeft.vue";
export default {
  components: {
    marqueeLeft
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
    async getShopLength({ shareId }) {
      const tokenRes = await this.$toys.post("/api/GetToken", {
        companyNum: "LittleBearWeb",
        platForm: "PC"
      });
      if (tokenRes.data.result.code === 200) {
        console.log(tokenRes.data.result.item);
        this.$store.commit("handlerTemporaryToken", tokenRes.data.result.item);
        const res = await this.$toys.post("/api/ShoppingCartCount", {
          shareID: shareId,
          customerRemarks: this.customerInfo.id,
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
          this.$store.commit("setLoginForm", this.formLabelAlign);
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
        console.log(data.shareInfo);
        this.$store.commit("setShareInfo", data.shareInfo);
        this.$store.commit("setCustomerInfo", data.customerInfo);
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
    ...mapState([
      "globalLang",
      "currentLang",
      "langs",
      "customerInfo",
      "shareInfo"
    ]),
    loginLang() {
      return this.$t("lang.login");
    }
  }
};
