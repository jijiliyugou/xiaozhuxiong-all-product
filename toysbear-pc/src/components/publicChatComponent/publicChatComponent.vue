<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      fullscreen
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      top="0"
      width="100%"
    >
      <div class="chatWrap">
        <personalChatComponent :signalROptions="rtm" :Json="globalJson" />
        <div class="mantle" v-if="errorMsg">
          <el-alert
            class="errInfo"
            :title="errorMsg"
            type="error"
            center
            show-icon
          >
          </el-alert>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import personalChatComponent from "@/components/personalChatComponent/personalChatComponent.vue";
export default {
  components: {
    personalChatComponent
  },
  data() {
    return {
      globalJson: null,
      errorMsg: null,
      dialogVisible: false,
      rtm: new this.$RTM({
        // 深网配置
        isGroup: false,
        isErp: true,
        loginState: null,
        attachment: null,
        token: "",
        msgType: "Text",
        value: "",
        showmsg: [],
        creatChannel: null,
        orderNumber: null,
        groupNumber: "",
        toUserImage: "",
        toLinkName: "",
        toUserID: null,
        toCompanyID: null,
        orgPersonnelId: null,
        orgCompanyId: null,
        client: {},
        channelMember: []
      })
    };
  },
  methods: {
    // 深网接收到消息的回调
    receiveMessageCallback() {
      // this.$root.eventHub.$emit('resetData')
      console.log("收到了深网的点点对点消息");
    },
    // 获取用户信息
    async getHSMessageInformation() {
      const {
        phoneNumber,
        companyNumber,
        maPhoneNumber,
        maKeyGuid
      } = this.$route.query;
      // const res = await this.$http.post('/api/GetHSMessageInformation', { phoneNumber: phoneNumber.trim(), companyNumber: companyNumber.trim(), maPhoneNumber: maPhoneNumber.trim(), maKeyGuid: maKeyGuid.trim() })
      try {
        const res = await this.$http.post("/api/GetHSMessageInformation", {
          phoneNumber,
          companyNumber,
          maPhoneNumber,
          maKeyGuid
        });
        const data = res.data.result;
        if (data.code === 200) {
          this.errorMsg = null;
          this.rtm.isGroup = data.item.isGroup;
          this.rtm.groupNumber = data.item.groupNumber;
          this.rtm.toCompanyID = data.item.toCompanyID;
          this.rtm.toUserID = data.item.toUserID;
          this.rtm.toUserImage = data.item.toUserImage;
          this.rtm.toLinkName = data.item.toLinkName;
          this.rtm.orgUserID = data.item.userId;
          this.rtm.orgUserName = data.item.linkName;
          this.rtm.uid = data.item.uid;
          this.$store.commit("setToken", data.item);
          this.rtm.login(
            this.rtm.uid,
            this.rtm.orgUserName,
            this.receiveMessageCallback
          );
        } else {
          this.errorMsg = data.msg;
        }
        this.dialogVisible = true;
      } catch (error) {
        this.dialogVisible = true;
      }
    },
    // 获取系统参数
    async getClientTypeList() {
      const res = await this.$http.post("/api/ServiceConfigurationList", {
        basisParameters: "MessageRestriction"
      });
      if (res.data.result.code === 200) {
        this.globalJson = {
          MessageRestriction: res.data.result.item
        };
        this.getHSMessageInformation();
      }
    }
  },
  created() {},
  mounted() {
    this.getClientTypeList();
    this.$root.eventHub.$on("resetRTM", () => {
      this.rtm.login(
        this.rtm.uid,
        this.rtm.orgUserName,
        this.receiveMessageCallback
      );
    });
  },
  beforeDestroy() {
    this.$root.eventHub.$off("resetRTM");
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
@{deep} .el-dialog__body {
  padding: 0;
}
@{deep} .el-dialog__header {
  display: none;
}
.chatWrap {
  width: 382px;
  height: 827px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  margin: 0 auto;
  position: relative;
  .mantle {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    .errInfo {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, 50%);
    }
  }
}
</style>
