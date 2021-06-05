<template>
  <div class="bsAccountManage">
    <div class="floorTitle">账户基本信息</div>
    <div class="basicInfo">
      <div class="imgBox">
        <el-avatar
          style="background-color: #e4efff"
          :size="110"
          :src="myInfo.companyLogo"
        >
          <p class="errText">
            {{ myInfo.companyName }}
          </p>
        </el-avatar>
      </div>
      <div class="infoBox">
        <div class="companyName">
          公司名称：
          <span>{{ myInfo.companyName }}</span>
        </div>
        <div class="content">
          <div class="left">
            <p class="leftItem">
              手机号码：<span>{{ myInfo.phoneNumber }}</span>
            </p>
            <p class="leftItem">
              电话号码：<span>{{ myInfo.telephoneNumber }}</span>
            </p>
          </div>
          <div class="right">
            <p class="rightItem">
              公司邮箱：<span>{{ myInfo.e_mail }}</span>
            </p>
            <p class="rightItem">
              公司地址：<span>{{ myInfo.address }}</span>
            </p>
          </div>
        </div>
      </div>
      <!-- v-show="myInfo.isMain" -->
      <div class="editOperation" v-show="myInfo.isMain">
        <span class="editItem" @click="openEditCompany">修改公司资料</span>
        <!-- <span class="line">|</span>
        <span class="editItem" @click="openBindCompany">绑定公司</span> -->
      </div>
    </div>
    <div class="tableTitle">
      <div class="left">员工列表 ({{ totalCount }})</div>
      <div class="right">
        <el-button
          v-show="myInfo.isMain"
          type="primary"
          icon="el-icon-plus"
          size="medium"
          @click="openAdd"
        >
          <span>新增员工</span>
        </el-button>
      </div>
    </div>
    <!-- 表格数据 -->
    <Table :table="tableData"></Table>
    <!-- 新增员工 | 编辑员工 -->
    <el-dialog
      width="800px"
      :title="yuangongTitle"
      v-if="addEmployDialog"
      :visible.sync="addEmployDialog"
      destroy-on-close
    >
      <bsAddStaff
        @submit="submitAddStaff"
        :isEdit="isEdit"
        :companyId="myInfo.id"
        :currentEditRow="currentEditRow"
        @close="close"
      />
    </el-dialog>
    <!-- 绑定员工 -->
    <el-dialog
      width="1200px"
      title="绑定员工"
      v-if="bindEmployDialog"
      :visible.sync="bindEmployDialog"
      destroy-on-close
    >
      <bsBindStaff
        :phoneNumber="currentRow.phoneNumber"
        :companyNumber="myInfo.companyNumber"
        :id="currentRow.id"
        @close="close"
      />
    </el-dialog>
    <!-- 编辑公司 -->
    <el-dialog
      top="60"
      width="1200px"
      title="编辑公司"
      v-if="editCompanyDialog"
      :visible.sync="editCompanyDialog"
      destroy-on-close
    >
      <bsEditCompanyInfo
        :editClientForm="myInfo"
        @submit="submitEditCompany"
        @close="close"
      />
    </el-dialog>
    <!-- 绑定公司dialog -->
    <el-dialog
      title="绑定公司"
      :visible.sync="bindCompanyDialog"
      v-if="bindCompanyDialog"
      destroy-on-close
      width="1200px"
    >
      <bsBindCompany
        :companyNumber="myInfo.companyNumber"
        :companyType="myInfo.companyType"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Table from "@/components/table";
import bsAddStaff from "@/components/bsComponents/bsPersonalManageComponent/bsAddStaff";
import bsBindStaff from "@/components/bsComponents/bsPersonalManageComponent/bsBindStaff";
import bsBindCompany from "@/components/bsComponents/bsPersonalManageComponent/bsBindCompany";
import bsEditCompanyInfo from "@/components/bsComponents/bsPersonalManageComponent/bsEditCompanyInfo";
export default {
  name: "bsAccountManage",
  components: {
    bsAddStaff,
    bsBindStaff,
    bsBindCompany,
    bsEditCompanyInfo,
    Table
  },
  data() {
    return {
      bindCompanyDialog: false,
      editCompanyDialog: false,
      totalCount: 0,
      myInfo: {},
      currentEditRow: {},
      yuangongTitle: "新增员工",
      addEmployDialog: false,
      bindEmployDialog: false,
      isEdit: false,
      currentRow: {},
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: true,
        columns: [
          {
            prop: "",
            label: "员工",
            align: "left",
            companyInfo: true,
            width: 300,
            companyLogo: row => {
              return row.userImage;
            },
            linkman: row => {
              return row.linkman;
            },
            companyName: row => {
              return row.linkman;
            }
          },
          {
            prop: "yardType",
            label: "性别",
            render: row => {
              return row.yardType === 1 ? "男" : "女";
            }
          },
          { prop: "phoneNumber", label: "账号" },
          {
            prop: "isMain",
            label: "是否主账号",
            width: 100,
            render: row => {
              return row.isMain === true ? "是" : "否";
            }
          },
          {
            prop: "enabled",
            label: "是否激活",
            width: 100,
            render: row => {
              return row.enabled === true ? "是" : "否";
            }
          },
          {
            prop: "createdOn",
            width: 150,
            label: "添加时间",
            render: row => {
              return row.createdOn.replace(/T.*/, "");
            }
          }
        ],
        btnWidth: 300,
        actions: [
          {
            disabledWrapper: () => {
              return !this.myInfo.isMain;
            },
            classWrapper: () => {
              return "success";
            },
            textWrapper: () => {
              return "绑定员工";
            },
            methods: row => {
              this.openBind(row);
            }
          },
          {
            disabledWrapper: () => {
              return !this.myInfo.isMain;
            },
            classWrapper: () => {
              return "primary";
            },
            textWrapper: () => {
              return "编辑";
            },
            methods: row => {
              this.openEdit(row);
            }
          },
          {
            disabledWrapper: () => {
              return !this.myInfo.isMain;
            },
            classWrapper: () => {
              return "danger";
            },
            textWrapper: () => {
              return "删除";
            },
            methods: row => {
              this.handleDelete(row);
            }
          }
        ]
      }
    };
  },
  methods: {
    // 打开绑定公司
    openBindCompany() {
      this.bindCompanyDialog = true;
    },
    // 提交修改公司信息
    async submitEditCompany(form) {
      const res = await this.$http.post("/api/UpdateOrgCompany", form);
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "编辑成功",
          type: "success"
        });
        this.getCompanyUserList();
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      this.editCompanyDialog = false;
    },
    // 打开修改公司资料
    openEditCompany() {
      this.editCompanyDialog = true;
    },
    // 提交新增员工
    async submitAddStaff(fd) {
      let url = "/api/CreateOrgPersonnel";
      if (this.isEdit) url = "/api/UpdateOrgPersonnel";
      const res = await this.$http.post(url, fd);
      if (res.data.result.code === 200) {
        this.yuangongTitle = "新增员工";
        const msg = this.isEdit ? "编辑成功" : "新增成功";
        this.isEdit = false;
        this.addEmployDialog = false;
        this.getCompanyUserList();
        this.$common.handlerMsgState({
          msg: msg,
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
        this.isEdit = false;
        this.addEmployDialog = false;
      }
    },
    // 打开添加员工
    openAdd() {
      this.yuangongTitle = "新增员工";
      this.isEdit = false;
      this.addEmployDialog = true;
    },
    // 打开绑定员工
    openBind(row) {
      this.currentRow = row;
      this.bindEmployDialog = true;
    },
    // 打开编辑员工
    openEdit(row) {
      this.isEdit = true;
      this.currentEditRow = row;
      this.yuangongTitle = "编辑员工";
      this.addEmployDialog = true;
    },
    // 关闭编辑员工
    close() {
      this.addEmployDialog = false;
      this.bindEmployDialog = false;
      this.editCompanyDialog = false;
    },
    // 删除员工
    async handleDelete(row) {
      if (row.isMain) {
        this.$common.handlerMsgState({
          msg: "不能删除主账号",
          type: "danger"
        });
        return;
      }
      this.$confirm("确定要删除该员工吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post("/api/DeleteCompanyUser", {
            OrgCompanyID: this.myInfo.id,
            OrgPersonnelID: row.id
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.getCompanyUserList();
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "已取消删除",
            type: "warning"
          });
        });
    },
    // 打开绑定员工
    async openBindEmployees(row) {
      this.getPersinnelList(row.phoneNumber);
    },
    // 获取个人信息中的个人信息和员工列表
    async getCompanyUserList() {
      const res = await this.$http.post("/api/CompanyUserList", {
        orgCompanyID: this.currentComparnyId
      });
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        this.myInfo = item;
        this.tableData.data = item.personnels;
        this.totalCount = item.personnels.length;
      } else {
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {
    this.getCompanyUserList();
  },
  computed: {
    ...mapState(["currentComparnyId"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsAccountManage {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .floorTitle {
    height: 55px;
    line-height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
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
  .basicInfo {
    height: 150px;
    width: 100%;
    background: #f9fafc;
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    .imgBox {
      width: 110px;
      height: 110px;
      color: #333;
      border-radius: 50%;
      line-height: 30px;
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      @{deep} .el-avatar {
        img {
          width: 110px;
          min-height: 110px;
        }
      }
      .errText {
        width: 90px;
        height: 90px;
        margin: 10px;
        border-radius: 50%;
        text-align: center;
        box-sizing: border-box;
        line-height: 90px;
        color: #333;
        font-size: 20px;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .infoBox {
      flex: 1;
      height: 110px;
      line-height: 30px;
      margin-left: 40px;
      color: #666;
      .companyName {
        font-weight: 700;
        line-height: 35px;
        color: #333;
      }
      .content {
        display: flex;
        color: #999;
        .left {
          width: 210px;
          .leftItem {
            line-height: 35px;
            span {
              color: #666;
            }
          }
        }
        .right {
          .rightItem {
            line-height: 35px;
            span {
              color: #666;
            }
          }
        }
      }
    }
    .editOperation {
      width: 200px;
      height: 110px;
      color: #3368a9;
      display: flex;
      justify-content: space-evenly;
      .editItem {
        cursor: pointer;
      }
    }
  }
  .tableTitle {
    height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
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
  }
  @{deep} .el-table {
    color: #666;
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
          -webkit-transform: scale(0.8);
          -moz-transform: scale(0.8);
          -ms-transform: scale(0.8);
          transform: scale(0.8);
        }
      }
      .isMe {
        margin-left: 10px;
        width: 44px;
        height: 18px;
        text-align: center;
        background: blue;
        border-radius: 9px;
        color: #fff;
        font-size: 12px;
        i {
          display: block;
          position: relative;
          top: -3px;
          -webkit-transform: scale(0.8);
          -moz-transform: scale(0.8);
          -ms-transform: scale(0.8);
          transform: scale(0.8);
        }
      }
    }
  }
}
</style>
