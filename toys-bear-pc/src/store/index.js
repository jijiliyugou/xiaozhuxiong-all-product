import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import globalJson from "./Json.js";
Vue.use(Vuex);
const v = new Vue();
function myForEach(oList, yList) {
  for (let i = 0; i < oList.length; i++) {
    for (let j = 0; j < yList.length; j++) {
      if (oList[i].productNumber === yList[j].productNumber) {
        oList.splice(i, 1);
      }
    }
  }
}
const store = new Vuex.Store({
  state: {
    myColles: [],
    isJindu: false,
    activeTab: "/bsIndex/bsHome",
    oldTabName: "/bsIndex/bsHome", //上一次点击的url
    showGlobalMsg: false,
    msgType: "primary",
    globalMsg: "",
    tabList: [
      {
        component: "bsHome",
        label: "后台首页",
        linkUrl: "/bsIndex/bsHome",
        name: "/bsIndex/bsHome",
        refresh: true
      }
    ],
    offerProductList: [], //报价数据
    historyNames: [],
    httpTime: 0, // 请求时长
    httpContent: "", // 请求内容
    screenWidth: document.documentElement.clientWidth, // 屏幕宽度
    wsOrderMsg: null,
    searchImgPreview: null,
    wsId: "",
    wsMsg: null,
    isLogin: false,
    beforeSearch: {
      name: null,
      minPrice: null,
      maxPrice: null,
      fa_no: null,
      pa_nu: null,
      pr_le: null,
      pr_wi: null,
      pr_hi: null,
      ou_le: null,
      ou_wi: null,
      ou_hi: null,
      isUpInsetImg: true,
      startTime: null,
      endTime: null
    },
    beforeSearchImg: null,
    hotSearchImg: null,
    searchValue: "",
    vueElementLoading: false,
    AppLoading: false,
    imageSearchValue: null,
    routers: null,
    userInfo: null,
    currentComparnyId: null
  },
  mutations: {
    handlerOldTabName(state, payLoad) {
      state.oldTabName = payLoad;
    },
    // 修改进度条状态
    handlerIsJindu(state, payLoad) {
      state.isJindu = payLoad;
    },
    // 添加收藏
    addMyCollec(state, payLoad) {
      console.log(payLoad);
      state.myColles.push(payLoad);
    },
    // 删除收藏
    removeMyCollec(state) {
      state.myColles.pop();
    },
    updataUrl(state, payLoad) {
      state.lastUrl = payLoad;
    },
    // 修改全局msg样式
    handlerMsgType(state, payLoad) {
      state.msgType = payLoad.type;
      state.globalMsg = payLoad.msg;
    },
    // 修改全局msg状态
    handlerShowGlobalMsg(state, payLoad) {
      state.showGlobalMsg = payLoad;
    },
    // 清空路由
    clearAllTab(state, payLoad) {
      state.bsMenuLabels = payLoad;
    },
    // 添加路由历史记录
    handlerBsMenuLabels(state, payLoad) {
      let flag = false;
      for (let i = 0; i < state.bsMenuLabels.length; i++) {
        if (state.bsMenuLabels[i].linkUrl === payLoad.linkUrl) flag = true;
      }
      if (!flag) state.bsMenuLabels.push(payLoad);
    },
    // 关闭页签
    subBsMenuLabels(state, payLoad) {
      for (let i = 0; i < state.bsMenuLabels.length; i++) {
        if (state.bsMenuLabels[i].linkUrl === payLoad.linkUrl)
          state.bsMenuLabels.splice(i, 1);
      }
    },
    initShoppingCart(state, payLoad) {
      const key = state.userInfo.uid;
      Vue.prototype.$set(state, key, payLoad);
    },
    // 提交报价
    initOfferProductList(state) {
      Vue.prototype.$set(state, "offerProductList", []);
    },
    // 请求修改报价商品接口赋值
    updataOfferProductList(state, payLoad) {
      Vue.prototype.$set(state, "offerProductList", payLoad);
    },
    //添加报价商品
    pushOfferProductList(state, payLoad) {
      console.log(payLoad);
      state.offerProductList.push(payLoad);
    },
    // 删除报价商品
    popOfferProductList(state, payLoad) {
      for (let i = 0; i < state.offerProductList.length; i++) {
        if (state.offerProductList[i].productNumber == payLoad.productNumber) {
          state.offerProductList.splice(i, 1);
        }
      }
    },
    // 修改找样报价数量方法
    changeOfferProductNumber(state, payLoad) {
      for (let i = 0; i < state.offerProductList.length; i++) {
        for (let j = 0; j < payLoad.length; j++) {
          if (
            state.offerProductList[i].productNumber == payLoad[j].productNumber
          ) {
            state.offerProductList[i].boxNumber = payLoad[j].boxNumber;
          }
        }
      }
    },
    // 修改数量方法
    replaceShoppingCartValueCount(state, payLoad) {
      const key = state.userInfo.uid;
      for (let i = 0; i < state[key].length; i++) {
        for (const keys in state[key][i]) {
          Vue.prototype.$set(state[key][i], keys, payLoad[i][keys]);
        }
      }
      localStorage.setItem(key, JSON.stringify(state[key]));
    },
    // 更新购物车
    resetShoppingCart(state, payLoad) {
      const key = state.userInfo.uid;
      myForEach(state[key], payLoad);
      localStorage.setItem(key, JSON.stringify(state[key]));
    },
    // 加购
    pushShopping(state, payLoad) {
      const key = state.userInfo.uid;
      if (state[key]) {
        payLoad.index = state[key].length + 1;
        state[key].unshift(payLoad);
      } else {
        payLoad.index = 1;
        Vue.prototype.$set(state, key, [payLoad]);
      }
      localStorage.setItem(key, JSON.stringify(state[key]));
    },

    // 删除购物车某指定一个商品
    popShopping(state, payLoad) {
      const key = state.userInfo.uid;
      for (let i = 0; i < state[key].length; i++) {
        if (state[key][i].productNumber === payLoad.productNumber)
          state[key].splice(i, 1);
      }
      localStorage.setItem(key, JSON.stringify(state[key]));
    },
    handlerBeforeSearchKeyWord(state, value) {
      state.beforeSearch.name = value;
    },
    addHistoryNames(state, value) {
      const i = state.historyNames.indexOf(value);
      if (i !== -1) {
        state.historyNames.splice(i, 1);
        state.historyNames.unshift(value);
      } else {
        state.historyNames.unshift(value);
        if (state.historyNames.length > 6) state.historyNames.pop();
      }
    },
    handlerHttpTime(state, value) {
      state.httpTime = value;
    },
    handlerHttpContent(state, value) {
      state.httpContent = value;
    },
    handlerLogin(state, value) {
      state.isLogin = value;
    },
    updateLoading(state, value) {
      state.vueElementLoading = value;
    },
    handlerBeforeSearch(state, value) {
      state.beforeSearch = value;
    },
    handlerhotSearchImg(state, value) {
      state.hotSearchImg = value;
    },
    handlerSearchImgPreview(state, value) {
      state.searchImgPreview = value;
    },
    handlerBeforeSearchImg(state, value) {
      state.beforeSearchImg = value;
    },
    updateAppLoading(state, value) {
      state.AppLoading = value;
    },
    searchValues(state, list) {
      state.imageSearchValue = list;
    },
    searchTxtValues(state, value) {
      state.searchValue = value;
    },
    clearSearch(state) {
      state.imageSearchValue = null;
      state.beforeSearchImg = null;
      state.hotSearchImg = null;
    },
    setRouters(state, routers) {
      state.routers = routers;
    },
    setToken(state, user) {
      state.userInfo = user;
    },
    setComparnyId(state, id) {
      state.currentComparnyId = id;
    },
    setWsId(state, id) {
      state.wsId = id;
    },
    setwsMsg(state, msg) {
      state.wsMsg = msg;
    },
    clearWsMsg(state) {
      state.wsMsg = null;
    },
    setWsOrderMsg(state, msg) {
      state.wsOrderMsg = msg;
    },
    clearWsOrderMsg(state) {
      state.wsOrderMsg = null;
    },
    removeLoginItems(state) {
      state.currentComparnyId = null;
      state.globalJson.Json = {};
      state.routers = [];
      state.isLogin = null;
      this.dispatch("getToken");
    },
    setActiveTab(state, a) {
      state.activeTab = a;
    },
    // 测试
    //关闭全部tab页
    closeTabAll(state, router) {
      console.log(state.activeTab, state.tabList);
      // let activeTab;
      // for (let i = 0; i < state.tabList.length; i++) {
      //   if (state.tabList[i].name === state.activeTab) {
      //     activeTab = state.tabList[i];
      //     break;
      //   }
      // }
      const activeTab = state.tabList.find(val => val.name === state.activeTab);
      console.log(activeTab, router);
      v.$set(state, "tabList", []);
      state.tabList.push(activeTab);
      router.push(activeTab.linkUrl);
      // const fd = {
      //   component: "bsHome",
      //   label: "后台首页",
      //   linkUrl: "/bsIndex/bsHome",
      //   name: "/bsIndex/bsHome",
      //   refresh: true
      // };
      // state.activeTab = "/bsIndex/bsHome";
    },

    //关闭tab页
    closeTab(state, n) {
      let tab = state.tabList;
      console.log(n, state.oldTabName);
      tab.forEach((val, i) => {
        if (val.name == n) {
          tab.splice(i, 1);
          const currentOption = tab.find(va => va.name == state.oldTabName);
          if (currentOption) {
            state.activeTab = state.oldTabName;
            router.push(currentOption.linkUrl);
          } else {
            state.activeTab = tab[tab.length - 1].name;
            router.push(tab[tab.length - 1].linkUrl);
          }
        }
      });
    },
    // 不需要回到上一次历史记录的关闭标签
    closeOfferTab(state, n) {
      let tab = state.tabList;
      let currentTab;
      for (let i = 0; i < tab.length; i++) {
        if (tab[i].name == n.toName) {
          currentTab = tab[i];
        }
        if (tab[i].name == n.name) {
          tab.splice(i, 1);
        }
      }
      state.activeTab = currentTab.name;
      router.push(currentTab.linkUrl);
    },
    //新增tab页
    myAddTab(state, n) {
      let tab = state.tabList;
      n["refresh"] || (n["refresh"] = true);
      let flag = true;
      tab.find(val => val.name == val.name) || (tab.push(n), (flag = false));
      flag && v.$common.refreshTab(n.name);
      this.commit("updateActiveTab", n);
    },
    updateActiveTab(state, n) {
      state.activeTab = n.name;
      let flag = false;
      for (let i = 0; i < state.tabList.length; i++) {
        if (state.tabList[i].name == n.name) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        state.tabList.push(n);
      }
    }
  },
  actions: {
    async getToken({ commit }) {
      const res = await axios.post("/api/GetToken", {
        companyNum: "LittleBearWeb",
        platForm: "PC"
      });
      if (res.data.result.code === 200) {
        const obj = { accessToken: res.data.result.item };
        commit("setToken", obj);
      } else {
        commit("setToken", {});
      }
    }
  },
  getters: {
    myShoppingList(state) {
      if (!state.userInfo || !state.userInfo.uid) {
        return [];
      }
      return state[state.userInfo.uid];
    },
    tabList(state) {
      return state.tabList.map(val => {
        if (val) {
          const list = val.linkUrl.split("/");
          const component = list[list.length - 1];
          return {
            name: val.linkUrl,
            linkUrl: val.linkUrl,
            component: component,
            refresh: true,
            label: val.name
          };
        }
      });
    }
  },
  modules: {
    globalJson
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
});

export default store;
