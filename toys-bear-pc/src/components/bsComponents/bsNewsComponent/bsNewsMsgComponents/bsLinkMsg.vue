<template>
  <div>
    <!-- 链接 -->
    <template v-for="(item, i) in msgList">
      <div class="recordData" :key="i">
        <div class="cecorLeft">
          <img :src="item.userImage" alt="" />
        </div>
        <div class="cecorRight">
          <div class="cecorHead">
            <p>{{ item.linkman }}</p>
            <p>{{ myDateDiff(item.createdOn) }}</p>
          </div>
          <div class="cecorMain">
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
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import { dateDiff } from "@/assets/js/common/common.js";
export default {
  props: ["msgList"],
  components: {
    VueQr
  },
  data() {
    return {};
  },
  methods: {
    jiexiJSON(json) {
      let value = {};
      if (json) value = JSON.parse(json);
      return value;
    },
    myDateDiff(date) {
      return dateDiff(date);
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
