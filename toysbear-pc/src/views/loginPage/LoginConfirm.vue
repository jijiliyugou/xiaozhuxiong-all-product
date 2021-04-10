<template>
  <div class="confirmBox">
    <div class="topLauot">
      <login-top />
    </div>
    <div class="myMiddle">
      <div class="middleBox">
        <div class="myTitle">选择登陆角色</div>
        <div class="userBox">
          <li
            class="userItem"
            @click.prevent="toMeInfo(item)"
            v-for="(item, i) in this.commparnyList"
            :key="i"
          >
            <el-image
              class="img"
              style="width: 60px; height: 60px;"
              :src="item.companyLogo"
              fit="cover"
            >
              <div
                slot="error"
                class="image-slot"
                style="width:100%;height:100%;display:flex;align-items:center;text-align:center;"
              >
                <img :src="require('@/assets/images/imgError.png')" alt="" />
              </div>
              <div
                slot="placeholder"
                class="image-slot"
                style="width:100%;height:100%;display:flex;align-items:center;white-space: nowrap;text-align:center;"
              >
                <img :src="require('@/assets/images/imgError.png')" alt="" />
              </div>
            </el-image>
            <p style="box-sizing:border-box;padding-right:10px;">
              {{ item.companyName }}
            </p>
          </li>
          <div class="testItem"></div>
          <div class="testItem"></div>
          <div class="testItem"></div>
        </div>
      </div>
    </div>
    <loginFooter />
  </div>
</template>

<script>
import { getMenuFuc } from "@/router/index";
import loginTop from "@/components/loginTop/loginTop.vue";
import loginFooter from "@/components/loginFooter.vue";
export default {
  components: {
    loginTop,
    loginFooter
  },
  data() {
    return {
      radioValue: null,
      commparnyList: []
    };
  },
  methods: {
    // 获取系统参数
    async getClientTypeList(type) {
      const res = await this.$http.post("/api/ServiceConfigurationList", {
        basisParameters: type
      });
      if (res.data.result.code === 200) {
        return res.data.result.item;
      }
    },
    /**
     * 等待几秒后执行
     * @param {number} s 等待时间，单位s秒
     */
    async waitTime(s) {
      return new Promise(resolve => {
        setTimeout(() => resolve(), 1000 * s);
      });
    },
    async toMeInfo(item) {
      const res = await this.$http.post("/api/UserAffiliateCompany", {
        UserId: this.$route.params.userInfo.id,
        CompanyNumber: item.companyNumber
      });
      if (res.data.result.isLogin) {
        // 设置token
        this.$store.commit("setToken", res.data.result);
        this.$store.commit(
          "setComparnyId",
          res.data.result.commparnyList[0].commparnyId
        );
        this.$store.commit("updateAppLoading", true);
        const localKey = res.data.result.uid;
        let localShoppingCart = localStorage.getItem(localKey);
        if (localShoppingCart) {
          localShoppingCart = JSON.parse(localShoppingCart);
          this.$store.commit("initShoppingCart", localShoppingCart);
        } else {
          this.$store.commit("initShoppingCart", []);
        }
        await this.waitTime(1);
        // 登录成功获取系统参数
        const Json = {};
        Json.MessageRestriction = await this.getClientTypeList(
          "MessageRestriction"
        );
        Json.UserRestrictions = await this.getClientTypeList(
          "UserRestrictions"
        );
        Json.NoticeRestrictions = await this.getClientTypeList(
          "NoticeRestrictions"
        );
        Json.CompanyRestrictions = await this.getClientTypeList(
          "CompanyRestrictions"
        );
        Json.PlatForm = await this.getClientTypeList("PlatForm");
        Json.packageManage = await this.getClientTypeList("packageManage");
        this.$store.commit("globalJson/setGlobalJson", Json);
        // 登录成功获取菜单
        try {
          const re = await this.$http.post("/api/GetUserRoleMenu", {});
          if (re.data.result.code === 200 && re.data.result.item) {
            this.$store.commit("handlerLogin", true);
            this.$store.commit(
              "setRouters",
              re.data.result.item.modulesList || []
            );
            await getMenuFuc();
          } else {
            this.$message.error(re.data.result.msg);
            this.$store.commit("removeLoginItems");
          }
          switch (item.companyType) {
            case "Sales":
              // this.$router.push("/bsIndex");
              location.href = "https://www.toysbear.com/new/#/bsIndex";
              break;
            default:
              this.$router.push("/me");
              // location.href = "http://139.9.71.135:8080/#/me";
              break;
          }
          // let token = JSON.stringify(res.data.result);
          // location =
          //   "http://127.0.0.1:8081/#/meInfo/infoList?id=" +token
          // this.$router.push("/me");
        } catch (error) {
          this.$store.commit("updateAppLoading", false);
          this.$message.error("获取菜单失败，请检查网络");
        }
      }
    }
  },
  async mounted() {
    if (!this.$route.params.commparnyList) {
      this.$router.push("/beforeIndex/login");
    } else {
      this.commparnyList = this.$route.params.commparnyList;
    }
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.confirmBox {
  width: 100%;
  height: 100vh;
  .topLauot {
    width: 100%;
    height: 106px;
    background-color: #fff;
  }
  .myMiddle {
    height: calc(100% - 200px);
    background-color: #f1f3f6;
    position: relative;
    .middleBox {
      width: 1200px;
      height: 581px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      box-sizing: border-box;
      padding: 0 130px 130px 130px;
      .myTitle {
        font-size: 20px;
        font-weight: 700;
        padding: 55px 0 43px 0;
        text-align: center;
      }
      .userBox {
        height: 336px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        overflow: auto;
        .userItem {
          width: 208px;
          height: 92px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 9px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          cursor: pointer;
          margin-bottom: 30px;
          &:nth-last-of-type(1) {
            margin-bottom: 0;
          }
          &:nth-last-of-type(2) {
            margin-bottom: 0;
          }
          &:nth-last-of-type(3) {
            margin-bottom: 0;
          }
          &:nth-last-of-type(4) {
            margin-bottom: 0;
          }
          @{deep} .img {
            width: 60px;
            min-width: 60px;
            height: 60px;
            color: #fff;
            transition: all 1s;
            border-radius: 50%;
            margin: 16px;
            img {
              width: 60px;
              height: 60px;
            }
          }
          p {
            transition: all 1s;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        .testItem {
          width: 208px;
        }
      }
    }
  }
}
</style>
