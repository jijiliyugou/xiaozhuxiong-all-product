<template>
  <div class="erpLoginBox">
    <div class="toplauotBox">
      <div class="toplauot">
        <div class="left">
          <el-image
            style="width: 76px; height: 76px"
            :src="require('@/assets/images/logo.png')"
            fit="contain"
          ></el-image>
          <div class="titleBox">
            <div class="chTitle">
              小竹熊订单同步管理
            </div>
            <div class="enTitle">
              Shenzhen Little Bamboo Bear Technology co.,Ltd.
            </div>
          </div>
        </div>
        <div class="right">
          <div class="shouyeBox" @click="toHome">
            <i class="homeIcon"></i>
            <span class="homeText">首页</span>
          </div>
          <div class="shouyeBox" @click="isErpOrder">
            <i class="mySampleIcon"></i>
            <span class="sampleText">
              我的订单
            </span>
          </div>
          <div class="loginBtn">登录系统</div>
        </div>
      </div>
    </div>
    <div class="loginWrap">
      <div class="loginBox">
        <div class="left">
          <p class="yijian">订单信息一键同步</p>
        </div>
        <div class="middel">
          <div class="qrCodeWrap">
            <div class="qrCodeBox">
              <p class="title">二维码登录</p>
              <div class="saomadenglu">
                <vue-qr
                  :text="options.url"
                  :logoSrc="options.icon + '?cache'"
                  :colorDark="options.colorDark"
                  :colorLight="options.colorLight"
                  :margin="options.margin"
                  :size="options.size"
                ></vue-qr>
                <div class="refresh" v-show="showQrCode">
                  <div class="refreshIcon" @click="getQrCodeUrl">
                    <i class="el-icon-refresh"></i>
                  </div>
                </div>
              </div>
              <p class="saoyisao">{{ qrcodeTitle }}</p>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="title">登录系统</div>
          <div class="accountLogin">账号登录</div>
          <div class="myForm">
            <el-form
              :model="loginForm"
              ref="erpLoginRef"
              :rules="mobileRules"
              label-width="74px"
            >
              <el-form-item prop="PhoneNumber" label="手机号">
                <div class="myInputBox">
                  <i class="inputIcon mobile"></i>
                  <el-input
                    v-model="loginForm.PhoneNumber"
                    class="myInput"
                    placeholder="请输入手机号码"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="identifyCode" label="验证码">
                <div class="getCode">
                  <div class="myInputBox">
                    <i class="inputIcon idCode"></i>
                    <el-input
                      v-model="loginForm.identifyCode"
                      class="verifycode myInput"
                      placeholder="请输入验证码"
                      @keyup.enter.native="toErpOrder"
                      :disabled="
                        loginForm.PhoneNumber.search(
                          /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|8[0-9]|9[89])\d{8}$/
                        ) === -1
                      "
                    ></el-input>
                  </div>
                  <span
                    class="codeSpan"
                    v-show="show"
                    :style="{
                      opacity:
                        loginForm.PhoneNumber.search(
                          /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|8[0-9]|9[89])\d{8}$/
                        ) === -1
                          ? 0.5
                          : 1
                    }"
                    @click="getCode"
                    >获取验证码</span
                  >
                  <span v-show="!show" @click="getCode" class="myCount"
                    >{{ count }}s重新获取</span
                  >
                </div>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :class="{ loginBtn: true, active: !loginForm.identifyCode }"
                  :disabled="!loginForm.identifyCode"
                  @click="toErpOrder"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div class="erweimaBox">
            <erweimaComponent />
          </div>
        </div>
      </div>
    </div>
    <!-- 旧版界面 -->
    <!-- <div class="erweimaApp" @mouseenter="hoverLogo" @mouseleave="hoverIsLogo">
      <img class="jiaerweima" :src="jiaerweima" alt="" />
      <div class="saomaDiv" v-show="isActive">
        <div class="saoma"></div>
      </div>
    </div>
    <div class="top">
      <div class="logo">
        <img src="~@/assets/images/logo.png" alt="" />
      </div>
      <h3>欢迎登录小竹熊 云科技</h3>
      <p>
        <span class="topP">小竹熊 云科技后台订单处理系统</span>
      </p>
    </div>
    <div class="loginFormBox">
      <div class="formIten left">
        <div class="leftBox">
          <p class="title">
            <span>二维码登录</span>
          </p>
          <div class="erweima">
            <div class="erweimaBox">
              <vue-qr
                :text="options.url"
                :logoSrc="options.icon + '?cache'"
                colorDark="#018e37"
                colorLight="#fff"
                :margin="10"
                :size="198"
              ></vue-qr>
              <div class="refresh" v-show="showQrCode">
                <div class="refreshIcon" @click="getQrCodeUrl">
                  <i class="el-icon-refresh"></i>
                </div>
              </div>
            </div>
          </div>
          <p class="info">{{ qrcodeTitle }}</p>
        </div>
      </div>
      <div class="formIten right">
        <p class="title">
          <span>验证码登录</span>
        </p>
        <div class="myForm">
          <el-form :model="loginForm" ref="erpLoginRef" :rules="mobileRules">
            <el-form-item prop="PhoneNumber">
              <div class="myInputBox">
                <i class="inputIcon mobile"></i>
                <el-input
                  v-model="loginForm.PhoneNumber"
                  class="myInput"
                  placeholder="请输入手机号码"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item prop="identifyCode">
              <div class="getCode">
                <div class="myInputBox">
                  <i class="inputIcon idCode"></i>
                  <el-input
                    v-model="loginForm.identifyCode"
                    class="verifycode myInput"
                    placeholder="请输入验证码"
                    @keyup.enter.native="toErpOrder"
                    :disabled="
                      loginForm.PhoneNumber.search(
                        /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|8[0-9]|9[89])\d{8}$/
                      ) === -1
                    "
                  ></el-input>
                </div>
                <span
                  v-show="show"
                  :style="{
                    opacity:
                      loginForm.PhoneNumber.search(
                        /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|8[0-9]|9[89])\d{8}$/
                      ) === -1
                        ? 0.5
                        : 1
                  }"
                  @click="getCode"
                  >获取验证码</span
                >
                <span v-show="!show" class="count active"
                  >{{ count }}s重新获取</span
                >
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :class="{ loginBtn: true, active: !loginForm.identifyCode }"
                :disabled="!loginForm.identifyCode"
                @click="toErpOrder"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import VueQr from "vue-qr";
import erweimaComponent from "./erweimaComponent";
import { getMenuFuc } from "@/router/index";
export default {
  components: {
    VueQr,
    erweimaComponent
  },
  data() {
    return {
      myWs: null,
      jiaerweima: require("@/assets/images/erweimaicon@2x.png"),
      isActive: false,
      timer: null,
      qrTimer: null,
      showQrCode: false,
      qrcodeTitle: "请用小竹熊App扫一扫登录",
      options: {
        // 二维码配置
        url: "https://www.baidu.com",
        icon: require("@/assets/images/logo.png"),
        colorDark: "#018e37",
        colorLight: "#fff",
        margin: 10,
        size: 198
      },
      show: true,
      count: 60,
      loginForm: {
        PhoneNumber: "",
        identifyCode: ""
      },
      mobileRules: {
        PhoneNumber: [
          {
            required: true,
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|8[0-9]|9[89])\d{8}$/,
            message: "手机格式不正确",
            trigger: "blur"
          }
        ],
        identifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, message: "验证码长度最少为4位", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    hoverLogo() {
      this.isActive = true;
      this.jiaerweima = require("@/assets/images/erweima2.png");
    },
    hoverIsLogo() {
      this.jiaerweima = require("@/assets/images/erweimaicon@2x.png");
      this.isActive = false;
    },
    toHome() {
      this.$router.push("/erpHome");
    },
    isErpOrder() {
      if (this.$store.state.isLogin) this.$router.push("/erpOrder");
      else this.$message.error("请先登录");
    },
    // 手机验证倒计时
    async getCode() {
      if (
        !/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|8[0-9]|9[89])\d{8}$/.test(
          this.loginForm.PhoneNumber
        )
      ) {
        this.$message.closeAll();
        this.$message.error("请输入手机号");
        return;
      }
      const res = await this.$http.post("/api/SendSMS", {
        PhoneNumber: this.loginForm.PhoneNumber,
        MessageType: "SignIn"
      });
      console.log(res);
      const TIME_COUNT = 60;
      if (this.timer) {
        clearInterval(this.timer);
      }
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
    },
    // 登录
    async toErpOrder() {
      this.$refs.erpLoginRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post("/api/Authenticate", {
            userAccountOrUserMobile: this.loginForm.PhoneNumber,
            platForm: "PC",
            loginType: "VerificationCode",
            VerificationCode: this.loginForm.identifyCode
          });
          if (res.data.result.isLogin) {
            this.$store.commit("setToken", res.data.result);
            if (res.data.result.commparnyList.length === 1) {
              this.$store.commit("handlerLogin", true);
              // 一个角色
              this.$router.push("/erpOrder");
            } else if (res.data.result.commparnyList.length > 1) {
              // 多个角色
              this.$router.push({
                path: "/erpLoginConfirm"
              });
            }
          } else {
            this.$message.error(res.data.result.message);
          }
        }
      });
    },
    // 获取二维码链接
    async getQrCodeUrl() {
      const res = await this.$http.post("/api/UserRandomCode", {});
      if (res.data.result.code === 200) {
        this.options.url = res.data.result.item.qrCode;
        this.randomCode = res.data.result.item.randomCode;
        this.initWebSocket();
      }
      const TIME_COUNT = 300;
      let count = TIME_COUNT;
      this.showQrCode = false;
      this.qrcodeTitle = "请用小竹熊App扫一扫登录";
      clearInterval(this.qrTimer);
      this.qrTimer = setInterval(() => {
        if (count > 0 && count <= TIME_COUNT) {
          count--;
        } else {
          this.showQrCode = true;
          this.qrcodeTitle = "二维码已失效，点击刷新";
          clearInterval(this.qrTimer);
          this.qrTimer = null;
        }
      }, 1000);
    },
    // 初始化 webSocket
    initWebSocket() {
      if (typeof WebSocket === "undefined") {
        this.$message.error("您的浏览器不支持WebSocket");
      } else {
        // 初始化weosocket
        // 测试
        // this.ws = new WebSocket(
        //   'ws://139.9.71.135:8090/ws?UserId=' + this.randomCode
        // )
        // 正式
        this.myWs = new WebSocket(
          "wss://impush.toysbear.com/ws?UserId=" + this.randomCode
        );
        // 监听webSocket连接
        this.myWs.onopen = this.websocketonopen;
        // 监听webSocket错误信息
        this.myWs.onerror = this.websocketonerror;
        // 监听webSocket消息
        this.myWs.onmessage = this.websocketonmessage;
        // 监听webSocket退出
        this.myWs.onclose = this.websocketclose;
      }
    },
    // webSocket 连接成功
    websocketonopen() {
      console.log("WebSocket连接成功");
    },
    // webSocket 连接错误
    websocketonerror() {
      console.log("WebSocket连接发生错误");
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
      this.myWs.send(agentData);
    },
    // 关闭 webSocket
    websocketclose() {
      console.log("退出websocket了");
    },
    // 等一会
    async waitTime(s) {
      this.$store.commit("updateAppLoading", true);
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, 1000 * s);
      });
    },
    // 监听结果
    async getUserConfirm() {
      const res = await this.$http.post("/api/UserConfirm", {
        RandomCode: this.randomCode
      });
      if (res.data.result.isLogin) {
        clearInterval(this.qrTimer);
        this.qrTimer = null;
        this.$store.commit("setToken", res.data.result);
        this.$store.commit("handlerLogin", true);
        this.$store.commit(
          "setComparnyId",
          res.data.result.commparnyList[0].commparnyId
        );
        await this.waitTime(1);
        // 二维码登录成功获取菜单
        try {
          const re = await this.$http.post("/api/GetUserRoleMenu", {});
          if (re.data.result.code === 200) {
            this.$store.commit("setRouters", re.data.result.item.modulesList);
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
            console.log(Json);
            this.$store.commit("globalJson/setGlobalJson", Json);
            this.$router.push("/erpOrder");
          } else {
            this.$message.error(re.data.result.msg);
            this.$store.commit("removeLoginItems");
          }
        } catch (error) {
          this.$store.commit("updateAppLoading", false);
          this.$message.error("获取菜单失败，请检查该角色是否有公司类型");
        }
      } else {
        this.$message.closeAll();
        console.log(res.data.result.message);
      }
    },
    // 获取系统参数
    async getClientTypeList(type) {
      const res = await this.$http.post("/api/ServiceConfigurationList", {
        basisParameters: type
      });
      if (res.data.result.code === 200) {
        return res.data.result.item;
      }
    }
  },
  mounted() {
    if (this.$route.query.id === "signOut")
      this.$store.commit("removeLoginItems");
    this.getQrCodeUrl();
  },
  beforeDestroy() {
    clearInterval(this.qrTimer);
    clearInterval(this.timer);
    this.myWs.close();
  }
};
</script>

<style lang="less" scoped>
@import "./erpLogin.less";
// .erpLoginBox {
//   width: 800px;
//   height: 800px;
//   background: url("~@/assets/images/erpbg.png") no-repeat center;
//   background-size: 100%;
//   margin: 0 auto;
//   box-sizing: border-box;
//   padding: 0 32px;
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   .erweimaApp {
//     position: absolute;
//     right: 0;
//     top: 100px;
//     width: 34px;
//     height: 34px;
//     border: 1px solid #165af7;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     transform: translate(0, -50%);
//     &:hover {
//       background-color: #165af7;
//     }
//     .jiaerweima {
//       width: 18px;
//       height: 18px;
//       left: -50%;
//       top: 50%;
//     }
//     .saomaDiv {
//       position: absolute;
//       width: 120px;
//       height: 100px;
//       left: -110px;
//       .saoma {
//         width: 100px;
//         height: 100px;
//         position: absolute;
//         box-sizing: border-box;
//         background: url("~@/assets/images/erweimaxiazai.png") no-repeat center;
//         background-size: 100%;
//         &::after {
//           content: "";
//           display: block;
//           position: absolute;
//           right: -19px;
//           top: 50%;
//           width: 0;
//           height: 0;
//           border: 10px solid transparent;
//           border-left-color: #fff;
//           transform: translate(0, -50%);
//         }
//       }
//     }
//   }
//   .top {
//     height: 195px;
//     width: 100%;
//     box-sizing: border-box;
//     display: flex;
//     flex-direction: column;
//     text-align: center;
//     justify-content: center;
//     .logo {
//       height: 72px;
//       img {
//         height: 72px;
//       }
//     }
//     p {
//       margin-top: 10px;
//       .topP {
//         position: relative;
//         padding: 0 10px;
//         &::before,
//         &::after {
//           content: "";
//           position: absolute;
//           width: 60px;
//           height: 2px;
//           background-color: #d8e3fa;
//           top: 50%;
//         }
//         &::before {
//           left: 100%;
//         }
//         &::after {
//           right: 100%;
//         }
//       }
//     }
//   }
//   .loginFormBox {
//     width: 100%;
//     height: 416px;
//     background: url("~@/assets/images/erpLoginBg1.png") no-repeat center;
//     background-size: 100% 100%;
//     border-radius: 20px;
//     box-shadow: 1px 3px 10px 1px rgba(0, 60, 200, 0.1);
//     padding: 50px;
//     box-sizing: border-box;
//     display: flex;
//     .formIten {
//       flex: 1;
//     }
//     .left {
//       .leftBox {
//         width: 220px;
//         margin: 0 auto;
//         box-sizing: border-box;
//         .title {
//           text-indent: 20px;
//           font-weight: 400;
//           span {
//             position: relative;
//             &::before {
//               content: "";
//               position: absolute;
//               width: 6px;
//               height: 20px;
//               left: -10px;
//               top: 50%;
//               opacity: 0.7;
//               border-radius: 0px 3px 3px 0px;
//               background-color: #165af7;
//               transform: translate(0, -50%);
//             }
//           }
//         }
//         .erweima {
//           width: 100%;
//           height: 220px;
//           margin: 29px 0 6px 0;
//           box-sizing: border-box;
//           padding: 10px;
//           .erweimaBox {
//             border: 1px solid #eeeeee;
//             background-color: #fff;
//             position: relative;
//             .refresh {
//               position: absolute;
//               width: 100%;
//               height: 100%;
//               left: 0;
//               top: 0;
//               background-color: rgba(255, 255, 255, 0.9);
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               .refreshIcon {
//                 width: 100px;
//                 height: 100px;
//                 background-color: #fff;
//                 border-radius: 50%;
//                 cursor: pointer;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 font-size: 50px;
//               }
//             }
//           }
//         }
//         .info {
//           font-size: 14px;
//           font-weight: 300;
//           color: #353535;
//           text-align: center;
//         }
//       }
//     }
//     .right {
//       .title {
//         text-indent: 20px;
//         font-weight: 400;
//         span {
//           position: relative;
//           &::before {
//             content: "";
//             position: absolute;
//             width: 6px;
//             height: 20px;
//             left: -10px;
//             top: 50%;
//             opacity: 0.7;
//             border-radius: 0px 3px 3px 0px;
//             background-color: #165af7;
//             transform: translate(0, -50%);
//           }
//         }
//       }
//       .myForm {
//         margin-top: 29px;
//         /deep/ .el-form-item {
//           padding: 10px 0;
//           /deep/ input {
//             height: 54px;
//           }
//           .myInputBox {
//             position: relative;
//             .inputIcon {
//               position: absolute;
//               left: 20px;
//               top: 50%;
//               width: 30px;
//               height: 30px;
//               z-index: 1;
//               transform: translate(0, -50%);
//               &.mobile {
//                 background: url("~@/assets/images/手机 (2).png") no-repeat
//                   center;
//               }
//               &.idCode {
//                 background: url("~@/assets/images/验证码.png") no-repeat center;
//               }
//             }
//             .myInput {
//               input.el-input__inner {
//                 padding-left: 57px;
//               }
//             }
//           }
//         }
//         .getCode {
//           display: flex;
//           color: #999;
//           justify-content: space-between;
//           cursor: pointer;
//           span {
//             flex-shrink: 0;
//             height: 54px;
//             width: 120px;
//             background: #447dff;
//             border-radius: 25px;
//             margin-left: 10px;
//             font-size: 14px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             color: #ffffff;
//             &.active {
//               opacity: 0.5;
//             }
//           }
//         }
//         .loginBtn {
//           width: 100%;
//           height: 60px;
//           border-radius: 10px;
//           background: #165af7;
//           &.active {
//             opacity: 0.5;
//           }
//         }
//       }
//     }
//   }
// }
</style>
