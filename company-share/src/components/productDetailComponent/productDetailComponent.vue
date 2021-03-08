<template>
  <div class="productDetailWrap">
    <div class="detailBox">
      <div class="left">
        <magnifierComponent
          ref="magnifierRef"
          v-if="productDetails.imageUrls"
          :middleImgWidth="541"
          :middleImgHeight="395"
          :thumbnailHeight="55"
          :thumbnailWidth="78"
          :thumbnailCount="5"
          :imageUrls="productDetails.imageUrls"
          :videoAddress="productDetails.videoAddress"
        />
      </div>
      <div class="right">
        <div class="context">
          <div class="productName">
            <span>{{
              globalLang === "zh-CN"
                ? productDetails.name
                : productDetails.ename
            }}</span>
          </div>
          <div class="itemText">
            {{ productLang.price }}：
            <span class="priceBox"
              >{{ userInfo.currencyType
              }}<span class="price">{{ productDetails.price }}</span></span
            >
          </div>
          <div class="itemText">
            {{ productLang.exFactoryArticleNo }}：<span>{{
              productDetails.outFactoryNumber
            }}</span>
          </div>
          <div class="itemText">
            {{ productLang.packingMethod }}：<span>{{
              globalLang === "zh-CN"
                ? productDetails.packMethod
                : productDetails.ePackMethod
            }}</span>
          </div>
          <div class="itemText">
            {{ productLang.productSpecification }}：
            <span
              >{{ productDetails.sampleLenth }} x
              {{ productDetails.sampleWidth }} x
              {{ productDetails.sampleHeight }} (cm)</span
            >
          </div>
          <div class="itemText">
            {{ productLang.packageSpecification }}：
            <span
              >{{ productDetails.innerLenth }} x
              {{ productDetails.innerWidth }} x
              {{ productDetails.innerHeight }} (cm)</span
            >
          </div>
          <div class="itemText">
            {{ productLang.outerBoxSize }}：
            <span
              >{{ productDetails.outerBoxLenth }} x
              {{ productDetails.outerBoxWidth }} x
              {{ productDetails.outerBoxHeight }} (cm)</span
            >
          </div>
          <div class="itemText">
            {{ productLang.packingQuantity }}：
            <span
              >{{ productDetails.innerEn }} /
              {{ productDetails.outerBoxLo }} (pcs)</span
            >
          </div>
          <div class="itemText">
            {{ productLang.volumeVolume }}：
            <span
              >{{ productDetails.outerBoxStere }} (cbm) /
              {{ productDetails.outerBoxFeet }} (cuft)</span
            >
          </div>
          <div class="itemText">
            {{ productLang.grossNetWeight }}：
            <span
              >{{ productDetails.outerBoxWeight }} /
              {{ productDetails.outerBoxNetWeight }} (kg)</span
            >
          </div>
        </div>
        <div class="myCartBox">
          <div class="myCart" @click="handlerShopping(productDetails)">
            <i class="myCartIcon"></i>
            {{ productLang.addToCart }}
          </div>
        </div>
      </div>
    </div>
    <!-- 相关产品 -->
    <relatedProducts :keyword="productDetails.name" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import magnifierComponent from "@/components/magnifierComponent/magnifierComponent.vue";
import relatedProducts from "@/components/relatedProducts/relatedProducts.vue";
export default {
  props: {
    item: {
      type: Object
    }
  },
  components: {
    magnifierComponent,
    relatedProducts
  },
  data() {
    return {
      productDetails: null
    };
  },
  methods: {
    // 加购
    handlerShopping(item) {
      item.isShopping = !item.isShopping;
      if (item.isShopping) {
        item.shoppingCount = 1;
        this.$store.commit("pushShopping", item);
        this.$message.closeAll();
        this.$message.success(this.publicLang.successfulPurchase);
      } else {
        item.shoppingCount = 0;
        this.$message.closeAll();
        this.$store.commit("popShopping", item);
        this.$message.warning(this.publicLang.cancelSuccessfully);
      }
    }
  },
  created() {
    this.productDetails = JSON.parse(
      window.sessionStorage.getItem("currentProductDetails")
    );
  },
  mounted() {},
  computed: {
    productLang() {
      return this.$t("lang.product");
    },
    publicLang() {
      return this.$t("lang.publicLang");
    },
    ...mapState(["globalLang"]),
    ...mapState(["userInfo"]),
    ...mapGetters({
      shoppingList: "myShoppingList"
    })
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
