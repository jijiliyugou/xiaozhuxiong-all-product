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
                <div class="item active">进入会议</div>
              </Col>
              <Col span="8">
              </Col>
            </Row>
          </div>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" label-colon>
            <!-- <FormItem label="会议ID" prop="id">
              <Input v-model="formValidate['id']" :style="{width:'300px',marginLeft: '-50px'}" :maxlength="11" disabled></Input>
            </FormItem> -->
            <FormItem label="公司名称" prop="company">
              <Input v-model="formValidate['company']" :style="{width:'300px',marginLeft: '-47px'}" placeholder="请输入公司名称"></Input>
            </FormItem>
            <FormItem label="昵称" prop="name">
              <Input v-model="formValidate['name']" :style="{width:'300px',marginLeft: '-47px'}" placeholder="请输入您的昵称"></Input>
            </FormItem>
            <FormItem prop="settings">
              <CheckboxGroup v-model="formValidate.settings" :style="{marginLeft: '-150px'}">
                <Checkbox label="isM">打开麦克风</Checkbox>
                <Checkbox label="isC">打开摄像头</Checkbox>
              </CheckboxGroup>    
            </FormItem>
            <FormItem>
              <Button type="primary" @click="save" :style="{width:'300px',marginLeft: '-50px'}" >{{$t("createMeeting.button")}}</Button>
            </FormItem>
          </Form>
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
export default {
  name: "addMeeting",
  components: {
      
  },
  data() {
    return {
      logUrl: require("@assets/default/logo.png"),
      titleUrl: require("@assets/images/title_s.webp"),
      formValidate:{
        id:'111111111111111',
        company:'',
        name:'',
        settings:['isM','isC']
      },
      ruleValidate:{

      }
    };
  },
  methods: {
    save(){
      this.$router.push('/');
    }  
  },
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
          height: 369px;
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
