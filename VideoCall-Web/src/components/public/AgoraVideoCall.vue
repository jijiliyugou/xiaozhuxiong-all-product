<template>
  <div id="ag-canvas">
    <!-- <div class="error">
      <img :src="cameraPic">
      <p class="text" v-if="!havecCamera">您的设备未检测到摄像头</p> 
    </div> -->
    <div id='default' class="user" style="width: 99px;height: 66px;grid-area: 12 / 1 / 13 / 3;z-index: 1;border: 1px solid rgb(255, 255, 255);" @click.stop="setMainVideo('default')"><div class="active"></div></div>
    <!-- <div id='1' class="user" style="width: 99px;height: 66px;grid-area: 12 / 3 / 13 / 6;z-index: 1;border: 1px solid rgb(255, 255, 255);background:white"></div>
    <div id='2' class="user" style="width: 99px;height: 66px;grid-area: 12 / 6 / 13 / 9;z-index: 1;border: 1px solid rgb(255, 255, 255);background:white"></div>
    <div id='3' class="user" style="width: 99px;height: 66px;grid-area: 12 / 9 / 13 / 12;z-index: 1;border: 1px solid rgb(255, 255, 255);background:white"></div>
    <div id='4' class="user" style="width: 99px;height: 66px;grid-area: 12 / 12 / 13 / 15;z-index: 1;border: 1px solid rgb(255, 255, 255);background:white"></div>
    <div id='5' class="user" style="width: 99px;height: 66px;grid-area: 12 / 15 / 13 / 18;z-index: 1;border: 1px solid rgb(255, 255, 255);background:white"></div>
    <div id='6' class="user" style="width: 99px;height: 66px;grid-area: 12 / 18 / 13 / 21;z-index: 1;border: 1px solid rgb(255, 255, 255);background:white"></div>
    <div id='7' class="user" style="width: 99px;height: 66px;grid-area: 12 / 21 / 13 / 24;z-index: 1;border: 1px solid rgb(255, 255, 255);background:white"></div> -->
  </div>
</template>

<script>
import AgoraRTC from "agora-rtc-sdk-ng"
import * as Cookies from "js-cookie";
import { merge } from "lodash";
import video from '@mixins/video';
import {
  CloseMeetingRoom,
  JoinMeetingRoom,
  QuitMeetingRoom,
} from "@service/meetingService";

export default {
  data() {
    return {
      cameraPic: require("@assets/images/camera-lg.png"),
      config:{},
      code:'',
      client: {},
      localStream: {},
      shareClient: {},
      shareStream: {},
      displayMode: "pip",
      streamList: [],
      readyState: false,
      localAudioTrack:null,
      localVideoTrack:null,
      token:null,
      userId:null,
      audioDevices:[],
      videoDevices:[],
      uList:{},
      count:1,
      isMultMode:false,   //是否多人模式
      havecCamera:false,   //是否有摄像头
      nowVideoId:'',
    };
  },
  props: [
    "transcode",
    "attendeeMode",
    "videoProfile",
    "channel",
    "baseMode",
    "appId",
    "uid",
    "videoId",
    "userlist",
    "isAdmin"
  ],
  mixins:[video],
  methods: {
    //发布频道与加入
    async join() {
      // debugger
      var $=this;
      await $.testDevices();
      if(!$.videoDevices.length){
        this.$Message.error({
          background: true,
          content: this.$t("video.tipCamera")
        });
        return false;
      } else {
        // debugger
        //this.havecCamera = true;
        this.$emit('set-img',false);
        if(!$.videoId){
          $.nowVideoId = $.videoDevices[0]['deviceId'];
        } else {
          $.nowVideoId = $.videoId;
        }
      }
      AgoraRTC.setLogLevel(0);  //日志级别0,1,2,3,4
      // $.client.enableDualStream().then(() => {
      //   console.log("Enable Dual stream success!");
      // }).catch(err => {
      //   console.log(err);
      // });
      // this.client.setRemoteVideoStreamType();
      $.client.on("user-published", this.handleUserPublished);
      $.client.on("user-unpublished", this.handleUserUnpublished);
      $.client.on("connection-state-change",(cur,rev,reason)=>{
        if(reason=='UID_BANNED'){
          this.leaveMeetingRoom();  
        }
        console.log('链接状态',cur);
      });
      $.client.on("user-joined",(user)=>{
        var name = '';
        if(this.userlist.length){
            for(var i=0;i<this.userlist.length;i++){
                if(user.uid==this.userlist[i]['id']){
                    name = this.userlist[i]['nickname'];
                    break;
                }
            }
        }
        this.$Message.info({
          background: true,
          content: this.$t("video.user")+name+this.$t("video.join")
        });
        this.$parent.$parent.$parent.$parent.$parent.getQueryMeetingRoomMembers();
      });
      $.client.on("user-left",(user)=>{
        var name = '';
        if(this.userlist.length){
            for(var i=0;i<this.userlist.length;i++){
                if(user.uid==this.userlist[i]['id']){
                    name = this.userlist[i]['nickname'];
                    break;
                }
            }
        }
        this.$Message.info({
          background: true,
          content: this.$t("video.user")+name+this.$t("video.leave")
        });
        this.$parent.$parent.$parent.$parent.$parent.getQueryMeetingRoomMembers();
      });
      [ $.userId, $.localAudioTrack, $.localVideoTrack ] = await Promise.all([
        $.client.join($.appId, $.channel, $.token || null,parseInt($.uid)),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(
          {encoderConfig: $.videoProfile,cameraId:$.nowVideoId}   //只有谷歌支持最低的，别的浏览器最低480p
        )
      ]);
      //主持人的大画面
      const playerContainer = document.createElement("div");
      // 给这个 DIV 节点指定一个 ID，这里指定的是远端用户的 UID。下面缩略图画面
      playerContainer.id = $.uid;
      playerContainer.className = "user-video";
      playerContainer.style.width = "100%";
      playerContainer.style.height = "100%";
      playerContainer.style.gridArea = "span 12/span 24/13/25";
      document.getElementById("ag-canvas").appendChild(playerContainer);
      $.localVideoTrack.play(playerContainer);
      await $.client.publish([this.localAudioTrack, this.localVideoTrack]);
      console.log("publish success");
      this.testNetWork();
      //this.initDevices();
    },
    async leave(){
      this.$FromLoading.show();
      await QuitMeetingRoom({roomNumber:this.channel,meetingRoomMemberId:this.uid}).then(res => {
        if (res.success) {
          this.$Message.info({
            background: true,
            content: res.message
          });
          this.leaveMeetingRoom();
        } else {
          this.$Message.error({
            background: true,
            content: res.result.msg
          });
          this.$FromLoading.hide();
        }
      }); 
    },
    //离开频道
    async leaveMeetingRoom() {
      await this.client.leave();
      this.$router.push('/login');
    },
    //订阅远端用户
    async subscribe(user, mediaType) {
      // debugger
      var $ = this;
      const uid = user.uid;
      // subscribe to a remote user
      await this.client.subscribe(user, mediaType);
      var itemList =document.getElementById("ag-canvas").childNodes;
      var items=[];
      for(var i=0;i<itemList.length;i++){
        if(itemList[i].nodeName!='#text'){
          items.push(itemList[i]);
        }
      };
      var userLength = ((items.length-1 <=0) ?1:(items.length-1))+1;
      console.log("subscribe success");
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        // 动态插入一个 DIV 节点作为播放远端视频轨道的容器。
        for(var i=0;i<$.userlist.length;i++){
          if(uid==$.userlist[i]['id']){
            // if($.userlist[i]['isMaster']){
            const playerContainer = document.createElement("div");
            playerContainer.id = user.uid.toString();
            playerContainer.className = "user-video";
            playerContainer.style.width = "99px";
            playerContainer.style.height = "66px";
            playerContainer.style.gridArea = `12 / ${1 * userLength} / 13 / ${4 * userLength}`;  //
            playerContainer.style.zIndex = 1;
            playerContainer.style.border = "1px solid #FFFFFF";
            playerContainer.onclick = function () { $.setMainVideo(playerContainer.id) };
            document.getElementById("ag-canvas").appendChild(playerContainer);
            remoteVideoTrack.play(playerContainer);
          }  
        }
        //如果当前是多人模式，就修改成多人样式
        if(this.isMultMode){
          this.setMainVideo('default');
        }
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    },
    //设置主视频页面
    setMainVideo(val){
      // debugger
      var $=this;
      var itemList =document.getElementById("ag-canvas").childNodes;
      var items=[];
      for(var i=0;i<itemList.length;i++){
        if(itemList[i].nodeName!='#text'){
          items.push(itemList[i]);
        }
      };
      var count = 0;
      if(val=='default'){
        var flag = items.length-1;
        this.isMultMode = true;
        switch(flag){
          case 1:
            break;
          case 2:
            this.setMulitVideo(items,2);
            break;
          case 3:
            this.setMulitVideo(items,3);
            break;
          case 4:
            this.setMulitVideo(items,4);
            break;
          case 5:
            this.setMulitVideo(items,5);
            break;
          case 6:
            this.setMulitVideo(items,6);
            break;
          case 7:
            this.setMulitVideo(items,7);
            break;
          case 8:
            this.setMulitVideo(items,8);
            break;
          default:
            break
        } 
      } else {
        this.isMultMode = false;
        for(var i=0;i<items.length;i++){
          console.log(items[i]);
          if(items[i]['id']==val){
            items[i].style.width = "100%";
            items[i].style.height = "100%";
            items[i].style.gridArea = "span 12/span 24/13/25";
            items[i].style.zIndex = 0;
            items[i].style.border = "unset";
          } else {
            count++;
            items[i].style.width = "99px";
            items[i].style.height = "66px";
            items[i].style.gridArea = `12 / ${1 * count} / 13 / ${4 * count}`;  //
            items[i].style.zIndex = 1;
            items[i].style.border = "1px solid #FFFFFF";
            items[i].style.display = "block"; 
            items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
          }
        }
      }
    },
    //用户发布订阅
    handleUserPublished(user, mediaType) {
      const id = user.uid;
      // remoteUsers[id] = user;
      this.subscribe(user, mediaType);
      this.uList[id] = {
        user:user,
        mediaType:mediaType
      }
    },
    //用户取消发布订阅
    async handleUserUnpublished(user,mediaType) {
      if (mediaType === "video") {
        // 获取刚刚动态创建的 DIV 节点。
        const playerContainer = document.getElementById(user.uid.toString());
        // 销毁这个节点。
        // await this.client.unsubscribe(user,'video');
        var my = document.getElementById("ag-canvas");
        if(my != null)
          my.removeChild(playerContainer);
        // playerContainer.remove();
      } else if(mediaType === "audio"){
        // await this.client.unsubscribe(user,'audio');
      } else {
        // await this.client.unsubscribe(user); 
      }
    },
    //结束会议
    async endMeeting(){
      this.$FromLoading.show();
      await CloseMeetingRoom({roomNumber:this.channel,code:this.code}).then(res => {
        if (res.success) {
          this.$FromLoading.hide();
          this.$Message.info({
            background: true,
            content: res.message
          });
          this.closeMeeting();
        } else {
          this.$Message.error({
            background: true,
            content: res.result.msg
          });
          this.$FromLoading.hide();
        }
      }); 
    },
    async closeMeeting(){
      await this.client.unpublish([this.localAudioTrack, this.localVideoTrack]);
      this.$router.push('/login');
    },
    //通话质量检测
    async testNetWork(){
      var $=this;
      $.client.on("network-quality", (quality) => {
        //console.log("上行网络质量：", quality.uplinkNetworkQuality);
        $.$store.commit('setNetworkUp', quality.uplinkNetworkQuality);
      });

      // 获取下行网络质量
      $.client.on("network-quality", (quality) => {
        //console.log("下行网络质量：", quality.downlinkNetworkQuality);
        $.$store.commit('setNetworkDown', quality.downlinkNetworkQuality);
      });

      // 获取上行统计数据
      //var uplinkVideoStats = $.client.getLocalVideoStats();
      // 获取下行统计数据
      //var downlinkVideoStats =  $.client.getRemoteVideoStats();

      //console.log("uplink video stats", uplinkVideoStats);
      //console.log("downlink video stats", downlinkVideoStats);
    },
    //通话前设备检测
    async testDevices(){
      await AgoraRTC.getDevices()
        .then(devices => {
          this.audioDevices=[];
          this.videoDevices=[];
          for(var i in devices){
            if(devices[i]['kind']=='audioinput'){
              this.audioDevices.push({
                deviceId:devices[i]['deviceId'],
                groupId:devices[i]['groupId'],
                kind:devices[i]['kind'],
                label:devices[i]['label'],
              });
            }
            if(devices[i]['kind']=='videoinput'){
              this.videoDevices.push({
                deviceId:devices[i]['deviceId'],
                groupId:devices[i]['groupId'],
                kind:devices[i]['kind'],
                label:devices[i]['label'],
              });
            }
          }
          // var selectedMicrophoneId = this.audioDevices[0].deviceId;
          // var selectedCameraId = this.videoDevices[0].deviceId;
          // return Promise.all([
          //   AgoraRTC.createCameraVideoTrack({ cameraId: selectedCameraId }),
          //   AgoraRTC.createMicrophoneAudioTrack({ microphoneId: selectedMicrophoneId }),
          // ]);}).then(res=>{
          //   res[0].play('ag-canvas');
          //   setInterval(() => {
          //     const level = res[1].getVolumeLevel();
          //     console.log("本地音频级别：", level);
          //   }, 1000);
        });
    },
    //切换设备
    changeDevices(videoId,audioId){
      if(videoId){
        this.localVideoTrack.setDevice(videoId).then(() => {
          console.log("set device success");
        }).catch(e => {
          console.log("set device error", e);
        });
      }
      if(audioId){
        this.localAudioTrack.setDevice(videoId).then(() => {
          console.log("set device success");
        }).catch(e => {
          console.log("set device error", e);
        });
      }
    },
    //调整麦克风音量
    setVolum(value){
      this.localAudioTrack.setVolume(value);
    },
    initDevices(){
      var isMic = window.sessionStorage.getItem("isMic")=='true' ?true:false;
      var isCar = window.sessionStorage.getItem("isCar")=='true' ?true:false;
      if(!isMic){
        this.$parent.$parent.$parent.$parent.$parent.$refs.footer.setMic();
      }
      if(!isCar){
        this.$parent.$parent.$parent.$parent.$parent.$refs.footer.setCar();
      }
    },
    //开启/关闭摄像头
    async setEnabledCamera(value){
      await this.localVideoTrack.setEnabled(value);
    },
    //开启/关闭麦克风
    async setEnabledAudio(value){
      await this.localAudioTrack.setEnabled(value);
    },
    //设置视频编码格式
    async setVideoEncoder(value){
      this.localVideoTrack.setEncoderConfiguration(value).then(res => {
        this.$Message.info({
          background: true,
          content: this.$t("video.definition")
        });   
      }).catch(e=>{
        console.log(e);
      })
    },
    //关闭发布视频
    async closeVideo(flag){
      if(flag){
        await client.unpublish(this.localVideoTrack);
      } else {
        await client.publish(this.localVideoTrack);  
      }
    },
    //关闭发布音频
    async closeAudio(flag){
      if(flag){
        await client.unpublish(this.localAudioTrack);
      } else {
        await client.publish(this.localAudioTrack);  
      }  
    },
    //用户取消发布订阅
    async closeUserVideo(user,mediaType) {
      if (mediaType === "video") {
        // 获取刚刚动态创建的 DIV 节点。
        const playerContainer = document.getElementById(user.uid.toString());
        // 销毁这个节点。
        await this.client.unsubscribe(user,'video');
        playerContainer.remove();
      } else if(mediaType === "audio"){
        await this.client.unsubscribe(user,'audio');
      } else {
        await this.client.unsubscribe(user); 
      }
    },
    //关闭订阅用户视频
    setUserVideo(uid,type,status){
      var me = this,
      obj={};
      for(var i=0;i<me.client.remoteUsers.length;i++){
        if(uid==me.client.remoteUsers[i]['uid']){
          obj = me.client.remoteUsers[i];
          break;
        }
      }
      if(status){
        this.closeUserVideo(obj,type);
      } else {
        this.subscribe(obj,type);
      }
    },
    //初始化
    async init(){
      let $ = this;
      $.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      //摄像头插入变化
      AgoraRTC.onCameraChanged = async (changedDevice) => {
        if (changedDevice.state === "ACTIVE") {
          this.$Message.info({
            background: true,
            content: this.$t("video.deviceIn")
          });
          $.localVideoTrack&&$.localVideoTrack.setDevice(changedDevice.device.deviceId);
          location.reload();
        // 拔出设备为当前设备时，切换到一个已有的设备。
        } else if (changedDevice.device.label === $.localVideoTrack&&$.localVideoTrack.getTrackLabel()) {
          this.$Message.info({
            background: true,
            content: this.$t("video.deviceChange")
          });
          const oldCameras = await AgoraRTC.getCameras();
          oldCameras[0] &&  $.localVideoTrack.setDevice(oldCameras[0].deviceId);
        } else if(changedDevice.state === "INACTIVE") {
          this.$Message.error({
            background: true,
            content: this.$t("video.deviceOut")
          });  
        }
      };
      //音频插入变化
      AgoraRTC.onMicrophoneChanged = (info) => {
        console.log("microphone changed!", info.state, info.device);
      };
      AgoraRTC.enableLogUpload();
      // await this.testDevices();
      // await this.join();
    }
  },
  mounted(){
    
  },
  created() {
    this.init();
    this.config = JSON.parse(window.sessionStorage.getItem("SPHY_LOGIN_TOKEN"));
    this.code = window.localStorage.getItem("mac");
  },
};
</script>

<style lang="less" scoped>
#ag-canvas {
  height: 100%;
  display: grid;
  grid-gap: 10px;
  justify-items: center;
  grid-template-rows: repeat(12,auto);
  grid-template-columns: repeat(24,auto);
  .error {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: auto;
    margin-left: -78px;
    margin-top: -73.5px;
    width: 156px;
    height: 147px;
    .text {
        color:#fff;
        text-align: center;
    }
  }
  .user {
    width: 99px;
    height: 66px;
    background: #dcdee2;
    margin-left: 5px;
    margin-right: 5px;
    border: 1px solid #FFFFFF;
    .active {
      background: url('~@assets/images/suo.png');
      background-repeat: no-repeat;
      width: 97px;
      height: 64px;
    }
  }

}
</style>

