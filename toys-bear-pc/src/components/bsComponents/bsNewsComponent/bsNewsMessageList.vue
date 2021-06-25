<template>
  <div class="bsNewsMessageList">
    <div class="chatMain">
      <div class="head">
        <el-image
          v-if="dataOption.type === 1"
          class="header-img"
          style="width: 30px;height: 30px;border-radius: 50%;position:static;"
          :src="dataOption.userInfo && dataOption.userInfo.avatar"
          fit="contain"
        >
          <div
            slot="placeholder"
            class="image-slot"
            style="width: 30px;height: 30px;border-radius:  50%;"
          >
            <img
              style="width: 30px;height: 30px;border-radius:  50%;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
          <div
            slot="error"
            class="image-slot"
            style="width: 30px;height: 30px;border-radius:  50%;"
          >
            <img
              style="width: 30px;height: 30px;border-radius:  50%;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
        </el-image>
        <el-image
          v-else-if="dataOption.type === 3"
          class="header-img"
          style="width: 30px;height: 30px;border-radius:  50%;position:static;"
          :src="dataOption.userInfo && dataOption.userInfo.userImage"
          fit="contain"
        >
          <div
            slot="placeholder"
            class="image-slot"
            style="width: 30px;height: 30px;border-radius:  50%;"
          >
            <img
              style="width: 30px;height: 30px;border-radius:  50%;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
          <div
            slot="error"
            class="image-slot"
            style="width: 30px;height: 30px;border-radius: 50%;"
          >
            <img
              style="width: 30px;height: 30px;border-radius:  50%;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
        </el-image>
        <p v-if="dataOption.type === 1">
          {{ dataOption.userInfo && dataOption.userInfo.nickname }}
        </p>
        <p v-else-if="dataOption.type === 3">
          {{ dataOption.userInfo && dataOption.userInfo.linkName }}
        </p>
        <i
          class="el-icon-more"
          @click="openChatSetting(dataOption)"
          style="cursor: pointer;"
        ></i>
      </div>
      <div class="center">
        <el-scrollbar style="height: 100%;" ref="myScrollbar">
          <div ref="scrollMain" class="scrollMain">
            <center style="font-size: 20px;" v-show="noScroll">
              <i class="el-icon-loading"></i>
            </center>
            <template v-for="item in chatInfoList">
              <div :key="item.sentTime">
                <!-- 别人 -->
                <div
                  class="others"
                  v-if="item.senderUserId != userInfo.chatUser.chatUserId"
                >
                  <!-- 时间 -->
                  <div class="chart-timer">
                    {{ dateDiff(item.sentTime) }}
                  </div>
                  <div class="item left">
                    <!-- 头像 -->
                    <div class="youTouxiang" @click.stop="openShowCart(item)">
                      <!-- 单聊头像 -->
                      <template v-if="dataOption.type === 1">
                        <el-image
                          class="header-img"
                          style="width: 50px;height: 50px;border-radius: 50%;"
                          :src="
                            dataOption.userInfo && dataOption.userInfo.avatar
                          "
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
                      </template>
                      <!-- 群聊头像 -->
                      <template v-else-if="dataOption.type === 3">
                        <el-image
                          v-if="dataOption.userInfo"
                          class="header-img"
                          style="width: 50px;height: 50px;border-radius: 50%;"
                          :src="
                            filterUserInfo(
                              dataOption.userInfo.groupMemberInfos.items,
                              item
                            ).userImage
                          "
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
                      </template>
                      <!-- 名片 -->
                      <div
                        class="youCart"
                        v-if="dialogBusiness === item.messageUId"
                      >
                        <businessComponent
                          :userIdData="userIdData"
                          @successDeleteFriend="successDeleteFriend"
                        ></businessComponent>
                      </div>
                    </div>
                    <div class="youChat">
                      <!-- 单聊用户名 -->
                      <template v-if="dataOption.type === 1">
                        <span class="name">
                          {{
                            dataOption.userInfo && dataOption.userInfo.nickname
                          }}
                        </span>
                      </template>
                      <!-- 群聊用户名 -->
                      <template v-else-if="dataOption.type === 3">
                        <span class="name" v-if="dataOption.userInfo">
                          {{
                            filterUserInfo(
                              dataOption.userInfo.groupMemberInfos.items,
                              item
                            ).linkman
                          }}
                        </span>
                      </template>
                      <!-- 别人的内容 -->
                      <div class="messageBox">
                        <!-- 文本 -->
                        <span
                          class="message"
                          v-if="item.messageType === 'RC:TxtMsg'"
                        >
                          <a
                            :href="item.content.content"
                            target="_brack"
                            v-if="/^(http)|(www)/.test(item.content.content)"
                            style="color:blue;"
                            >{{ item.content.content }}</a
                          >
                          <span v-else>{{ item.content.content }}</span>
                        </span>
                        <!-- 引用消息 -->
                        <div
                          class="yinyongMsg"
                          v-if="item.messageType === 'RC:ReferenceMsg'"
                        >
                          <div class="yinyong">
                            <div v-if="dataOption.type === 1">
                              <p style="color:#999">
                                @{{ dataOption.userInfo.nickname }}
                              </p>
                              <p>
                                <span style="color:#999">引用：</span>
                                {{ item.content.referMsg.content }}
                              </p>
                            </div>
                            <div v-else-if="dataOption.type === 3">
                              <p style="color:#999">
                                @{{
                                  filterUserInfo(
                                    dataOption.userInfo.groupMemberInfos.items,
                                    {
                                      senderUserId: item.content.referMsgUserId
                                    }
                                  ).linkman
                                }}
                              </p>
                              <p>
                                <span style="color:#999">引用：</span>
                                {{ item.content.referMsg.content }}
                              </p>
                            </div>
                          </div>
                          <p>{{ item.content.content }}</p>
                        </div>
                        <!-- 语音 -->
                        <span
                          class="message"
                          v-if="item.messageType === 'RC:VcMsg'"
                        >
                          <i class="yuyinMsg"></i>
                          <!-- {{ item.content.content }} -->
                        </span>
                        <!-- 图片 -->
                        <div
                          class="imgBox"
                          v-else-if="item.messageType === 'RC:ImgMsg'"
                        >
                          <el-image
                            style="width: 300px; height: 400px; min-width: 300px;"
                            :src="item.content.imageUri"
                            :preview-src-list="[item.content.imageUri]"
                            fit="contain"
                          >
                            <div
                              slot="placeholder"
                              class="image-slot"
                              style="width: 300px; height: 400px; min-width: 300px;"
                            >
                              <img
                                style="width: 300px; height: 400px; min-width: 300px;"
                                :src="require('@/assets/images/imgError.png')"
                              />
                            </div>
                            <div
                              slot="error"
                              class="image-slot"
                              style="width: 300px; height: 400px; min-width: 300px;"
                            >
                              <img
                                style="width: 300px; height: 400px; min-width: 300px;"
                                :src="require('@/assets/images/imgError.png')"
                              />
                            </div>
                          </el-image>
                        </div>
                        <!-- 视频 -->
                        <div
                          class="videoBox"
                          v-else-if="item.messageType === 'XZX:VideoMessage'"
                        >
                          <video
                            class="video-js vjs-default-skin vjs-big-play-centered"
                            controls
                            :lazy-src="item.content.videoUrl"
                            style="object-fit: contain; width: 100%;height: 100%;"
                          >
                            <source
                              :src="item.content.videoUrl"
                              type="video/mp4"
                            />
                          </video>
                        </div>
                        <!-- 订单消息 -->
                        <div
                          class="orderMsgBox"
                          v-else-if="item.messageType === 'XZX:OrderMessage'"
                        >
                          <div class="orderMsg_content">
                            <div class="orderMsg_title">
                              {{ item.content.orderInfo.fromCompanyName }}
                            </div>
                            <div class="orderMsg_item">
                              单号：{{ item.content.orderInfo.orderNumber }}
                            </div>
                            <div class="orderMsg_item">
                              类型：{{ item.content.orderInfo.messageTitle }}
                            </div>
                            <div class="orderMsg_item">
                              内容：{{ item.content.orderInfo.pushContent }}
                            </div>
                          </div>
                          <div
                            class="orderMsg_lookBtn"
                            @click="toOrderDetails(item.content.orderInfo)"
                          >
                            <center>
                              查看详情
                              <i class="el-icon-arrow-right"></i>
                            </center>
                          </div>
                        </div>
                        <!-- 链接 -->
                        <div
                          class="linkMsgBox"
                          @click="openLink(item.content.linkUrl)"
                          v-else-if="item.messageType === 'XZX:LinkMessage'"
                        >
                          <div class="link_left">
                            <vue-qr
                              :text="item.content.linkUrl"
                              :margin="0"
                              :size="82"
                            ></vue-qr>
                          </div>
                          <div class="link_right">
                            <div class="link_productItem">测试分享</div>
                            <div class="link_productItem">线上报价</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 我 -->
                <div class="my" v-else>
                  <!-- 时间 -->
                  <div class="chart-timer">
                    {{ dateDiff(item.sentTime) }}
                  </div>
                  <div class="item right">
                    <img
                      class="header-img"
                      :src="userInfo.userInfo.userImage"
                    />
                    <div class="meChat">
                      <!-- 我的名字 -->
                      <span class="name">{{ userInfo.userInfo.linkman }}</span>
                      <!-- 我的聊天内容 -->
                      <div class="messageBox">
                        <!-- 文本 -->
                        <span
                          class="message"
                          v-if="item.messageType === 'RC:TxtMsg'"
                        >
                          <a
                            :href="item.content.content"
                            target="_brack"
                            v-if="/^(http)|(www)/.test(item.content.content)"
                            style="color:blue;"
                            >{{ item.content.content }}</a
                          >
                          <span v-else>{{ item.content.content }}</span>
                        </span>
                        <!-- 引用消息 -->
                        <div
                          class="myYinyongMsg"
                          v-if="item.messageType === 'RC:ReferenceMsg'"
                        >
                          <div class="yinyong">
                            <div v-if="dataOption.type === 1">
                              <p style="color:#999">
                                @{{ userInfo.userInfo.linkman }}
                              </p>
                              <p>
                                <span style="color:#999">引用：</span>
                                {{ item.content.referMsg.content }}
                              </p>
                            </div>
                            <div v-else-if="dataOption.type === 3">
                              <p style="color:#999">
                                @{{ userInfo.userInfo.linkman }}
                              </p>
                              <p>
                                <span style="color:#999">引用：</span>
                                {{ item.content.referMsg.content }}
                              </p>
                            </div>
                          </div>
                          <p>{{ item.content.content }}</p>
                        </div>
                        <!-- 语音 -->
                        <span
                          class="message"
                          style="color: #fff;"
                          v-if="item.messageType === 'RC:VcMsg'"
                        >
                          <i class="yuyinMsg"></i>
                          <!-- {{ item.content.content }} -->
                        </span>
                        <!-- 图片 -->
                        <div
                          class="imgBox"
                          v-else-if="item.messageType === 'RC:ImgMsg'"
                        >
                          <el-image
                            style="width: 300px; height: 400px; min-width: 100px;"
                            :src="item.content.imageUri"
                            :preview-src-list="[item.content.imageUri]"
                            fit="contain"
                          >
                            <div
                              slot="placeholder"
                              class="image-slot"
                              style="width: 300px; height: 400px; min-width: 100px"
                            >
                              <img
                                style="width: 300px; height: 400px; min-width: 100px"
                                :src="require('@/assets/images/imgError.png')"
                              />
                            </div>
                            <div
                              slot="error"
                              class="image-slot"
                              style="width: 300px; height: 400px; min-width: 100px"
                            >
                              <img
                                style="width: 300px; height: 400px; min-width: 100px"
                                :src="require('@/assets/images/imgError.png')"
                              />
                            </div>
                          </el-image>
                        </div>

                        <!-- 视频 -->
                        <div
                          class="videoBox"
                          v-else-if="item.messageType === 'XZX:VideoMessage'"
                        >
                          <video
                            class="video-js vjs-default-skin vjs-big-play-centered"
                            controls
                            :lazy-src="item.content.videoUrl"
                            style="object-fit: contain; width: 100%;height: 100%;"
                          >
                            <source
                              :src="item.content.videoUrl"
                              type="video/mp4"
                            />
                          </video>
                        </div>
                        <!-- 订单消息 -->
                        <div
                          class="orderMsgBox"
                          v-else-if="item.messageType === 'XZX:OrderMessage'"
                        >
                          <div class="orderMsg_content">
                            <div class="orderMsg_title">
                              {{ item.content.orderInfo.fromCompanyName }}
                            </div>
                            <div class="orderMsg_item">
                              单号：{{ item.content.orderInfo.orderNumber }}
                            </div>
                            <div class="orderMsg_item">
                              类型：{{ item.content.orderInfo.messageTitle }}
                            </div>
                            <div class="orderMsg_item">
                              内容：{{ item.content.orderInfo.pushContent }}
                            </div>
                          </div>
                          <div
                            class="orderMsg_lookBtn"
                            @click="toOrderDetails(item.content.orderInfo)"
                          >
                            <center>
                              查看详情
                              <i class="el-icon-arrow-right"></i>
                            </center>
                          </div>
                        </div>
                        <!-- 链接 -->
                        <div
                          class="linkMsgBox"
                          @click="openLink(item.content.linkUrl)"
                          v-else-if="item.messageType === 'XZX:LinkMessage'"
                        >
                          <div class="link_left">
                            <vue-qr
                              :text="item.content.linkUrl"
                              :margin="0"
                              :size="82"
                            ></vue-qr>
                          </div>
                          <div class="link_right">
                            <div class="link_productItem">测试分享</div>
                            <div class="link_productItem">线上报价</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-scrollbar>
      </div>
      <div class="footer">
        <div class="footerHead">
          <div class="emoticon" v-show="emoticon" @click.stop>
            <el-scrollbar style="height: 100%;">
              <div class="item" v-for="(item, i) in expressionLibrary" :key="i">
                <span class="biaoQing" @click="sendEmoticon(item)">
                  {{ item.emoji }}
                </span>
              </div>
            </el-scrollbar>
          </div>
          <div class="imgBox" @click.stop="emoticon = !emoticon">
            <img src="@/assets/images/biaoq.png" alt="" />
          </div>
          <div class="imgBox" @click="selectFile">
            <img src="@/assets/images/tupian.png" alt="" />
            <el-upload
              action=""
              ref="uploadFile"
              :auto-upload="false"
              :on-change="changeFile"
              :http-request="httpFile"
              :accept="uploadAccept()"
              style="display: none;"
            >
            </el-upload>
          </div>
        </div>
        <div class="input-box">
          <div class="left">
            <el-scrollbar style="height: 100%;">
              <el-input
                class="myInput"
                autosize
                autofocus
                type="textarea"
                @keydown.enter.native="myInputEvent"
                ref="userInfo"
                resize="none"
                placeholder="请输入内容"
                v-model.trim="textInfo"
              >
              </el-input>
            </el-scrollbar>
          </div>
          <div class="right">
            <el-button type="primary" @click="sendClick">发送</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="chattingRecords">
      <transition name="el-fade-in-linear">
        <div class="chat_history" v-show="!isChatSetting">
          <div class="chattingTop">
            <p>聊天记录</p>
          </div>
          <div class="title">
            <div
              :class="{ tabs: true, active: msgType === 0 }"
              @click="checkTabs(0)"
            >
              全部
            </div>
            <div
              :class="{ tabs: true, active: msgType === 2 }"
              @click="checkTabs(2)"
            >
              图片
            </div>
            <div
              :class="{ tabs: true, active: msgType === 4 }"
              @click="checkTabs(4)"
            >
              视频
            </div>
            <div
              :class="{ tabs: true, active: msgType === 3 }"
              @click="checkTabs(3)"
            >
              链接
            </div>
          </div>
          <div class="chattingList" ref="myScrollBox">
            <el-scrollbar
              style="height: 100%;position:relative;"
              ref="histroyScroll"
            >
              <div class="myScrollWrap" ref="myScrollWrap">
                <bsAllMsg v-if="tp === 0" :msgList="historyList" />
                <bsImgMsg v-if="tp === 2" :msgList="historyList" />
                <bsLinkMsg v-if="tp === 3" :msgList="historyList" />
                <bsVideoMsg v-if="tp === 4" :msgList="historyList" />
                <center
                  style="width:100%; position: absolute; top:30px;left:0;font-size:30px;"
                  v-show="isDaoDiLe"
                >
                  <i class="el-icon-loading"></i>
                </center>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </transition>
      <transition name="el-fade-in-linear">
        <div class="chat_setting" v-if="isChatSetting">
          <!-- 群聊设置 -->
          <bsGroupSetting
            :options="dataOption"
            @resetChatList="resetChatList"
            @closeChatSetting="closeChatSetting"
            v-if="dataOption.type === 3"
          />
          <!-- 单聊设置 -->
          <bsSingleChat
            :options="dataOption"
            @closeChatSetting="closeChatSetting"
            v-else-if="dataOption.type === 1"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import eventBus from "@/assets/js/common/eventBus.js";
import { dateDiff, base64file } from "@/assets/js/common/common.js";
import { mapState } from "vuex";
import RongIMLib from "RongIMLib";
import VueQr from "vue-qr";
import bsAllMsg from "./bsNewsMsgComponents/bsAllMsg";
import bsImgMsg from "./bsNewsMsgComponents/bsImgMsg";
import bsLinkMsg from "./bsNewsMsgComponents/bsLinkMsg";
import bsVideoMsg from "./bsNewsMsgComponents/bsVideoMsg";
import bsGroupSetting from "./bsChatSetting/bsGroupSetting";
import bsSingleChat from "./bsChatSetting/bsSingleChat";
import businessComponent from "@/components/commonComponent/friendComponent/businessComponent.vue";
export default {
  name: "bsNewsMessageList",
  props: ["dataOption", "im"],
  components: {
    bsAllMsg,
    bsImgMsg,
    bsLinkMsg,
    bsVideoMsg,
    VueQr,
    bsGroupSetting,
    bsSingleChat,
    businessComponent
  },
  data() {
    return {
      typeList: [], // 业务消息类型
      userIdData: {},
      isChatSetting: false,
      historyPageIndex: 1,
      isDaoDiLe: false,
      tp: 0,
      msgType: 0,
      historyList: [],
      historyTotalCount: 0,
      historyKeyword: "",
      skipCount: 1,
      maxResultCount: 10,
      emoticon: false,
      noScroll: false,
      isFixedTop: false,
      base64Url: null,
      sendMsgType: "RC:TxtMsg",
      textInfo: "",
      dialogBusiness: null,
      hasMore: false,
      chatInfoList: [],
      expressionLibrary: [] // 表情库
    };
  },
  methods: {
    // 获取消息类型
    async getMessageTeplateSettingsByPage(messageModel) {
      const fd = {
        maxResultCount: 9999,
        messageModel: messageModel,
        skipCount: 1
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "")
          delete fd[key];
      }
      const res = await this.$http.post(
        "/api/PushSettings/MessageTeplateSettingsByPage",
        fd
      );
      if (res.data.result.code === 200) {
        this.typeList = res.data.result.item.items;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 查看订单消息详情
    async toOrderDetails(item) {
      console.log(item);
      await this.getMessageTeplateSettingsByPage(item.messageModel);
      const fd = {
        name: "bsHallYewuDetails" + item.orderNumber || item.offerNumber,
        linkUrl: this.$route.path,
        component: "bsHallYewuDetails",
        refresh: true,
        label: item.orderNumber || item.offerNumber,
        value: {
          ...item,
          typeList: this.typeList
        }
      };
      this.$store.commit("myAddTab", fd);
    },
    // 刷新会话列表
    resetChatList({ userImage, linkName }) {
      // this.dataOption.userInfo.userImage = userImage;
      // this.dataOption.userInfo.linkName = linkName;
      console.log(userImage, linkName);
      this.$emit("resetConversationList");
    },
    // 删除好友成功
    successDeleteFriend() {
      this.dialogBusiness = null;
      eventBus.$emit("resetMyFriendList");
    },
    // 关闭聊天设置
    closeChatSetting() {
      this.isChatSetting = false;
    },
    // 打开聊天设置
    openChatSetting(option) {
      if (option.type == 3) {
        const list = option.userInfo.groupMemberInfos.items;
        const flag = list.find(
          val => val.chatUserId === this.userInfo.chatUser.chatUserId
        );
        if (flag) {
          this.isChatSetting = !this.isChatSetting;
        } else {
          this.$common.handlerMsgState({
            msg: "不在群组中",
            type: "danger"
          });
        }
      } else {
        this.isChatSetting = !this.isChatSetting;
      }
    },
    // 点击打开分享链接
    openLink(url) {
      window.open(url, "_blank");
    },
    // 分页获取历史消息
    async getMessageHisByPage(flag) {
      const fd = {
        skipCount: this.historyPageIndex,
        maxResultCount: 10,
        type: this.dataOption.type === 1 ? 1 : 2,
        messageType: this.msgType,
        myChatUserId: this.userInfo.chatUser.chatUserId,
        friendChatUserId: this.dataOption.targetId,
        groupNumber: this.dataOption.type === 1 ? "" : this.dataOption.targetId,
        keyWord: this.historyKeyword
      };
      const res = await this.$im_http.post("/api/Message/MessageHisByPage", fd);
      if (res.data.result.code === 200) {
        if (flag)
          this.historyList = this.historyList.concat(
            res.data.result.item.items
          );
        else this.historyList = res.data.result.item.items;
        this.historyTotalCount = res.data.result.item.totalCount;
        this.isDaoDiLe = false;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 发送表情
    sendEmoticon(b) {
      this.textInfo += b.emoji;
    },
    // 聊天窗口滚动事件
    handleScroll() {
      // 聊天窗体
      let scrollbarEl = this.$refs.myScrollbar.wrap;
      scrollbarEl.onscroll = () => {
        // 到顶部了
        if (scrollbarEl.scrollTop < 1) {
          this.isFixedTop = true;
          // 是否还有历史数据可获取 hasMore
          if (this.hasMore) {
            // console.log(this.hasMore, "还有历史消息");
            this.noScroll = true;
            const startTime =
              this.chatInfoList[0] && this.chatInfoList[0].sentTime;
            const scrollHeight = scrollbarEl.scrollHeight;
            this.getHistoryChat(startTime, scrollHeight);
          }
        } else {
          this.isFixedTop = false;
        }
      };
      // 历史聊条滚动
      let histroyScrollEl = this.$refs.histroyScroll.wrap;
      const myScrollBox = this.$refs.myScrollBox;
      const myWrapBox = this.$refs.myScrollWrap;
      histroyScrollEl.onscroll = () => {
        // 到底部了
        if (
          histroyScrollEl.scrollTop ===
          myWrapBox.scrollHeight - (myScrollBox.offsetHeight - 40)
        ) {
          // 是否还有历史数据可获取
          if (this.historyList.length < this.historyTotalCount) {
            this.isDaoDiLe = true;
            this.historyPageIndex++;
            this.getMessageHisByPage(true);
          }
        }
        // else {
        //   this.isDaoDiLe = false;
        // }
      };
    },
    // 发送上传图片
    async httpFile(file) {
      let url64 = await base64file(file.raw, this.sendMsgType);
      if (url64) {
        url64 = url64.split(",")[1];
      }
      const fd = new FormData();
      fd.append("file", file.raw);
      const res = await this.$http.post("/api/File/MessageUploadFile", fd);
      const { code, object, message } = res.data.result;
      if (code === 200) {
        if (object && object[0]) {
          const url = object[0].filePath;
          const option = {
            targetId: this.dataOption.targetId,
            messageType: this.sendMsgType
          };
          switch (this.sendMsgType) {
            case "RC:TxtMsg":
              option.content = {
                content: {
                  content: this.textInfo
                }
              };
              break;
            case "RC:ImgMsg":
              option.content = {
                content: url64,
                imageUri: url
              };
              break;
            case "XZX:VideoMessage":
              option.content = {
                videoCoverBase64: url64,
                videoUrl: url
              };
              break;
          }
          this.sendInfo(option);
        }
      } else {
        this.$common.handlerMsgState({
          msg: message,
          type: "danger"
        });
      }
    },
    // 选择文件
    changeFile(file) {
      // 当前选中文件
      const rowFileType = file.raw.type.split("/")[1].toUpperCase();
      // 当前选中文件的大小
      const rowFileSize = file.size;
      // 图片
      const imgType = this.globalJson.Json.MessageRestriction[0].itemCode;
      const imgSize = Number(
        this.globalJson.Json.MessageRestriction[7].itemCode
      );
      // 视频
      const videoType = this.globalJson.Json.MessageRestriction[2].itemCode;
      const videoSize = Number(
        this.globalJson.Json.MessageRestriction[6].itemCode
      );
      // 文件
      // const fileType = this.globalJson.Json.MessageRestriction[4].itemCode;
      // const fileSize = Number(
      //   this.globalJson.Json.MessageRestriction[8].itemCode
      // );
      // 图片
      if (imgType.includes(rowFileType)) {
        this.sendMsgType = "RC:ImgMsg";
        if (rowFileSize > imgSize) {
          this.$common.handlerMsgState({
            msg: "图片太大",
            type: "danger"
          });
          return false;
        }
        // 视频
      } else if (videoType.includes(rowFileType)) {
        this.sendMsgType = "XZX:VideoMessage";
        if (rowFileSize > videoSize) {
          this.$common.handlerMsgState({
            msg: "视频太大",
            type: "danger"
          });
          return false;
        }
      }
      this.httpFile(file);
    },
    // 选择文件
    selectFile() {
      this.$refs.uploadFile.$refs["upload-inner"].handleClick();
    },
    // 限制文件类型
    uploadAccept() {
      return (
        this.globalJson.Json.MessageRestriction[0].itemCode +
        "," +
        this.globalJson.Json.MessageRestriction[2].itemCode
        // "," +
        // this.globalJson.Json.MessageRestriction[4].itemCode
      );
    },
    // 点击头像打开卡片
    openShowCart(item) {
      console.log(this.dataOption, item);
      if (item.type === 1) {
        this.userIdData = {
          companyId:
            this.dataOption.userInfo && this.dataOption.userInfo.companyId,
          id: this.dataOption.userInfo && this.dataOption.userInfo.userId
        };
      } else if (item.type === 3) {
        this.userIdData = {
          companyId:
            this.dataOption.userInfo &&
            this.filterUserInfo(
              this.dataOption.userInfo.groupMemberInfos.items,
              item
            ).companyId,
          id:
            this.dataOption.userInfo &&
            this.filterUserInfo(
              this.dataOption.userInfo.groupMemberInfos.items,
              item
            ).id
        };
      }
      this.dialogBusiness = item.messageUId;
    },
    // 筛选群聊聊天用户信息
    filterUserInfo(list, item) {
      const user = list.find(v => v.chatUserId === item.senderUserId);
      if (user) return user;
    },
    // 记录聊天消息
    recordMessageHis(fd) {
      this.$im_http.post("/api/Message/RecordMessageHis", fd).then(() => {
        this.historyPageIndex = 1;
        this.getMessageHisByPage(false);
      });
    },
    // 刷新历史记录
    resetHistoryChat(msg) {
      var conversation = this.im.Conversation.get({
        targetId: this.dataOption.targetId,
        type: this.dataOption.type
      });
      var option = {
        timestamp: +new Date(),
        count: 20
      };
      conversation.getMessages(option).then(() => {
        console.log(msg.messageType);
        if (msg.messageType === "RC:ReadNtf") {
          // console.log("已读");
        } else if (msg.messageType === "RC:TypSts") {
          // console.log("正在输入");
        } else if (msg.messageType === "RC:SRSMsg") {
          // console.log("取消输入");
        } else {
          // 回复成功
          this.chatInfoList.push(msg);
        }
        // 清除未读
        this.clearReadInfo();
        this.historyPageIndex = 1;
        this.getMessageHisByPage(false);
      });
    },
    // im获取历史消息,聊天窗口消息
    getHistoryChat(startTime, height) {
      var conversation = this.im.Conversation.get({
        targetId: this.dataOption.targetId,
        type: this.dataOption.type
      });
      var option = {
        timestamp: startTime || +new Date(),
        count: 20
      };
      conversation
        .getMessages(option)
        .then(result => {
          var list = result.list; // 历史消息列表
          this.hasMore = result.hasMore; // 是否还有历史消息可以获取
          if (startTime) {
            this.chatInfoList = [...list, ...this.chatInfoList];
            this.$nextTick(() => {
              this.$refs["myScrollbar"].wrap.scrollTop =
                this.$refs["myScrollbar"].wrap.scrollHeight - height;
              this.noScroll = false;
            });
          } else {
            this.chatInfoList = list;
          }
          // 清除未读
          this.clearReadInfo();
        })
        .catch(err => {
          console.log(err);
          switch (err.code) {
            case 22406:
              this.$common.handlerMsgState({
                msg: "不在群组中",
                type: "danger"
              });
              break;
            case 405:
              this.$common.handlerMsgState({
                msg: "已被对方加入黑名单",
                type: "danger"
              });
              break;
            case 22408:
              this.$common.handlerMsgState({
                msg: "在群组中被禁言",
                type: "danger"
              });
              break;
            case 30001:
              this.$common.handlerMsgState({
                msg: "用户未连接成功, 需连接成功后再执行",
                type: "danger"
              });
              break;
          }
        });
    },
    // 清除未读
    clearReadInfo() {
      const qingchu = this.im.Conversation.get({
        targetId: this.dataOption.targetId,
        type: this.dataOption.type
      });
      qingchu.read().then(function() {
        console.log("清除未读数成功"); // im.watch conversation 将被触发
      });
    },
    // 格式化时间
    dateDiff(time) {
      return dateDiff(time);
    },
    // 切换专聊天记录
    async checkTabs(num) {
      this.msgType = 0;
      this.msgType = num;
      this.historyPageIndex = 1;
      this.tp = num;
      this.getMessageHisByPage(false);
    },
    // 发送消息
    sendInfo({ targetId, messageType, content }) {
      var conversation = this.im.Conversation.get({
        targetId: targetId,
        type: this.dataOption.type
      });
      conversation
        .send({
          messageType: messageType, // 填写开发者定义的 messageType
          content: content
        })
        .then(message => {
          console.log(message, "发送了消息");
          const fd = {
            chatType: message.type == 1 ? 1 : 2,
            targetId: message.targetId,
            rongCloudMessageType: message.messageType,
            content:
              message.messageType == "RC:TxtMsg" ? message.content.content : "",
            attachment:
              message.messageType == "RC:ImgMsg"
                ? message.content.imageUri
                : message.messageType == "XZX:VideoMessage"
                ? message.content.videoUrl
                : ""
          };
          this.recordMessageHis(fd);
          this.chatInfoList.push(message);
        })
        .catch(err => {
          console.log(err, "发送报错了");
          switch (err.code) {
            case 20604:
              this.$common.handlerMsgState({
                msg: "发送频率过快",
                type: "danger"
              });
              break;
            case 22406:
              this.$common.handlerMsgState({
                msg: "不在群组中",
                type: "danger"
              });
              break;
            case 405:
              this.$common.handlerMsgState({
                msg: "已被对方加入黑名单",
                type: "danger"
              });
              break;
            case 22408:
              this.$common.handlerMsgState({
                msg: "在群组中被禁言",
                type: "danger"
              });
              break;
            case 30001:
              this.$common.handlerMsgState({
                msg: "用户未连接成功, 需连接成功后再执行",
                type: "danger"
              });
              break;
            case 34009:
              this.$common.handlerMsgState({
                msg: "发送扩展消息失败",
                type: "danger"
              });
              break;
            default:
              this.$common.handlerMsgState({
                msg: "发送失败，错误码：" + err.code + "，请联系管理员",
                type: "danger"
              });
          }
        });
    },
    // 按钮发送文本
    sendClick() {
      if (!this.textInfo) {
        this.$common.handlerMsgState({
          msg: "发送内容不能为空",
          type: "danger"
        });
        return false;
      }
      this.sendMsgType = "RC:TxtMsg";

      this.sendInfo({
        targetId: this.dataOption.targetId,
        messageType: "RC:TxtMsg",
        content: {
          content: this.textInfo
        }
      });
      this.textInfo = "";
    },
    // 发送文本消息
    myInputEvent(e) {
      //阻止默认浏览器动作(W3C)
      if (e && e.preventDefault) e.preventDefault();
      //IE中阻止函数器默认动作的方式
      else window.event.returnValue = false;
      if (e.ctrlKey && e.keyCode == 13) {
        // 用户点击了ctrl+enter触发
        this.textInfo += "\n";
      } else {
        //用户点击了enter触发
        if (!this.textInfo) {
          this.$common.handlerMsgState({
            msg: "发送内容不能为空",
            type: "danger"
          });
          return false;
        }
        this.sendInfo({
          targetId: this.dataOption.targetId,
          messageType: "RC:TxtMsg",
          content: {
            content: this.textInfo
          }
        });
        this.textInfo = "";
      }
    }
  },
  created() {},
  mounted() {
    RongIMLib.RongIMEmoji.init();
    this.expressionLibrary = RongIMLib.RongIMEmoji.list;
    this.getHistoryChat();
    // 名片弹框关闭
    eventBus.$on("handleHiddle", () => {
      this.dialogBusiness = null;
    });
    eventBus.$on("hideEmoticon", () => {
      this.emoticon = false;
    });
    this.handleScroll();
    this.getMessageHisByPage();
    console.log(this.dataOption);
  },
  watch: {
    chatInfoList: {
      deep: false,
      handler() {
        if (this.noScroll) {
          return false;
        }
        this.$nextTick(() => {
          this.$refs["myScrollbar"].wrap.scrollTop = this.$refs[
            "scrollMain"
          ].scrollHeight;
        });
      }
    }
  },
  computed: {
    ...mapState(["userInfo", "globalJson"])
  },
  beforeDestroy() {
    eventBus.$off("handleHiddle");
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsNewsMessageList {
  width: 80%;
  display: flex;
  .chatMain {
    border-radius: 4px;
    flex-grow: 1;
    background: #ffffff;
    height: 770px;
    .head {
      height: 54px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;
      .el-image {
        width: 30px;
        height: 30px;
        margin: 0 13px 0 20px;
        border-radius: 50%;
      }
      p {
        flex: 1;
        font-size: 15px;
        font-weight: 700;
        color: #333333;
        line-height: 34px;
      }
      i {
        width: 50px;
        height: 100%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .center {
      height: 540px;
      padding: 5px 0;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
      // .scrollMain {
      //   white-space: normal;
      //   word-break: break-all;
      // }
      .item {
        display: flex;
        margin-bottom: 10px;
      }
      .left {
        flex-direction: row;
        padding-left: 25px;
        .youTouxiang {
          position: relative;
          margin-bottom: 20px;
          .header-img {
            cursor: pointer;
          }
          .el-image {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
          .youCart {
            position: absolute;
            width: 300px;
            height: 406px;
            left: 65px;
            top: 28px;
            background: #ffffff;
            border-radius: 4px;
            border-bottom: 1px solid #e5e5e5;
            box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
            box-sizing: border-box;
            .header {
              height: 90px;
              box-sizing: border-box;
              padding: 20px;
              border-bottom: 1px solid #dcdfe6;
              display: flex;
              .imgBox {
                width: 70px;
                min-width: 70px;
              }
              .nameBox {
                .name {
                  font-size: 18px;
                  font-weight: 700;
                  width: 190px;
                  color: #333333;
                  overflow: hidden; /*超出部分隐藏*/
                  white-space: nowrap; /*不换行*/
                  text-overflow: ellipsis; /*超出部分文字以...显示*/
                }
                .company {
                  font-size: 14px;
                  font-weight: 400;
                  width: 190px;
                  color: #999999;
                  line-height: 34px;
                  overflow: hidden; /*超出部分隐藏*/
                  white-space: nowrap; /*不换行*/
                  text-overflow: ellipsis; /*超出部分文字以...显示*/
                }
              }
            }
            .contentBody {
              padding: 20px;
              .contentBody_item {
                padding-bottom: 20px;
                overflow: hidden; /*超出部分隐藏*/
                white-space: nowrap; /*不换行*/
                text-overflow: ellipsis; /*超出部分文字以...显示*/
                .item_title {
                  color: #999999;
                  margin-right: 30px;
                }
                .factory {
                  color: #3368a9;
                  cursor: pointer;
                }
                .openEditRemark {
                  cursor: pointer;
                }
                &:last-of-type {
                  border-bottom: 1px solid #dcdfe6;
                }
              }
            }
            .foot_btns {
              padding: 15px 20px;
              .el-button {
                width: 100%;
                margin: 0;
                &:last-of-type {
                  margin-top: 15px;
                }
              }
            }
          }
        }
        .youChat {
          margin-left: 15px;
          margin-right: 50px;
          .name {
            color: #333;
          }
          .messageBox {
            margin-top: 10px;
            max-width: 500px;
            white-space: normal;
            word-break: break-all;
            .message {
              color: #666;
              background: #f5f7fa;
              border: 1px solid #e6e9ee;
              white-space: normal;
              word-break: break-all;
              // word-break: break-word;
              // white-space: pre-wrap; /* css-3 */
              // white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
              // white-space: -pre-wrap; /* Opera 4-6 */
              // white-space: -o-pre-wrap; /* Opera 7 */
              // word-wrap: break-word; /* Internet Explorer 5.5+ */

              .yuyinMsg {
                width: 13px;
                height: 17px;
                cursor: pointer;
                background: url("~@/assets/images/yuyinMsg.png") no-repeat
                  center;
                background-size: contain;
              }
            }
            .yinyongMsg {
              color: #666;
              background: #f5f7fa;
              border: 1px solid #e6e9ee;
              border-radius: 10px;
              padding: 9px 10px;
              .yinyong {
                .name {
                  color: #999;
                }
              }
            }
            .imgBox {
              box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
            }
            .videoBox {
              width: 400px;
              height: 250px;
            }
            .orderMsgBox {
              width: 462px;
              // height: 203px;
              background: #ffffff;
              border: 1px solid #3368a9;
              border-radius: 0px 5px 5px 5px;
              .orderMsg_content {
                box-sizing: border-box;
                padding: 15px;
                .orderMsg_title {
                  font-weight: 700;
                }
                .orderMsg_item {
                  margin-top: 5px;
                  overflow: hidden; /*超出部分隐藏*/
                  white-space: nowrap; /*不换行*/
                  text-overflow: ellipsis; /*超出部分文字以...显示*/
                }
              }
              .orderMsg_lookBtn {
                padding: 16px;
                box-sizing: border-box;
                border-top: 1px solid #3368a9;
                color: #3368a9;
                cursor: pointer;
              }
            }
            .linkMsgBox {
              height: 100px;
              width: 300px;
              background-color: #f5f5f5;
              border-radius: 10px;
              padding: 9px 10px;
              box-sizing: border-box;
              display: flex;
              cursor: pointer;
              .link_left {
                width: 82px;
                min-width: 82px;
                min-height: 82px;
                background-color: #ccc;
              }
              .link_right {
                margin-left: 10px;
                flex: 1;
                overflow: hidden; /*超出部分隐藏*/
                white-space: nowrap; /*不换行*/
                text-overflow: ellipsis; /*超出部分文字以...显示*/
                .link_productItem {
                  margin-top: 15px;
                  overflow: hidden; /*超出部分隐藏*/
                  white-space: nowrap; /*不换行*/
                  text-overflow: ellipsis; /*超出部分文字以...显示*/
                }
              }
            }
          }
        }
      }

      .right {
        flex-direction: row-reverse;
        padding-right: 35px;
        display: flex;
        .meChat {
          flex-direction: row-reverse;
          text-align: right;
          margin-right: 15px;
          margin-left: 50px;
          .name {
            color: #333;
          }
          .messageBox {
            margin-top: 10px;
            max-width: 500px;
            .message {
              color: #fff;
              background-color: #3368a9;
              word-break: break-word;
              text-align: left;
              .yuyinMsg {
                width: 13px;
                height: 17px;
                cursor: pointer;
                background: url("~@/assets/images/myYuyinMsg.png") no-repeat
                  center;
                background-size: contain;
              }
            }
            .myYinyongMsg {
              color: #fff;
              background-color: #3368a9;
              border: 1px solid #3368a9;
              border-radius: 10px;
              padding: 9px 10px;
              text-align: left;
              .yinyong {
                .name {
                  color: #999;
                }
              }
            }
            .imgBox {
              box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
            }
            .videoBox {
              width: 400px;
              height: 250px;
            }
            .orderMsgBox {
              text-align: left;
              width: 462px;
              // height: 203px;
              background: #ffffff;
              border: 1px solid #3368a9;
              border-radius: 5px 0px 5px 5px;
              .orderMsg_content {
                box-sizing: border-box;
                padding: 15px;
                .orderMsg_title {
                  font-weight: 700;
                }
                .orderMsg_item {
                  margin-top: 5px;
                  overflow: hidden; /*超出部分隐藏*/
                  white-space: nowrap; /*不换行*/
                  text-overflow: ellipsis; /*超出部分文字以...显示*/
                }
              }
              .orderMsg_lookBtn {
                padding: 16px;
                box-sizing: border-box;
                border-top: 1px solid #3368a9;
                color: #3368a9;
                cursor: pointer;
              }
            }
            .linkMsgBox {
              height: 100px;
              width: 300px;
              background-color: #f5f5f5;
              border-radius: 10px;
              padding: 9px 10px;
              box-sizing: border-box;
              display: flex;
              cursor: pointer;
              .link_left {
                width: 82px;
                min-width: 82px;
                min-height: 82px;
                background-color: #ccc;
              }
              .link_right {
                text-align: left;
                margin-left: 10px;
                flex: 1;
                overflow: hidden; /*超出部分隐藏*/
                white-space: nowrap; /*不换行*/
                text-overflow: ellipsis; /*超出部分文字以...显示*/
                .link_productItem {
                  margin-top: 15px;
                  overflow: hidden; /*超出部分隐藏*/
                  white-space: nowrap; /*不换行*/
                  text-overflow: ellipsis; /*超出部分文字以...显示*/
                }
              }
            }
          }
        }
      }

      .header-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: contain;
      }
      .chart-timer {
        text-align: center;
        color: #999;
        font-size: 13px;
        padding: 20px 0;
      }
      .message {
        border-radius: 10px;
        display: flex;
        min-height: 25px;
        padding: 9px 10px;
        align-items: center;
        white-space: normal;
        word-break: break-all;
      }
    }
    .footer {
      height: 170px;
      box-sizing: border-box;
      border-top: 1px solid #dcdfe6;
      padding: 0 20px 20px;
      .footerHead {
        display: flex;
        align-items: center;
        height: 46px;
        position: relative;
        // 表情包库
        .emoticon {
          position: absolute;
          z-index: 1;
          width: 100%;
          height: 200px;
          border: 1px solid #dcdfe6;
          background-color: #fff;
          box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
          border-radius: 4px;
          left: -100px;
          top: -210px;
          padding: 0 0 5px 5px;
          .item {
            display: inline-block;
            width: 30px;
            height: 30px;
            margin-top: 1px;
            margin-right: 2px;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;
            line-height: 29px;
            border-radius: 4px;
            .biaoQing {
              cursor: pointer;
              font-size: 20px;
              transition: all 0.5s;
            }
            &:hover {
              background-color: #f1f1f2;
              .biaoQing {
                font-size: 21px;
              }
            }
          }
        }
        .imgBox {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          cursor: pointer;
          margin-right: 3px;
        }
        img {
          width: 18px;
          height: 18px;
        }
      }
      .input-box {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        height: 115px;
        box-sizing: border-box;
        display: flex;
        .left {
          flex: 1;
          @{deep} .myInput {
            .el-textarea__inner {
              // resize: none; // 去掉右角下的斜线
              min-height: 110px !important;
              overflow-y: hidden;
              border: none;
            }
          }
        }
        .right {
          width: 100px;
          min-width: 100px;
          position: relative;
          .el-button {
            position: absolute;
            right: 0;
            right: 12px;
            bottom: 12px;
            width: 80px;
            height: 36px;
            background: #3368a9;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 400;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
  .chattingRecords {
    width: 458px;
    height: 770px;
    background: #ffffff;
    border-radius: 4px;
    margin-left: 20px;
    position: relative;
    .chat_history,
    .chat_setting {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .chattingTop {
      padding-left: 20px;
      height: 54px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;
      p {
        font-size: 15px;
        font-weight: 700;
        color: #333333;
        line-height: 34px;
      }
    }
    .title {
      height: 50px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;
      .tabs {
        width: 80px;
        height: 50px;
        box-sizing: border-box;
        border-bottom: 2px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        margin: 0 10px;
        cursor: pointer;
        &.active {
          font-weight: 600;
          border-color: #3368a9;
          color: #3368a9;
        }
      }
    }
    .chattingList {
      height: 664px;
      padding: 20px;
      box-sizing: border-box;
      // overflow-x: hidden;
      // overflow-y: auto;
    }
  }
}
@{deep} .el-scrollbar__wrap {
  overflow-x: hidden;
  .el-scrollbar__view {
    height: 100%;
  }
}
</style>
