<template>
  <div class="newProductListBox">
    <div class="content">
      <div class="title">
        <span class="titleText">{{ productLang.newProductArea }}</span>
        <span class="more" @click="toProducts">
          <span class="text">{{ productLang.more }}</span>
          <i class="icon el-icon-d-arrow-right"></i>
        </span>
      </div>
      <div class="productsBox">
        <gonggeProductItemMb
          v-for="(item, i) in products"
          :key="i"
          :item="item"
        />
        <div class="kong"></div>
        <div class="kong"></div>
        <div class="kong"></div>
        <div class="kong"></div>
      </div>
    </div>
  </div>
</template>

<script>
import gonggeProductItemMb from "@/components/gonggeProductItem/gonggeProductItemMb.vue";
export default {
  name: "newProductListMb",
  components: {
    gonggeProductItemMb
  },
  props: {
    products: {
      type: Array
    }
  },
  data() {
    return {};
  },
  methods: {
    // 查看更多
    toProducts() {
      window.localStorage.setItem("nowActive", "/index/product");
      this.$router.push({ path: "/index/product", query: { productType: 2 } });
    }
  },
  mounted() {},
  computed: {
    productLang() {
      return this.$t("lang.product");
    }
  }
};
</script>

<style lang="less" scoped>
.newProductListBox {
  background-color: #f1f1f1;
  .content {
    width: 100%;
    margin: 0 auto;
    background-color: #fff;
    padding: 2.5%;
    box-sizing: border-box;
    .title {
      padding-bottom: 15px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .titleText {
        padding-left: 20px;
        position: relative;
        &::before {
          position: absolute;
          content: "";
          width: 5px;
          height: 20px;
          background: #ff760e;
          left: 0;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
      .more {
        width: 90px;
        height: 29px;
        background: #ffffff;
        border: 1px solid #d2d2d2;
        border-radius: 120px;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        cursor: pointer;
        .text {
          margin-top: -5px;
        }
        .icon {
          margin-left: 5px;
          font-size: 12px;
          vertical-align: bottom;
          font-weight: bold;
        }
      }
    }
    .productsBox {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      position: relative;
      .kong {
        width: 285px;
      }
    }
  }
}
</style>
