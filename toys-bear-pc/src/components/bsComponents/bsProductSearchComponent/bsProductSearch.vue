<template>
  <div class="box">
    <div class="searchInput">
      <span class="label">产品搜索:</span>
      <el-input
        v-focus
        size="medium"
        ref="focusKeyword"
        @keyup.native.enter="searchProducts"
        style="width: 340px; margin: 0 15px"
        placeholder="输入关键词+空格可模糊搜索"
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

      <el-checkbox-group
        v-model="synthesis"
        @change="handleSynthesis"
        style="margin: 0 30px;"
      >
        <el-checkbox label="精准查询" name="type"></el-checkbox>
      </el-checkbox-group>
      <div class="advancedBox" @click="advancedSearchProducts">
        高级搜索
        <i
          :class="advanced == true ? 'el-icon-arrow-down' : ' el-icon-arrow-up'"
        ></i>
      </div>
    </div>
    <el-button type="warning" size="medium" @click="toShoppingCart">
      <i class="whiteCart"></i>
      <span>购物车</span>
      <span>({{ shoppingList && shoppingList.length }})</span>
    </el-button>
  </div>
</template>

<script>
import eventBus from "@/assets/js/common/eventBus";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      synthesis: false,
      advanced: true,
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
    // 选择综合
    handleSynthesis() {
      this.$emit("handleSynthesis");
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
    },
    // 切换高级搜索
    advancedSearchProducts() {
      this.advanced = !this.advanced;
      this.$emit("screeningShow");
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
    .advancedBox {
      width: 90px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 36px;
      cursor: pointer;
      i {
        margin-left: 5px;
        width: 10px;
        height: 10px;
        color: #666666;
        display: inline-block;
      }
    }
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
