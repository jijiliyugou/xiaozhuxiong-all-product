<template>
  <div
    id="app"
    class="rootApp"
    v-cloak
    v-loading="$store.state.AppLoading"
    element-loading-spinner
    element-loading-background="rgba(200, 200, 200, 0.5)"
    @mousewheel="mousewheel"
  >
    <router-view v-cloak />
    <el-backtop target=".rootApp" :bottom="50" :right="150">
      <div
        style="display:flex;flexWrap:wrap;alignContent:flex-start;justifyContent:center; alignItems:center;"
      >
        <i class="el-icon-caret-top" style="marginTop:-5px;"></i>
        <span style="fontSize:12px;marginTop:-5px;">
          顶部
        </span>
      </div>
    </el-backtop>
    <!-- 漂浮物 -->
    <!-- <div
      class="cartBox"
      v-if="
        !$route.path.includes('/login') &&
          !$route.path.includes('/erp') &&
          userInfo &&
          userInfo.commparnyList &&
          userInfo.commparnyList[0].companyType === 'Sales'
      "
    >
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
    </div> -->
  </div>
</template>
<script>
import { getMenuFuc } from "@/router/index";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      // im: new this.IM(),
      appHeight: document.documentElement.clientHeight,
      options: {
        // 二维码配置
        url: "https://www.toysbear.com/app_download.html",
        icon: require("@/assets/images/logo.png")
      }
    };
  },
  methods: {
    // 去购物车
    toMyShoppingCart() {
      this.$router.push("/shoppingCart");
    },
    // 初始化IM
    // initIM() {
    //   this.im.login(
    //     this.loginIMState,
    //     this.newChatList,
    //     this.newMessage,
    //     this.groupChat
    //   );
    //   this.im.$IM
    //     .connect({
    //       token:
    //         "IhWfv3yo2pfxnKMq8uThDPKy+4B8wH9zbo7JCg51TcBdiZ2vJ2fR/RGP9GkKO8HRTh0p2e3OF4N9qUCAGhKHow==@pm5y.cn.rongnav.com;pm5y.cn.rongcfg.com"
    //     })
    //     .then(user => {
    //       console.log("链接成功, 链接用户 id 为: ", user.id);
    //     })
    //     .catch(error => {
    //       console.log("链接失败: ", error.code, error.msg);
    //     });
    // },
    // IM链接状态回调
    // loginIMState(val) {
    //   console.log(val);
    // },
    // 最新聊天会话列表
    // newChatList(list) {
    //   console.log(list);
    // },
    // // 接收到新消息
    // newMessage(msg) {
    //   console.log(msg);
    // },
    // // 群聊
    // groupChat(msg) {
    //   console.log(msg);
    // },
    mousewheel(e) {
      if (this.$store.state.AppLoading) e.preventDefault();
    },
    prohibit() {
      // 禁用鼠标右击、F12
      document.oncontextmenu = function() {
        return false;
      };
      document.onkeydown = function(e) {
        if (
          e.ctrlKey &&
          (e.keyCode === 73 ||
            e.keyCode === 74 ||
            e.keyCode === 80 ||
            e.keyCode === 83 ||
            e.keyCode === 85 ||
            e.keyCode === 117)
        ) {
          return false;
        }
        if (e.keyCode === 18 || e.keyCode === 123) {
          return false;
        }
      };
    }
  },
  async created() {
    await getMenuFuc();
    // this.prohibit();
  },
  mounted() {
    // if (this.uid) this.initIM();
  },
  watch: {
    // uid(newV) {
    //   if (newV) this.initIM();
    //   else this.im.$IM.disconnect().then(() => console.log("断开链接成功"));
    // }
  },
  computed: {
    uid() {
      return this.$store.state.isLogin && this.$store.state.userInfo.uid;
    },
    ...mapGetters({
      shoppingList: "myShoppingList"
    }),
    ...mapState(["userInfo"])
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
[v-cloak] {
  display: none;
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
  background-size: 100px 100px;
  width: 100%;
  height: 100%;
}
.cartBox {
  position: fixed;
  width: 50px;
  height: 120px;
  right: 200px;
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
    right: 30px;
  }
}
</style>
