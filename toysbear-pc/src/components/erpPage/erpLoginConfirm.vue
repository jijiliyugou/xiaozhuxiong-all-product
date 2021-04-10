<template>
  <div class="erpLoginBox">
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
          <div class="shouyeBox" @click="toHome">
            <i class="homeIcon"></i>
            <span class="homeText">首页</span>
          </div>
          <div class="shouyeBox" @click="isErpOrder">
            <i class="mySampleIcon"></i>
            <span class="sampleText">
              我的订单
            </span>
          </div>
          <div class="loginBtn" @click="toLogin">登录系统</div>
        </div>
      </div>
    </div>
    <div class="loginWrap">
      <div class="loginBox">
        <div class="userBox">
          <li
            class="userItem"
            @click.prevent="toMeInfo(item)"
            v-for="(item, i) in userList"
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
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      userList: []
    };
  },
  methods: {
    isErpOrder() {
      if (this.isLogin) this.$router.push("/erpOrder");
      else this.$message.error("请先选择角色");
    },
    toHome() {
      this.$router.push("/erpHome");
    },
    toLogin() {
      this.$router.push("/erpLogin");
    },
    async toMeInfo(item) {
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
        // 登录成功进入订单列表
        this.$router.push("/erpOrder");
      }
    }
  },
  computed: {
    ...mapState(["userInfo"]),
    ...mapState(["isLogin"])
  },
  mounted() {
    this.userList = this.userInfo.commparnyList;
  },
  beforeDestroy() {}
};
</script>

<style lang="less" scoped>
@import "./erpLoginConfirm.less";
</style>
