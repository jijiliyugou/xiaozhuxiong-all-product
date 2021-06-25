<template>
  <div class="bsBusinessMsg">
    <!-- 头部按钮 -->
    <div class="topLaout">
      <div
        :class="{
          tagItem: true,
          active: activeModel && activeModel.messageModel == item.messageModel
        }"
        v-for="(item, i) in businessConversations"
        :key="i"
        @click="openBusinessType(item)"
      >
        <el-avatar
          style="width:28px;height:28px;margin-right:15px;"
          :src="item.icon"
        ></el-avatar>
        <el-badge
          class="hongdian"
          :value="item.unreadCount"
          :hidden="item.unreadCount < 1"
        >
          <span>{{ item.title }}</span>
        </el-badge>
      </div>
    </div>
    <!-- 业务消息 -->
    <template v-if="activeModel">
      <bsYewuInfo :options="activeModel" v-if="activeModel.businessType != 1" />
      <!-- 系统消息 -->
      <bsSystemInfo
        :options="activeModel"
        v-if="activeModel.businessType == 1"
      />
    </template>
  </div>
</template>

<script>
import bsYewuInfo from "./components/bsYewuInfo";
import bsSystemInfo from "./components/bsSystemInfo";
import { mapState } from "vuex";
import eventBus from "@/assets/js/common/eventBus.js";
export default {
  components: {
    bsYewuInfo,
    bsSystemInfo
  },
  data() {
    return {
      activeModel: null,
      businessConversations: [],
      companyConversations: []
    };
  },
  methods: {
    // 过滤传参
    filterParams(item) {
      if (!item) {
        return {};
      }
      // (1=系统消息,2=展厅业务,3=厂商业务,4=公司业务)
      const myCompanyType = this.userInfo.commparnyList[0].companyType;
      if (myCompanyType == "Exhibition") {
        item.sampleFrom = "hall";
        switch (item.businessType) {
          case 3:
            item.sampleTo = "Supplier";
            break;
          case 4:
            item.sampleTo = "Sales";
            break;
        }
      } else {
        switch (item.businessType) {
          case 2:
            if (myCompanyType == "Supplier") {
              item.sampleTo = "Supplier";
            } else if (myCompanyType == "Sales") {
              item.sampleTo = "Sales";
            }
            item.sampleFrom = "hall";
            break;
          case 3:
            item.sampleFrom = "sales";
            item.sampleTo = "Supplier";
            break;
          case 4:
            item.sampleFrom = "sales";
            item.sampleTo = "Supplier";
            break;
        }
      }
      return item;
    },
    // 点击了头部按钮
    openBusinessType(item) {
      this.activeModel = null;
      const activeModel = this.filterParams(item);
      this.$nextTick(() => {
        this.activeModel = activeModel;
      });
    },
    // 获取业务消息按钮
    async getConversationList() {
      const res = await this.$im_http.post("/api/Conversation/List", {});
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        this.businessConversations = item.businessConversations;
        console.log(this.businessConversations);
        let count = 0;
        for (let i = 0; i < item.businessConversations.length; i++) {
          count += item.businessConversations[i].unreadCount;
          if (item.businessConversations[i].sampleFrom == "EXHIBITION") {
            this.$store.commit(
              "updataHallCount",
              item.businessConversations[i].unreadCount
            );
          }
        }
        this.$store.commit("updataAllCount", count);
        this.companyConversations = item.companyConversations;
        this.activeModel = this.filterParams(item.businessConversations[1]);
      } else {
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  async mounted() {
    await this.getConversationList();
    eventBus.$on("resetListCount", () => {
      this.$nextTick(async () => {
        const res = await this.$im_http.post("/api/Conversation/List", {});
        const { code, item, msg } = res.data.result;
        if (code === 200) {
          this.businessConversations = item.businessConversations;
          let count = 0;
          for (let i = 0; i < item.businessConversations.length; i++) {
            count += item.businessConversations[i].unreadCount;
            if (item.businessConversations[i].sampleFrom == "EXHIBITION") {
              this.$store.commit(
                "updataHallCount",
                item.businessConversations[i].unreadCount
              );
            }
          }
          eventBus.$emit("resetHallList");
          this.$store.commit("updataAllCount", count);
        } else {
          this.$common.handlerMsgState({
            msg: msg,
            type: "danger"
          });
        }
      });
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  beforeDestroy() {
    eventBus.$off("resetListCount");
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
    &.active {
      box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.16);
    }
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
