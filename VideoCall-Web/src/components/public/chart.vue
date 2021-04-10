<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-06 11:26:36
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\public\chart.vue
 * @LastEditTime: 2021-04-06 12:09:38
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="chart">
        <div class="head">
            <div class="title">
                <i class="iconfont iconliaotian"></i>
                聊天
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
            <Input v-model="chartValue" placeholder="说点什么"  :border="false" class="input_box" clearable />
            <span class="blue" @click="send">发送</span>
        </div>
    </div>
</template>
<script>
export default {
    name:'Chart',  
    data(){
        return {
            loading:false,
            chartHistory:[
                 {id:1,name:'Jack',content:'helloe111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111!',date:'19:25',isMy:false},
                {id:1,name:'Jack',content:'helloe!',date:'19:26',isMy:false},
                {id:1,name:'Jack',content:'helloe!',date:'19:27',isMy:false},
                {id:1,name:'Tom',content:'fdsad!',date:'19:28',isMy:false},
                {id:1,name:'Bob',content:'hedsfdsflloe!',date:'19:29',isMy:false},
                {id:1,name:'Jim',content:'hel12313loe!',date:'19:30',isMy:false},
                {id:2,name:'我',content:'HI！',date:'19:31',isMy:true},
            ],
            id:2,
            chartValue:'',
        }
    },
    methods: {
        send(){
            this.chartHistory.push({
                id:2,
                name:'我',
                content: this.chartValue,
                date: new Date(),
                isMy: true
            });
            this.chartValue = "";
            this.scrollToBottom();
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
    }
}
</script>
<style lang="less" scoped>
    .chart {
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