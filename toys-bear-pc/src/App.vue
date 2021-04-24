<template>
  <div
    id="app"
    v-loading="$store.state.AppLoading"
    element-loading-spinner
    text="加载中..."
    element-loading-background="rgba(0, 0, 0, 0.2)"
  >
    <transition name="el-zoom-in-top">
      <message-component
        id="myGlobalMsg"
        :type="msgType"
        :msg="globalMsg"
        v-if="showGlobalMsg"
      ></message-component>
    </transition>
    <router-view ref="bsIndex" />
    <!-- 漂浮物 -->
    <transition name="el-zoom-in-top">
      <div class="cartBox" v-show="isShowCartBox">
        <div class="cart" @click="toMyShoppingCart">
          <div class="cartIconBox">
            <el-badge
              :hidden="!shoppingList || shoppingList.length < 1"
              :value="shoppingList && shoppingList.length"
              class="item"
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
    <!-- 进度条 -->
    <div class="jindutiaoBox" v-show="isJindu">
      <div class="jindutiao"></div>
    </div>
  </div>
</template>
<script>
import eventBus from "@/assets/js/common/eventBus.js";
import { mapGetters, mapState } from "vuex";
const cubic = value => Math.pow(value, 3);
const easeInOutCubic = value =>
  value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;
export default {
  data() {
    return {
      isShowCartBox: false,
      myScrollTop: 0,
      timeID: null
    };
  },
  computed: {
    ...mapState(["isJindu"]),
    ...mapState(["confirmType"]),
    ...mapState(["dialogVisible"]),
    ...mapState(["dialogTitle"]),
    ...mapState(["userInfo"]),
    ...mapState(["showGlobalMsg"]),
    ...mapState(["msgType"]),
    ...mapState(["globalMsg"]),
    ...mapGetters({
      shoppingList: "myShoppingList"
    })
  },
  mounted() {
    this.$store.commit("handlerShowGlobalMsg", false);
    this.$store.commit("handlerIsJindu", false);
    eventBus.$on("showCart", flag => {
      this.isShowCartBox = flag;
    });
    eventBus.$on("toTop", () => {
      this.toTop();
    });
  },
  methods: {
    // 使用的地方
    handleShowConfirm() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "点击确认的回调!"
          });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "点击取消或删除的回调"
          });
        });
    },
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
      this.$refs.bsIndex.$refs.myScrollbar.forEach(val => {
        const el = val;
        const beginTime = Date.now();
        const beginValue = el.scrollTop;
        const rAF =
          window.requestAnimationFrame || (func => setTimeout(func, 16));
        const frameFunc = () => {
          const progress = (Date.now() - beginTime) / 500;
          if (progress < 1) {
            el.scrollTop = beginValue * (1 - easeInOutCubic(progress));
            rAF(frameFunc);
          } else {
            el.scrollTop = 0;
          }
        };
        rAF(frameFunc);
      });
    }
  }
};
</script>
<style lang="less" scoped>
// #app {
//   width: 1920px;
// }
@deep: ~">>>";
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
  z-index: 9999;
}
@{deep} .el-loading-spinner {
  z-index: 9999;
  position: fixed;
  width: 100px;
  height: 100px;
  margin-left: -50px;
  margin-top: -50px;
  border-radius: 8px;
  overflow: hidden;
  left: 50%;
  top: 50%;
  background: url("~@/assets/images/loadding.gif") no-repeat center center;
  .circular {
    border-radius: 50%;
  }
}
#app {
  position: relative;
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
}
.jindutiaoBox {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.2);
  .jindutiao {
    width: 200px;
    height: 100px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: url("~@/assets/images/jindutiaoIcon.gif") no-repeat center;
    background-size: contain;
  }
}
</style>
