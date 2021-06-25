<template>
  <div class="box">
    <div class="searchInput">
      <span class="label">产品搜索:</span>
      <div class="inputBox">
        <el-tag effect="plain" @close="closeTag" closable v-if="searchHallCate">
          {{ searchHallCate.companyInfo.companyName }}
        </el-tag>
        <div class="history_box">
          <el-input
            :class="{ isPadding: MyisGaoji || MyisZonghe === true }"
            size="medium"
            ref="focusKeyword"
            @keyup.native.enter="searchProducts"
            style="width: 340px; margin: 0 15px;"
            :placeholder="
              MyisGaoji || MyisZonghe === true ? '' : placeholderVal
            "
            v-model="myKeyword"
            clearable
            @focus="showHistoryModal(true)"
            @blur="showHistoryModalY(false)"
            @change="showHistoryModal(false)"
            @input="showHistoryModalI"
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
              <!-- <div>高级搜索</div> -->
            </template>
          </el-input>
          <div v-if="MyisGaoji" class="gaoji">
            高级搜索
            <i @click="handleIsgaoji" class="el-icon-close"></i>
          </div>
          <div v-if="MyisZonghe" class="gaoji">
            综合搜索
            <i @click="handleIsZonghe" class="el-icon-close"></i>
          </div>
          <div
            class="history"
            v-show="isShowHistoryPanel && searchHistoryList.length"
          >
            <ul class="history_list">
              <li class="history_item del">
                最近搜索
                <div class="del_all" @click="historyDel">清空</div>
              </li>
              <template v-for="(item, index) in searchHistoryList">
                <li
                  class="history_item"
                  @mousedown="historySearch(item.value)"
                  :key="index"
                >
                  {{ item.value }}
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>

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
        style="margin: 0 30px"
      >
        <el-checkbox label="精准查询" name="type"></el-checkbox>
      </el-checkbox-group>
      <p class="shuxian"></p>
      <div class="advancedBox" @click="advancedSearchProducts">
        高级搜索
        <i
          :class="advanced == true ? 'el-icon-arrow-down' : ' el-icon-arrow-up'"
        ></i>
      </div>
      <p class="shuxian"></p>
      <div class="synthesizeBox" @click="handleIsSynthesize">
        <i class="synthesizeIcon"></i>
        综合搜索
      </div>
    </div>
    <el-button
      v-if="typeId != 1"
      type="warning"
      size="medium"
      @click="toShoppingCart"
    >
      <i class="whiteCart"></i>
      <span>购物车</span>
      <span>({{ myShoppingCartCount }})</span>
    </el-button>
  </div>
</template>

<script>
import eventBus from "@/assets/js/common/eventBus";
import { mapState } from "vuex";
export default {
  name: "bsProductSearch",
  props: ["keyword", "MyisGaoji", "MyisZonghe"],
  data() {
    return {
      isGaoji: null,
      placeholderVal: "输入关键词+空格可模糊搜索",
      synthesis: false,
      advanced: true,
      IsSynthesize: false,
      myKeyword: "",
      isShowHistoryPanel: false,
      searchHistoryList: [],
      vuex: {}
    };
  },
  watch: {
    myKeyword(val) {
      this.$emit("input", val);
    },
    keyword(val) {
      this.myKeyword = val;
    }
  },
  methods: {
    //关闭高级搜索显示
    handleIsgaoji() {
      this.$emit("handleIsgaoji");
    },
    //关闭综合搜索显示
    handleIsZonghe() {
      this.$emit("handleIsZonghe");
    },
    // 关闭关联搜索
    closeTag() {
      this.$emit("closeTag");
    },
    // 选择图片-图搜
    openUpload(file) {
      eventBus.$emit("openUpload", file);
    },
    // 文本搜索产品
    searchProducts() {
      var uid = this.vuex.userInfo.uid;
      var id = {
        value: this.myKeyword
      };
      var history = {};
      localStorage.getItem("searchHistory")
        ? (history = JSON.parse(localStorage.getItem("searchHistory")))
        : (history = {});
      if (history[uid + "_pr"] && history[uid + "_pr"].length != 0) {
        history[uid + "_pr"].forEach((res, index) => {
          res.value == id.value ? history[uid + "_pr"].splice(index, 1) : "";
        });
      } else {
        history[uid + "_pr"] = [];
      }
      history[uid + "_pr"].unshift(id);
      if (history[uid + "_pr"].length > 8) {
        history[uid + "_pr"].splice(8, history[uid + "_pr"].length - 8);
      }
      localStorage.setItem("searchHistory", JSON.stringify(history));
      this.searchHistoryList = history[uid + "_pr"] || [];
      this.showHistoryModal(false);
      eventBus.$emit("searchProducts");
      // const fd = {
      //   name: "/bsIndex/bsProductSearchIndex",
      //   linkUrl: "/bsIndex/bsProductSearchIndex",
      //   component: "bsProductSearchIndex",
      //   refresh: true,
      //   label: "产品查询"
      // };
      // this.$store.commit("myAddTab", fd);
    },
    // 选择精准
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
    },
    handleIsSynthesize() {
      this.IsSynthesize = !this.IsSynthesize;
      this.$emit("handleIsSynthesize");
    },
    //是否显示历史搜索面板
    showHistoryModal(value) {
      if (value) {
        this.initSearchList();
      }
      this.isShowHistoryPanel = value;
    },
    initSearchList() {
      var history = {};
      var uid = this.vuex.userInfo.uid;
      localStorage.getItem("searchHistory")
        ? (history = JSON.parse(localStorage.getItem("searchHistory")))
        : (history = {});
      this.searchHistoryList = history[uid + "_pr"] || [];
    },
    showHistoryModalY(value) {
      var me = this;
      setTimeout(function() {
        me.isShowHistoryPanel = value;
      }, 500);
    },
    showHistoryModalI(value) {
      if (!value) {
        this.isShowHistoryPanel = true;
      }
    },
    //点击历史搜索
    historySearch(value) {
      this.$emit("input", value);
      this.myKeyword = value;
      this.searchProducts();
    },
    //搜索清空
    historyDel() {
      var uid = this.vuex.userInfo.uid;
      var history = {};
      localStorage.getItem("searchHistory")
        ? (history = JSON.parse(localStorage.getItem("searchHistory")))
        : (history = {});
      if (history[uid + "_pr"] && history[uid + "_pr"].length != 0) {
        history[uid + "_pr"] = [];
        localStorage.setItem("searchHistory", JSON.stringify(history));
        this.showHistoryModal(false);
      }
    }
  },
  created() {
    this.vuex = JSON.parse(sessionStorage.getItem("vuex"));
  },
  mounted() {
    eventBus.$on("imgSearchChange", () => {
      this.$refs.uploadRef.$children[0].$refs.input.click();
      this.$store.commit("handlerimgSearch", false);
    });
  },
  computed: {
    ...mapState(["searchHallCate", "typeId", "myShoppingCartCount"])
  },
  beforeDestroy() {
    eventBus.$off("imgSearchChange");
    eventBus.$off("txtSearch");
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
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
    .inputBox {
      margin-left: 5px;
      display: flex;
      .el-tag {
        margin-left: 10px;
        height: 36px;
        line-height: 36px;
        vertical-align: top;
        box-sizing: border-box;
      }
      .history_box {
        position: relative;
        @{deep}.el-input--prefix .el-input__inner {
          padding-left: 45px;
        }
        @{deep}.el-input__prefix {
          left: 14px;
        }
        @{deep}.isPadding {
          .el-input__inner {
            padding-left: 130px;
          }
        }
        .gaoji {
          position: absolute;
          top: 6px;
          left: 50px;
          height: 24px;
          background: #f9723e;
          border-radius: 4px;
          color: #fff;
          line-height: 24px;
          padding: 0 9px;
          cursor: pointer;
        }
        .history {
          position: absolute;
          // top: 50px;
          left: 15px;
          transform-origin: center top;
          z-index: 2037;
          width: 340px;
          margin: 5px 0;
          box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
          border-radius: 4px;
          border: 1px solid #e4e7ed;
          box-sizing: border-box;
          background-color: #fff;
          .history_list {
            .history_item {
              padding: 0 20px;
              margin: 0;
              line-height: 34px;
              cursor: pointer;
              color: #5e8ce8;
              font-size: 14px;
              list-style: none;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #666666;
            }
            .del {
              color: #333333;
              .del_all {
                float: right;
              }
            }
            .history_item:hover {
              background-color: #f9fafc;
            }
          }
        }
      }
    }
    .shuxian {
      width: 1px;
      height: 16px;
      background: #b9b9b9;
    }
    .advancedBox {
      margin: 0 30px;
      cursor: pointer;
      color: #3368a9;
      i {
        margin-left: 5px;
        width: 10px;
        height: 10px;
        color: #3368a9;
        display: inline-block;
      }
    }
    .synthesizeBox {
      margin: 0 30px;
      cursor: pointer;
      .synthesizeIcon {
        display: inline-block;
        vertical-align: bottom;
        width: 20px;
        height: 16px;
        background: url("~@/assets/images/synthesizeIcon.png") no-repeat center;
        background-size: contain;
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
