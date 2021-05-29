<template>
  <div class="bsBusinessMsg">
    <div class="topLaout">
      <div class="tagItem">
        <i class="icon home"></i>
        <span>玩具圈首页</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      businessConversations: [],
      companyConversations: []
    };
  },
  methods: {
    // 获取业务消息列表
    async getConversationList() {
      const res = await this.$im_http.post("/api/Conversation/List", {});
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        this.businessConversations = item.businessConversations;
        this.companyConversations = item.companyConversations;
        console.log(item);
      } else {
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {
    this.getConversationList();
  }
};
</script>
<style scoped lang="less">
.topLaout {
  display: flex;
  .tagItem {
    width: 160px;
    height: 50px;
    opacity: 1;
    background: #ffffff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      border-radius: 6px;
      margin-top: -5px;
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.16);
    }
    .icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      margin-right: 16px;
    }
    .home {
      background: url("~@/assets/images/noticeHomeIcon.png") no-repeat center;
    }
    .myNotice {
      background: url("~@/assets/images/yonghu.png") no-repeat center;
    }
    .ordinary {
      background: url("~@/assets/images/ordinaryNoticeIcon.png") no-repeat
        center;
    }
    .procurement {
      background: url("~@/assets/images/procurementNoticeIcon.png") no-repeat
        center;
    }
    .supply {
      background: url("~@/assets/images/supplyNoticeIcon.png") no-repeat center;
    }
    .icon {
      background-size: contain;
    }
  }
}
</style>
