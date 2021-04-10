<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-06 11:58:11
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\order\addSampling.vue
 * @LastEditTime: 2021-04-06 12:04:22
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="addSampling">
        <div class="head">
            <div class="title">
                <i class="iconfont icondanju"></i>
                择样单号
            </div>
        </div>   
        <div class="content">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="0">
                <FormItem  prop="number">
                    <Input v-model="formValidate.number" placeholder="请输入择样单号"></Input>
                </FormItem>
                <FormItem prop="code">
                    <Input v-model="formValidate.code" placeholder="请输入验证码"></Input>
                </FormItem>
                <FormItem>
                    <div style="width:100%;"> 
                        <Button type="primary" @click="save" style="float: left;" long>确认</Button>
                    </div>
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<script>
export default {
    name:'AddSampling',
    data(){
        return{
            formValidate:{
                number:'',
                code:''    
            },
            ruleValidate:{

            },
        }
    },
    methods:{
        save(){
            this.$emit('save');
        },
    }
}
</script>
<style lang="less" scoped>
    .addSampling {
        .head{
            width: 311px;
            height: 45px;
            background: #2684D1;
            line-height: 45px;
            color: #fff;
            .title{
                margin-left: 10px;
            }
        }
        .head {
            display: flex;
            .active {
                background: url('~@assets/images/tab_active.webp');
                background-size: cover;//注意：一定要把这个属性配合fixed使用；
                background-repeat: no-repeat;
                height: 35px;
                margin-top: 10px;
                width: 97px;
                color: #2684D1;
                .active_text {                    
                    margin-left: 20px;
                    line-height: 35px;
                }
            }
            .title {
                margin-top: 10px;
                margin-left: 10px;
                line-height: 35px;
            }
            .right {
                margin-left: auto;
                margin-right: 10px;
            } 
        } 
        .content{
            padding: 10px;
        }   
    }
</style>