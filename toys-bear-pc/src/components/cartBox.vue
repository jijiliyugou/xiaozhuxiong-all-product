<template>
  <transition name="el-zoom-in-top">
    <div class="cartBox">
      <div class="cart" @click="toMyShoppingCart">
        <div class="cartIconBox">
          <el-badge
            class="appBadge"
            :hidden="!myShoppingCartCount || myShoppingCartCount < 1"
            :value="myShoppingCartCount"
          >
            <i class="cartIcon"></i>
          </el-badge>
        </div>
      </div>
      <div class="toTop" @click="toTop">
        <i class="toTopIcon el-icon-top"></i>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import eventBus from "@/assets/js/common/eventBus.js";
export default {
  name: "cartBox",
  computed: {
    ...mapState(["myShoppingCartCount"])
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    // 去购物车
    toMyShoppingCart() {
      const fd = {
        name: "/bsIndex/bsShoppingCart",
        linkUrl: "/bsIndex/bsShoppingCart",
        component: "bsShoppingCart",
        refresh: true,
        label: "购物车"
      };
      this.$router.push("/bsIndex/bsShoppingCart");
      this.$store.commit("myAddTab", fd);
    },
    // 回到顶部
    toTop() {
      eventBus.$emit("toTop");
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.cartBox {
  position: fixed;
  width: 50px;
  height: 120px;
  right: 25px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
  .cart,
  .toTop {
    width: 50px;
    height: 50px;
    position: relative;
    cursor: pointer;
    pointer-events: auto; // 关键点 重要 设置可以点击
  }
  .cart {
    background-color: #ff760e;
    .cartIconBox {
      width: 50px;
      height: 50px;
      position: relative;
      .appBadge {
        width: 20px;
        height: 20px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .cartIcon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: block;
        width: 20px;
        height: 20px;
        background: url("~@/assets/images/whiteCart.png") no-repeat center;
        background-size: 100% 100%;
      }
      @{deep} .el-badge__content {
        top: -10px;
        background-color: #fff;
        color: #ff760e;
        border: 1px solid #ff760e;
      }
    }
  }
  .toTop {
    background-color: rgba(0, 0, 0, 0.5);
    .toTopIcon {
      width: 20px;
      height: 20px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 20px;
    }
  }
}
</style>
