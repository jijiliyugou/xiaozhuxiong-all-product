<template>
  <div class="createGroupsComponents">
    <center class="groupNameBox" v-if="isShowGroupName">
      <div class="name_title">设置群名称</div>
      <el-input v-model="groupName"></el-input>
    </center>
    <div class="contentBox">
      <div class="content_left">
        <el-scrollbar style="height: 100%">
          <el-collapse v-model="activeNames" class="content_left_three">
            <el-collapse-item
              :title="'我的好友（' + friendsTotalCount + ')'"
              name="1"
            >
              <el-checkbox-group
                class="myCheckBox"
                @change="changeCheckbox"
                v-model="activeMyFriend"
              >
                <el-checkbox
                  v-for="item in friendList"
                  :key="item.id"
                  :disabled="filterExistenceItem(item)"
                  :label="item.id"
                >
                  <el-image
                    class="img"
                    style="width:50px; height: 50px;border-radius:50px;"
                    :src="item.userImage"
                    fit="cover"
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
                  <div class="nameBox">
                    <p class="nameBox_name">{{ item.userName }}</p>
                    <p class="nameBox_company">{{ item.companyName }}</p>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item
              :title="'同事通讯录（' + colleagueTotalCount + ')'"
              name="2"
            >
              <el-checkbox-group
                class="myCheckBox"
                @change="changeCheckbox"
                v-model="activeGroups"
              >
                <el-checkbox
                  v-for="item in groupList"
                  :key="item.id"
                  :disabled="filterExistenceItem(item)"
                  :label="item.id"
                >
                  <el-image
                    class="img"
                    style="width:50px; height: 50px;border-radius:50px;"
                    :src="item.userImage"
                    fit="cover"
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
                  <div class="nameBox">
                    <p class="nameBox_name">{{ item.linkman }}</p>
                    <p class="nameBox_company">{{ companyInfo.companyName }}</p>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
      <div class="content_right">
        <div class="content_right_title">
          已选成员（{{ activeTotalCount() }}）
        </div>
        <el-scrollbar style="height: 380px;">
          <ul class="yixuan">
            <li
              class="content_right_item"
              v-for="item in filterActiveMyFriend"
              :key="item.id"
            >
              <div class="content_right_item_imgBox">
                <el-image
                  class="img"
                  style="width:50px; height: 50px;border-radius:50px;"
                  :src="item.userImage"
                  fit="cover"
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
              <div class="content_right_item_nameBox">
                <p class="content_right_item_name">
                  {{ item.userName }}
                </p>
                <p class="content_right_item_company">
                  {{ item.companyName }}
                </p>
              </div>
            </li>
            <li
              class="content_right_item"
              v-for="item in filterActiveGroups"
              :key="item.id"
            >
              <div class="content_right_item_imgBox">
                <el-image
                  class="img"
                  style="width:50px; height: 50px;border-radius:50px;"
                  :src="item.userImage"
                  fit="cover"
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
              <div class="content_right_item_nameBox">
                <p class="content_right_item_name">
                  {{ item.linkman }}
                </p>
                <p class="content_right_item_company">
                  {{ companyInfo.companyName }}
                </p>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <center class="btns">
      <el-button size="medium" @click="submitCreateGroups" type="primary">
        确 定
      </el-button>
      <el-button size="medium" @click="$emit('closeCreatGroup')">
        取 消
      </el-button>
    </center>
  </div>
</template>

<script>
export default {
  props: {
    isShowGroupName: {
      type: Boolean,
      default: true
    },
    myGroupList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      activeGroups: [],
      groupList: [],
      companyInfo: {},
      colleagueTotalCount: 0,
      activeMyFriend: [],
      friendList: [],
      friendsTotalCount: 0,
      groupName: "",
      activeNames: ["1", "2"]
    };
  },
  methods: {
    changeCheckbox(ids) {
      const oldList = [...this.friendList, ...this.groupList];
      const currId = ids[ids.length - 1];
      const currOption = oldList.find(val => val.id === currId);
      // 账号未激活
      if (currOption && !currOption.chatUserId) {
        ids.splice(ids.length - 1, 1);
        this.$common.handlerMsgState({
          msg: "账号未激活",
          type: "danger"
        });
      }
    },
    // 过滤不可选的用户
    filterExistenceItem(item) {
      if (!item.chatUserId) {
        return true;
      } else {
        for (let i = 0; i < this.myGroupList.length; i++) {
          if (this.myGroupList[i].chatUserId === item.chatUserId) {
            return true;
          }
        }
      }
    },
    // 提交创建群聊
    submitCreateGroups() {
      if (
        this.filterActiveGroups.length < 1 &&
        this.filterActiveMyFriend.length < 1
      ) {
        this.$common.handlerMsgState({
          msg: "请选择群聊人员",
          type: "danger"
        });
        return false;
      }
      this.$emit("subCreatGroup", {
        groupName: this.groupName,
        myFriends: this.filterActiveMyFriend,
        groups: this.filterActiveGroups
      });
    },
    // 统计已选成员
    activeTotalCount() {
      return this.activeMyFriend.length + this.activeGroups.length;
    },
    // 获取同事通讯录
    async getGroupList() {
      const res = await this.$http.post("/api/OrgList", {});
      if (res.data.result.code === 200) {
        this.groupList = res.data.result.item.personnes || [];
        this.companyInfo = res.data.result.item.orgCompany || {};
        this.colleagueTotalCount = res.data.result.item.personnes
          ? res.data.result.item.personnes.length
          : 0;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取我的好友列表
    async getMyFriendList() {
      const res = await this.$http.post("/api/GetFriendAddressBooksPage", {
        maxResultCount: this.pageSize,
        skipCount: this.currentPage
      });
      if (res.data.result.code === 200) {
        this.friendList = res.data.result.item.items;
        this.friendsTotalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {
    this.getMyFriendList();
    this.getGroupList();
  },
  computed: {
    // 已选我的同事
    filterActiveGroups() {
      const list = [];
      for (let i = 0; i < this.activeGroups.length; i++) {
        const curr = this.groupList.find(val => val.id == this.activeGroups[i]);
        curr && list.push(curr);
      }
      return list;
    },
    // 已选我的好友
    filterActiveMyFriend() {
      const list = [];
      for (let i = 0; i < this.activeMyFriend.length; i++) {
        const curr = this.friendList.find(
          val => val.id == this.activeMyFriend[i]
        );
        curr && list.push(curr);
      }
      return list;
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.createGroupsComponents {
  height: 600px;
  min-height: 600px;
  .groupNameBox {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    margin-top: 20px;
    .name_title {
      width: 100px;
    }
  }
  .contentBox {
    display: flex;
    height: 450px;
    min-height: 450px;
    // border: 1px solid #000;
    .content_left,
    .content_right {
      width: 50%;
      height: 450px;
      padding: 10px;
      box-sizing: border-box;
      .content_left_three {
        @{deep} .el-collapse-item {
          .el-collapse-item__header {
            font-weight: 700;
            display: block;
            position: relative;
            padding-left: 20px;
            box-sizing: border-box;
            font-size: 14px;
            .el-collapse-item__arrow {
              position: absolute;
              left: 5px;
              margin-top: 18px;
              &::before {
                content: "\e791";
              }
            }
          }
          .myCheckBox {
            .el-checkbox {
              font-size: 30px;
              display: flex;
              align-items: center;
              margin: 10px 20px;
              &:hover {
                background-color: #f5f7fa;
              }
              .el-checkbox__label,
              .el-checkbox__input {
                display: flex;
                align-items: center;
                .el-image {
                  transition: all 0.5s;
                  width: 50px;
                  height: 50px;
                  margin-right: 10px;
                  border-radius: 50px;
                  color: white;
                }
                .nameBox {
                  width: 200px;
                  height: 50px;
                  .nameBox_name,
                  .nameBox_company {
                    overflow: hidden; /*超出部分隐藏*/
                    white-space: nowrap; /*不换行*/
                    text-overflow: ellipsis; /*超出部分文字以...显示*/
                  }
                  .nameBox_company {
                    margin-top: 10px;
                    color: #999;
                  }
                }
              }
              &:hover {
                @{deep} .el-image {
                  -webkit-transform: scale(1.1);
                  -moz-transform: scale(1.1);
                  -ms-transform: scale(1.1);
                  transform: scale(1.1);
                }
              }
              .el-checkbox__label,
              .is-checkbox,
              .el-checkbox__inner {
                display: flex;
                align-items: center;
                border-radius: 50%;
              }
            }
          }
        }
      }
      .content_right_title {
        font-weight: 700;
        height: 48px;
        display: flex;
        align-items: center;
      }
      .yixuan {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        .content_right_item {
          margin: 10px 20px;
          display: flex;
          box-sizing: border-box;
          .content_right_item_imgBox {
            width: 50px;
            height: 50px;
            min-width: 50px;
          }
          .content_right_item_nameBox {
            flex: 1;
            margin-left: 10px;
            max-width: 210px;
            .content_right_item_company,
            .content_right_item_name {
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
            .content_right_item_company {
              color: #999;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
  .btns {
    margin-top: 30px;
  }
}
</style>
