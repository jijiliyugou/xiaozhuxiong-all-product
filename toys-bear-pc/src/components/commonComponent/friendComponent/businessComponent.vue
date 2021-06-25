<!--  -->
<template>
  <div class="businessComponent" @click.stop>
    <div class="header">
      <!-- <img  style="width: 50px; height: 50px; border-radius: 50%; z-index:99" :src="userData.userImage" alt=""> -->
      <el-image
        style="width: 50px;min-width: 50px; height: 50px; border-radius: 50%;"
        fit="contain"
        :src="userData.userImage"
      >
        <div slot="placeholder" class="image-slot">
          <img
            style="width: 50px; height: 50px; border-radius: 50%"
            :src="require('@/assets/images/imgError.png')"
          />
        </div>
        <div slot="error" class="image-slot">
          <img
            style="width: 50px; height: 50px; border-radius: 50%"
            :src="require('@/assets/images/imgError.png')"
          />
        </div>
      </el-image>
      <div class="username">
        <div class="name">
          <h3>
            {{ userData.linkman }}
          </h3>
          <i
            :class="{
              sex0Icon: userData.sex === 0,
              sex1Icon: userData.sex === 1
            }"
          ></i>
        </div>

        <p>{{ userData.companyName }}</p>
      </div>
    </div>
    <div class="main">
      <div class="item">
        姓名：<span>{{ userData.linkman }}</span>
      </div>
      <div class="item">
        电话：<span>{{ userData.phoneNumber }}</span>
      </div>
      <div class="item" v-if="userData.isFriend">
        <div class="remark">
          <div class="userRemark" v-if="isRemark">
            备注： <span>{{ userData.friendRemarkName }}</span>
          </div>
          <div class="inputRemark" v-else>
            备注：<el-input
              size="mini"
              style="width:180px"
              maxlength="10"
              show-word-limit
              v-model="remarkName"
              v-focus
              @keyup.native.enter="upDateRemark"
              @blur="upDateRemark"
            >
            </el-input>
          </div>
          <i class="updataIcon" @click="handelRemark"></i>
        </div>
      </div>
    </div>
    <div class="enterpriseBox">
      <el-scrollbar style="height: 100%;">
        <div
          class="firmList"
          v-for="item in userData.companyList"
          :key="item.id"
        >
          <div class="title">企业信息</div>
          <div class="name" @click="handleToCompany(item)">
            <p class="blue">{{ item.companyName }}</p>
            <i style="margin-right:5px" class="el-icon-arrow-right"></i>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="footer">
      <el-button
        class="sendMessage"
        @click.stop="handlesendMessage"
        :disabled="userData.id === userInfo.userInfo.id"
      >
        发消息
      </el-button>
      <el-button
        v-if="!userData.isFriend"
        class="addFriend"
        :disabled="userData.id === userInfo.userInfo.id"
        @click.stop="openAddFriend"
      >
        添加好友
      </el-button>
      <el-button
        v-else
        class="deleteFriend"
        :disabled="userData.id === userInfo.userInfo.id"
        @click.stop="openRemoveFriend"
      >
        删除好友
      </el-button>
    </div>
    <el-dialog
      title="申请理由"
      @click.native.stop
      :visible.sync="applyDialog"
      append-to-body
      v-if="applyDialog"
      width="400px"
    >
      <reasonsForApplication
        :myName="myName"
        @submitAddFriend="subAdd"
        @closeAddFriend="closeAddFriend"
      />
    </el-dialog>
    <el-dialog
      title="删除好友"
      @click.native.stop
      :visible.sync="isShowRemoveFriend"
      append-to-body
      v-if="isShowRemoveFriend"
      width="400px"
    >
      <isRemoveFriend
        msg="确定要删除该好友吗？"
        @yesEvent="yesEvent"
        @noneEvent="noneEvent"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import reasonsForApplication from "@/components/commonComponent/reasonsForApplication/reasonsForApplication.vue";
import isRemoveFriend from "@/components/commonComponent/isRemoveFriend/isRemoveFriend.vue";
export default {
  name: "businessComponent",
  props: {
    userIdData: {
      type: Object
    }
  },
  components: {
    reasonsForApplication,
    isRemoveFriend
  },
  data() {
    return {
      isShowRemoveFriend: false,
      myName: "",
      applyDialog: false,
      type: "添加",
      remarkName: "",
      isRemark: true,
      companyInfo: {},
      userData: {}
    };
  },

  created() {
    console.log(this.userIdData, "userIdData");
  },
  mounted() {
    this.GetUserinfo();
  },
  methods: {
    // 取消删除好友
    noneEvent() {
      this.isShowRemoveFriend = false;
    },
    // 确定删除好友
    async yesEvent() {
      const res = await this.$im_http.post("/api/AddressBook/Delete", {
        targetUserId: this.userData.id,
        targetCompanyId: this.userData.companyId
      });
      if (res.data.result.code === 200) {
        this.isShowRemoveFriend = false;
        this.$emit("successDeleteFriend");
        this.$common.handlerMsgState({
          msg: "删除成功",
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 打开删除好友
    openRemoveFriend() {
      this.isShowRemoveFriend = true;
    },
    // 添加好友
    async subAdd(text) {
      console.log(text, this.userData);
      const res = await this.$im_http.post("/api/AddressBook/Apply", {
        senderCompanyId: this.userInfo.commparnyList[0].commparnyId,
        senderPersonnelId: this.userInfo.userInfo.id,
        content: text,
        remark: "",
        recipientCompanyId: this.userData.companyId,
        recipientPersonnelId: this.userData.id,
        source: "同事通讯录"
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "发送好友验证",
          type: "success"
        });
        this.applyDialog = false;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 关闭添加好友
    closeAddFriend() {
      this.applyDialog = false;
    },
    // 打开添加好友
    async openAddFriend() {
      this.myName = this.userData.linkman;
      this.applyDialog = true;
    },
    // 获取用户信息
    async GetUserinfo() {
      const res = await this.$http.post(
        "/api/OrgPersonnelByID",
        this.userIdData
      );
      if (res.data.result.code === 200) {
        this.userData = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      console.log(this.userData, "userData");
    },
    // 修改备注icon
    handelRemark() {
      this.isRemark = !this.isRemark;
      this.remarkName = this.userData.friendRemarkName;
    },
    //确定修改备注
    async upDateRemark() {
      this.isRemark = !this.isRemark;
      const fd = {
        targetUserId: this.userIdData.id,
        targetCompanyId: this.userIdData.companyId,
        remarkName: this.remarkName
      };
      const res = await this.$im_http.post(
        "/api/AddressBook/UpdateFriendInfo",
        fd
      );
      if (res.data.result.code === 200) {
        this.GetUserinfo();
        this.$common.handlerMsgState({
          msg: " 修改成功",
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    //跳转公司
    handleToCompany() {
      this.$common.handlerMsgState({
        msg: "暂不支持跳转",
        type: "danger"
      });
    },
    //   发消息
    handlesendMessage() {
      if (!this.userData.chatUserId) {
        this.$common.handlerMsgState({
          msg: "该用户还未注册！",
          type: "danger"
        });
        return;
      } else {
        const fd = {
          name: this.userData.chatUserId,
          linkUrl: "/bsIndex/bsNews",
          component: "bsNews",
          refresh: true,
          label: this.userData.linkman || this.userData.phoneNumber,
          value: {
            targetId: this.userData.chatUserId,
            type: 1
          }
        };
        this.$store.commit("myAddTab", fd);
      }
    }
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.businessComponent {
  cursor: default;
  width: 300px;
  min-height: 435px;
  padding-bottom: 20px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  @{deep} .header {
    display: flex;
    padding: 20px 20px 0;
    height: 90px;
    box-sizing: border-box;
    border-bottom: 1px solid #dcdfe6;
    .el-image {
      .el-image__inner {
        opacity: 1;
      }
    }
    .username {
      padding-left: 15px;
      overflow: hidden;
      .name {
        display: flex;
        align-items: center;
        h3 {
          min-width: 190px;
          font-weight: 700;
          font-size: 18px;
          text-align: left;
          color: #333333;
          line-height: 34px;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
        .sex1Icon {
          display: inline-block;
          vertical-align: top;
          width: 14px;
          height: 14px;
          margin-left: 5px;
          background: url("~@/assets/images/sex1Icon.png") no-repeat center;
          background-size: contain;
        }
        .sex0Icon {
          display: inline-block;
          vertical-align: top;
          width: 14px;
          height: 14px;
          margin-left: 5px;
          background: url("~@/assets/images/sex0Icon.png") no-repeat center;
          background-size: contain;
        }
      }

      p {
        color: #999999;
        font-size: 14px;
      }
    }
  }
  .main {
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    .item {
      color: #999999;
      margin-bottom: 13px;
      .remark {
        display: flex;
        align-items: center;
        .userRemark {
          flex: 1;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
        .inputRemark {
          flex: 1;
          display: flex;
          align-items: center;
        }
        .updataIcon {
          cursor: pointer;
          display: inline-block;
          vertical-align: top;
          width: 18px;
          height: 17px;
          margin-left: 5px;
          background: url("~@/assets/images/updataIcon.png") no-repeat center;
          background-size: contain;
        }
      }
      span {
        color: #333333;
      }
    }
  }
  .enterpriseBox {
    padding: 0 20px;
    margin-bottom: 10px;
    height: 164px;
    .firmList {
      border-top: 1px solid #dcdfe6;
      height: 82px;
      padding: 16px 0;
      box-sizing: border-box;
      .title {
        color: #999999;
        margin-bottom: 11px;
      }
      .name {
        display: flex;
        align-items: center;
        cursor: pointer;
        .blue {
          color: #3368a9;
          flex: 1;
        }
      }
    }
  }

  .footer {
    margin: 0 20px;

    // div {
    //   cursor: pointer;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   width: 260px;
    //   height: 36px;
    //   border-radius: 4px;
    // }
    .el-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 260px;
      height: 36px;
      margin: 0;
    }
    .sendMessage {
      background-color: #3368a9;
      margin: 0 0 12px 0;
      color: #fff;
    }
    .addFriend {
      background-color: #ffffff;
      border: 1px solid #3368a9;
      color: #3368a9;
      box-sizing: border-box;
    }
    .deleteFriend {
      background-color: #ffffff;
      border: 1px solid #ff4848;
      color: #ff4848;
      box-sizing: border-box;
    }
  }
}
</style>
