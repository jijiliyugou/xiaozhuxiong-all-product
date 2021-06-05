<template>
  <div class="item" @click.stop="toDetails(item)">
    <div class="itemImg">
      <el-image
        style="width:281px;height:199px;"
        fit="contain"
        :src="item.imageUrls && item.imageUrls[0]"
        lazy
      >
        <div slot="placeholder" class="image-slot">
          <img :src="require('@/assets/images/errorImg.png')" />
        </div>
        <div slot="error" class="image-slot">
          <img :src="require('@/assets/images/errorImg.png')" />
        </div>
      </el-image>
      <div class="newIconBox" v-if="item.isNew"></div>
    </div>
    <div class="context">
      <div class="productName">
        <span>{{ globalLang === "zh-CN" ? item.name : item.ename }}</span>
      </div>
      <div class="priceBox">
        <div class="left">
          <span v-if="shareInfo.isShowPrice">{{ userInfo.currencyType }}</span>
          <span v-if="shareInfo.isShowPrice" class="price">
            {{ item.price }}
          </span>
        </div>
        <div class="right">
          <div
            class="cartIconBox kongCartIcon"
            @click.stop="handlerShopping(item)"
            v-if="!item.isShop"
          ></div>
          <div
            class="cartIconBox activeCartIcon"
            @click.stop="handlerShopping(item)"
            v-else
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    // 加购
    addCart(item) {
      console.log(item);
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
        this.$root.eventHub.$emit("resetRelatedProducts");
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
  mounted() {
    this.$root.eventHub.$on("resetShop", item => {
      if (item.productNumber === this.item.productNumber) {
        this.item.isShop = item.isShop;
        this.$forceUpdate();
      }
    });
  },
  computed: {
    ...mapState([
      "globalLang",
      "userInfo",
      "shopLength",
      "formLabelAlign",
      "shareInfo"
    ]),
    publicLang() {
      return this.$t("lang.publicLang");
    }
  }
};
</script>
<style scoped lang="less">
.item {
  width: 283px;
  // height: 290px;
  background: #ffffff;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  cursor: pointer;
  .itemImg {
    position: relative;
    .newIconBox {
      position: absolute;
      width: 40px;
      height: 40px;
      left: 0;
      top: 0;
      background: url("~@/assets/images/newIcon.png") no-repeat center;
      background-size: 100% 100%;
    }
    .el-image {
      width: 281px;
      height: 199px;
      img {
        width: 281px;
        height: 199px;
        object-fit: contain;
        image-rendering: -moz-crisp-edges;
        image-rendering: -o-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
      }
    }
  }
  .context {
    // height: 90px;
    padding: 0 18px;
    padding-bottom: 10px;
    // box-sizing: border-box;
    .productName {
      font-size: 16px;
      color: #000;
      margin-top: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .priceBox {
      margin-top: 5px;
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        color: #ff3e3e;
        font-size: 14px;
        .price {
          font-size: 20px;
          font-weight: bold;
          margin-left: 10px;
        }
      }
      .right {
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        .cartIconBox {
          width: 36px;
          height: 36px;
          cursor: pointer;
          &.kongCartIcon {
            background: url("~@/assets/images/kongCartIcon.png") no-repeat
              center;
            background-size: 100% 100%;
          }
          &.activeCartIcon {
            background: url("~@/assets/images/activeCartIcon.png") no-repeat
              center;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
}
</style>
