<template>
  <div class="bsMyCollection">
    <div class="title">展厅业务 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="item">
        <span class="label">关键字：</span>
        <el-input
          v-focus
          type="text"
          size="medium"
          v-model="searchForm.keyword"
          clearable
          placeholder="请输入关键词"
          @keyup.native.enter="search"
        ></el-input>
      </div>
      <div class="item">
        <span class="label">择样类型：</span>
        <div class="content">
          <el-select
            v-model="searchForm.messageExt"
            size="medium"
            placeholder="请选择"
          >
            <el-option
              v-for="item in typesList"
              :key="item.id"
              :label="item.title"
              :value="item.messageExt"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="item">
        <span class="label">展厅名称：</span>
        <el-input
          type="text"
          size="medium"
          clearable
          v-model="searchForm.fromCompanyName"
          placeholder="请输入关键词"
          @keyup.native.enter="search"
        ></el-input>
      </div>
      <div class="item">
        <span class="label">状态：</span>
        <el-select
          size="medium"
          v-model="searchForm.readStatus"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, i) in readStatusList"
            :key="i"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="item" v-if="userInfo.userInfo.isMain">
        <span class="label">业务员：</span>
        <el-select
          v-model="searchForm.staffId"
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
      <div class="item date">
        <span class="label">时间段：</span>
        <el-date-picker
          size="medium"
          value-format="yyyy-MM-ddTHH:mm:ss"
          v-model="searchForm.dateTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
        title="订单模板"
        class="exportOrder"
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        width="1200px"
      >
        <bsExportOrder
          :options="{
            orderNumber: orderRow.orderNumber,
            the_nu: orderRow.the_nu,
            name: orderRow.fromCompanyName,
            api: '/api/GetSampleOrderExcel'
          }"
        />
      </el-dialog>
    </transition>
  </div>
</template>

<script>
import bsExportOrder from "@/components/commonComponent/exportOrderComponent/zhantingyewu.vue";
import { mapState } from "vuex";
import bsTables from "@/components/table";
export default {
  name: "bsHallBusiness",
  components: {
    bsExportOrder,
    bsTables
  },
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
            label: "择样单号",
            event: row => {
              const fd = {
                name: row.orderNumber,
                linkUrl: "/bsIndex/bsHallBusiness",
                component: "bsHallBusinessOrderDetails",
                refresh: true,
                label: row.orderNumber,
                value: row
              };
              this.$store.commit("myAddTab", fd);
            },
            isCallback: row => {
              return (
                "<span style='color: #3368a9; cursor: pointer;'>" +
                row.orderNumber +
                "</span>"
              );
            }
          },
          {
            prop: "messageExt",
            isHiden: true,
            label: "择样类型",
            render: row => {
              let msg;
              switch (row.messageExt) {
                case "0":
                  msg = "系统通知";
                  break;
                case "3":
                  msg = "补样";
                  break;
                case "5":
                  msg = "借样";
                  break;
                case "11":
                  msg = "补样借样";
                  break;
                case "12":
                  msg = "洽谈";
                  break;
              }
              return msg;
            }
          },
          {
            prop: "the_nu",
            isHiden: true,
            label: "本次代号"
          },
          {
            prop: "happenDate",
            isHiden: true,
            label: "择样日期",
            render: row => {
              return row.happenDate ? row.happenDate.replace(/T.*/, "") : "";
            }
          },
          {
            prop: "hall_na",
            isHiden: true,
            label: "展厅名称"
          },
          {
            prop: "orgPersonnelName",
            isHiden: true,
            label: "业务员"
          },
          {
            prop: "pushContent",
            isHiden: true,
            label: "备注"
          },
          {
            prop: "orderStatus",
            isHiden: true,
            label: "状态",
            render: row => {
              if (
                row.toCompanyNumer !=
                  this.userInfo.commparnyList[0].companyNumber &&
                row.orderStatus == 0
              ) {
                return "<span style='color: #FF4848; '>对方未读</span>";
              } else if (
                row.toCompanyNumer ==
                  this.userInfo.commparnyList[0].companyNumber &&
                row.orderStatus == 0
              ) {
                return "--";
              } else if (
                row.toCompanyNumer !=
                  this.userInfo.commparnyList[0].companyNumber &&
                row.orderStatus == 1
              ) {
                return "<span style='color: #3368A9; '>对方已读</span>";
              } else if (
                row.toCompanyNumer ==
                  this.userInfo.commparnyList[0].companyNumber &&
                row.orderStatus == 1
              ) {
                return "--";
              } else if (row.orderStatus == 9) {
                return "<span style='color: #33A96A; '>已完成</span>";
              } else if (row.orderStatus == 99) {
                return "<span style='color: #999999; '>已取消</span>";
              }
            }
          }
        ],
        btnWidth: 150,
        actions: [
          {
            type: "info",
            textWrapper() {
              return "推送";
            },
            methods: row => {
              row.label = "展厅业务推送";
              const fd = {
                name: row.offerNumber + "展厅业务推送",
                linkUrl: "/bsIndex/bsSampleQuotation",
                component: "bsPushIndex",
                refresh: true,
                noPush: true,
                label: "展厅业务推送",
                value: row
              };
              this.$store.commit("myAddTab", fd);
            }
          },
          {
            type: "warning",
            textWrapper() {
              return "导出";
            },
            methods: row => {
              this.exportOrder(row);
            }
          }
        ]
      },
      staffList: [],
      exportTemplateDialog: false,
      orderRow: {},
      typesList: [],
      readStatusList: [
        {
          label: "全部",
          value: "-1"
        },
        {
          label: "未读",
          value: 0
        },
        {
          label: "已读",
          value: 1
        }
      ],
      searchForm: {
        keyword: null,
        fromCompanyName: null,
        staffId: null,
        messageModel: null,
        messageExt: -1,
        readStatus: "-1",
        dateTime: null
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  methods: {
    // 择样类型
    async getTypeList() {
      const res = await this.$http.post(
        "/api/PushSettings/MessageTeplateSettingsByPage",
        { maxResultCount: 9999, messageModel: "1", skipCount: 1 }
      );
      console.log(res);
      if (res.data.result.code === 200) {
        this.typesList = res.data.result.item.items;
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
      await this.getTableDataList();
      await this.getTypeList();
    },
    // 导出
    exportOrder(row) {
      this.orderRow = row;
      this.exportTemplateDialog = true;
    },
    // 去订单详情
    toDetails(row) {
      const fd = {
        name: row.orderNumber,
        linkUrl: "/bsIndex/bsHallBusiness",
        component: "bsHallBusinessOrderDetails",
        refresh: true,
        label: row.orderNumber,
        value: row
      };
      this.$store.commit("myAddTab", fd);
    },
    // 获取列表
    async getTableDataList() {
      const fd = {
        sampleTo: "Sales",
        messageModel: "1",
        readStatus: this.searchForm.readStatus,
        sampleFrom: "Hall",
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyWord: this.searchForm.keyword,
        staffId: this.searchForm.staffId,
        fromCompanyName: this.searchForm.fromCompanyName,
        messageExt: this.searchForm.messageExt,
        startTime: this.searchForm.dateTime && this.searchForm.dateTime[0],
        endTime: this.searchForm.dateTime && this.searchForm.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/GetERPOrderListByPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData.data = res.data.result.item.items;
      }
    },
    // 删除
    handleDelete(row) {
      console.log(row);
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getTableDataList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getTableDataList();
    }
  },
  created() {
    this.getStaffList();
  },
  filters: {
    switchMessageExt(val) {
      let msg;
      switch (val) {
        case "0":
          msg = "系统通知";
          break;
        case "3":
          msg = "补样";
          break;
        case "5":
          msg = "借样";
          break;
        case "11":
          msg = "补样借样";
          break;
        case "12":
          msg = "洽谈";
          break;
      }
      return msg;
    }
  },
  mounted() {},
  computed: {
    ...mapState(["currentComparnyId", "userInfo"])
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
      max-width: 200px;
      margin-right: 20px;
      &.date {
        min-width: 300px;
      }
      .label {
        width: 70px;
        min-width: 70px;
      }
    }
  }
  // @{deep} .tableBox {
  // .el-table {
  //   font-size: 13px;
  //   .imgBox {
  //     text-align: left;
  //     display: flex;
  //     font-size: 14px;
  //     .productName {
  //       width: 190px;
  //       height: 60px;
  //       margin-left: 15px;
  //       .name,
  //       .factory {
  //         width: 190px;
  //         max-width: 190px;
  //         overflow: hidden; /*超出部分隐藏*/
  //         white-space: nowrap; /*不换行*/
  //         text-overflow: ellipsis; /*超出部分文字以...显示*/
  //       }
  //       .factory {
  //         color: #3368a9;
  //       }
  //       .name {
  //         margin-top: 8px;
  //       }
  //     }
  //   }
  // }
  // .errorImg {
  //   img {
  //     width: 80px;
  //     height: 60px;
  //   }
  // }
  // }
}
@{deep} .exportOrder {
  .el-dialog__body {
    padding: 0;
  }
}
</style>
