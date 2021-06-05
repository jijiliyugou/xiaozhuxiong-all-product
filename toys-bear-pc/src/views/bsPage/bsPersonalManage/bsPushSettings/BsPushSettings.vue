<template>
  <div class="bsPushSettings">
    <div class="title">
      <div class="left">推送设置 ({{ totalCount }})</div>
      <div class="right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="medium"
          @click="openAddLanguage"
        >
          新增推送模板
        </el-button>
      </div>
    </div>
    <!-- 搜索 -->
    <div class="searchBox">
      <div class="left">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            clearable
            v-model="keyword"
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
        </div>
        <div class="item" v-if="userInfo.userInfo.isMain">
          <span class="label">业务员：</span>
          <el-select
            v-model="staffId"
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
    </div>
    <!-- 表格 -->
    <div class="tableBox">
      <Table :table="tableData"></Table>
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
    <!-- 新增编辑推送常用语dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addLangDialog"
      v-if="addLangDialog"
      width="800px"
    >
      <bsAddOfferFormulaLang
        :messageExtType="messageExtType"
        :editRow="editRow"
        :isEdit="isEdit"
        @submit="submit"
        @handleUpdate="handleUpdate"
        @close="close"
      ></bsAddOfferFormulaLang>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/table";
import bsAddOfferFormulaLang from "@/components/bsComponents/bsPersonalManageComponent/bsAddOfferFormulaLang";
import { mapState } from "vuex";
export default {
  name: "bsPushSettings",
  components: {
    bsAddOfferFormulaLang,
    Table
  },
  data() {
    return {
      keyword: null,
      staffId: null,
      parameter: null,
      messageExtType: [],
      staffList: [],
      isEdit: false,
      editRow: {},
      dialogTitle: "新增推送模板",
      addLangDialog: false,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        // isIndex: true,
        columns: [
          { prop: "sort", label: "排序", width: 100 },
          { prop: "title", label: "类型", width: 200 },
          { prop: "content", label: "内容" },
          { prop: "staffName", label: "业务员", width: 200 }
        ],
        btnWidth: 200,
        actions: [
          {
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
    async getPushSettingsPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        staffId: this.staffId,
        keyword: this.keyword,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/PushSettings/ListByPage", fd);
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      }
    },
    // 获取推送类型
    async getMessageTeplateSettingsByPage() {
      const fd = {
        skipCount: 1,
        maxResultCount: 999,
        messageModel: this.parameter
      };

      const res = await this.$http.post(
        "/api/PushSettings/MessageTeplateSettingsByPage",
        fd
      );
      if (res.data.result.code === 200) {
        let list = res.data.result.item.items;
        for (let i = 0; i < list.length; i++) {
          if (list[i].messageExt > -1) {
            this.messageExtType.push({
              messageExt: list[i].messageExt,
              title: list[i].title
            });
          }
        }
      }
    },
    // 获取消息类型系统参数
    async getServiceConfigurationList() {
      const res = await this.$http.post("/api/ServiceConfigurationList", {
        basisParameters: "OrderMessageModel"
      });
      if (res.data.result.code === 200) {
        res.data.result.item.forEach(val => {
          if (val.itemCode === this.userInfo.commparnyList[0].companyType) {
            this.parameter = val.parameter;
          }
        });

        this.getMessageTeplateSettingsByPage();
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
      this.getPushSettingsPage();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getPushSettingsPage();
    },
    // 提交新增
    async submit(form) {
      const res = await this.$http.post("/api/PushSettings/Create", form);
      if (res.data.result.code === 200) {
        this.close();
        this.$common.handlerMsgState({
          msg: "新增成功",
          type: "success"
        });

        this.getPushSettingsPage();
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 提交编辑
    async handleUpdate(form) {
      const res = await this.$http.post("/api/PushSettings/Update", form);
      if (res.data.result.code === 200) {
        this.close();
        this.$common.handlerMsgState({
          msg: "编辑成功",
          type: "success"
        });
        this.getPushSettingsPage();
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 关闭新增或编辑
    close() {
      this.addLangDialog = false;
    },
    // 打开新增推送
    openAddLanguage() {
      this.dialogTitle = "新增推送模板";
      this.isEdit = false;
      this.addLangDialog = true;
    },
    // 打开编辑推送
    openEdit(row) {
      this.editRow = row;
      this.isEdit = true;
      this.dialogTitle = "编辑推送模板";
      this.addLangDialog = true;
    },
    // 删除推送
    async handleDelete(row) {
      this.$confirm("确定要删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post("/api/PushSettings/Delete", {
            id: row.id
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.getPushSettingsPage();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
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
      this.getPushSettingsPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getPushSettingsPage();
    }
  },
  created() {
    this.getServiceConfigurationList();
  },
  mounted() {
    this.getStaffList();
  },
  computed: {
    ...mapState(["userInfo", "currentComparnyId"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsPushSettings {
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
    .right {
      .whiteCart {
        display: inline-block;
        vertical-align: bottom;
        width: 14px;
        height: 14px;
        background: url("~@/assets/images/whiteCart.png") no-repeat center;
        background-size: contain;
        margin-right: 10px;
      }
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
        max-width: 290px;
        margin-right: 20px;
        .label {
          width: 58px;
          min-width: 58px;
        }
      }
    }
  }
}
</style>
