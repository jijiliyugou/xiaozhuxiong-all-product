/** 登录模块 */
const Login = () => import("@/views/loginPage/Login.vue");
const LoginConfirm = () => import("@/views/loginPage/LoginConfirm.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/loginConfirm",
    name: "LoginConfirm",
    component: LoginConfirm
  }
];
