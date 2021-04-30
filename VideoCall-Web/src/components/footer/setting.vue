<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-11-03 16:35:57
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-29 17:52:54
-->
<template>
    <Modal v-model="show" :title="$t('settings.settings')" @on-ok="ok" @on-cancel="cancel" width="430" draggable class="setting">
        <div class="setting_panel">
            <Tabs :value="modal" :animated="false">
                <TabPane :label="$t('settings.roomSettingTitle')" name="name1" v-if="flag">
                    <div class="setting_room_wrap">
                        <div class="item">
                            <div class="icon">
                                <Icon type="ios-albums" />            
                            </div>
                            <div class="title">
                                {{$t("settings.meetingsId")}}
                            </div>
                            <div class="text">
                                <Input v-model="formValidate['id']" :style="{width:'113px'}" :maxlength="7" disabled></Input>
                            </div>
                            <!-- <div class="action">
                                <Icon type="md-sync" />刷新
                            </div> -->
                        </div>
                        <div class="item">
                            <div class="icon">
                                <Icon type="ios-calendar-outline" />       
                            </div>
                            <div class="title">
                                {{$t("settings.endTime")}}
                            </div>
                            <div class="text">
                                <DatePicker type="datetime" v-model="formValidate['endTime']" @on-change="formValidate['endTime']=$event" format="yyyy-MM-dd HH:mm" style="width: 226px;" :transfer='true' :options="options"></DatePicker> 
                            </div>    
                        </div>
                        <div class="item">
                            <div class="icon">
                                <Icon type="md-person" /> 
                            </div>
                            <div class="title">
                                {{$t("settings.host")}}
                            </div>
                            <div class="text">
                                {{$t("settings.me")}}
                            </div>
                        </div>
                        <Divider />
                        <div class="settings_wrap">
                            <div>{{$t("settings.settingsStatus")}}</div>
                            <Checkbox v-model="formValidate.settings.isMic">{{$t("settings.isMic")}}</Checkbox>
                            <Checkbox v-model="formValidate.settings.isCar">{{$t("settings.isCar")}}</Checkbox>
                        </div>
                        <div style="width:100%;"> 
                            <Button type="primary" @click="save" style="float: right;">{{$t("settings.button")}}</Button>
                        </div>
                    </div>
                </TabPane>
                <TabPane :label="$t('settings.personalSettingTitle')" name="name2">
                    <div class="setting_room_wrap">
                        <div class="item">
                            <div class="icon">
                                <Icon type="ios-videocam" />
                            </div>
                            <div class="title">
                                {{$t("settings.camera")}}
                            </div>
                            <div class="text">
                                <Select v-model="videoDevice" :style="{width:'200px',float: 'left'}" clearable @on-select="onChangeVideoDevice" :transfer='true'>
                                    <Option v-for="(item,index) in videoDevices" :value="item.deviceId" :key="index">{{ item.label }}</Option>
                                </Select>
                            </div>    
                        </div>
                        <div class="item">
                            <div class="icon">
                                <Icon type="ios-mic" />
                            </div>
                            <div class="title">
                                {{$t("settings.audio")}}
                            </div>
                            <div class="text">
                                <Select v-model="audioDevice" :style="{width:'200px',float: 'left'}" clearable  @on-select="onChangeAudioDevice" :transfer='true'>
                                    <Option v-for="(item,index) in audioDevices" :value="item.deviceId" :key="index">{{ item.label }}</Option>
                                </Select>
                            </div>    
                        </div>
                        <div class="item">
                            <div class="icon">
                                <Icon type="ios-cog-outline" />    
                            </div>
                            <div class="title">
                                {{$t("settings.resolutionRatio")}}
                            </div>
                            <div class="text">
                                <Select v-model="videoEncoder" :style="{width:'200px',float: 'left'}" clearable  @on-select="onChangeVideoEncoder" :transfer='true'>
                                    <Option v-for="(item,index) in videoEncoderList" :value="item.value" :key="index">{{ item.name }}</Option>
                                </Select>
                            </div>    
                        </div>
                        <div class="item">
                            <div class="icon">
                                <Icon type="ios-volume-up" />    
                            </div>
                            <div class="title">
                                {{$t("settings.volume")}}
                            </div>
                            <div class="text">
                                <div style="width: 200px;"><Slider v-model="volume" @on-input="onInput"></Slider></div>
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
  Update,
  QueryMeetingRoom
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
                settings:{
                    isMic:true,
                    isCar:true
                }
            },
            videoDevice:'',
            audioDevice:'',
            flag:false,
            modal:'name1',
            videoEncoder:'1080p_2',
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
                },
                {
                    name:'1080p_30',
                    value:'1080p_2'
                }
            ],
            options: {
                disabledDate (date) {
                    var endTime = Cookies.get('endTime');
                    return date && date.valueOf() < Date.now(endTime) - 86400000;
                }
            },
            volume:100,
        }
    },
    watch:{
        showModal: {
            handler(val) {
                this.show = val;
                if(val) {
                    this.QueryMeetingRoom();
                }
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
    computed:{

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
        QueryMeetingRoom(){
            if(this.flag){
                return new Promise((resolve, reject) => {
                    QueryMeetingRoom({roomNumber:this.formValidate.id}).then(res => {
                        if (res.success) {
                            this.formValidate.endTime = res.data.endTime;
                            this.formValidate.settings.isMic = res.data.isAllowOpenMicrophone;
                            this.formValidate.settings.isCar = res.data.isAllowOpenCameras;
                        } else {
                            this.$Message.error({
                                background: true,
                                content: res.result.msg
                            });
                        }
                    });
                });
            }
        },
        save(){
            var params = {
                roomNumber:this.formValidate.id,
                endTime:this.formValidate.endTime,
                isAllowOpenCameras:this.formValidate.settings.isCar,
                isAllowOpenMicrophone:this.formValidate.settings.isMic,
            };
            var me = this;
            return new Promise((resolve, reject) => {
                this.$FromLoading.show();
                Update(params).then(res => {
                    if (res.success) {
                        this.$Message.info({
                            background: true,
                            content: res.message
                        });
                        Cookies.set('endTime',res.data.endTime);
                        window.sessionStorage.setItem("isMic",this.formValidate.settings.isMic);
                        window.sessionStorage.setItem("isCar",this.formValidate.settings.isCar); 
                        me.$parent.$parent.$parent.$parent.$refs.video.againCount() //保存结束时间后，重新计算计时器
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
        },
        //调整通话音量
        onInput(value){
            this.$emit('set-volum',value);
        },
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
    // height: 387px;
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

