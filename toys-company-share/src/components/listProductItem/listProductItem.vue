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
        <div class="leftPrice">
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
      <div class="itemText">
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
              this.$message.success("加购成功");
            } else {
              this.$message.warning("取消加购");
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
    ...mapState(["globalLang", "shopLength", "userInfo"])
  }
};
</script>
<style scoped lang="less">
@import "./listProductItem.less";
</style>
