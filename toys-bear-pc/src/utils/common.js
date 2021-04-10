import Vue from "vue";
import store from "@/store/index";
const v = new Vue();
export default {
  install(Vue) {
    Vue.prototype.$common = this;
  },
  //刷新tab页
  refreshTab(n) {
    let tab = store.state.tabList;
    let a = n || store.state.activeTab;
    for (const i of tab) {
      if (i.name == a) {
        v.$set(i, "refresh", false);
        v.$nextTick(() => {
          v.$set(i, "refresh", true);
        });
        break;
      }
    }
  },
  /**
   * 修改全局msg状态
   */
  //  this.$common.handlerMsgState({ msg: "测试msg", type: "success" });
  timeID: null,
  handlerMsgState(option) {
    if (this.timeID) {
      clearTimeout(this.timeID);
      store.commit("handlerShowGlobalMsg", false);
      Vue.prototype.$nextTick(() => {
        store.commit("handlerShowGlobalMsg", true);
        store.commit("handlerMsgType", option);
      });
    } else {
      store.commit("handlerShowGlobalMsg", true);
      store.commit("handlerMsgType", option);
    }
    this.timeID = setTimeout(() => {
      store.commit("handlerShowGlobalMsg", false);
    }, option.time || 2000);
  },

  // 新增tab页
  addTab(n) {
    store.commit("myAddTab", n);
  },
  // 关闭tab页
  closeTab(n) {
    store.commit("closeTab", n);
  },
  judgeTab(arr, n) {
    store.commit("myAddTab", n);
  },
  //获取当前tab id
  getTabNameId(_this) {
    let id = _this.$parent.name.split("-");
    return id[1];
  },
  //获取当前tab name
  getTabName() {
    return store.state.activeTab;
  },
  //获取当前tab参数
  getTabParams() {
    let tab = store.state.tabList;
    let n = store.state.activeTab;
    let a = "";
    for (const i of tab) {
      if (i.name == n) {
        a = i.params;
        break;
      }
    }
    return a;
  },
  //获取当前tab
  getTab() {
    let tab = store.state.tabList;
    let n = store.state.activeTab;
    let a = "";
    for (const i of tab) {
      if (i.name == n) {
        a = i;
        break;
      }
    }
    return a;
  }
};
