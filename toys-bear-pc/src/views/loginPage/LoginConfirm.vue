<template>
  <div class="confirmBox">
    <div class="topLauot">
      <login-top />
    </div>
    <div class="myMiddle">
      <div class="middleBox">
        <div class="myTitle">选择登陆角色</div>
        <div class="userBox">
          <template v-for="(item, i) in userList">
            <li
              :class="{ userItem: true, active: item.checked }"
              @click.prevent="toMeInfo(item)"
              :key="i"
            >
              <el-image
                class="img"
                style="width: 60px; height: 60px"
                :src="item.companyLogo"
                fit="cover"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    text-align: center;
                  "
                >
                  <img :src="require('@/assets/images/imgError.png')" alt="" />
                </div>
                <div
                  slot="placeholder"
                  class="image-slot"
                  style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    text-align: center;
                  "
                >
                  <img :src="require('@/assets/images/imgError.png')" alt="" />
                </div>
              </el-image>
              <p style="box-sizing: border-box; padding-right: 10px">
                {{ item.companyName }}
              </p>
              <el-checkbox
                v-if="$route.query.id === 'checkted' || isLogin"
                v-model="item.checked"
                :label="true"
                ><span style="display: none">1</span></el-checkbox
              >
            </li>
          </template>
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
import loginTop from "@/components/loginComponents/LoginTop.vue";
import loginFooter from "@/components/loginComponents/LoginFooter.vue";
import { mapState } from "vuex";
import { devEnv, proEnv } from "@/assets/js/config/config.js";
export default {
  components: {
    loginTop,
    loginFooter
  },
  data() {
    return {
      radioValue: null,
      userList: []
    };
  },
  methods: {
    // 二次登录
    async loginTow() {
      const res = await this.$http.post("/api/GetUserCompanyList", {
        phoneNumber: this.userInfo.userInfo.phoneNumber
      });
      if (res.data.result.code === 200) {
        for (let i = 0; i < res.data.result.item.length; i++) {
          if (
            res.data.result.item[i].companyNumber ==
            this.userInfo.commparnyList[0].companyNumber
          ) {
            res.data.result.item[i].checked = true;
          } else {
            res.data.result.item[i].checked = false;
          }
        }
        this.userList = res.data.result.item;
        console.log(this.userList);
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
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
      for (let i = 0; i < this.userList.length; i++) {
        this.userList[i].checked = false;
      }
      item.checked = true;
      const res = await this.$http.post("/api/UserAffiliateCompany", {
        UserId: this.userInfo.userInfo.id,
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
          if (re.data.result.code === 200) {
            this.$store.commit("handlerLogin", true);
            this.$store.commit(
              "setRouters",
              re.data.result.item.modulesList || []
            );
            await getMenuFuc();
          } else {
            this.$common.handlerMsgState({
              msg: re.data.result.msg,
              type: "danger"
            });
            this.$store.commit("removeLoginItems");
          }
          const fd = {
            component: "bsHome",
            label: "后台首页",
            linkUrl: "/bsIndex/bsHome",
            name: "/bsIndex/bsHome",
            refresh: true
          };
          switch (item.companyType) {
            // case "Admin":
            // case "Supplier":
            // case "Exhibition":
            case "Sales":
              this.$store.commit("updateActiveTab", fd);
              this.$store.commit("closeTabAll", this.$router);
              break;
            default:
              location.href =
                process.env.NODE_ENV === "production"
                  ? proEnv.loginUrl
                  : devEnv.loginUrl;
              // location.href = "https://www.toysbear.com/#/me";
              break;
          }
          // this.$router.push("/bsIndex");
          // let token = JSON.stringify(res.data.result);
          // location =
          //   "http://127.0.0.1:8081/#/meInfo/infoList?id=" +token
        } catch (error) {
          console.log(error);
          // this.$store.commit("updateAppLoading", false);
        }
      }
    }
  },
  computed: {
    ...mapState(["userInfo", "isLogin"])
  },
  mounted() {
    this.userList = this.userInfo.commparnyList;
    if (this.$route.query.id === "checkted" || this.isLogin) {
      this.loginTow();
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
          position: relative;
          @{deep} .el-checkbox {
            position: absolute;
            bottom: 10px;
            right: 0;
            overflow: hidden;
            .el-checkbox__input {
              .el-checkbox__inner {
                border-radius: 50% !important;
                overflow: hidden;
              }
            }
          }
          &.active {
            border: 2px solid #3368a9;
          }
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
          ::v-deep .img {
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
