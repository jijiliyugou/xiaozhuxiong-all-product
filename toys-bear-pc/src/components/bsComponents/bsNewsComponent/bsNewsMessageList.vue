<template>
  <div class="bsNewsMessageList">
    <div class="chatMain">
      <div class="head">
        <img
          v-if="dataOption.type === 1"
          :src="dataOption.userInfo && dataOption.userInfo.avatar"
          alt=""
        />
        <img
          v-else-if="dataOption.type === 3"
          :src="dataOption.userInfo && dataOption.userInfo.userImage"
          alt=""
        />
        <p v-if="dataOption.type === 1">
          {{ dataOption.userInfo && dataOption.userInfo.nickname }}
        </p>
        <p v-else-if="dataOption.type === 3">
          {{ dataOption.userInfo && dataOption.userInfo.linkName }}
        </p>
        <i class="el-icon-more"></i>
      </div>
      <div class="center">
        <el-scrollbar style="height: 100%;" ref="myScrollbar">
          <div ref="scrollMain" class="scrollMain">
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
                          style="width: 50px;height: 50px;border-radius: 100px;"
                          :src="
                            dataOption.userInfo && dataOption.userInfo.avatar
                          "
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
                      </template>
                      <!-- 群聊头像 -->
                      <template v-else-if="dataOption.type === 3">
                        <el-image
                          v-if="dataOption.userInfo"
                          class="header-img"
                          style="width: 50px;height: 50px;border-radius: 100px;"
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
                      </template>
                      <!-- 名片 -->
                      <div
                        class="youCart"
                        v-show="dialogBusiness === item.messageUId"
                      >
                        <div class="header">
                          <div class="imgBox">
                            <template v-if="dataOption.type === 1">
                              <el-image
                                class="header-img"
                                style="width: 50px;height: 50px;border-radius: 100px;position:static;"
                                :src="
                                  dataOption.userInfo &&
                                    dataOption.userInfo.avatar
                                "
                                fit="contain"
                              >
                                <div
                                  slot="placeholder"
                                  class="image-slot"
                                  style="width: 50px;height: 50px;border-radius: 100px;"
                                >
                                  <img
                                    style="width: 50px;height: 50px;border-radius: 100px;"
                                    :src="
                                      require('@/assets/images/imgError.png')
                                    "
                                  />
                                </div>
                                <div
                                  slot="error"
                                  class="image-slot"
                                  style="width: 50px;height: 50px;border-radius: 100px;"
                                >
                                  <img
                                    style="width: 50px;height: 50px;border-radius: 100px;"
                                    :src="
                                      require('@/assets/images/imgError.png')
                                    "
                                  />
                                </div>
                              </el-image>
                            </template>
                            <!-- 群聊头像 -->
                            <template v-else-if="dataOption.type === 3">
                              <el-image
                                v-if="dataOption.userInfo"
                                class="header-img"
                                style="width: 50px;height: 50px;border-radius: 100px;position:static;"
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
                                  style="width: 50px;height: 50px;border-radius: 100px;"
                                >
                                  <img
                                    style="width: 50px;height: 50px;border-radius: 100px;"
                                    :src="
                                      require('@/assets/images/imgError.png')
                                    "
                                  />
                                </div>
                                <div
                                  slot="error"
                                  class="image-slot"
                                  style="width: 50px;height: 50px;border-radius: 100px;"
                                >
                                  <img
                                    style="width: 50px;height: 50px;border-radius: 100px;"
                                    :src="
                                      require('@/assets/images/imgError.png')
                                    "
                                  />
                                </div>
                              </el-image>
                            </template>
                          </div>
                          <div class="nameBox">
                            <div class="name" v-if="dataOption.type === 1">
                              {{
                                dataOption.userInfo &&
                                  dataOption.userInfo.nickname
                              }}
                            </div>
                            <template v-else-if="dataOption.type === 3">
                              <div class="name" v-if="dataOption.userInfo">
                                {{
                                  filterUserInfo(
                                    dataOption.userInfo.groupMemberInfos.items,
                                    item
                                  ).linkman
                                }}
                              </div>
                            </template>

                            <div class="company">成卓玩具厂成卓玩具厂成卓</div>
                          </div>
                        </div>
                        <div class="contentBody">
                          <p class="contentBody_item">
                            <span class="item_title">性名：</span>
                            <span v-if="dataOption.type === 1">
                              {{
                                dataOption.userInfo &&
                                  dataOption.userInfo.nickname
                              }}
                            </span>
                            <template v-else-if="dataOption.type === 3">
                              <span v-if="dataOption.userInfo">
                                {{
                                  filterUserInfo(
                                    dataOption.userInfo.groupMemberInfos.items,
                                    item
                                  ).linkman
                                }}
                              </span>
                            </template>
                          </p>
                          <p class="contentBody_item">
                            <template v-if="dataOption.userInfo">
                              <span class="item_title">手机：</span>
                              <span
                                v-if="
                                  dataOption.type === 1 &&
                                    dataOption.userInfo.phoneNumber
                                "
                              >
                                {{ dataOption.userInfo.phoneNumber }}
                              </span>
                              <span v-else-if="dataOption.type === 3">
                                {{
                                  filterUserInfo(
                                    dataOption.userInfo.groupMemberInfos.items,
                                    item
                                  ).phoneNumber
                                }}
                              </span>
                            </template>
                          </p>
                          <p
                            class="contentBody_item"
                            v-if="dataOption.userInfo"
                          >
                            <template>
                              <span class="item_title">公司：</span>
                              <span
                                class="factory"
                                v-if="
                                  dataOption.type === 1 &&
                                    dataOption.userInfo.companyName
                                "
                              >
                                {{ dataOption.userInfo.companyName }}
                              </span>
                              <span
                                v-else-if="dataOption.type === 3"
                                class="factory"
                              >
                                {{
                                  filterUserInfo(
                                    dataOption.userInfo.groupMemberInfos.items,
                                    item
                                  ).companyName
                                }}
                              </span>
                            </template>
                          </p>
                          <p class="contentBody_item">
                            <span class="item_title">备注：</span>
                            <span class="el-icon-edit openEditRemark"></span>
                          </p>
                        </div>
                        <!-- 按钮 -->
                        <div class="foot_btns">
                          <el-button type="primary" size="medium">
                            发消息
                          </el-button>
                          <el-button type="danger" size="medium" plain>
                            删除好友
                          </el-button>
                        </div>
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
                          {{ item.content.content }}
                        </span>
                        <!-- 引用消息 -->
                        <div
                          class="yinyongMsg"
                          v-if="item.messageType === 'RC:ReferenceMsg'"
                        >
                          <div class="yinyong">
                            <p v-if="dataOption.type === 1">
                              <span class="name">
                                引用@
                                {{
                                  dataOption.userInfo &&
                                    dataOption.userInfo.nickname
                                }}
                              </span>
                            </p>
                            <p v-else-if="dataOption.type === 3">
                              <span class="name">
                                引用@
                                {{
                                  filterUserInfo(
                                    dataOption.userInfo.groupMemberInfos.items,
                                    {
                                      senderUserId: item.content.referMsgUserId
                                    }
                                  ).linkman
                                }}:
                                <span>
                                  {{ item.content.referMsg.content }}</span
                                >
                              </span>
                            </p>
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
                          {{ item.content.content }}
                        </span>
                        <!-- 语音 -->
                        <span
                          class="message"
                          v-if="item.messageType === 'RC:VcMsg'"
                        >
                          {{ item.content.content }}
                        </span>
                        <!-- 引用消息 -->
                        <div
                          class="yinyongMsg"
                          v-if="item.messageType === 'RC:ReferenceMsg'"
                        >
                          <div class="yinyong">
                            <p v-if="dataOption.type === 1">
                              <span class="name">
                                引用@
                                {{
                                  dataOption.userInfo &&
                                    dataOption.userInfo.nickname
                                }}
                              </span>
                            </p>
                            <p v-else-if="dataOption.type === 3">
                              <span class="name">
                                引用@
                                {{
                                  filterUserInfo(
                                    dataOption.userInfo.groupMemberInfos.items,
                                    {
                                      senderUserId: item.content.referMsgUserId
                                    }
                                  ).linkman
                                }}:
                                <span>
                                  {{ item.content.referMsg.content }}</span
                                >
                              </span>
                            </p>
                          </div>
                          <p>{{ item.content.content }}</p>
                        </div>
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
      <div class="chattingTop">
        <p>聊天记录</p>
      </div>
      <div class="title">
        <div
          :class="{ tabs: true, active: isDiyu === 0 }"
          @click="checkTabs(0)"
        >
          全部
        </div>
        <div
          :class="{ tabs: true, active: isDiyu === 1 }"
          @click="checkTabs(1)"
        >
          图片
        </div>
        <div
          :class="{ tabs: true, active: isDiyu === 2 }"
          @click="checkTabs(2)"
        >
          视频
        </div>
        <div
          :class="{ tabs: true, active: isDiyu === 3 }"
          @click="checkTabs(3)"
        >
          链接
        </div>
      </div>
      <div class="chattingList">
        <div class="recordData">
          <div class="cecorLeft">
            <img src="@/assets/images/imgError.png" alt="" />
          </div>
          <div class="cecorRight">
            <div class="cecorHead">
              <p>名字</p>
              <p>28分钟前</p>
            </div>
            <div class="cecorMain">
              <p>聊天消息</p>
              <!-- <img src="" alt="" /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from "@/assets/js/common/eventBus.js";
import { dateDiff, base64file } from "@/assets/js/common/common.js";
import { mapState } from "vuex";
import RongIMLib from "RongIMLib";
export default {
  name: "bsNewsMessageList",
  props: ["dataOption", "im"],
  data() {
    return {
      msgType: 1,
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
      isDiyu: 0,
      chatInfoList: [],
      expressionLibrary: [] // 表情库
    };
  },
  methods: {
    // 分页获取历史消息
    async getMessageHisByPage() {
      const fd = {
        skipCount: 1,
        maxResultCount: 10,
        type: this.dataOption.type === 1 ? 1 : 2,
        messageType: this.msgType,
        myChatUserId: this.userInfo.chatUser.chatUserId,
        friendChatUserId: this.dataOption.targetId,
        groupNumber: this.dataOption.type === 1 ? "" : this.dataOption.targetId,
        keyWord: this.historyKeyword
      };
      const res = await this.$im_http.post("/api/Message/MessageHisByPage", fd);
      console.log(res);
      if (res.data.result.code === 200) {
        console.log(123);
      }
    },
    // 发送表情
    sendEmoticon(b) {
      console.log(b);
      this.textInfo += b.emoji;
    },
    // 聊天窗口滚动事件
    handleScroll() {
      let scrollbarEl = this.$refs.myScrollbar.wrap;
      scrollbarEl.onscroll = () => {
        // 到顶部了
        if (scrollbarEl.scrollTop < 1) {
          this.isFixedTop = true;
          // 是否还有历史数据可获取 hasMore
          if (this.hasMore) {
            console.log(this.hasMore, "还有历史消息");
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
      this.dialogBusiness = item.messageUId;
    },
    // 筛选群聊聊天用户信息
    filterUserInfo(list, item) {
      const user = list.find(v => v.chatUserId === item.senderUserId);
      if (user) return user;
    },
    // 记录聊天消息
    recordMessageHis(fd) {
      this.$im_http.post("/api/Message/RecordMessageHis", fd);
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
        if (msg.messageType === "RC:ReadNtf") {
          console.log("已读");
        } else if (msg.messageType === "RC:TypSts") {
          console.log("正在输入");
        } else {
          // 回复成功
          this.chatInfoList.push(msg);
        }
        // 清除未读
        this.clearReadInfo();
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
      conversation.getMessages(option).then(result => {
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
        console.log(
          "是否还有历史消息可以获取",
          this.hasMore,
          this.chatInfoList
        );
        // 清除未读
        this.clearReadInfo();
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
    // 切换专区
    checkTabs(num) {
      this.isDiyu = num;
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
          console.log(message);
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
        console.log(this.textInfo);
      } else {
        //用户点击了enter触发
        console.log("用户点击了回车");
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
      img {
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
            max-width: 400px;
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
            max-width: 400px;
            .message {
              color: #fff;
              background-color: #3368a9;
              word-break: break-word;
              text-align: left;
              .yuyinMsg {
                width: 13px;
                height: 17px;
                cursor: pointer;
                background: url("~@/assets/images/yuyinMsg.png") no-repeat
                  center;
                background-size: contain;
              }
            }
            .imgBox {
              box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
            }
            .videoBox {
              width: 400px;
              height: 250px;
            }
          }
        }
      }

      .header-img {
        width: 50px;
        height: 50px;
        border-radius: 100px;
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
      padding: 20px;
      box-sizing: border-box;

      .recordData {
        background: #f6f8f9;
        border-radius: 4px;
        padding: 15px 18px;
        display: flex;
        .cecorLeft {
          width: 40px;
          height: 40px;
          margin-right: 8px;
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid #dcdfe6;
            background: rgba(0, 0, 0, 0);
          }
        }
        .cecorRight {
          width: 100%;
          .cecorHead {
            display: flex;
            justify-content: space-between;
            p {
              height: 17px;
              font-size: 13px;
              font-weight: 400;
              text-align: left;
              color: #999999;
              line-height: 19px;
            }
          }
          .cecorMain {
            padding-top: 10px;
            box-sizing: border-box;
            p {
              color: #666666;
              font-size: 14px;
              line-height: 22px;
            }
          }
        }
      }
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
