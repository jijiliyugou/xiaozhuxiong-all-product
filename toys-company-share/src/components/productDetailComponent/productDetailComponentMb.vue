<template>
  <div class="productDetailWrap">
    <div class="detailBox" v-if="productData">
      <div
        class="three_d"
        @click="show_mobile_modal"
        @tap="show_mobile_modal"
        v-if="productData.threeDimensional"
      >
        {{ is_show_pc_modal ? "图片展示" : "3D展示" }}
      </div>
      <el-carousel trigger="click" height="264px" :autoplay="false">
        <el-carousel-item
          v-for="(item, index) in productData.imgUrlList"
          :key="index"
        >
          <video
            v-if="item.type === 'video'"
            class="video"
            controls
            poster=""
            :src="item.image"
            object-fit="cover"
          ></video>
          <el-image
            v-else
            style="width: 100%; height: 264px"
            :src="item.image"
            fit="fit"
          ></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="mobile_content">
      <div class="item active">
        {{ globalLang === "zh-CN" ? productData.name : productData.ename }}
      </div>
      <div class="item">
        <label class="label">{{ productLang.price }}:</label
        ><span class="red_color text"
          >{{ userInfo.currencyType }}{{ productData.price || 0 }}</span
        >
      </div>
      <div class="item">
        <label class="label">{{ productLang.exFactoryArticleNo }}：</label
        ><span class="text">{{ productData.commodityNumber }}</span>
      </div>
      <div class="item">
        <label class="label">{{ productLang.packingMethod }}：</label>
        <span class="text">{{
          globalLang === "zh-CN"
            ? productData.packMethod
            : productData.ePackMethod
        }}</span>
      </div>
      <div class="item">
        <label class="label">{{ productLang.productSpecification }}：</label
        ><span class="text"
          >{{ productData.sampleLenth }} x {{ productData.sampleWidth }} x
          {{ productData.sampleHeight }} (cm)</span
        >
      </div>
      <div class="item">
        <label class="label">{{ productLang.packageSpecification }}：</label
        ><span class="text"
          >{{ productData.innerLenth }} x {{ productData.innerWidth }} x
          {{ productData.innerHeight }} (cm)</span
        >
      </div>
      <div class="item">
        <label class="label">{{ productLang.outerBoxSize }}：</label
        ><span class="text"
          >{{ productData.outerBoxLenth }} x {{ productData.outerBoxWidth }} x
          {{ productData.outerBoxHeight }} (cm)</span
        >
      </div>
      <div class="item">
        <label class="label">{{ productLang.packingQuantity }}：</label
        ><span class="text"
          >{{ productData.innerEn }} / {{ productData.outerBoxLo }} (pcs)</span
        >
      </div>
      <div class="item">
        <label class="label">{{ productLang.volumeVolume }}：</label
        ><span class="text"
          >{{ productData.outerBoxStere }} (cbm) /
          {{ productData.outerBoxFeet }} (cuft)</span
        >
      </div>
      <div class="item">
        <label class="label">{{ productLang.grossNetWeight }}：</label
        ><span class="text"
          >{{ productData.outerBoxWeight }} /
          {{ productData.outerBoxNetWeight }} (kg)</span
        >
      </div>
      <div class="item cart_box">
        <div class="myCart" @click="handlerShopping(productData)">
          <i class="myCartIcon"></i>
          {{ productLang.addToCart }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "productDetailComponentMb",
  components: {},
  data() {
    return {
      productData: null,
      is_show_pc_modal: false //是否显示3d
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
          customerRemarks: this.customerInfo.id,
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
              this.$message.success(this.publicLang.successfulPurchase);
            } else {
              this.$message.warning(this.publicLang.cancelSuccessfully);
            }
            this.$store.commit("handlerShopLength", res.data.result.item);
          } else {
            this.$message.error(res.data.result.msg);
          }
        });
    },
    // 是否加购
    async handlerShopping(item) {
      if (this.shopLength >= 500) {
        this.$message.error(this.publicLang.theShoppingCartIsFull);
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
          this.customerInfo.id
      );
      const { code, data, message } = res.data.result;
      if (code == 200) {
        this.productData = data;
        this.dealImgUrl();
      } else {
        this.$message.error(message);
      }
    },
    dealImgUrl() {
      var imgs = [];
      if (this.productData.videoAddress) {
        var obj = {
          type: "video",
          image: this.productData.videoAddress
          //image: 'http://124.71.6.26:8087/ProductVideo//2021-06-16/16238386673791720266.mp4'
        };
        imgs.push(obj);
      }
      for (var i = 0; i < this.productData.imageUrls.length; i++) {
        var obj2 = {
          type: "img",
          image: this.productData.imageUrls[i]
        };
        imgs.push(obj2);
      }
      this.$set(this.productData, "imgUrlList", imgs);
    },
    //移动端端3d显示
    show_mobile_modal() {
      if (this.productData.threeDimensional) {
        this.is_show_pc_modal = this.is_show_pc_modal ? false : true;
      } else {
        this.$refs.uToast.show({
          title: "该产品暂无3D数据！",
          type: "error"
        });
      }
    }
  },
  created() {
    this.getProductDetails();
  },
  mounted() {
    // this.getProductDetails();
  },
  computed: {
    productLang() {
      return this.$t("lang.product");
    },
    publicLang() {
      return this.$t("lang.publicLang");
    },
    ...mapState([
      "globalLang",
      "userInfo",
      "shopLength",
      "formLabelAlign",
      "shareInfo",
      "customerInfo"
    ])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.productDetailWrap {
  .detailBox {
    background-color: #fff;
    position: relative;
    .video {
      width: 100%;
      height: 100%;
    }
    .three_d {
      position: absolute;
      width: 70px;
      height: 30px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 30px;
      text-align: center;
      top: 10px;
      right: 10px;
      line-height: 30px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 12px;
    }
  }
  .mobile_content {
    background-color: #ffffff;
    padding-top: 20px;
    padding-bottom: 60px;
    .active {
      font-weight: 700;
      font-size: 16px;
    }
    min-height: 280px;
    .cart_box {
      height: 32px;
    }
    .item {
      padding: 7.5px 30px 7.5px 30px;
      font-size: 16px;
      // height: 30px;
      // line-height: 30px;
      .label {
        width: 170px;
        // text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 12px;
        color: #333;
        line-height: 30px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
      }
      .text {
        line-height: 30px;
        position: relative;
        font-size: 12px;
      }
      .myCart {
        width: 170px;
        height: 32px;
        background-color: #ff760e;
        cursor: pointer;
        border-radius: 5px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        float: right;
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
  .red_color {
    color: #fa3534 !important;
  }
}
</style>
