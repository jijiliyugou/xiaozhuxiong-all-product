<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-06 11:58:11
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\order\addSampling.vue
 * @LastEditTime: 2021-04-30 11:15:09
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="addSampling">
        <div class="head">
            <div class="title">
                <i class="iconfont icondanju"></i>
                {{$t("addSampling.orderTitle")}}
            </div>
        </div>   
        <div class="content">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="0">
                <FormItem prop="number">
                    <Input v-model.trim="formValidate.number" :placeholder="$t('addSampling.orderText')"></Input>
                </FormItem>
                <FormItem prop="code">
                    <Input v-model.trim="formValidate.code" :placeholder="$t('addSampling.codeText')"></Input>
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
                number: [
                    { required: true, message: this.$t('addSampling.orderText'), trigger: 'blur' }
                ],
                code: [
                    { required: true, message: this.$t('addSampling.codeText'), trigger: 'blur' }
                ],
            },
        }
    },
    methods:{
        save(){
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    this.$emit('save',this.formValidate);
                }
            });
            //this.$emit('save',this.formValidate);
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
                background: url('~@assets/images/tab_active.png');
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
                margin-left: 10px;
                line-height: 45px;
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