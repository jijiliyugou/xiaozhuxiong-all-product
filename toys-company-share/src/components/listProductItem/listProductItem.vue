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
          v-if="!item.isShopping"
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
      this.$forceUpdate();
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
  mounted() {
    this.$root.eventHub.$on("resetProductsItem", () => {
      this.$forceUpdate();
    });
  },
  beforeDestroy() {
    // this.$root.eventHub.$off("resetProductsItem");
  },
  created() {},
  computed: {
    productLang() {
      return this.$t("lang.product");
    },
    publicLang() {
      return this.$t("lang.publicLang");
    },
    ...mapState(["globalLang"]),
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@import "./listProductItem.less";
</style>
