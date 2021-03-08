<template>
  <div class="baojia">
    <div class="productBox">
      <el-carousel autoplay class="myImg" ref="swiperRef">
        <el-carousel-item v-for="(item, i) in 4" :key="i">
          <div
            class="myImgBox"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
          >
            <el-image
              :z-index="9999999"
              class="myImg"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
              fit="contain"
            >
            </el-image>
            <div class="newIcon"></div>
            <div @touchstart="openVideo" class="videoIcon" v-if="i === 0"></div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="priceBox">
      <div class="price"><span class="priceItem">￥20 </span>现货：0pcs</div>
      <div class="productName">
        疯狂动物城警察兔朱迪毛绒玩具
      </div>
      <div class="iconListBox">
        <div class="left"><el-tag size="medium">YS0505408</el-tag></div>
        <div class="middle">
          <div class="vipIcon"></div>
          <div class="presentIcon"></div>
          <div class="cardIcon"></div>
        </div>
        <div class="right">
          <i class="dateIcon"></i>
          2020-10-10
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="contentText">
      <div class="sourceBox">
        <div class="source">
          来源 : 新悦翔展厅
        </div>
        <div class="boothNumber">
          摊位号 : 450417
        </div>
      </div>
      <div class="conText">
        <div class="conTextTitle">产品详情</div>
        <div class="item">
          <div class="title">出厂货号：</div>
          HS0046642
        </div>
        <div class="item">
          <div class="title">包装：</div>
          PVC卡头袋
        </div>
        <div class="item">
          <div class="title">装箱量：</div>
          内盒数/装箱数(PCS)
        </div>
        <div class="item">
          <div class="title">样品规格：</div>
          29×3×22(CM)
        </div>
        <div class="item">
          <div class="title">包装规格：</div>
          10×20×30(CM)
        </div>
        <div class="item">
          <div class="title">外箱规格：</div>
          29×3×22(CM)
        </div>
        <div class="item">
          <div class="title">体积/材积：</div>
          0.035/10.27
        </div>
        <div class="item">
          <div class="title">毛重/净重：</div>
          30.02/20.01(KG)
        </div>
        <div class="item">
          <div class="title">证书编号：</div>
          1234567890123456
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productDetail: {},
      direction: null, // 移动方向
      startX: 0, // 开始触摸的位置
      moveX: 0, // 滑动时的位置
      endX: 0, // 结束触摸的位置
      disX: 0 // 移动距离
    };
  },
  methods: {
    touchEnd(e) {
      e = e || window.event;
      e.preventDefault();
      switch (this.direction) {
        case "left":
          this.$refs.swiperRef.next();
          break;
        case "right":
          this.$refs.swiperRef.prev();
          break;
      }
    },
    touchStart(e) {
      e = e || window.event;
      e.preventDefault();
      if (e.touches.length === 1) {
        // tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
        this.startX = e.touches[0].clientX; // 记录开始位置
        this.direction = null;
      }
    },
    touchMove(e) {
      e = e || window.event;
      e.preventDefault();
      if (e.touches.length === 1) {
        // 滑动时距离浏览器左侧的距离
        this.moveX = e.touches[0].clientX;
        // 实时的滑动的距离-起始位置=实时移动的位置
        this.disX = this.moveX - this.startX;
        if (this.disX < 0 || this.disX === 0) {
          // 左滑动 上一张
          this.direction = "left";
        } else if (this.disX > 0) {
          // 右滑动 下一张
          this.direction = "right";
        } else {
          this.direction = null;
        }
      }
    },
    // 点击了视频播放
    openVideo() {
      console.log("openVideo");
    },
    // 获取所有分类
    async getProductCategoryList() {
      this.$store.commit("updateAppLoading", true);
      const res = await this.$http.post("/api/SelectProductCategory", {
        companyNumber: this.productInfo.companyNumber
      });
      if (res.data.result.code === 200) {
        this.categoryList = res.data.result.item;
        // this.categoryChildren = this.categoryList[0].children
      } else {
        this.$message.error(res.data.result.msg);
      }
      this.$store.commit("updateAppLoading", false);
    }
  },
  created() {
    this.productDetail = JSON.parse(sessionStorage.getItem("currentProduct"));
    document.title = "产品详情";
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
    // if (this.$store.state.screenWidth > 1024) this.$router.push('/offerSharingPC?id=' + this.$route.query.id)
  }
};
</script>
<style scoped lang="less">
@import "./dontLoadShareFactoryProductDetails.less";
</style>
