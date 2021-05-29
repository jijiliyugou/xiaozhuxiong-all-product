<template>
  <div class="productDetailWrap">
    <div class="detailBox" v-if="productData">
      <div class="left">
        <magnifierComponent
          ref="magnifierRef"
          v-if="productData.imageUrls"
          :middleImgWidth="541"
          :middleImgHeight="395"
          :thumbnailHeight="55"
          :thumbnailWidth="78"
          :thumbnailCount="5"
          :imageUrls="productData.imageUrls"
          :videoAddress="productData.videoAddress"
        />
      </div>
      <div class="right">
        <div class="context">
          <div class="productName">
            <span>{{
              globalLang === "zh-CN" ? productData.name : productData.ename
            }}</span>
          </div>
          <div class="itemText">
            {{ productLang.price }}：
            <span class="priceBox"
              >{{ userInfo.currencyType
              }}<span class="price">{{ productData.price }}</span></span
            >
          </div>
          <div class="itemText">
            {{ productLang.exFactoryArticleNo }}：<span>{{
              productData.outFactoryNumber
            }}</span>
          </div>
          <div class="itemText">
            {{ productLang.packingMethod }}：<span>{{
              globalLang === "zh-CN"
                ? productData.packMethod
                : productData.ePackMethod
            }}</span>
          </div>
          <div class="itemText">
            {{ productLang.productSpecification }}：
            <span
              >{{ productData.sampleLenth }} x {{ productData.sampleWidth }} x
              {{ productData.sampleHeight }} (cm)</span
            >
          </div>
          <div class="itemText">
            {{ productLang.packageSpecification }}：
            <span
              >{{ productData.innerLenth }} x {{ productData.innerWidth }} x
              {{ productData.innerHeight }} (cm)</span
            >
          </div>
          <div class="itemText">
            {{ productLang.outerBoxSize }}：
            <span
              >{{ productData.outerBoxLenth }} x
              {{ productData.outerBoxWidth }} x
              {{ productData.outerBoxHeight }} (cm)</span
            >
          </div>
          <div class="itemText">
            {{ productLang.packingQuantity }}：
            <span
              >{{ productData.innerEn }} /
              {{ productData.outerBoxLo }} (pcs)</span
            >
          </div>
          <div class="itemText">
            {{ productLang.volumeVolume }}：
            <span
              >{{ productData.outerBoxStere }} (cbm) /
              {{ productData.outerBoxFeet }} (cuft)</span
            >
          </div>
          <div class="itemText">
            {{ productLang.grossNetWeight }}：
            <span
              >{{ productData.outerBoxWeight }} /
              {{ productData.outerBoxNetWeight }} (kg)</span
            >
          </div>
        </div>
        <div class="myCartBox">
          <div class="myCart" @click="handlerShopping(productData)">
            <i class="myCartIcon"></i>
            {{ productLang.addToCart }}
          </div>
        </div>
      </div>
    </div>
    <!-- 相关产品 -->
    <relatedProducts v-if="productData" :keyword="productData.name" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import magnifierComponent from "@/components/magnifierComponent/magnifierComponent.vue";
import relatedProducts from "@/components/relatedProducts/relatedProducts.vue";
export default {
  components: {
    magnifierComponent,
    relatedProducts
  },
  data() {
    return {
      productData: null
    };
  },
  methods: {
    // 加购
    addCart(item) {
      let api = "/api/AddShoppingCart";
      if (item.isShop) {
        api = "/api/RemoveShoppingCart";
      }
      this.$toys
        .post(api, {
          shareID: this.userInfo.shareId,
          customerRemarks: this.userInfo.loginEmail,
          sourceFrom: "share",
          shopType: "customersamples",
          number: 1,
          currency: "￥",
          Price: 0,
          productNumber: item.productNumber,
          shareProductJson: JSON.stringify(item)
        })
        .then(res => {
          if (res.data.result.code === 200) {
            item.isShop = !item.isShop;
            if (item.isShop) {
              this.$message.success("加购成功");
            } else {
              this.$message.warning("取消加购");
            }
            this.$store.commit("handlerShopLength", res.data.result.item);
          } else {
            this.$message.error(res.data.result.msg);
          }
        });
    },
    // 是否加购
    async handlerShopping(item) {
      if (!this.userInfo.loginEmail) {
        this.$prompt("请输入用户名", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(({ value }) => {
            if (value) {
              this.$store.commit("handlerLoginName", value);
              this.addCart(item);
            } else {
              this.$message.error("输入有误");
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
        return false;
      } else if (this.shopLength >= 500) {
        this.$message.error("购物车已满500条");
        return false;
      } else {
        this.addCart(item);
      }
    },
    // 获取产品详情接口
    async getProductDetails() {
      const res = await this.$http.get(
        "/api/WebsiteShare/SearchCompanyShareProductDetailPage?productNumber=" +
          this.$route.query.id +
          "&loginName=" +
          this.userInfo.loginEmail
      );
      const { code, data, message } = res.data.result;
      if (code == 200) {
        this.productData = data;
      } else {
        this.$message.error(message);
      }
    }
  },
  created() {},
  mounted() {
    this.getProductDetails();
  },
  computed: {
    productLang() {
      return this.$t("lang.product");
    },
    publicLang() {
      return this.$t("lang.publicLang");
    },
    ...mapState(["globalLang", "userInfo", "shopLength"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.productDetailWrap {
  .detailBox {
    max-width: 1240px;
    height: 552px;
    margin: 0 auto;
    background-color: #fff;
    display: flex;
    // .left,
    .right {
      max-width: 50%;
      box-sizing: border-box;
    }
    .right {
      padding: 40px 0;
      color: #333333;
      .context {
        height: 395px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-right: 20px;
        box-sizing: border-box;
        .productName {
          max-width: 600px;
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; /* 这里是超出几行省略 */
          overflow: hidden;
          font-size: 24px;
          font-weight: bold;
        }
        .itemText {
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
          font-size: 16px;
          font-weight: 400;
          .priceBox {
            color: #ff3e3e;
            .price {
              margin-left: 5px;
              font-size: 36px;
              font-weight: bold;
            }
          }
        }
      }
      .myCartBox {
        height: 55px;
        margin-top: 20px;
        display: flex;
        align-items: center;
        .myCart {
          width: 170px;
          height: 40px;
          background-color: #ff760e;
          cursor: pointer;
          border-radius: 5px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          .myCartIcon {
            margin-right: 15px;
            width: 18px;
            height: 18px;
            background: url("~@/assets/images/cartIcon.png") no-repeat center;
            background-size: 100% 100%;
          }
        }
      }
    }
    .left {
      padding: 40px;
    }
  }
}
</style>
