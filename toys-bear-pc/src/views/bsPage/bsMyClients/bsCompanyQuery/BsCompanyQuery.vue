<template>
  <div class="bsCompanyQuery">
    <div class="title">
      <div class="left">公司查询</div>
    </div>
    <div class="searchBox">
      <div class="left">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            type="text"
            size="medium"
            v-model="keyword"
            clearable
            placeholder="请输入关键词"
            @keyup.native.enter="search"
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
                action="/api/WebsiteShare/ImageSearchCompany"
                :show-file-list="false"
                :on-change="uploadPic"
              >
                <i class="iconXj"></i>
              </el-upload>
            </template>
          </el-input>
        </div>
        <div class="item">
          <el-button
            @click="search"
            type="primary"
            icon="el-icon-search"
            size="medium"
          >
            搜索
          </el-button>
        </div>
      </div>
      <div
        class="history"
        v-if="isShowHistoryPanel && searchHistoryList.length"
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
    <div class="tusou_box" v-if="isShowPic">
      <div class="item">
        <span class="label">按图搜：</span>
        <div class="tusou_img">
          <div class="tusou_del" @click="isShowPicBox(false)">
            <i class="el-icon-error"></i>
          </div>
          <img :src="baseImg" />
        </div>
      </div>
    </div>
    <!-- 厂商列表 -->
    <div class="tableBox">
      <div class="title">公司列表 ({{ totalCount }})</div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f9fafc' }"
        @row-click="showDetailModal"
      >
        <el-table-column label="序号" type="index" align="center" width="70">
        </el-table-column>
        <el-table-column label="公司">
          <template slot-scope="scope">
            <div class="nameBox">
              <el-avatar
                style="background-color: #e4efff"
                :size="40"
                :src="scope.row.companyLogo"
              >
                <p class="errText">
                  {{ scope.row.linkman }}
                </p>
              </el-avatar>
              <span style="margin-left: 10px" class="name">{{
                scope.row.companyName
              }}</span>
              <span class="isMain" v-if="scope.row.isMain"><i>主账号</i></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="contactsMan"
          label="联系人"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="phoneNumber"
          label="手机"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="telePhoneNumber"
          label="电话"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="address" label="地址">
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <center style="padding: 20px 0" v-if="!isShowPic">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40]"
          background
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
    <!-- 公司详情dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        title=""
        class="detail_dialog"
        v-if="isShowModal"
        :visible.sync="isShowModal"
        width="455px"
        top="11vh"
      >
        <div class="detail_dialog_panel">
          <div class="detail_dialog_head">
            <img :src="defaultBgImg" />
          </div>
          <div class="detail_dialog_title">
            <div class="detail_dialog_title_text">
              {{ detailInfo.abbreviation }}
            </div>
          </div>
          <div class="detail_dialog_content">
            <div class="detail_dialog_content_name">
              {{ detailInfo.companyName }}
            </div>
            <div class="detail_dialog_content_list_item">
              <div
                class="detail_dialog_content_item"
                v-if="detailInfo.contactsMan"
              >
                <div class="label">
                  联系人：<span>{{ detailInfo.contactsMan }}</span>
                </div>
              </div>
              <div
                class="detail_dialog_content_item"
                v-if="detailInfo.telePhoneNumber"
              >
                <div class="label">
                  电话：<span>{{ detailInfo.telePhoneNumber }}</span>
                </div>
              </div>
              <div
                class="detail_dialog_content_item"
                v-if="detailInfo.phoneNumber"
              >
                <div class="label">
                  手机：<span>{{ detailInfo.phoneNumber }}</span>
                </div>
              </div>
              <div class="detail_dialog_content_item" v-if="detailInfo.address">
                <div class="label">
                  地址：<span>{{ detailInfo.address }}</span>
                </div>
              </div>
              <div class="detail_dialog_content_item_zixun">
                <div class="label chart" @click="toNews">
                  <div class="icon_box">
                    <i class="el-icon-chat-dot-round"></i>
                  </div>
                  <div class="icon_title">在线咨询</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </transition>
  </div>
</template>

<script>
export default {
  name: "bsCompanyQuery",
  data() {
    return {
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      keyword: null,
      dateTime: null,
      tableData: [],
      myKeyword: "",
      isShowHistoryPanel: false,
      searchHistoryList: [],
      vuex: {},
      isShowModal: false, //是否显示详情弹窗
      defaultBgImg: require("@/assets/images/bsCompanyQueryBg.png"),
      detailInfo: {}, //公司详情
      baseImg: {}, //图搜图片
      isShowPic: false //是否显示图搜
    };
  },
  methods: {
    async getVendorListPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.keyword,
        OppositeRole: "Sales"
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/ContactsCompanyListByID", fd);
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
        console.log("contactsMan", this.tableData);
      }
    },
    //点击详情
    async handleDetail(e) {
      console.log(e);
      const fd = {
        name: e.companyName,
        linkUrl: "/bsIndex/bsVendorQuery",
        component: "bsMyClientsDetail",
        refresh: true,
        noPush: true,
        label: e.companyName,
        value: e
      };
      this.$store.commit("myAddTab", fd);
    },
    // 搜索
    search() {
      this.isShowPic = false;
      var uid = this.vuex.userInfo.uid;
      var id = {
        value: this.keyword
      };
      var history = {};
      localStorage.getItem("searchHistory")
        ? (history = JSON.parse(localStorage.getItem("searchHistory")))
        : (history = {});
      if (history[uid + "_cy"] && history[uid + "_cy"].length != 0) {
        history[uid + "_cy"].forEach((res, index) => {
          res.value == id.value ? history[uid + "_cy"].splice(index, 1) : "";
        });
      } else {
        history[uid + "_cy"] = [];
      }
      history[uid + "_cy"].unshift(id);
      if (history[uid + "_cy"].length > 8) {
        history[uid + "_cy"].splice(8, history[uid + "_cy"].length - 8);
      }
      localStorage.setItem("searchHistory", JSON.stringify(history));
      this.searchHistoryList = history[uid + "_cy"] || [];
      this.showHistoryModal(false);
      this.currentPage = 1;
      this.getVendorListPage();
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getVendorListPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getVendorListPage();
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
      this.searchHistoryList = history[uid + "_cy"] || [];
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
      this.keyword = value;
      this.search();
    },
    //搜索清空
    historyDel() {
      var uid = this.vuex.userInfo.uid;
      var history = {};
      localStorage.getItem("searchHistory")
        ? (history = JSON.parse(localStorage.getItem("searchHistory")))
        : (history = {});
      if (history[uid + "_cy"] && history[uid + "_cy"].length != 0) {
        history[uid + "_cy"] = [];
        localStorage.setItem("searchHistory", JSON.stringify(history));
        this.showHistoryModal(false);
      }
    },
    //详情弹窗
    showDetailModal(value) {
      var flag = this.isShowModal ? false : true;
      this.isShowModal = flag;
      if (this.isShowModal) {
        this.detailInfo = value;
        this.$set(
          this.detailInfo,
          "abbreviation",
          this.detailInfo.companyName &&
            this.detailInfo.companyName.substring(0, 2)
        );
      } else {
        this.detailInfo = {};
      }
    },
    // 图搜上传
    async uploadPic(file) {
      const isLt5M = file.size / 1024 / 1024 < 3;
      if (!isLt5M) {
        this.$common.handlerMsgState({
          msg: "上传文件大小不能超过 3MB!",
          type: "danger"
        });
        this.baseImg = "";
        this.$refs.uploadRef.value = "";
        return false;
      }
      // 上传
      try {
        const fd = new FormData();
        fd.append("oppositeRole", "sales");
        fd.append("file", file.raw);
        let startDate = Date.now();
        const res = await this.$http.post("/api/ImageSearchCompany", fd);
        if (res.data.result.code === 200) {
          let endDate = Date.now();
          this.searchHttpTime = (endDate - startDate) / 1000;
          this.$store.commit("searchValues", res.data.result.object);
          this.tableData = res.data.result.item.items;
          this.totalCount = res.data.result.item.totalCount;
          this.$nextTick(() => {
            const f = window.URL.createObjectURL(file.raw);
            this.baseImg = f;
            this.isShowPic = true;
          });
        } else {
          this.$common.handlerMsgState({
            msg: res.data.result.message,
            type: "danger"
          });
        }
      } catch (error) {
        this.$common.handlerMsgState({
          msg: "上传出错",
          type: "danger"
        });
      }
    },
    //是否显示图搜框
    isShowPicBox(value) {
      this.isShowPic = value;
    },
    // 去聊天
    toNews() {
      this.isShowModal = false;
      const fd = {
        name: this.detailInfo.companyNumber + "bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: this.detailInfo.companyName,
        value: this.detailInfo
      };
      this.$router.push("/bsIndex/bsNews");
      this.$store.commit("myAddTab", fd);
    }
  },
  created() {
    this.vuex = JSON.parse(sessionStorage.getItem("vuex"));
  },
  mounted() {
    this.getVendorListPage();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
@{deep} .el-table {
  color: #666;
  tr {
    cursor: pointer;
  }
  .nameBox {
    width: 300px;
    display: flex;
    align-items: center;
    .el-avatar {
      color: #3368a9;
      img {
        width: 40px;
        min-height: 40px;
      }
    }
  }
}
.bsCompanyQuery {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .title {
    height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left::before {
      width: 4px;
      height: 14px;
      background-color: #3368a9;
      position: absolute;
      left: 0;
      top: 50%;
      content: "";
      transform: translate(0, -50%);
    }
  }
  .searchBox {
    height: 76px;
    display: flex;
    align-items: center;
    .name {
      margin-left: 16px;
    }
    .isMain {
      margin-left: 10px;
      width: 44px;
      height: 18px;
      text-align: center;
      background: #ff4848;
      border-radius: 9px;
      color: #fff;
      font-size: 12px;
      i {
        display: block;
        position: relative;
        top: -3px;
        -webkit-transform: scale(0.7);
        -moz-transform: scale(0.7);
        -ms-transform: scale(0.7);
        transform: scale(0.7);
      }
    }
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      .item {
        display: flex;
        align-items: center;
        max-width: 258px;
        margin-right: 20px;
        .label {
          width: 58px;
          min-width: 58px;
        }
      }
    }
    .history {
      position: absolute;
      left: 77px;
      transform-origin: center top;
      z-index: 2037;
      width: 315px;
      margin: 5px 0;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      border-radius: 4px;
      border: 1px solid #e4e7ed;
      box-sizing: border-box;
      background-color: #fff;
      top: 130px;
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
  .tusou_box {
    margin-top: 10px;
    .item {
      display: flex;
      align-items: center;
      .tusou_img {
        position: relative;
        img {
          width: 87px;
          height: 87px;
          border: 1px solid #e2e2e2;
        }
        .tusou_del {
          position: absolute;
          right: -14px;
          top: -17px;
          font-size: 24px;
          color: #2c2c2c;
          opacity: 0.5;
        }
      }
    }
  }
}
@{deep} .detail_dialog {
  .el-dialog__body {
    padding: 0;
  }
}
.detail_dialog {
  .detail_dialog_panel {
    width: 100%;
    height: 699px;
    opacity: 1;
    background: #ffffff;
    border-radius: 4px;
    position: relative;
    .detail_dialog_head {
      width: 100%;
      height: 185px;
      opacity: 1;
      background: #ffffff;
    }
    .detail_dialog_title {
      width: 120px;
      height: 120px;
      opacity: 1;
      background: #3368a9;
      border: 1px solid #3368a9;
      border-radius: 50%;
      position: absolute;
      top: 125px;
      left: 167.5px;
      .detail_dialog_title_text {
        text-align: center;
        width: 120px;
        height: 52px;
        opacity: 1;
        font-size: 40px;
        font-weight: 400;
        color: #ffffff;
        line-height: 24px;
        margin-top: 48px;
      }
    }
    .detail_dialog_content {
      margin-top: 76px;
      .detail_dialog_content_name {
        width: 192px;
        height: 31px;
        opacity: 1;
        font-size: 24px;
        font-weight: 400;
        text-align: center;
        color: #333333;
        line-height: 34px;
        margin: auto;
      }
      .detail_dialog_content_list_item {
        margin-top: 48px;
        .detail_dialog_content_item {
          opacity: 1;
          font-size: 14px;
          font-weight: 400;
          text-align: left;
          color: #666666;
          line-height: 34px;
          margin-left: 90px;
        }
        .detail_dialog_content_item_zixun {
          opacity: 1;
          font-size: 14px;
          font-weight: 400;
          text-align: left;
          color: #666666;
          line-height: 45px;
          margin-left: 90px;
          .label {
            display: flex;
            .icon_box {
              width: 28px;
              height: 28px;
              opacity: 1;
              background: #3368a9;
              border: 1px solid #3368a9;
              border-radius: 50%;
              color: white;
              margin-top: 7.5px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .icon_title {
              margin-left: 10px;
            }
          }
          .chart:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
