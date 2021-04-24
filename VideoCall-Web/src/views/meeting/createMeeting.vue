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
                <div class="item active">创建会议</div>
              </Col>
              <Col span="8">
              </Col>
            </Row>
          </div>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" label-colon class="create_form_wrap">
            <FormItem label="会议ID" prop="channel">
              <Input v-model="formValidate['channel']" :style="{width:'300px',marginLeft: '-50px'}" :maxlength="11" disabled></Input>
            </FormItem>
            <FormItem label="选择展厅" prop="companyId">
              <Select v-model="formValidate['companyId']" :style="{width:'300px',marginLeft: '-50px'}" clearable>
                  <Option v-for="(item,index) in companys" :value="item.companyId" :key="index">{{ item.companyName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="昵称" prop="nickName">
              <Input v-model="formValidate['nickName']" :style="{width:'300px',marginLeft: '-50px'}" placeholder="请输入您的昵称"></Input>
            </FormItem>
            <FormItem label="开始时间" prop="startTime">
              <DatePicker type="datetime" v-model="formValidate['startTime']" @on-change="formValidate['startTime']=$event" format="yyyy-MM-dd HH:mm" placeholder="选择开始时间" style="width: 300px;margin-left:-50px"></DatePicker> 
            </FormItem>
            <FormItem label="结束时间" prop="endTime">
              <DatePicker type="datetime" v-model="formValidate['endTime']" @on-change="formValidate['endTime']=$event" format="yyyy-MM-dd HH:mm" placeholder="选择结束时间" style="width: 300px;margin-left:-50px"></DatePicker> 
            </FormItem>
            <FormItem label="入会人数" prop="mettingNumber">
              <Input v-model="formValidate['mettingNumber']" type="number" :style="{width:'300px',marginLeft: '-27px'}" placeholder="请输入1-8" :maxlength="4"></Input><span style="margin-left:10px;color:#666666">人</span>
            </FormItem>
            <FormItem prop="settings">
                <Checkbox v-model="formValidate.settings.isMic" :style="{marginLeft: '-150px'}">打开麦克风</Checkbox>
                <Checkbox v-model="formValidate.settings.isCar">打开摄像头</Checkbox>
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
import * as Cookies from "js-cookie";
import LoginFooter from "@components/footer/loginFooter";
import {
  CreateMeetingRoom
} from "@service/meetingService"

export default {
  name: "createMeeting",
  components: {
    LoginFooter     
  },
  data() {
    const startTimeVail = (rule, value, callback) => {
      if (value == ''||value === undefined) {
        callback(new Error('请选择开始时间'));
      } else {
        callback();
      }
    };
    const endTimeVail = (rule, value, callback) => {
      if (value == ''||value === undefined) {
        callback(new Error('请选择结束时间'));
      } else {
        callback();
      }
    };
    const companyIdVali = (rule, value, callback) => {
      if (value == ''||value === undefined) {
        callback(new Error('请选择展厅'));
      } else {
        callback();
      }
    };
    return {
      logUrl: require("@assets/default/logo.png"),
      titleUrl: require("@assets/images/title_s.png"),
      formValidate:{
        channel:'111111111111111',
        companyId:'',
        nickName:'',
        startTime:'',
        endTime:'',
        mettingNumber:'',
        settings:{
          isMic:true,
          isCar:true
        }
      },
      ruleValidate:{
        companyId: [
          { required: true, message: '请选择展厅', trigger: 'change', validator: companyIdVali }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur', validator: startTimeVail }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur', validator: endTimeVail }
        ],
        mettingNumber: [
          { required: true, message: '请输入入会人数', trigger: 'blur' }
        ],
      },
      channel: "10001",
      baseMode: "avc",
      transcode: "interop",
      attendeeMode: "video",
      videoProfile: "720p_6",  //省流量测试
      companys:[]
    };
  },
  methods: {
    save(){
      var params = {
        roomNumber:this.formValidate.channel,
        companyId:this.formValidate.companyId,
        nickName:this.formValidate.nickName,
        startTime:this.formValidate.startTime,
        endTime:this.formValidate.endTime,
        count:this.formValidate.mettingNumber,
        code:window.localStorage.getItem("mac")
      };
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          return new Promise((resolve, reject) => {
            this.$FromLoading.show();
            CreateMeetingRoom(params).then(res => {
              if (res.success) {
                Cookies.set("channel", this.formValidate.channel);
                Cookies.set("baseMode", this.baseMode);
                Cookies.set("transcode", this.transcode);
                Cookies.set("attendeeMode", this.attendeeMode);
                Cookies.set("videoProfile", this.videoProfile);
                Cookies.set("uid", res.data.meetingRoomMemberId);
                Cookies.set("companyName", res.data.companyName);
                Cookies.set("endTime", this.formValidate.endTime);
                window.sessionStorage.setItem("isMic",this.formValidate.settings.isMic);
                window.sessionStorage.setItem("isCar",this.formValidate.settings.isCar); 
                this.$router.push('/');
              } else {
                this.$Message.error({
                  background: true,
                  content: res.message
                });
                this.$FromLoading.hide();
              }
            });
          }).catch(err=>{
            this.$Message.error({
              background: true,
              content: err.message
            });
            this.$FromLoading.hide();  
          });
        }
      })
    }  
  },
  created(){
    this.$loading.hide();
    var config = JSON.parse(window.sessionStorage.getItem("SPHY_LOGIN_TOKEN"));
    this.companys = config.companyInfos;
    this.formValidate.channel = config.roomNumber;
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
      top: 8%;
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
          height: 600px;
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
            margin: 24px 0;
            height: 32px;
            display: inline-block;
            width: 100%;
            position: relative;
            vertical-align: middle;
            line-height: normal;
            font-size: 18px;
            color: #666666;
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
