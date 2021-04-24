<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-08 14:46:21
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\public\endingMettingModal.vue
 * @LastEditTime: 2021-04-22 17:53:29
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="timeModal" v-if="show">
        <div class="title">
            <Icon type="ios-alert" class="icon" />
            <div>会议即将结束！</div>
        </div>
        <div class="time">
            <div class="timer item">
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
        </div>
        <div class="action">
            <Button type="primary" shape="circle" style="width:88px;margin:0 14px 0 28px;">重新设置</Button>
            <Button type="warning" shape="circle" style="width:88px;margin:0 28px 0 14px;background:#E6E6E6;border-color:#E6E6E6;color:#666666">取消</Button>
        </div>
    </div>
</template>
<script>
import * as Cookies from "js-cookie";
export default {
    name:'EndingMettingModal',
    props:{
        isShow: {
            type: Boolean,
            default: false
        },
    },
    watch:{
        isShow:{
            handler(val){
                debugger
                this.show = val;
            }
        }
    },
    data() {
        return {
            currentTime:5,
            timeObj: null, // 时间对象,下方会用到
            myHours: '00', // 我定义来接收计算出来的 小时 的
            myMinutes: '00', // 我定义来接收计算出来的 分钟 的
            mySeconds: '00',// 我定义来接收计算出来的 秒钟 的
            count:null,
            show:false,
            endTime:null
        };
    },
    methods:{
        testTimer(){
            this.timeFunction();
            this.count = setInterval(this.timeFunction, 1000);
        },
        timeFunction(){
            // 开始执行倒计时
            this.timeObj = { // 时间对象
                seconds: this.currentTime ? Math.floor(this.currentTime % 60) : '0',
                minutes: this.currentTime ? Math.floor(this.currentTime / 60) % 60 : '0',
                hours: this.currentTime ? Math.floor(this.currentTime / 60 / 60) % 24 : '0'
            }
            if(this.timeObj.seconds=='0'&&this.timeObj.minutes=='0'&this.timeObj.hours=='0'){
                clearInterval(this.count);   
                this.show = false;
            }
            // 计算出时分秒
            this.myHours = this.timeObj.hours<10?'0'+this.timeObj.hours:this.timeObj.hours;
            this.myMinutes = this.timeObj.minutes<10?'0'+this.timeObj.minutes:this.timeObj.minutes;
            this.mySeconds = this.timeObj.seconds<10?'0'+this.timeObj.seconds:this.timeObj.seconds;
            this.currentTime--;
        },
    },
    created() {
        //this.testTimer();
        this.endTime = Cookies.get("endTime");
    }
}
</script>
<style lang="less" scoped>
.timeModal {
    width: 260px;
    height: 200px;
    position: absolute;
    bottom: 22px;
    right: 22px;
    z-index: 2;
    opacity: 1;
    background: #ffffff;
    border-radius: 4px;
    .title{
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        margin: 32px 51px 15px 51px;
        display: flex;
        .icon {
            font-size: 30px; 
            color:#FFB951;
            margin-right: 10px; 
        }
    }
    .time {
        width: 80px;
        height: 42px;
        margin: 0 90px 26px 90px;
        font-size: 30px;
        .timer {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            // margin: 0 0 4em;
            color: #FF4E4E;
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
    }
    .action{
        display: flex;
    }
}
</style>