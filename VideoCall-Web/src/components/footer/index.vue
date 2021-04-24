<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-01 19:15:58
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\footer\index.vue
 * @LastEditTime: 2021-04-23 14:55:28
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="footer">
        <Row>
            <Col span="8">
            </Col>
            <Col span="8">
                <div class="action">
                    <div class="timer item">
                        <span class="red-point"></span>
                        <div class="time-card" data-type="hours" data-max="24">
                            <div class="time-card-count">{{myHours}}</div>
                        </div>
                        <span class="colon">:</span>
                        <div class="time-card" data-type="minutes" data-max="59">
                            <div class="time-card-count">{{myMinutes}}</div>
                        </div>
                        <span class="colon">:</span>
                        <div class="time-card" data-type="seconds" data-max="59">
                            <div class="time-card-count">{{mySeconds}}</div>
                        </div>
                    </div>
                    <Divider type="vertical" />
                    <div class="timer item">
                        <Poptip trigger="hover" title="" content="content">
                            <div class="api" slot="content">
                                <Slider v-model="volum" style="width:100px;" @on-input="onInput"></Slider>    
                            </div>
                            <i class="iconfont icon21maikefeng icon" :class="[isMic ? 'outline':'eye']" @click="setMic()"></i>
                        </Poptip>
                        <span class="time-card-count text">音频</span>
                    </div>
                    <Divider type="vertical" />
                    <div class="timer item">
                        <i class="iconfont iconshexiangtou icon" :class="[isCar ? 'outline':'eye']" @click="setCar()"></i>
                        <span class="time-card-count text">视频</span>
                    </div>
                    <Divider type="vertical" />
                    <div class="timer item">
                        <div class="closeOff" @click="closeOff"></div>
                    </div>
                    <Divider type="vertical" />
                </div>
            </Col>
            <Col span="8">
                <div class="settings">
                    <div class="timer item">
                        <i class="iconfont iconshezhi icon" @click="showModalDetail(true)"></i>
                    </div>
                    <div class="timer item">
                        <i class="iconfont icontianxiexiangqing icon"></i>
                    </div>
                    <div class="timer item">
                        <div class="netWork"></div>
                    </div>
                </div>
            </Col>
        </Row>
        <Setting @show-modal-detail="showModalDetail" :showModal="showModal" :videoDevices="videoDevices" :audioDevices="audioDevices" @change-devices="changeDevices" @change-video-encoder="changeVideoEncoder"></Setting>
        <EscModal @sure-close="sureClose" @cancel-close="cancelClose" :isShowEsc="isShowEsc"></EscModal>
        <ReconnectionModal @reconnection-close="reconnectionClose" @cancel-reconnection="cancelReconnection" :isShowReconnection="isShowReconnection"></ReconnectionModal>
    </div>
</template>
<script>
import * as Cookies from "js-cookie";
import Setting from "@components/footer/setting";
import EscModal from "@components/public/escModal";
import ReconnectionModal from "@components/public/reconnectionModal";
export default {
    name:'Footer',
    components:{
        Setting,
        EscModal,
        ReconnectionModal
    },
    props:{
        videoDevices: {
            type: Array,
            default () {
                return []
            }
        },
        audioDevices: {
            type: Array,
            default () {
                return []
            }
        },
    },
    watch:{
        roomStatus:{
            handler(val){
                if(val==1){
                    debugger
                    this.isShowReconnection = true;
                } else {
                    this.isShowReconnection = false;
                    this.$parent.$parent.$parent.$refs.video.$refs.video.join();
                }
            },
        }    
    },
    data() {
        return {
            currentTime:0,
            timeObj: null, // 时间对象,下方会用到
            myHours: '00', // 我定义来接收计算出来的 小时 的
            myMinutes: '00', // 我定义来接收计算出来的 分钟 的
            mySeconds: '00',// 我定义来接收计算出来的 秒钟 的
            showModal:false,
            isMic:true,
            isCar:true,
            isShowEsc:false,
            isShowReconnection:true,
            volum:100,
            roomStatus:'',
            flag:false
        }
    },
    methods: {
        testTimer(){
            this.timeFunction();
            setInterval(() => {
            this.timeFunction();
            }, 1000)
        },
        timeFunction(){
            // 开始执行倒计时
            this.timeObj = { // 时间对象
            seconds: Math.floor(this.currentTime % 60),
            minutes: Math.floor(this.currentTime / 60) % 60,
            hours: Math.floor(this.currentTime / 60 / 60) % 24
            }
            // 计算出时分秒
            this.myHours = this.timeObj.hours<10?'0'+this.timeObj.hours:this.timeObj.hours;
            this.myMinutes = this.timeObj.minutes<10?'0'+this.timeObj.minutes:this.timeObj.minutes;
            this.mySeconds = this.timeObj.seconds<10?'0'+this.timeObj.seconds:this.timeObj.seconds;
            this.currentTime++;
        },
        showModalDetail(value){
            this.showModal = value;
            this.$emit('get-devices');
        },
        setMic(){
            this.isMic = this.isMic ? false : true;
            this.$parent.$parent.$parent.$refs.video.$refs.video.setEnabledAudio(this.isMic);
        },
        setCar(){
            this.isCar = this.isCar ? false : true;
            this.$parent.$parent.$parent.$refs.video.$refs.video.setEnabledCamera(this.isCar);
        },
        closeOff(){
            this.isShowEsc = true;        
        },
        sureClose(){
            this.isShowEsc = false;
            if(this.flag){
                this.$emit('endMeeting');    
            } else {
                this.$emit('leave');    
            }
        },
        cancelClose(){
            this.isShowEsc = false;    
        },
        reconnectionClose(){
            this.isShowReconnection = false;
            this.$parent.$parent.$parent.$refs.video.$refs.video.join();
        },
        cancelReconnection(){
            this.isShowReconnection = false;
            this.$parent.$parent.$parent.$refs.video.$refs.video.endMeeting();
        },
        //调整通话音量
        onInput(value){
            this.$emit('set-volum',value);
        },
        getDevices(){
            this.$emit('getDevices');
        },
        changeDevices(videoId,audioId){
            this.$emit('change-devices',videoId,audioId);
        },
        changeVideoEncoder(val){
            this.$emit('change-video-encoder',val);    
        }
    },
    created() {
        this.testTimer();
        this.roomStatus = this.$route.params.status||'';
        this.flag =  Cookies.get("isAdmin")=='true' ? true : false;
        this.$parent.$parent.$parent.$refs.video.$refs.video.join();
        // this.isMic = window.sessionStorage.getItem(("isMic")=='true'?true:false);
        // this.isCar = window.sessionStorage.getItem(("isCar")=='true'?true:false);
        // if(!this.flag){
        //     this.isShowReconnection = false;
        // }
    },
}
</script>
<style lang="less" scoped>
.footer{
    height: 59px;
    .action {
        display: flex;
        .item{
            height:59px;
            width: 120px;
        }
    }
    .timer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        // margin: 0 0 4em;
        color: #151414;
        .red-point{
          position: relative;
        }
        .red-point::before{
          content: " ";
          border: 3px solid red;/*设置红色*/
          border-radius:3px;/*设置圆角*/
          position: absolute;
          z-index: 1000;
          right: 0;
          margin-top: -3.5px;
          margin-right: 5px;
        }
        .closeOff {
            background: url('~@assets/images/close.png');
            background-repeat: no-repeat;
            width: 33px;
            height: 33px;
        }
    }
    .time-card {
        text-align: center;
    }
    .time-card-count {
        overflow: hidden;
    }
    .text{
        margin-left: 10px;
    }
    .time-card-label {
        font-size: 0.625em;
        text-transform: uppercase;
        opacity: 0.7;
    }
    .colon {

    }
    /deep/ .ivu-divider, /deep/ .ivu-divider-vertical {
        margin: 0 8px;
        display: inline-block;
        height: 59px;
        width: 1px;
        vertical-align: middle;
        position: relative;
        top: -.06em;
    }
    .outline{
        color:#40C949;
    }
    .eye{
        color: #999999;    
    }
    .close{
        color: #ed4014;
    }
    .icon{
        font-size: 24px;
    }
    .settings{
        display: flex;
        flex-direction: row-reverse;
        .item{
            height:59px;
            width: 51px;
            .netWork {
                background: url('~@assets/images/netWork4.png');
                background-repeat: no-repeat;
                width: 18px;
                height: 19px;
            }
        }
        .icon{
            font-size: 16px;
            color: #666666;
        }
    }
}
</style>