<template>
  <div class="bsCompanyManage">
    <div class="title">公司列表 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="item">
        <span class="label">关键词：</span>
        <el-input
          v-focus
          type="text"
          size="medium"
          clearable
          v-model="searchForm.CompanyName"
          placeholder="请输入关键词"
          @keyup.native.enter="search"
        ></el-input>
      </div>
      <div class="item">
        <span class="label">公司类型：</span>
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
      <div class="item">
        <span class="label">审核状态：</span>
        <el-select
          v-model="searchForm.Audit_state"
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
        <span class="label">内部审核：</span>
        <el-select
          v-model="searchForm.interiorAudit"
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
      <div class="item" style="max-width: 300px">
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
      <div class="item">
        <el-button type="primary" icon="el-icon-plus" size="medium">
          新增公司
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
  </div>
</template>

<script>
import bsTables from "@/components/tableBtn";
export default {
  name: "bsCompanyManage",
  components: {
    bsTables
  },
  data() {
    return {
      totalCount: 0,
      staffList: [],
      pageSize: 10,
      currentPage: 1,
      searchForm: {
        orderNumber: null,
        OfferNumber: null,
        CustomerName: null,
        staffId: null,
        clientName: null,
        contacts: null,
        dateTime: null
      },
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: this.size,
        isIndex: true,
        columns: [
          {
            prop: "companyLogo",
            isHiden: true,
            label: "客户名称",
            elImageUrl: true,
            elImage: row => {
              return row.companyLogo;
            }
          },
          {
            prop: "companyName",
            isHiden: true,
            label: "公司名称"
          },
          {
            prop: "companyNumber",
            isHiden: true,
            label: "客户编码"
          },
          {
            prop: "phoneNumber",
            isHiden: true,
            label: "联系电话"
          },
          {
            prop: "integralTotal",
            isHiden: true,
            label: "积分"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "时间",
            render: row => {
              return row.createdOn ? row.createdOn.replace(/T.*/, "") : "";
            }
          },
          {
            prop: "companyType",
            isHiden: true,
            label: "公司类型",
            render: row => {
              let str = "";
              switch (row.companyType) {
                case "Admin":
                  str = "管理员";
                  break;
                case "Supplier":
                  str = "供应商";
                  break;
                case "Exhibition":
                  str = "展厅";
                  break;
                case "Sales":
                  str = "销售公司";
                  break;
                default:
                  str = "";
              }
              return str;
            }
          },
          {
            prop: "audit_state",
            isHiden: true,
            label: "审核状态",
            render(row) {
              let str = "";
              switch (row.status) {
                case 0:
                  str = "未审核";
                  break;
                case 1:
                  str = "审核通过";
                  break;
                case 2:
                  str = "审核不通过";
                  break;
              }
              return str;
            }
          }
        ],
        actions: [
          {
            type: "warning",
            textWrapper() {
              return "审核";
            },
            methods: row => {
              this.openByAudit(row);
            }
          },
          {
            type: "primary",
            textWrapper() {
              return "绑定公司";
            },

            methods: row => {
              this.openUserMan(row);
            }
          },
          {
            type: "warning",
            textWrapper() {
              return "内部审核";
            },

            methods: row => {
              this.openNeiByAudit(row);
            }
          },
          {
            type: "success",
            textWrapper() {
              return "授权";
            },
            methods: row => {
              this.openAuth(row);
            }
          },
          {
            type: "primary",
            textWrapper() {
              return "员工管理";
            },
            methods: row => {
              this.openEmployeeMan(row);
            }
          },
          {
            type: "danger",
            color: "#F9AE3E",
            textWrapper() {
              return "删除";
            },
            methods: row => {
              console.log(row);
              this.deleteOrgCompany(row);
            },
            class: "copy",
            icon2: "el-icon-s-promotion"
          }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 搜索
    search() {
      this.currentPage = 1;
      // this.getCompanySamplelistPage();
    },
    // 打开员工管理
    openEmployeeMan(row) {
      this.currentCompany = row;
      this.staffManageDialog = true;
    },
    // 打开审核列表
    openByAudit(row) {
      this.dialogTitle = "审核";
      this.clientDialog = true;
      this.$nextTick(() => {
        this.$refs.ClientForm.clearValidate();
      });
      for (const key in row) {
        this.addClientForm[key] = row[key];
      }
      console.log(this.addClientForm);
      this.$refs.mapBaiduMap &&
        this.$refs.mapBaiduMap.resetMap(this.addClientForm.address);
      this.$nextTick(() => {
        this.isShowAttrsList = false;
      });
    }, // 打开内部审核列表
    openNeiByAudit(row) {
      this.dialogTitle = "内部审核";
      this.clientDialog = true;
      this.$nextTick(() => {
        this.$refs.ClientForm.clearValidate();
      });
      for (const key in row) {
        this.addClientForm[key] = row[key];
      }
      this.$refs.mapBaiduMap &&
        this.$refs.mapBaiduMap.resetMap(this.addClientForm.address);
      this.$nextTick(() => {
        this.isShowAttrsList = false;
      });
    },
    // 打开授权面板
    async openAuth(row) {
      this.currentCompany = row;
      this.distribution = row.integralTotal;
      this.checkAuth = "authDistribution";
      const res = await this.getCompanyConfigureById(row.id);
      console.log(res);
      try {
        if (res.data.result.code === 200) {
          this.companyConfig = res.data.result.item;
          for (const key in this.companyConfig) {
            this.authForm[key] = this.companyConfig[key];
          }
        } else {
          this.$message.error("您是非正常添加的公司，没有默认授权值哦");
        }
      } catch (error) {
        this.$message.error("您是非正常添加的公司，没有默认授权值哦");
      }
      this.authDialogConfig.show = true;
    },
    // 打开绑定公司
    openUserMan(row) {
      this.UserManConfig.userManDialog = true;
      this.UserManConfig.companyNumber = row.companyNumber;
      this.UserManConfig.phoneNumber = row.phoneNumber;
      this.getUserMan(row.companyNumber, row.companyType);
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getCompanySamplelistPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getCompanySamplelistPage();
    }
  }
};
</script>
<style scoped lang="less">
.bsCompanyManage {
  padding: 0 20px;
  min-height: 100%;
  background-color: #fff;
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
        width: 70px;
        min-width: 70px;
      }
    }
  }
}
</style>
