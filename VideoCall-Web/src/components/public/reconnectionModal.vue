<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-08 14:53:35
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\public\reconnectionModal.vue
 * @LastEditTime: 2021-04-23 17:42:02
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="reconnection_modal_wrap" v-if="show">
        <div class="reconnection_modal">
            <div class="title">
                <Icon type="ios-alert" class="icon" />
                <div>异常退出，是否重新链接？</div>
            </div>
            <div class="content">
                上一次会议室：{{roomNumber}}，进行中...    
            </div>
            <div class="action">
                <Button type="primary" shape="circle" style="width:88px;margin:0 14px 0 78px;background:#2684D1;border-color:#2684D1" @click="reconnection">重新链接</Button>
                <Button type="warning" shape="circle" style="width:88px;margin:0 78px 0 14px;background:#FF5151;border-color:#FF5151" @click="close">结束关闭</Button>
            </div>
        </div>
    </div>
</template>
<script>
import * as Cookies from "js-cookie";

export default {
    name:'ReconnectionModal',
    props:{
        isShowReconnection: {
            type: Boolean,
            default: false
        },
    },
    watch:{
        isShowReconnection:{
            handler(val){
                this.show = val;
            },
        }
    },
    data() {
        return {
            show:false,
            roomNumber:null
        }
    },
    methods:{
        reconnection(){
            this.$emit('reconnection-close');    
        },
        close(){
            this.$emit('cancel-reconnection');
        }
    },
    created(){
        this.roomNumber = Cookies.get("channel");
    }
}
</script>
<style lang="less" scoped>
.reconnection_modal_wrap{
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.4);
    .reconnection_modal {
        width: 360px;
        height: 200px;
        position: fixed;
        bottom: calc((100% - 100px) / 2);
        right: calc((100% - 260px) / 2);
        z-index: 10000;
        opacity: 1;
        background: #ffffff;
        border-radius: 4px;
        .title{
            height: 30px;
            line-height: 30px;
            font-size: 16px;
            margin: 48px 68px 10px 58px;
            display: flex;
            .icon {
                font-size: 30px; 
                color:#FFB951;
                margin-right: 10px; 
            }
        }
        .content{
            height: 30px;
            line-height: 30px;
            font-size: 16px;
            text-align: center;    
            margin-bottom:15px;
        }
        .action{
            display: flex;
        }
    }
}
</style>