<template>
  <div class="productItem">
    <div class="img">
      <el-image fit="contain" :src="item.img" lazy>
        <div
          slot="placeholder"
          class="image-slot"
          style="width: 150px; margin: 0 auto"
        >
          <img class="errorImg" src="~@/assets/images/imgError.png" alt />
        </div>
        <div
          slot="error"
          class="image-slot"
          style="width: 150px; margin: 0 auto"
        >
          <img class="errorImg" src="~@/assets/images/imgError.png" alt />
        </div>
      </el-image>
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
    <div class="title">产品名称：{{ item.name }}</div>
    <div class="details">
      <ul>
        <li>出厂货号：{{ item.fa_no === 0 ? "???" : item.fa_no }}</li>
        <li>包装：{{ item.fa_no === 0 ? "???" : item.ch_pa }}</li>
        <li>
          产品规格：{{
            item.fa_no === 0
              ? "???"
              : item.pr_le + " X " + item.pr_wi + " X " + item.pr_hi + "(CM)"
          }}
        </li>
        <li>
          外箱规格：{{
            item.fa_no === 0
              ? "???"
              : item.ou_le + " X " + item.ou_wi + " X " + item.ou_hi + "(CM)"
          }}
        </li>
        <li>
          装箱量：{{
            item.fa_no === 0 ? "???" : item.in_en + "/" + item.ou_lo + "(PCS)"
          }}
        </li>
        <li>
          体积/材积：{{
            item.fa_no === 0
              ? "???"
              : item.bulk_stere + "(CBM)" + "/" + item.bulk_feet + "(CUFT)"
          }}
        </li>
        <li>
          毛重/净重：{{
            item.fa_no === 0 ? "???" : item.gr_we + "/" + item.ne_we + "(kg)"
          }}
        </li>
        <div class="productItemFooter">
          <div class="left">
            <!-- 厂商角色 -->
            <el-tag
              type="success"
              v-if="
                $store.state.userInfo.commparnyList &&
                  $store.state.userInfo.commparnyList[0] &&
                  $store.state.userInfo.commparnyList[0].companyType ===
                    'Supplier'
              "
              >来源：{{
                item.supplierNumber ==
                ($store.state.userInfo.commparnyList &&
                  $store.state.userInfo.commparnyList[0] &&
                  $store.state.userInfo.commparnyList[0].companyNumber)
                  ? item.supplierName
                  : item.exhibitionName
              }}
            </el-tag>
            <!-- 展厅角色 | 管理员角色 -->
            <el-tag
              type="success"
              v-else-if="
                ($store.state.userInfo.commparnyList &&
                  $store.state.userInfo.commparnyList[0] &&
                  $store.state.userInfo.commparnyList[0].companyType) ===
                  'Exhibition' ||
                  ($store.state.userInfo.commparnyList &&
                    $store.state.userInfo.commparnyList[0] &&
                    $store.state.userInfo.commparnyList[0].companyType) ===
                    'Admin'
              "
              >来源：{{ item.supplierName }}
            </el-tag>
            <!-- 游客角色 | 公司角色-->
            <el-tag type="success" v-else
              >来源：{{
                item.isIntegral ? item.supplierName : item.exhibitionName
              }}</el-tag
            >
          </div>
          <div
            class="right"
            v-if="userInfo.commparnyList[0].companyType === 'Sales'"
          >
            <div
              class="cartIconBox kongCartIcon"
              @click.stop="handlerShopping(item)"
              v-if="!item.isShopping"
            ></div>
            <div
              class="cartIconBox activeCartIcon"
              @click.stop="handlerShopping(item)"
              v-else
            ></div>
          </div>
        </div>
      </ul>
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
    // 收藏
    async addCollect(item) {
      const res = await this.$http.post("/api/CreateProductCollection", {
        productNumber: item.productNumber
      });
      if (res.data.result.code === 200) {
        this.$message.closeAll();
        if (item.isFavorite) {
          this.$message.success("取消收藏成功");
        } else {
          this.$message.success("收藏成功");
        }
        item.isFavorite = !item.isFavorite;
      }
    },
    // 加购
    handlerShopping(item) {
      // this.$set(item, "isShopping", !item.isShopping);
      item.isShopping = !item.isShopping;
      if (item.isShopping) {
        item.shoppingCount = 1;
        this.$store.commit("pushShopping", item);
        this.$message.closeAll();
        this.$message.success("加购成功");
      } else {
        item.shoppingCount = 0;
        this.$message.closeAll();
        this.$store.commit("popShopping", item);
        this.$message.warning("删除成功");
      }
      this.$forceUpdate();
    },
    // 查看详情
    toDetails(item) {
      window.sessionStorage.setItem(
        "currentProductDetails",
        JSON.stringify(item)
      );
      let { href } = this.$router.resolve({
        path: "/productDetails"
      });
      window.open(href, "_blank");
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.productItem {
  width: 100%;
  cursor: pointer;
  box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
  .img {
    width: 100%;
    height: 150px;
    border-bottom: 1px solid #ccc;
    position: relative;
    .iconClient {
      position: absolute;
      right: 5px;
      bottom: 5px;
      color: #fb6055;
      cursor: pointer;
    }
    @{deep} .el-image {
      width: 100%;
      height: 150px;
      img {
        transition: all 1s;
        width: 100%;
        height: 150px;
      }
    }
  }
  .title {
    color: #7990bd;
    padding: 5px 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: 1px dotted #ccc;
  }
  .details {
    padding: 0 10px;

    ul {
      li {
        padding-top: 5px;
      }
      @{deep} .el-tag {
        margin: 5px 0;
      }
    }
    p {
      float: right;
      color: #cb9348;
      font-weight: 700;
    }
  }
  &:hover {
    box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
    .img {
      @{deep} .el-image {
        img {
          -webkit-transform: scale(1.1);
          -moz-transform: scale(1.1);
          -ms-transform: scale(1.1);
          transform: scale(1.1);
        }
      }
    }
  }
  .productItemFooter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    @{deep} .left {
      .el-tag {
        max-width: 180px;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
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
          background: url("~@/assets/images/kongCartIcon.png") no-repeat center;
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
</style>
