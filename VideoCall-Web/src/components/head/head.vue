<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-01 14:55:25
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\head\head.vue
 * @LastEditTime: 2021-04-29 15:02:55
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="head">
        <Row>
            <Col span="8">
                <div class="left_title">
                    <div class="title">
                        <img :src="titleUrl">
                    </div>
                </div>
            </Col>
            <Col span="8">
                <div class="center_title">
                    <div class="title">
                        <div class="title_cn" @click="copyUrl">
                            {{companyName}}
                            <i class="iconfont iconzhifeiji"></i>
                        </div>
                        <div class="text">
                            ID:{{channel}}
                        </div>
                    </div>    
                </div>
            </Col>
            <Col span="8">
                <div class="right_title">
                    <div class="title">
                        <div class="text">
                            <div class="qq"></div><div class="qq_text">客服002</div>
                        </div>
                        <div class="text">
                            <div class="qq"></div><div class="qq_text">客服001</div>
                        </div>
                        <div class="text">
                            <i class="iconfont icondianhua1"></i><div class="tel_text">{{$t("other.technicalSupport")}}：0754-89671122</div>
                        </div>
                    </div>    
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
import * as Cookies from "js-cookie";
import Clipboard from 'clipboard'
export default {
  name: "Heads",
  components: {
      
  },
  data() {
    return {
      logUrl: require("@assets/default/logo.png"),
      titleUrl: require("@assets/images/title.png"),
      companyName:"",
      channel: "",
    };
  },
  methods: {
    copyUrl(){
        var Url = process.env.VUE_APP_PATH+`/videoMeeting/addMeeting?roomNumber=${this.channel}` // 点击文字复制的地址
        var clipboard = new Clipboard('.title_cn', {
            text: function () {
                return Url
            }
        });
        clipboard.on('success', e => {
            this.$Message.success({top:250,content:this.$t("other.copyShareUrl")});
            // 释放内存
            clipboard.destroy()
        })
    }
  },
  created(){
    this.$Message.config({
        top: 50,
        duration: 3
    });
    this.companyName = Cookies.get("companyName") || this.$t("other.noCompanyInformation");
    this.channel = Cookies.get("channel") || this.$t("other.roomNumberNotObtained");
  }
};
</script>
<style lang="less" scoped>
.head{
    height: 70px;
    .left_title{
        display: flex;
        height: 70px;
        .logo{
            img{
                margin-top: 10px;
                width: 30px;
            }
        }
        .title{
            img{
                height: 42px;
                width: 194px;
                margin-top: 14px;
                margin-left: -35px;
            }
        }
    }
    .center_title{
        height: 64px;
        .title{
            color: #666666;
            margin-top: 11px;
            .title_cn{
                color: #2684D1;
                font-size: 22px;
                text-align: center;
                font-weight: 600;

            }
            .title_cn:hover{
                cursor:pointer    
            }
            .text{
                text-align: center;    
            }
        }
    }
    .right_title{
        height: 70px;
        line-height: 70px;
        .title{
            color: #666666;
            display: flex;
            flex-direction: row-reverse;
            margin-right: -30px;
            .title_cn{
                color: #2684D1;
                font-size: 22px;
                text-align: center;
                font-weight: 600;
            }
            .text{
                text-align: right;
                margin-left: 10px;
                display: flex;
                .qq {
                    background: url('~@assets/images/qq2.png');
                    background-repeat: no-repeat;
                    margin-top: 25.5px;
                    width: 13px;
                    height: 16px;
                }
                .qq_text{
                    margin-left: 9px;
                }
                .tel_text {
                    margin-left: 13px;    
                }
            }
            .text:nth-child(2) {
                text-align: right;
                margin-left: 27px;
                display: flex;        
            }
            .text:nth-child(1) {
                text-align: right;
                margin-left: 27px;
                display: flex;        
            }
        }
    }
}
</style>