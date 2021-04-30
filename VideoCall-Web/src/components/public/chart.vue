<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-06 11:26:36
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\public\chart.vue
 * @LastEditTime: 2021-04-30 15:29:43
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="chart">
        <div class="head">
            <div class="title">
                <i class="iconfont iconliaotian"></i>
                {{$t("chart.chartTitle")}}
            </div>
        </div>   
        <div class="content_box" id="content_box">
            <List footer="" :border="false" :split="false" :loading="loading">
                <ListItem v-for="(item,index) in chartHistory" :key="index">
                    <template v-if="!item.isMy">
                        <div class="userInfo">
                            <div class="avatar">
                                <i class="iconfont iconren1 person text"></i>
                            </div>
                            <div class="name">
                                {{item.name}}
                            </div>
                            <div class="date">
                                {{item.date}}
                            </div>
                        </div>
                        <div class="content_text">
                            <div class="content_text_box">
                                <div  class="content_text_box_text">{{item.content}}</div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="my">
                            <div class="avatar">
                                <i class="iconfont iconren1 person text"></i>
                            </div>
                            <div class="name">
                                {{item.name}}
                            </div>
                            <div class="date">
                                {{item.date}}
                            </div>
                        </div>
                        <div class="content_text_my">
                            <div class="content_text_box">
                                <div  class="content_text_box_text">{{item.content}}</div>
                            </div>
                        </div>    
                    </template>
                </ListItem>
            </List>
        </div>
        <div class="input_wrap">
            <Input v-model="chartValue" :placeholder="$t('chart.saySomething')" :border="false" class="input_box" clearable @on-enter="send" />
            <span class="blue" @click="send">{{$t("chart.send")}}</span>
        </div>
    </div>
</template>
<script>
import * as Cookies from "js-cookie";
import AgoraRTM from 'agora-rtm-sdk';
import {AGORA_APP_ID} from "@root/agora.config";
import util from "@utils/util.js";

export default {
    name:'Chart', 
    props:{
        userlist: {
            type: Array,
            default () {
                return []
            }
        },
    }, 
    data(){
        return {
            loading:false,
            chartHistory:[],
            chartValue:'',
            appId:null,
            client:null,
            channel:null,
            lang:'zh'
        }
    },
    methods: {
        send(type,val){
            /* 频道消息发送成功的处理逻辑 */
            if(type=='saveSelection'||type=='saveProductInfo'){
                var obj = {
                    type:type,
                    ...val
                };
                obj = JSON.stringify(obj);
                this.channel.sendMessage({ text: obj }).then(() => {
                        
                }).catch(error => {
                /* 频道消息发送失败的处理逻辑 */
                })
            } else{ 
                this.channel.sendMessage({ text: this.chartValue }).then(() => {
                    this.chartHistory.push({
                        id:this.uid,
                        name:this.lang=='zh'?'我':'me',
                        content: this.chartValue,
                        date: util.getNowTime(),
                        isMy: true
                    });
                    this.chartValue = "";
                    this.scrollToBottom();
                }).catch(error => {
                /* 频道消息发送失败的处理逻辑 */
                })
            }
        },
        scrollToBottom () {
            var me = this;
            this.$nextTick(() => {
                // 当滚动条从没有到有时，不加setTimeout滚动条将不会滚动到底部
                setTimeout(() => {
                    let overflowY = document.getElementById("content_box");
                    if (!overflowY) {
                        return
                    }
                    overflowY.scrollTop = overflowY.scrollHeight
                }, 500)
            })
        },
        //登入
        async login(){
            var me = this;
            await this.client.login({ token:  this.appId, uid: this.uid }).then(() => {
                console.log('聊天登录成功');
            }).catch(err => {
                console.log('聊天登录失败', err);
            });
            var roomNumber = Cookies.get("channel");
            this.channel = await this.client.createChannel(roomNumber); // 此处传入频道 ID
            await this.channel.join().then(() => {
                console.log('加入聊天频道成功！');
            /* 加入频道成功的处理逻辑 */
            }).catch(error => {
                console.log('加入聊天频道失败！');
            /* 加入频道失败的处理逻辑 */
            });
            this.channel.on('ChannelMessage', ({ text }, senderId) => { // text 为收到的频道消息文本，senderId 为发送方的 User ID
                var name = '';
                if(me.userlist.length){
                    for(var i=0;i<me.userlist.length;i++){
                        if(senderId==me.userlist[i]['id']){
                            name = me.userlist[i]['nickname'];
                            break
                        }
                    }
                }
                if(text.indexOf("saveSelection")!=-1){
                    var obj = JSON.parse(text);
                    this.$emit('getSampleOrderDetails',obj);
                } else if(text.indexOf("saveProductInfo")!=-1){
                    var obj = JSON.parse(text);
                    this.$emit('getProduct',obj);    
                } else {
                    this.chartHistory.push({
                        id:senderId,
                        name:name,
                        content: text,
                        date: util.getNowTime(),
                        isMy: false
                    });
                    this.scrollToBottom();
                    /* 收到频道消息的处理逻辑 */
                }
            });
        },
        //登出
        loginOut(){
            this.channel.leave();
            this.client.logout();
        },
        //初始化群聊
        async init(){
            this.appId = AGORA_APP_ID;
            this.uid = Cookies.get("uid") || null;
            this.client = AgoraRTM.createInstance(this.appId);
            this.client.on('ConnectionStateChanged', (newState, reason) => {
                console.log('on connection state changed to ' + newState + ' reason: ' + reason);
            });
            await this.login();
        }
    },
    created(){
        this.init();    
        this.lang = window.localStorage.getItem('language');
    }
}
</script>
<style lang="less" scoped>
    .chart {
        height: 341px;
        // border-bottom: 1px solid #e0e0e0;
        .head{
            width: 311px;
            height: 45px;
            background: #2684D1;
            line-height: 45px;
            color: #fff;
            .title{
                margin-left: 10px;
            }
        }
        .content_box{
            height: 254px;
            overflow-y: scroll;
            position: relative;
            border-bottom:1px solid #E4E4E4;
            /deep/ .ivu-list-item {
                flex-wrap: wrap;
                padding: 6px 0 6px 0;
            }
            .userInfo{
                width: 291px;
                display: flex;
                flex: 0 0 291px;
                .avatar{
                    margin-left: 10px;
                    color: #2684D1;
                }
                .name{
                    margin-left: 10px;
                    color: #333333;
                }
                .date{
                    margin-left: 10px;
                    color: #999999;
                    font-size: 12px;
                    // line-height: 12px;
                }
            }
            .my{
                width: 291px;
                display: flex;
                flex: 0 0 291px;
                flex-direction: row-reverse;
                .avatar{
                    margin-right: 10px;
                    color: #2684D1;
                }
                .name{
                    margin-right: 10px;
                    color: #333333;
                }
                .date{
                    margin-right: 10px;
                    color: #999999;
                    font-size: 12px;
                    // line-height: 12px;
                }
            }
            .content_text{
                margin: 0 10px;
                color: #666666;
                .content_text_box{
                    height: auto;
                    border-radius: 5px;
                    background: #F5F7FA;
                    .content_text_box_text{
                        word-break: break-all;
                        padding: 5px;
                        white-space: normal;
                    }
                }
            }
            .content_text_my{
                margin: 0 10px;
                color: #2684D1;
                margin-left: auto;
                .content_text_box{
                    height: auto;
                    border-radius: 5px;
                    background: #DBEEFF;
                    .content_text_box_text{
                        word-break: break-all;
                        padding: 5px;
                        white-space: normal;
                    }
                }
            }
        }
        .input_wrap {
            height: 43px;
            width: 100%;
            .input_box{
                width: 250px;    
                line-height: 43px;    
                padding-right: 20px;
            }
        }
    }
    .blue{
        color: #2684D1;
    }
</style>