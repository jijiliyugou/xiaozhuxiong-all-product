<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-01 15:46:17
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\views\user\userList.vue
 * @LastEditTime: 2021-04-08 10:10:26
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
            <ListItem v-for="(item,index) in userlist" :key="index">
                <div class="avatar">
                    <i class="iconfont iconren1 person text"></i>
                </div>
                <div class="name">
                    {{item.name}}
                </div>
                <div class="action">
                    <i class="iconfont icon21maikefeng text" :class="[item.isMic ? 'outline':'eye']" @click="setMic(index)"></i>
                    <i class="iconfont iconshexiangtou text" :class="[item.isCar ? 'outline':'eye']" @click="setCar(index)"></i>
                    <Dropdown>
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
export default {
    name:"userList",
    data() {
        return {
            loading: false,
            userlist:[
                {id:1,name:'张三',isMic:true,isCar:true},
                {id:2,name:'张1',isMic:true,isCar:true},
                {id:3,name:'张2',isMic:true,isCar:true},
                {id:4,name:'张3',isMic:true,isCar:true},
                {id:5,name:'张4',isMic:true,isCar:true},
                {id:6,name:'张5',isMic:true,isCar:true},
                {id:7,name:'张6',isMic:true,isCar:true},
                {id:8,name:'张7',isMic:true,isCar:true}
            ]
        };
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