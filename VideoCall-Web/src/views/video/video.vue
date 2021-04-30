<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-01 16:54:22
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\views\video\video.vue
 * @LastEditTime: 2021-04-30 11:49:12
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="video">
        <div class="error" v-if="haveCamera">
            <img :src="cameraPic">
            <p class="text">{{$t("other.noCamera")}}</p> 
        </div>
        <div class="box">
            <AgoraVideoCall 
                :videoProfile="videoProfile"
                :channel="channel"
                :transcode="transcode"
                :attendeeMode="attendeeMode"
                :baseMode="baseMode"
                :appId="appId"
                :videoId="videoId"
                :userlist="userlist"
                :isAdmin="isAdmin"
                @set-img="setImg"
                :uid="uid" ref="video"></AgoraVideoCall>
        </div>
        <EndModal :isShow="isShow" ref="endModal" @show-setting="showSetting"></EndModal>
    </div> 
</template>
<script>
import * as Cookies from "js-cookie";
import EndModal from "@components/public/endingMettingModal";
import AgoraVideoCall from "@components/public/AgoraVideoCall";
import {AGORA_APP_ID} from "@root/agora.config"
import videoJs from "@mixins/video.js";
import util from "@utils/util.js";

export default {
    name:'Video',
    components:{
        EndModal,
        AgoraVideoCall
    },
    mixins:[videoJs],
    props:{
        isCollapsed: {
            type: Boolean,
            default: false
        },
        userlist: {
            type: Array,
            default () {
                return []
            }
        },
    },
    data() {
        return {
            cameraPic: require("@assets/images/camera-lg.png"),
            test: require("@assets/bg/test.jpg"),
            isSelect: false,
            videoProfile: Cookies.get("videoProfile").split(",")[0] || "480p_4",
            channel: Cookies.get("channel") || "test",
            transcode: Cookies.get("transcode") || "interop",
            attendeeMode: Cookies.get("attendeeMode") || "video",
            baseMode: Cookies.get("baseMode") || "avc",
            uid: Cookies.get("uid") || null,
            videoId: Cookies.get("videoId") || null,
            isAdmin: Cookies.get("isAdmin") || false,
            isShow:false,
            endTime:'',
            count:null,
            haveCamera:true,
        };
    },
    methods: {
        selectAll(value){
            this.isSelect = value;
            if(this.isSelect) {
                
            }
        },
        timeCount(){
            this.isShow = false;
            this.endTime = Cookies.get("endTime");
            this.count = setInterval(this.timeFunction, 1000);
        },
        timeFunction(){
            var end = new Date(this.endTime);
            var now = new Date(util.getNowTimeHms());
            if(((end.getTime()-now.getTime())/1000)<=300){
                this.isShow = true;
                clearInterval(this.count);
                this.$refs.endModal.testTimer();
            }
        },
        showSetting(){
            this.$parent.$parent.$parent.$parent.$refs.footer.showModalDetail(true);
        },
        againCount(){
            clearInterval(this.count);
            this.timeCount();
            this.$refs.endModal.againCount();
        },
        setImg(value){
            this.haveCamera = value;
        }
    },
    mounted(){
        this.timeCount();
    },
    created() {
        this.appId = AGORA_APP_ID;
    }
}
</script>
<style lang="less" scoped>
    .video{
        width:100%;
        height: 100%;
        position: relative;
        overflow-y: hidden;
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
        .box {
            position: relative;
            width: 100%;
            height: 100%;
            .userlist {
                width: 100%;
                height: 66px;
                position: absolute;
                bottom: 16px;
                display: flex;
                flex-wrap: nowrap;
                justify-content: center;
                .user {
                    width: 99px;
                    height: 66px;
                    background: #dcdee2;
                    margin-left: 5px;
                    margin-right: 5px;
                    border: 1px solid #FFFFFF;
                }
                .active {
                    background: url('~@assets/images/suo.png');
                    background-repeat: no-repeat;
                    width: 97px;
                    height: 64px;
                }
            }
            .video_wrap {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                height: 807px;
            }
        }
    }
</style>