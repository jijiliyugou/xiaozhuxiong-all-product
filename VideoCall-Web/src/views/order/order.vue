<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-01 17:59:28
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\views\order\index.vue
 * @LastEditTime: 2021-04-23 17:41:46
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
    <div class="order">
        <!-- 新增择样 -->
        <AddSampling @save="save" v-if="samplingStatus&&isAdmin"></AddSampling>
        <Product :tab_select="tab_select" @chang-tab-type="changTabType" @chang-type="changType" @change-product-list="changeProductList" @saveProductInfo="saveProductInfo" :sampleSelection="sampleSelection" v-if="sampleSelection.number" ref="product"></Product>
        <Chart v-show="sampleSelection.number||!isAdmin" ref="chart" @getSampleOrderDetails="getSampleOrderDetails" @getProduct="getProduct" :userlist="userlist"></Chart>
        <ProductList @change-product-list="changeProductList" :isProductList="isProductList" :sampleSelection="sampleSelection" v-if="sampleSelection.number"></ProductList>
    </div>
</template>
<script>
import * as Cookies from "js-cookie";
import ProductList from "@components/order/productList";
import Chart from "@components/public/chart";
import Product from "@components/order/product";
import AddSampling from "@components/order/addSampling";
export default {
    name:'Order',
    props:{
        userlist: {
            type: Array,
            default () {
                return []
            }
        },
    },
    components:{
        ProductList,
        Chart,
        Product,
        AddSampling
    },
    data(){
        return {
            samplingStatus: true,  //采样状态
            tab_select: 'order',
            isProductList:false,
            sampleSelection:{
                number:'',
                code:''    
            },
            isAdmin:null
        }
    },
    methods: {
        save(val){
            this.sampleSelection = val;
            this.samplingStatus = false;
            this.$refs.chart.send('saveSelection',val);
        },
        changTabType(value){
            this.tab_select = value;
        },
        changType(value,tab_select){
            this.samplingStatus = value;
            this.tab_select = tab_select;
            this.sampleSelection = {
                number:'',
                code:''    
            };
        },
        changeProductList(){
            this.isProductList = this.isProductList ? false:true;
            if(!this.isProductList){
                this.$refs.product.getQuerySampleOrderDetails();
            }
        },
        //择样单消息回调
        getSampleOrderDetails(val){
            this.$set(this.sampleSelection,'number',val.number);
            this.$set(this.sampleSelection,'code',val.code);
            if(this.$refs.product){
                this.$refs.product.changTabType('order');
            }
        },
        //当前产品消息发送
        saveProductInfo(type,val){
            this.$refs.chart.send(type,val);
        },
        //当前产品消息回调
        getProduct(val){
            this.$refs.product.getProductInfo2(val);
        }
    },
    created(){
        this.isAdmin = Cookies.get("isAdmin")=='true' ? true : false;
    }
}
</script>
<style lang="less" scoped>
    .order{
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
    }
    .red{
        color: #EC1B1B;
    }
    .blue{
        color: #2684D1;
    }
</style>