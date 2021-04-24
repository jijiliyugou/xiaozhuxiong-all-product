<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-01 15:46:17
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\views\user\userList.vue
 * @LastEditTime: 2021-04-22 18:04:15
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
                    与会人
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
                    {{item.isMaster?'主持人':''}}
                    <i class="iconfont icon21maikefeng text" :class="[item.isMic ? 'outline':'eye']" @click="setMic(index)"  v-if="isAdmin"></i>
                    <i class="iconfont iconshexiangtou text" :class="[item.isCar ? 'outline':'eye']" @click="setCar(index)"  v-if="isAdmin"></i>
                    <Dropdown  v-if="isAdmin">
                        <a href="javascript:void(0)">
                            <i class="iconfont iconzu1306 text"></i>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem @click.native="del(index)">禁止麦克风</DropdownItem>
                            <DropdownItem @click.native="del(index)">禁止摄像头</DropdownItem>
                            <DropdownItem @click.native="del(index)">删除</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </ListItem>
        </List>
    </div>
</template>
<script>
import * as Cookies from "js-cookie";
export default {
    name:"userList",
    props:{
        userlist: {
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
            isAdmin:null
        };
    },
    watch:{
        userlist:{
            handler(val){
                this.userList = val.map((e,index)=>{
                    e.isMic = true;
                    e.isCar = true;
                    return e;
                });
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
        }
    },
    created(){
        this.isAdmin = Cookies.get("isAdmin")=='true' ? true : false;
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