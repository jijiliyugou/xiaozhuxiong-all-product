<template>
  <div>
    <div class="minxiBox">
      <div class="minxiBody">
        <div class="minxiBody_title">
          <div class="title_label">
            本次更新内容：
          </div>
          <div class="title_date">
            更新时间：{{
              vesionList[0] && vesionList[0].createdOn.replace(/T/, " ")
            }}
          </div>
        </div>
        <div class="minxiBody_body">
          <el-scrollbar style="height: 100%;">
            <pre class="content_body">{{
              vesionList[0] && vesionList[0].content
            }}</pre>
          </el-scrollbar>
          <div class="myKnow_box">
            <el-button round class="myKnow" @click="$emit('close')">
              我知道了
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["vesionList"],
  data() {
    return {};
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.minxiBox {
  height: 500px;
  width: 100%;
  position: absolute;
  border-radius: 4px;
  background-color: transparent;
  background: url("~@/assets/images/gengxinInfo.png") no-repeat center;
  .minxiBody {
    margin-top: 15px;
    box-sizing: border-box;
    padding: 20px;
    padding-top: 170px;
    border-radius: 4px;
    width: 100%;
    height: 485px;
    background-color: transparent;
    .minxiBody_title {
      display: flex;
      height: 40px;
      // align-items: center;
      justify-content: space-between;
      .title_label {
        color: #333;
        font-weight: 700;
        font-size: 15px;
      }
      .title_date {
        color: #999;
        font-size: 14px;
      }
    }
    .minxiBody_body {
      width: 100%;
      height: 180px;
      .content_body {
        line-height: 30px;
        color: #666;
      }
      .myKnow_box {
        display: flex;
        justify-content: center;
      }
      .myKnow {
        width: 176px;
        background-color: #2784d1;
        color: #fff;
        font-weight: 700;
        margin-top: 30px;
        border: none;
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
