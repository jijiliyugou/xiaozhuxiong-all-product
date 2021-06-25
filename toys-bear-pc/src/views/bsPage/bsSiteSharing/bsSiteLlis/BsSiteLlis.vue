<template>
  <div class="bsMyCollection">
    <div class="title">站点列表 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="left">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            v-model="keyword"
            clearable
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
        </div>
        <div class="item">
          <span class="label">站点：</span>
          <el-select
            v-model="websiteInfoId"
            size="medium"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in sitesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="item" v-if="userInfo.userInfo.isMain">
          <span class="label">业务员：</span>
          <el-select
            v-model="userId"
            filterable
            size="medium"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in staffList"
              :key="item.id"
              :label="item.linkman"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <span class="label">时间段：</span>
          <el-date-picker
            size="medium"
            value-format="yyyy-MM-ddTHH:mm:ss"
            v-model="dateTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
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
      <el-button
        @click="openAddClien"
        type="primary"
        icon="el-icon-plus"
        size="medium"
      >
        新增站点
      </el-button>
    </div>
    <div class="tableBox">
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="collecTable"
        :header-cell-style="{ backgroundColor: '#f9fafc' }"
      >
        <el-table-column label="序号" type="index" align="center" width="70">
        </el-table-column>
        <el-table-column label="站点" width="150" prop="siteRegion">
          <template slot-scope="scope">
            <div>
              <i
                style="color: #3368a9; margin-right: 15px"
                class="iconfont icon-hulianwang"
              ></i>
              <span>{{ scope.row.siteRegion }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="shareUrl"
          min-width="200"
          label="网址 (可单击打开)"
        >
          <template slot-scope="scope">
            <div :id="scope.row.id">
              <el-link type="info" :href="scope.row.shareUrl" target="_blank">
                {{ scope.row.shareUrl }}
              </el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="复制/扫码" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              type="primary"
              @click.stop="copyUrl(scope.row.id)"
              >复制</el-button
            >
            <el-button
              size="mini"
              plain
              type="success"
              @click.stop="generateQRCode(scope.row.shareUrl)"
              >二维码</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户"
          align="center"
        ></el-table-column>
        <el-table-column label="登录码" align="center">
          <template slot-scope="scope">
            <div class="loginCodeBox">
              <span :id="scope.row.verifyCode">
                {{ scope.row.verifyCode }}
              </span>
              <div class="copy">
                <i
                  class="el-icon-document-copy"
                  @click="copyUrl(scope.row.verifyCode)"
                ></i>
                <i
                  @click="resetLoginCode(scope.row)"
                  class="el-icon-refresh"
                ></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="100">
          <template slot-scope="scope">
            <span> {{ scope.row.createdOn.replace(/T.*/, "") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="业务员"
          align="center"
          prop="createdBy"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="有效期" align="center" width="100">
          <template slot-scope="scope">
            {{
              (scope.row.expireTime && scope.row.expireTime.split("T")[0]) ||
                "永久有效"
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              style="margin-right: 10px"
              size="mini"
              type="success"
              @click.stop="openEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click.stop="handleDelete(scope.row)"
              slot="reference"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <center style="padding: 20px 0">
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
    <!-- 新增编辑分享dialog -->
    <el-dialog
      class="siteDialog"
      :title="dialogTitle"
      :visible.sync="addClienDialog"
      v-if="addClienDialog"
      :close-on-click-modal="false"
      top="80px"
      width="930px"
    >
      <bsAddSite
        :customerTemplate="customerTemplate"
        :myFormData="myFormData"
        :handSitesList="handSitesList"
        :isEdit="isEdit"
        :langs="langs"
        @close="close"
        @submit="submit"
      />
    </el-dialog>
    <!-- 生成二维码 -->
    <el-dialog :visible.sync="QRCodeDialog" v-if="QRCodeDialog" width="385px">
      <vue-qr
        style="width: 100%"
        :text="QRCodeUrl"
        colorLight="#fff"
        colorDark="#000"
        :margin="0"
      ></vue-qr>
    </el-dialog>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import { mapState } from "vuex";
import bsAddSite from "./components/bsAddSite.vue";
export default {
  name: "bsSiteLlis",
  components: {
    VueQr,
    bsAddSite
  },
  data() {
    return {
      myFormData: null,
      isEdit: false,
      langs: [],
      tp: 1,
      srcoll: "",
      rightBoxScroll: null, //滚动条的高度
      dateTime: null,
      handSitesList: [],
      websiteInfoId: null,
      userId: null,
      sitesList: [],
      staffList: [],
      clientCurrentPage: 1,
      clientPageSize: 999,
      keyword: null,
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      QRCodeDialog: false,
      QRCodeUrl: "",
      customerTemplate: [],
      addClienDialog: false,
      dialogTitle: "新增站点",
      defaultShareDomain: []
    };
  },
  methods: {
    // 提交
    submit() {
      this.isEdit = false;
      this.addClienDialog = false;
      this.getDataList();
    },
    // 关闭
    close() {
      this.isEdit = false;
      this.addClienDialog = false;
    },
    // 获取站点列表
    async getDefaultSites() {
      const res = await this.$http.post("/api/SearchDropdownWebsiteInfos", {});
      if (res.data.result.code === 200) {
        this.sitesList = [{ name: "全部", id: null }, ...res.data.result.item];
        this.handSitesList = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取公司下的员工列表
    async getStaffList() {
      const res = await this.$http.post("/api/CompanyUserList", {
        orgCompanyID: this.currentComparnyId
      });
      if (res.data.result.code === 200) {
        this.staffList = res.data.result.item.personnels;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取列表
    async getDataList() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.keyword,
        websiteInfoId: this.websiteInfoId,
        userId: this.userId,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SearchWebsiteShareInfosPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData = res.data.result.item.items;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 删除分享
    async handleDelete(row) {
      this.$confirm("确定要删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post(
            "/api/DeleteWebsiteShareInfo?id=" + row.id,
            {}
          );
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.getDataList();
          } else {
            this.$common.handlerMsgState({
              msg: "删除失败,请联系管理员！",
              type: "danger"
            });
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "已取消删除",
            type: "warning"
          });
        });
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getDataList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getDataList();
    },
    // 刷新登录码
    async resetLoginCode(row) {
      const res = await this.$http.post("/api/RefreshVerifyCode?id=" + row.id);
      const { code, item, msg } = res.data.result;
      if (code === 200) row.verifyCode = item;
      else {
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    },
    // 打开新增分享
    openAddClien() {
      this.isEdit = false;
      this.dialogTitle = "新增站点";
      this.addClienDialog = true;
    },
    // 获取客户报价模板
    async getSelectProductOfferFormulaList() {
      const res = await this.$http.post(
        "/api/SelectProductOfferFormulaList",
        {}
      );
      if (res.data.result.code === 200) {
        this.customerTemplate = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 打开编辑分享
    openEdit(row) {
      this.dialogTitle = "编辑站点";
      this.isEdit = true;
      this.addClienDialog = true;
      this.myFormData = row;
    },
    // 生成二维码
    generateQRCode(url) {
      if (!url) {
        return;
      }
      this.QRCodeUrl = url;
      this.QRCodeDialog = true;
    },
    // 复制登录码
    // 复制链接
    copyUrl(id) {
      var link = document.getElementById(id);
      var range;
      if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(link);
        range.select();
      } else if (window.getSelection) {
        var selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(link);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        console.warn("none");
      }
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$common.handlerMsgState({
        msg: "已复制好，可贴粘。",
        type: "success"
      });
    },

    // 搜索
    search() {
      this.currentPage = 1;
      this.getDataList();
    }
  },
  computed: {
    ...mapState(["userInfo", "currentComparnyId"])
  },
  created() {
    this.getDataList();
    this.getStaffList();
    this.getDefaultSites();
    this.getSelectProductOfferFormulaList();
  },
  mounted() {},
  watch: {
    // defaultFormula: {
    //   deep: true,
    //   handler(newVal) {
    //     if (newVal) {
    //       console.log(newVal);
    //       const obj = JSON.parse(newVal);
    //       this.clienFormData.profit = obj.profit;
    //       this.clienFormData.offerMethod = obj.offerMethod;
    //       this.clienFormData.currencyType = obj.cu_de;
    //       this.clienFormData.currencyTypeName = obj.cu_deName;
    //       this.clienFormData.exchange = obj.exchange;
    //       this.clienFormData.size = obj.size;
    //       // this.clienFormData.showNumber = obj.showNumber;
    //       this.clienFormData.decimalPlaces = obj.decimalPlaces;
    //       this.clienFormData.rejectionMethod = obj.rejectionMethod;
    //     }
    //   }
    // },
    // "clienFormData.profit": {
    //   deep: true,
    //   handler(newVal) {
    //     if (newVal == 100) {
    //       if (this.clienFormData.profitCalcMethod == 2) {
    //         this.clienFormData.profit = 10;
    //         this.$common.handlerMsgState({
    //           msg: "除法利润率不可为100",
    //           error: "danger"
    //         });
    //       }
    //     }
    //   }
    // },
    // "clienFormData.profitCalcMethod": {
    //   deep: true,
    //   handler(newVal) {
    //     if (newVal == 2) {
    //       if (this.clienFormData.profit == 100) {
    //         this.clienFormData.profit = 10;
    //         this.$common.handlerMsgState({
    //           msg: "除法利润率不可为100",
    //           error: "danger"
    //         });
    //       }
    //     }
    //   }
    // }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsMyCollection {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .title {
    height: 55px;
    line-height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
    &::before {
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
  }
  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
      .imgBox {
        text-align: left;
        display: flex;
        font-size: 14px;
        .productName {
          width: 190px;
          height: 60px;
          margin-left: 15px;
          .name,
          .factory {
            width: 190px;
            max-width: 190px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .factory {
            color: #3368a9;
          }
          .name {
            margin-top: 8px;
          }
        }
      }
      .loginCodeBox {
        position: relative;
        .copy {
          position: absolute;
          cursor: pointer;
          right: 0;
          top: 0;
          opacity: 0;
          i {
            &:first-of-type {
              margin: 0 5px;
            }
            &:hover {
              color: #5cb6ff;
            }
          }
        }
        &:hover {
          .copy {
            opacity: 1;
          }
        }
      }
    }
    .errorImg {
      img {
        width: 80px;
        height: 60px;
      }
    }
  }
}
@{deep} .el-form {
  .el-input,
  .el-select {
    width: 100%;
  }
  .formItemBox {
    display: flex;
    justify-content: space-between;
    .el-form-item {
      flex: 1;
    }
  }
  .chengchuTishi {
    color: #ff4848;
    box-sizing: border-box;
    padding-left: 120px;
    margin-bottom: 20px;
  }
  .lessThanPrice {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    border-top: 1px solid #dcdfe6;
    .left,
    .right {
      flex: 1;
      position: relative;
      .tishi {
        position: absolute;
        bottom: -5px;
        left: 120px;
        color: #ff4848;
      }
    }
  }
}

.siteDialog {
  @{deep}.el-dialog__body {
    padding: 0;
  }
}
</style>
