import Vue from "vue";
import store from "@/store/index";
import router from "../router";
// const v = new Vue();
export default {
  install(Vue) {
    Vue.prototype.$common = this;
  },
  //刷新tab页
  refreshTab(n) {
    let tabs = store.state.tabList;
    let a = n || store.state.activeTab;
    for (const v of tabs) {
      if (v.name == a) {
        Vue.prototype.$set(v, "refresh", false);
        Vue.prototype.$nextTick(() => {
          Vue.prototype.$set(v, "refresh", true);
          sessionStorage.setItem("vuex", JSON.stringify(store.state));
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
  },
  //跳转页面
  goToUrl(title) {
    let fd = {};
    switch (title) {
      case "展厅业务":
        fd = {
          name: "/bsIndex/bsHallBusiness",
          linkUrl: "/bsIndex/bsHallBusiness",
          component: "bsHallBusiness",
          refresh: true,
          label: title
        };
        break;
      case "找样报价":
        fd = {
          name: "/bsIndex/bsSampleQuotation",
          linkUrl: "/bsIndex/bsSampleQuotation",
          component: "bsSampleQuotation",
          refresh: true,
          label: title
        };
        break;
      case "采购订单":
        fd = {
          name: "/bsIndex/bsPurchaseOrder",
          linkUrl: "/bsIndex/bsPurchaseOrder",
          component: "bsPurchaseOrder",
          refresh: true,
          label: title
        };
        break;
      case "浏览足迹":
        // this.$common.handlerMsgState({
        //   msg: "敬请期待",
        //   type: "warning"
        // });
        // return false;
        fd = {
          name: "/bsIndex/bsBrowsingFootprints",
          linkUrl: "/bsIndex/bsBrowsingFootprints",
          component: "bsBrowsingFootprints",
          refresh: true,
          label: title
        };
        break;
      case "站点分享":
        fd = {
          name: "/bsIndex/bsSiteLlis",
          linkUrl: "/bsIndex/bsSiteLlis",
          component: "bsSiteLlis",
          refresh: true,
          label: "站点列表"
        };
        break;
      case "客户订单":
        fd = {
          name: "/bsIndex/bsCustomerOrder",
          linkUrl: "/bsIndex/bsCustomerOrder",
          component: "bsCustomerOrder",
          refresh: true,
          label: title
        };
        break;
      case "我的消息":
        fd = {
          name: "/bsIndex/bsNews",
          linkUrl: "/bsIndex/bsNews",
          component: "bsNews",
          refresh: true,
          label: "消息"
        };
        break;
      case "找玩具":
        fd = {
          name: "/bsIndex/bsProductSearchIndex",
          linkUrl: "/bsIndex/bsProductSearchIndex",
          component: "bsProductSearchIndex",
          refresh: true,
          label: "产品查询"
        };
        break;
      case "按图找样":
        fd = {
          name: "/bsIndex/bsProductSearchIndex",
          linkUrl: "/bsIndex/bsProductSearchIndex",
          component: "bsProductSearchIndex",
          refresh: true,
          label: "产品查询"
        };
        store.commit("handlerHallSearchCate", null);
        store.commit("handlerimgSearch", true);
        break;
      case "新品区":
        fd = {
          name: "/bsIndex/bsLatestProducts",
          linkUrl: "/bsIndex/bsLatestProducts",
          component: "bsLatestProducts",
          refresh: true,
          label: "最新产品"
        };
        break;
      case "现货区":
        fd = {
          name: "/bsIndex/bsSpotProducts",
          linkUrl: "/bsIndex/bsSpotProducts",
          component: "bsSpotProducts",
          refresh: true,
          label: "现货产品"
        };
        break;
      case "VIP区":
        fd = {
          name: "/bsIndex/bsVIPProducts",
          linkUrl: "/bsIndex/bsVIPProducts",
          component: "bsVIPProducts",
          refresh: true,
          label: "VIP产品"
        };
        break;
      case "玩具圈":
        fd = {
          name: "/bsIndex/bsToyCircle",
          linkUrl: "/bsIndex/bsToyCircle",
          component: "bsToyCircle",
          refresh: true,
          label: title
        };
        break;
    }
    store.commit("myAddTab", fd);
    router.push(fd.linkUrl);
  }
};
