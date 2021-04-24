<template>
  <div class="bsMyCollection">
    <div class="title">客户订单 ({{ totalCount }})</div>
    <div class="searchBox">
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
          size="medium"
          filterable
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
    <div class="tableBox">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f9fafc' }"
      >
        <el-table-column label="序号" type="index" align="center" width="70">
        </el-table-column>
        <el-table-column prop="orderNumber" label="订单编号" width="220">
          <template slot-scope="scope">
            <div class="orderNumberBox" @click="toOrderDetails(scope.row)">
              <i class="el-icon-tickets"></i>
              <span style="margin-left: 15px">
                {{ scope.row.orderNumber }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="siteRegion"
          label="站点"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="customerName"
          label="客户"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createdBy"
          label="业务员"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="totalKuanshu"
          label="商品总款数"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="totalAmount"
          label="总价"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span style="color: #ff0b00">
              {{ scope.row.totalAmount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdOn"
          label="下单时间"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.createdOn.replace(/T/, " ") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              style="margin-right: 10px"
              size="mini"
              type="warning"
              @click="openSelectTemplate(scope.row)"
              >导出</el-button
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
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        title="选择模板"
        v-if="exportDialog"
        :visible.sync="exportDialog"
        top="60px"
        width="80%"
      >
        <el-card class="box-card">
          <div
            slot="header"
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <span class="headerTitle">报出价(带工厂信息)</span>
            <div>
              <div class="isFac">
                <span class="facTitle">是否按厂商导出</span>
                <el-select
                  v-model="imageExportWay"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in imageExportWayList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <el-radio-group class="myExportWay" v-model="exportWay">
                <el-radio :label="1">带图片导出</el-radio>
                <el-radio :label="2">不带图片导出</el-radio>
              </el-radio-group>
              <el-button
                type="primary"
                class="btnMargin"
                @click="openViewer(require('@/assets/images/mode1.png'))"
                >预览</el-button
              >
              <el-button type="success" @click="exportOrder(1)">导出</el-button>
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
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <span class="headerTitle">报出价(不带工厂信息)</span>
            <div>
              <div class="isFac">
                <span class="facTitle">是否按厂商导出</span>
                <el-select
                  v-model="imageExportWay"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in imageExportWayList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <el-radio-group class="myExportWay" v-model="exportWay">
                <el-radio :label="1">带图片导出</el-radio>
                <el-radio :label="2">不带图片导出</el-radio>
              </el-radio-group>
              <el-button
                type="primary"
                class="btnMargin"
                @click="openViewer(require('@/assets/images/mode2.png'))"
                >预览</el-button
              >
              <el-button type="success" @click="exportOrder(2)">导出</el-button>
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
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <span class="headerTitle">出厂价(带工厂信息)</span>
            <div>
              <div class="isFac">
                <span class="facTitle">是否按厂商导出</span>
                <el-select
                  v-model="imageExportWay"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in imageExportWayList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <el-radio-group class="myExportWay" v-model="exportWay">
                <el-radio :label="1">带图片导出</el-radio>
                <el-radio :label="2">不带图片导出</el-radio>
              </el-radio-group>
              <el-button
                type="primary"
                class="btnMargin"
                @click="openViewer(require('@/assets/images/mode3.png'))"
                >预览</el-button
              >
              <el-button type="success" @click="exportOrder(3)">导出</el-button>
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
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <span class="headerTitle">出厂价+报出价+工厂信息</span>
            <div>
              <div class="isFac">
                <span class="facTitle">是否按厂商导出</span>
                <el-select
                  v-model="imageExportWay"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in imageExportWayList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <el-radio-group class="myExportWay" v-model="exportWay">
                <el-radio :label="1">带图片导出</el-radio>
                <el-radio :label="2">不带图片导出</el-radio>
              </el-radio-group>
              <el-button
                type="primary"
                class="btnMargin"
                @click="openViewer(require('@/assets/images/mode4.png'))"
                >预览</el-button
              >
              <el-button type="success" @click="exportOrder(4)">导出</el-button>
            </div>
          </div>
          <div class="modeImgBox">
            <el-image
              fit="contain"
              class="myImg"
              :src="require('@/assets/images/mode4.png')"
            ></el-image>
          </div>
        </el-card>
      </el-dialog>
    </transition>
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        title="客户订单"
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        top="60px"
        width="80%"
      >
        <bsExportOrder
          :orderNumber="currentOrder.orderNumber"
          :customerName="currentOrder.customerName"
          api="/api/ExportCustomerOrderDetailToExcel"
        />
      </el-dialog>
    </transition>
  </div>
</template>
<script>
import bsExportOrder from "@/components/bsComponents/bsSiteSharingComponent/bsExportOrder";
import { getCurrentTime } from "@/assets/js/common/common.js";
import { mapState } from "vuex";
export default {
  name: "bsCustomerOrder",
  components: { bsExportOrder },
  data() {
    return {
      websiteInfoId: null,
      userId: null,
      staffList: [],
      imageExportWayList: [
        { value: 0, label: "请选择" },
        { value: 2, label: "按厂商单独导图片" },
        { value: 1, label: "不按厂商单独导图片" }
      ],
      imageExportWay: 0,
      exportWay: 1,
      exportTemplateDialog: false,
      exportDialog: false,
      currentOrder: {},
      keyword: null,
      dateTime: null,
      tableData: [],
      sitesList: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  methods: {
    // 导出模板
    exportOrder(type) {
      this.$store.commit("handlerIsJindu", true);
      const fd = {
        excelExportWay: this.exportWay,
        imageExportWay: this.imageExportWay ? this.imageExportWay : 0,
        templateType: type,
        shareOrderNumber: this.currentOrder.orderNumber
      };
      this.$http
        .post("/api/ExportCustomerOrderDetailToExcel", fd, {
          responseType: "blob",
          timeout: 100000000
        })
        .then(res => {
          const time = getCurrentTime();
          // this.currentOrder.customerName + "_" + time + ".xlsx";
          const exeName = this.currentOrder.customerName
            ? this.currentOrder.customerName + "_" + time + ".xlsx"
            : time + ".xlsx";
          const zipName = this.currentOrder.customerName
            ? this.currentOrder.customerName + "_" + time + ".zip"
            : time + ".zip";
          const fileName = this.imageExportWay > 0 ? zipName : exeName;

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
          this.$store.commit("handlerIsJindu", false);
        })
        .catch(() => {
          this.$store.commit("handlerIsJindu", false);
        });
    },
    // 预览导出模板
    openViewer(url) {
      this.$PreviewPic({
        zIndex: 9999, // 组件的zIndex值 默认为2000
        index: 0, // 展示第几张图片 默认为0
        list: [url], // 需要展示图片list
        onClose: i => {
          // 关闭时的回调
          console.log(i);
        },
        onSelect: i => {
          // 点击某张图片的回调
          console.log(i);
        }
      });
    },
    // 获取公司下的员工列表
    async getStaffList() {
      const res = await this.$http.post("/api/CompanyUserList", {
        orgCompanyID: this.$store.state.userInfo.commparnyList[0].commparnyId
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
    async getSearchCompanyShareOrdersPage() {
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
      const res = await this.$http.post(
        "/api/SearchCompanyShareOrdersPage",
        fd
      );
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      }
    },
    // 获取站点列表
    async getDefaultSites() {
      const res = await this.$http.post("/api/SearchDropdownWebsiteInfos", {});
      console.log(res);
      if (res.data.result.code === 200) {
        this.sitesList = [{ name: "全部", id: null }, ...res.data.result.item];
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 查看订单详情
    async toOrderDetails(row) {
      const fd = {
        name: row.orderNumber,
        linkUrl: "/bsIndex/bsCustomerOrder",
        component: "bsClientOrderDetails",
        refresh: true,
        noPush: true,
        label: row.orderNumber,
        value: row
      };
      this.$store.commit("myAddTab", fd);
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getSearchCompanyShareOrdersPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getSearchCompanyShareOrdersPage();
    },
    // 打开选择导出模板
    openSelectTemplate(row) {
      this.currentOrder = row;
      this.exportDialog = true;
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getSearchCompanyShareOrdersPage();
    }
  },
  created() {
    this.getDefaultSites();
    this.getStaffList();
  },
  mounted() {
    this.getSearchCompanyShareOrdersPage();
  },
  computed: {
    ...mapState(["userInfo"])
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
    .item {
      display: flex;
      align-items: center;
      max-width: 290px;
      margin-right: 20px;
      .label {
        width: 58px;
        min-width: 58px;
      }
    }
  }
  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
      .orderNumberBox {
        color: #3368a9;
        cursor: pointer;
      }
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
    }
    .errorImg {
      img {
        width: 80px;
        height: 60px;
      }
    }
  }
}
.isFac {
  display: inline;
  margin: 20px;
  .facTitle {
    margin-right: 10px;
  }
}
.btnMargin {
  margin-left: 20px;
}
</style>
