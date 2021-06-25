<template>
  <div class="wrapScroll">
    <div class="recordData" v-for="item in msgList" :key="item.createdOn">
      <div class="cecorLeft">
        <el-image
          style="width:40px; height:40px; cursor: pointer; background-color: #ccc;"
          :src="item.userImage"
          fit="contain"
        >
          <div
            slot="placeholder"
            class="image-slot"
            style="width: 40px; height: 40px; cursor: pointer"
          >
            <img
              style="width: 40px; height: 40px; cursor: pointer"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
          <div
            slot="error"
            class="image-slot"
            style="width: 40px; height: 40px; cursor: pointer"
          >
            <img
              style="width: 40px; height: 40px; cursor: pointer"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
        </el-image>
      </div>
      <div class="cecorRight">
        <div class="cecorHead">
          <p>{{ item.linkman }}</p>
          <p>{{ myDateDiff(item.createdOn) }}</p>
        </div>
        <div class="cecorMain" v-if="item.messageType === 'RC:TxtMsg'">
          <p>{{ item.content }}</p>
        </div>
        <div
          class="cecorMain"
          v-else-if="item.messageType === 'XZX:VideoMessage'"
        >
          <video
            class="video-js vjs-default-skin vjs-big-play-centered"
            controls
            :lazy-src="item.linkMessage"
            style="object-fit: contain;width:150px; height:100px;"
          >
            <source :src="item.linkMessage" type="video/mp4" />
          </video>
        </div>
        <div class="cecorMain" v-else-if="item.messageType === 'RC:ImgMsg'">
          <el-image
            style="width:150px; height:100px; cursor: pointer; background-color: #ccc;"
            :preview-src-list="[item.linkMessage]"
            :src="item.linkMessage"
            fit="contain"
          >
            <div
              slot="placeholder"
              class="image-slot"
              style="width: 150px; height: 100px; cursor: pointer"
            >
              <img
                style="width: 150px; height: 100px; cursor: pointer"
                :src="require('@/assets/images/imgError.png')"
              />
            </div>
            <div
              slot="error"
              class="image-slot"
              style="width: 150px; height: 100px; cursor: pointer"
            >
              <img
                style="width: 150px; height: 100px; cursor: pointer"
                :src="require('@/assets/images/imgError.png')"
              />
            </div>
          </el-image>
        </div>
        <div
          class="cecorMain"
          v-else-if="item.messageType === 'RC:ReferenceMsg'"
        >
          <p style="color:#999;">
            引用：{{ jiexiJSON(item.content).referenceMessageContent }}
          </p>
          <p>{{ jiexiJSON(item.content).content }}</p>
        </div>
        <div
          class="cecorMain"
          v-else-if="item.messageType === 'XZX:LinkMessage'"
        >
          <div class="linkMsgBox" @click="openLink(item.content)">
            <div class="link_left">
              <!-- {{ jiexiJSON(item.content).linkUrl }} -->
              <vue-qr
                v-if="item.content"
                :text="jiexiJSON(item.content).linkUrl"
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
        <div class="cecorMain" v-else-if="item.messageType === 'RC:VcMsg'">
          <div class="yuyinMsgBox"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateDiff } from "@/assets/js/common/common.js";
import VueQr from "vue-qr";
export default {
  props: ["msgList"],
  components: {
    VueQr
  },
  data() {
    return {};
  },
  methods: {
    myDateDiff(date) {
      return dateDiff(date);
    },
    jiexiJSON(json) {
      let value = {};
      if (json) value = JSON.parse(json);
      return value;
    },
    openLink(json) {
      let value = {};
      if (json) value = JSON.parse(json);
      window.open(value.linkUrl, "_blank");
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.recordData {
  background: #f6f8f9;
  border-radius: 4px;
  padding: 15px 18px;
  margin-bottom: 20px;
  display: flex;
  .cecorLeft {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    .el-image {
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
      .yuyinMsgBox {
        width: 13px;
        height: 17px;
        cursor: pointer;
        background: url("~@/assets/images/yuyinMsg.png") no-repeat center;
        background-size: contain;
      }
    }
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
</style>
