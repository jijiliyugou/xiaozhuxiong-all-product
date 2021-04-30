/*
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-03-31 17:09:19
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\store\index.js
 * @LastEditTime: 2021-04-28 10:08:01
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    network:{
      up:1,
      down:1
    },  //网络信号
  },
  mutations: {
    setNetworkUp(state,data){
      state.network.up = data;
    },
    setNetworkDown(state,data){
      state.network.down = data;
    },
  },
  actions: {},
  modules: {}
});
