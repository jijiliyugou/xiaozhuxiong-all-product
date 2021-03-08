<template>
  <div class="baojia">
    <!-- @scroll="baojiaScroll"
    v-infinite-scroll="load"
    infinite-scroll-disabled="disabled" -->
    <div class="boxOne">
      <div class="left">
        <el-image class="myImg" :src="companyInfo.companyLogo" fit="contain">
          <div slot="placeholder" class="image-slot" style="width: 100%;">
            <img
              style="width: 100%;"
              class="errorImg"
              src="~@/assets/images/imgError.png"
              alt
            />
          </div>
          <div slot="error" class="image-slot" style="width: 100%;">
            <img
              class="errorImg"
              style="width: 100%;"
              src="~@/assets/images/imgError.png"
              alt
            />
          </div>
        </el-image>
      </div>
      <div class="right">
        <p class="item">
          <span class="contactTitle">联系人：</span>
          <span class="text">{{ companyInfo.contactsMan }}</span>
          <a class="contactIcon" href="tel:17603033458"></a>
        </p>
        <p class="item">
          <span class="title">电话：</span>
          <span>{{ companyInfo.phoneNumber }}</span>
        </p>
        <p class="item">
          <span class="title">地址：</span>
          <span class="text">{{ companyInfo.address }}</span>
          <span class="addrIcon"></span>
        </p>
      </div>
    </div>
    <div class="line"></div>
    <div class="allProductTitle">
      <span class="title">所有产品</span>
      <span
        style="color:#165AF8;"
        class="el-icon-arrow-right"
        @click="toAllProduct('allProduct')"
      ></span>
    </div>
    <div class="productBox">
      <div
        class="item"
        @click.stop="toProductDetail(item)"
        v-for="(item, i) in productList"
        :key="i"
      >
        <div class="myImgBox">
          <el-image class="myImg" :src="item.img" fit="contain">
            <div slot="placeholder" class="image-slot" style="width:100%;">
              <img
                class="errorImg"
                style="width:100%;"
                src="~@/assets/images/imgError.png"
                alt
              />
            </div>
            <div slot="error" style="width:100%;" class="image-slot">
              <img
                class="errorImg"
                style="width:100%;"
                src="~@/assets/images/imgError.png"
                alt
              />
            </div>
          </el-image>
          <div class="newIcon" v-if="item.isNew"></div>
        </div>
        <div class="context">
          <p class="itemText name">{{ item.name }}</p>
          <p class="itemText">
            出厂货号：<span>{{ item.fa_no }}</span>
          </p>
          <p class="itemText">
            参考单价：<span class="price">￥{{ item.price }}</span>
          </p>
        </div>
        <div class="iconBox">
          <div class="vipIcon" v-if="item.isVip"></div>
          <div class="presentIcon" v-if="item.isSpotGoods"></div>
          <div class="cardIcon" v-if="item.certificateNo"></div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="allProductTitle">
      <span class="title">推荐产品</span>
      <span
        style="color:#165AF8;"
        @click="toAllProduct('recommendProduct')"
        class="el-icon-arrow-right"
      ></span>
    </div>
    <div class="productBox">
      <div
        class="item"
        @click.stop="toProductDetail(item)"
        v-for="(item, i) in recommendProduct"
        :key="i"
      >
        <div class="myImgBox">
          <el-image class="myImg" :src="item.img" fit="contain">
            <div slot="placeholder" class="image-slot" style="width:100%;">
              <img
                class="errorImg"
                style="width:100%;"
                src="~@/assets/images/imgError.png"
                alt
              />
            </div>
            <div slot="error" style="width:100%;" class="image-slot">
              <img
                class="errorImg"
                style="width:100%;"
                src="~@/assets/images/imgError.png"
                alt
              />
            </div>
          </el-image>
          <div class="newIcon" v-if="item.isNew"></div>
        </div>
        <div class="context">
          <p class="itemText name">{{ item.name }}</p>
          <p class="itemText">
            出厂货号：<span>{{ item.fa_no }}</span>
          </p>
          <p class="itemText">
            参考单价：<span class="price">￥{{ item.price }}</span>
          </p>
        </div>
        <div class="iconBox">
          <div class="vipIcon" v-if="item.isVip"></div>
          <div class="presentIcon" v-if="item.isSpotGoods"></div>
          <div class="cardIcon" v-if="item.certificateNo"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      companyInfo: {},
      productList: [],
      recommendProduct: []
    };
  },
  methods: {
    // 查看更多
    toAllProduct() {
      this.$router.push("/dontLoadAllProducts");
    },
    // 产品详情
    toProductDetail(item) {
      sessionStorage.setItem("currentProduct", JSON.stringify(item));
      this.$router.push({ path: "/dontLoadProductDetails" });
    },
    // 获取推荐产品
    async getRecommendProductByNumberPage() {
      const res = await this.$http.post(
        "/api/RecommendProductByNumberPageShare",
        { skipCount: 1, maxResultCount: 2, companyNumber: "HS0000006" }
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
        maxResultCount: 2,
        companyNumber: "HS0000006"
      });
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items;
      } else this.$message.error(res.data.result.msg);
    },
    // 呼叫联系人
    callContact() {
      const link = document.createElement("a");
      link.href = "tel";
      link.value = "17603033458";
      link.click();
    }
  },
  created() {
    if (document.body.clientWidth > 1024)
      this.$router.push(
        "/dontLoadShareFactoryPC?companyNumber=" +
          this.$route.query.companyNumber
      );
  },
  beforeDestroy() {
    document.title = "小竹熊 云科技";
  },
  computed: {
    noMore() {
      return this.totalCount <= this.productList.length;
    },
    disabled() {
      return this.$store.state.vueElementLoading || this.noMore;
    }
  },
  mounted() {
    this.getRecommendProductByNumberPage();
    this.getCompanyByIDShare();
    this.getSupplierProductShare();
  }
};
</script>
<style scoped lang="less">
@import "./dontLoadShareFactory.less";
</style>
