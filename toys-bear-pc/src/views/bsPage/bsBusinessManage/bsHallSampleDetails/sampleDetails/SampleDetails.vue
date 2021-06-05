<template>
  <div class="sampleDetails">
    <div class="toplauot">
      <div class="left">
        <div class="code">
          <span>本次代号：</span>
          <span class="value">{{ the_nu }}</span>
        </div>
        <div class="company">
          <span>本次择样公司：</span>
          <span class="value">{{ sampleOption.client_na }}</span>
        </div>
      </div>
      <div class="right">
        <el-button
          type="primary"
          size="small"
          plain
          @click="$emit('checkCode')"
        >
          <i class="iconfont icon-daochujinruchukou" style="margin-right:5px;">
          </i>
          切换代号
        </el-button>
      </div>
    </div>
    <div class="contentTop">
      <div class="contentTop_left">
        <div class="tabs"><span>产看明细</span> ({{ totalCount }})</div>
      </div>
      <div class="contentTop_right">
        <el-button type="primary" size="medium" @click="openQuotationFormula">
          报价公式
        </el-button>
      </div>
    </div>
    <div class="contentProduct">
      <div class="bsGridItem" v-for="item in productList" :key="item.id">
        <div class="itemImg">
          <el-image
            style="width: 222px; height: 166px"
            fit="contain"
            :src="item.imgUrl"
            :preview-src-list="[item.imgUrl]"
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
          <!-- <i
            v-show="item.isFavorite"
            class="iconClient activeClientIcon"
            @click.stop="addCollect(item)"
          ></i>
          <i
            v-show="!item.isFavorite"
            class="iconClient clientIcon"
            @click.stop="addCollect(item)"
          ></i> -->
          <!-- 找相似，找同款 -->
          <!-- <div class="similaritySame">
            <div class="simiBox">
              <div class="similarity" @click.stop="similarityEvent(item)">
                找相似
              </div>
              <div class="same" @click.stop="sameEvent(item)">找同款</div>
            </div>
          </div> -->
        </div>
        <div class="content">
          <div class="productName">
            {{ item.name }}
          </div>
          <div class="addCartBox">
            <div class="left">
              <p class="item">
                <span class="title">参考单价：</span>
                <span class="price">{{ item.cu_de }}</span>
                <span class="price">{{ item.price }}</span>
              </p>
              <p class="item">
                <span class="title">出厂货号：</span>
                <span>{{ item.fa_no }}</span>
              </p>
            </div>
          </div>
          <p class="item">
            <span class="title">包装：</span>
            <span class="conText">{{ item.ch_pa }}</span>
          </p>
          <p class="item">
            <span class="title">产品规格：</span>
            <span class="conText">
              {{ item.pr_le || 0 }} x {{ item.pr_wi || 0 }} x
              {{ item.pr_hi || 0 }} (cm)
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
          <div class="sourceBox" @click.stop="toFactory(item)">
            <i class="sourceIcon"></i>
            <span class="text">
              {{ item.supplierName }}
            </span>
          </div>
        </div>
      </div>
      <div class="kong"></div>
      <div class="kong"></div>
      <div class="kong"></div>
      <div class="kong"></div>
      <div class="kong"></div>
    </div>
    <!-- 分页 -->
    <center class="myPagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[12, 24, 36, 48]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </center>
    <!-- 报价公式 -->
    <el-dialog
      title="报价公式"
      :visible.sync="showQuotationFormula"
      v-if="showQuotationFormula"
      width="800px"
    >
      <quotationFormula :sampleOption="sampleOption" />
    </el-dialog>
  </div>
</template>

<script>
import quotationFormula from "./quotationFormula/QuotationFormula";
import eventBus from "@/assets/js/common/eventBus";
export default {
  components: {
    quotationFormula
  },
  props: ["sampleOption", "the_nu"],
  data() {
    return {
      canClick: true,
      totalCount: 0,
      productList: [],
      currentPage: 1,
      pageSize: 12,
      showQuotationFormula: false,
      isDiyu: 0
    };
  },
  methods: {
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      ) {
        return false;
      }
      this.getQuoteListBasicPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      eventBus.$emit("toTop");
      this.currentPage = page;
      this.getQuoteListBasicPage();
    },
    // 打开报价公式
    openQuotationFormula() {
      this.showQuotationFormula = true;
    },
    // 去产品详情
    // async toProductDetails() {
    //   this.$common.handlerMsgState({
    //     msg: "没有产品编号",
    //     type: "danger"
    //   });
    //   return false;
    // const fd = {
    //   name: this.item.productNumber,
    //   linkUrl: "/bsIndex/bsProductSearchIndex",
    //   component: "bsProductDetails",
    //   refresh: true,
    //   label: this.item.fa_no || "产品详情",
    //   value: this.item
    // };
    // this.$store.commit("myAddTab", fd);
    // },
    // 收藏
    async addCollect(item) {
      if (this.canClick) {
        this.canClick = false;
        this.collectEvent(item);
      } else {
        this.$common.handlerMsgState({
          msg: "操作过于频繁",
          type: "danger"
        });
      }
    },
    // 收藏事件
    async collectEvent(item) {
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
        eventBus.$emit("resetProductCollection", item);
        eventBus.$emit("resetProductDetailsCollection", item);
        // 收藏菜单事件
        eventBus.$emit("resetMyCollectionMenu");
      } else {
        item.isFavorite = !item.isFavorite;
        this.$common.handlerMsgState({
          msg: "收藏失败",
          type: "danger"
        });
      }
      this.$nextTick(() => {
        this.canClick = true;
      });
    },
    // 获取择样明细列表
    async getQuoteListBasicPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        the_nu: this.the_nu,
        client_nu: this.sampleOption.client_nu
      };
      const res = await this.$http.post("/api/GetQuoteListBasicPage", fd);
      console.log(res);
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 去厂商详情页 || 去展厅详情页
    async toFactory(item) {
      if (!item.supplierNumber) {
        this.$common.handlerMsgState({
          msg: "此产品没有厂商",
          type: "danger"
        });
        return false;
      }
      const fd = {
        name: item.supplierNumber,
        linkUrl: "/bsIndex/bsVendorQuery",
        component: "bsMyClientsDetail",
        refresh: true,
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
    }
  },
  created() {},
  mounted() {
    this.getQuoteListBasicPage();
    // 取消收藏/刷新页面
    eventBus.$on("resetMyCollectionMenu", () => {
      this.getQuoteListBasicPage();
    });
  }
};
</script>
<style scoped lang="less">
.sampleDetails {
  .toplauot {
    background-color: #fff;
    border-radius: 4px;
    height: 80px;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      flex: 1;
      color: #666;
      display: flex;
      align-items: center;
      .code,
      .company {
        .value {
          color: #333;
        }
      }
      .code {
        margin-right: 40px;
        .value {
          font-size: 20px;
          font-weight: 700;
        }
      }
    }
  }
  .contentTop {
    height: 56px;
    font-size: 15px;
    box-sizing: border-box;
    background-color: #fff;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    border-radius: 4px;
    .contentTop_left {
      .tabs {
        min-width: 120px;
        height: 54px;
        box-sizing: border-box;
        color: #3368a9;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        cursor: pointer;
        span {
          font-weight: 700;
        }
      }
    }
  }
  .contentProduct {
    width: 100%;
    padding-left: 15px;
    padding-top: 20px;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .bsGridItem {
      width: 255px;
      min-width: 255px;
      background: #ffffff;
      border: 1px solid #dcdfe6;
      margin-bottom: 20px;
      margin-right: 15px;
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
          width: 20px;
          height: 20px;
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
          background: url("~@/assets/images/spotProductIcon.png") center
            no-repeat;
          background-size: contain;
        }
        .newProductIcon {
          background: url("~@/assets/images/newProductIcon.png") center
            no-repeat;
          background-size: contain;
        }
        .vipProductIcon {
          background: url("~@/assets/images/vipProductIcon.png") center
            no-repeat;
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
        box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
        .itemImg .similaritySame {
          opacity: 1;
        }
      }
      .content {
        font-size: 13px;
        color: #333;
        .productName {
          font-size: 14px;
          color: #000;
          font-weight: bold;
          padding: 4px 16px;
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
            .UpadateCart {
              width: 36px;
              height: 36px;
              transition: all 0.3s;
              background: url("~@/assets/images/UpadateCart.png") no-repeat
                center;
              background-size: contain;
            }
            .updateIcon {
              width: 36px;
              height: 36px;
              transition: all 0.3s;
              background: url("~@/assets/images/updateIcon.png") no-repeat
                center;
              background-size: contain;
            }
            &:hover {
              .UpadateCart {
                -webkit-transform: scale(1.2) rotate(360deg);
                -moz-transform: scale(1.2) rotate(360deg);
                -ms-transform: scale(1.2) rotate(360deg);
                transform: scale(1.2) rotate(360deg);
                margin-bottom: 5px;
              }
              .updateIcon {
                -webkit-transform: scale(1.2) rotate(360deg);
                -moz-transform: scale(1.2) rotate(360deg);
                -ms-transform: scale(1.2) rotate(360deg);
                transform: scale(1.2) rotate(360deg);
                margin-bottom: 5px;
              }
            }
          }
        }
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
    .kong {
      width: 255px;
      min-width: 255px;
      border: 1px solid transparent;
      margin-right: 15px;
    }
  }
}
</style>
