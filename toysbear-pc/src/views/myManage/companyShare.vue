<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
      <!-- 搜索 -->
      <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
        <div class="searchBox">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="关键字查询">
              <el-input
                @keyup.enter.native="search"
                clearable
                v-model="searchForm.keyword"
                placeholder="输入关键字"
                style="width: 90%"
              ></el-input>
            </el-form-item>
            <el-form-item class="btnList">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="primary" @click="openAddClien"
                >新增分享</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!-- 列表 -->
        <div class="tableContent">
          <el-table
            size="mini"
            :data="tableData"
            ref="multipleTable"
            style="width: 100%"
            :default-sort="{ prop: 'date', order: 'descending' }"
          >
            <el-table-column prop="shareUrl" label="网址">
              <template slot-scope="scope">
                <div :id="scope.row.id">
                  {{ scope.row.shareUrl }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="复制/扫码" width="180" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click.stop="copyUrl(scope.row.id)"
                  >复制</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="generateQRCode(scope.row.shareUrl)"
                  >生成二维码</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="verifyCode"
              label="登录码"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column prop="customerName" label="客户" align="center">
            </el-table-column>
            <el-table-column
              prop="createdOn"
              label="创建时间"
              width="100"
              align="center"
              sortable
            >
              <template slot-scope="scope">
                {{ scope.row.createdOn && scope.row.createdOn.split("T")[0] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="expireTime"
              label="有效期"
              width="100"
              align="center"
              sortable
            >
              <template slot-scope="scope">
                {{
                  (scope.row.expireTime &&
                    scope.row.expireTime.split("T")[0]) ||
                    "永久有效"
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="450" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click.stop="resetLoginCode(scope.row)"
                  >刷新登录码</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="openLoginLog(scope.row)"
                  >访问记录</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click.stop="openClientOrder(scope.row)"
                  >客户订单</el-button
                >
                <el-button
                  style="margin-right:10px;"
                  size="mini"
                  type="warning"
                  @click.stop="openEdit(scope.row)"
                  >编辑</el-button
                >
                <el-popconfirm
                  title="确定要删除这个分享吗？"
                  @confirm="handleDelete(scope.row)"
                >
                  <el-button
                    size="mini"
                    @click.stop
                    slot="reference"
                    type="danger"
                    >删除</el-button
                  >
                </el-popconfirm>
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
      <!-- 新增编辑分享dialog -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="addClienDialog"
        :close-on-click-modal="false"
        width="40%"
      >
        <el-form
          ref="addClientFormRef"
          label-width="120px"
          :rules="addRules"
          :model="clienFormData"
        >
          <el-form-item label="站点域名：" prop="url">
            <div style="display:flex;margin-bottom:10px;">
              <el-tag
                @click="clienFormData.url = item"
                style="margin-right: 10px;cursor: pointer;"
                v-for="(item, key) of defaultShareDomain"
                :key="item"
                >{{ key }}</el-tag
              >
            </div>
            <el-input
              v-model="clienFormData.url"
              placeholder="请输入站点域名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="选择客户：" prop="customerInfoId">
            <div class="formItemBox">
              <el-select
                v-model="clienFormData.customerInfoId"
                :filter-method="filterMethod"
                filterable
                clearable
                placeholder="请 输入/选择 客户"
              >
                <el-option
                  v-for="item in clientList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-button
                style="margin-left:10px;"
                type="primary"
                @click.stop="openAddMyClient"
                >新增客户</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="允许导出：" prop="isExportExcel">
            <el-select
              v-model="clienFormData.isExportExcel"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, i) in [
                  { label: '是', value: true },
                  { label: '否', value: false }
                ]"
                :key="i"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="默认公式：">
            <el-select v-model="defaultFormula" placeholder="请选择">
              <el-option
                v-for="(item, i) in customerTemplate"
                :key="i"
                :label="item.name"
                :value="JSON.stringify(item)"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <div class="formItemBox">
            <el-form-item label="报价方式：" prop="offerMethod">
              <el-select
                v-model="clienFormData.offerMethod"
                placeholder="请选择报价方式"
              >
                <el-option
                  v-for="(item, i) in options.offerMethod"
                  :key="i"
                  :label="item.itemCode"
                  :value="item.parameter"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="利润率：" prop="profit">
              <el-input
                v-model="clienFormData.profit"
                placeholder="请输入利润率"
              >
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
          </div>
          <div class="formItemBox">
            <el-form-item label="币种：" prop="currencyType">
              <el-select
                v-model="clienFormData.currencyType"
                placeholder="请选择币种"
              >
                <el-option
                  v-for="(item, i) in options.cu_deList"
                  :key="i"
                  :label="item.itemCode"
                  :value="item.parameter"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="总费用：" prop="totalCost">
              <el-input
                v-model="clienFormData.totalCost"
                clearable
                placeholder="请输入总费用"
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="formItemBox">
            <el-form-item label="汇率：" prop="exchange">
              <el-input
                v-model="clienFormData.exchange"
                clearable
                placeholder="请输入汇率"
              ></el-input>
            </el-form-item>
            <el-form-item label="每车尺码：" prop="size">
              <el-select v-model="clienFormData.size" placeholder="请选择尺码">
                <el-option
                  v-for="(item, i) in options.size"
                  :key="i"
                  :label="item.itemCode"
                  :value="item.parameter"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="formItemBox">
            <el-form-item label="小数位数：" prop="decimalPlaces">
              <el-select
                v-model="clienFormData.decimalPlaces"
                placeholder="请选择小数位数"
              >
                <el-option
                  v-for="(item, i) in options.decimalPlaces"
                  :key="i"
                  :label="item.itemCode"
                  :value="item.parameter"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="取舍方式：" prop="rejectionMethod">
              <el-select
                v-model="clienFormData.rejectionMethod"
                placeholder="请选择取舍方式"
              >
                <el-option
                  v-for="(item, i) in options.rejectionMethod"
                  :key="i"
                  :label="item.itemCode"
                  :value="item.parameter"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="过期时间：" prop="expireTime">
            <el-date-picker
              v-model="clienFormData.expireTime"
              type="datetime"
              placeholder="请选择日期时间"
              align="left"
              value-format="yyyy-MM-ddTHH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <center>
            <template>
              <el-button type="primary" @click="subProcessingLog"
                >提 交</el-button
              >
              <el-button type="danger" @click="addClienDialog = false"
                >取 消</el-button
              >
            </template>
          </center>
        </el-form>
      </el-dialog>
      <!-- 查看访问记录dialog -->
      <transition name="el-zoom-in-top">
        <el-dialog
          title="访问记录"
          :visible.sync="isLoginLog"
          v-if="isLoginLog"
          top="60px"
          width="50%"
        >
          <accessRecordComponent :item="clienFormData" />
        </el-dialog>
      </transition>
      <!-- 分享客户订单dialog -->
      <transition name="el-zoom-in-top">
        <el-dialog
          title="客户订单"
          :visible.sync="clientOrderDialog"
          v-if="clientOrderDialog"
          top="60px"
          width="80%"
        >
          <clientOrderComponent :item="clienFormData" />
        </el-dialog>
      </transition>
      <!-- 新增客户dialog -->
      <el-dialog
        title="新增客户"
        top="30vh"
        :close-on-click-modal="false"
        append-to-body
        :visible.sync="addMyClientDialog"
        destroy-on-close
        width="50%"
      >
        <el-form
          ref="addMyClientRef"
          label-width="100px"
          :rules="addMyClientRules"
          :model="addClientFormData"
        >
          <el-form-item label="客户名称" prop="name">
            <el-input
              v-model="addClientFormData.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input
              v-model="addClientFormData.phoneNumber"
              placeholder="请输入联系方式"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              placeholder="请输入备注信息"
              :rows="4"
              resize="none"
              v-model="addClientFormData.remark"
            ></el-input>
          </el-form-item>
          <center>
            <template>
              <el-button type="primary" @click="subMyClient">提 交</el-button>
              <el-button type="danger" @click="addMyClientDialog = false"
                >取 消</el-button
              >
            </template>
          </center>
        </el-form>
      </el-dialog>
      <!-- 生成二维码 -->
      <el-dialog :visible.sync="QRCodeDialog" v-if="QRCodeDialog" width="20%">
        <vue-qr
          style="width:100%;"
          :text="QRCodeUrl"
          colorLight="#fff"
          colorDark="#000"
          :margin="0"
        ></vue-qr>
      </el-dialog>
    </el-main>
    <el-footer style="padding:0;" height="162px">
      <bsFooter></bsFooter>
    </el-footer>
  </el-container>
</template>

<script>
import bsTop from "@/components/BsTop";
import bsFooter from "@/components/oldFooter";
import accessRecordComponent from "@/components/accessRecordComponent/accessRecordComponent.vue";
import clientOrderComponent from "@/components/clientOrderComponent/clientOrderComponent.vue";
import VueQr from "vue-qr";
export default {
  components: {
    bsTop,
    bsFooter,
    accessRecordComponent,
    clientOrderComponent,
    VueQr
  },
  data() {
    return {
      QRCodeDialog: false,
      QRCodeUrl: "",
      addMyClientRules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }]
      },
      addMyClientDialog: false,
      addClientFormData: {
        name: null,
        phoneNumber: null,
        remark: null
      },
      defaultShareDomain: [],
      defaultFormula: null,
      customerTemplate: [],
      clientOrderDialog: false,
      isLoginLog: false,
      options: {
        // 报价配置项
        cu_deList: [],
        decimalPlaces: [],
        offerMethod: [],
        rejectionMethod: [],
        size: []
      },
      timer: null,
      clientCurrentPage: 1,
      clientPageSize: 20,
      clientKeyword: "",
      clientListTotalCount: 0,
      clientList: [],
      dialogTitle: "新增分享",
      addClienDialog: false,
      clienFormData: {
        url: null,
        isExportExcel: false,
        profit: 0,
        expireTime: null,
        customerInfoId: null,
        offerMethod: "汕头",
        currencyType: "¥",
        currencyTypeName: "RMB",
        totalCost: "0",
        exchange: 1,
        size: "24",
        decimalPlaces: 3,
        rejectionMethod: "四舍五入"
      },
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      addRules: {
        url: [{ required: true, message: "请输入站点域名", trigger: "blur" }],
        isExportExcel: [
          { required: true, message: "请输入站点域名", trigger: "change" }
        ],
        profit: [{ required: true, message: "请输入利润率", trigger: "blur" }],
        customerInfoId: [
          { required: true, message: "请选择客户", trigger: "blur" }
        ],
        offerMethod: [
          { required: true, message: "请选择报价方式", trigger: "change" }
        ],
        currencyType: [
          { required: true, message: "请选择币种", trigger: "change" }
        ],
        totalCost: [
          { required: true, message: "请输入总费用", trigger: "blur" }
        ],
        exchange: [{ required: true, message: "请输入汇率", trigger: "blur" }],
        size: [{ required: true, message: "请选择尺寸", trigger: "change" }],
        decimalPlaces: [
          { required: true, message: "请选择小数位数", trigger: "blur" }
        ],
        rejectionMethod: [
          { required: true, message: "请选择取舍方式", trigger: "blur" }
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      searchForm: {
        keyword: "",
        dateTile: null
      }
    };
  },
  methods: {
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
      // console.warn('none')
      this.$message.success("已复制好，可贴粘。");
    },
    // 生成二维码
    generateQRCode(url) {
      if (!url) {
        return;
      }
      this.QRCodeUrl = url;
      this.QRCodeDialog = true;
    },
    // 提交新增客户
    subMyClient() {
      this.$refs.addMyClientRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            "/api/CreateCustomerInfo",
            this.addClientFormData
          );
          if (res.data.result.code === 200) {
            this.getClientList();
            this.addMyClientDialog = false;
            this.$message.success("新增操作成功");
          } else {
            this.$message.error(res.data.result.msg);
          }
        }
      });
    },
    // 打开新增客户
    openAddMyClient() {
      this.addClientFormData = {
        name: null,
        phoneNumber: null,
        remark: null
      };
      this.addMyClientDialog = true;
    },
    // 打开查看分享客户订单
    openClientOrder(row) {
      for (const key in row) {
        this.clienFormData[key] = row[key];
      }
      this.clientOrderDialog = true;
    },
    // 打开查看访问记录
    openLoginLog(row) {
      for (const key in row) {
        this.clienFormData[key] = row[key];
      }
      this.isLoginLog = true;
    },
    // 获取客户报价模板
    async getSelectProductOfferFormulaList() {
      const res = await this.$http.post(
        "/api/SelectProductOfferFormulaList",
        {}
      );
      if (res.data.result.code === 200) {
        this.customerTemplate = res.data.result.item;
      } else this.$message.error(res.data.result.msg);
    },
    // 获取系统配置项
    async getSelectCompanyOffer() {
      const res = await this.$http.post("/api/GetSelectCompanyOffer", {
        basisParameters: "CompanyProductOffer"
      });
      if (res.data.result.code === 200) this.options = res.data.result.item;
      else this.$message.error(res.data.result.msg);
    },
    // 获取客户列表
    async getClientList() {
      const fd = {
        keyword: this.clientKeyword,
        skipCount: this.clientCurrentPage,
        maxResultCount: this.clientPageSize
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SearchCustomerInfosPage", fd);
      if (res.data.result.code === 200) {
        this.clientList = res.data.result.item.items;
        this.clientListTotalCount = res.data.result.item.totalCount;
      }
    },
    // 搜索客户
    filterMethod(val) {
      this.clientKeyword = val;
      console.log(this.clientKeyword);
      if (this.timer) {
        // 如果存在延时器就清除
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.getClientList();
      }, 1000);
    },
    // 打开新增分享
    openAddClien() {
      this.clienFormData.totalCost = 0;
      this.clienFormData.url = null;
      this.clienFormData.customerInfoId = null;
      this.dialogTitle = "新增分享";
      this.defaultFormula = JSON.stringify(this.customerTemplate[0]);
      this.$nextTick(() => {
        this.addClienDialog = true;
      });
    },
    // 列表查询
    search() {
      this.currentPage = 1;
      this.getSearchWebsiteShareInfosPage();
    },
    // 获取列表
    async getSearchWebsiteShareInfosPage() {
      const fd = {
        startTime: this.searchForm.dateTile && this.searchForm.dateTile[0],
        endTime: this.searchForm.dateTile && this.searchForm.dateTile[1],
        keyword: this.searchForm.keyword,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SearchWebsiteShareInfosPage", fd);
      if (res.data.result.code === 200) {
        this.defaultShareDomain = res.data.result.item.defaultShareDomain;
        this.tableData = res.data.result.item.shareInfos.items;
        this.totalCount = res.data.result.item.shareInfos.totalCount;
      }
    },
    // 切换当前页
    currentChange(page) {
      this.currentPage = page;
      this.getSearchWebsiteShareInfosPage();
    },
    // 切换当前页条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (this.currentPage * pageSize > this.totalCount) return false;
      this.getSearchWebsiteShareInfosPage();
    },
    async resetLoginCode(row) {
      const res = await this.$http.post("/api/RefreshVerifyCode?id=" + row.id);
      const { code, item, msg } = res.data.result;
      if (code === 200) row.verifyCode = item;
      else this.$message.error(msg);
    },
    // 打开编辑客户
    openEdit(row) {
      this.defaultFormula = null;
      this.dialogTitle = "编辑分享";
      for (const key in row) {
        this.clienFormData[key] = row[key];
      }
      this.clienFormData.customerInfoId = row.customerId;
      this.addClienDialog = true;
    },
    // 提交新增 | 编辑 分享
    async subProcessingLog() {
      this.$refs.addClientFormRef.validate(async valid => {
        if (valid) {
          if (this.clienFormData.exchange <= 0) {
            this.$message.error("汇率不能小于0");
            return false;
          }
          let url = "/api/CreateWebsiteShareInfo";
          if (this.dialogTitle === "编辑分享")
            url = "/api/UpdateWebsiteShareInfo";
          const res = await this.$http.post(url, this.clienFormData);
          if (res.data.result.code === 200) {
            this.addClienDialog = false;
            this.getSearchWebsiteShareInfosPage();
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.data.result.msg);
          }
        }
      });
    },
    // 删除
    async handleDelete(row) {
      const res = await this.$http.post(
        "/api/DeleteWebsiteShareInfo?id=" + row.id,
        {}
      );
      if (res.data.result.code === 200) {
        this.$message.success("删除成功");
        this.getSearchWebsiteShareInfosPage();
      } else {
        this.$message.error("删除失败,请检查网络！");
      }
    }
  },
  mounted() {
    this.getSearchWebsiteShareInfosPage();
    this.getClientList();
  },
  created() {
    this.getSelectCompanyOffer();
    this.getSelectProductOfferFormulaList();
  },
  watch: {
    defaultFormula: {
      deep: true,
      handler(newVal) {
        if (newVal) {
          const obj = JSON.parse(newVal);
          this.clienFormData.profit = obj.profit;
          this.clienFormData.offerMethod = obj.offerMethod;
          this.clienFormData.currencyType = obj.cu_de;
          this.clienFormData.currencyTypeName = obj.cu_deName;
          this.clienFormData.exchange = obj.exchange;
          this.clienFormData.size = obj.size;
          this.clienFormData.decimalPlaces = obj.decimalPlaces;
          this.clienFormData.rejectionMethod = obj.rejectionMethod;
        }
      }
    },
    "clienFormData.currencyType": {
      deep: true,
      handler(newVal) {
        if (newVal) {
          this.options.cu_deList.forEach(val => {
            if (val.parameter === newVal)
              this.clienFormData.currencyTypeName = val.itemCode;
          });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.searchBox {
  padding-top: 50px;
  .btnList {
    float: right;
  }
}
.tableContent {
  padding: 20px 0;
}
@{deep} .el-form {
  .el-input,
  .el-select {
    width: 100%;
  }
  .formItemBox {
    display: flex;
    justify-content: space-between;
  }
}
</style>
