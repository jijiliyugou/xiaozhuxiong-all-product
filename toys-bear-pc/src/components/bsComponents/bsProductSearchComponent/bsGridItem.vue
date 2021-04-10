<template>
  <div class="bsGridItem">
    <div class="itemImg" @click="toProductDetails">
      <el-image
        style="width:222px;height:166px;"
        fit="contain"
        :src="item.img"
        lazy
      >
        <div slot="placeholder" class="image-slot">
          <img :src="require('@/assets/images/imgError.png')" />
        </div>
        <div slot="error" class="image-slot">
          <img :src="require('@/assets/images/imgError.png')" />
        </div>
      </el-image>
      <div
        class="spotProductIcon"
        v-if="$route.path === '/bsIndex/bsSpotProducts'"
      ></div>
      <div
        class="newProductIcon"
        v-if="$route.path === '/bsIndex/bsLatestProducts'"
      ></div>
      <div
        class="vipProductIcon"
        v-if="$route.path === '/bsIndex/bsVIPProducts'"
      ></div>
      <div
        class="vipProductIcon"
        v-if="$route.path === '/bsIndex/bsVIPProducts'"
      ></div>
      <i
        v-show="item.isFavorite"
        class="iconClient iconfont icon-wujiaoxing-"
        @click.stop="addCollect(item)"
      ></i>
      <i
        v-show="!item.isFavorite"
        class="iconClient iconfont icon-wujiaoxingkong"
        @click.stop="addCollect(item)"
      ></i>
    </div>
    <div class="content">
      <div class="productName">
        {{ item.name }}
      </div>
      <div class="addCartBox">
        <div class="left">
          <p class="item">
            <span class="title">参考单价：</span>
            <template v-if="item.isIntegral">
              <span class="price">{{ item.cu_de }}</span>
              <span class="price">{{ item.price }}</span>
            </template>
            <template v-else>
              <span class="price lookPrice">积分查看</span>
            </template>
          </p>
          <p class="item">
            <span class="title">出厂货号：</span>
            <span>{{ item.fa_no }}</span>
          </p>
        </div>
        <div class="right" @click.stop="handlerShopping(item)">
          <i v-if="item.isShopping" class="shoppingCartActive"></i>
          <i v-else class="shoppingCart"></i>
        </div>
      </div>
      <div class="sourceBox" @click="toFactory(item)">
        <i class="sourceIcon"></i>
        <template v-if="item.isIntegral">
          <span class="text">
            {{ item.supplierName }}
          </span>
        </template>
        <template v-else>
          <span class="text">
            {{ item.exhibitionName }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from "@/assets/js/common/eventBus";
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
    // 去产品详情页
    async toProductDetails() {
      const fd = {
        name: this.item.productNumber,
        linkUrl: "/bsIndex/bsProductSearchIndex",
        component: "bsProductDetails",
        refresh: true,
        label: this.item.fa_no || "产品详情",
        value: this.item
      };
      this.$store.commit("myAddTab", fd);
    },
    // 去厂商详情页
    async toFactory(item) {
      const fd = {
        name: item.supplierNumber,
        linkUrl: "/bsIndex/bsVendorQuery",
        component: "bsMyClientsDetail",
        refresh: true,
        noPush: true,
        label: item.supplierName,
        value: {
          companyNumber: item.supplierNumber,
          companyLogo: item.supplierPersonnelLogo,
          companyName: item.supplierName,
          contactsMan: item.supplierPersonnelName,
          phoneNumber: item.supplierPhone,
          address: item.supplierAddres || item.supplierAddress
        }
      };
      this.$router.push("/bsIndex/bsVendorQuery");
      this.$store.commit("myAddTab", fd);
    },
    // 收藏
    async addCollect(item) {
      const res = await this.$http.post("/api/CreateProductCollection", {
        productNumber: item.productNumber
      });
      if (res.data.result.code === 200) {
        if (item.isFavorite) {
          this.$common.handlerMsgState({
            msg: "取消收藏",
            type: "warning"
          });
        } else {
          this.$common.handlerMsgState({
            msg: "收藏成功",
            type: "success"
          });
        }
        item.isFavorite = !item.isFavorite;
        eventBus.$emit("resetMyCollection");
      }
    },
    // 加购
    handlerShopping(item) {
      // this.$set(item, "isShopping", !item.isShopping);
      console.log(item);
      item.isShopping = !item.isShopping;
      if (item.isShopping) {
        item.shoppingCount = 1;
        this.$store.commit("pushShopping", item);
        this.$common.handlerMsgState({
          msg: "加购成功",
          type: "success"
        });
      } else {
        item.shoppingCount = 0;
        this.$store.commit("popShopping", item);
        this.$common.handlerMsgState({
          msg: "取消加购成功",
          type: "warning"
        });
      }
      this.$forceUpdate();
      eventBus.$emit("resetMyShoppingCart");
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.bsGridItem {
  width: 255px;
  min-width: 255px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  margin-top: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 4px;
  .itemImg {
    position: relative;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    padding: 16px;
    cursor: pointer;
    .iconClient {
      position: absolute;
      right: 25px;
      top: 25px;
      color: #fb6055;
      cursor: pointer;
    }
    .el-image {
      img {
        width: 100%;
        height: 166px;
        object-fit: contain;
        image-rendering: -moz-crisp-edges;
        image-rendering: -o-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
      }
    }
    .spotProductIcon,
    .newProductIcon,
    .vipProductIcon {
      position: absolute;
      left: 16px;
      top: 16px;
      width: 45px;
      height: 45px;
    }
    .spotProductIcon {
      width: 40px;
      height: 40px;
      background: url("~@/assets/images/spotProductIcon.png") center no-repeat;
      background-size: contain;
    }
    .newProductIcon {
      background: url("~@/assets/images/newProductIcon.png") center no-repeat;
      background-size: contain;
    }
    .vipProductIcon {
      background: url("~@/assets/images/vipProductIcon.png") center no-repeat;
      background-size: contain;
    }
  }
  .content {
    color: #333;
    .productName {
      color: #000;
      padding: 4px 0;
      padding: 0 16px;
      font-weight: bold;
      box-sizing: border-box;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
    }
    .addCartBox {
      display: flex;
      padding: 0 16px;
      box-sizing: border-box;
      .left {
        flex: 1;
        .item {
          padding: 4px 0;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
          .title {
            color: #999;
          }
          .price {
            color: #eb1515;
            &.lookPrice {
              cursor: pointer;
            }
          }
        }
      }
      .right {
        width: 46px;
        min-width: 46px;
        padding-left: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        cursor: pointer;
        .shoppingCart {
          width: 36px;
          height: 36px;
          transition: all 0.3s;
          background: url("~@/assets/images/shoppingCartIcon.png") no-repeat
            center;
          background-size: contain;
        }
        .shoppingCartActive {
          width: 36px;
          height: 36px;
          transition: all 0.3s;
          background: url("~@/assets/images/shoppingCartActiveIcon.png")
            no-repeat center;
          background-size: contain;
        }
        &:hover {
          .shoppingCart {
            -webkit-transform: scale(1.2) rotate(360deg);
            -moz-transform: scale(1.2) rotate(360deg);
            -ms-transform: scale(1.2) rotate(360deg);
            transform: scale(1.2) rotate(360deg);
            margin-bottom: 5px;
          }
          .shoppingCartActive {
            -webkit-transform: scale(1.2) rotate(360deg);
            -moz-transform: scale(1.2) rotate(360deg);
            -ms-transform: scale(1.2) rotate(360deg);
            transform: scale(1.2) rotate(360deg);
            margin-bottom: 5px;
          }
        }
      }
    }
    .sourceBox {
      height: 48px;
      padding: 0 16px;
      box-sizing: border-box;
      border-top: 1px solid #e5e5e5;
      margin-top: 10px;
      display: flex;
      align-items: center;
      color: #3368a9;
      cursor: pointer;
      .sourceIcon {
        width: 18px;
        min-width: 18px;
        height: 18px;
        margin-right: 16px;
        background: url("~@/assets/images/sourceIcon.png") no-repeat center;
        background-size: contain;
      }
      .text {
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
      }
    }
  }
}
</style>
