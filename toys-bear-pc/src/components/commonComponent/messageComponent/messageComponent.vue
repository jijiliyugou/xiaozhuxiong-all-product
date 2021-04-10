<template>
  <div class="MessageComponent">
    <div class="messageBox">
      <span class="block">
        <!-- 插槽 -->
        <slot />
        <i class="msgIcon success el-icon-success" v-if="type == 'success'"></i>
        <i class="msgIcon warning el-icon-warning" v-if="type == 'warning'"></i>
        <i class="msgIcon primary el-icon-warning" v-if="type == 'primary'"></i>
        <i class="msgIcon danger el-icon-error" v-if="type == 'danger'"></i>
        {{ msg }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MessageComponent",
  // 传入子组件的参数写到props
  props: {
    type: {
      type: String,
      default: "primary"
    },
    msg: {
      type: String,
      default: "primary"
    }
  },
  computed: {
    ...mapState(["showGlobalMsg"])
  }
};
</script>

<style scoped lang="less">
.MessageComponent {
  position: fixed;
  width: 100%;
  left: 0;
  top: 200px;
  font-size: 14px;
  z-index: 9999;
  text-align: center;
  transition: all 0.5s;
  .messageBox {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 50px;
    line-height: 50px;
    display: inline-block;
    padding: 0 30px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.16);
    transform: translate(-50%, -50%);
    .block {
      display: flex;
      align-items: center;
      .msgIcon {
        width: 30px;
        height: 30px;
        display: inline-block;
        vertical-align: top;
        margin-right: 12px;
        font-size: 30px;
        &.success {
          color: #33a96a;
        }
        &.danger {
          color: #ff4848;
        }
        &.primary {
          color: #3591ee;
        }
        &.warning {
          color: #f9723e;
        }
      }
    }
  }
}
</style>
