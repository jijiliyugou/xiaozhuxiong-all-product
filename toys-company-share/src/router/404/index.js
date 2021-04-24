export default {
  name: "404",
  path: "/404",
  component: () => import("@/components/404/404.vue"),
  hidden: true,
  meta: { title: "404" }
};
