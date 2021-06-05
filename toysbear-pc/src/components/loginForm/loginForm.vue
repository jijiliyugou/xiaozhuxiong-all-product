<template>
  <div class="formBox">
    <div class="titleBox">
      <i class="titleIcon"></i>
      <h2 class="title">登录系统</h2>
    </div>
    <el-tabs v-model="activeName" class="loginFormLaout" stretch>
      <el-tab-pane label="二维码登录" name="erweima">
        <div class="qrCodeBox">
          <div class="code_box">
            <div class="qrcode">
              <vue-qr
                :text="options.url"
                :logoSrc="options.icon + '?cache'"
                colorLight="#fff"
                colorDark="#018e37"
                :margin="0"
                :size="230"
              ></vue-qr>
              <div class="refresh" v-show="showQrCode">
                <div class="refreshIcon" @click="getQrCodeUrl">
                  <i class="el-icon-refresh"></i>
                </div>
              </div>
            </div>
          </div>

          <p class="qrText">
            {{ qrcodeTitle }}
          </p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="短信登录" name="mobile">
        <el-form
          :model="loginforms"
          ref="mobileRef"
          class="smsLogin"
          :rules="mobileRules"
        >
          <el-form-item prop="username">
            <div class="mobileBox">
              <el-input
                placeholder="请输入手机号"
                v-model="loginforms.username"
              ></el-input>
              <div class="mobileIconBox">
                <i class="mobileIcon"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="verifycode">
            <div class="countDownBox">
              <div class="codeBox">
                <el-input
                  placeholder="请输入验证码"
                  v-model="loginforms.verifycode"
                  class="verifycode"
                  @keyup.enter.native="handleCodeLogin"
                ></el-input>
                <div class="codeIconBox">
                  <i class="codeIcon"></i>
                </div>
              </div>
              <div class="countDown">
                <span v-show="show" @click="getCode">获取短信验证码</span>
                <span v-show="!show" class="count">{{ count }} s</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              class="submintBtn"
              type="primary"
              @click="handleCodeLogin"
              >登 录</el-button
            >
          </el-form-item>
        </el-form>
        <div class="rememberPassword">
          <el-checkbox v-model="thePassword">记住密码(7天)</el-checkbox>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import { getMenuFuc } from "@/router/index";
export default {
  components: {
    VueQr
  },
  data() {
    return {
      thePassword: false,
      value: null,
      ws: null,
      loginUrl: "https://www.toysbear.com/new/#/bsIndex",
      wsBaseUrl: "wss://impush.toysbear.com/ws?UserId=",
      // loginUrl: "http://139.9.71.135:8080/new/#/bsIndex",
      // wsBaseUrl: "ws://139.9.71.135:8090/ws?UserId=",
      // loginUrl: "http://124.71.6.26:8080/new/#/bsIndex",
      // wsBaseUrl: "ws://124.71.6.26:8090/ws?UserId=",
      lang: "zh-CN",
      qrTimer: null,
      randomCode: null,
      qrcodeTitle: "请用小竹熊 云科技App扫码登录",
      show: true,
      showQrCode: false,
      count: "",
      timer: null,
      activeName: "erweima",
      search: "",
      options: {
        // 二维码配置
        url: " ",
        icon: require("@/assets/images/logo.png")
      },
      loginforms: {
        username: null,
        verifycode: null
      },
      mobileRules: {
        username: [
          {
            required: true,
            pattern: /^1[3456789]\d{9}$/,
            message: "格式不正确",
            trigger: "blur"
          }
        ],
        verifycode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, message: "验证码长度最少为4位", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 初始化 webSocket
    initWebSocket() {
      if (typeof WebSocket === "undefined") {
        this.$message.error("您的浏览器不支持WebSocket");
      } else {
        // 初始化weosocket
        // 正式
        this.ws = new WebSocket(this.wsBaseUrl + this.randomCode);
        // 测试
        // this.ws = new WebSocket(
        //   'ws://124.71.6.26:8090/ws?UserId=' + this.randomCode
        // )
        // 监听webSocket连接
        this.ws.onopen = this.websocketonopen;
        // 监听webSocket错误信息
        this.ws.onerror = this.websocketonerror;
        // 监听webSocket消息
        this.ws.onmessage = this.websocketonmessage;
        // 监听webSocket退出
        this.ws.onclose = this.websocketclose;
      }
    },
    // webSocket 连接成功
    websocketonopen() {
      console.log("WebSocket连接成功");
    },
    // webSocket 连接错误
    websocketonerror() {
      console.log("WebSocket连接发生错误");
      this.$message.error("WebSocket连接发生错误");
    },
    // webSocket 数据接收
    websocketonmessage(e) {
      const redata = JSON.parse(e.data);
      console.log(redata);
      if (redata.action === "QrCodeLogin") {
        this.getUserConfirm();
        console.log("成功了");
      }
    },
    // webSocket 数据发送
    websocketsend(agentData) {
      this.ws.send(agentData);
    },
    // 关闭 webSocket
    websocketclose(e) {
      console.log(e, "退出websocket了");
    },

    // 获取系统参数
    async getClientTypeList(type) {
      const res = await this.$http.post("/api/ServiceConfigurationList", {
        basisParameters: type
      });
      if (res.data.result.code === 200) {
        return res.data.result.item;
      }
    },
    // 监听结果
    async getUserConfirm() {
      const res = await this.$http.post("/api/UserConfirm", {
        RandomCode: this.randomCode
      });
      console.log(res);
      if (res.data.result.isLogin) {
        this.ws && this.ws.close();
        clearInterval(this.qrTimer);
        this.qrTimer = null;
        // 保存数据到cookit
        this.$cookies.set("userInfo", res.data.result.accessToken);
        console.log(this.$cookies.get("userInfo"));
        this.$store.commit("setToken", res.data.result);
        this.$store.commit(
          "setComparnyId",
          res.data.result.commparnyList[0].commparnyId
        );
        // 二维码登录成功获取菜单
        try {
          const re = await this.$http.post("/api/GetUserRoleMenu", {});
          if (re.data.result.code === 200 && re.data.result.item) {
            this.$store.commit("handlerLogin", true);
            this.$store.commit(
              "setRouters",
              re.data.result.item.modulesList || []
            );
            await getMenuFuc();
            const Json = {};
            Json.MessageRestriction = await this.getClientTypeList(
              "MessageRestriction"
            );
            Json.UserRestrictions = await this.getClientTypeList(
              "UserRestrictions"
            );
            Json.NoticeRestrictions = await this.getClientTypeList(
              "NoticeRestrictions"
            );
            Json.CompanyRestrictions = await this.getClientTypeList(
              "CompanyRestrictions"
            );
            Json.PlatForm = await this.getClientTypeList("PlatForm");
            this.$store.commit("globalJson/setGlobalJson", Json);
            console.log(res.data.result);
            switch (res.data.result.commparnyList[0].companyType) {
              case "Sales":
                // this.$router.push("/bsIndex");
                location.href = this.loginUrl;
                // location.href = "http://124.71.6.26:8080/new/#/bsIndex";
                break;
              default:
                this.$router.push("/me");
                // location.href = "http://124.71.6.26:8080/#/me";
                break;
            }
          } else {
            this.$message.error(re.data.result.msg);
            this.$store.commit("removeLoginItems");
          }
        } catch (error) {
          this.$store.commit("updateAppLoading", false);
          this.$message.error("获取菜单失败，请检查该角色是否有公司类型");
        }
      }
    },
    // 获取二维码链接
    async getQrCodeUrl() {
      const res = await this.$http.post("/api/UserRandomCode", {});
      if (res.data.result.code === 200) {
        this.options.url = res.data.result.item.qrCode;
        this.randomCode = res.data.result.item.randomCode;
        // 开启长连接
        this.initWebSocket();
      }
      // const TIME_COUNT = 10;
      const TIME_COUNT = 300;
      if (!this.timer) {
        let count = TIME_COUNT;
        this.showQrCode = false;
        this.qrcodeTitle = "请用小竹熊 云科技App扫码登录";
        clearInterval(this.qrTimer);
        this.qrTimer = setInterval(() => {
          if (count > 0 && count <= TIME_COUNT) {
            count--;
          } else {
            this.ws && this.ws.close();
            this.showQrCode = true;
            this.qrcodeTitle = "二维码已失效，点击刷新";
            clearInterval(this.qrTimer);
            this.qrTimer = null;
          }
        }, 1000);
      }
    },
    // 生成随机数
    randomNum(min, max) {
      max = max + 1;
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 随机生成验证码字符串
    // makeCode (data, len) {
    //   for (let i = 0; i < len; i++) {
    //     this.identifyCode += data[this.randomNum(0, data.length - 1)]
    //   }
    // },
    /**
     * 等待几秒后执行
     * @param {number} s 等待时间，单位秒
     */
    async waitTime(s) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, 1000 * s);
      });
    },
    // 验证码点击登录
    handleCodeLogin() {
      this.$refs.mobileRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post("/api/Authenticate", {
            userAccountOrUserMobile: this.loginforms.username,
            platForm: "PC",
            loginType: "VerificationCode",
            VerificationCode: this.loginforms.verifycode
          });
          if (res.data.result.isLogin) {
            this.$store.commit("setToken", res.data.result);
            if (res.data.result.commparnyList.length === 1) {
              // 一个角色
              // 保存数据到cookit
              // 记住密码
              const options = {
                token: res.data.result.accessToken
              };
              if (this.thePassword) {
                options.dateTime = Date.now();
              }
              const validityPeriod = JSON.stringify(options);
              console.log(validityPeriod);
              localStorage.setItem("validityPeriod", validityPeriod);
              this.$cookies.set("validityPeriod", validityPeriod);

              this.$store.commit("setToken", res.data.result);
              this.$store.commit(
                "setComparnyId",
                res.data.result.commparnyList[0].commparnyId
              );
              const localKey = res.data.result.uid;
              let localShoppingCart = localStorage.getItem(localKey);
              if (localShoppingCart) {
                localShoppingCart = JSON.parse(localShoppingCart);
                this.$store.commit("initShoppingCart", localShoppingCart);
              } else {
                this.$store.commit("initShoppingCart", []);
              }
              // 获取系统参数
              const Json = {};
              Json.MessageRestriction = await this.getClientTypeList(
                "MessageRestriction"
              );
              Json.UserRestrictions = await this.getClientTypeList(
                "UserRestrictions"
              );
              Json.NoticeRestrictions = await this.getClientTypeList(
                "NoticeRestrictions"
              );
              Json.CompanyRestrictions = await this.getClientTypeList(
                "CompanyRestrictions"
              );
              Json.PlatForm = await this.getClientTypeList("PlatForm");
              Json.packageManage = await this.getClientTypeList(
                "packageManage"
              );
              this.$store.commit("globalJson/setGlobalJson", Json);
              const re = await this.$http.post("/api/GetUserRoleMenu", {});
              if (re.data.result.code === 200 && re.data.result.item) {
                this.$store.commit("handlerLogin", true);
                this.$store.commit(
                  "setRouters",
                  re.data.result.item.modulesList || []
                );
                await getMenuFuc();
              } else {
                this.$message.error(re.data.result.msg);
                this.$store.commit("removeLoginItems");
              }
              switch (res.data.result.commparnyList[0].companyType) {
                case "Sales":
                  // this.$router.push("/bsIndex");
                  location.href = this.loginUrl;
                  // location.href = "http://124.71.6.26:8080/new/#/bsIndex";
                  break;
                default:
                  this.$router.push("/me");
                  // location.href = "http://124.71.6.26:8080/#/me";
                  break;
              }
            } else if (res.data.result.commparnyList.length > 1) {
              // 多个角色
              this.$store.commit("setToken", res.data.result);
              // this.$router.push({
              //   name: "LoginConfirm",
              //   params: res.data.result
              // });
              const pathOption = {
                path: "loginConfirm"
              };
              if (this.thePassword) {
                pathOption.query = {
                  thePassword: this.thePassword
                };
              }
              this.$router.push(pathOption);
            }
          } else {
            this.$message.error(res.data.result.message);
          }
        }
      });
    },
    // 手机验证倒计时
    async getCode() {
      if (!/^1[3456789]\d{9}$/.test(this.loginforms.username)) {
        this.$message.error("手机号格式错误");
        return;
      }
      const res = await this.$http.post("/api/SendSMS", {
        PhoneNumber: this.loginforms.username,
        MessageType: "SignIn"
      });
      if (res.data.result.code !== 200) {
        this.$message.error(res.data.result.message);
        return;
      }
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  },
  created() {},
  mounted() {
    this.getQrCodeUrl();
  },
  watch: {
    // activeName(val) {
    //   if (val === "mobile") {
    //     //   this.getQrCodeUrl();
    //     // } else {
    //     clearInterval(this.qrTimer);
    //     this.ws && this.ws.close();
    //   }
    // }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.ws && this.ws.close();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.formBox {
  width: 100%;
  height: 100%;
  .titleBox {
    display: flex;
    justify-content: center;
    align-items: center;
    .titleIcon {
      display: block;
      width: 30px;
      height: 30px;
      background: url("~@/assets/images/yonghu.png") center center no-repeat;
      background-size: contain;
      margin-right: 10px;
    }
    .title {
      font-size: 24px;
      font-weight: 500;
    }
  }
  @{deep} .loginFormLaout {
    margin-top: 40px;
    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
    .el-tabs__nav-scroll {
      padding-bottom: 17px;
      .el-tabs__item {
        font-size: 18px;
        font-weight: 500;
        line-height: normal;
        height: 22px;
        color: #999;
        &.is-active {
          color: #366bad;
        }
      }
      .el-tabs__active-bar {
        bottom: -17px;
      }
    }
    .smsLogin {
      padding-top: 27px;
      .el-form-item {
        margin-bottom: 20px;
        .submintBtn {
          width: 100%;
          height: 48px;
          font-size: 22px;
        }
        .mobileBox {
          position: relative;
          .mobileIconBox {
            position: absolute;
            width: 50px;
            height: 50px;
            left: 0;
            top: 0;
            .mobileIcon {
              position: absolute;
              width: 13px;
              height: 20px;
              left: 50%;
              top: 50%;
              background: url("~@/assets/images/shouji.png") no-repeat center
                center;
              background-size: contain;
              transform: translate(-50%, -50%);
            }
          }
        }
        .countDownBox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .codeBox {
            width: 178px;
            position: relative;
            .codeIconBox {
              position: absolute;
              width: 50px;
              height: 50px;
              left: 0;
              top: 0;
              .codeIcon {
                position: absolute;
                width: 13px;
                height: 20px;
                left: 50%;
                top: 50%;
                background: url("~@/assets/images/suotou.png") no-repeat center
                  center;
                background-size: contain;
                transform: translate(-50%, -50%);
              }
            }
          }
          .countDown {
            width: 142px;
            font-size: 16px;
            height: 48px;
            opacity: 1;
            background: #ffffff;
            border: 1px solid #dfdfdf;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #366bad;
            cursor: pointer;
          }
        }
        .el-input {
          font-size: 16px;
          .el-input__inner {
            height: 50px;
            padding-left: 50px;
          }
        }
      }
    }
    .qrCodeBox {
      height: 265px;
      box-sizing: border-box;
      .code_box {
        width: 100%;
        display: flex;
        justify-content: center;
        .qrcode {
          width: 190px;
          height: 190px;
          position: relative;
          margin-top: 15px;
          img {
            width: 190px;
            height: 190px;
          }
          .refresh {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            .refreshIcon {
              width: 100px;
              height: 100px;
              background-color: #fff !important;
              border-radius: 50%;
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 50px;
            }
          }
        }
      }

      .qrText {
        padding-top: 5px;
        font-size: 14px;
        color: #4a85fd;
        text-align: center;
      }
    }
  }
}
@{deep} .rememberPassword {
  .el-checkbox {
    color: #666;
  }
}
</style>
