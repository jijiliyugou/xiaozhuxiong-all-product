<template>
  <div class="wrapBox">
    <topComponent :title="topTitle" :companyInfo="companyInfo" />
    <div class="box">
      <div class="topLayout">
        <div class="logoImg">
          <el-image :src="companyInfo.companyLogo" fit="fill">
            <div
              slot="placeholder"
              class="image-slot"
              style="width: 120px;height: 120px;margin:0 auto;"
            >
              <img
                style="width: 100%;height: 100%;"
                class="errorImg"
                src="~@/assets/images/imgError.png"
                alt
              />
            </div>
            <div
              slot="error"
              class="image-slot"
              style="width: 120px;height: 120px;margin:0 auto;"
            >
              <img
                class="errorImg"
                style="width: 100%;height: 100%;"
                src="~@/assets/images/imgError.png"
                alt
              />
            </div>
          </el-image>
        </div>
        <div class="companyInfo">
          <div class="infoBox">
            <p class="infoName">{{ companyInfo.companyName }}</p>
            <div class="userInfo">
              <div class="item">
                <span class="title">联系人：</span>{{ companyInfo.contactsMan }}
              </div>
              <div class="item">
                <span class="title">电话：</span
                >{{ companyInfo.telephoneNumber }}
              </div>
              <div class="item">
                <span class="title">手机：</span>{{ companyInfo.phoneNumber }}
              </div>
              <div class="item">
                <span class="title">电子邮箱：</span>{{ companyInfo.e_mail }}
              </div>
            </div>
            <p class="addr">
              <span class="title">地址：</span>{{ companyInfo.address }}
            </p>
          </div>
        </div>
      </div>
      <div class="floorBox">
        <div class="floorTitle">
          <span class="context">推荐产品</span>
          <span class="more" @click="toAllProduct"
            >更多<span
              style="margin-left:8px;"
              class="el-icon-arrow-right"
            ></span
          ></span>
        </div>
        <div class="products">
          <div
            class="item"
            v-for="(item, i) in recommendProduct"
            @click="toProductDetail(item)"
            :key="i"
          >
            <el-image
              style="width: 282px; height: 211px; min-height: 211px;"
              :src="item.img"
              fit="contain"
            >
              <div
                slot="placeholder"
                class="image-slot"
                style="width: 100%;height: 100%;"
              >
                <img
                  style="width: 100%;height: 100%; object-fit: contain;"
                  class="errorImg"
                  src="~@/assets/images/imgError.png"
                  alt
                />
              </div>
              <div
                slot="error"
                class="image-slot"
                style="width: 100%;height: 100%;"
              >
                <img
                  class="errorImg"
                  style="width: 100%;height: 100%; object-fit: contain;"
                  src="~@/assets/images/imgError.png"
                  alt
                />
              </div>
            </el-image>
            <div class="context">
              <div class="productName">{{ item.name }}</div>
              <div class="textBox">
                <span>货号：{{ item.fa_no }}</span>
                <span
                  >参考单价：<span class="price">￥{{ item.price }}</span></span
                >
              </div>
            </div>
          </div>
          <p class="kong"></p>
          <p class="kong"></p>
          <p class="kong"></p>
        </div>
      </div>
      <div class="floorBox">
        <div class="floorTitle">
          <span class="context">全部产品</span>
          <span class="more" @click="toAllProduct"
            >更多<span
              style="margin-left:8px;"
              class="el-icon-arrow-right"
            ></span
          ></span>
        </div>
        <div class="products">
          <div
            class="item"
            v-for="(item, i) in productList"
            @click="toProductDetail(item)"
            :key="i"
          >
            <el-image
              style="width: 282px; height: 211px; min-height: 211px;"
              :src="item.img"
              fit="contain"
            >
              <div
                slot="placeholder"
                class="image-slot"
                style="width: 100%;height: 100%;"
              >
                <img
                  style="width: 100%;height: 100%; object-fit: contain;"
                  class="errorImg"
                  src="~@/assets/images/imgError.png"
                  alt
                />
              </div>
              <div
                slot="error"
                class="image-slot"
                style="width: 100%;height: 100%;"
              >
                <img
                  class="errorImg"
                  style="width: 100%;height: 100%; object-fit: contain;"
                  src="~@/assets/images/imgError.png"
                  alt
                />
              </div>
            </el-image>
            <div class="context">
              <div class="productName">{{ item.name }}</div>
              <div class="textBox">
                <span>货号：{{ item.fa_no }}</span>
                <span
                  >参考单价：<span class="price">￥{{ item.price }}</span></span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topComponent from "@/components/shareFactoryTopComponent/shareFactoryTopComponent.vue";
export default {
  components: {
    topComponent
  },
  data() {
    return {
      productList: [],
      companyInfo: {},
      recommendProduct: [],
      topTitle: "",
      headerCellStyle: { backgroundColor: "#E5EEFF", color: "#333" },
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      tableData: []
    };
  },
  methods: {
    // 查看更多
    toAllProduct() {
      this.$router.push("/dontLoadShareFactoryAllProductsPC");
    },
    // 产品详情
    toProductDetail(item) {
      sessionStorage.setItem("currentProduct", JSON.stringify(item));
      this.$router.push({ path: "/dontLoadProductDetailsPC" });
    },
    // 获取推荐产品
    async getRecommendProductByNumberPage() {
      const res = await this.$http.post(
        "/api/RecommendProductByNumberPageShare",
        { skipCount: 1, maxResultCount: 8, companyNumber: "HS0000006" }
      );
      if (res.data.result.code === 200) {
        this.recommendProduct = res.data.result.item.items;
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    // 获取厂商信息
    async getCompanyByIDShare() {
      const res = await this.$http.post("/api/CompanyByIDShare ", {
        skipCount: 1,
        maxResultCount: 8,
        companyNumber: "HS0000006"
      });
      if (res.data.result.code === 200) {
        this.companyInfo = res.data.result.item;
      } else this.$message.error(res.data.result.msg);
    },
    // 获取厂商所有产品
    async getSupplierProductShare() {
      const res = await this.$http.post("/api/SupplierProductShare  ", {
        skipCount: 1,
        maxResultCount: 8,
        companyNumber: "HS0000006"
      });
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items;
      } else this.$message.error(res.data.result.msg);
    },
    // 修改页容量
    handleSizeChange(page) {
      this.pageSize = page;
    },
    // 修改当前页
    currentChange(page) {
      this.currentPage = page;
    }
  },
  created() {
    if (document.body.clientWidth <= 1024)
      this.$router.push(
        "/dontLoadShareFactory?companyNumber=" + this.$route.query.companyNumber
      );
  },
  mounted() {
    this.getRecommendProductByNumberPage();
    this.getCompanyByIDShare();
    this.getSupplierProductShare();
  }
};
</script>
<style scoped lang="less">
@import "./dontLoadShareFactoryPC.less";
</style>
