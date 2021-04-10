d<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-10-19 16:28:17
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-11-02 12:00:31
-->
<template>
  <div class="login" ref="login">
    <div class="wrapper">
      <div class="wrapper_dropdown">
        <Dropdown trigger="click" style="margin-left: 20px" @on-click="onClickDropdown">
          <a href="javascript:void(0)">
            language:{{language}}
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="zh">中文</DropdownItem>
            <DropdownItem name="en">English</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="login_wrapper">
        <div class="head">
          <div class="title">
            <img :src="titleUrl">
          </div>
        </div>
        <div class="login_box">
          <div class="qrcode">
            <img :src="[type=='qrCode'? loginPic:qrCodePic]" @click="changeTypeQrCode()">
          </div>
          <div class="type" v-model="type" v-if="type!='qrCode'">
            <Row :gutter="16">
              <Col span="6">
              </Col>
              <Col span="6">
                <div class="item" :class="[type=='login' ? 'active':'']" @click="changeType('login')">账号登录</div>
              </Col>
              <Col span="6">
                <!-- <div class="item" :class="[type=='qrCode' ? 'active':'']" @click="changeType('qrCode')">二维码登录</div> -->
                <div class="item" :class="[type=='message' ? 'active':'']" @click="changeType('message')">短信登录</div>
              </Col>
              <Col span="6">
              </Col>
            </Row>
          </div>
          <div class="qrcode_type" v-else>
            二维码登录
          </div>
          <template v-if="type=='qrCode'">
            <img :src="qrCodeUrl" width="160px;height:160px"/>
            <p style="font-size:13px;color:#666666">请使用小竹熊App扫一扫登录</p>
          </template>
          <template v-else-if="type=='message'">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" label-colon>
              <FormItem label="账号" :prop="userCode">
                <Input v-model="formValidate['userCode']" :style="{width:'300px',marginLeft: '-50px'}" placeholder="请输入手机号" :maxlength="11"></Input>
              </FormItem>
              <FormItem label="验证码" :prop="passWord">
                <Input v-model="formValidate['passWord']" :style="{width:'180px',marginLeft: '-170px'}" placeholder="请输入验证码" :maxlength="4"></Input><div style="position:absolute;right: 50px;top: 0;"><Button>获取验证码</Button></div>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="login" :style="{width:'300px',marginLeft: '-50px'}" >{{$t("login.button")}}</Button>  
              </FormItem>
            </Form>
          </template>
          <template v-else-if="type=='login'">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" label-colon>
              <FormItem label="账号" :prop="userCode">
                <Input v-model="formValidate['userCode']" :style="{width:'300px',marginLeft: '-50px'}" placeholder="请输入手机号" :maxlength="11"></Input>
              </FormItem>
              <FormItem label="密码" :prop="passWord">
                <Input v-model="formValidate['passWord']" :style="{width:'300px',marginLeft: '-50px'}" placeholder="请输入密码" :maxlength="6"></Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="login" :style="{width:'300px',marginLeft: '-50px'}" >{{$t("login.button")}}</Button>  
              </FormItem>
            </Form>
          </template>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer_wrap">
        <div class="footer_wrap_first">
          <div style="margin-right:10px">技术支持：0754-89671122</div> 
          <div class="qq"></div>
          <div style="margin-left:10px">客服001</div>
          <div class="qq" style="margin-left:10px"></div>
          <div style="margin-left:10px">客服002</div>
        </div>
        <div>Copyright © 2021深圳宏升软件技术开发有限公司  粤ICP备13031421号-4</div>
      </div>
    </div>
  </div>
</template>

<script>
import SIdentify from "@components/public/sIdentify/sIdentify";
import tokenService from "@service/tokenService";
import {
  validateEmail,
  validatePassword
} from '@utils/vaildata'

export default {
  name: "Login",
  components: {
      SIdentify
  },
  data() {
      var userCode = localStorage.getItem("userCode");
      return {
        logUrl: require("@assets/default/logo.png"),
        titleUrl: require("@assets/images/title_s.webp"),
        qrCodeUrl: require("@assets/images/default_qrcode.webp"),
        qrCodePic: require("@assets/images/qrcodeLogin.webp"),
        loginPic: require("@assets/images/pc_login.webp"),
        mail: "",
        userCode: userCode || "",
        passWord: "",
        mobile: "",
        testCode: "",
        show: false,
        isLoginInpFoc: false,
        isLoginInpFocS: false,
        isMobileLogin: false,
        showTestCode: true,
        isDisabled: true,
        theme: "",
        count: 60,
        controls: "",
        type: "login",
        code: "",
        identifyCode: "",
        phoneNumber: "",
        phoneVerificationCode: "",
        tenantCode: "",
        rUserCode: '',
        rPassWord: '',
        language:'简体中文',
        locale: [],
        changeLang: [
          {
            value: "zh",
            label: "简体中文"
          },
          {
            value: "en",
            label: "English"
          },
          {
            value: "tc",
            label: "繁體中文"
          }
        ],
        formValidate:{
          userCode:'',
          passWord:''  
        },
        ruleValidate:{

        }
      };
  },
  methods: {
    /**
     * @name: gaojiahao
     * @test: 登录
     * @msg:
     * @param {*}
     * @return {*}
     */
    login() {
        // let params = {};
        // if (this.isMobileLogin) {
        //     if (!this.mobile || !this.testCode) {
        //         this.$Message.error("请输入有效的手机号或验证码！");
        //         return;
        //     }
        //     params.phoneNumberOrEmailAddress = this.mobile;
        //     params.password = this.testCode;
        //     params.rememberClient = true;
        //     params.platForm = 'backstage';
        //     params.loginType = 'Password';
        //     params.verificationCode ='';
        //     params.timestamp = new Date();
        // } else {
        //     if (!this.userCode || !this.passWord) {
        //         this.$Message.error("请输入用户名或密码");
        //         return;
        //     }
        //     if (this.code) {
        //         if (this.code!=1111 && this.code.toLowerCase() != this.identifyCode.toLowerCase()) {
        //             this.$Message.error("验证码出错");
        //             return;
        //         }
        //     } else {
        //         this.$Message.error("验证码不能为空");
        //         return;
        //     }
        //     params.phoneNumberOrEmailAddress = this.userCode;
        //     params.password = this.passWord;
        //     params.rememberClient = true;
        //     params.platForm = 'backstage';
        //     params.loginType = 'Password';
        //     params.verificationCode ='';
        //     params.timestamp = +new Date();
        // }
        // this.$loading.show();
        // tokenService
        //     .pcLogin(params)
        //     .then(data => {
        //         if(data['result']['isLogin']){
        //             var token = tokenService.getToken();
        //             if (token) {
        //                 this.$router.push('index');
        //             }
        //         } else {
        //             this.$loading.hide();
        //             this.$Message["error"]({
        //                 background: true,
        //                 content: '温馨提示：' + data['result']['message']
        //             });
        //             this.refreshCode();    
        //         }
        //     })
        //     .catch(err => {
        //         this.$loading.hide();
        //         this.$Message["error"]({
        //             background: true,
        //             content: '温馨提示：' + err.message
        //         });
        //         this.refreshCode();
        //     });
      this.$router.push('/createMeeting');
    },
    /**
     * @name: gaojiahao
     * @test: 注册
     * @msg:
     * @param {*}
     * @return {*}
     */
    async register() {
        let params = {};

        if (this.phoneNumber === '') {
            this.$Message.error('请正确填写邮箱');
            return;
        } else {
            if (this.phoneNumber !== '') {
                var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (!reg.test(this.phoneNumber)) {
                    this.$Message.error('请输入有效的邮箱');
                    return;
                }
            }
        }
        if (!this.rUserCode) {
            this.$Message.error("请输入用户名");
            return;
        }
        if (this.rPassWord === '') {
            this.$Message.error('请正确填写密码');
            return;
        } else {
            if (this.rPassWord !== '') {
                var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
                if (!passwordreg.test(this.rPassWord)) {
                    this.$Message.error('密码必须由数字、字母、特殊字符组合,请输入6-16位')
                    return;
                }
            }
        }
        if (!this.tenantCode) {
            this.$Message.error("请输入商户号");
            return;
        }

        params.email = this.phoneNumber;
        params.verificationCode = this.phoneVerificationCode;
        params.userName = this.rUserCode;
        params.password = this.rPassWord;
        params.tenantCode = this.tenantCode;
        this.$loading.show();
        tokenService
            .register(params)
            .then(res => {
                if (res.status == '200') {
                    this.$loading.hide();
                    this.$Message.info('注册成功');
                    this.type = 'login';
                }
            })
            .catch(err => {
                this.$loading.hide();
                this.$Message["error"]({
                    background: true,
                    content: '温馨提示：' + err.message
                });
                this.refreshCode();
                this.initEL('input');
            });
    },
    alertError(message) {
        this.$Message.error({
            content: message
        });
        return;
    },
    /**
     * @name: gaojiahao
     * @test: 随机验证码
     * @msg:
     * @param {*}
     * @return {*}
     */
    generatedCode() {
        const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
            'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
            's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
        ]
        let code = ''
        for (let i = 0; i < 4; i++) {
            let index = Math.floor(Math.random() * 62)
            code += random[index]
        }
        return code
    },
    /**
     * @name: gaojiahao
     * @test: 更改登录注册类型
     * @msg:
     * @param {*}
     * @return {*}
     */
    changeType(type) {
        this.type = type;
        this.initKeypress();
    },
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode() {
        this.identifyCode = ''
        this.makeCode(this.identifyCode, 4)
    },
    makeCode(o, l) {
        this.identifyCode = this.generatedCode();
    },
    send() {
        if (this.phoneNumber) {
            this.$Message.info({
                content: '温馨提示：' + "发送成功！"
            });
        }
    },
    setIdentifyCode(value){
        this.identifyCode = value;
    },
    initEl() {
        var controls = document.getElementsByTagName('input');
        for (var i = 0; i < controls.length; i++) {
            if (i == 0 && controls[i].type == 'text') {
                controls[i].focus();
            }
        }
    },
    initKeypress(){
        this.initEl();
        var inputGroup = document.getElementsByTagName("input");
        var inputGroupArr = Array.from(document.getElementsByTagName("input"));
        var iGlength = inputGroupArr.length;
        var me = this;
        document.onkeypress = function (e) {
            var e = event || e;

            var idx = inputGroupArr.indexOf(e.srcElement);
            if ((e.keyCode == 13 || e.which == 13) && idx > -1) {
                if (idx == iGlength - 1) { //表明已经是最后一个输入框
                    var a = document.getElementsByTagName("button")[0];
                    document.getElementsByTagName("button")[0].focus();
                } else {
                    inputGroup[idx + 1].focus();
                }
                if(idx==2){
                    me.login();    
                }
                e.preventDefault();
            }
        }
    },
    //   切换多语言
    changeLangFn(val) {
      let chan = this.changeLang;
      for (let i in chan) {
        if (chan[i].value === val) {
          this.locale = this.$i18n.locale = chan[i].value;
          this.language = chan[i].label;
          localStorage.setItem("language", chan[i].value);
        }
      }
    },
    onClickDropdown(val){
      this.changeLangFn(val);
    },
    changeTypeQrCode(){
      this.type = this.type=='qrCode' ? 'login':'qrCode';
    }
  },
  created() {
    tokenService.clean();
  },
  mounted() {
    this.initKeypress();
    this.locale = this.$i18n.locale;
    this.changeLangFn(this.locale);
  }
};
</script>

<style lang="less" scoped>
.login{
  .wrapper {
    width: 100%;
    color: #464c5b;
    background: #fff;
    height: 900px;
    .wrapper_dropdown{
      float: right;
      margin: 10px;
      a{
        color: #17233d;
      }
    }
    .header{
      width: 100%;
      height: 70px;
      background: #fff;
      border-bottom: solid 1px #eee;
    }
    .container {
      width: 1170px;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
      .title{
          font-size: 48px;
      }
    }
    .container {
      width: 1170px;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
    }
    .login_wrapper{
      position: absolute;
      top: 20%;
      left: calc((100% - 1277px) / 2);
      width: 1277px;
      height: 726px;
      background-image: url("~@assets/bg/bg.png");
      background-repeat:no-repeat;
      background-size: cover;
      background-position: center 0;
      .head{
        color:#2684D1;
        display: flex;
        width: 300px;
        margin-left: 50px;
        margin-bottom: 30px;
        margin-left: 488.5px;
        .logo{
          img{
            width: 70px;
          }
        }
        .title{
          padding: 10px;
          .title_cn{
            font-size: 24px;
            text-align: center;
            font-weight: 600;
          }
        }
      }
      .login_box {
          // border-radius: 10px;
          width: 450px;
          height: 337px;
          background: rgba(255,255,255,0.6);
          box-shadow:  0 1px 6px rgb(0 0 0 / 20%);
          text-align: center;
          margin-left: 413.5px;
          position: relative;
          .qrcode {
            position: absolute;
            top: 7px;
            right: 7px;
          }
          .text {
              padding-top: 20px;
              color: #464c5b;
              font-size: 2rem;
          }

          .account {
              margin-top: 20px;
              width: 200px;
          }

          .password {
              margin-top: 20px;
              width: 200px;
          }

          .login_button {
              width: 200px;
              display: inline-block;
              position: relative;
              vertical-align: middle;
              line-height: normal;

              .ivu-btn-primary {
                  width: 200px;
                  margin-bottom: 20px;
                  margin-top: 20px;
              }
          }

          .type {
            margin-top: 51px;
            height: 32px;
            display: inline-block;
            width: 100%;
            position: relative;
            vertical-align: middle;
            line-height: normal;
            font-size: 18px;
            color: #666666;
            margin-bottom: 38px;
            .active {
              color: #57a3f3;
            }
            .item{
              font-weight: 600;
            }
          }
          .qrcode_type {
            margin-top: 51px;
            height: 32px;
            display: inline-block;
            width: 100%;
            position: relative;
            vertical-align: middle;
            line-height: normal;
            font-size: 18px;
            color: #333333;
            font-weight: 600;
            margin-bottom: 13px;  
          }
      }
    }
  }
  .footer {
    position: relative;
    width: 100%;
    text-align: center;
    line-height: 24px;
    margin-top: -70px;
    height: 107px;
    padding: 14px 15px 0 15px;
    color:#fff;
    background: #2684D1;
    border-top: solid 1px #ddd;
    overflow: hidden;
    .footer_wrap{
      padding-top:18px;
      .footer_wrap_first{
        display: flex;
        justify-content:center;
        .qq {
          background: url('~@assets/images/qq2.webp');
          background-repeat: no-repeat;
              margin-top: 4px;
          width: 13px;
          height: 16px;
        }
      }
    }
  }
}
</style>
