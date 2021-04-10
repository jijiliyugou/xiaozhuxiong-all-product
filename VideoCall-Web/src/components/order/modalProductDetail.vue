<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-11-03 16:35:57
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-07 11:35:59
-->
<template>
    <Modal v-model="show" title="  " @on-ok="ok" @on-cancel="cancel" width="1048" class="modalDetail">
        <div class="product_info_panel">
            <div class="product_info_wrap item" v-if="show">
                <XCarousel v-model="value1" loop v-if="show" :imgList="imgList">
                    <CarouselItem v-if="show">
                        <div class="product_info_img">
                            <div class="product_info_img_border">
                                <img :src="test"/>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem v-if="show">
                        <div class="product_info_img">
                            <div class="product_info_img_border">
                                <img :src="test"/>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem v-if="show">
                        <div class="product_info_img">
                            <div class="product_info_img_border">
                                <img :src="test"/>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem v-if="show">
                        <div class="product_info_img">
                            <div class="product_info_img_border">
                                <img :src="test"/>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem v-if="show">
                        <div class="product_info_img">
                            <div class="product_info_img_border">
                                <img :src="test"/>
                            </div>
                        </div>
                    </CarouselItem>
                </XCarousel>
            </div>
            <div class="product_info_list item">
                <Row class="product_info_list_item">
                    <Col span="24">
                        <div class="active">Guess who I am?</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items">price：</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items red"><span>$</span><span class="font_size_20">17.00</span></div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items">price：</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items"><span>$</span>17.00</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items">price：</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items"><span>$</span>17.00</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items">price：</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items"><span>$</span>17.00</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items">price：</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items"><span>$</span>17.00</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items">price：</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items"><span>$</span>17.00</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items">price：</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items"><span>$</span>17.00</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items">price：</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items"><span>$</span>17.00</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items">price：</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items"><span>$</span>17.00</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items">price：</div>
                    </Col>
                    <Col span="12">
                        <div class="product_info_list_items"><span>$</span>17.00</div>
                    </Col>
                </Row>
            </div>
        </div>
        <div slot="footer">
            
        </div>    
    </Modal>
</template>

<script>
import XCarousel from "@components/public/carousel/carousel";

export default {
    name: 'ModalProductDetail',
    components: {
        XCarousel    
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            show: false,
            test: require("@assets/bg/test.jpg"),
            value1: 0,
            imgList:[
                {id:1,url:require("@assets/bg/test.jpg")},
                {id:2,url:require("@assets/bg/test.jpg")},
                {id:3,url:require("@assets/bg/test.jpg")},
                {id:4,url:require("@assets/bg/test.jpg")},
                {id:5,url:require("@assets/bg/test.jpg")},
            ]
        }
    },
    watch:{
        showModal: {
            handler(val) {
                this.show = val;
            }
        },
    },
    methods: {
        ok(){

        },
        cancel(){
            this.$emit('show-modal-detail', false);    
        },
    },
    mounted() {

    },
    created(){
       
    }
}
</script>
<style lang="less" scoped>
.modalDetail  /deep/ .ivu-modal-close /deep/ .ivu-icon-ios-close {
    color: #999999; 
}
.modalDetail /deep/ .ivu-modal /deep/ .ivu-modal-header {
    border-bottom: unset;
    padding: 5px;
    line-height: 1;
    background: #fff;
    border-radius: 6px 6px 0px 0px;
    color: #999999;
    .ivu-modal-header-inner{
        color: #999999;
    }
}
.modalDetail .footer_page{
    margin: 0 10px 10px 10px;
    overflow: hidden;
    .footer_page_right{
        float: right;
    }
}
.modalDetail .product_info_panel{
    display: flex;
    .item{
        margin: 0 10px;
    }
}
.modalDetail .product_info_wrap {
    width: 542px;
    height: 470px;
    .product_info_img {
        width: 541px;
        .product_info_img_border {
            width: 541px;
            height: 395px;
            border: 1px solid #EFEFEF;
            img {
                width: 503px;
                height: 357px;
                margin: 19px;
            }
        }
    }
}
.modalDetail .product_info_list {
    width: 434px;
    height: 470px;
    .active {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 16px;
    }
    .product_info_list_item{
        .product_info_list_items {
            margin-bottom: 14px;
        }
    }
}
.modalDetail{
    .c_item{
        .demo-carousel {
            height: 200px;
            line-height: 200px;
            text-align: center;
            color: #fff;
            font-size: 20px;
            background: #506b9e;
        }
    }
}
.red{
    color: #FF760E;
}
.font_size_20 {
    font-size: 16px;
}
</style>

