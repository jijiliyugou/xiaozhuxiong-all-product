import * as RongIMLib from "@rongcloud/imlib-v4";

class IM {
  constructor() {
    this.$IM = RongIMLib.init({ appkey: "bmdehs6pbfaas" });
  }

  login(loginIMState, newChatList, newMessage, groupChat) {
    this.$IM.watch({
      // 监听会话列表变更事件
      conversation(event) {
        // 假定存在 getExistedConversationList 方法，以获取当前已存在的会话列表数据
        const conversationList = []; // getExistedConversationList()
        // 发生变更的会话列表
        const updatedConversationList = event.updatedConversationList;
        // 通过 im.Conversation.merge 计算最新的会话列表
        const latestConversationList = this.$IM.Conversation.merge({
          conversationList,
          updatedConversationList
        });
        newChatList(latestConversationList);
      },
      // 监听消息通知
      message(event) {
        // 新接收到的消息内容
        newMessage(event.message);
      },
      // 监听 IM 连接状态变化
      status(event) {
        let state;
        switch (event.status) {
          case 0:
            state = "连接成功";
            break;
          case 1:
            state = "正在链接";
            break;
          case 2:
            state = "链接已断开";
            break;
          case 6:
            state = "其他设备登录(被踢)";
            break;
          case 12:
            state = "域名不正确, 请至开发者后台查看安全域名配置";
            break;
          case 3:
            state = "网络不可用, 此时可调用 reconnect 进行重连";
            break;
          default:
            state = "链接状态为：" + event.status;
            break;
        }
        loginIMState(state);
      },
      // 监听聊天室 KV 数据变更
      chatroom(event) {
        groupChat(event.updatedEntries);
      }
    });
  }
}
export default IM;
