d<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-10-19 16:28:17
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-11-02 12:00:31
-->
<template>
  <div class="createMeeting" ref="createMeeting">
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
          <div class="type">
            <Row :gutter="16">
              <Col span="8">
              </Col>
              <Col span="8">
                <div class="item active">{{$t("addMeeting.title")}}</div>
              </Col>
              <Col span="8">
              </Col>
            </Row>
          </div>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" label-colon class="input_form_wrap">
            <!-- <FormItem label="会议ID" prop="id">
              <Input v-model="formValidate['id']" :style="{width:'300px',marginLeft: '-50px'}" :maxlength="11" disabled></Input>
            </FormItem> -->
            <FormItem :label="$t('addMeeting.company')" prop="company">
              <Input v-model="formValidate['company']" :style="{width:'300px',marginLeft: '-47px'}" :placeholder="$t('addMeeting.companyText')"></Input>
            </FormItem>
            <FormItem :label="$t('addMeeting.nickName')" prop="nickName">
              <Input v-model="formValidate['nickName']" :style="{width:'300px',marginLeft: '-47px'}" :placeholder="$t('addMeeting.nickNameText')"></Input>
            </FormItem>
            <FormItem :label="$t('addMeeting.videoId')" prop="videoId">
              <Select v-model="formValidate['videoId']" :style="{width:'300px',marginLeft: '-47px'}" clearable @on-select="onChangeVideoDevice">
                <Option v-for="(item,index) in videoDevices" :value="item.deviceId" :key="index">{{ item.label }}</Option>
             </Select>
            </FormItem>
            <FormItem prop="settings" :style="{float: 'left'}">
              <CheckboxGroup v-model="formValidate.settings">
                <Checkbox label="isM">{{$t("addMeeting.audio")}}</Checkbox>
                <Checkbox label="isC">{{$t("addMeeting.camera")}}</Checkbox>
              </CheckboxGroup>    
            </FormItem>
            <FormItem>
              <Button type="primary" @click="save" :style="{width:'300px',marginLeft: '-50px',height:'36px'}" >{{$t("createMeeting.button")}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <LoginFooter></LoginFooter>
  </div>
</template>

<script>
import RMT from "@/assets/js/signalROptions/signalROptions";
import * as Cookies from "js-cookie";
import LoginFooter from "@components/footer/loginFooter";
import {
  JoinMeetingRoom
} from "@service/meetingService";
import tokenService from "@service/tokenService";

export default {
  name: "addMeeting",
  components: {
    LoginFooter    
  },
  data() {
    return {
      logUrl: require("@assets/default/logo.png"),
      titleUrl: require("@assets/images/title_s.png"),
      formValidate:{
        company:'',
        nickName:'',
        settings:['isM','isC'],
        videoId:'',
      },
      baseMode: "avc",
      transcode: "interop",
      attendeeMode: "video",
      videoProfile: "1080p_2",  //省流量测试
      ruleValidate:{
        company: [
          { required: true, message: this.$t('addMeeting.companyText'), trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: this.$t('addMeeting.nickNameText'), trigger: 'blur' }
        ],
      },
      videoDevices:[],
      roomNumber:'',
      mac:'',
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
    };
  },
  methods: {
    save(){
      var params = {
        company:this.formValidate.company,
        nickName:this.formValidate.nickName,
        code:window.localStorage.getItem("mac"),
        roomNumber:this.roomNumber
      };
      this.$refs['formValidate'].validate((valid) => {
        if(valid) {
          return new Promise((resolve, reject) => {
            this.$FromLoading.show();
            JoinMeetingRoom(params).then(res => {
              if (res.success) {
                Cookies.set("isAdmin", false);
                Cookies.set("baseMode", this.baseMode);
                Cookies.set("transcode", this.transcode);
                Cookies.set("attendeeMode", this.attendeeMode);
                Cookies.set("videoProfile", this.videoProfile);
                Cookies.set("uid", res.data.meetingRoomMemberId);
                Cookies.set("videoId", this.formValidate.videoId);
                Cookies.set("companyName", res.data.companyName);
                window.sessionStorage.setItem("isMic",res.data.isAllowOpenMicrophone);
                window.sessionStorage.setItem("isCar",res.data.isAllowOpenCameras);
                this.$router.push('/');  
              } else {
                this.$Message.error({
                  background: true,
                  content: res.result.msg
                });
                this.$FromLoading.hide();
              }
            });
          });
        }
      })
    },
    onChangeVideoDevice(){

    },
    async initRMT() {
      this.rtc = new RMT({ groupNumber:null, token:null, uid:null });
      this.videoDevices = this.rtc
        .getDevices()
        .then(res => {
          this.videoDevices = res.videoDevices;
          this.formValidate['videoId'] = this.videoDevices[0]&&this.videoDevices[0]['deviceId'];
        })
        .catch(err => {
          console.log(err);
        });
    },
    tempSetToken(){
      var globalToken = {
        token : this.generateUUID(),
      };
      window.sessionStorage.setItem('SPHY_LOGIN_TOKEN', JSON.stringify(globalToken));
      tokenService.setAgoraToken();
    },
    generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    },
    onClickDropdown(val){
      this.changeLangFn(val);
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
  },
  mounted() {
    this.locale = this.$i18n.locale;
    this.changeLangFn(this.locale);
  },
  created(){
    this.initRMT();
    this.roomNumber = this.$route.query.roomNumber;
    this.mac = window.localStorage.getItem('mac') || '';
    if(!this.mac){
      this.mac = this.generateUUID();
      window.localStorage.setItem('mac',this.mac);
    }
    Cookies.set("channel", this.roomNumber);
    this.tempSetToken();
  }
};
</script>

<style lang="less" scoped>
.createMeeting{
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
      top: 15%;
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
          height: 470px;
          background: rgba(255,255,255,0.6);
          box-shadow:  0 1px 6px rgb(0 0 0 / 20%);
          text-align: center;
          margin-left: 413.5px;
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
      }
    }
  }
}
</style>
