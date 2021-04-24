<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-08 14:53:35
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\public\escModal.vue
 * @LastEditTime: 2021-04-16 15:33:02
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="esc_modal_wrap" v-if="show">
        <div class="esc_modal">
            <div class="title">
                <Icon type="ios-alert" class="icon" />
                <div>确定退出会议室？</div>
            </div>
            <div class="action">
                <Button type="primary" shape="circle" style="width:88px;margin:0 14px 0 78px;background:#FF5151;border-color:#FF5151" @click="sureClose">确定关闭</Button>
                <Button type="warning" shape="circle" style="width:88px;margin:0 78px 0 14px;background:#E6E6E6;border-color:#E6E6E6;color:#666666" @click="close">取消</Button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'EscModal',
    props:{
        isShowEsc: {
            type: Boolean,
            default: false
        },
    },
    watch:{
        isShowEsc:{
            handler(val){
                this.show = val;
            }
        }
    },
    data() {
        return {
            show:false
        }
    },
    methods:{
        close(){
            this.$emit('cancel-close');
        },
        sureClose(){
            this.$emit('sure-close');    
        }
    }
}
</script>
<style lang="less" scoped>
.esc_modal_wrap{
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.4);
    .esc_modal {
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
            margin: 61px 88px 45px 88px;
            display: flex;
            .icon {
                font-size: 30px; 
                color:#FF5151;
                margin-right: 10px; 
            }
        }
        .action{
            display: flex;
        }
    }
}
</style>