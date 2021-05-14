<template>
  <div class="productDetailWrap">
    <div class="detailBox">
      <div class="left">
        <magnifierComponent
          ref="magnifierRef"
          v-if="productDetail.imgUrlList"
          :middleImgWidth="524"
          :middleImgHeight="393"
          :thumbnailHeight="65"
          :thumbnailWidth="96"
          :thumbnailCount="5"
          :imageUrls="productDetail.imgUrlList"
          :videoAddress="productDetail.videoAddress"
          :threeDimensional="productDetail.threeDimensional"
        />
      </div>
      <div class="right">
        <div class="context">
          <div class="productName">
            <span
              >{{ productDetail.name
              }}<i class="newIcon" v-if="productDetail.isNew">新品</i>
              <i class="nowIcon" v-if="productDetail.isSpotGoods">现货</i>
              <i class="vipIcon" v-if="productDetail.isVip">VIP</i></span
            >
          </div>
          <div class="priceWrap">
            参考单价：
            <span class="priceBox"
              >{{ productDetail.cu_de
              }}<span class="price">{{ productDetail.price }}</span></span
            >
          </div>
          <div class="textWrap">
            <div class="left">
              <div class="itemText">
                出厂货号：<span>{{ productDetail.fa_no }}</span>
              </div>
              <div class="itemText">
                产品规格：
                <span
                  >{{ productDetail.pr_le }} x {{ productDetail.pr_wi }} x
                  {{ productDetail.pr_hi }} (cm)</span
                >
              </div>
              <div class="itemText">
                包装规格：
                <span
                  >{{ productDetail.in_le }} x {{ productDetail.in_wi }} x
                  {{ productDetail.in_hi }} (cm)</span
                >
              </div>
              <div class="itemText">
                体积/材积：
                <span
                  >{{ productDetail.bulk_stere }} (cbm) /
                  {{ productDetail.bulk_feet }} (cuft)</span
                >
              </div>
            </div>
            <div class="right">
              <div class="itemText">
                包装：<span>{{ productDetail.ch_pa }}</span>
              </div>
              <div class="itemText">
                外箱规格：
                <span
                  >{{ productDetail.ou_le }} x {{ productDetail.ou_wi }} x
                  {{ productDetail.ou_hi }} (cm)</span
                >
              </div>
              <div class="itemText">
                装箱量：
                <span
                  >{{ productDetail.in_en }} /
                  {{ productDetail.ou_lo }} (pcs)</span
                >
              </div>
              <div class="itemText">
                毛重/净重：
                <span
                  >{{ productDetail.gr_we }} /
                  {{ productDetail.ne_we }} (kg)</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="myCartBox">
          <div class="myCart" @click="handlerShopping(productDetail)">
            <i class="myCartIcon"></i>
            <span>加入购物车</span>
          </div>
          <div class="myShoucang" @click="addCollect(productDetail)">
            <i class="shoucangActiveIcon" v-if="productDetail.isFavorite"></i>
            <i class="shoucangIcon" v-else></i>
            <span>产品收藏</span>
          </div>
        </div>
        <!-- 上架时间，产品认证 -->
        <div class="shelfTimeBox">
          <p>
            <span class="newTime">
              上架时间：
              <span>{{
                productDetail.newTime &&
                  productDetail.newTime.replace(/T.*/, "")
              }}</span>
            </span>
            <span class="stock">
              库存：
              <span class="tockValue">--</span>
            </span>
          </p>
          <p>
            产品认证：
            <i v-if="productDetail.certificateNo" class="proveActiveIcon"></i>
            <i v-else class="proveIcon"></i>
            <span>{{ productDetail.certificateNo }}</span>
          </p>
        </div>
        <!-- 联系方式 -->
        <div class="contactMode">
          <p class="item">
            <i class="factoryIcon"></i>
            <el-tooltip
              effect="dark"
              :content="productDetail.supplierName"
              placement="top"
            >
              <span class="context" @click="toFactory(productDetail)">{{
                productDetail.supplierName
              }}</span>
            </el-tooltip>
          </p>
          <p class="item myHover" @click="toNews(productDetail)">
            <i class="infoIcon"></i>
            <span>在线咨询</span>
          </p>
          <p class="item myHover" v-if="productDetail.supplierTelephoneNumber">
            <i class="phoneIcon"></i>
            <el-tooltip
              effect="dark"
              :content="productDetail.supplierTelephoneNumber"
              placement="top"
            >
              <span class="context">{{
                productDetail.supplierTelephoneNumber
              }}</span>
            </el-tooltip>
          </p>
          <p class="item myHover" v-if="productDetail.supplierPhone">
            <i class="sjIcon"></i>
            <el-tooltip
              effect="dark"
              :content="productDetail.supplierPhone"
              placement="top"
            >
              <span class="context">{{ productDetail.supplierPhone }}</span>
            </el-tooltip>
          </p>
          <p class="item myHover" v-if="productDetail.supplierQQ">
            <i class="qqIcon"></i>
            <el-tooltip
              effect="dark"
              :content="productDetail.supplierQQ"
              placement="top"
            >
              <span class="context">{{ productDetail.supplierQQ }}</span>
            </el-tooltip>
          </p>
          <p class="item myHover" @click="toFactory(productDetail)">
            <i class="shopIcon"></i>
            <span>厂商店铺</span>
          </p>
        </div>
        <!-- 来源 -->
        <div class="sourceBox">
          <p class="item">
            资源来源：
            <span>{{ productDetail.exhibitionName }}</span>
          </p>
          <p class="item">
            展厅编号：
            <span>{{ productDetail.number }}</span>
          </p>
          <p class="item">
            摊位号：
            <span>{{ productDetail.booth_nu_pro }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="productDetails">
      <div class="title">产品资料</div>
      <div class="content">
        <div
          class="imgItem"
          v-for="imgItem in productDetail.imgUrlList"
          :key="imgItem"
        >
          <img style="margin: 0 auto" :src="imgItem" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import magnifierComponent from "@/components/bsComponents/bsProductSearchComponent/bsMagnifierComponent.vue";
import eventBus from "@/assets/js/common/eventBus.js";
export default {
  props: {
    item: {
      type: Object
    }
  },
  components: {
    magnifierComponent
  },
  data() {
    return {
      productDetail: {}
    };
  },
  methods: {
    // 去聊天
    toNews(item) {
      const fd = {
        name: item.supplierNumber + "bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: item.supplierName,
        value: {}
      };
      this.$store.commit("myAddTab", fd);
      this.$router.push("/bsIndex/bsNews");
    },
    // 去厂商
    toFactory(item) {
      const fd = {
        name: item.supplierNumber,
        linkUrl: "/bsIndex/bsVendorQuery",
        component: "bsMyClientsDetail",
        refresh: true,
        noPush: true,
        label: item.supplierName,
        value: {
          companyNumber: item.supplierNumber,
          companyLogo: item.supplierPersonnelLogo,
          companyName: item.supplierName,
          contactsMan: item.supplierPersonnelName,
          phoneNumber: item.supplierPhone,
          address: item.supplierAddres || item.supplierAddress
        }
      };
      this.$store.commit("myAddTab", fd);
      this.$router.push("/bsIndex/bsVendorQuery");
    },
    // 加购
    handlerShopping() {
      if (this.shoppingList.length >= 500 && !this.item.isShopping) {
        this.$common.handlerMsgState({
          msg: "购物车已满500条",
          type: "warning"
        });
        return;
      }
      this.item.isShopping = !this.item.isShopping;
      if (this.item.isShopping) {
        this.item.shoppingCount = 1;
        this.productDetail.shoppingCount = 1;
        this.$store.commit("pushShopping", this.productDetail);
        this.$common.handlerMsgState({
          msg: "加购成功",
          type: "success"
        });
      } else {
        this.item.shoppingCount = 0;
        this.productDetail.shoppingCount = 0;
        this.$store.commit("popShopping", this.productDetail);
        this.$common.handlerMsgState({
          msg: "取消加购成功",
          type: "warning"
        });
      }
      // 删除购物车样式
      eventBus.$emit("resetMyCart", this.item);
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    // 收藏
    async addCollect(item) {
      if (item.isFavorite) {
        this.$common.handlerMsgState({
          msg: "取消收藏",
          type: "warning"
        });
      } else {
        this.$common.handlerMsgState({
          msg: "收藏成功",
          type: "success"
        });
      }
      item.isFavorite = !item.isFavorite;
      const res = await this.$http.post("/api/CreateProductCollection", {
        productNumber: item.productNumber
      });
      if (res.data.result.code === 200) {
        eventBus.$emit("resetProductCollection", item);
        // 收藏菜单事件
        eventBus.$emit("resetMyCollectionMenu");
      } else {
        item.isFavorite = !item.isFavorite;
        this.$common.handlerMsgState({
          msg: "收藏失败",
          type: "danger"
        });
      }
    },
    // 获取产品详情
    async getProductDetails() {
      const res = await this.$http.post("/api/BearProductByNumberV2", {
        productNumber: this.item.productNumber
      });
      if (res.data.result.code === 200) {
        this.productDetail = res.data.result.item;
        this.productDetail.isShopping = this.item.isShopping;
        console.log(this.productDetail, "产品详情");
        eventBus.$emit("refreshHtml");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {
    eventBus.$emit("showCart", true);
    eventBus.$on("resetProductDetailsCollection", item => {
      if (item.productNumber == this.productDetail.productNumber) {
        this.productDetail.isFavorite = item.isFavorite;
      }
    });
    this.getProductDetails();
  },
  computed: {
    ...mapGetters({
      shoppingList: "myShoppingList"
    })
  },
  beforeDestroy() {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.productDetailWrap {
  .detailBox {
    background-color: #fff;
    display: flex;
    .right {
      padding-top: 30px;
      color: #333333;
      flex: 1;
      box-sizing: border-box;
      padding-right: 25px;
      .context {
        // height: 395px;
        box-sizing: border-box;
        color: #666;
        .productName {
          font-size: 20px;
          color: #333;
          font-weight: bold;
          display: flex;
          align-items: center;
          .newIcon,
          .nowIcon,
          .vipIcon {
            font-size: 14px;
            margin-left: 8px;
            font-weight: 400;
            width: 41px;
            height: 23px;
            line-height: 23px;
            text-align: center;
            display: inline-block;
            background: #ffffff;
            border-radius: 5px;
            vertical-align: middle;
            overflow: hidden;
            &:first-of-type {
              margin-left: 20px;
            }
          }
          .newIcon {
            color: #eb1515;
            border: 1px solid #eb1515;
          }
          .nowIcon {
            color: #f9723e;
            border: 1px solid #f9723e;
          }
          .vipIcon {
            color: #3b33a9;
            border: 1px solid #3b33a9;
          }
        }
        .priceWrap {
          padding: 15px 0;
          box-sizing: border-box;
          .priceBox {
            color: #ff3e3e;
            .price {
              margin-left: 5px;
              font-size: 20px;
              font-weight: bold;
            }
          }
        }
        .textWrap {
          display: flex;
          .left,
          .right {
            padding: 0;
            .itemText {
              line-height: 32px;
            }
          }
          .right {
            margin-left: 50px;
          }
        }
      }
      .myCartBox {
        height: 55px;
        margin-top: 20px;
        display: flex;
        align-items: center;
        .myCart {
          width: 137px;
          height: 40px;
          background: #f9723e;
          border-radius: 5px;
          cursor: pointer;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          .myCartIcon {
            margin-right: 15px;
            width: 18px;
            height: 18px;
            background: url("~@/assets/images/whiteCart.png") no-repeat center;
            background-size: 100% 100%;
          }
        }
        .myShoucang {
          width: 137px;
          height: 40px;
          background: #ffffff;
          border: 1px solid #dcdfe6;
          border-radius: 5px;
          margin-left: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          .shoucangIcon {
            margin-right: 15px;
            width: 18px;
            height: 18px;
            background: url("~@/assets/images/shoucangIcon.png") no-repeat
              center;
            background-size: 100% 100%;
          }
          .shoucangActiveIcon {
            margin-right: 15px;
            width: 18px;
            height: 18px;
            background: url("~@/assets/images/collectionActive.png") no-repeat
              center;
            background-size: 100% 100%;
          }
        }
      }
      .shelfTimeBox {
        margin-top: 20px;
        color: #666;
        p {
          height: 50px;
          display: flex;
          align-items: center;
          border-top: 1px solid #dcdfe6;
          box-sizing: border-box;
          &:last-of-type {
            border-bottom: 1px solid #dcdfe6;
          }
          .stock {
            margin-left: 55px;
            .tockValue {
              color: #ff3e3e;
            }
          }
          .proveIcon {
            width: 16px;
            height: 20px;
            margin: 0 10px;
            background: url("~@/assets/images/proveIcon.png") no-repeat center;
            background-size: contain;
          }
          .proveActiveIcon {
            width: 16px;
            height: 20px;
            margin: 0 10px;
            background: url("~@/assets/images/proveActiveIcon.png") no-repeat
              center;
            background-size: contain;
          }
        }
      }
      .contactMode {
        height: 94px;
        display: flex;
        align-items: center;
        .item {
          margin-right: 30px;
          display: flex;
          align-items: center;
          color: #666;
          cursor: pointer;
          max-width: 150px;
          .context {
            max-width: 110px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          &.myHover {
            cursor: pointer;
          }
          .factoryIcon {
            min-width: 18px;
            width: 18px;
            height: 18px;
            margin-right: 15px;
            background: url("~@/assets/images/sourceIcon.png") no-repeat center;
            background-size: contain;
          }
          .infoIcon {
            min-width: 28px;
            width: 28px;
            height: 28px;
            margin-right: 15px;
            background: url("~@/assets/images/onlineInfoIcon.png") no-repeat
              center;
            background-size: contain;
          }
          .phoneIcon {
            min-width: 28px;
            width: 28px;
            height: 28px;
            margin-right: 15px;
            background: url("~@/assets/images/onlinePhoneIcon.png") no-repeat
              center;
            background-size: contain;
          }
          .sjIcon {
            min-width: 28px;
            width: 28px;
            height: 28px;
            margin-right: 15px;
            background: url("~@/assets/images/sjIcon.png") no-repeat center;
            background-size: contain;
          }
          .qqIcon {
            min-width: 28px;
            width: 28px;
            height: 28px;
            margin-right: 15px;
            background: url("~@/assets/images/QQ.png") no-repeat center;
            background-size: contain;
          }
          .shopIcon {
            min-width: 28px;
            width: 28px;
            height: 28px;
            margin-right: 15px;
            background: url("~@/assets/images/onlineStoreIcon.png") no-repeat
              center;
            background-size: contain;
          }
          &:last-of-type {
            margin: 0;
          }
          &:first-of-type {
            margin-right: 80px;
            color: #333;
            font-weight: 700;
            span {
              max-width: 150px;
            }
          }
        }
      }
      .sourceBox {
        height: 50px;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 20px;
        color: #666;
        .item {
          margin-left: 80px;
          &:first-of-type {
            margin: 0;
          }
        }
      }
    }
    .left {
      padding: 40px;
    }
  }
  .productDetails {
    background-color: #fff;
    padding: 30px;
    .title {
      display: flex;
      align-items: center;
      height: 68px;
      font-size: 15px;
      font-weight: 700;
      border-bottom: 1px solid #e5e5e5;
      padding-left: 15px;
      position: relative;
      &::before {
        width: 4px;
        height: 14px;
        background-color: #3368a9;
        position: absolute;
        left: 0;
        top: 50%;
        content: "";
        transform: translate(0, -50%);
      }
    }
    .content {
      width: 100%;
      .imgItem {
        width: 100%;
        text-align: center;
        img {
          width: 100%;
          object-fit: contain;
        }
      }
    }
  }
}
</style>
