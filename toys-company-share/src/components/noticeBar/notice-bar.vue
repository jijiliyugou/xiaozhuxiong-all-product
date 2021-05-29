<template>
  <div class="my-outbox" ref="wrap">
    <div class="my-inbox" ref="content">
      <div class="my-list">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoticeBar",
  props: {
    speed: {
      type: Number,
      default: 15
    },
    startRoll: {
      type: Boolean,
      default: false
    },
    text: {
      Type: String,
      default: ""
    }
  },
  data() {
    return {
      timeID: null,
      wrapWidth: 0,
      contentWidth: 0
    };
  },
  activated() {
    // keep-alive 缓存的组件，在重新激活的时候，必须要重新触发滚动，不然会停止不动了。
    this.startRoll && this.start();
  },
  created() {},
  mounted() {
    this.startRoll && this.start();
  },
  methods: {
    start() {
      const { wrap, content } = this.$refs;
      this.wrapWidth = wrap.getBoundingClientRect().width;
      this.contentWidth = content.getBoundingClientRect().width;
      this.animateFn();
    },
    animateFn() {
      const { content } = this.$refs;
      let distance = this.wrapWidth;
      content.style.transform = "translateX(" + distance + "px)"; //初始值
      let that = this;
      that.timeID = setInterval(function() {
        distance = distance - 1;
        if (-distance >= that.contentWidth) {
          distance = that.wrapWidth;
        }
        content.style.transform = "translateX(" + distance + "px)";
      }, that.speed); //控制速度
    }
  },
  // 更新的时候运动
  updated: function() {
    this.animateFn();
  },
  beforeDestroy() {
    clearInterval(this.timeID);
    this.timeID = null;
  }
};
</script>

<style lang="less" scoped>
.my-outbox {
  // color: #d7bc8d;
  overflow: hidden;
  height: 50px;
  // background: #422b02;
  position: relative;
  .my-inbox {
    white-space: nowrap;
    position: absolute;
    font-size: 0;
    .my-list {
      margin-right: 25px;
      display: inline-block;
      font-size: 36px;
      font-weight: bold;
      color: #333333;
    }
  }
}
</style>
