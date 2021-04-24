<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-10-19 16:28:17
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-23 15:05:38
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
          <!-- <div class="qrcode">
            <img :src="[type=='qrCode'? loginPic:qrCodePic]" @click="changeTypeQrCode()">
          </div> -->
          <div class="type" v-model="type">
            <Row :gutter="16">
              <Col span="6">
              </Col>
              <Col span="6">
                <div class="item" :class="[type=='message' ? 'active':'']" @click="changeType('message')">{{$t("login.message_login_text")}}</div>
              </Col>
              <Col span="6">
                <div class="item" :class="[type=='qrCode' ? 'active':'']" @click="changeType('qrCode')">{{$t("login.qr_code")}}</div>
              </Col>
              <Col span="6">
              </Col>
            </Row>
          </div>
          <!-- <div class="qrcode_type" v-else>
            {{$t("login.qr_code")}}
          </div> -->
          <template v-if="type=='qrCode'">
            <!-- <img :src="qrCodeUrl" width="160px;height:160px"/> -->
            <vue-qr
              :text="options.url"
              :logoSrc="options.icon + '?cache'"
              colorLight="#fff"
              colorDark="#018e37"
              :margin="0"
              :size="160"
            ></vue-qr>
            <p style="font-size:13px;color:#666666">{{$t("login.scan")}}</p>
          </template>
          <template v-else-if="type=='message'">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate2" :label-width="100" label-colon class="input_form_wrap">
              <FormItem :label="$t('login.phone')" prop="userCode">
                <Input v-model="formValidate['userCode']" :style="{width:'300px',marginLeft: '-50px'}" :placeholder="$t('login.account_placeholder')" :maxlength="11"></Input>
              </FormItem>
              <FormItem :label="$t('login.verification_code')" prop="passWord">
                <Input v-model="formValidate['passWord']" :style="{width:'180px',marginLeft: '-170px'}" :placeholder="$t('login.verification_code_text')" :maxlength="6"></Input><div style="position:absolute;right: 50px;top: 0;"><Button :style="{height: '40px',width:'102px'}" @click="sendSMS" :disabled='!sendBottonStatus' >{{!sendBottonStatus ? count+'s':$t("login.get_verification_code")}}</Button></div>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="login" :style="{width:'300px',marginLeft: '-50px'}" >{{$t("login.button")}}</Button>  
              </FormItem>
            </Form>
          </template>
          <!-- <template v-else-if="type=='login'">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" label-colon class="input_form_wrap">
              <FormItem :label="$t('login.account')" prop="userCode">
                <Input v-model="formValidate['userCode']" :style="{width:'300px',marginLeft: '-50px'}" :placeholder="$t('login.account_placeholder')" :maxlength="11"></Input>
              </FormItem>
              <FormItem :label="$t('login.password')" prop="passWord">
                <Input v-model="formValidate['passWord']" :style="{width:'300px',marginLeft: '-50px'}" :placeholder="$t('login.password_placeholder')" :maxlength="6"></Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="login" :style="{width:'300px',marginLeft: '-50px',height:'36px'}" >{{$t("login.button")}}</Button>  
              </FormItem>
            </Form>
          </template> -->
        </div>
      </div>
    </div>
    <LoginFooter></LoginFooter>
  </div>
</template>

<script>
import * as Cookies from "js-cookie";
import VueQr from "vue-qr";
import SIdentify from "@components/public/sIdentify/sIdentify";
import LoginFooter from "@components/footer/loginFooter";
import tokenService from "@service/tokenService";
import {
  validateEmail,
  validatePassword
} from '@utils/vaildata'

export default {
  name: "Login",
  components: {
      SIdentify,
      LoginFooter,
      VueQr
  },
  data() {
      var userCode = localStorage.getItem("userCode");
      return {
        logUrl: require("@assets/default/logo.png"),
        titleUrl: require("@assets/images/title_s.png"),
        qrCodeUrl: require("@assets/images/default_qrcode.png"),
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
        type: "message",
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
          // userCode: [
          //   { required: true, message: '请输入账号', trigger: 'blur' }
          // ],
          // passWord: [
          //   { required: true, message: '请输入密码', trigger: 'blur' }
          // ],
        },
        ruleValidate2:{
          // userCode: [
          //   { required: true, message: '请输入手机号', trigger: 'blur' }
          // ],
          // passWord: [
          //   { required: true, message: '请输入验证码', trigger: 'blur' }
          // ],
        },
        mac:'',
        baseMode: "avc",
        transcode: "interop",
        attendeeMode: "video",
        videoProfile: "720p_6",
        sendBottonStatus:true,
        timer:null,
        count: '',
        wsBaseUrl:process.env.VUE_APP_WX,
        options: {
            // 二维码配置
            url: " ",
            icon: require("@assets/images/logo.png")
        },
      };
  },
  watch:{
    type:{
      handler(val){
        if(val=='qrCode'){
          this.getQrCodeUrl();
        } else {
          
        }
      }
    } 
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
      let params = {};
      params.loginType = this.type=='login' ? 1 : this.type=='message' ? 2 : 3;
      params.targetId = this.formValidate.userCode;
      params.targetCode = this.formValidate.passWord;
      params.code = this.mac;
      this.$loading.show();
      tokenService
        .pcLogin(params)
        .then(data => {
          if(data.success){
            Cookies.set("isAdmin", true);
            var token = tokenService.getToken();
            if (token) {
              switch(data.data.status) {
                case -1:
                  this.$router.push('/createMeeting');
                  break;
                case 0:
                  this.$router.push('/createMeeting');
                  break;
                case 1:
                  Cookies.set("channel", data.data.roomNumber);
                  Cookies.set("baseMode", this.baseMode);
                  Cookies.set("transcode", this.transcode);
                  Cookies.set("attendeeMode", this.attendeeMode);
                  Cookies.set("videoProfile", this.videoProfile);
                  Cookies.set("uid", data.data.meetingRoomMemberId);
                  Cookies.set("companyName", data.data.companyName||'');
                  this.$router.push({name:'Home',params:{status:data.data.status}}); 
                  break;
                default:
                  ''
              } 
            }
          }
        })
        .catch(err => {
          this.$loading.hide();
          this.$Message.error({
            background: true,
            content: '温馨提示：'+ err.data&&err.data.errors&&err.data.errors['TargetCode'][0] || err.data.message
          });
        });
    },
    qrLogin() {
      let params = {};
      params.loginType=3;
      params.targetId = this.randomCode;
      params.targetCode = this.options.url;
      params.code = this.mac;
      this.$loading.show();
      tokenService
        .pcLogin(params)
        .then(data => {
          if(data.success){
            Cookies.set("isAdmin", true);
            var token = tokenService.getToken();
            if (token) {
              switch(data.data.status) {
                case -1:
                  this.$router.push('/createMeeting');
                  break;
                case 0:
                  this.$router.push('/createMeeting');
                  break;
                case 1:
                  Cookies.set("channel", data.data.roomNumber);
                  Cookies.set("baseMode", this.baseMode);
                  Cookies.set("transcode", this.transcode);
                  Cookies.set("attendeeMode", this.attendeeMode);
                  Cookies.set("videoProfile", this.videoProfile);
                  Cookies.set("uid", data.data.meetingRoomMemberId);
                  Cookies.set("companyName", data.data.companyName||'');
                  this.$router.push({name:'Home',params:{status:data.data.status}}); 
                  break;
                default:
                  ''
              } 
            }
          }
        })
        .catch(err => {
          this.$loading.hide();
          this.$Message.error({
            background: true,
            content: '温馨提示：'+err.data.errors['TargetId'][0]+','+err.data.errors['TargetCode'][0]
          });
        });
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
    sendSMS() {
      if (this.formValidate.userCode) {
        let params = {};
        params.phoneNumber = this.formValidate.userCode;
        tokenService
        .sendTestCode(params)
        .then(data => {
          if(data.success){
            this.$Message.info({
              background: true,
              content: '温馨提示：'+data.message
            });
            this.countDown();
          }
        })
        .catch(err => {
          this.$Message.error({
            background: true,
            content: '温馨提示：'+err.message
          });
        });
      } else {
        this.$Message.error({
          background: true,
          content: '温馨提示：手机号不能为空！'
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
    //切换多语言
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
    },
    //生成机器识别码guid
    generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    },
    //验证码倒计时
    countDown(){
      this.count = 60;
      this.timer = window.setInterval(() => {
        if (this.count > 0 && this.count <= 60){
          this.sendBottonStatus=false;
          this.count--;
        } else {
          // 倒计时完，可点击
          this.sendBottonStatus=true;
          clearInterval(this.timer)
          this.timer = 60
        }
      }, 1000)
    },
    countDownQrCode(){
      this.count = 300;
      this.timer = window.setInterval(() => {
        if (this.count > 0 && this.count <= 300){
          this.count--;
        } else {
          // 倒计时完，可点击
          this.getQrCodeUrl();
          clearInterval(this.timer)
          this.timer = 300
        }
      }, 1000)
    },
    // 初始化 webSocket
    initWebSocket() {
      if (typeof WebSocket === "undefined") {
        this.$Message.error({
          background: true,
          content: '温馨提示：'+您的浏览器不支持WebSocket
        });
      } else {
        // 初始化weosocket
        // 正式
        this.ws = new WebSocket(this.wsBaseUrl + this.randomCode);
        // 测试
        // this.ws = new WebSocket(
        //   'ws://139.9.71.135:8090/ws?UserId=' + this.randomCode
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
    },
    // webSocket 数据接收
    websocketonmessage(e) {
      const redata = JSON.parse(e.data);
      console.log(redata);
      if (redata.action === "QrCodeLogin") {
        this.qrLogin();
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
    // 获取二维码链接
    async getQrCodeUrl() {
      const res = await tokenService.getQrCodeUrl();
      if (res.success) {
        this.options.url = res.data.qrCode;
        this.randomCode = res.data.randomCode;
        // 开启长连接
        this.initWebSocket();
        this.countDownQrCode();
      }
    },
  },
  created() {
    tokenService.clean();
    this.mac = window.localStorage.getItem('mac') || '';
    if(!this.mac){
      this.mac = this.generateUUID();
      window.localStorage.setItem('mac',this.mac);
    }
  },
  mounted() {
    this.initKeypress();
    this.locale = this.$i18n.locale;
    this.changeLangFn(this.locale);
    this.$FromLoading.hide();
  }
};
</script>

<style lang="less" scoped>
.login{
  width: 100%;
  height: 100%;
  .wrapper {
    width: 100%;
    color: #464c5b;
    background: #fff;
    height: 100%;
    position: relative;
    .wrapper_dropdown{
      position: absolute;
      top: 0;
      right: 0;
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
}
</style>
