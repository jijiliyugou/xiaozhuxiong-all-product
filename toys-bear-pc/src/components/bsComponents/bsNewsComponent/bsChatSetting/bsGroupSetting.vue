<template>
  <div class="bsGroupSetting">
    <div class="chattingTop">
      <p>群聊信息</p>
      <i class="el-icon-close" @click="$emit('closeChatSetting')"></i>
    </div>
    <div class="content_wrap">
      <el-scrollbar style="height: 100%;">
        <div class="groupImg" @click="openChangeImg" v-if="isGroupLeader">
          <el-image
            class="header-img"
            style="width: 50px;height: 50px;border-radius: 50%;position:static;"
            :src="options.userInfo.userImage"
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
          <span>上传头像 <i class="el-icon-arrow-right"></i></span>
        </div>
        <el-upload
          style="display: none;"
          ref="myUploadRef"
          :auto-upload="false"
          action="https"
          :on-change="openUpload"
        >
        </el-upload>
        <div class="content_title">群成员 ({{ totalCount }})</div>
        <div :class="{ contentBox: true, heightCss: hideChakan }">
          <div class="itemBox" v-for="item in groupList" :key="item.chatUserId">
            <div class="imgBox">
              <el-image
                class="header-img"
                style="width: 50px;height: 50px;border-radius: 50%;position:static;"
                :src="item.userImage"
                :preview-src-list="[item.userImage]"
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
            <div class="nameBox">{{ item.linkman }}</div>
          </div>
          <div class="block"></div>
          <div class="block"></div>
          <div class="block"></div>
        </div>
        <center
          v-show="totalCount > 15"
          class="lookAllPerson"
          @click="openMore"
        >
          {{ chakan }}
        </center>
        <div class="tagBox">
          <div
            class="tagBox_item"
            v-if="isGroupLeader"
            @click="openAddGroupPerson"
          >
            <span class="tagBox_item_title">添加群成员</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div
            class="tagBox_item"
            v-if="isGroupLeader"
            @click="openManageGroupPerson"
          >
            <span class="tagBox_item_title">管理成员</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="tagBox_item" @click="openEditMyGroupName">
            <span class="tagBox_item_title">群聊名称</span>
            <span class="tagBox_item_value"
              >{{ options.userInfo.linkName }}<i class="el-icon-arrow-right"></i
            ></span>
          </div>
          <div class="tagBox_item" style="cursor: default;">
            <span class="tagBox_item_title">我在本群昵称</span>
            <span class="tagBox_item_value">
              {{ userInfo.userInfo.linkman }}
            </span>
          </div>
          <div
            class="tagBox_item"
            v-if="isGroupLeader"
            @click="dissolutionGroup"
          >
            <span class="tagBox_item_title">解散群聊</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="tagBox_item" @click="signOutGroup">
            <span class="tagBox_item_title signOut" style="color: #EB1515;">
              退出群聊
            </span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!-- 修改我的群昵称 -->
    <el-dialog
      title="修改群聊名称"
      :close-on-click-modal="false"
      :visible.sync="showEditMyGroupName"
      v-if="showEditMyGroupName"
      width="600px"
    >
      <editMyGroupName
        :groupName="options.userInfo && options.userInfo.linkName"
        @onsubmit="onsubmit"
        @onclose="onclose"
      />
    </el-dialog>
    <!-- 添加群成员 -->
    <el-dialog
      title="添加群成员"
      :visible.sync="showCreateGroup"
      v-if="showCreateGroup"
      width="700px"
    >
      <createGroupsComponents
        :myGroupList="groupList"
        :isShowGroupName="false"
        @subCreatGroup="subCreatGroup"
        @closeCreatGroup="closeCreatGroup"
      />
    </el-dialog>
    <!-- 管理群成员 -->
    <el-dialog
      :title="'管理群成员（' + totalCount + '）'"
      :visible.sync="showRemoveGroupPerson"
      v-if="showRemoveGroupPerson"
      width="700px"
    >
      <removeGroupPerson
        :groupList="groupList"
        :groupNumber="options.targetId"
        @close="closeGroupSetting"
        @resetGroupList="getGroupList"
      />
    </el-dialog>
  </div>
</template>

<script>
import editMyGroupName from "@/components/commonComponent/editMyGroupName/editMyGroupName.vue";
import { mapState } from "vuex";
import eventBus from "@/assets/js/common/eventBus.js";
import createGroupsComponents from "@/components/commonComponent/createGroupsComponents/createGroupsComponents.vue";
import removeGroupPerson from "@/components/commonComponent/removeGroupPerson/removeGroupPerson.vue";
export default {
  props: ["options"],
  components: {
    editMyGroupName,
    createGroupsComponents,
    removeGroupPerson
  },
  data() {
    return {
      showRemoveGroupPerson: false,
      showCreateGroup: false,
      isGroupLeader: false,
      showEditMyGroupName: false,
      hideChakan: true,
      chakan: "查看更多群成员",
      groupList: [],
      totalCount: 0
    };
  },
  methods: {
    // 关闭群成员
    closeGroupSetting() {
      this.showRemoveGroupPerson = false;
    },
    // 打开管理群成员
    openManageGroupPerson() {
      this.showRemoveGroupPerson = true;
    },
    // 刷新群成员列表
    async getGroupList() {
      const res = await this.$im_http.post(
        "/api/ChatGroup/GetMemberByGroupNumber",
        {
          groupNumber: this.options.targetId,
          skipCount: 1,
          maxResultCount: 9999
        }
      );
      console.log(res);
      if (res.data.result.code === 200) {
        this.groupList = res.data.result.item.groupMemberInfos.items;
        this.totalCount = res.data.result.item.groupMemberInfos.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 提交已选群成员
    async subCreatGroup({ myFriends, groups }) {
      const list = [...groups, ...myFriends];
      const chatUserIds = [];
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          if (list[i].chatUserId == list[j].chatUserId) {
            ++i;
          }
        }
        chatUserIds.push(list[i].chatUserId);
      }
      const res = await this.$im_http.post("/api/ChatGroup/Invite", {
        groupNumber: this.options.targetId,
        chatUserIds: chatUserIds
      });
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        console.log(item);
        this.getGroupList();
        this.showCreateGroup = false;
        this.$common.handlerMsgState({
          msg: "添加成功",
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    },
    // 关闭添加群成员
    closeCreatGroup() {
      this.showCreateGroup = false;
    },
    // 打开添加群成员
    openAddGroupPerson() {
      this.showCreateGroup = true;
    },
    // 解散群聊
    dissolutionGroup() {
      this.$confirm("确定要解散群聊吗？", "警告", {
        type: "warning"
      })
        .then(async () => {
          const res = await this.$im_http.post("/api/ChatGroup/Dismiss", {
            groupNumber: this.options.targetId
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "解散成功",
              type: "success"
            });
            eventBus.$emit("dismissGroup");
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        })
        .catch(() => {});
    },
    // 退出群聊
    signOutGroup() {
      this.$confirm("确定要退出群聊吗？", "警告", {
        type: "warning"
      })
        .then(async () => {
          const res = await this.$im_http.post("/api/ChatGroup/Quit", {
            quitType: 1,
            groupNumber: this.options.targetId,
            chatUserIds: [this.userInfo.chatUser.chatUserId]
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "您已退出群聊",
              type: "success"
            });
            eventBus.$emit("dismissGroup");
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        })
        .catch(() => {});
    },
    // 手动触发选图片
    openChangeImg() {
      this.$refs.myUploadRef.$children[0].$refs.input.click();
    },
    // 上传头像
    async openUpload(file) {
      console.log(file);
      const fd = new FormData();
      fd.append("BusinessType", "Head");
      fd.append("file", file.raw);
      const res = await this.$http.post("/api/File/InsertPic", fd);
      if (res.data.result.code === 200) {
        this.handlerHeadImg(res.data.result.object[0].filePath);
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.message,
          type: "danger"
        });
      }
    },
    // 修改群头像
    async handlerHeadImg(img) {
      const res = await this.$im_http.post("/api/ChatGroup/Update", {
        groupNumber: this.options.targetId,
        userImage: img
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改成功",
          type: "success"
        });
        this.$emit("resetChatList", res.data.result.item);
        this.showEditMyGroupName = false;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 取消编辑群名称
    onclose() {
      this.showEditMyGroupName = false;
    },
    // 提交编辑群名称
    async onsubmit(name) {
      console.log(name);
      const res = await this.$im_http.post("/api/ChatGroup/Update", {
        groupNumber: this.options.targetId,
        linkName: name
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改成功",
          type: "success"
        });
        this.$emit("resetChatList", res.data.result.item);
        this.showEditMyGroupName = false;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 打开编辑我的群名称
    openEditMyGroupName() {
      if (this.isGroupLeader) {
        this.showEditMyGroupName = true;
      } else {
        this.$common.handlerMsgState({
          msg: "您不是群主呢",
          type: "danger"
        });
      }
    },
    // 收起群成员
    openMore() {
      this.hideChakan = !this.hideChakan;
      this.chakan = this.chakan == "查看更多群成员" ? "收起" : "查看更多群成员";
    }
  },
  created() {},
  async mounted() {
    await this.getGroupList();
    const my = this.groupList.find(
      val => val.chatUserId === this.userInfo.chatUser.chatUserId
    );
    if (my && my.groupLeader) this.isGroupLeader = true;
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
.bsGroupSetting {
  .chattingTop {
    padding: 0 20px;
    height: 54px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size: 15px;
      color: #333333;
      font-weight: 700;
    }
    i {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .content_wrap {
    height: 715px;
    .groupImg {
      height: 90px;
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
    .content_title {
      padding: 0 20px;
      height: 54px;
      display: flex;
      align-items: center;
    }
    .contentBox {
      overflow: hidden;
      box-sizing: border-box;
      padding: 0 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      &.heightCss {
        max-height: 265px;
      }
      .itemBox {
        width: 80px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 10px;
        .imgBox {
          width: 50px;
          height: 50px;
        }
        .nameBox {
          margin-top: 10px;
          text-align: center;
          width: 80px;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
      }
      .block {
        width: 80px;
      }
    }
    .lookAllPerson {
      color: #3368a9;
      margin-top: 24px;
      cursor: pointer;
    }
    .tagBox {
      padding: 0 20px;
      box-sizing: border-box;
      margin-top: 20px;
      width: 458px;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
      .tagBox_item {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        border-top: 1px solid #dcdfe6;
        .tagBox_item_title {
          margin-right: 20px;
        }
        .tagBox_item_value {
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
        &:last-of-type {
          border-bottom: 1px solid #dcdfe6;
        }
      }
    }
  }
}
</style>
