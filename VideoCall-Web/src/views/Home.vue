<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-03-31 17:09:19
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\views\Home.vue
 * @LastEditTime: 2021-04-23 14:54:18
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="home" id="homeBox">
    <Layout>
        <Header>
          <Heads></Heads>
        </Header>
        <Layout>
            <Sider hide-trigger breakpoint="md" class="container-sider" v-model="isCollapsed" collapsible :collapsed-width="0" ref="side1" hide-trigger :width="220">
              <UserList @collapsed-sider="collapsedSider" :userlist="userlist"></UserList>
              <div class="nextPage" v-if="isCollapsed" @click="collapsedSider">
                <Icon type="ios-arrow-forward" />
              </div>
            </Sider>
            <Content>
              <Video :isCollapsed="isCollapsed" ref='video' @change-devices="changeDevices" :userlist="userlist"></Video>
            </Content>
            <Sider ref="side2" hide-trigger :width="311">
              <Order :userlist="userlist"></Order>
            </Sider>
        </Layout>
        <Footer>
          <Footers @leave="leave" @endMeeting="endMeeting" @set-volum="setVolum" @get-devices="getDevices" :videoDevices="videoDevices" :audioDevices="audioDevices" @change-devices="changeDevices" 
             @change-video-encoder="changeVideoEncoder"
           ></Footers>
        </Footer>
    </Layout>
  </div>
</template>

<script>
import * as Cookies from "js-cookie";
import Heads from "@components/head/index";
import UserList from "@views/user/userList";
import Video from "@views/video/index";
import Order from "@views/order/index";
import Footers from "@components/footer/index";
import {
  QueryMeetingRoomMembers
} from "@service/meetingService";

export default {
  name: "Home",
  components:{
    Heads,
    UserList,
    Video,
    Order,
    Footers
  },
  data() {
    return {
      isCollapsed: false,
      videoDevices:null,
      audioDevices:null,
      userlist:[],
      roomNumber:''
    };
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    //退出房间
    leave(){
      this.$refs.video.$refs.video.leave();
    },
    //结束会议
    endMeeting(){
      this.$refs.video.$refs.video.endMeeting();    
    },
    //调整麦克风音量
    setVolum(value){
      this.$refs.video.$refs.video.setVolum(value);   
    },
    //获取设备
    getDevices(){
      this.videoDevices = this.$refs.video.$refs.video.videoDevices;
      this.audioDevices = this.$refs.video.$refs.video.audioDevices;
    },
    //改变设备
    changeDevices(videoId,audioId){
      this.$refs.video.$refs.video.changeDevices(videoId,audioId);
    },
    //改变摄像头分辨率
    changeVideoEncoder(val){
      this.$refs.video.$refs.video.setVideoEncoder(val);  
    },
    getQueryMeetingRoomMembers(){
      return new Promise((resolve, reject) => {
        QueryMeetingRoomMembers({roomNumber:this.roomNumber}).then(res => {
          if (res.success) {
            this.userlist = res.data; 
          } else {
            this.$Message.error({
              background: true,
              content: res.result.msg
            });
          }
        });
      });  
    }
  },
  mounted() {
    
  },
  created() {
    this.$loading.hide();
    this.$FromLoading.hide();
    this.config = JSON.parse(window.sessionStorage.getItem("SPHY_LOGIN_TOKEN"));
    this.roomNumber = Cookies.get("channel");
    this.getQueryMeetingRoomMembers();
  }
};
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  background: #fff;
  background-size: 100% 100%;
  display: flex;
  flex-wrap: wrap;
  .ivu-layout /deep/ {
    /deep/ .ivu-layout-header{
      background: #fff;
      box-shadow: 0 1px 6px rgb(0 0 0 / 20%);
      border-color: #eee;
      z-index: 1;
      line-height: unset;
    }
    /deep/ .ivu-layout.ivu-layout-has-sider {
      height: 803px;
    }
    .ivu-layout-sider{
      background: #fff;  
    }
    /deep/ .ivu-layout-content{
      background: url('~@assets/bg/bg.jpg');
      background-size: cover;
      background-repeat: no-repeat; 
      opacity: 1;
    }
    /deep/ .ivu-layout-footer{
      border-top:1px solid #e0e0e0;
      background: #fff;
      padding: unset;
    }
  }
  .item {
    width: 300px;
    height: 300px;
    margin: 10px;
  }
  .nextPage {
    position: fixed;
    top: 50%;
    left:10px;
    width: 40px;
    height: 60px;
    padding: 10px 0;
    margin-top: -30px;
    line-height: 40px;
    color: #717171;
    text-align: center;
    pointer-events: auto;
    background: #fff;
    z-index: 1;
    transition: all 0.2s ease-in-out;
  }
}
</style>
