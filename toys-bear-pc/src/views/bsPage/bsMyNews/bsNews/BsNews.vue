<template>
  <!-- <div>敬请期待</div> -->
  <div class="bsNews">
    <div class="bsNewsLeft">
      <el-scrollbar style="height: 100%;">
        <div
          class="infinite-list"
          :infinite-scroll-immediate="false"
          v-infinite-scroll="scrollSessionList"
          infinite-scroll-delay="50"
        >
          <div>
            <h3 style="border-bottom: 1px solid #e5e5e5;margin-bottom: 10px;">
              消息
            </h3>
            <ul
              class="exhibition"
              v-if="chatList.length"
              style="border-top: none;"
            >
              <li
                v-for="(item, i) in chatList"
                :key="i"
                @contextmenu.prevent.stop="openEditInfo(item.targetId)"
                @click="handerIsGrid(item)"
              >
                <div class="exhibition_left">
                  <div class="_leftImg">
                    <el-badge
                      :value="item.unreadMessageCount"
                      :hidden="item.unreadMessageCount < 1"
                    >
                      <el-image
                        v-if="item.type === 1"
                        class="header-img"
                        style="width: 50px;height: 50px;border-radius: 100px;position:static;"
                        :src="item.userInfo && item.userInfo.avatar"
                        fit="contain"
                      >
                        <div
                          slot="placeholder"
                          class="image-slot"
                          style="width: 50px;height: 50px;border-radius: 100px;"
                        >
                          <img
                            style="width: 50px;height: 50px;border-radius: 100px;"
                            :src="require('@/assets/images/imgError.png')"
                          />
                        </div>
                        <div
                          slot="error"
                          class="image-slot"
                          style="width: 50px;height: 50px;border-radius: 100px;"
                        >
                          <img
                            style="width: 50px;height: 50px;border-radius: 100px;"
                            :src="require('@/assets/images/imgError.png')"
                          />
                        </div>
                      </el-image>
                      <el-image
                        v-if="item.type === 3"
                        class="header-img"
                        style="width: 50px;height: 50px;border-radius: 100px;position:static;"
                        :src="item.userInfo && item.userInfo.userImage"
                        fit="contain"
                      >
                        <div
                          slot="placeholder"
                          class="image-slot"
                          style="width: 50px;height: 50px;border-radius: 100px;"
                        >
                          <img
                            style="width: 50px;height: 50px;border-radius: 100px;"
                            :src="require('@/assets/images/imgError.png')"
                          />
                        </div>
                        <div
                          slot="error"
                          class="image-slot"
                          style="width: 50px;height: 50px;border-radius: 100px;"
                        >
                          <img
                            style="width: 50px;height: 50px;border-radius: 100px;"
                            :src="require('@/assets/images/imgError.png')"
                          />
                        </div>
                      </el-image>
                    </el-badge>
                  </div>
                </div>
                <div class="exhibition_right">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :disabled="
                      item.userInfo &&
                        item.userInfo.nickname &&
                        item.userInfo.nickname.length < 15
                    "
                    :content="item.userInfo && item.userInfo.nickname"
                    placement="top"
                  >
                    <h4 v-if="item.type === 1">
                      {{ item.userInfo && item.userInfo.nickname }}
                    </h4>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :disabled="
                      item.userInfo &&
                        item.userInfo.linkName &&
                        item.userInfo.linkName.length < 15
                    "
                    :content="item.userInfo && item.userInfo.linkName"
                    placement="top"
                  >
                    <h4 v-if="item.type === 3">
                      {{ item.userInfo && item.userInfo.linkName }}
                    </h4>
                  </el-tooltip>
                  <p>{{ myFilterMsgTypes(item.latestMessage) }}</p>
                </div>
                <!-- 右键打开操作消息 -->
                <div class="myChehui" v-show="item.targetId === isOperation">
                  <div class="item" @click.stop="removeConversation(item)">
                    删除会话
                  </div>
                  <div class="item" @click.stop="clearConversation()">
                    清空会话
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <bsNewsMessageList
      v-if="isGrid"
      :dataOption="dataOption"
      @resetConversationList="resetConversationList"
      ref="childEvent"
      :im="im"
    ></bsNewsMessageList>
  </div>
</template>

<script>
//消息列表
import BsNewsMessageList from "@/components/bsComponents/bsNewsComponent/bsNewsMessageList";

import { filterMsgTypes } from "@/assets/js/common/common.js";

import { mapState } from "vuex";

import eventBus from "@/assets/js/common/eventBus.js";

export default {
  name: "bsNews",
  components: {
    BsNewsMessageList
  },
  props: ["im", "item"],
  data() {
    return {
      isOperation: null,
      connectState: false,
      chatList: [],
      disabled: false,
      colorId: "2",
      isGrid: null,
      isDiyu: "0",
      dataOption: {},
      msgList: [
        {
          id: 1,
          name: "小竹熊大家族",
          img: require("@/assets/images/system.png"),
          message: "收到"
        },
        {
          id: 2,
          name: "耀昇展厅",
          img: require("@/assets/images/system.png"),
          message: "收到"
        },
        {
          id: 3,
          name: "zs3",
          img: require("@/assets/images/system.png"),
          message: "大概是多少？"
        }
      ]
    };
  },
  methods: {
    // 清空会话
    async clearConversation() {
      for (let i = 0; i < this.chatList.length; i++) {
        this.removeConversation(this.chatList[i]);
      }
    },
    // 删除当前会话
    removeConversation(item) {
      // conversation 会话实例
      this.$store.commit("updateAppLoading", true);
      const _that = this;
      const conversation = this.im.Conversation.get({
        targetId: item.targetId,
        type: item.type
      });
      conversation.destory().then(() => {
        _that.resetConversationList();
      });
    },
    // IM 添加事件监听
    watchIm() {
      const _that = this;
      // 添加事件监听
      this.im.watch({
        // 监听会话列表变更事件
        async conversation(event) {
          // 发生变更的会话列表
          const updatedConversationList = event.updatedConversationList;
          console.log(updatedConversationList, "会话列表变化了");
          if (updatedConversationList && updatedConversationList.length) {
            const latestConversationList = _that.im.Conversation.merge({
              conversationList: _that.chatList,
              updatedConversationList
            });
            for (let i = 0; i < latestConversationList.length; i++) {
              switch (latestConversationList[i].type) {
                case 1:
                  latestConversationList[i].userInfo ||
                    (latestConversationList[i].userInfo = await _that.getInfoIm(
                      latestConversationList[i].targetId
                    ));
                  // _that[conversationList[i].targetId] =
                  //   conversationList[i].userInfo;
                  break;
                case 3:
                  latestConversationList[i].userInfo ||
                    (latestConversationList[
                      i
                    ].userInfo = await _that.getMemberByGroupNumber(
                      latestConversationList[i].targetId
                    ));
                  // _that[conversationList[i].targetId] =
                  //   conversationList[i].userInfo;
                  break;
              }
            }
            _that.chatList = latestConversationList.filter(val => val.userInfo);
            _that.connectState = true;
          }
        },
        // 监听消息通知
        async message(e) {
          console.log(e.message, "收到新消息");
          if (
            _that.$refs.childEvent &&
            _that.dataOption.targetId === e.message.targetId
          ) {
            _that.$refs.childEvent.resetHistoryChat(e.message);
          }
          // 新接收到的消息内容
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
          _that.getExistedConversationList(0).then(async conversationList => {
            console.log(conversationList);
            if (conversationList) {
              for (let i = 0; i < conversationList.length; i++) {
                switch (conversationList[i].type) {
                  case 1:
                    conversationList[i].userInfo = await _that.getInfoIm(
                      conversationList[i].targetId
                    );
                    // _that[conversationList[i].targetId] =
                    //   conversationList[i].userInfo;
                    break;
                  case 3:
                    conversationList[
                      i
                    ].userInfo = await _that.getMemberByGroupNumber(
                      conversationList[i].targetId
                    );
                    // _that[conversationList[i].targetId] =
                    //   conversationList[i].userInfo;
                    break;
                }
              }
              const arr = _that.im.Conversation.merge({
                conversationList: _that.chatList,
                updatedConversationList: conversationList
              });
              _that.chatList = arr.filter(val => val.userInfo);
              // _that.chatList = _that.chatList.concat(conversationList);
              // console.log(_that.chatList);
              _that.connectState = true;
            }
          });
        })
        .catch(error => {
          console.log("链接失败: ", error.code, error.msg);
          this.connectState = false;
        });
    },
    // 右键打开操作会话列表
    openEditInfo(id) {
      // const x = e.layerX; // 鼠标left位置
      // const y = e.layerY; // 鼠标top位置
      console.log();
      // this.$refs.chatsRef.forEach(val => {
      //   val.style.left = x + "px";
      //   val.style.top = y + "px";
      // });
      this.isOperation = id;
      // this.copyDOM = $(e.target).offsetParent();
      // this.copyDOM
      //   .offsetParent()
      //   .children(".myChehui")
      //   .css({ left: x, top: y });
    },
    // 刷新会话列表
    resetConversationList(count) {
      const _that = this;
      this.getExistedConversationList(0, count).then(async res => {
        console.log(res);
        for (let i = 0; i < res.length; i++) {
          switch (res[i].type) {
            case 1:
              res[i].userInfo = await _that.getInfoIm(res[i].targetId);
              break;
            case 3:
              res[i].userInfo = await _that.getMemberByGroupNumber(
                res[i].targetId
              );
              break;
          }
          this.$store.commit("updateAppLoading", true);
        }
        _that.chatList = res.filter(val => val.userInfo);
        const curret = res.find(
          val => val.targetId === this.dataOption.targetId
        );
        curret && (this.dataOption = curret);
        this.$store.commit("updateAppLoading", false);
      });
    },
    // im获取会话列表
    getExistedConversationList(startTime = 0, count = 30) {
      return new Promise((result, reject) => {
        this.im.Conversation.getList({
          count: count,
          startTime: startTime,
          order: 0
        })
          .then(async conversationList => {
            result(
              conversationList.filter(val => val.type == 1 || val.type == 3)
            );
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // im获取单聊个人信息
    async getInfoIm(userId) {
      const res = await this.$im_http.post(
        "/api/User/GetUserInfoByChatUserId",
        {
          chatUserId: userId
        }
      );
      const { code, item } = res.data.result;
      if (code === 200) {
        return item;
      } else {
        console.log(res.data.result.msg);
        // this.$common.handlerMsgState({
        //   msg: res.data.result.msg,
        //   type: "danger"
        // });
      }
    },
    // im获取群聊信息
    async getMemberByGroupNumber(groupNumber) {
      const res = await this.$im_http.post(
        "/api/ChatGroup/GetMemberByGroupNumber",
        {
          groupNumber,
          skipCount: 1,
          maxResultCount: 9999
        }
      );
      const { code, item } = res.data.result;
      console.log(item);
      if (code === 200) {
        return item;
      }
    },
    // 会话列表滚动到底事件
    scrollSessionList() {
      if (!this.connectState) {
        return false;
      }
      const _that = this;
      const startTime = this.chatList[this.chatList.length - 1]
        ? this.chatList[this.chatList.length - 1].latestMessage.sentTime
        : null;
      this.getExistedConversationList(startTime).then(async res => {
        for (let i = 0; i < res.length; i++) {
          switch (res[i].type) {
            case 1:
              res[i].userInfo = await _that.getInfoIm(res[i].targetId);
              break;
            case 3:
              res[i].userInfo = await _that.getMemberByGroupNumber(
                res[i].targetId
              );
              break;
          }
        }
        this.chatList = this.chatList.concat(res).filter(val => val.userInfo);
      });
    },
    // 消息筛选
    myFilterMsgTypes(item) {
      return filterMsgTypes(item);
    },
    // 切换
    handerIsGrid(item) {
      this.isGrid = null;
      this.dataOption = item;
      this.$nextTick(() => {
        this.isGrid = "BsNewsMessageList";
      });
    }
  },
  created() {},
  async mounted() {
    console.log(this.item, "传递", 123456);
    this.watchIm();
    if (this.item) {
      this.isGrid = null;
      this.dataOption = {
        ...this.item,
        type: this.item.type,
        userInfo:
          this.item.type == 1
            ? await this.getInfoIm(this.item.targetId)
            : await this.getMemberByGroupNumber(this.item.targetId)
      };
      this.$nextTick(() => {
        this.isGrid = "BsNewsMessageList";
      });
    }
    eventBus.$on("dismissGroup", () => {
      this.isGrid = null;
      this.resetConversationList();
    });
    eventBus.$on("handlerShowmyChehui", () => {
      this.isOperation = null;
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  beforeDestroy() {
    eventBus.$off("dismissGroup");
    eventBus.$off("handlerShowmyChehui");
  }
};
</script>
<style scoped lang="less">
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
    h3 {
      height: 55px;
      font-size: 15px;
      font-weight: 700;
      padding-left: 20px;
      line-height: 55px;
    }
    .exhibition {
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
    }
    .exhibition li:hover {
      background-color: #eff6ff;
    }
    .exhibition li {
      height: 70px;
      display: flex;
      padding: 0 20px;
      cursor: pointer;
      box-sizing: border-box;
      position: relative;
      .myChehui {
        position: absolute;
        z-index: 10;
        width: 75px;
        font-size: 12px;
        left: 75px;
        top: 30px;
        color: #333;
        border-radius: 4px;
        background-color: #fff;
        box-sizing: border-box;
        z-index: 1;
        border: 1px solid #e5e5e5;
        box-shadow: 0px 3px 9px 0px rgba(1, 59, 199, 0.2);
        cursor: pointer;
        .item {
          padding: 10px;
          text-align: center;
          &:last-of-type {
            border-top: 1px solid #e5e5e5;
          }
          &:hover {
            background-color: #e2e2e2;
          }
          // &:first-of-type {
          //   border-top-left-radius: 5px;
          //   border-top-right-radius: 5px;
          // }
          // &:last-of-type {
          //   border-bottom-left-radius: 5px;
          //   border-bottom-right-radius: 5px;
          // }
        }
      }
      .exhibition_left {
        width: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        ._leftImg {
          border-radius: 50%;
          .el-image {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
      }
      .exhibition_right {
        padding: 13px 0 0 15px;
        h4 {
          font-weight: bold;
          height: 20px;
          line-height: 20px;
          color: #333;
          font-size: 14px;
          max-width: 195px;
          overflow: hidden;
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
        p {
          color: #999;
          max-width: 195px;
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
