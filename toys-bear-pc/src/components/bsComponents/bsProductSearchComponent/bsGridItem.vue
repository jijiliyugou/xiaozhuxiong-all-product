<template>
  <div class="bsGridItem" @mouseleave="showDetails(false)">
    <div
      class="itemImg"
      @click="toProductDetails"
      @mouseenter="showDetails(true)"
    >
      <el-image
        style="width: 222px; height: 166px"
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
        @click.stop="handlerDeleteBrowsing(item)"
        class="BrowsingFootprintsIcon"
        v-if="$route.path === '/bsIndex/bsBrowsingFootprints'"
      >
        <i class="el-icon-delete"></i>
      </div>
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
        class="iconClient activeClientIcon"
        @click.stop="addCollect(item)"
      ></i>
      <i
        v-show="!item.isFavorite"
        class="iconClient clientIcon"
        @click.stop="addCollect(item)"
      ></i>
      <!-- 找相似，找同款 -->
      <div class="similaritySame">
        <div class="simiBox">
          <div class="similarity" @click.stop="similarityEvent">找相似</div>
          <div class="same" @click.stop="sameEvent">找同款</div>
        </div>
      </div>
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
        <div class="right" @click.stop="handlerShopping">
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
    <!-- 详细版 -->
    <el-collapse-transition>
      <div class="showDetails" v-show="isShowDetails == item.productNumber">
        <p class="item">
          <span class="title">包装：</span>
          <span class="conText">{{ item.ch_pa }}</span>
        </p>
        <p class="item">
          <span class="title">产品规格：</span>
          <span class="conText">
            {{ item.pr_le }} x {{ item.pr_wi }} x {{ item.pr_hi }} (cm)
          </span>
        </p>
        <p class="item">
          <span class="title">外箱规格：</span>
          <span class="conText">
            {{ item.ou_le }} x {{ item.ou_wi }} x {{ item.ou_hi }}(cm)
          </span>
        </p>
        <p class="item">
          <span class="title">包装规格：</span>
          <span class="conText">
            {{ item.in_le }} x {{ item.in_wi }} x {{ item.in_hi }}(cm)
          </span>
        </p>
        <p class="item">
          <span class="title">装箱量：</span>
          <span class="conText">{{ item.in_en }}/{{ item.ou_lo }}(pcs)</span>
        </p>
        <p class="item">
          <span class="title">体积/材积：</span>
          <span class="conText">
            {{ item.bulk_stere }}(cbm)/{{ item.bulk_feet }}(cuft)
          </span>
        </p>
        <p class="item">
          <span class="title">毛重/净重：</span>
          <span class="conText">{{ item.gr_we }}/{{ item.ne_we }}(kg)</span>
        </p>
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
    </el-collapse-transition>
  </div>
</template>

<script>
import eventBus from "@/assets/js/common/eventBus";
import { mapGetters } from "vuex";
export default {
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      isShowDetails: null
    };
  },
  methods: {
    // 找相似
    similarityEvent() {
      this.$common.handlerMsgState({
        msg: "敬请期待",
        type: "warning"
      });
      return false;
      // const value = JSON.parse(JSON.stringify(this.item));
      // value.type = "similarity";
      // const fd = {
      //   name: "similarity" + this.item.productNumber,
      //   linkUrl: "/bsIndex/bsProductSearchIndex",
      //   component: "bsSimilarProduct",
      //   refresh: true,
      //   label: "相似产品" + this.item.fa_no,
      //   value: value
      // };
      // this.$store.commit("myAddTab", fd);
    },
    // 找同款
    sameEvent() {
      // this.$common.handlerMsgState({
      //   msg: "敬请期待",
      //   type: "warning"
      // });
      // return false;
      const value = JSON.parse(JSON.stringify(this.item));
      value.type = "same";
      const fd = {
        name: "same" + this.item.productNumber,
        linkUrl: "/bsIndex/bsProductSearchIndex",
        component: "bsSimilarProduct",
        refresh: true,
        label: "同款产品" + this.item.fa_no,
        value: value
      };
      this.$store.commit("myAddTab", fd);
    },
    // 显示明细
    showDetails(flag) {
      if (flag) this.isShowDetails = this.item.productNumber;
      else this.isShowDetails = null;
    },
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
    // 去厂商详情页 || 去展厅详情页
    async toFactory(item) {
      if (item.isIntegral) {
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
      } else {
        // 去展厅
        // this.$common.handlerMsgState({
        //   msg: "展厅首页敬请期待",
        //   type: "warning"
        // });
        // return false;
        const fd = {
          name: item.exhibitionNumber || item.companyNumber,
          linkUrl: "/bsIndex/bsProductSearchIndex",
          component: "bsExhibitionHallHome",
          refresh: true,
          label: item.exhibitionName,
          value: item
        };
        this.$store.commit("myAddTab", fd);
      }
    },
    // 收藏
    async addCollect(item) {
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
      const res = await this.$http.post("/api/CreateProductCollection", {
        productNumber: item.productNumber
      });
      if (res.data.result.code === 200) {
        eventBus.$emit("resetProductCollection");
      } else {
        this.$common.handlerMsgState({
          msg: "收藏失败",
          type: "danger"
        });
      }
    },
    // 加购
    handlerShopping() {
      if (this.shoppingList.length >= 500 && !this.item.isShopping) {
        this.$common.handlerMsgState({
          msg: "购物车已满500条",
          type: "warning"
        });
        return;
      }
      this.item.isShopping = !this.item.isShopping;
      if (this.item.isShopping) {
        this.item.shoppingCount = 1;
        this.$store.commit("pushShopping", this.item);
        this.$common.handlerMsgState({
          msg: "加购成功",
          type: "success"
        });
      } else {
        this.item.shoppingCount = 0;
        this.$store.commit("popShopping", this.item);
        this.$common.handlerMsgState({
          msg: "取消加购成功",
          type: "warning"
        });
      }
      eventBus.$emit("resetMyCart", this.item);
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    // 删除单个浏览记录
    async handlerDeleteBrowsing(item) {
      const fd = {
        id: item.id,
        type: 0
      };
      const res = await this.$http.post("/api/DeleteProductRecord", fd);
      if (res.data.result.code === 200) {
        eventBus.$emit("refreshHtml");
        this.$common.handlerMsgState({
          msg: "删除成功",
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: "删除失败",
          type: "danger"
        });
      }
    }
  },
  created() {},
  computed: {
    ...mapGetters({
      shoppingList: "myShoppingList"
    })
  },
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
  position: relative;
  transition: all 0.5s;
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
      width: 20px;
      height: 20px;
      top: 25px;
      cursor: pointer;
      &.activeClientIcon {
        background: url("~@/assets/images/activeClientIcon.png") no-repeat
          center;
      }
      &.clientIcon {
        background: url("~@/assets/images/clientIcon.png") no-repeat center;
      }
      &.clientIcon,
      &.activeClientIcon {
        background-size: contain;
      }
      background-size: contain;
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
    .BrowsingFootprintsIcon,
    .spotProductIcon,
    .newProductIcon,
    .vipProductIcon {
      position: absolute;
      left: 16px;
      top: 16px;
      width: 45px;
      height: 45px;
    }
    .BrowsingFootprintsIcon {
      width: 40px;
      height: 40px;
      opacity: 0.68;
      background: #333333;
      border-bottom-right-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .BrowsingFootprintsIcon i {
      font-size: 20px;
      color: #ffffff;
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
    .similaritySame {
      position: absolute;
      box-sizing: border-box;
      padding: 0 15px;
      width: 100%;
      left: 0;
      bottom: 0;
      transition: all 1s;
      opacity: 0;
      .simiBox {
        height: 100%;
        display: flex;
        justify-content: space-between;
        .similarity,
        .same {
          width: 110px;
          height: 34px;
          background-color: #f9723e;
          color: #fff;
          opacity: 0.8;
          line-height: 34px;
          text-align: center;
          &:hover {
            background-color: #ec644a;
          }
        }
      }
    }
  }
  &:hover {
    margin-top: 15px;
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    .showDetails {
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    }
    .itemImg .similaritySame {
      opacity: 1;
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
          width: 175px;
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
  .showDetails {
    position: absolute;
    width: 100%;
    left: -1px;
    top: 270px;
    z-index: 1;
    opacity: 1;
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 4px;
    .item {
      padding: 4px 16px;
      box-sizing: border-box;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
      .title {
        color: #999;
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
      cursor: pointer;
      color: #3368a9;
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
