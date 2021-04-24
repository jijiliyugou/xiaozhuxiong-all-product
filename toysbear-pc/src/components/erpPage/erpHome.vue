<template>
  <div class="erpHomeWrap">
    <div class="toplauotBox">
      <div class="toplauot">
        <div class="left">
          <el-image
            style="width: 76px; height: 76px"
            :src="require('@/assets/images/logo.png')"
            fit="contain"
          ></el-image>
          <div class="titleBox">
            <div class="chTitle">
              小竹熊订单同步管理
            </div>
            <div class="enTitle">
              Shenzhen Little Bamboo Bear Technology co.,Ltd.
            </div>
          </div>
        </div>
        <div class="right">
          <div class="shouyeBox">
            <i class="homeIcon"></i>
            <span class="homeText">首页</span>
          </div>
          <div class="shouyeBox" @click="isErpOrder">
            <i class="mySampleIcon"></i>
            <span class="sampleText">
              我的订单
            </span>
          </div>
          <div class="signOutBox" v-if="$store.state.isLogin">
            <el-image
              class="userImg"
              :src="$store.state.userInfo.userInfo.userImage"
            >
              <div slot="error" class="image-slot">
                <img
                  style="width: 40px; height: 40px; borderRadius: 50%;"
                  :src="require('@/assets/images/logo.png')"
                  alt
                />
              </div>
            </el-image>
            <span class="signOut" @click="signOut">退出</span>
          </div>
          <div v-else class="loginBtn" @click="toLogins">登录系统</div>
        </div>
      </div>
    </div>
    <div class="bannerTong">
      <div class="bannerContext">
        <div class="contentBox">
          <p class="title">小竹熊订单同步宏升erp</p>
          <p class="explain">让办公更快捷 更畅通 更高效</p>
        </div>
      </div>
    </div>
    <div class="floorBox">
      <div class="flootTitle">
        <span>小竹熊合作展厅</span>
        <span class="more"
          >更多合作展厅<i class="el-icon-arrow-right moreIcon"></i
        ></span>
      </div>
      <div class="exhibitionList">
        <div class="bigExhibitions">
          <div class="bigExhibitionItem" v-for="(item, i) in bigHalls" :key="i">
            <div class="imgBox">
              <el-image
                class="hallLogo"
                fit="contain"
                :preview-src-list="[item.bgImg]"
                :src="item.bgImg"
              >
                <div slot="error" class="image-slot">
                  <img
                    style="width: 273px; height: 121px; object-fit: contain;"
                    src="~@/assets/images/logo.png"
                    alt
                  />
                </div>
              </el-image>
            </div>
            <div class="hallName">
              {{ item.companyName || item.adTitle }}
            </div>
          </div>
        </div>
        <div class="minExhibitions">
          <div class="minExhibitionItem" v-for="(item, i) in minHalls" :key="i">
            <div class="imgBox">
              <el-image
                class="hallLogo"
                fit="contain"
                :preview-src-list="[item.bgImg]"
                :src="item.bgImg"
              >
                <div slot="error" class="image-slot">
                  <img
                    style="width: 127px; height: 70px; object-fit: contain;"
                    src="~@/assets/images/logo.png"
                    alt
                  />
                </div>
              </el-image>
            </div>
            <div class="hallName">
              {{ item.companyName || item.adTitle }}
            </div>
          </div>
          <!-- <div class="minExhibitionItem" v-for="(ad, j) in advertList" :key="j">
            <div class="imgBox">
              <el-image class="hallLogo" fit="contain" :preview-src-list="[ad.img]" :src="ad.img">
              <div slot="error" class="image-slot">
                <img style="width: 127px; height: 70px; object-fit: contain;" src="~@/assets/images/logo.png" alt />
              </div>
            </el-image>
            </div>
            <div class="hallName">
              {{ ad.adTitle }}
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="floorBox">
      <div class="flootTitle">
        <span>新品推荐</span>
        <span class="more"
          >更多新品<i class="el-icon-arrow-right moreIcon"></i
        ></span>
      </div>
      <div class="newArrivals">
        <div class="itemBox" v-for="(item, i) in newProductList" :key="i">
          <div class="imgBox">
            <el-image class="hallLogo" :src="item.img">
              <div slot="error" class="image-slot">
                <img
                  style="width: 180px; height: 136px"
                  src="~@/assets/images/logo.png"
                  alt
                />
              </div>
            </el-image>
          </div>
          <div class="contentText">
            <div class="hallName">
              <p class="name">{{ item.name }}</p>
              <p class="textItem">
                出厂货号：<span>{{ item.fa_no }}</span>
              </p>
              <p class="textItem">
                参考单价：<span class="price"
                  >{{ item.cu_de }} {{ item.price }}</span
                >
              </p>
            </div>
          </div>
        </div>
        <div class="itemBox"></div>
        <div class="itemBox"></div>
        <div class="itemBox"></div>
        <div class="itemBox"></div>
        <div class="itemBox"></div>
      </div>
    </div>
    <!-- 广告层 -->
    <div class="advertisingLayer">
      <div class="editionCenter">
        <div class="erweimaBox">
          <erweimaComponent />
        </div>
      </div>
    </div>
  </div>
  <!-- 旧版模板 -->
  <!-- <div class="erpHomeBox">
    <div class="erweimaApp" @mouseenter="hoverLogo" @mouseleave="hoverIsLogo">
      <img class="jiaerweima" :src="jiaerweima" alt="" />
      <div class="saomaDiv" v-show="isActive">
        <div class="saoma"></div>
      </div>
    </div>
    <div class="titleBox">
      <div class="logo">
        <img src="~@/assets/images/logo.png" alt="" />
      </div>
      <h1 class="title">宏升合作展厅</h1>
      <div class="titleEn">
        <span class="titleEnSpan">Partners</span>
      </div>
    </div>
    <div class="Showroom">
      <li
        class="room"
        v-for="(item, index) in orgCompanyList"
        @click="topCompany(item)"
        :key="index"
      >
        <div class="myimg">
          <el-image
            style="height:100px;display:flex;align-items:center;"
            :src="item.companyLogo"
            fit="contain"
          >
          <div
            slot="placeholder"
            class="image-slot"
            style="width: 80px; margin: 0 auto"
          >
            <img
              class="errorImg"
              style="width: 80px;"
              src="~@/assets/images/imgError.png"
              alt
            />
          </div>
          <div
            slot="error"
            class="image-slot"
            style="width: 80px; margin: 0 auto"
          >
            <img
              class="errorImg"
              style="width: 80px;"
              src="~@/assets/images/imgError.png"
              alt
            />
          </div>
          </el-image>
        </div>
        <div class="text">{{ item.companyName }}</div>
      </li>
    </div>
    <div class="titleBox">
      <h1 class="title">新品推荐</h1>
      <div class="titleEn">
        <span class="titleEnSpan">New Products</span>
      </div>
    </div>
    <div class="mySwiper" @mouseenter="boxEnter" @mouseleave="boxleave">
      <swiper
        v-if="dataList.length"
        :dataList="dataList"
        :speed="2"
        :direction="direction"
        :isShow="isShow"
      ></swiper>
    </div>
    <div class="footer">
      <el-button type="primary" @click="toLogins">同步订单</el-button>
    </div>
  </div> -->
</template>

<script>
import erweimaComponent from "./erweimaComponent";
export default {
  components: {
    erweimaComponent
    // swiper
  },
  data() {
    return {
      advertList: [],
      jiaerweima: require("@/assets/images/erweimaicon@2x.png"),
      isActive: false,
      isShow: false,
      currentPage: 1,
      pageSize: 10,
      direction: "left",
      newProductList: [],
      token: null,
      bigHalls: [],
      minHalls: []
    };
  },
  methods: {
    // 去订单页
    isErpOrder() {
      if (this.$store.state.isLogin) this.$router.push("/erpOrder");
      else this.$router.push("/erpLogin");
    },
    hoverLogo() {
      this.isActive = true;
      this.jiaerweima = require("@/assets/images/erweima2.png");
    },
    hoverIsLogo() {
      this.jiaerweima = require("@/assets/images/erweimaicon@2x.png");
      this.isActive = false;
    },
    // 获取新品推荐
    async getProductsByTypePage() {
      const res = await this.$http.post("/api/GetProductsByTypePage", {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        typeId: 2
      });
      if (res.data.result.code === 200) {
        this.newProductList = res.data.result.item.items;
      }
    },
    // 获取小广告
    async getAdvertisementPage() {
      const res = await this.$http.post("/api/GetAdvertisementPage", {
        adPosition: 4,
        maxResultCount: 8,
        platform: "PC",
        skipCount: 1
      });
      if (res.data.result.code === 200) {
        this.advertList = res.data.result.item.items;
      }
    },
    // 获取大小展厅
    async getOrgCompany() {
      const res = await this.$http.post("/api/GetExhibitionList", {
        companyType: "Exhibition"
      });
      if (res.data.result.code === 200) {
        this.bigHalls = res.data.result.item.bigHallList;
        this.minHalls = res.data.result.item.smallHallList;
      }
    },
    // 去公司
    // topCompany (item) {
    //   const href = this.$router.resolve({
    //     name: 'ShowRoomDetail',
    //     params: { id: item.companyNumber }
    //   })
    //   window.open(href.href, '_blank')
    // },
    // 退出登录
    signOut() {
      this.$router.push("/erpLogin?id=signOut");
    },
    // 去登录页
    toLogins() {
      this.$router.push("/erpLogin");
    },
    boxEnter() {
      this.isShow = true;
    },
    boxleave() {
      this.isShow = false;
    }
  },
  mounted() {
    this.getProductsByTypePage();
    // this.getAdvertisementPage()
    this.getOrgCompany();
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
[v-cloak] {
  display: none;
}
@import "./erpHome.less";
//  旧版样式
// .erpHomeBox {
//   width: 800px;
//   height: 800px;
//   background: url("~@/assets/images/erpbg.png") no-repeat center;
//   background-size: 100%;
//   margin: 0 auto;
//   box-sizing: border-box;
//   padding: 40px 40px 0 40px;
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   .erweimaApp {
//     position: absolute;
//     right: 0;
//     top: 90px;
//     width: 34px;
//     height: 34px;
//     border: 1px solid #165af7;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     transform: translate(0, -50%);
//     &:hover {
//       background-color: #165af7;
//     }
//     .jiaerweima {
//       width: 18px;
//       height: 18px;
//       left: -50%;
//       top: 50%;
//     }
//     .saomaDiv {
//       position: absolute;
//       width: 120px;
//       height: 100px;
//       left: -110px;
//       .saoma {
//         width: 100px;
//         height: 100px;
//         position: absolute;
//         box-sizing: border-box;
//         background: url("~@/assets/images/erweimaxiazai.png") no-repeat center;
//         background-size: 100%;
//         &::after {
//           content: "";
//           display: block;
//           position: absolute;
//           right: -19px;
//           top: 50%;
//           width: 0;
//           height: 0;
//           border: 10px solid transparent;
//           border-left-color: #fff;
//           transform: translate(0, -50%);
//         }
//       }
//     }
//   }
//   .titleBox {
//     height: 100px;
//     width: 100%;
//     text-align: center;
//     box-sizing: border-box;
//     display: flex;
//     align-items: center;
//     flex-direction: column;
//     justify-content: center;
//     position: relative;
//     .title {
//       width: 100%;
//       font-size: 25px;
//       padding: 0;
//       margin: 0;
//       vertical-align: top;
//       font-family: Source Han Sans CN;
//       font-weight: 500;
//       margin-bottom: 12px;
//       color: #000000;
//     }
//     .logo {
//       position: absolute;
//       top: 50%;
//       height: 72px;
//       left: 0;
//       transform: translate(0, -50%);
//       img {
//         height: 72px;
//       }
//     }
//     .titleEn {
//       width: 100%;
//       font-size: 20px;
//       font-family: Source Han Sans CN;
//       font-weight: 400;
//       .titleEnSpan {
//         position: relative;
//         padding: 0 10px;
//         &::before,
//         &::after {
//           content: "";
//           position: absolute;
//           width: 60px;
//           height: 2px;
//           background-color: #165af7;
//           top: 50%;
//         }
//         &::before {
//           left: 100%;
//         }
//         &::after {
//           right: 100%;
//         }
//       }
//     }
//   }
//   .Showroom {
//     width: 100%;
//     max-height: 260px;
//     overflow: auto;
//     box-sizing: border-box;
//     border: 1px solid #d6e8fe;
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: space-between;
//     padding-bottom: 20px;
//     padding-right: 11px;
//     &::after {
//       content: "";
//       width: 210px;
//       margin: 20px 0 0 20px;
//     }
//     .room {
//       width: 210px;
//       height: 100px;
//       box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
//       margin: 20px 0 0 20px;
//       cursor: pointer;
//       display: flex;
//       .myimg {
//         width: 80px;
//         @{deep} .el-image {
//           position: static;
//           img {
//             transition: all 1s;
//           }
//         }
//       }
//       .text {
//         flex: 1;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//       }
//       &:hover {
//         box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
//         @{deep} .el-image {
//           img {
//             -webkit-transform: scale(1.1);
//             -moz-transform: scale(1.1);
//             -ms-transform: scale(1.1);
//             transform: scale(1.1);
//           }
//         }
//       }
//     }
//   }
//   .mySwiper {
//     border: 1px solid #d6e8fe;
//     width: 100%;
//     height: 200px;
//     .swiperTitle {
//       width: 100%;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       .left {
//         cursor: pointer;
//       }
//       .right {
//         font-size: 12px;
//         color: #aaa;
//         cursor: pointer;
//       }
//     }
//   }
//   .footer {
//     margin-top: 20px;
//     height: 64px;
//     display: flex;
//     justify-content: center;
//     .el-button {
//       width: 320px;
//       height: 64px;
//       background-color: #165af7;
//       font-size: 24px;
//       font-family: Source Han Sans CN;
//       font-weight: 400;
//       color: #ffffff;
//       border-radius: 10px;
//       &:hover {
//         opacity: 0.9;
//       }
//     }
//   }
// }

// @media screen and (max-width: 1024px) {
// }
</style>
