<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
      <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
        <!-- 搜索 -->
        <div class="searchBox">
          <div class="inputList">
            <el-input
              @keyup.enter.native="search"
              clearable
              v-model="searchForm.keyword"
              placeholder="输入关键字"
              style="width: 200px;"
            ></el-input>
          </div>
          <div class="btnList">
            <el-button type="primary" @click="search">查询</el-button>
          </div>
        </div>
        <!-- 列表 -->
        <div class="tableBox">
          <el-table
            size="mini"
            :data="dataList"
            style="width: 100%"
            :default-sort="{ prop: 'date', order: 'descending' }"
          >
            <el-table-column
              prop="sampleNumber"
              label="单号"
              align="center"
            ></el-table-column>
            <el-table-column prop="applicant" label="操作员" align="center">
            </el-table-column>
            <el-table-column
              prop="companyName"
              label="公司名称"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="createdOn"
              label="找样时间"
              sortable
              align="center"
            >
              <template slot-scope="scope">
                {{
                  scope.row.createdOn && scope.row.createdOn.replace(/T/g, " ")
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              align="center"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="openDetail(scope.row)"
                  >查看明细</el-button
                >
                <el-button
                  @click="openExport(scope.row)"
                  size="mini"
                  slot="reference"
                  type="primary"
                  >导出找样</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <center style="margin-top:20px;">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              background
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageSize"
              :total="totalCount"
              :current-page.sync="currentPage"
              @current-change="currentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </center>
        </div>
      </div>
      <!-- 导出订单模板dialog -->
      <transition name="el-zoom-in-center">
        <el-dialog
          title="订单模板"
          v-show="exportTemplateDialog"
          :visible.sync="exportTemplateDialog"
          top="60px"
          width="80%"
        >
          <!-- <div class="box" style="height:500px;"> -->
          <el-card class="box-card">
            <div
              slot="header"
              style="display:flex; align-items:center; justify-content:space-between"
            >
              <span class="headerTitle">报出价(带工厂信息)</span>
              <div>
                <el-button
                  type="primary"
                  @click="openViewer(require('@/assets/images/mode1.png'))"
                  >预览</el-button
                >
                <el-button type="success" @click="exportOrder(1)"
                  >导出</el-button
                >
              </div>
            </div>
            <div class="modeImgBox">
              <el-image
                fit="contain"
                class="myImg"
                :src="require('@/assets/images/mode1.png')"
              ></el-image>
            </div>
          </el-card>
          <el-card class="box-card">
            <div
              slot="header"
              style="display:flex; align-items:center; justify-content:space-between"
            >
              <span class="headerTitle">报出价(不带工厂信息)</span>
              <div>
                <el-button
                  type="primary"
                  @click="openViewer(require('@/assets/images/mode2.png'))"
                  >预览</el-button
                >
                <el-button type="success" @click="exportOrder(2)"
                  >导出</el-button
                >
              </div>
            </div>
            <div class="modeImgBox">
              <el-image
                fit="contain"
                class="myImg"
                :src="require('@/assets/images/mode2.png')"
              ></el-image>
            </div>
          </el-card>
          <el-card class="box-card">
            <div
              slot="header"
              style="display:flex; align-items:center; justify-content:space-between"
            >
              <span class="headerTitle">出厂价(带工厂信息)</span>
              <div>
                <el-button
                  type="primary"
                  @click="openViewer(require('@/assets/images/mode3.png'))"
                  >预览</el-button
                >
                <el-button type="success" @click="exportOrder(3)"
                  >导出</el-button
                >
              </div>
            </div>
            <div class="modeImgBox">
              <el-image
                fit="contain"
                class="myImg"
                :src="require('@/assets/images/mode3.png')"
              ></el-image>
            </div>
          </el-card>
          <el-card class="box-card">
            <div
              slot="header"
              style="display:flex; align-items:center; justify-content:space-between"
            >
              <span class="headerTitle">出厂价+报出价+工厂信息</span>
              <div>
                <el-button
                  type="primary"
                  @click="openViewer(require('@/assets/images/mode4.png'))"
                  >预览</el-button
                >
                <el-button type="success" @click="exportOrder(4)"
                  >导出</el-button
                >
              </div>
            </div>
            <div class="modeImgBox">
              <el-image
                fit="contain"
                class="myImg"
                :src="require('@/assets/images/mode4.png')"
              ></el-image>
            </div>
            <!-- 模板预览 -->
            <el-image-viewer
              style="z-index:9999"
              v-if="showViewer"
              :on-close="closeViewer"
              :url-list="viewerImgList"
            />
          </el-card>
        </el-dialog>
      </transition>
      <!-- 订单详情dialog -->
      <transition name="el-zoom-in-bottom">
        <el-dialog
          title="订单明细"
          :visible.sync="isOrderDetailDialog"
          append-to-body
          v-if="isOrderDetailDialog"
          top="60px"
          width="80%"
        >
          <companySampleDetailComponent :item="sampleNumber" />
        </el-dialog>
      </transition>
    </el-main>
    <el-footer style="padding:0;" height="162px">
      <bsFooter></bsFooter>
    </el-footer>
  </el-container>
</template>

<script>
import bsTop from "@/components/BsTop";
import bsFooter from "@/components/oldFooter";
import { mapState } from "vuex";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import { getCurrentTime } from "@/assets/js/common.js";
import companySampleDetailComponent from "@/components/companySampleDetailComponent/companySampleDetailComponent.vue";
export default {
  components: { bsTop, bsFooter, ElImageViewer, companySampleDetailComponent },
  data() {
    return {
      isOrderDetailDialog: false,
      sampleNumber: null,
      showViewer: false,
      viewerImgList: [],
      exportTemplateDialog: false,
      dataList: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      searchForm: {
        keyword: ""
      }
    };
  },
  methods: {
    // 点击关闭预览模板
    closeViewer() {
      this.showViewer = false;
    },
    // 打开预览模板
    openViewer(url) {
      console.log(url);
      this.viewerImgList = [url];
      this.showViewer = true;
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getCompanySamplelistPage();
    },
    // 获取找样清单
    async getCompanySamplelistPage() {
      const fd = {
        companyNumber: this.userInfo.commparnyList[0].companyNumber,
        userId: this.userInfo.userInfo.id,
        startTime: null,
        endTime: null,
        keyWord: this.searchForm.keyword,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "")
          delete fd[key];
      }
      const res = await this.$http.post("/api/companySamplelistPage", fd);
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        this.dataList = item.items;
        this.totalCount = item.totalCount;
      } else {
        this.$message.error(msg);
      }
    },
    // 切换当前页
    currentChange(page) {
      this.currentPage = page;
      this.getCompanySamplelistPage();
    },
    // 切换当前页条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (this.currentPage * pageSize > this.totalCount) return false;
      this.getCompanySamplelistPage();
    },
    // 导出
    exportOrder(type) {
      this.$http
        .post(
          "/api/ExportCompanySampleListToExcel",
          {
            templateType: type,
            sampleNumber: this.sampleNumber.sampleNumber
          },
          { responseType: "blob" }
        )
        .then(res => {
          const fileName = this.sampleNumber.companyName
            ? this.sampleNumber.companyName + "_" + getCurrentTime() + ".xlsx"
            : getCurrentTime() + ".xlsx";
          const blob = res.data;
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容IE
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            // 兼容Google及fireFox
            const link = document.createElement("a");
            link.style.display = "none";
            link.download = fileName;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link.href); // 释放URL 对象
            document.body.removeChild(link);
          }
        });
    },
    // 打开导出找样清单
    openExport(item) {
      this.sampleNumber = item;
      this.exportTemplateDialog = true;
    },
    // 查看找样明细
    openDetail(item) {
      this.sampleNumber = item;
      this.isOrderDetailDialog = true;
    }
  },
  watch: {},
  computed: {
    ...mapState(["userInfo"])
  },
  mounted() {
    this.getCompanySamplelistPage();
  },
  created() {}
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.searchBox {
  padding-top: 50px;
  display: flex;
  justify-content: space-between;
  .inputList {
    flex: 1;
  }
}
@{deep} .el-image-viewer__wrapper {
  .el-image-viewer__mask {
    opacity: 0.1;
  }
}
</style>
