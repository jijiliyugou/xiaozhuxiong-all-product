<template>
  <div
    id="app"
    class="rootApp"
    v-loading="$store.state.AppLoading"
    element-loading-spinner
    element-loading-background="rgba(200, 200, 200, 0.5)"
  >
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- 返回按钮 -->
    <div
      class="goBack"
      @click="goToBack"
      v-if="$route.path !== '/login' && $route.path !== '/index/home'"
    >
      <i class="iconfont icon-fanhui"></i>
    </div>
    <!-- 漂浮物 -->
    <div class="cartBox" v-if="$route.path !== '/login'">
      <div class="cart" @click="toMyShoppingCart">
        <div class="cartIconBox">
          <el-badge :hidden="shopLength < 1" :value="shopLength" class="item">
            <i class="cartIcon"></i>
          </el-badge>
        </div>
      </div>
      <div class="toTop" @click="toTop">
        <i class="toTopIcon el-icon-top"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  methods: {
    // 回到顶部
    toTop() {
      $("#app").animate({ scrollTop: 0 }, 100);
    },
    // 返回上一步
    goToBack() {
      this.$router.go(-1);
      // if (this.$route.path.includes("productDetails")) {
      //   this.$root.eventHub.$emit("resetRelatedProducts");
      // }
    },
    // 去购物车
    toMyShoppingCart() {
      this.$router.push("/index/shoppingCart");
    }
  },
  watch: {
    globalLang(val) {
      console.log(val);
      this.$i18n.locale = val;
    }
  },
  computed: {
    ...mapState(["userInfo", "globalLang", "shopLength"])
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
#app {
  width: 100%;
  height: 100%;
  background: #f1f1f1;
}
@{deep} .el-loading-spinner .circular {
  width: 100px;
  height: 100px;
  animation: loading-rotate 2s linear infinite;
  display: none;
}
@{deep} .el-loading-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
@{deep} .el-loading-spinner {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: url("~@/assets/images/loadding.gif") no-repeat center center;
  background-size: 200px 200px;
  width: 100%;
  height: 100%;
}
.goBack {
  position: fixed;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  width: 50px;
  height: 50px;
  right: 265px;
  top: 200px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cartBox {
  position: fixed;
  width: 50px;
  height: 120px;
  right: 265px;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
      .el-badge {
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
        background: url("~@/assets/images/cartIcon.png") no-repeat center;
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
@media screen and (max-width: 1700px) {
  .cartBox {
    right: 120px;
  }
  .goBack {
    right: 120px;
  }
}
@media screen and (max-width: 1280px) {
  .cartBox {
    right: 0px;
  }
  .goBack {
    right: 0px;
  }
}
</style>
