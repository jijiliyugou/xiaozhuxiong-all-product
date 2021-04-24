<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-06 11:15:36
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\order\productList.vue
 * @LastEditTime: 2021-04-22 16:26:24
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="productList_wrap">
    <!-- 择样购物车 -->
        <Drawer title="择样订单详情" :closable="true" v-model="isShow" @on-close="changeProductList" width='1255' class="productList">
            <div slot="close" style="cursor: pointer;color: black;display: inline-block;width: 100%;height: 24px;line-height: 24px;font-size: 24px;color: #999999;margin-top: 4px;
                margin-right: 8px;">
                <Icon type="md-arrow-round-forward" />
            </div>
            <div class="title">
                <div class="item">悦翔展厅：择样单</div><div class="item" style="margin-left:47px">本次代号： {{sampleSelection.number}}</div>
            </div>
            <Table :columns="columns2" :data="data2" height="700" :loading="loading" class="from">
                <template slot-scope="{ row, index }" slot="action">
                    <Icon type="ios-trash-outline" style="font-size:24px" @click="delSelection(row.id)" v-if="flag" />
                </template>
                <!-- <template slot="footer">
                    <div class="footer_page">
                        <div class="footer_page_right">
                            <Page :total="totalPage" :current="pageData.skipCount" @on-change="" show-elevator show-total show-sizer :page-size-opts="pageData.pageSizeOpts" :page-size="pageData.skipTotal" @on-page-size-change="" :transfer="true"></Page>
                        </div>
                    </div>
                </template> -->
            </Table>
            <div class="total">
                <div class="item">
                    <Button type="primary" shape="circle" style="width:88px;margin: 6px 6px 0 0;" @click="save" v-if="flag">提交</Button>
                </div>
                <div class="item">
                    <div class="label">总价：</div>
                    <div class="text active">$ {{totalAmount}}</div>
                </div>
                <div class="item">
                    <div class="label">总毛重/总净重：</div>
                    <div class="text">{{totalGrossWeight}}/{{totalNetWeight}}(KG)</div>
                </div>
                <div class="item">
                    <div class="label">总体积/总材积：</div>
                    <div class="text">{{totalBulkFeet}} cbm</div>
                    <div class="text">{{totalBulkStere}} cuft</div>
                </div>
                <div class="item">
                    <div class="label">总个数：</div>
                    <div class="text">{{totalCount}}</div>
                </div>
                <div class="item">
                    <div class="label">总箱数：</div>
                    <div class="text">{{totalBoxCount}}</div>
                </div>
                <div class="item">
                    <div class="label">总款数：</div>
                    <div class="text">{{totalKuanshu}}</div>
                </div>
            </div>
        </Drawer>
    </div>
</template>
<script>
import * as Cookies from "js-cookie";
import util from "@utils/util";
import {
  QuerySampleOrderDetails,
  DeleteSampleOrderDetail,
  AddSampleOrderDetail
} from "@service/meetingService";

export default {
    name:'ProductList',
    props:{
        isProductList:{
            type: Boolean,
            default: false,
        },
        sampleSelection:{
            type:Object,
            default () {
                return {}
            }
        }
    },
    watch:{
        isProductList:{
            handler(val){
                this.isShow = val;
                if(val){
                    this.getQuerySampleOrderDetails();
                }
            }
        }
    },
    data(){
        return {
            columns2: [
                {
                    title: ' ',
                    key: 'img',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', 
                        [
                            h('Poptip',{
                                props: {
                                    trigger:'hover',
                                    content:"content",
                                    placement:"right",
                                    transfer:true,
                                },
                            },[
                                h('img', {
                                    attrs: {
                                        src: (params.row.productImages.length&&params.row.productImages[0]) || require("@assets/default/logo.png")
                                    },
                                    style: {
                                        width: '30px',
                                        height: '30px'
                                    },
                                    on: {
                                        click:()=>{
                                            this.srcData = {
                                                imgName: '图片预览',
                                                src: (params.row.productImages.length&&params.row.productImages[0]) || require("@assets/default/logo.png")
                                            }
                                            this.showImageModel(true);
                                        }
                                    }
                                }),
                                h('img',{
                                    slot:"content",
                                    attrs: {
                                        src: (params.row.productImages.length&&params.row.productImages[0]) || require("@assets/default/logo.png")
                                    },
                                    style: {
                                        width: '300px',
                                        height: '300px'
                                    },
                                    class:'api'
                                })
                            ])    
                        ]);
                    },
                    width: 130,
                    resizable: true,
                },
                {
                    title: ' ',
                    key: 'info1',
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color:'#000000',
                                    marginTop: '4px',
                                    fontWeight:400,
                                },
                                domProps: {
                                    title: params.row.productName
                                }
                            }, params.row.productName),
                            h('div', { 
                                style: {
                                    marginTop: '4px',
                                    color:'#FF3E3E',
                                },  
                            }, params.row.factoryNo),
                            h('div',[
                                h('span', {
                                    style: {

                                        color:'#FF3E3E',
                                    }, 
                                },'USD'),
                                h('span', {
                                    style: {
                                        color:'#FF3E3E',
                                        fontWeight:600,
                                        marginLeft: '4px',
                                    }, 
                                },params.row.factoryPrice),
                            ], {  
                                style: {
                                    marginTop: '4px',
                                    color:'#FF3E3E',
                                }, 
                            }, params.row.factoryPrice),
                        ])
                    },
                    width: 210
                },
                {
                    title: '产品信息',
                    key: 'info2',
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                },
                            },'公司编号：' + params.row.companyNumber),
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                },  
                            },'包装方式：' + params.row.chinesePack),
                            h('div', { 
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                },  
                            },'产品规格：' + params.row.productLength +'x'+params.row.productWidth+'x'+params.row.productHeight+'(cm)'),
                            h('div', {  
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                }, 
                            },'包装规格：' + params.row.innerBoxLength +'x'+params.row.innerBoxWidth+'x'+params.row.innerBoxHeight+'(cm)'),
                        ])
                    },
                    width: 210
                },
                {
                    title: ' ',
                    key: 'info3',
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                },
                            },'外箱规格：' + params.row.outerBoxLength +'x'+params.row.outerBoxWidth+'x'+params.row.outerBoxHeight+'(cm)'),
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                },  
                            },'内箱/装箱量：' + params.row.innerBoxCount+'(cbm)/'+params.row.outerBoxLoadCapa+'(cuft)'),
                            h('div', { 
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                },  
                            },'体积/材积：' + params.row.outerBoxBulkFeet + '/' + params.row.outerBoxBulkStere),
                            h('div', {  
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                }, 
                            },'毛重/净重：' + params.row.outerBoxGrossWeight+'/'+params.row.outerBoxNetWeight+'(kg)'),
                        ])
                    },
                    width: 210
                },
                {
                    renderHeader:(h,params)=>{
                        return h('div',[
                            h('div','总箱数'),
                            h('div','总数量'),
                        ])
                    },
                    key: 'tempAmount',
                    align: 'center',
                    render: (h, params) => {
                        var me = this;
                        return h('div', [
                            h('Input', {
                                style: {
                                    width: '100px',
                                    textAlign: 'center',
                                },
                                props: {
                                    value: this.data2[params.index][params.column.key],
                                    type:'number',
                                    style:{
                                        textAlign: 'center',
                                    },
                                    disabled:me.flag?false:true
                                },
                                number:'true',
                                on: {
                                    'on-change': (event) => {
                                        //先算箱数差值
                                        var translate = parseInt(event.currentTarget.value)-parseInt(this.data2[params.index][params.column.key]);
                                        me.totalBoxCount = parseInt(me.totalBoxCount)+translate;
                                        this.data2[params.index][params.column.key] = event.currentTarget.value;
                                        this.data2[params.index]['totalAmount'] = this.data2[params.index]['factoryPrice'] * this.data2[params.index][params.column.key] * this.data2[params.index]['outerBoxLoadCapa'];
                                        //差值金额
                                        var moenyT = params.row.factoryPrice*translate*params.row.outerBoxLoadCapa||0;
                                        me.totalAmount = (me.totalAmount+moenyT).toFixed(2);
                                        //差值个数
                                        var countT = translate*params.row.outerBoxLoadCapa||0;
                                        me.totalCount = me.totalCount+countT;
                                        //差值体积
                                        var tjT = translate*params.row.outerBoxBulkFeet||0;
                                        me.totalBulkFeet = (me.totalBulkFeet+tjT).toFixed(2);
                                        //差值材积
                                        var jzT = translate*params.row.outerBoxBulkStere||0;
                                        me.totalBulkStere = (me.totalBulkStere+jzT).toFixed(2);
                                        //差值毛重
                                        var mzT = translate*params.row.outerBoxGrossWeight||0;
                                        me.totalGrossWeight = (me.totalGrossWeight+mzT).toFixed(2);
                                        //差值净重
                                        var jzT = translate*params.row.outerBoxNetWeight||0;
                                        me.totalNetWeight = (me.totalNetWeight+jzT).toFixed(2);
                                    }
                                }
                            }),
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color:'#FF3E3E',
                                },
                            }, params.row.outerBoxLoadCapa*params.row.tempAmount+'pcs'),
                        ])
                    },
                    width: 120
                },
                {
                    renderHeader:(h,params)=>{
                        return h('div',[
                            h('div','总体积'),
                            h('div','总材积'),
                        ])
                    },
                    key: 'Total',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    color:'#FF3E3E',
                                },
                            }, (params.row.outerBoxBulkFeet*params.row.tempAmount).toFixed(2)+'cbm'),
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    color:'#FF3E3E',
                                },  
                            }, (params.row.outerBoxBulkStere*params.row.tempAmount).toFixed(2)+'cuft'),
                        ])
                    },
                    width: 142
                },
                {
                    title: '总金额',
                    key: 'totalAmount',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    color:'#FF3E3E',
                                },
                            },'$'+(params.row.factoryPrice*params.row.tempAmount*params.row.outerBoxLoadCapa||0).toFixed(2)),
                        ])
                    },
                    width: 140    
                },
                {
                    title: ' ',
                    align: 'center',
                    slot: 'action',
                    width: 60    
                }
            ],
            data2:[],
            pageData:{
                skipCount: 1,
                skipTotal: 5,
                maxResultCount: 5,
                keyword:'',
                pageSizeOpts:[5,10,15],
            },
            totalPage:0,
            isShow:false,
            totalAmount:0,
            totalBoxCount:0,
            totalBulkFeet: 0,
            totalBulkStere: 0,
            totalCount: 0,
            totalKuanshu: 0,
            totalGrossWeight:0,
            totalNetWeight:0,
            roomNumber:null,
            loading:true,
            flag:false
        }
    },
    methods: {
        changeProductList(){
            this.$emit('change-product-list');
        },
        getQuerySampleOrderDetails(){
            var params = {
                pageIndex:1,
                pageSize:99999,
                code:this.sampleSelection.number,
                verifyCode:this.sampleSelection.code,
                roomNumber: this.roomNumber
            };
            this.loading = true;
            return new Promise((resolve, reject) => {
                QuerySampleOrderDetails(params).then(res => {
                    if (res.success) {
                        this.data2 = res.data.sampleOrderDetails.items;
                        this.totalAmount=res.data.totalAmount;
                        this.totalBoxCount=res.data.totalBoxCount;
                        this.totalBulkFeet=res.data.totalBulkFeet;
                        this.totalBulkStere=res.data.totalBulkStere;
                        this.totalCount=res.data.totalCount;
                        this.totalKuanshu=res.data.totalKuanshu;
                        this.totalGrossWeight=res.data.totalGrossWeight;
                        this.totalNetWeight=res.data.totalNetWeight;
                        this.$FromLoading.hide();
                        this.loading=false;
                    } else {
                        this.$Message.error({
                            background: true,
                            content: res.result.msg
                        });
                        this.$FromLoading.hide();
                        this.loading=false;
                    }
                });
            });     
        },
        //删除择样
        delSelection(id){
            var params = {
                id:id,
                roomNumber: this.roomNumber
            };
            this.loading = true;
            return new Promise((resolve, reject) => {
                DeleteSampleOrderDetail(params).then(res => {
                    if (res.success) {
                        this.$Message.info({
                            background: true,
                            content: res.message
                        });
                        this.getQuerySampleOrderDetails();
                        this.$FromLoading.hide();
                        this.loading=false;
                    } else {
                        this.$Message.error({
                            background: true,
                            content: res.message
                        });
                        this.$FromLoading.hide();
                        this.loading=false;
                    }
                });
            });        
        },
        save(){
            var arr= [];
            for(var i=0;i<this.data2.length;i++){
                var obj = {
                    companyNumber:this.data2[i]['companyNumber'],
                    productName:this.data2[i]['productName'],
                    boxCount:this.data2[i]['tempAmount']
                }
                arr.push(obj);
            }
            var params = {
                code:this.sampleSelection.number,
                verifyCode:this.sampleSelection.code,
                roomNumber: this.roomNumber,
                type:2,
                sampleOrderProductInfo:arr
            };
            this.loading = true;
            return new Promise((resolve, reject) => {
                AddSampleOrderDetail(params).then(res => {
                    if (res.success) {
                        this.$Message.info({
                            background: true,
                            content: res.message
                        });
                        this.$FromLoading.hide();
                        this.getQuerySampleOrderDetails();
                        this.loading=false;
                    } else {
                        this.$Message.error({
                            background: true,
                            content: res.message
                        });
                        this.$FromLoading.hide();
                        this.loading=false;
                    }
                });
            });    
        },
    },
    created(){
        this.roomNumber=Cookies.get('channel');
        this.flag =  Cookies.get("isAdmin")=='true' ? true : false;
    }
}
</script>