<template>
  <div class="bsVendorQuery">
    <div class="title">
      <div class="left">厂商查询</div>
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
      <div class="title">厂商列表 ({{ totalCount }})</div>
      <Table :table="tableData" @handleDetail="handleDetail"></Table>
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
  </div>
</template>

<script>
import Table from "@/components/table";
export default {
  name: "bsVendorQuery",
  components: {
    Table
  },
  data() {
    return {
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      keyword: null,
      dateTime: null,
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: true,
        columns: [
          {
            prop: "",
            label: "厂商",
            align: "left",
            companyInfo: true,
            companyLogo: row => {
              return row.companyLogo;
            },
            linkman: row => {
              return row.linkman;
            },
            companyName: row => {
              return row.companyName;
            }
          },
          { prop: "contactsMan", label: "联系人", width: 180 },
          { prop: "phoneNumber", label: "手机", width: 180 },
          { prop: "telePhoneNumber", label: "电话", isHiden: true },
          { prop: "address", label: "地址", width: 180 },
          {
            prop: "productCount",
            label: "产品数量",
            isHiden: true,
            width: 180
          }
        ],
        btnWidth: 200,
        actions: [
          {
            type: "primary",
            textWrapper: () => {
              return "编辑";
            },
            methods: row => {
              this.handleEdit(row);
            }
          },
          {
            type: "danger",
            textWrapper: () => {
              return "删除";
            },
            methods: row => {
              this.handleDelete(row);
            }
          }
        ]
      },
      myKeyword: "",
      isShowHistoryPanel: false,
      searchHistoryList: [],
      vuex: {},
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
        OppositeRole: "Supplier"
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/ContactsCompanyListByID", fd);
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
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
      if (history[uid + "_cs"] && history[uid + "_cs"].length != 0) {
        history[uid + "_cs"].forEach((res, index) => {
          res.value == id.value ? history[uid + "_cs"].splice(index, 1) : "";
        });
      } else {
        history[uid + "_cs"] = [];
      }
      history[uid + "_cs"].unshift(id);
      if (history[uid + "_cs"].length > 8) {
        history[uid + "_cs"].splice(8, history[uid + "_cs"].length - 8);
      }
      localStorage.setItem("searchHistory", JSON.stringify(history));
      this.searchHistoryList = history[uid + "_cs"] || [];
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
        var history = {};
        var uid = this.vuex.userInfo.uid;
        localStorage.getItem("searchHistory")
          ? (history = JSON.parse(localStorage.getItem("searchHistory")))
          : (history = {});
        this.searchHistoryList = history[uid + "_cs"] || [];
      }
      this.isShowHistoryPanel = value;
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
      if (history[uid + "_cs"] && history[uid + "_cs"].length != 0) {
        history[uid + "_cs"] = [];
        localStorage.setItem("searchHistory", JSON.stringify(history));
        this.showHistoryModal(false);
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
        fd.append("oppositeRole", "Supplier");
        fd.append("file", file.raw);
        let startDate = Date.now();
        const res = await this.$http.post("/api/ImageSearchCompany", fd);
        if (res.data.result.code === 200) {
          let endDate = Date.now();
          this.searchHttpTime = (endDate - startDate) / 1000;
          this.$store.commit("searchValues", res.data.result.object);
          this.tableData.data = res.data.result.item.items;
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
.bsVendorQuery {
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
}
</style>
