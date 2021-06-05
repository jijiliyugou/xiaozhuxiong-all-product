import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import globalJson from "./Json.js";
Vue.use(Vuex);
function myForEach(oList, yList) {
  for (let i = 0; i < oList.length; i++) {
    for (let j = 0; j < yList.length; j++) {
      if (oList[i].productNumber === yList[j].productNumber) {
        oList.splice(i, 1);
      }
    }
  }
}
export default new Vuex.Store({
  state: {
    historyNames: [],
    httpTime: 0, // 请求时长
    httpContent: "", // 请求内容
    screenWidth: document.documentElement.clientWidth, // 屏幕宽度
    wsOrderMsg: null,
    beforeSearchImgPreview: null,
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
    // 过期更新token
    reset_Token(state, token) {
      state.userInfo.accessToken = token;
    },
    initShoppingCart(state, payLoad) {
      const key = state.userInfo.uid;
      Vue.prototype.$set(state, key, payLoad);
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
        state[key].push(payLoad);
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
    handlerBeforeSearchImgPreview(state, value) {
      state.beforeSearchImgPreview = value;
    },
    handlerBeforeSearchImg(state, value) {
      state.beforeSearchImg = value;
    },
    updateAppLoading(state, value) {
      state.AppLoading = value;
    },
    searchValues(state, value) {
      state.imageSearchValue = value;
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
