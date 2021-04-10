<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-06 11:15:36
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\components\order\productList.vue
 * @LastEditTime: 2021-04-08 11:28:25
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="productList_wrap">
    <!-- 择样购物车 -->
        <Drawer title="Sample selection details" :closable="true" v-model="isShow" @on-close="changeProductList" width='1255' class="productList">
            <div slot="close" style="cursor: pointer;color: black;display: inline-block;width: 100%;height: 24px;line-height: 24px;font-size: 24px;color: #999999;margin-top: 4px;
                margin-right: 8px;">
                <Icon type="md-arrow-round-forward" />
            </div>
            <div class="title">
                <div class="item">悦翔展厅：择样单</div><div class="item" style="margin-left:47px">本次代号： 107362</div>
            </div>
            <Table :columns="columns2" :data="data2" >
                <template slot-scope="{ row, index }" slot="action">
                    <Icon type="ios-trash-outline" style="font-size:24px" />
                </template>
                <template slot="footer">
                    <div class="footer_page">
                        <div class="footer_page_right">
                            <Page :total="totalPage" :current="pageData.skipCount" @on-change="" show-elevator show-total show-sizer :page-size-opts="pageData.pageSizeOpts" :page-size="pageData.skipTotal" @on-page-size-change="" :transfer="true"></Page>
                        </div>
                    </div>
                </template>
            </Table>
            <div class="total">
                <div class="item">
                    <div class="label">Total Price：</div>
                    <div class="text active">USD 389.00</div>
                </div>
                <div class="item">
                    <div class="label">Total Volume：</div>
                    <div class="text">3 cbm</div>
                    <div class="text">3 cuft</div>
                </div>
                <div class="item">
                    <div class="label">Total Quantitly：</div>
                    <div class="text">3</div>
                </div>
                <div class="item">
                    <div class="label">Total CTNS：</div>
                    <div class="text">3</div>
                </div>
                <div class="item">
                    <div class="label">Total Rcords：</div>
                    <div class="text">3</div>
                </div>
            </div>
        </Drawer>
    </div>
</template>
<script>
export default {
    name:'ProductList',
    props:{
        isProductList:{
            type: Boolean,
            default: false,
        },
    },
    watch:{
        isProductList:{
            handler(val){
                this.isShow = val;
            }
        }
    },
    data(){
        return {
            columns2: [
                {
                    title: '图片',
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
                                        src: (params.row.imgOne ?this.$base_url+params.row.imgOne:'') || require("@assets/default/logo.png")
                                    },
                                    style: {
                                        width: '30px',
                                        height: '30px'
                                    },
                                    on: {
                                        click:()=>{
                                            this.srcData = {
                                                imgName: '图片预览',
                                                src: (params.row.imgOne ?this.$base_url+params.row.imgOne:'') || require("@assets/default/logo.png")
                                            }
                                            this.showImageModel(true);
                                        }
                                    }
                                }),
                                h('img',{
                                    slot:"content",
                                    attrs: {
                                        src: (params.row.imgOne ?this.$base_url+params.row.imgOne:'') || require("@assets/default/logo.png")
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
                                    title: params.row.OR_CODE
                                }
                            }, params.row.OR_CODE),
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
                                    title: params.row.MSG
                                }    
                            }, params.row.MSG),
                            h('div', { 
                                style: {
                                    marginTop: '4px',
                                    color:'#FF3E3E',
                                },  
                            }, params.row.number),
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
                                },params.row.price),
                            ], {  
                                style: {
                                    marginTop: '4px',
                                    color:'#FF3E3E',
                                }, 
                            }, params.row.price),
                        ])
                    },
                    width: 210
                },
                {
                    title: 'Product information',
                    key: 'info2',
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                },
                            },'Item NO：' + params.row.info2),
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                },  
                            },'packing：' + params.row.packing),
                            h('div', { 
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                },  
                            },'productSize：' + params.row.productSize),
                            h('div', {  
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                }, 
                            },'packageSize：' + params.row.packageSize),
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
                            },'conrtonSize：' + params.row.conrtonSize),
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                },  
                            },'innerBox：' + params.row.innerBox),
                            h('div', { 
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                },  
                            },'cbm：' + params.row.cbm),
                            h('div', {  
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#333333'
                                }, 
                            },'GW/NW：' + params.row['GW/NW']),
                        ])
                    },
                    width: 210
                },
                {
                    renderHeader:(h,params)=>{
                        return h('div',[
                            h('div','CTNS'),
                            h('div','Total QTY'),
                        ])
                    },
                    key: 'ctns',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    color:'#FF3E3E',
                                },
                            }, params.row.ctns),
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color:'#FF3E3E',
                                },  
                            },'pcs：' + params.row.pcs),
                        ])
                    },
                    width: 120
                },
                {
                    title: 'Total volume',
                    key: 'Total',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    color:'#FF3E3E',
                                },
                            }, params.row.total),
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    color:'#FF3E3E',
                                },  
                            }, params.row.volume),
                        ])
                    },
                    width: 142
                },
                {
                    title: 'Total amount',
                    key: 'totalAmount',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                style: {
                                    marginTop: '4px',
                                    color:'#FF3E3E',
                                },
                            },params.row.totalAmount),
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
            data2: [
                {
                    OR_CODE: 'OR_CODE:54004,ERROR_ MSG:PLEASE RECHAR...',
                    MSG:'FDASFDSFADSFDASFA',
                    number: 'S658-29',
                    price: '199.00',
                    info2: 'No：8899561514',
                    packing: 'dfadsfasdf',
                    productSize: '0x0x0(cm)',
                    packageSize: '0x0x0(cm)',
                    conrtonSize:'22x23x74(cm)',
                    innerBox:'2/12(pcs)',
                    cbm:'0.364(cbm)',
                    'GW/NW':'26.5/24.5(kg)',
                    ctns:2,
                    pcs:40,
                    total:'0.465cbm',
                    volume:'16.062cufg',
                    totalAmount:'$98.00'
                },
                {
                    OR_CODE: 'OR_CODE:54004,ERROR_ MSG:PLEASE RECHAR...',
                    MSG:'FDASFDSFADSFDASFA',
                    number: 'S658-29',
                    price: '199.00',
                    info2: 'No：8899561514',
                    packing: 'dfadsfasdf',
                    productSize: '0x0x0(cm)',
                    packageSize: '0x0x0(cm)',
                    conrtonSize:'22x23x74(cm)',
                    innerBox:'2/12(pcs)',
                    cbm:'0.364(cbm)',
                    'GW/NW':'26.5/24.5(kg)',
                    ctns:2,
                    pcs:40,
                    total:'0.465cbm',
                    volume:'16.062cufg',
                    totalAmount:'$98.00'
                },
                {
                    OR_CODE: 'OR_CODE:54004,ERROR_ MSG:PLEASE RECHAR...',
                    MSG:'FDASFDSFADSFDASFA',
                    number: 'S658-29',
                    price: '199.00',
                    info2: 'No：8899561514',
                    packing: 'dfadsfasdf',
                    productSize: '0x0x0(cm)',
                    packageSize: '0x0x0(cm)',
                    conrtonSize:'22x23x74(cm)',
                    innerBox:'2/12(pcs)',
                    cbm:'0.364(cbm)',
                    'GW/NW':'26.5/24.5(kg)',
                    ctns:2,
                    pcs:40,
                    total:'0.465cbm',
                    volume:'16.062cufg',
                    totalAmount:'$98.00'
                },
            ],
            dataList: [],
            pageData:{
                skipCount: 1,
                skipTotal: 5,
                maxResultCount: 5,
                keyword:'',
                pageSizeOpts:[5,10,15],
            },
            totalPage:0,
            isShow:false
        }
    },
    methods: {
        changeProductList(){
            this.$emit('change-product-list');
        }
    },
}
</script>