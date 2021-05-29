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
                @click="handerIsGrid(item, 0)"
              >
                <div class="exhibition_left">
                  <div class="_leftImg">
                    <el-badge
                      :value="item.unreadMessageCount"
                      :hidden="item.unreadMessageCount < 1"
                    >
                      <img
                        v-if="item.type === 1"
                        :src="item.userInfo && item.userInfo.avatar"
                        alt=""
                      />
                      <img
                        v-if="item.type === 3"
                        :src="item.userInfo && item.userInfo.userImage"
                        alt=""
                      />
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
              </li>
            </ul>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <component
      v-if="isGrid"
      :is="isGrid"
      :dataOption="dataOption"
      ref="childEvent"
      :im="im"
    ></component>
  </div>
</template>

<script>
//系统消息
import System from "@/components/bsComponents/bsNewsComponent/bsNewsSystemMsg";
//展厅业务
import Exhibition from "@/components/bsComponents/bsNewsComponent/bsNewsExhibition";
//公司业务
import Sales from "@/components/bsComponents/bsNewsComponent/bsNewsCompany";
// 厂商业务
import Supplier from "@/components/bsComponents/bsNewsComponent/bsNewsFirm";
//消息列表
import BsNewsMessageList from "@/components/bsComponents/bsNewsComponent/bsNewsMessageList";

import { filterMsgTypes } from "@/assets/js/common/common.js";

import { mapState } from "vuex";
export default {
  name: "bsNews",
  components: {
    System,
    Exhibition,
    Sales,
    Supplier,
    BsNewsMessageList
  },
  props: ["im"],
  data() {
    return {
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
    // IM 添加事件监听
    watchIm() {
      const _that = this;
      // 添加事件监听
      this.im.watch({
        // 监听会话列表变更事件
        async conversation(event) {
          // 发生变更的会话列表
          const updatedConversationList = event.updatedConversationList;
          if (updatedConversationList && updatedConversationList.length) {
            _that
              .getExistedConversationList(0, _that.chatList.length)
              .then(async conversationList => {
                // 通过 im.Conversation.merge 计算最新的会话列表
                const latestConversationList = _that.im.Conversation.merge({
                  conversationList,
                  updatedConversationList
                });
                for (let i = 0; i < latestConversationList.length; i++) {
                  const userInfo = _that[latestConversationList[i].targetId];
                  if (userInfo) {
                    latestConversationList[i].userInfo = userInfo;
                  } else {
                    switch (latestConversationList[i].type) {
                      case 1:
                        latestConversationList[
                          i
                        ].userInfo = await _that.getInfoIm(
                          latestConversationList[i].targetId
                        );
                        break;
                      case 3:
                        latestConversationList[
                          i
                        ].userInfo = await _that.getMemberByGroupNumber(
                          latestConversationList[i].targetId
                        );
                        break;
                    }
                  }
                }
                _that.chatList = latestConversationList;
                _that.connectState = true;
              });
          }
        },
        // 监听消息通知
        async message(e) {
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
        },
        // 监听聊天室 KV 数据变更
        chatroom(event) {
          /**
           * 聊天室 KV 存储数据更新
           * @example
           * [
           *  {
           *    "key": "name",
           *    "value": "我是小融融",
           *    "timestamp": 1597591258338,
           *    "chatroomId": "z002",
           *    "type": 1 // 1: 更新（ 含:修改和新增 ）、2: 删除
           *  },
           * ]
           */
          const updatedEntries = event.updatedEntries;
          console.log(updatedEntries);
        },
        expansion(event) {
          /**
           * 更新的消息拓展数据
           * @example {
           *    expansion: { key: 'value' },      // 设置或更新的扩展值
           *    messageUId: 'URIT-URIT-ODMF-DURR' // 设置或更新扩展的消息 uid
           * }
           */
          const updatedExpansion = event.updatedExpansion;
          /**
           * 删除的消息拓展数据
           * @example {
           *    deletedKeys: ['key1', 'key2'],    // 设置或更新的扩展值
           *    messageUId: 'URIT-URIT-ODMF-DURR' // 设置或更新扩展的消息 uid
           * }
           */
          const deletedExpansion = event.deletedExpansion;
          console.log(updatedExpansion, deletedExpansion);
        }
      });
      this.im
        .connect({ token: this.userInfo.chatUser.chatUserToken })
        .then(user => {
          console.log("链接成功, 链接用户 id 为: ", user.id);
          _that.getExistedConversationList(0).then(async conversationList => {
            if (conversationList) {
              for (let i = 0; i < conversationList.length; i++) {
                switch (conversationList[i].type) {
                  case 1:
                    conversationList[i].userInfo = await _that.getInfoIm(
                      conversationList[i].targetId
                    );
                    _that[conversationList[i].targetId] =
                      conversationList[i].userInfo;
                    break;
                  case 3:
                    conversationList[
                      i
                    ].userInfo = await _that.getMemberByGroupNumber(
                      conversationList[i].targetId
                    );
                    _that[conversationList[i].targetId] =
                      conversationList[i].userInfo;
                    break;
                }
              }
              _that.chatList = _that.chatList.concat(conversationList);
              console.log(_that.chatList);
              _that.connectState = true;
            }
          });
        })
        .catch(error => {
          console.log("链接失败: ", error.code, error.msg);
          this.connectState = false;
        });
    },
    // im获取会话列表
    getExistedConversationList(startTime = 0, count = 10) {
      return new Promise((result, reject) => {
        this.im.Conversation.getList({
          count: count,
          startTime: startTime,
          order: 0
        })
          .then(async conversationList => {
            result(conversationList);
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
        this.chatList = this.chatList.concat(res);
      });
    },
    // 消息筛选
    myFilterMsgTypes(item) {
      return filterMsgTypes(item);
    },
    // 切换
    handerIsGrid(item, num) {
      this.dataOption = item;
      this.isGrid = null;
      this.$nextTick(() => {
        switch (num) {
          case 0:
            this.isGrid = "BsNewsMessageList";
            break;
          case 1:
            this.isGrid = "System";
            break;
          case 2:
            console.log(item.sampleFrom == "EXHIBITION", "展厅对公司");
            this.isGrid = "Exhibition";
            break;
          case 3:
            console.log(item.sampleFrom == "SALES", "公司对厂商");
            console.log(item.sampleFrom == "EXHIBITION", "展厅对厂商");
            this.isGrid = "Supplier";
            break;
          case 4:
            console.log(item.sampleFrom == "EXHIBITION", "展厅对公司");
            this.isGrid = "Sales";
            break;
          case 5:
            this.isGrid = "Supplier";
            break;
        }
      });
    }
  },
  created() {},
  mounted() {
    this.watchIm();
  },
  computed: {
    ...mapState(["userInfo"])
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
    // overflow: hidden;
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
