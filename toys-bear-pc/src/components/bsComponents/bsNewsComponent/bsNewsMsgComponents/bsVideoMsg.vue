<template>
  <div>
    <div class="recordData" v-for="item in msgList" :key="item.createdOn">
      <div class="cecorLeft">
        <img :src="item.userImage" alt="" />
      </div>
      <div class="cecorRight">
        <div class="cecorHead">
          <p>{{ item.linkman }}</p>
          <p>{{ myDateDiff(item.createdOn) }}</p>
        </div>
        <div class="cecorMain">
          <video
            class="video-js vjs-default-skin vjs-big-play-centered"
            controls
            :lazy-src="item.linkMessage"
            style="object-fit: contain; width:150px; height:100px;"
          >
            <source :src="item.linkMessage" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateDiff } from "@/assets/js/common/common.js";
export default {
  props: ["msgList"],
  data() {
    return {};
  },
  methods: {
    myDateDiff(date) {
      return dateDiff(date);
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
</style>
