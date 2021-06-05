<template>
  <div class="item" @click.stop="toDetails(item)">
    <div class="left">
      <div class="imgBox">
        <el-image
          style="width: 100%;height: 100%;"
          lazy
          :src="item.imageUrls && item.imageUrls[0]"
          fit="contain"
        >
          <div slot="placeholder" class="image-slot">
            <img :src="require('@/assets/images/errorImg.png')" />
          </div>
          <div slot="error" class="image-slot">
            <img :src="require('@/assets/images/errorImg.png')" />
          </div>
        </el-image>
        <div class="newIcon" v-if="item.isNew"></div>
      </div>
      <div class="priceBox">
        <div class="leftPrice" v-if="shareInfo.isShowPrice">
          <span class="currency">{{ userInfo.currencyType }}</span>
          <span class="price">{{ item.price }}</span>
        </div>
        <div
          class="myCart"
          @click.stop="handlerShopping(item)"
          v-if="!item.isShop"
        ></div>
        <div
          class="activeCartIcon"
          @click.stop="handlerShopping(item)"
          v-else
        ></div>
      </div>
    </div>
    <div class="right">
      <div class="productName">
        <span>{{ globalLang === "zh-CN" ? item.name : item.ename }}</span>
      </div>
      <div class="itemText" v-if="shareInfo.showNumber == 1">
        {{ productLang.exFactoryArticleNo }}：<span>{{
          item.commodityNumber
        }}</span>
      </div>
      <div class="itemText" v-else-if="shareInfo.showNumber == 2">
        {{ productLang.exFactoryArticleNo }}：<span>{{
          item.productNumber
        }}</span>
      </div>
      <div class="itemText" v-else-if="shareInfo.showNumber == -1"></div>
      <div class="itemText" v-else>
        {{ productLang.exFactoryArticleNo }}：<span>{{
          item.outFactoryNumber
        }}</span>
      </div>
      <div class="itemText">
        {{ productLang.packingMethod }}：<span>{{
          globalLang === "zh-CN" ? item.packMethod : item.ePackMethod
        }}</span>
      </div>
      <div class="itemText">
        {{ productLang.productSpecification }}：<span
          >{{ item.sampleLenth }} x {{ item.sampleWidth }} x
          {{ item.sampleHeight }} (cm)</span
        >
      </div>
      <div class="itemText">
        {{ productLang.packageSpecification }}：<span
          >{{ item.innerLenth }} x {{ item.innerWidth }} x
          {{ item.innerHeight }} (cm)</span
        >
      </div>
      <div class="itemText">
        {{ productLang.outerBoxSize }}：<span
          >{{ item.outerBoxLenth }} x {{ item.outerBoxWidth }} x
          {{ item.outerBoxHeight }} (cm)</span
        >
      </div>
      <div class="itemText">
        {{ productLang.packingQuantity }}：<span
          >{{ item.innerEn }} / {{ item.outerBoxLo }} (pcs)</span
        >
      </div>
      <div class="itemText">
        {{ productLang.volumeVolume }}：
        <span>
          {{ item.outerBoxStere }} (cbm) / {{ item.outerBoxFeet }} (cuft)
        </span>
      </div>
      <div class="itemText">
        {{ productLang.grossNetWeight }}：<span
          >{{ item.outerBoxWeight }} / {{ item.outerBoxNetWeight }} (kg)</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    item: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Object | Number,
      default: 0
    }
  },
  data() {
    return {};
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
              this.$message.success(this.publicLang.successfulPurchase);
            } else {
              this.$message.warning(this.publicLang.cancelSuccessfully);
            }
            this.$store.commit("handlerShopLength", res.data.result.item);
            this.$forceUpdate();
          } else {
            this.$message.error(res.data.result.msg);
          }
        });
    },
    // 是否加购
    async handlerShopping(item) {
      if (!this.userInfo.loginEmail) {
        this.$prompt(this.publicLang.pleaseEnterContact, this.publicLang.tips, {
          confirmButtonText: this.publicLang.determine,
          cancelButtonText: this.publicLang.cancel
        })
          .then(({ value }) => {
            if (value) {
              this.$root.eventHub.$emit("resetAll");
              this.$store.commit("handlerLoginName", value);
              // 重新登录
              const fd = JSON.parse(JSON.stringify(this.formLabelAlign));
              fd.email = value;
              console.log(fd);
              this.$http.post("/api/Account/CompanyShareLogin", fd);
              this.addCart(item);
            } else {
              this.$message.error(this.publicLang.incorrectInput);
            }
          })
          .catch(() => {
            // this.$message({
            //   type: "info",
            //   message: "取消输入"
            // });
          });
        return false;
      } else if (this.shopLength >= 500) {
        this.$message.error(this.publicLang.theShoppingCartIsFull);
        return false;
      } else {
        this.addCart(item);
      }
    },
    // 查看详情
    toDetails(item) {
      if (this.$route.path.includes("productDetails")) {
        this.$router.push({
          path: "/productDetails",
          query: {
            id: item.productNumber
          }
        });
      } else {
        this.$router.push({
          path: "/productDetails",
          query: {
            id: item.productNumber
          }
        });
      }
    }
  },
  created() {},
  computed: {
    productLang() {
      return this.$t("lang.product");
    },
    publicLang() {
      return this.$t("lang.publicLang");
    },
    ...mapState([
      "globalLang",
      "shopLength",
      "userInfo",
      "formLabelAlign",
      "shareInfo"
    ])
  }
};
</script>
<style scoped lang="less">
@import "./listProductItem.less";
</style>
