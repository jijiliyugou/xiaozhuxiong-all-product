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
      <bsTables :table="tableData" />
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
        class="myDialog"
        title="选择模板"
        v-if="exportDialog"
        :visible.sync="exportDialog"
        width="1200px"
      >
        <div class="exportBox">
          <div class="left">
            <li :class="{ item: true, active: tp == 1 }" @click="checkTp(1)">
              报出价(带工厂信息)
            </li>
            <li :class="{ item: true, active: tp == 2 }" @click="checkTp(2)">
              报出价(不带工厂信息)
            </li>
            <li :class="{ item: true, active: tp == 3 }" @click="checkTp(3)">
              出厂价(带工厂信息)
            </li>
            <li :class="{ item: true, active: tp == 4 }" @click="checkTp(4)">
              出厂价+报出价+工厂信息
            </li>
            <li :class="{ item: true, active: tp == 5 }" @click="checkTp(5)">
              宏升导入EXCEL模板
            </li>
            <li :class="{ item: true, active: tp == 6 }" @click="checkTp(6)">
              报出价不带厂商资料 (英文)
            </li>
          </div>
          <div class="right">
            <div class="tp1" v-show="tp === 1">
              <div class="orderTitle">报出价(带工厂信息)</div>
              <div class="imgBox">
                <el-image
                  fit="contain"
                  :z-index="5000"
                  :preview-src-list="[require('@/assets/images/mode1.png')]"
                  class="myImg"
                  :src="require('@/assets/images/mode1.png')"
                ></el-image>
              </div>
              <div class="selectTions">
                <div class="label">
                  是否按厂商单独导出图片：
                  <!-- <el-radio-group class="myExportWay" v-model="imageExportWay">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group> -->
                  <el-checkbox-group
                    class="myExportWay"
                    @change="changeCheckBox"
                    v-model="imageExportWay"
                  >
                    <el-checkbox :label="2">是</el-checkbox>
                    <el-checkbox :label="1">否</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="label">
                  是否带图：
                  <el-radio-group class="myExportWay" v-model="exportWay">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </div>
                <div class="label">
                  图片大小：
                  <el-select
                    size="medium"
                    style="width: 100px;"
                    v-model="imgSize"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, i) in imageSizeList"
                      :key="i"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="label">
                  <el-button
                    type="warning"
                    size="medium"
                    @click="exportOrder(1)"
                  >
                    <i class="iconfont icon-daochujinruchukou"></i>
                    确定导出
                  </el-button>
                </div>
              </div>
            </div>
            <div class="tp1" v-show="tp === 2">
              <div class="orderTitle">报出价(不带工厂信息)</div>
              <div class="imgBox">
                <el-image
                  fit="contain"
                  :z-index="5000"
                  :preview-src-list="[require('@/assets/images/mode2.png')]"
                  class="myImg"
                  :src="require('@/assets/images/mode2.png')"
                ></el-image>
              </div>
              <div class="selectTions">
                <div class="label">
                  是否按厂商单独导出图片：
                  <!-- <el-radio-group class="myExportWay" v-model="imageExportWay">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group> -->
                  <el-checkbox-group
                    class="myExportWay"
                    @change="changeCheckBox"
                    v-model="imageExportWay"
                  >
                    <el-checkbox :label="2">是</el-checkbox>
                    <el-checkbox :label="1">否</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="label">
                  是否带图：
                  <el-radio-group class="myExportWay" v-model="exportWay">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </div>
                <div class="label">
                  图片大小：
                  <el-select
                    size="medium"
                    style="width: 100px;"
                    v-model="imgSize"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, i) in imageSizeList"
                      :key="i"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="label">
                  <el-button
                    type="warning"
                    size="medium"
                    @click="exportOrder(2)"
                  >
                    <i class="iconfont icon-daochujinruchukou"></i>
                    确定导出
                  </el-button>
                </div>
              </div>
            </div>
            <div class="tp1" v-show="tp === 3">
              <div class="orderTitle">出厂价(带工厂信息))</div>
              <div class="imgBox">
                <el-image
                  fit="contain"
                  :z-index="5000"
                  :preview-src-list="[require('@/assets/images/mode3.png')]"
                  class="myImg"
                  :src="require('@/assets/images/mode3.png')"
                ></el-image>
              </div>
              <div class="selectTions">
                <div class="label">
                  是否按厂商单独导出图片：
                  <!-- <el-radio-group class="myExportWay" v-model="imageExportWay">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group> -->
                  <el-checkbox-group
                    class="myExportWay"
                    @change="changeCheckBox"
                    v-model="imageExportWay"
                  >
                    <el-checkbox :label="2">是</el-checkbox>
                    <el-checkbox :label="1">否</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="label">
                  是否带图：
                  <el-radio-group class="myExportWay" v-model="exportWay">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </div>
                <div class="label">
                  图片大小：
                  <el-select
                    size="medium"
                    style="width: 100px;"
                    v-model="imgSize"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, i) in imageSizeList"
                      :key="i"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="label">
                  <el-button
                    type="warning"
                    size="medium"
                    @click="exportOrder(3)"
                  >
                    <i class="iconfont icon-daochujinruchukou"></i>
                    确定导出
                  </el-button>
                </div>
              </div>
            </div>
            <div class="tp1" v-show="tp === 4">
              <div class="orderTitle">出厂价+报出价+工厂信息</div>
              <div class="imgBox">
                <el-image
                  fit="contain"
                  :z-index="5000"
                  :preview-src-list="[require('@/assets/images/mode4.png')]"
                  class="myImg"
                  :src="require('@/assets/images/mode4.png')"
                ></el-image>
              </div>
              <div class="selectTions">
                <div class="label">
                  是否按厂商单独导出图片：
                  <!-- <el-radio-group class="myExportWay" v-model="imageExportWay">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group> -->
                  <el-checkbox-group
                    class="myExportWay"
                    @change="changeCheckBox"
                    v-model="imageExportWay"
                  >
                    <el-checkbox :label="2">是</el-checkbox>
                    <el-checkbox :label="1">否</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="label">
                  是否带图：
                  <el-radio-group class="myExportWay" v-model="exportWay">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </div>
                <div class="label">
                  图片大小：
                  <el-select
                    size="medium"
                    style="width: 100px;"
                    v-model="imgSize"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, i) in imageSizeList"
                      :key="i"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="label">
                  <el-button
                    type="warning"
                    size="medium"
                    @click="exportOrder(4)"
                  >
                    <i class="iconfont icon-daochujinruchukou"></i>
                    确定导出
                  </el-button>
                </div>
              </div>
            </div>
            <div class="tp1" v-show="tp === 5">
              <div class="orderTitle">宏升导入EXCEL模板</div>
              <div class="imgBox">
                <el-image
                  fit="contain"
                  class="myImg"
                  :z-index="5000"
                  :preview-src-list="[require('@/assets/images/mode5.png')]"
                  :src="require('@/assets/images/mode5.png')"
                ></el-image>
              </div>
              <div class="selectTions">
                <div class="label">
                  是否按厂商单独导出图片：
                  <!-- <el-radio-group class="myExportWay" v-model="imageExportWay">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group> -->
                  <el-checkbox-group
                    class="myExportWay"
                    @change="changeCheckBox"
                    v-model="imageExportWay"
                  >
                    <el-checkbox :label="2">是</el-checkbox>
                    <el-checkbox :label="1">否</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="label">
                  <el-button
                    type="warning"
                    size="medium"
                    @click="exportOrder(5)"
                  >
                    <i class="iconfont icon-daochujinruchukou"></i>
                    确定导出
                  </el-button>
                </div>
              </div>
            </div>
            <div class="tp1" v-show="tp === 6">
              <div class="orderTitle">报出价不带厂商资料 (英文)</div>
              <div class="imgBox">
                <el-image
                  fit="contain"
                  class="myImg"
                  :src="require('@/assets/images/mode6.png')"
                  :z-index="5000"
                  :preview-src-list="[require('@/assets/images/mode6.png')]"
                ></el-image>
              </div>
              <div class="selectTions">
                <div class="label">
                  是否按厂商单独导出图片：
                  <el-checkbox-group
                    class="myExportWay"
                    @change="changeCheckBox"
                    v-model="imageExportWay"
                  >
                    <el-checkbox :label="2">是</el-checkbox>
                    <el-checkbox :label="1">否</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="label">
                  是否带图：
                  <el-radio-group class="myExportWay" v-model="exportWay">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </div>
                <div class="label">
                  图片大小：
                  <el-select
                    size="medium"
                    style="width: 100px;"
                    v-model="imgSize"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, i) in imageSizeList"
                      :key="i"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="label">
                  <el-button
                    type="warning"
                    size="medium"
                    @click="exportOrder(6)"
                  >
                    <i class="iconfont icon-daochujinruchukou"></i>
                    确定导出
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </transition>
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        class="myDialog"
        title="客户订单"
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        width="1200px"
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
import bsTables from "@/components/table";
export default {
  name: "bsCustomerOrder",
  components: { bsExportOrder, bsTables },
  data() {
    return {
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: this.size,
        isIndex: true,
        columns: [
          {
            prop: "orderNumber",
            minWidth: 100,
            isHiden: true,
            label: "订单编号",
            event: row => {
              this.toOrderDetails(row);
            },
            isCallback: row => {
              return (
                "<div style='color: #3368a9; cursor: pointer;'><i style='margin-right: 5px;' class='el-icon-tickets'></i><span>" +
                row.orderNumber +
                "</span></div>"
              );
            }
          },
          {
            prop: "siteRegion",
            isHiden: true,
            label: "站点"
          },
          {
            prop: "customerName",
            isHiden: true,
            label: "客户"
          },
          {
            prop: "createdBy",
            isHiden: true,
            label: "业务员"
          },
          {
            prop: "totalKuanshu",
            isHiden: true,
            label: "产品总款数"
          },
          {
            prop: "totalAmount",
            isHiden: true,
            label: "总价",
            color: "#eb1515",
            render: row => {
              return (
                "<spam style='margin-right:5px;'>" +
                row.currencyType +
                "</spam>" +
                row.totalAmount
              );
            }
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "下单时间",
            render: row => {
              return row.createdOn ? row.createdOn.replace(/T.*/, "") : "";
            }
          }
        ],
        btnWidth: 100,
        actions: [
          {
            type: "warning",
            textWrapper() {
              return "导出";
            },
            methods: row => {
              this.openSelectTemplate(row);
            }
          }
        ]
      },
      websiteInfoId: null,
      userId: null,
      staffList: [],
      tp: 1,
      imgSize: "200*150",
      imageSizeList: ["200*150", "400*300", "640*480"],
      imageExportWay: [],
      exportWay: 1,
      exportTemplateDialog: false,
      exportDialog: false,
      currentOrder: {},
      keyword: null,
      dateTime: null,
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
        imageExportWay: this.imageExportWay.length ? this.imageExportWay[0] : 0,
        imageWidth: this.imgSize.split("*")[0],
        imageHeight: this.imgSize.split("*")[1],
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
          const fileName = this.imageExportWay.length > 0 ? zipName : exeName;

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
    // 修改了压缩包
    changeCheckBox(list) {
      if (list.length > 1) {
        this.imageExportWay.splice(0, 1);
      }
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
    // 查看模板
    checkTp(t) {
      this.tp = t;
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
        this.tableData.data = res.data.result.item.items;
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
@{deep} .myDialog {
  .el-dialog__body {
    padding: 0;
  }
  .exportBox {
    display: flex;
    .left {
      width: 230px;
      min-width: 230px;
      border-right: 1px solid #e5e5e5;
      font-size: 15px;
      .item {
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        cursor: pointer;
        position: relative;
        &.active {
          background-color: #eff6ff;
          &::after {
            position: absolute;
            content: "";
            left: 0;
            top: 0;
            width: 3px;
            background-color: #3368a9;
            height: 50px;
          }
        }
      }
    }
    .right {
      flex: 1;
      .orderTitle {
        font-size: 20px;
        font-weight: 700;
        margin-top: 90px;
        text-align: center;
      }
      .imgBox {
        margin-top: 25px;
        padding: 0 45px;
        height: 136px;
        box-sizing: border-box;
      }
      .selectTions {
        margin-top: 87px;
        height: 66px;
        border-top: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 20px;
        .label {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
