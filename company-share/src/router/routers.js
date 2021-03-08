/** 404模块 */
import _404 from "@/router/404/index.js";

const Login = () => import("@/views/login.vue");
const Index = () => import("@/views/index/index.vue");
const Home = () => import("@/views/index/home/home.vue");
const Product = () => import("@/views/index/product/product.vue");
const MyOrder = () => import("@/views/index/myOrder/myOrder.vue");
const ShoppingCart = () =>
  import("@/views/index/shoppingCart/shoppingCart.vue");
const ProductDetails = () =>
  import("@/views/productDetails/productDetails.vue");
const OrderDetail = () => import("@/views/orderDetail/orderDetail.vue");

export default [
  _404,
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      keepAlive: false
    }
  },
  {
    path: "/productDetails",
    name: "productDetails",
    component: ProductDetails,
    meta: {
      keepAlive: false
    }
  },
  {
    path: "/orderDetail",
    name: "orderDetail",
    component: OrderDetail,
    meta: {
      keepAlive: false
    }
  },
  {
    path: "/index",
    name: "index",
    component: Index,
    meta: {
      keepAlive: false
    },
    children: [
      {
        path: "/index/home",
        name: "home",
        component: Home,
        meta: {
          keepAlive: false
        }
      },
      {
        path: "/index/product",
        name: "product",
        component: Product,
        meta: {
          title: "产品列表",
          keepAlive: true
        }
      },
      {
        path: "/index/shoppingCart",
        name: "shoppingCart",
        component: ShoppingCart,
        meta: {
          keepAlive: false
        }
      },
      {
        path: "/index/myOrder",
        name: "myOrder",
        component: MyOrder,
        meta: {
          keepAlive: false
        }
      },
      {
        path: "/index",
        redirect: "/index/home",
        meta: {
          keepAlive: false
        }
      }
    ]
  },
  {
    path: "/",
    redirect: "/login"
  }
];
