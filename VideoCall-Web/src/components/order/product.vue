<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-06 11:37:17
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\order\product.vue
 * @LastEditTime: 2021-04-08 14:42:49
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="prodct_warp">
        <!-- tab切换 -->
        <div class="addSampling_tab">
            <div class="head">
                <div class="title" :class="[flag=='order' ? 'active':'']" @click="changTabType('order')">
                    <div class="active_text">
                        择样单号
                    </div>
                </div>
                <div class="title" :class="[flag=='product' ? 'active':'']" @click="changTabType('product')">
                    <div class="active_text">
                        当前产品
                    </div>
                </div>
                <div class="title right">
                    <i class="iconfont iconqiehuan" @click="changType"></i>
                </div>
            </div>     
        </div>
        <!-- 择样单号 -->
        <div class="select_order" v-if="flag=='order'">
            <Table :columns="columns1" :data="data1" height="330"></Table>
            <div class="select_order_info">
                <Row>
                    <Col span="8">
                        总款数：6
                    </Col>
                    <Col span="8">
                        总箱数：120
                    </Col>
                    <Col span="8">
                        总个数：1200
                    </Col>
                    <Col span="24">
                        总体积/总材积：0.035/10.27
                    </Col>
                    <Col span="19">
                        总金额：<span class="red">￥1890.00</span>
                    </Col>
                    <Col span="5">
                        <div class="order_list" @click="changeProductList"></div>    
                    </Col>
                </Row>
            </div>
        </div>
        <!-- 当前产品 -->
        <div class="now_product" v-else>
            <Row class="ipput_wrap">
                <Col span="6"><div class="text">公司编号</div></Col>
                <Col span="12"><Input v-model="nowProduct" class="iipput_wrap_box" :style="{width:'137px'}" clearable /></Col>
                <Col span="6"><Button type="primary" @click="saveNow" :style="{width:'60px',marginLeft: '11px'}" >确定</Button></Col>
            </Row>
            <Row class="product_wrap">
                <Col span="8">
                    <Poptip trigger='hover' content="content" placement="right" :transfer="true">
                        <img :src="test" style="width:87px;height:65px;margin-left:19px"/>
                        <img slot="content" :src="test" style="width:300px;height:300px" />
                    </Poptip>
                </Col>
                <Col span="16">
                    <div class="product_wrap_text"><span title="益智回力积木军事灰色日本 三式中型坦克（75PCS）sdfdsfdsfdsfsddfd">益智回力积木军事灰色日本 三式中型坦克（75PCS）sdfdsfdsfdsfsddfd</span></div>
                    <div class="red">￥：299.00</div>
                </Col>
            </Row>
            <Row class="now_item_box">
                <Col span="24">
                    <div class="now_item">
                        <div class="title">公司编号：</div>
                        <div class="text">12342132132312321</div>
                    </div>
                    <div class="now_item">
                        <div class="title">货号：</div>
                        <div class="text">YD-12421</div>
                    </div>
                    <div class="now_item">
                        <div class="title">包装：</div>
                        <div class="text"></div>
                    </div>
                    <div class="now_item">
                        <div class="title">包装：</div>
                        <div class="text"></div>
                    </div>
                    <div class="now_item">
                        <div class="title">包装：</div>
                        <div class="text"></div>
                    </div>
                    <div class="now_item">
                        <div class="title">包装：</div>
                        <div class="text"></div>
                    </div>
                    <div class="now_item">
                        <div class="title">包装：</div>
                        <div class="text"></div>
                    </div>
                    <div class="now_item">
                        <div class="title">包装：</div>
                        <div class="text"></div>
                    </div>
                    <div class="now_item">
                        <div class="title">包装：</div>
                        <div class="text"></div>
                    </div>
                </Col>
            </Row>
            <div class="action">
                <Button type="primary" shape="circle" style="width:88px;margin:0 9px 0 58.5px;">加入择样</Button>
                <Button type="warning" shape="circle" style="width:88px;margin:0 58.5px 0 9px;">删除</Button>
            </div>
        </div>
        <!-- 产品详情页 -->
        <ModalProductDetail @show-modal-detail="showModalDetail" :showModal="showModal"></ModalProductDetail>
    </div>
</template>
<script>
import ModalProductDetail from "@components/order/modalProductDetail";

export default {
    name:'Product',
    components:{
        ModalProductDetail
    },
    props:{
        tab_select:{
            type: String,
            default: '',
        },
    },
    data(){
        return {
            columns1: [
                {
                    title: '品名',
                    key: 'name',
                    render: (h, params) => {
                        return h('div', [
                        h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color:'#2684D1',
                                marginTop: '4px'
                            },
                            domProps: {
                                title: params.row.name
                            },
                            on:{
                                click:()=>{
                                    this.showModalDetail(true,params.row.name)    
                                }
                            }
                        }, params.row.name)
                        ])
                    },
                    width: 107
                },
                {
                    title: '货号',
                    key: 'age',
                    width: 90
                },
                {
                    title: '报价',
                    key: 'address',
                    render: (h, params) => {
                        return h('div', [
                        h('span', {
                            style: {
                                color:'#EC1B1B',
                                marginTop: '4px'
                            },
                            domProps: {
                                title: params.row.address
                            }
                        }, '￥'+params.row.address)
                        ])
                    },
                }
            ],
            data1: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: '199.00',
                    date: '199.00'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: '199.00',
                    date: '199.00'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: '199.00',
                    date: '199.00'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: '199.00',
                    date: '199.00'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: '199.00',
                    date: '199.00'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: '199.00',
                    date: '199.00'
                },{
                    name: 'Jon Snow',
                    age: 26,
                    address: '199.00',
                    date: '199.00'
                },{
                    name: 'Jon Snow',
                    age: 26,
                    address: '199.00',
                    date: '199.00'
                },{
                    name: 'Jon Snow',
                    age: 26,
                    address: '199.00',
                    date: '199.00'
                },{
                    name: 'Jon Snow',
                    age: 26,
                    address: '199.00',
                    date: '199.00'
                },{
                    name: 'Jon Snow',
                    age: 26,
                    address: '199.00',
                    date: '199.00'
                }
            ],
            nowProduct:'1111111111',
            test: require("@assets/bg/test.jpg"),
            isProductList:false,
            flag:'order',
            showModal:false,
        }
    },
    watch:{
        tab_select:{
            handler(val){
                this.flag = val;
            }
        }
    },
    methods:{
        saveNow(){
            
        },
        changTabType(value){
            this.flag = value;
            this.$emit('chang-tab-type',value);
        },
        changType(){
            this.$emit('chang-type',false,'order');
        },
        changeProductList(){
            this.$emit('change-product-list');
        },
        getDetail(id){

        },
        showModalDetail(value,id){
            this.showModal = value;
            if(value)
                this.getDetail(id);   
        },
    }
}
</script>
<style lang="less" scoped>
    .prodct_warp{
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
        .addSampling_tab {
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
        }
        .select_order{
            height: 422px;
            .select_order_info {
                margin: 16px 0 16px 16px;
                width: 295px;
                height: 66px;
                .order_list {
                    background: url('~@assets/images/order_list.webp');
                    background-size: cover;//注意：一定要把这个属性配合fixed使用；
                    background-repeat: no-repeat; 
                    height: 32px;
                    width: 32px;
                    margin-top: -10px;
                    margin-left: 20px;
                }
            }
        }
        .now_product{
            height: 422px;  
            .ipput_wrap {
                padding: 19px 17px;
                .text {
                    line-height: 32px;
                }
            }
            .product_wrap{
                height: 65px;
                .product_wrap_text{
                    margin-left: 15px;
                    span{
                        color: #272727;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        // word-break: break-all;
                        height: 42px;
                        // text-overflow: -o-ellipsis-lastline;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                }    
            }
            .now_item_box{
                .now_item{
                    padding: 5px 0 0 19px;
                    display: flex;
                    font-size: 13px;
                    .title {
                        color: #999999;
                    }
                }    
            }
            .action{
                margin-top: 10px;
                display: flex;
            }
        }
        .select_order /deep/ .ivu-table td {
            height: 38px;
        }
        .select_order /deep/ .ivu-table th {
            background-color: #fff;
            color: #666666;
        }    
    }
    .red{
        color: #EC1B1B;
        font-size: 13px;
        margin-left: 15px;
    }
    .blue{
        color: #2684D1;
    }
</style>
