<template>
  <div class="my-outbox" ref="my_outbox">
    <div class="my-inbox" ref="my_inbox">
      <div class="my-list" v-for="(item, index) in list" :key="index">
        <span class="my-uname">{{ item }}</span>
        <span class="my-uname" style="margin-left: 10px;" v-if="showDate">
          {{ item.createdOn.replace(/T/, " ") }}
        </span>
      </div>
      <div class="my-list" v-if="isShowTwo">
        <div v-for="(item, index) in list" :key="(index + 1) * 100">
          <span class="my-uname">{{ item }}</span>
          <span class="my-uname" style="margin-left: 10px;" v-if="showDate">
            {{ item.createdOn.replace(/T/, " ") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "my-marquee-left",
  props: {
    list: Array,
    showTwo: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 1
    },
    showDate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeID: null,
      isShowTwo: false
    };
  },
  mounted() {
    if (this.$refs.my_inbox.offsetWidth <= this.$refs.my_outbox.offsetWidth) {
      this.isShowTwo = false;
    } else {
      this.isShowTwo = this.showTwo;
      this.myAnimation();
    }
  },
  watch: {
    list: {
      deep: true,
      handler(val) {
        if (val) {
          this.isShowTwo = true;
          this.myAnimation();
        }
      }
    }
  },
  methods: {
    myAnimation() {
      const that = this;
      const target = this.$refs.my_inbox;
      let initLeft = 0;
      clearInterval(this.timeID);
      this.timeID = setInterval(function() {
        initLeft += 0.1;
        if (initLeft >= target.offsetWidth / 2) {
          initLeft = 0;
        }
        target.style = "transform: translateX(-" + initLeft + "px)";
      }, that.duration);
    }
  },
  beforeDestroy() {
    clearInterval(this.timeID);
  }
};
</script>

<style lang="less" scoped>
.my-outbox {
  overflow: hidden;
  height: 100%;
  position: relative;
  .my-inbox {
    height: 100%;
    white-space: nowrap;
    position: absolute;
    .my-list {
      height: 100%;
      margin-right: 25px;
      display: inline-block;
    }
  }
}
</style>
