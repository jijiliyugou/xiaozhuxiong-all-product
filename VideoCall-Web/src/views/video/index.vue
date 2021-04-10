<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-01 16:54:22
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\views\video\index.vue
 * @LastEditTime: 2021-04-09 14:57:29
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="video">
        <!-- <div class="error">
            <img :src="cameraPic">
            <p class="text">您的设备未检测到摄像头</p> 
        </div> -->
        <div class="box">
            <div id="videoBox"></div>
            <!-- <template v-if="isSelect&&videoList.length==2">
                <div class="video_wrap">
                    <div :class="[isCollapsed ? 'video_item_2_x':'video_item_2']" v-for="(item,index) in videoList" :key="index">
                        <img :src="item.url">
                    </div>
                </div>
            </template>
            <template v-if="isSelect&&videoList.length==3">
                <div class="video_wrap">
                    <div :class="[isCollapsed ? 'video_item_3_x':'video_item_3']" v-for="(item,index) in videoList" :key="index">
                        <img :src="item.url">
                    </div>
                </div>
            </template>
            <template v-if="isSelect&&videoList.length==4">
                <div class="video_wrap">
                    <div :class="[isCollapsed ? 'video_item_4_x':'video_item_4']" v-for="(item,index) in videoList" :key="index">
                        <img :src="item.url">
                    </div>
                </div>
            </template>
            <template v-if="isSelect&&videoList.length==5">
                <div class="video_wrap">
                    <div :class="[isCollapsed ? 'video_item_5_x':'video_item_5']" v-for="(item,index) in videoList" :key="index">
                        <img :src="item.url">
                    </div>
                </div>
            </template>
            <template v-if="isSelect&&videoList.length==6">
                <div class="video_wrap">
                    <div :class="[isCollapsed ? 'video_item_6_x':'video_item_6']" v-for="(item,index) in videoList" :key="index">
                        <img :src="item.url">
                    </div>
                </div>
            </template>
            <div class="bg" v-else>
                <img :src="test" style="width:100%;height:807px;">
            </div> -->
            <div class="userlist">
                <div class="user" @click="selectAll(true)"><div class="active"></div></div>
                <div class="user" @click="selectAll(false)"></div>
                <div class="user" @click="selectAll(false)"></div>
                <div class="user" @click="selectAll(false)"></div>
                <div class="user" @click="selectAll(false)"></div>
            </div>
        </div>
        <EndModal></EndModal>
    </div> 
</template>
<script>
import EndModal from "@components/public/endingMettingModal";
import videoJs from "@mixins/video.js";
export default {
    name:'Video',
    components:{
        EndModal
    },
    mixins:[videoJs],
    props:{
        isCollapsed: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            cameraPic: require("@assets/images/camera-lg.png"),
            test: require("@assets/bg/test.jpg"),
            isSelect: false,
            videoList:[
                {id:1,url:require("@assets/bg/test.jpg")},
                {id:2,url:require("@assets/bg/test.jpg")},
                {id:3,url:require("@assets/bg/test.jpg")},
                {id:4,url:require("@assets/bg/test.jpg")},
                // {id:5,url:require("@assets/bg/test.jpg")},
                // {id:6,url:require("@assets/bg/test.jpg")},
            ],
        };
    },
    methods: {
        selectAll(value){
            this.isSelect = value;
            if(this.isSelect) {
                
            }
        },
    },
    created() {

    }
}
</script>
<style lang="less" scoped>
    .video{
        width:100%;
        height: 807px;
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
            height: 807px;
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
                    background: url('~@assets/images/suo.webp');
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
                // flex-direction: column;
                .video_item_2 {
                    padding: 218px 74.25px;
                    border: 1px solid #66757e;
                    img {
                        width: 544px;
                        height: 363px;
                    }    
                }
                .video_item_2_x {
                    padding: 218px 99.25px;
                    border: 1px solid #66757e;
                    img {
                        width: 604px;
                        height: 363px;
                    }     
                }
                .video_item_3 {
                    padding: 21px 74.25px;
                    border: 1px solid #66757e;
                    img {
                        width: 544px;
                        height: 363px;
                    }    
                }
                .video_item_3:nth-child(1) {
                    padding: 21px 421.375px;
                    border: 1px solid #66757e;
                    img {
                        width: 544px;
                        height: 363px;
                    }    
                }
                .video_item_3_x {
                    padding: 21px 99.25px;
                    border: 1px solid #66757e;
                    img {
                        width: 604px;
                        height: 363px;
                    }     
                }
                .video_item_3_x:nth-child(1) {
                    padding: 21px 501.5px;
                    border: 1px solid #66757e;
                    img {
                        width: 604px;
                        height: 363px;
                    }     
                }
                .video_item_4 {
                    padding: 21px 74.25px;
                    border: 1px solid #66757e;
                    img {
                        width: 544px;
                        height: 363px;
                    }    
                }
                .video_item_4_x {
                    padding: 21px 99.25px;
                    border: 1px solid #66757e;
                    img {
                        width: 604px;
                        height: 363px;
                    }     
                }
                .video_item_5 {
                    padding: 21px 74.25px;
                    border: 1px solid #66757e;
                    img {
                        width: 544px;
                        height: 225.66667px;
                    }    
                }
                .video_item_5:nth-child(3) {
                    padding: 21px 421.375px;
                    border: 1px solid #66757e;
                    img {
                        width: 544px;
                        height: 225.66667px;
                    }    
                }
                .video_item_5_x {
                    padding: 21px 99.25px;
                    border: 1px solid #66757e;
                    img {
                        width: 604px;
                        height: 225.66667px;
                    }     
                }
                .video_item_5_x:nth-child(3) {
                    padding: 21px 501.5px;
                    border: 1px solid #66757e;
                    img {
                        width: 604px;
                        height: 225.66667px;
                    }     
                }
                .video_item_6 {
                    padding: 21px 74.25px;
                    border: 1px solid #66757e;
                    img {
                        width: 544px;
                        height: 225.66667px;
                    }    
                }
                .video_item_6_x {
                    padding: 21px 99.25px;
                    border: 1px solid #66757e;
                    img {
                        width: 604px;
                        height: 225.66667px;
                    }     
                }
            }
        }
    }
</style>