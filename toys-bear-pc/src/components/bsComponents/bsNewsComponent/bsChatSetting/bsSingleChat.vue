<template>
  <div class="bsSingleChat">
    <div class="chattingTop">
      <p>聊天设置</p>
      <i class="el-icon-close" @click="$emit('closeChatSetting')"></i>
    </div>
    <div class="userInfoBox">
      <div class="imgBox">
        <el-image
          class="header-img"
          style="width: 50px;height: 50px;border-radius: 50%;position:static;"
          :src="options.userInfo.avatar"
          fit="contain"
        >
          <div
            slot="placeholder"
            class="image-slot"
            style="width: 50px;height: 50px;border-radius: 50%;"
          >
            <img
              style="width: 50px;height: 50px;border-radius: 50%;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
          <div
            slot="error"
            class="image-slot"
            style="width: 50px;height: 50px;border-radius: 50%;"
          >
            <img
              style="width: 50px;height: 50px;border-radius: 50%;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
        </el-image>
      </div>
      <div class="nameBox">
        <p class="userName">
          {{ options.userInfo.nickname }}
        </p>
        <p class="company">{{ options.userInfo.companyName }}</p>
      </div>
    </div>
    <div class="addNewMember">
      <div class="newMemberBox" @click="openCreateGroup">
        <span>添加新成员</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <!-- 创建群聊 -->
    <el-dialog
      title="创建群聊"
      :visible.sync="showCreateGroup"
      v-if="showCreateGroup"
      width="700px"
    >
      <createGroupsComponents
        @subCreatGroup="subCreatGroup"
        @closeCreatGroup="closeCreatGroup"
      />
    </el-dialog>
  </div>
</template>

<script>
import createGroupsComponents from "@/components/commonComponent/createGroupsComponents/createGroupsComponents.vue";
export default {
  props: ["options"],
  components: {
    createGroupsComponents
  },
  data() {
    return {
      showCreateGroup: false
    };
  },
  methods: {
    // 打开新建群聊
    openCreateGroup() {
      this.showCreateGroup = true;
    },
    // 提交创建群聊
    async subCreatGroup({ groupName, myFriends, groups }) {
      const list = [...groups, ...myFriends];
      const chatUserIds = [this.options.targetId];
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          if (list[i].chatUserId == list[j].chatUserId) {
            ++i;
          }
        }
        if (list[i].chatUserId != this.options.targetId)
          chatUserIds.push(list[i].chatUserId);
      }
      const res = await this.$im_http.post("/api/ChatGroup/Create", {
        linkName: groupName,
        groupChatType: 1,
        chatUserIds: chatUserIds
      });
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        this.showCreateGroup = false;
        const fd = {
          name: item.groupNumber + item.linkName,
          linkUrl: "/bsIndex/bsNews",
          component: "bsNews",
          refresh: true,
          label: item.linkName || item.groupNumber,
          value: {
            targetId: item.groupNumber,
            type: 3
          }
        };
        this.$store.commit("myAddTab", fd);
      } else {
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    },
    // 关闭生成群聊
    closeCreatGroup() {
      this.showCreateGroup = false;
    }
  },
  created() {},
  mounted() {
    console.log(this.options);
  }
};
</script>
<style scoped lang="less">
.bsSingleChat {
  .chattingTop {
    padding: 0 20px;
    height: 54px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size: 15px;
      font-weight: 700;
      color: #333333;
    }
    i {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .userInfoBox {
    height: 108px;
    display: flex;
    align-items: center;
    padding: 0 36px;
    .imgBox {
      width: 50px;
      min-width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .nameBox {
      height: 50px;
      flex: 1;
      margin-left: 15px;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
      .userName,
      .company {
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
      }
      .company {
        margin-top: 10px;
        color: #3368a9;
      }
    }
  }
  .addNewMember {
    height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    .newMemberBox {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      color: #666;
      cursor: pointer;
      &:hover {
        color: #3368a9;
      }
    }
  }
}
</style>
