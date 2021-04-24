<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-13 15:56:18
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\footer\loginFooter.vue
 * @LastEditTime: 2021-04-22 17:46:03
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="footer">
      <div class="footer_wrap">
        <div class="footer_wrap_first">
          <div style="margin-right:10px">技术支持：0754-89671122</div> 
          <div class="qq"></div>
          <div style="margin-left:10px">客服001</div>
          <div class="qq" style="margin-left:10px"></div>
          <div style="margin-left:10px">客服002</div>
        </div>
        <div>Copyright © 2021深圳宏升软件技术开发有限公司  粤ICP备13031421号-4</div>
      </div>
    </div>
</template>
<style lang="less" scoped>
.footer {
    position: absolute;
    width: 100%;
    text-align: center;
    line-height: 24px;
    margin-top: -70px;
    height: 107px;
    padding: 14px 15px 0 15px;
    color:#fff;
    background: #2684D1;
    border-top: solid 1px #ddd;
    overflow: hidden;
    bottom: 0;
    .footer_wrap{
        padding-top:18px;
        .footer_wrap_first{
            display: flex;
            justify-content:center;
            .qq {
                background: url('~@assets/images/qq2.png');
                background-repeat: no-repeat;
                margin-top: 4px;
                width: 13px;
                height: 16px;
            }
        }
    }
}
</style>