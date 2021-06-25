<template>
  <div class="bsTop">
    <div class="logo">
      <el-image
        style="width: 158px;height: 39px;"
        :src="require('@/assets/images/bsLogo.png')"
        fit="contain"
      >
      </el-image>
    </div>
    <div class="topContent">
      <div class="left">
        <div class="isOpen" @click="$emit('handlerIsCollapse')">
          <i class="el-icon-s-fold" v-show="!isCollapse"></i>
          <i class="el-icon-s-unfold" v-show="isCollapse"></i>
        </div>
        <div class="isNotice" v-if="vesionList.length">
          <i class="laba iconfont icon-laba1"></i>
          <p class="noticeContext" @click="openVesionList">
            <marqueeLeft :list="vesionList" :duration="1" :showDate="true" />
          </p>
        </div>
      </div>
      <div class="right">
        <div class="infoItem">
          <div class="iconBox telephoneIcon"></div>
          <span class="content">热线电话：0754-89671122</span>
        </div>
        <div class="infoItem qq" @click="toQQ('3300802838')">
          <div class="iconBox QQIcon"></div>
          <span class="content">客服QQ1</span>
        </div>
        <div class="infoItem qq" @click="toQQ('3300802838')">
          <div class="iconBox QQIcon"></div>
          <span class="content">客服QQ2</span>
        </div>
        <div class="line"></div>
        <div class="infoItem info" @click="toMyInfo">
          <div class="iconBox lingdangIcon"></div>
          <span class="content">我的消息</span>
        </div>
        <div class="line"></div>
        <div class="infoItem">
          <div class="userIcon">
            <el-avatar
              style="background-color: #3368a9;"
              :size="30"
              :src="userInfo.userInfo.userImage"
            >
              {{ userInfo.userInfo.linkman }}
            </el-avatar>
          </div>
          <span class="content userName">{{ userInfo.userInfo.linkman }}</span>
        </div>
        <div class="moreBox" @click.stop="checkUsers">
          <i class="moreIcon"></i>
          <el-collapse-transition>
            <div class="isCheckUserInfo" v-show="isCheckUser">
              <div class="userInfo">
                <div class="checkItem">{{ userInfo.userInfo.linkman }}</div>
                <p class="phone">{{ userInfo.userInfo.phoneNumber }}</p>
              </div>
              <div class="item checkUser" @click="checktedUser">
                <i class="checkUser"></i>
                <span>切换角色</span>
              </div>
              <div class="item accountSettings" @click="toSetUser">
                <i class="setUser"></i>
                <span>账号设置</span>
              </div>
              <div class="item signOut" @click="signOutEvent">
                <i class="signUser"></i>
                <span>退出</span>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </div>
    <!-- 更新明细 -->
    <el-dialog
      class="detailsDialog"
      :visible.sync="isShowDetails"
      width="500px"
      destroy-on-close
    >
      <bsUpdateBox @close="close" :vesionList="vesionList" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import eventBus from "@/assets/js/common/eventBus";
import marqueeLeft from "@/components/commonComponent/marquee/marquee.vue";
import bsUpdateBox from "./components/bsUpdateBox.vue";
export default {
  props: {
    item: Object,
    isCollapse: {
      type: Boolean
    }
  },
  components: {
    marqueeLeft,
    bsUpdateBox
  },
  data() {
    return {
      isShowDetails: false,
      isCheckUser: false,
      vesionList: []
    };
  },
  methods: {
    // 关闭更新明细
    close() {
      this.isShowDetails = false;
    },
    // 查看更新明细
    openVesionList() {
      this.isShowDetails = true;
    },
    // 获取版本更新
    async getBearVesionPage() {
      const res = await this.$http.post("/api/BearVesionPage", {
        skipCount: 1,
        maxResultCount: 9999,
        platForm: "pc"
      });
      if (res.data.result.code === 200) {
        this.vesionList = res.data.result.item.items;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "error"
        });
      }
    },
    // 去查看我的消息
    toMyInfo() {
      const fd = {
        name: "/bsIndex/bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: "消息"
      };
      this.$store.commit("myAddTab", fd);
      this.$router.push("/bsIndex/bsNews");
    },
    // QQ客服
    toQQ(qq) {
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = "http://wpa.qq.com/msgrd?v=3&uin=" + qq + "&site=qq&menu=yes";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href); // 释放URL 对象
      document.body.removeChild(link);
    },
    // 切换角色
    checktedUser() {
      this.$router.push("/loginConfirm?id=checkted");
    },
    // 退出
    signOutEvent() {
      this.$router.push("/login?id=signOut");
    },
    // 账号设置
    toSetUser() {
      const fd = {
        name: "/bsIndex/bsAccountManage",
        linkUrl: "/bsIndex/bsAccountManage",
        component: "bsAccountManage",
        refresh: true,
        label: "账号管理"
      };
      this.$store.commit("myAddTab", fd);
      this.$router.push("/bsIndex/bsAccountManage");
    },
    // 打开切换角色
    checkUsers() {
      this.isCheckUser = !this.isCheckUser;
    },
    // 注册全局点击事件
    globalEvent() {
      // 好友名片弹框关闭
      eventBus.$emit("handleDialogBusiness", false);
      eventBus.$emit("handleHiddle");
      eventBus.$emit("hideEmoticon");
      eventBus.$emit("hideAddFirend");
      eventBus.$emit("handleDialogNewFriendsBusiness");
      eventBus.$emit("handleDialogMyFriendsBusiness");
      eventBus.$emit("handleDialogColleaguesAddressBookBusiness");
      eventBus.$emit("handlerShowmyChehui");
      eventBus.$emit("handlerShowPi");
      //如果提供了事件对象，则这是一个非IE浏览器
      // if (e && e.stopPropagation)
      //   //因此它支持W3C的stopPropagation()方法
      //   e.stopPropagation();
      // else {
      //   //否则，我们需要使用IE的方式来取消事件冒泡
      //   window.event.cancelBubble = true;
      // }
      // if (e.preventDefault) {
      //   e.preventDefault();
      // } else {
      //   window.event.returnValue == false;
      // }
      this.isCheckUser = false;
    }
  },
  created() {
    this.getBearVesionPage();
  },
  mounted() {
    document.onclick = this.globalEvent;
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@import "./BsTop.less";
</style>
