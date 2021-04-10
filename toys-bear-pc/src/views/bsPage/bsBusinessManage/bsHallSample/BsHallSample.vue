<template>
  <div
    style="textAlign: center;margin-top: 200px;font-weight: bold;font-size: 40px;color:red;"
  >
    敬请期待
  </div>
</template>

<script>
export default {
  name: "bsHallSample",
  data() {
    return {
      dialogVisible: false,
      dialogProp: {
        dialogTitle: "删除",
        isType: true,
        isForm: true,
        dialogMsg: ""
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    www() {
      this.$common.handlerDialogState("handlerDialogShow", true);
    },
    // 点击取消事件
    resetPopupData() {
      //  这里可重置数据
      this.dialogVisible = false;
    },
    // 点击确定的按钮
    async submitPopupData(data) {
      this.$common.handlerMsgState({
        msg: "只能上传图片或视频的其中一种文件格式",
        type: "danger"
      });
      console.log(data);
      // this.dialogVisible = false;
    }
  }
};
</script>
<style scoped lang="less"></style>
