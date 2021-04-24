<template>
  <div class="bsSimilarProduct">
    敬请期待
    <!-- <div class="topLaout">
      <div class="leftImg">
        <el-image
          style=" width: 222px;
              height: 166px;"
          fit="contain"
          :src="item.img"
        >
          <div slot="placeholder" class="image-slot">
            <img
              style=" width: 222px;
              height: 166px;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
          <div slot="error" class="image-slot">
            <img
              style=" width: 222px;
              height: 166px;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
        </el-image>
      </div>
      <div class="middleText">
        <div class="productName">99式坦克军事系列积木套装....</div>
        <div class="middleItem">
          出厂货号：<span class="fa_no">123-333</span>
        </div>
        <div class="middleItem">
          参考单价：<span class="price">￥98.00</span>
        </div>
        <div class="contactBox">
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
          <div class="infoBox">
            <p class="infoItem" @click="toNews(item)">
              <i class="infoIcon"></i>
              <span>在线咨询</span>
            </p>
            <p class="infoItem" v-if="item.supplierTelePhoneNumber">
              <i class="telePhoneIcon"></i>
              <span>{{ item.supplierTelePhoneNumber }}</span>
            </p>
            <p class="infoItem" v-if="item.supplierPhone">
              <i class="phoneIcon"></i>
              <span>{{ item.supplierPhone }}</span>
            </p>
            <p class="infoItem" v-if="item.supplierQQ">
              <i class="qqIcon"></i>
              <span>{{ item.supplierQQ }}</span>
            </p>
            <p class="infoItem" @click="toFactory(item)">
              <i class="shopIcon"></i>
              <span>厂商店铺</span>
            </p>
          </div>
        </div>
      </div>
      <div class="rightSource">
        <div class="line"></div>
        <div class="infoSource"></div>
      </div>
    </div> -->
  </div>
</template>

<script>
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
    // 去聊天
    toNews(item) {
      const fd = {
        name: item.supplierNumber + "bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: item.supplierName,
        value: {}
      };
      this.$store.commit("myAddTab", fd);
    },
    // 去厂商
    toFactory(item) {
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
      this.$store.commit("myAddTab", fd);
      this.$router.push("/bsIndex/bsVendorQuery");
    }
  },
  created() {},
  mounted() {
    console.log(this.item);
  }
};
</script>
<style scoped lang="less">
.bsSimilarProduct {
  .topLaout {
    height: 206px;
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    border-radius: 4px;
    padding: 20px;
    .leftImg {
      width: 222px;
      min-width: 222px;
      height: 166px;
    }
    .middleText {
      flex: 1;
      margin-left: 20px;
      height: 166px;
      .productName {
        margin-top: 20px;
        font-size: 18px;
        overflow: hidden;
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
      }
      .middleItem {
        margin-top: 12px;
        .price {
          color: #ff4848;
        }
      }
      .contactBox {
        margin-top: 30px;
        display: flex;
        .sourceBox {
          // height: 48px;
          box-sizing: border-box;
          // margin-top: 10px;
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
        .infoBox {
          margin-left: 97px;
          display: flex;
          .infoItem {
            margin-right: 27px;
            display: flex;
            align-items: center;
            color: #666;
            cursor: pointer;
            .factoryIcon {
              min-width: 18px;
              width: 18px;
              height: 18px;
              margin-right: 15px;
              background: url("~@/assets/images/sourceIcon.png") no-repeat
                center;
              background-size: contain;
            }
            .infoIcon {
              min-width: 28px;
              width: 28px;
              height: 28px;
              margin-right: 15px;
              background: url("~@/assets/images/onlineInfoIcon.png") no-repeat
                center;
              background-size: contain;
            }
            .telePhoneIcon {
              min-width: 28px;
              width: 28px;
              height: 28px;
              margin-right: 15px;
              background: url("~@/assets/images/onlinePhoneIcon.png") no-repeat
                center;
              background-size: contain;
            }
            .phoneIcon {
              min-width: 28px;
              width: 28px;
              height: 28px;
              margin-right: 15px;
              background: url("~@/assets/images/moblie.png") no-repeat center;
              background-size: contain;
            }
            .qqIcon {
              min-width: 28px;
              width: 28px;
              height: 28px;
              margin-right: 15px;
              background: url("~@/assets/images/QQ.png") no-repeat center;
              background-size: contain;
            }
            .shopIcon {
              min-width: 28px;
              width: 28px;
              height: 28px;
              margin-right: 15px;
              background: url("~@/assets/images/onlineStoreIcon.png") no-repeat
                center;
              background-size: contain;
            }
          }
        }
      }
    }
    .rightSource {
      width: 519px;
      min-width: 519px;
      display: flex;
      .line {
        width: 1px;
        background-color: #edeff2;
        height: 166px;
        margin: 0 60px;
      }
      .infoSource {
        flex: 1;
      }
    }
  }
}
</style>
