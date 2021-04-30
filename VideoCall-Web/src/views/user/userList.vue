<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-01 15:46:17
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\views\user\userList.vue
 * @LastEditTime: 2021-04-29 14:31:25
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="userList">
        <List footer="" :border="false" :loading="loading">
            <ListItem style="background: #2684D1;">
                <div class="act avatar">
                    <i class="iconfont iconrenqun1 act_text"></i>
                </div>
                <div class="act_name">
                    {{$t("userList.players")}}
                </div>
                <div class="act_action">
                    <i class="iconfont iconcebianlanshousuo" @click="collapsedSider"></i>
                </div>  
            </ListItem>
            <ListItem v-for="(item,index) in userList" :key="index">
                <div class="avatar">
                    <i class="iconfont iconren1 person text"></i>
                </div>
                <div class="name">
                    {{item.nickname}}
                </div>
                <div class="action">
                    {{item.isMaster?$t('userList.host'):''}}
                    <!-- <i class="iconfont icon21maikefeng text" :class="[item.isMic ? 'outline':'eye']" @click="setUserDevices(index,item,'audio')"  v-if="isAdmin"></i>
                    <i class="iconfont iconshexiangtou text" :class="[item.isCar ? 'outline':'eye']" @click="setUserDevices(index,item,'video')"  v-if="isAdmin"></i> -->
                    <i class="iconfont icon21maikefeng text" :class="[item.isMic ? 'outline':'eye']" @click="setUserDevices(index,item,'audio')" v-if="nowUid!=item.id"></i>
                    <i class="iconfont iconshexiangtou text" :class="[item.isCar ? 'outline':'eye']" @click="setUserDevices(index,item,'video')" v-if="nowUid!=item.id"></i>
                    <Dropdown  v-if="isAdmin">
                        <a href="javascript:void(0)">
                            <i class="iconfont iconzu1306 text"></i>
                        </a>
                        <DropdownMenu slot="list" v-if="nowUid!=item.id">
                            <!-- <DropdownItem @click.native="setKickingRuleAudio(item.id)">禁止麦克风</DropdownItem>
                            <DropdownItem @click.native="setKickingRuleCamera(item.id)">禁止摄像头</DropdownItem> -->
                            <DropdownItem @click.native="setKickingRuleJoin(item.id)" v-if="!item.isDel">{{$t("userList.delete")}}</DropdownItem>
                            <DropdownItem @click.native="delKickingRule(item.id,item.isDel)" v-else>{{$t("userList.cancelDelete")}}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </ListItem>
        </List>
    </div>
</template>
<script>
import * as Cookies from "js-cookie";
import {
  getUserList,
  setKickingRule,
  delKickingRule
} from "@service/agoraService";
import {AGORA_APP_ID} from "@root/agora.config"

export default {
    name:"userList",
    props:{
        userlists: {
            type: Array,
            default () {
                return []
            }
        },
    },
    data() {
        return {
            loading: false,
            userList:[],
            isAdmin:null,
            nowUid:''
        };
    },
    watch:{
        userlists:{
            handler(val){
                this.userList = val.map((e,index)=>{
                    e.isMic = true;
                    e.isCar = true;
                    e.isDel = '';
                    return e;
                });
                this.test();
            }
        }    
    },
    methods: {
        collapsedSider() {
            this.$emit("collapsed-sider");
        },
        setMic(index){
            this.$set(this.userlist[index],'isMic',this.userlist[index]['isMic'] ? false : true);
        },
        setCar(index){
            this.$set(this.userlist[index],'isCar',this.userlist[index]['isCar'] ? false : true);
        },
        del(index){
            this.userlist.splice(index,1);
        },
        test(){
            var params = {
                appid:AGORA_APP_ID,
                channelName:Cookies.get("channel"),
            };
            
            return new Promise((resolve, reject) => {
                this.$FromLoading.show();
                getUserList(params).then(res => {
                if (res.success) {
                    this.$FromLoading.hide();         
                } else {
                    this.$Message.error({
                    background: true,
                    content: res.message
                    });
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
        //控制声网用户摄像头设备状态
        setKickingRuleCamera(uid){
            var params = {
                appid:AGORA_APP_ID,
                cname:Cookies.get("channel"),
                uid:parseInt(uid),
                ip : "",
                time : 60,
                privileges : [
                    "publish_video"
                ]
            };
            
            return new Promise((resolve, reject) => {
                this.$FromLoading.show();
                setKickingRule(params).then(res => {
                if (res.status=='success') {
                    this.$Message.info({
                        background: true,
                        content: '操作成功！'
                    });
                    this.$FromLoading.hide();     
                } else {
                    this.$Message.error({
                        background: true,
                        content: '操作失败！'
                    });
                    this.$FromLoading.hide();
                }
                });
            }).catch(err=>{
                this.$Message.error({
                    background: true,
                    content: '操作失败！'
                });
                this.$FromLoading.hide();  
            });    
        },
        setKickingRuleAudio(uid){
            var params = {
                appid:AGORA_APP_ID,
                cname:Cookies.get("channel"),
                uid:parseInt(uid),
                ip : "",
                time : 60,
                privileges : [
                    "publish_audio"
                ]
            };
            
            return new Promise((resolve, reject) => {
                this.$FromLoading.show();
                setKickingRule(params).then(res => {
                if (res.status=='success') {
                    this.$Message.info({
                        background: true,
                        content: '操作成功！'
                    });
                    this.$FromLoading.hide();     
                } else {
                    this.$Message.error({
                        background: true,
                        content: '操作失败！'
                    });
                    this.$FromLoading.hide();
                }
                });
            }).catch(err=>{
                this.$Message.error({
                    background: true,
                    content: '操作失败！'
                });
                this.$FromLoading.hide();  
            });    
        },
        setKickingRuleJoin(uid){
            var params = {
                appid:AGORA_APP_ID,
                cname:Cookies.get("channel"),
                uid:parseInt(uid),
                ip : "",
                time : 60,
                privileges : [
                    "join_channel"
                ]
            };
            var me = this;
            return new Promise((resolve, reject) => {
                this.$FromLoading.show();
                setKickingRule(params).then(res => {
                if (res.status=='success') {
                    this.$Message.info({
                        background: true,
                        content: '操作成功！'
                    });
                    for(var i=0;i<me.userList.length;i++){
                        if(uid==me.userList[i]['id']){
                            var obj = {
                                ...me.userList[i],
                                isDel:res.id
                            }
                            me.$set(me.userList,i,obj);
                            break;
                        }
                    }
                    this.$FromLoading.hide();     
                } else {
                    this.$Message.error({
                        background: true,
                        content: '操作失败！'
                    });
                    this.$FromLoading.hide();
                }
                });
            }).catch(err=>{
                this.$Message.error({
                    background: true,
                    content: '操作失败！'
                });
                this.$FromLoading.hide();  
            });    
        },
        delKickingRule(uid,id){
            var params = {
                appid:AGORA_APP_ID,
                id:id
            };
            var me = this;
            return new Promise((resolve, reject) => {
                this.$FromLoading.show();
                delKickingRule(params).then(res => {
                if (res.status=='success') {
                    this.$Message.info({
                        background: true,
                        content: '操作成功！'
                    });
                    for(var i=0;i<me.userList.length;i++){
                        if(uid==me.userList[i]['id']){
                            me.userList[i]['isDel']='';
                            break;
                        }
                    }
                    this.$FromLoading.hide();     
                } else {
                    this.$Message.error({
                        background: true,
                        content: '操作失败！'
                    });
                    this.$FromLoading.hide();
                }
                });
            }).catch(err=>{
                this.$Message.error({
                    background: true,
                    content: '操作失败！'
                });
                this.$FromLoading.hide();  
            });
        },
        //
        setUserDevices(index,item,type){
            if(type=='video'){
                this.$parent.$parent.$parent.$parent.$refs.video.$refs.video.setUserVideo(item.id,type,item['isCar']);
                var obj = item;
                obj['isCar'] = obj['isCar']?false:true;
                this.$set(this.userList,index,obj);
            } else if(type=='audio'){
                this.$parent.$parent.$parent.$parent.$refs.video.$refs.video.setUserVideo(item.id,type,item['isMic']);
                var obj = item;
                obj['isMic'] = obj['isMic']?false:true;
                this.$set(this.userList,index,obj);
            }
        },
    },
    created(){
        this.isAdmin = Cookies.get("isAdmin")=='true' ? true : false;
        this.nowUid = Cookies.get("uid");
    }
}
</script>
<style lang="less" scoped>
    .userList{
        /deep/ .ivu-list-split .ivu-list-item:last-child {
            border-bottom: 1px solid #e8eaec;
        }
        .text{
            font-size: 16px;
            color: #999999;
        }
        .act{
            flex: 0 0 20px;
            margin-left: 10px;
            .act_text{
                color: #fff;
            }  
        }
        .act_name{
            color: #fff;
            margin-left: 10px;
        }
        .act_action{
            margin-left: 100px;
            margin-right: 10px;
            color:#fff;   
        }
        .avatar{
            flex: 0 0 20px;
            margin-left: 10px;
            .person{
                color: #2684D1;
            }
        }
        .name{
            margin-left: 10px;
            line-height: 24px; 
        }
        .action{
            margin-left: auto;
            margin-right: 5px;
            .outline{
                color:#40C949;
            }
            .eye{
                color: #999999;
            }
        }
        .ivu-list-item {
            display: flex;
            align-items: center;
            padding: 10px 0;
            height: 40px;
        }
    }
</style>