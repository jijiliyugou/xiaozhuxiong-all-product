<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-06 11:37:17
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\order\product.vue
 * @LastEditTime: 2021-04-30 15:09:17
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
                        {{$t("product.order.orderNoTitle")}}
                    </div>
                </div>
                <div class="title" :class="[flag=='product' ? 'active':'']" @click="changTabType('product')">
                    <div class="active_text">
                        {{$t("product.order.productTitle")}}
                    </div>
                </div>
                <div class="title right">
                    <i class="iconfont iconqiehuan" @click="changType" v-if="isAdmin"></i>
                </div>
            </div>     
        </div>
        <!-- 择样单号 -->
        <div class="select_order" v-if="flag=='order'">
            <Table :columns="orderColumns" :data="orderList" height="330" class="select_order_list"></Table>
            <div class="select_order_info">
                <Row v-if="lang=='zh'">
                    <Col span="8">
                        {{$t("product.order.totalRecords")}}：{{totalKuanshu}}
                    </Col>
                    <Col span="8">
                        {{$t("product.order.totalCTNS")}}：{{totalBoxCount}}
                    </Col>
                    <Col span="8">
                        {{$t("product.order.totalQuantity")}}：{{totalCount}}
                    </Col>
                    <Col span="24">
                        {{$t("product.order.totalVolume")}}：{{totalBulkFeet}}/{{totalBulkStere}}
                    </Col>
                    <Col span="19">
                        {{$t("product.order.totalPrice")}}：<span class="red">￥{{totalAmount}}</span>
                    </Col>
                    <Col span="5">
                        <div class="order_list" @click="changeProductList"></div>    
                    </Col>
                </Row>
                <Row v-else>
                    <Col span="12">
                        {{$t("product.order.totalRecords")}}：{{totalKuanshu}}
                    </Col>
                    <Col span="12">
                        {{$t("product.order.totalCTNS")}}：{{totalBoxCount}}
                    </Col>
                    <Col span="24">
                        {{$t("product.order.totalQuantity")}}：{{totalCount}}
                    </Col>
                    <Col span="24">
                        {{$t("product.order.totalVolume")}}：{{totalBulkFeet}}/{{totalBulkStere}}
                    </Col>
                    <Col span="19">
                        {{$t("product.order.totalPrice")}}：<span class="red">￥{{totalAmount}}</span>
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
                <Col span="6" v-if="isAdmin"><div :class="[lang=='zh'?'text':'en_text']">{{$t("product.order.companyNumber")}}</div></Col>
                <Col span="12" v-if="isAdmin"><Input v-model.trim="companyNumber" class="iipput_wrap_box" :style="{width:'130px'}" clearable @on-enter="getProductInfo" @keyup.enter.native="getProductInfo" /></Col>
                <Col span="6" v-if="isAdmin"><Button type="primary" @click="getProductInfo">{{$t("product.order.button")}}</Button></Col>
            </Row>
            <Row class="product_wrap" v-if="this.productInfo.id">
                <Col span="8">
                    <Poptip trigger='hover' content="content" placement="right" :transfer="true">
                        <img :src="productInfo.productImages.length&&productInfo.productImages[0]" style="width:87px;height:65px;margin-left:19px" />
                        <img slot="content" :src="productInfo.productImages.length&&productInfo.productImages[0]" style="width:100%;height:100%" />
                    </Poptip>
                </Col>
                <Col span="16">
                    <div class="product_wrap_text"><span :title="productInfo.productName">{{this.productInfo.productName}}</span></div>
                    <div class="red">￥{{this.productInfo.factoryPrice}}</div>
                </Col>
            </Row>
            <Row class="now_item_box" v-if="this.productInfo.id">
                <Col span="24">
                    <div class="now_item">
                        <div class="title">{{$t("product.info.companyNumber")}}：</div>
                        <div class="text">{{this.productInfo.companyNumber}}</div>
                    </div>
                    <div class="now_item">
                        <div class="title">{{$t("product.info.factoryNo")}}：</div>
                        <div class="text">{{this.productInfo.factoryNo}}</div>
                    </div>
                    <div class="now_item">
                        <div class="title">{{$t("product.info.chinesePack")}}：</div>
                        <div class="text">{{this.productInfo.chinesePack}}</div>
                    </div>
                    <div class="now_item">
                        <div class="title">{{$t("product.info.productSize")}}：</div>
                        <div class="text">{{this.productInfo.productLength}}*{{this.productInfo.productWidth}}*{{this.productInfo.productHeight}}</div>（CM）
                    </div>
                    <div class="now_item">
                        <div class="title">{{$t("product.info.packageSize")}}：</div>
                        <div class="text">{{this.productInfo.outerBoxLength}}*{{this.productInfo.outerBoxWidth}}*{{this.productInfo.outerBoxHeight}}</div>（CM）
                    </div>
                    <div class="now_item">
                        <div class="title">{{$t("product.info.cartonSize")}}：</div>
                        <div class="text">{{this.productInfo.innerBoxLength}}*{{this.productInfo.innerBoxWidth}}*{{this.productInfo.innerBoxHeight}}</div>（CM）
                    </div>
                    <div class="now_item">
                        <div class="title">{{$t("product.info.innerBox")}}：</div>
                        <div class="text">{{this.productInfo.innerBoxCount}}/{{this.productInfo.outerBoxLoadCapa}}</div>（PCS）
                    </div>
                    <div class="now_item">
                        <div class="title">{{$t("product.info.CBM")}}：</div>
                        <div class="text">{{this.productInfo.outerBoxBulkStere}}/{{this.productInfo.outerBoxBulkFeet}}</div>（CBM）
                    </div>
                    <div class="now_item">
                        <div class="title">{{$t("product.info.GW")}}：</div>
                        <div class="text">{{this.productInfo.outerBoxGrossWeight}}/{{this.productInfo.outerBoxNetWeight}}</div>（KG）
                    </div>
                </Col>
            </Row>
            <div class="action" v-if="this.productInfo.id&&isAdmin">
                <Button type="primary" shape="circle" style="width:88px;margin:0 9px 0 58.5px;" @click="sureFlag = true">{{$t("product.other.add")}}</Button>
                <Modal v-model="sureFlag" :title="$t('product.other.reminder')" @on-ok="addSelection" @on-cancel="cancelSelection">
                    <Icon type="ios-alert-outline" style="color:#ff9900;font-size:18px"/><span>{{$t("product.other.sureAdd")}}</span>
                </Modal>
                <Button type="warning" shape="circle" style="width:88px;margin:0 58.5px 0 9px;"  @click="delFlag = true">{{$t("product.other.delete")}}</Button>
                <Modal v-model="delFlag" :title="$t('product.other.reminder')" @on-ok="delSelection" @on-cancel="cancelDel">
                    <Icon type="ios-alert-outline" style="color:#ed4014;font-size:18px"/><span>{{$t("product.other.sureDelete")}}</span>
                </Modal>
            </div>
            <Row class="product_wrap" v-if="!this.productInfo.id">
                <Col span="8">
                </Col>
                <Col span="8" style="text-align: center">
                    {{$t("product.order.noData")}}
                </Col>
                <Col span="8">
                </Col>
            </Row>
        </div>
        <!-- 产品详情页 -->
        <ModalProductDetail @show-modal-detail="showModalDetail" :showModal="showModal" :modalProductInfo="modalProductInfo"></ModalProductDetail>
    </div>
</template>
<script>
import * as Cookies from "js-cookie";
import ModalProductDetail from "@components/order/modalProductDetail";
import {
  QueryProductByCompanyNumber,
  AddSampleOrderDetail,
  QuerySampleOrderDetails,
  DeleteSampleOrderDetail
} from "@service/meetingService";

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
        sampleSelection:{
            type:Object,
            default () {
                return {}
            }
        }
    },
    data(){
        return {
            orderColumns: [
                {
                    title: this.$t("product.order.productNameList"),
                    key: 'productName',
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
                                title: params.row.productName
                            },
                            on:{
                                click:()=>{
                                    this.modalProductInfo = params.row;
                                    this.showModalDetail(true,params.row.productName);  
                                }
                            }
                        }, params.row.productName)
                        ])
                    },
                    width: 107
                },
                {
                    title: this.$t("product.order.prodcutNumberList"),
                    key: 'factoryNo',
                    width: 90
                },
                {
                    title: this.$t("product.order.productPriceList"),
                    key: 'address',
                    render: (h, params) => {
                        return h('div', [
                        h('span', {
                            style: {
                                color:'#EC1B1B',
                                marginTop: '4px'
                            },
                            domProps: {
                                title: params.row.quoteThePrice?params.row.quoteThePrice:0
                            }
                        }, '￥'+(params.row.quoteThePrice?params.row.quoteThePrice:0))
                        ])
                    },
                }
            ],
            orderList: [],
            nowProduct:'1111111111',
            test: require("@assets/bg/test.jpg"),
            isProductList:false,
            flag:'order',
            showModal:false,
            companyNumber:'',
            productInfo:{},
            modalProductInfo:{},
            totalAmount:0,
            totalBoxCount:0,
            totalBulkFeet: 0,
            totalBulkStere: 0,
            totalCount: 0,
            totalKuanshu: 0,
            roomNumber:null,
            isAdmin:false,
            sureFlag:false,
            delFlag:false,
            lang:'zh'
        }
    },
    watch:{
        tab_select:{
            handler(val){
                this.flag = val;
            }
        },
        sampleSelection:{
            handler(val){
                this.getQuerySampleOrderDetails();
            },
            deep:true
        }
    },
    methods:{
        saveNow(){
            
        },
        changTabType(value){
            this.flag = value;
            this.$emit('chang-tab-type',value);
            if(value=='order'){
                this.getQuerySampleOrderDetails();
            }
        },
        changType(){
            this.$emit('chang-type',true,'order');
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
        getProductInfo(){
            var params = {
                companyNumber:this.companyNumber,
                companyApiHost:window.localStorage.getItem('mac'),
                roomNumber: this.roomNumber,
                code:this.sampleSelection.number,
                verifyCode:this.sampleSelection.code
            };
            return new Promise((resolve, reject) => {
                QueryProductByCompanyNumber(params).then(res => {
                    if (res.success) {
                        this.productInfo = res.data;
                        this.$emit('saveProductInfo','saveProductInfo',params);
                    } else {
                        this.$Message.error({
                        background: true,
                        content: res.result.msg
                        });
                        this.$FromLoading.hide();
                    }
                });
            });
        },
        getProductInfo2(params){
            return new Promise((resolve, reject) => {
                QueryProductByCompanyNumber(params).then(res => {
                    if (res.success) {
                        this.productInfo = res.data;
                    } else {
                        this.$Message.error({
                        background: true,
                        content: res.result.msg
                        });
                        this.$FromLoading.hide();
                    }
                });
            });
        },
        cancelSelection(){
            this.sureFlag = false;
        },
        //新增择样
        addSelection(){
            var params = {
                code:this.sampleSelection.number,
                verifyCode:this.sampleSelection.code,
                roomNumber: this.roomNumber,
                type:1,
                sampleOrderProductInfo:[
                    {
                        id:this.productInfo.id,
                        companyNumber:this.productInfo.companyNumber,
                        boxCount:1,
                    }
                ]
            };
            return new Promise((resolve, reject) => {
                AddSampleOrderDetail(params).then(res => {
                    if (res.success) {
                        this.$Message.info({
                            background: true,
                            content: res.message
                        });
                        this.$FromLoading.hide();
                    } else {
                        this.$Message.error({
                            background: true,
                            content: res.message
                        });
                        this.$FromLoading.hide();
                    }
                });
            });        
        },
        cancelDel(){
            this.delFlag = false;
        },
        //删除择样
        delSelection(){
            var params = {
                code:this.sampleSelection.number,
                verifyCode:this.sampleSelection.code,
                id:this.productInfo.sampleOrderDetailId,
                roomNumber: this.roomNumber
            };
            return new Promise((resolve, reject) => {
                DeleteSampleOrderDetail(params).then(res => {
                    if (res.success) {
                        this.$Message.info({
                            background: true,
                            content: res.message
                        });
                        this.$FromLoading.hide();
                    } else {
                        this.$Message.error({
                            background: true,
                            content: res.message
                        });
                        this.$FromLoading.hide();
                    }
                });
            });        
        },
        //根据择样代号和验证码查询择样单详情列表
        getQuerySampleOrderDetails(){
            var params = {
                pageIndex:1,
                pageSize:99999,
                code:this.sampleSelection.number,
                verifyCode:this.sampleSelection.code,
                companyApiHost:window.localStorage.getItem('mac'),
                roomNumber: this.roomNumber
            };
            return new Promise((resolve, reject) => {
                QuerySampleOrderDetails(params).then(res => {
                    if (res.success) {
                        this.orderList = res.data.sampleOrderDetails.items;
                        this.totalAmount=res.data.totalAmount;
                        this.totalBoxCount=res.data.totalBoxCount;
                        this.totalBulkFeet=res.data.totalBulkFeet;
                        this.totalBulkStere=res.data.totalBulkStere;
                        this.totalCount=res.data.totalCount;
                        this.totalKuanshu=res.data.totalKuanshu;
                        this.$FromLoading.hide();
                    } else {
                        this.$Message.error({
                            background: true,
                            content: res.result.msg
                        });
                        this.$FromLoading.hide();
                    }
                });
            });     
        }
    },
    created(){
        this.roomNumber=Cookies.get('channel');
        this.isAdmin=Cookies.get("isAdmin")=='true' ? true : false;
        this.getQuerySampleOrderDetails();
        this.lang = window.localStorage.getItem('language');
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
                margin: 8px 0 8px 16px;
                width: 295px;
                height: 66px;
                .order_list {
                    background: url('~@assets/images/order_list.png');
                    background-size: cover;//注意：一定要把这个属性配合fixed使用；
                    background-repeat: no-repeat; 
                    height: 32px;
                    width: 32px;
                    margin-top: -10px;
                    margin-left: 20px;
                }
            }
            .select_order_list{
                /deep/ .ivu-table-cell {
                    padding-left: 16px;
                    padding-right: 16px;
                    font-size: 13px;
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
                .en_text{
                    font-size: 12px;
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
