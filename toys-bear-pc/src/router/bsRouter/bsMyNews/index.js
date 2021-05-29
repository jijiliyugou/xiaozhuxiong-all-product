// 我的消息
const BsNews = () => import("@/views/bsPage/bsMyNews/bsNews/BsNews.vue");
// 业务消息
const BsBusinessMsg = () =>
  import("@/views/bsPage/bsMyNews/bsBusinessMsg/BsBusinessMsg.vue");
// 我的好友
const BsMyGoodFriend = () =>
  import("@/views/bsPage/bsMyNews/bsMyGoodFriend/BsMyGoodFriend.vue");
// 玩具圈
const BsToyCircle = () =>
  import("@/views/bsPage/bsMyNews/bsToyCircle/BsToyCircle.vue");

export default [
  {
    path: "/bsIndex/bsNews",
    name: "bsNews",
    component: BsNews,
    meta: {
      keepAlive: false
    }
  },
  {
    path: "/bsIndex/bsBusinessMsg",
    name: "bsBusinessMsg",
    component: BsBusinessMsg,
    meta: {
      keepAlive: false
    }
  },
  {
    path: "/bsIndex/bsMyGoodFriend",
    name: "bsMyGoodFriend",
    component: BsMyGoodFriend,
    meta: {
      keepAlive: false
    }
  },
  {
    path: "/bsIndex/bsToyCircle",
    name: "bsToyCircle",
    component: BsToyCircle,
    meta: {
      keepAlive: false
    }
  }
];
