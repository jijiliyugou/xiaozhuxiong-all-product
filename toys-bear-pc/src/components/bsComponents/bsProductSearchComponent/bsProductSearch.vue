<template>
  <div class="box">
    <div class="searchInput">
      <span class="label">产品搜索:</span>
      <el-input
        size="medium"
        ref="focusKeyword"
        @keyup.native.enter="searchProducts"
        style="width: 340px;margin: 0 15px;"
        placeholder="请输入关键词"
        v-model="searchForm.keyword"
        clearable
      >
        <template slot="prefix">
          <el-upload
            :auto-upload="false"
            ref="uploadRef"
            accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
            class="upload-demo"
            action="/api/WebsiteShare/SearchProductsByPicture"
            :show-file-list="false"
            :on-change="openUpload"
          >
            <i class="iconXj"></i>
            <!-- <i
              style="font-size: 20px;"
              class="el-input__icon el-icon-camera-solid"
            ></i> -->
          </el-upload>
        </template>
      </el-input>
      <el-button
        size="medium"
        @click="searchProducts"
        type="primary"
        icon="el-icon-search"
        >搜 索</el-button
      >
    </div>
    <el-button type="warning" size="medium" @click="toShoppingCart">
      <i class="whiteCart"></i>
      <span>购物车</span>
      <span>({{ shoppingList.length }})</span>
    </el-button>
  </div>
</template>

<script>
import eventBus from "@/assets/js/common/eventBus";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      searchForm: {
        keyword: ""
      }
    };
  },
  methods: {
    // 选择图片-图搜
    openUpload(file) {
      // const fd = {
      //   name: "/bsIndex/bsProductSearchIndex",
      //   linkUrl: "/bsIndex/bsProductSearchIndex",
      //   component: "bsProductSearchIndex",
      //   refresh: true,
      //   label: "产品查询"
      // };
      // this.$store.commit("myAddTab", fd);
      eventBus.$emit("openUpload", file);
    },
    // 文本搜索产品
    searchProducts() {
      eventBus.$emit("searchProducts", this.searchForm);
      // const fd = {
      //   name: "/bsIndex/bsProductSearchIndex",
      //   linkUrl: "/bsIndex/bsProductSearchIndex",
      //   component: "bsProductSearchIndex",
      //   refresh: true,
      //   label: "产品查询"
      // };
      // this.$store.commit("myAddTab", fd);
    },
    // 去购物车
    toShoppingCart() {
      this.$router.push("/bsIndex/bsShoppingCart");
      const fd = {
        name: "/bsIndex/bsShoppingCart",
        linkUrl: "/bsIndex/bsShoppingCart",
        component: "bsShoppingCart",
        refresh: true,
        label: "购物车"
      };
      this.$store.commit("myAddTab", fd);
    }
  },
  created() {},
  mounted() {
    eventBus.$on("imgSearch", () => {
      this.$refs.uploadRef.$children[0].$refs.input.click();
    });
  },
  computed: {
    ...mapGetters({
      shoppingList: "myShoppingList"
    })
  },
  beforeDestroy() {
    eventBus.$off("imgSearch");
  }
};
</script>
<style scoped lang="less">
.box {
  width: 100%;
  display: flex;
  padding: 20px;
  background: #fff;
  box-sizing: border-box;
  .searchInput {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .upload-demo {
    margin-top: 7px;
  }
  .iconXj {
    display: inline-block;
    vertical-align: bottom;
    width: 20px;
    height: 20px;
    background: url("~@/assets/images/xiangji.png") no-repeat center;
    background-size: contain;
  }
  .whiteCart {
    display: inline-block;
    vertical-align: bottom;
    width: 14px;
    height: 14px;
    background: url("~@/assets/images/whiteCart.png") no-repeat center;
    background-size: contain;
    margin-right: 10px;
  }
}
</style>
