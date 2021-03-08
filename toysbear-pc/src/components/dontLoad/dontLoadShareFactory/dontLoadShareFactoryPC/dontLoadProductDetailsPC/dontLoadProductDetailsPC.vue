<template>
  <div>
    <topComponent :title="topTitle" :companyInfo="companyInfo" />
    <div style="max-width:1200px;margin: 0 auto;">
      <div class="berad">
        <el-page-header
          @back="changeIsDetail"
          content="产品详情"
        ></el-page-header>
        <span class="backtrack" @click="changeIsDetail"
          ><i class="backtrackIcon iconfont icon-fanhui"></i> 返回</span
        >
      </div>
      <div class="Graphic" v-if="productDetail">
        <div class="left">
          <div class="swiperList">
            <el-image
              fit="contain"
              :src="productDetail.img"
              :preview-src-list="productDetail.imgUrlList"
            >
              <div slot="placeholder" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.png" alt />
              </div>
              <div slot="error" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.png" alt />
              </div>
            </el-image>
            <!-- <i
            v-show="productDetail.isFavorite"
              class="iconClient iconfont icon-wujiaoxing-"
              @click.stop="addCollect(productDetail)"
            ></i>
            <i
            v-show="!productDetail.isFavorite"
              class="iconClient iconfont icon-wujiaoxingkong"
              @click.stop="addCollect(productDetail)"
            ></i> -->
          </div>
        </div>
        <!-- 产品内容 -->
        <div class="right">
          <div class="priceInfo">
            <div class="createDate">
              发布时间：
              <span>
                {{ productDetail.createdOn | createdOn }}
              </span>
            </div>
            <div class="productName">
              <h2>{{ productDetail.name }}</h2>
            </div>
            <ul class="productParams">
              <li
                v-if="
                  $store.state.userInfo &&
                    $store.state.userInfo.commparnyList &&
                    $store.state.userInfo.commparnyList[0].companyType ===
                      'Sales'
                "
              >
                参考单价：<span :class="{ price: true }">{{
                  integralTotal > 0
                    ? productDetail.cu_de + productDetail.price
                    : "积分查看价格"
                }}</span>
              </li>
              <li v-else>
                参考单价：<span class="price">{{
                  productDetail.cu_de + productDetail.price
                }}</span>
              </li>
              <li>出厂货号：{{ productDetail.fa_no }}</li>
              <li>包装：{{ productDetail.ch_pa }}</li>
              <li>
                产品规格：{{
                  productDetail.pr_le +
                    " X " +
                    productDetail.pr_wi +
                    " X " +
                    productDetail.pr_hi +
                    "(CM)"
                }}
              </li>
              <li>
                外箱规格：{{
                  productDetail.ou_le +
                    " X " +
                    productDetail.ou_wi +
                    " X " +
                    productDetail.ou_hi +
                    "(CM)"
                }}
              </li>
              <li>
                包装规格：{{
                  productDetail.in_le +
                    " X " +
                    productDetail.in_wi +
                    " X " +
                    productDetail.in_hi +
                    "(CM)"
                }}
              </li>
              <li>
                装箱量：{{
                  productDetail.in_en + "/" + productDetail.ou_lo + "(PCS)"
                }}
              </li>
              <li>
                体积/材积：{{
                  productDetail.bulk_stere +
                    "(CBM)" +
                    "/" +
                    productDetail.bulk_feet +
                    "(CUFT)"
                }}
              </li>
              <li>
                毛重/净重：{{
                  productDetail.gr_we + "/" + productDetail.ne_we + "(kg)"
                }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topComponent from "@/components/shareFactoryTopComponent/shareFactoryTopComponent.vue";
export default {
  components: {
    topComponent
  },
  props: {
    number: String
  },
  data() {
    return {
      companyInfo: {},
      topTitle: "产品详情",
      productDetail: {},
      integralTotal: null,
      isShowSourceDetail: false,
      activeIndex: 0,
      hoverActive: false,
      myMargin: 0,
      companyData: null
    };
  },
  methods: {
    changeIsDetail() {
      this.$router.go(-1);
    }
  },
  filters: {
    createdOn(val) {
      return val ? val.split(".")[0].replace(/t/gi, " ") : "";
    }
  },
  created() {
    this.productDetail = JSON.parse(sessionStorage.getItem("currentProduct"));
    console.log(this.productDetail);
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.berad {
  margin: 5px 0;
  height: 36px;
  font-size: 16px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @{deep} .el-page-header__left:hover {
    color: #409eff;
  }
  .backtrack {
    font-weight: normal;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      color: #409eff;
    }
    i {
      margin-right: 10px;
    }
  }
}
.Graphic {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .left {
    width: 500px;
    .swiperList {
      width: 100%;
      height: 500px;
      border: 1px solid #ededed;
      cursor: pointer;
      position: relative;
      .iconClient {
        position: absolute;
        font-size: 30px;
        right: 10px;
        top: 10px;
        color: #fb6055;
        cursor: pointer;
      }
      @{deep} .el-image {
        width: 100%;
        height: 100%;
        .errorImg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .right {
    flex: 1;
    position: relative;
    .login {
      padding: 5px 30px;
      font-size: 12px;
      color: #444444;
      background-color: #e2ebff;
      opacity: 0;
      span {
        color: #165af7;
        margin-left: 20px;
      }
    }
    .priceInfo {
      padding-left: 30px;
      .createDate {
        font-size: 12px;
        color: #444444;
      }
      .productName {
        color: #aaa;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        h2 {
          color: black;
          font-weight: 400;
          flex: 1;
          padding-top: 10px;
          font-size: 24px;
        }
      }
      .Introduction {
        line-height: 30px;
      }
      .productParams {
        font-size: 16px;
        margin-top: 10px;
        font-weight: 400;
        position: relative;
        li {
          line-height: 40px;
          .price {
            color: #ff0000;
            font-size: 22px;
          }
        }
        .tagBox {
          height: 32px;
          margin-top: 10px;
          display: inline-block;
          position: relative;
          @{deep} .el-tag {
            font-size: 20px;
            left: 0;
            cursor: pointer;
            &:hover {
              background-color: #fff;
            }
          }
          .box {
            position: absolute;
            right: -440px;
            top: -200px;
            width: 400px;
            height: 250px;
            border-radius: 5px;
            border: 1px solid #e1f3d8;
            background-color: #f0f9eb;
            box-sizing: border-box;
            &::before {
              content: "";
              position: absolute;
              left: -50px;
              bottom: 0;
              width: 50px;
              height: 50px;
              background: url("~@/assets/images/尖尖.png") no-repeat right;
            }
            .title {
              padding: 5px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 18px;
              border-bottom: 1px solid #e1f3d8;
              i {
                color: #979797;
                cursor: pointer;
                &:hover {
                  color: #5cb6ff;
                }
              }
            }
            .content {
              height: 215px;
              display: flex;
              padding: 0 5px;
              box-sizing: border-box;
              .left,
              .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-sizing: border-box;
                font-size: 12px;
                li {
                  flex: 1;
                  display: flex;
                  align-items: center;
                  box-sizing: border-box;
                  span.title {
                    font-size: 12px;
                    width: 60px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    border: none;
                    padding: 0;
                  }
                  .myText {
                    flex: 1;
                    display: block;
                    line-height: normal;
                    box-sizing: border-box;
                    word-break: normal;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
.contact {
  margin-top: 20px;
  font-size: 16px;
  margin-bottom: 100px;
  .contactTitleTxt {
    color: white;
    width: 169px;
    height: 60px;
    background-color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .contactTitleLine {
    border-bottom: 4px solid #ededed;
  }
  .remark {
    padding-top: 20px;
  }
}
</style>
