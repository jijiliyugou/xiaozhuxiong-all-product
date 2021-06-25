<template>
  <div class="bsSightseerManage">
    <!-- 头部 -->
    <div class="top_title">
      <div class="titleLeft">
        <span>游客管理 ({{ totalCount }})</span>
      </div>
      <div class="right"></div>
    </div>
    <!-- 搜索 -->
    <div class="searchWarp">
      <div class="searchBox">
        <div class="search_item">
          关键词：<el-input
            v-model="searchForm.keyword"
            style="width:200px;"
            @keyup.native.enter="search"
            clearable
            size="medium"
            placeholder="请选择"
          >
          </el-input>
        </div>
        <div class="search_item">
          审核状态：<el-select
            v-model="searchForm.auditState"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in [
                {
                  itemText: '全部',
                  itemCode: null
                },
                {
                  itemText: '未审核',
                  itemCode: 0
                },
                {
                  itemText: '审核通过',
                  itemCode: 1
                },
                {
                  itemText: '拒绝',
                  itemCode: 2
                }
              ]"
              :key="index"
              :label="item.itemText"
              :value="item.itemCode"
            ></el-option>
          </el-select>
        </div>
        <div class="search_date">
          时间段：
          <el-date-picker
            style="width:235px;"
            size="medium"
            v-model="searchForm.date"
            value-format="yyyy-MM-ddTHH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
        </div>
        <div>
          <el-button
            @click="search"
            size="medium"
            icon="el-icon-search"
            type="primary"
          >
            搜索
          </el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="tableBox">
      <myTable :table="tableData" />
      <!-- 分页 -->
      <center style="padding:20px 0;">
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
    <!-- 新增编辑版本 -->
    <el-dialog
      title="审核"
      :visible.sync="shenheDialog"
      v-if="shenheDialog"
      width="800px"
      top="70px"
    >
      <editVersion
        :clientTypeList="clientTypeList"
        :currentRow="currentRow"
        @sub="sub"
      />
    </el-dialog>
  </div>
</template>

<script>
import myTable from "@/components/table.vue";
import editVersion from "./components/editVersion.vue";
import { getClientTypeList } from "@/assets/js/common/common.js";
export default {
  name: "",
  components: {
    myTable,
    editVersion
  },
  data() {
    return {
      currentRow: null,
      tableData: {
        data: [],
        isIndex: true,
        columns: [
          {
            prop: "companyName",
            isHiden: true,
            label: "公司名称"
          },
          {
            isHiden: true,
            label: "公司类型",
            render: row => {
              const current = this.clientTypeList.find(
                v => v.itemCode === row.companyType
              );
              return current && current.itemText;
            }
          },
          {
            prop: "contactsMan",
            isHiden: true,
            label: "联系人"
          },
          {
            prop: "phoneNumber",
            isHiden: true,
            label: "联系方式"
          },
          {
            prop: "address",
            isHiden: true,
            label: "公司地址"
          },
          {
            isHiden: true,
            elImageUrl: true,
            label: "营业执照",
            style: { width: "50px", height: "50px" },
            elImage: row => {
              return row.businessLicense;
            }
          },
          {
            prop: "reportRemark",
            isHiden: true,
            label: "审核状态",
            render: row => {
              return row.auditState === 1
                ? "<span style='color: #33A96A'>审核通过</span>"
                : row.auditState === 2
                ? "<span style='color: #FF4848'>审核不通过</span>"
                : "<span style='color: #3368A9'>未审核</span>";
            }
          },
          {
            prop: "remark",
            isHiden: true,
            label: "拒绝原因"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "创建日期",
            render: row => {
              return row.createdOn && row.createdOn.replace(/T/, " ");
            }
          }
        ],
        actions: [
          {
            type: "warning ",
            textWrapper() {
              return "审核";
            },
            methods: row => {
              this.currentRow = row;
              this.shenheDialog = true;
            }
          }
        ]
      },
      clientTypeList: [],
      shenheDialog: false,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      searchForm: {
        date: null,
        auditState: null,
        keyword: null
      }
    };
  },
  created() {
    this.getCompanyTypeList("CompanyType");
  },
  mounted() {
    this.getCompanyAuditPage();
  },
  methods: {
    // 获取公司类型列表
    async getCompanyTypeList(type) {
      this.clientTypeList = await getClientTypeList(type, this);
    },
    // 删除审核
    deleteShenhe(row) {
      this.$confirm("确定删除举报吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          try {
            row.isDelete = true;
            const res = await this.$http.post("/api/UpdateMessageReport", row);
            if (res.data.result.code === 200) {
              this.$common.handlerMsgState({
                msg: "删除成功",
                type: "success"
              });
              this.getCompanyAuditPage();
            } else {
              this.$common.handlerMsgState({
                msg: res.data.result.msg,
                type: "danger"
              });
            }
          } catch (err) {
            this.$common.handlerMsgState({
              msg: err,
              type: "danger"
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 提交新增或编辑
    sub() {
      this.shenheDialog = false;
      this.getCompanyAuditPage();
    },
    // 获取所有公司
    async getCompanyAuditPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        auditState: this.searchForm.auditState,
        keyword: this.searchForm.keyword,
        startTime: this.searchForm.date && this.searchForm.date[0],
        endTime: this.searchForm.date && this.searchForm.date[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/GetCompanyAuditPage", fd);
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      }
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getCompanyAuditPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getCompanyAuditPage();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getCompanyAuditPage();
    }
  }
};
</script>
<style scoped lang="less">
.bsSightseerManage {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
  .top_title {
    height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
    .titleLeft {
      flex: 1;
    }
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
  .searchWarp {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .searchBox {
      display: flex;
      .search_item {
        width: 275px;
        margin-right: 20px;
        .el-select {
          width: 200px;
          white-space: nowrap; /*不换行*/
        }
      }
      .search_date {
        width: 305px;
        margin-right: 20px;
      }
    }
  }
  .tableBox {
    margin-top: 20px;
  }
}
</style>
