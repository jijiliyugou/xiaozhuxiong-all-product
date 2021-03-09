/** 登录模块 */
const Login = () => import("@/views/loginPage/Login.vue");
const LoginConfirm = () => import("@/views/loginPage/LoginConfirm.vue");
/** 首页模块 */
const Home = () => import("@/views/beforePage/Home.vue");
const BeforeIndex = () => import("@/views/beforePage/BeforeIndex.vue");
const Product = () => import("@/views/beforePage/Product.vue");
const CompanyDetail = () => import("@/views/beforePage/CompanyDetail");
const ProductDetail = () => import("@/views/beforePage/productDetail");
const CompanyInfo = () => import("@/views/beforePage/companyInfo");
const ContactUs = () => import("@/views/beforePage/companyInfo/contactUs");
const AboutUs = () => import("@/views/beforePage/companyInfo/aboutUs");
const TermsService = () =>
  import("@/views/beforePage/companyInfo/termsService");
const LegalNotices = () =>
  import("@/views/beforePage/companyInfo/legalNotices");
const PrivacyStatement = () =>
  import("@/views/beforePage/companyInfo/privacyStatement");

export default {
  path: "/beforeIndex",
  name: "BeforeIndex",
  component: BeforeIndex,
  children: [
    {
      path: "home",
      name: "Home",
      component: Home
    },
    {
      path: "login",
      name: "Login",
      component: Login
    },
    {
      path: "loginConfirm",
      name: "LoginConfirm",
      component: LoginConfirm
    },
    {
      path: "product",
      name: "Product",
      component: Product,
      meta: {
        title: "产品列表",
        keepAlive: true
      }
    },
    {
      path: "productDetail/:id",
      name: "ProductDetail",
      component: ProductDetail
    },
    {
      path: "companyDetail/:id",
      name: "companyDetail",
      component: CompanyDetail
    },
    {
      path: "companyInfo",
      name: "companyInfo",
      component: CompanyInfo,
      children: [
        {
          path: "contactUs",
          name: "contactUs",
          component: ContactUs
        },
        {
          path: "aboutUs",
          name: "aboutUs",
          component: AboutUs
        },
        {
          path: "termsService",
          name: "termsService",
          component: TermsService
        },
        {
          path: "legalNotices",
          name: "legalNotices",
          component: LegalNotices
        },
        {
          path: "privacyStatement",
          name: "privacyStatement",
          component: PrivacyStatement
        },
        {
          path: "/beforeIndex/companyInfo",
          redirect: "contactUs"
        }
      ]
    },
    {
      path: "/beforeIndex",
      redirect: "home"
    }
  ]
};
