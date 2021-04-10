import MessageComponent from "./messageComponent.vue";
// 添加install方法
MessageComponent.install = function(Vue) {
  Vue.component(MessageComponent.name, MessageComponent);
};

export default MessageComponent;
