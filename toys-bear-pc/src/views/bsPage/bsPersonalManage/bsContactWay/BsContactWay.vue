<template>
  <div class="BsContactWay">
    <div class="title">
      <div class="titleLeft">
        <span>联系方式 ({{ totalCount }})</span>
      </div>
      <div class="right">
        <el-button
          @click="openAddContact"
          type="primary"
          icon="el-icon-plus"
          size="medium"
        >
          新增
        </el-button>
      </div>
    </div>
    <div class="searchBox" v-if="userInfo.userInfo.isMain">
      <div class="left">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            v-model="keyWord"
            clearable
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
        </div>
        <div class="item">
          <span class="label">业务员：</span>
          <el-select
            v-model="staffName"
            size="medium"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in staffList"
              :key="item.id"
              :label="item.linkman"
              :value="item.linkman"
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

    <!-- 新增弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="addContactWay" width="40%">
      <el-form
        ref="addContactWayRef"
        label-width="100px"
        :rules="addContactWayRules"
        :model="ContactWayRulesFormData"
      >
        <el-form-item label="语种选择:" prop="languageName">
          <el-select
            @change="islanguage"
            v-model="ContactWayRulesFormData.languageName"
            size="medium"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in languageList"
              :key="item.id"
              :label="item.itemText"
              :value="item.itemText"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司名称:" prop="companyName">
          <el-input
            v-model="ContactWayRulesFormData.companyName"
            placeholder="请输入公司名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系地址:" prop="contactAddress">
          <el-input
            v-model="ContactWayRulesFormData.contactAddress"
            placeholder="请输入联系地址"
          ></el-input>
        </el-form-item>

        <div class="dialogContact">
          <div class="left">
            <el-form-item label="联系人:">
              <el-input
                v-model="ContactWayRulesFormData.contactName"
                placeholder="请输入联系人"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系电话:">
              <el-input
                v-model="ContactWayRulesFormData.telephone"
                placeholder="请输入联系电话"
              ></el-input>
            </el-form-item>
            <el-form-item label="传真号码:">
              <el-input
                v-model="ContactWayRulesFormData.fax"
                placeholder="请输入传真号码:"
              ></el-input>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="手机:" prop="phoneNumber">
              <el-input
                v-model.trim="ContactWayRulesFormData.phoneNumber"
                placeholder="请输入手机"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱:">
              <el-input
                v-model="ContactWayRulesFormData.email"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>
            <el-form-item label="QQ:">
              <el-input
                v-model="ContactWayRulesFormData.qq"
                placeholder="请输入QQ"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <center>
          <template>
            <el-button
              type="primary"
              @click="dialogTitle == '新增' ? handleAdd() : handleUpdate()"
              >提 交</el-button
            >
            <el-button plain @click="addContactWay = false">取 消</el-button>
          </template>
        </center>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/table";
import { mapState } from "vuex";
export default {
  name: "BsContactWay",
  components: {
    Table
  },
  computed: {
    ...mapState(["currentComparnyId", "userInfo"])
  },
  data() {
    return {
      languageList: [],
      dialogTitle: "",
      staffList: [],
      keyWord: null,
      staffName: null,
      addContactWay: false,
      ContactWayRulesFormData: {
        language: "",
        contactName: "",
        telephone: "",
        fax: "",
        email: "",
        qq: ""
      },
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: true,
        columns: [
          { prop: "languageName", label: "语种" },
          { prop: "companyName", label: "公司名称" },
          { prop: "contactAddress", label: "地址", isHiden: true, width: 300 },
          { prop: "contactName", label: "联系人" },
          { prop: "telephone", label: "联系电话" },
          { prop: "phoneNumber", label: "联系手机" },
          { prop: "email", label: "邮箱" },
          { prop: "qq", label: "QQ" },
          { prop: "staffName", label: "业务员" }
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
      },
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      addContactWayRules: {
        languageName: [
          { required: true, message: "请选择语种", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
          { min: 1, max: 99, message: "请输入 1-99 个字符", trigger: "blur" }
        ],
        contactAddress: [
          { required: true, message: "请输入公司地址", trigger: "change" },
          { min: 1, max: 100, message: "请输入 1-100 个字符", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            validator: (rule, value, cb) => {
              if (/^\s*\d{11}\s*$/.test(value)) {
                cb();
              } else {
                cb(new Error("手机号格式错误"));
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    async getContactInformationPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyWord: this.keyWord,
        staffName: this.staffName,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/ContactInformationPage", fd);
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      }
    },
    islanguage(val) {
      if (val) {
        for (let index = 0; index < this.languageList.length; index++) {
          if (val === this.languageList[index].itemText) {
            this.ContactWayRulesFormData.language = this.languageList[
              index
            ].parameter;
          }
        }
      }
    },
    // 查询
    search() {
      this.currentPage = 1;
      this.getContactInformationPage();
    },
    // 编辑
    openEdit(row) {
      this.ContactWayRulesFormData = JSON.parse(JSON.stringify(row));
      this.dialogTitle = "编辑";
      this.addContactWay = true;
    },
    // 提交编辑表单
    handleUpdate() {
      this.$refs.addContactWayRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            "/api/UpdateContactInformation",
            this.ContactWayRulesFormData
          );
          if (res.data.result.code === 200) {
            this.addContactWay = false;
            this.$common.handlerMsgState({
              msg: "编辑成功",
              type: "success"
            });
            this.getContactInformationPage();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        }
      });
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确定要删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post(
            "/api/DeleteContactInformation",
            row
          );
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.getContactInformationPage();
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
    // 打开新增弹框
    openAddContact() {
      this.ContactWayRulesFormData = {
        contactName: "",
        telephone: "",
        fax: "",
        email: "",
        qq: ""
      };
      this.dialogTitle = "新增";
      this.addContactWay = true;
    },
    // 提交新增表单
    handleAdd() {
      this.$refs.addContactWayRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            "/api/CreateContactInformation",
            this.ContactWayRulesFormData
          );
          if (res.data.result.code === 200) {
            this.addContactWay = false;

            this.$common.handlerMsgState({
              msg: "新增成功",
              type: "success"
            });
            this.getContactInformationPage();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        }
      });
    },
    // 获取系统配置
    async getSystemConfig() {
      const res = await this.$http.post("/api/ServiceConfigurationList", {
        basisParameters: "languageType"
      });
      if (res.data.result.code === 200) {
        this.languageList = res.data.result.item;
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
      this.getSystemConfig();
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getContactInformationPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getContactInformationPage();
    }
  },
  mounted() {
    this.getContactInformationPage();
    this.getStaffList();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.BsContactWay {
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
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    .titleLeft {
      flex: 1;
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
  .dialogContact {
    display: flex;
    .left,
    .right {
      flex: 1;
    }
  }
}
</style>
