<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-11-03 16:35:57
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-23 17:10:23
-->
<template>
    <Modal v-model="show" title="设置" @on-ok="ok" @on-cancel="cancel" width="430" draggable class="setting">
        <div class="setting_panel">
            <Tabs :value="modal" :animated="false">
                <TabPane label="房间设置" name="name1" v-if="flag">
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
                                <DatePicker type="datetime" v-model="formValidate['endTime']" @on-change="formValidate['endTime']=$event" format="yyyy-MM-dd HH:mm" style="width: 226px;" :transfer='true'></DatePicker> 
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
                        <div style="width:100%;"> 
                            <Button type="primary" @click="save" style="float: right;">确认</Button>
                        </div>
                    </div>
                </TabPane>
                <TabPane label="个人设置" name="name2">
                    <div class="setting_room_wrap">
                        <div class="item">
                            <div class="icon">
                                <Icon type="ios-calendar-outline" />       
                            </div>
                            <div class="title">
                                摄像头
                            </div>
                            <div class="text">
                                <Select v-model="videoDevice" :style="{width:'200px',float: 'left'}" clearable @on-select="onChangeVideoDevice" :transfer='true'>
                                    <Option v-for="(item,index) in videoDevices" :value="item.deviceId" :key="index">{{ item.label }}</Option>
                                </Select>
                            </div>    
                        </div>
                        <div class="item">
                            <div class="icon">
                                <Icon type="ios-calendar-outline" />       
                            </div>
                            <div class="title">
                                麦克风
                            </div>
                            <div class="text">
                                <Select v-model="audioDevice" :style="{width:'200px',float: 'left'}" clearable  @on-select="onChangeAudioDevice" :transfer='true'>
                                    <Option v-for="(item,index) in audioDevices" :value="item.deviceId" :key="index">{{ item.label }}</Option>
                                </Select>
                            </div>    
                        </div>
                        <div class="item">
                            <div class="icon">
                                <Icon type="ios-calendar-outline" />       
                            </div>
                            <div class="title">
                                视频清晰度
                            </div>
                            <div class="text">
                                <Select v-model="videoEncoder" :style="{width:'200px',float: 'left'}" clearable  @on-select="onChangeVideoEncoder" :transfer='true'>
                                    <Option v-for="(item,index) in videoEncoderList" :value="item.value" :key="index">{{ item.name }}</Option>
                                </Select>
                            </div>    
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <div slot="footer">
            
        </div>    
    </Modal>
</template>

<script>
import * as Cookies from "js-cookie";
import {
  Update
} from "@service/meetingService";

export default {
    name: 'Setting',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        videoDevices: {
            type: Array,
            default () {
                return []
            }
        },
        audioDevices: {
            type: Array,
            default () {
                return []
            }
        },
    },
    data() {
        return {
            show: false,
            formValidate:{
                id:100007,
                endTime:'',
                settings:['isM','isC']
            },
            videoDevice:'',
            audioDevice:'',
            flag:false,
            modal:'name1',
            videoEncoder:'720p_6',
            videoEncoderList:[
                {
                    name:'480p',
                    value:'480p_4'
                },
                {
                    name:'720p',
                    value:'720p_6'
                },
                {
                    name:'1080p',
                    value:'1080p_5'
                }
            ]
        }
    },
    watch:{
        showModal: {
            handler(val) {
                this.show = val;
            }
        },
        videoDevices:{
            handler(val){
                this.videoDevice = this.videoDevices[0]&&this.videoDevices[0]['deviceId'];
            },
            deep:true
        },
        audioDevices:{
            handler(val){
                this.audioDevice = this.audioDevices[0]&&this.audioDevices[0]['deviceId'];
            },
            deep:true
        }
    },
    methods: {
        ok(){

        },
        cancel(){
            this.$emit('show-modal-detail', false);    
        },
        onChangeVideoDevice(val){
            this.$emit('change-devices',val.value,'');
        },
        onChangeAudioDevice(val){
            this.$emit('change-devices','',val.value);        
        },
        onChangeVideoEncoder(val){
            this.$emit('change-video-encoder',val.value);           
        },
        save(){
            var params = {
                roomNumber:this.formValidate.id,
                endTime:this.formValidate.endTime
            };
            return new Promise((resolve, reject) => {
                this.$FromLoading.show();
                Update(params).then(res => {
                    if (res.success) {
                        this.$Message.info({
                            background: true,
                            content: res.message
                        });
                        Cookies.set('endTime',res.data.endTime);
                        this.$emit('show-modal-detail', false);
                        this.$FromLoading.hide(); 
                    }
                });
            }).catch(err=>{
                this.$Message.error({
                    background: true,
                    content: err.message
                });
                this.$FromLoading.hide(); 
            });   
        }
    },
    mounted() {

    },
    created(){
        this.formValidate.id = Cookies.get("channel");
        this.flag =  Cookies.get("isAdmin")=='true' ? true : false;
        this.modal = this.flag ? 'name1':'name2';
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
                width: 80px;
            }
            .text{
                // margin-left: 51px;
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

