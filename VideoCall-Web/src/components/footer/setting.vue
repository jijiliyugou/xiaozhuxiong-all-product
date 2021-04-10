<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-11-03 16:35:57
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-07 15:51:12
-->
<template>
    <Modal v-model="show" title="设置" @on-ok="ok" @on-cancel="cancel" width="430" draggable class="setting">
        <div class="setting_panel">
            <Tabs value="name1" :animated="false">
                <TabPane label="房间设置" name="name1">
                    <div class="setting_room_wrap">
                        <div class="item">
                            <div class="icon">
                                <Icon type="ios-albums" />            
                            </div>
                            <div class="title">
                                房间ID
                            </div>
                            <div class="text">
                                <Input v-model="formValidate['id']" :style="{width:'113px'}" :maxlength="7" disabled></Input>
                            </div>
                            <div class="action">
                                <Icon type="md-sync" />刷新
                            </div>
                        </div>
                        <div class="item">
                            <div class="icon">
                                <Icon type="ios-calendar-outline" />       
                            </div>
                            <div class="title">
                                结束时间
                            </div>
                            <div class="text">
                                <DatePicker v-model="formValidate['endTime']" @on-change="formValidate['endTime']=$event" format="yyyy-MM-dd HH:mm" type="date" style="width: 226px;"></DatePicker> 
                            </div>    
                        </div>
                        <div class="item">
                            <div class="icon">
                                <Icon type="md-bicycle" />       
                            </div>
                            <div class="title">
                                主持人
                            </div>
                            <div class="text">
                                我
                            </div>
                        </div>
                        <Divider />
                        <div class="settings_wrap">
                            <div>设置新进入房间的会议人状态</div>
                            <CheckboxGroup v-model="formValidate.settings" class="settings">
                                <Checkbox label="isM">容许参会者进入房间时打开摄像头</Checkbox>
                                <Checkbox label="isC">容许参会者进入房间时打开麦克风</Checkbox>
                            </CheckboxGroup>
                        </div>
                    </div>
                </TabPane>
                <TabPane label="个人设置" name="name2"></TabPane>
            </Tabs>
        </div>
        <div slot="footer">
            
        </div>    
    </Modal>
</template>

<script>
export default {
    name: 'Setting',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            show: false,
            formValidate:{
                id:100007,
                endTime:'',
                settings:['isM','isC']
            }
        }
    },
    watch:{
        showModal: {
            handler(val) {
                this.show = val;
            }
        },
    },
    methods: {
        ok(){

        },
        cancel(){
            this.$emit('show-modal-detail', false);    
        },
    },
    mounted() {

    },
    created(){
       
    }
}
</script>
<style lang="less" scoped>
.setting  /deep/ .ivu-modal-close /deep/ .ivu-icon-ios-close {
    color: #999999; 
}
.setting /deep/ .ivu-modal /deep/ .ivu-modal-header {
    border-bottom: unset;
    padding: 5px;
    line-height: 1;
    background: #F2F2F2;
    border-radius: 6px 6px 0px 0px;
    color: #999999;
    height: 36px;
    .ivu-modal-header-inner{
        color: #999999;
    }
}
.setting .footer_page{
    margin: 0 10px 10px 10px;
    overflow: hidden;
    .footer_page_right{
        float: right;
    }
}
.setting .setting_panel{
    display: flex;
    height: 387px;
    .setting_room_wrap {
        padding: 15px;
        .item {
            display: flex;
            height: 32px;
            line-height: 32px;
            margin-bottom: 19px;
            .icon {
                margin-left: 30px;
            }
            .title{
                margin-left: 10px;
                width: 56px;
            }
            .text{
                margin-left: 51px;
            }
            .action {
                margin-left: 15px;
                color: #2684D1; 
            }
        }  
    }
}
.setting {
    .settings_wrap {
        margin-left: 30px;
    }
    .settings {
        display: flex;
        flex-direction: column;    
    }
    .ivu-checkbox-wrapper {
        margin-top: 17px;
    }
}
.red{
    color: #FF760E;
}
.font_size_20 {
    font-size: 16px;
}
</style>

