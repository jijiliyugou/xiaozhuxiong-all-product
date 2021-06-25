<template>
  <!-- <div>敬请期待</div> -->
  <div class="bsNews">
    <div class="bsNewsLeft">
      <div
        class="infinite-list"
        :infinite-scroll-immediate="false"
        v-infinite-scroll="scrollSessionList"
        infinite-scroll-delay="50"
      >
        <div>
          <h3 class="infinite_title">
            <span>通讯录</span>
            <i
              class="el-icon-circle-plus-outline"
              @click.stop="isShowAddBox = !isShowAddBox"
            >
              <div class="addBox" v-show="isShowAddBox">
                <div
                  class="addBox_top"
                  @click.stop="checkTp({ tp: 'AddFriendsList' })"
                >
                  <i
                    class="iconfont icon-tianjiahaoyou"
                    style="position: relative;right: 15px;"
                  ></i>
                  添加好友
                </div>
                <div class="addBox_bottom" @click.stop="createGroups">
                  <i
                    class="iconfont icon-qunliao"
                    style="position: relative;right: 15px;"
                  ></i>
                  创建群聊
                </div>
              </div>
            </i>
          </h3>
          <ul class="exhibition">
            <el-scrollbar style="height: 100%;">
              <li
                class="exhibition_side"
                v-for="(item, i) in chatList"
                @click="checkTp(item)"
                :key="i"
              >
                <div class="exhibition_left">
                  <div class="_leftImg">
                    <el-image
                      class="header-img"
                      style="width: 50px;height: 50px;border-radius: 100px;position:static;"
                      :src="item.img"
                      fit="contain"
                    >
                    </el-image>
                  </div>
                </div>
                <div class="exhibition_right">
                  <!-- isUnRead -->
                  <el-badge
                    v-if="item.isUnRead"
                    :value="readCount"
                    :hidden="readCount < 1"
                    class="item"
                  >
                    <h4>
                      {{ item.title }}
                    </h4>
                  </el-badge>
                  <h4 v-else>
                    {{ item.title }}
                  </h4>
                </div>
              </li>
              <li class="exhibition_side" style="cursor: default;">
                <div class="exhibition_left">
                  <div class="_leftImg">
                    <el-image
                      class="header-img"
                      style="width: 50px;height: 50px;border-radius: 50%;position:static;"
                      :src="orgCompany.companyLogo"
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
                </div>
                <div class="exhibition_right">
                  <h4 style="font-weight: 700;">
                    {{ orgCompany.companyName }}
                  </h4>
                </div>
              </li>
              <li
                class="exhibition_tongxunlu"
                @click="checkTp({ tp: 'ColleaguesAddressBook' })"
              >
                <div class="exhibition_left">
                  <div class="_leftImg">
                    <i class="icon_L"></i>
                  </div>
                </div>
                <div class="exhibition_right">
                  <h4>
                    同事通讯录
                  </h4>
                </div>
              </li>
            </el-scrollbar>
          </ul>
        </div>
      </div>
    </div>
    <component
      v-if="isGrid"
      :is="isGrid"
      :dataOption="dataOption"
      @resetReadTotal="resetReadTotal"
      ref="childEvent"
      :im="im"
    ></component>
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
// 添加好友列表
import AddFriendsList from "./components/addFriendsList.vue";
// 同事通讯录
import ColleaguesAddressBook from "./components/colleaguesAddressBook.vue";
// 常联系人
import FrequentContacts from "./components/frequentContacts.vue";
// 我的好友
import MyFriends from "./components/myFriends.vue";
// 我的群组
import MyGroups from "./components/myGroups.vue";
// 新的好友
import NewFriends from "./components/newFriends.vue";

// import { filterMsgTypes } from "@/assets/js/common/common.js";
import eventBus from "@/assets/js/common/eventBus";
import createGroupsComponents from "@/components/commonComponent/createGroupsComponents/createGroupsComponents.vue";
import { mapState } from "vuex";
export default {
  name: "bsNews",
  components: {
    AddFriendsList,
    ColleaguesAddressBook,
    FrequentContacts,
    MyFriends,
    MyGroups,
    NewFriends,
    createGroupsComponents
  },
  props: ["im"],
  data() {
    return {
      readCount: 0,
      showCreateGroup: false,
      dataOption: null,
      isShowAddBox: false,
      isGrid: null, // 模板
      connectState: false,
      chatList: [
        // {
        //   img: require("@/assets/images/changlianxiren.png"),
        //   title: "常联系人",
        //   tp: "FrequentContacts"
        // },
        {
          img: require("@/assets/images/xindehaoyou.png"),
          title: "新的好友",
          tp: "NewFriends",
          isUnRead: true
        },
        {
          img: require("@/assets/images/wodehaoyou.png"),
          title: "我的好友",
          tp: "MyFriends"
        },
        {
          img: require("@/assets/images/wodequnzu.png"),
          title: "我的群组",
          tp: "MyGroups"
        }
      ],
      orgCompany: {}
    };
  },
  methods: {
    // 提交创建群聊
    async subCreatGroup({ groupName, myFriends, groups }) {
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
    // 关闭创建群聊
    closeCreatGroup() {
      this.showCreateGroup = false;
    },
    // 刷新total值
    resetReadTotal() {
      this.getUnReadCount();
    },
    // 获取未读数
    async getUnReadCount() {
      const res = await this.$http.post("/api/GetFriendApplyCount", {});
      console.log(res);
      if (res.data.result.code === 200) {
        this.readCount = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 创建群聊
    createGroups() {
      this.showCreateGroup = true;
    },
    // 切换模板
    checkTp(item) {
      this.isGrid = null;
      this.dataOption = item;
      this.$nextTick(() => {
        this.isGrid = item.tp;
      });
    },
    // 获取公司架构
    async getOrgList() {
      const res = await this.$http.post("/api/OrgList", {});
      console.log(res);
      if (res.data.result.code === 200) {
        this.orgCompany = res.data.result.item.orgCompany;
      } else {
        this.$common.handlerMsgState({
          msg: "取消删除",
          type: "danger"
        });
      }
    },
    // 滚动事件
    scrollSessionList() {
      if (!this.connectState) {
        return false;
      }
    },
    // IM 添加事件监听
    watchIm() {
      const _that = this;
      // 添加事件监听
      console.log(this.im, this.im.watch);
      this.im.watch({
        // 监听消息通知
        async message(e) {
          // 新接收到的消息内容
          console.log(e.message, "接收到消息");
          if (e.message.messageType === "RC:CmdNtf") {
            eventBus.$emit("resetNewFriends");
            eventBus.$emit("resetMyFriendList");
            _that.getUnReadCount();
          }
        },
        // 监听 IM 连接状态变化
        status(event) {
          console.log("connection status:", event.status);
        }
      });
      this.im
        .connect({ token: this.userInfo.chatUser.chatUserToken })
        .then(user => {
          console.log("链接成功, 链接用户 id 为: ", user.id);
        })
        .catch(error => {
          console.log("链接失败: ", error.code, error.msg);
          this.connectState = false;
        });
    }
  },
  created() {},
  mounted() {
    this.getOrgList();
    this.getUnReadCount();
    eventBus.$on("hideAddFirend", () => {
      this.isShowAddBox = false;
    });
    this.watchIm();
  },
  computed: {
    ...mapState(["userInfo"])
  },
  beforeDestroy() {
    eventBus.$off("hideAddFirend");
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsNews {
  min-height: 100%;
  background-color: #f1f2f6;
  display: flex;
  .bsNewsLeft {
    margin-right: 20px;
    background-color: #fff;
    width: 300px;
    height: 770px;
    opacity: 1;
    border-radius: 6px;
    // position: absolute;
    // overflow: hidden;
    .infinite_title {
      height: 55px;
      font-size: 15px;
      font-weight: 700;
      padding: 0 20px;
      border-bottom: 1px solid #e5e5e5;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-icon-circle-plus-outline {
        font-weight: 600;
        cursor: pointer;
        position: relative;
        .addBox {
          position: absolute;
          left: -150px;
          top: 20px;
          width: 160px;
          height: 100px;
          border-radius: 4px;
          box-shadow: 0px 0px 3px 0px rgba(42, 69, 116, 0.16);
          background-color: #fff;
          font-size: 15px;
          font-weight: 400;
          text-align: center;
          color: #333333;
          z-index: 1;
          .addBox_top,
          .addBox_bottom {
            height: 50px;
            line-height: 50px;
            &:hover {
              background-color: #eff6ff;
              color: #3368a9;
            }
          }
          .addBox_bottom {
            border-top: 1px solid #e5e5e5;
          }
        }
      }
    }
    .exhibition {
      height: 715px;
      max-height: 715px;
    }
    .exhibition li:hover {
      background-color: #eff6ff;
    }
    .exhibition .exhibition_side {
      height: 70px;
      display: flex;
      padding: 0 20px;
      cursor: pointer;
      box-sizing: border-box;
      .exhibition_left {
        width: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        ._leftImg {
          border-radius: 50%;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
      }
      .exhibition_right {
        padding-left: 15px;
        box-sizing: border-box;
        flex: 1;
        font-size: 15px;
        display: flex;
        align-items: center;
        h4 {
          font-weight: 400;
          color: #333;
          max-width: 190px;
          overflow: hidden;
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
      }
    }
    .exhibition .exhibition_tongxunlu {
      height: 40px;
      display: flex;
      padding: 0 20px;
      cursor: pointer;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .exhibition_left {
        margin-left: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        ._leftImg {
          border-radius: 50%;
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
          .icon_L {
            display: block;
            width: 8px;
            height: 8px;
            background: url("~@/assets/images/erceng.png") no-repeat center;
          }
        }
      }
      .exhibition_right {
        padding-left: 10px;
        box-sizing: border-box;
        flex: 1;
        font-size: 15px;
        display: flex;
        align-items: center;
        h4 {
          font-weight: 400;
          color: #333;
          max-width: 190px;
          overflow: hidden;
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
      }
    }
  }
  .bsNewsRight {
    width: 80%;
    margin-left: 20px;
    .right_top {
      height: 56px;
      background-color: #fff;
      padding-left: 20px;
      display: flex;
      ._topAll {
        width: 100px;
        font-size: 15px;
        font-weight: Bold;
        color: #3368a9;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .businessList {
        width: 200px;
        font-size: 15px;
        color: #666666;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .right_bottom {
      ul li {
        height: 146px;
        background-color: #fff;
        margin-top: 20px;
      }
      ul li .tableHead {
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: bold;
        font-size: 16px;
        color: #333;
        border-bottom: 2px solid #dcdfe6;
        .tableHeadIcon {
          width: 50px;
          min-width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          cursor: pointer;
        }
      }
      ul li .tablemian {
        display: flex;
        padding: 20px 20px 0 20px;
        p {
          color: #666666;
          font-size: 14px;
          line-height: 34px;
        }
        .mianName {
          margin-right: 150px;
        }
        .mianCode {
          flex: 1;
          .mianCode_top {
            display: flex;
            p:nth-child(1) {
              margin-right: 200px;
            }
          }
        }
      }
    }
  }
}
</style>
