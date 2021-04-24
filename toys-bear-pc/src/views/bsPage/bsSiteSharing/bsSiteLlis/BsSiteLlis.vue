<template>
  <div class="bsMyCollection">
    <div class="title">站点列表 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="left">
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
      <el-button
        @click="openAddClien"
        type="primary"
        icon="el-icon-plus"
        size="medium"
      >
        新增站点
      </el-button>
    </div>
    <div class="tableBox">
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="collecTable"
        :header-cell-style="{ backgroundColor: '#f9fafc' }"
      >
        <el-table-column label="序号" type="index" align="center" width="70">
        </el-table-column>
        <el-table-column label="站点" width="150" prop="siteRegion">
          <template slot-scope="scope">
            <div>
              <i
                style="color: #3368a9; margin-right: 15px"
                class="iconfont icon-hulianwang"
              ></i>
              <span>{{ scope.row.siteRegion }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="shareUrl" min-width="200" label="网址">
          <template slot-scope="scope">
            <div :id="scope.row.id">
              {{ scope.row.shareUrl }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="复制/扫码" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              type="primary"
              @click.stop="copyUrl(scope.row.id)"
              >复制</el-button
            >
            <el-button
              size="mini"
              plain
              type="success"
              @click.stop="generateQRCode(scope.row.shareUrl)"
              >二维码</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户"
          align="center"
        ></el-table-column>
        <el-table-column label="登录码" align="center">
          <template slot-scope="scope">
            <div>
              <span>
                {{ scope.row.verifyCode }}
              </span>
              <i
                @click="resetLoginCode(scope.row)"
                class="el-icon-refresh"
                style="font-size: 14px; cursor: pointer"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="100">
          <template slot-scope="scope">
            <span> {{ scope.row.createdOn.replace(/T.*/, "") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务员" align="center" prop="createdBy">
        </el-table-column>
        <el-table-column label="有效期" align="center" width="100">
          <template slot-scope="scope">
            {{
              (scope.row.expireTime && scope.row.expireTime.split("T")[0]) ||
                "永久有效"
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              style="margin-right: 10px"
              size="mini"
              type="success"
              @click.stop="openEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click.stop="handleDelete(scope.row)"
              slot="reference"
              >删除</el-button
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
    <!-- 新增编辑分享dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addClienDialog"
      :close-on-click-modal="false"
      top="50px"
      width="40%"
    >
      <el-form
        ref="addClientFormRef"
        label-width="120px"
        :rules="addRules"
        :model="clienFormData"
      >
        <el-form-item label="站点域名：" prop="url">
          <div>
            <el-tag
              @click="handlerTag(item)"
              style="margin-right: 10px; cursor: pointer"
              :effect="
                clienFormData.websiteInfoId == item.id ? 'dark' : 'plain'
              "
              v-for="item in handSitesList"
              :key="item.id"
              >{{ item.name }}</el-tag
            >
          </div>
          <el-input
            style="display:none;"
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
              style="margin-left: 10px"
              type="primary"
              @click.stop="openAddMyClient"
              >新增客户</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="允许导出：" prop="isExportExcel">
          <el-select v-model="clienFormData.isExportExcel" placeholder="请选择">
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
            <el-input v-model="clienFormData.profit" placeholder="请输入利润率">
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
        <div class="lessThanPrice">
          <div class="left">
            <el-form-item label="价格小于：">
              <el-input
                v-model="clienFormData.miniPrice"
                clearable
                placeholder="请输入"
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="right">
            <!-- xiaoshuweishu -->
            <el-form-item label="小数位数：">
              <el-select
                v-model="clienFormData.miniPriceDecimalPlaces"
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
          </div>
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
        <div class="isData">
          <div class="label">
            <span>客户提交订单，是否需填资料：</span>
            <el-radio v-model="clienFormData.isCustomerInfo" :label="true"
              >是</el-radio
            >
            <el-radio v-model="clienFormData.isCustomerInfo" :label="false"
              >否</el-radio
            >
          </div>
        </div>
        <center style="margin-top: 10px;">
          <template>
            <el-button type="primary" @click="subProcessingLog">确定</el-button>
            <el-button
              style="margin-left: 30px;"
              plain
              @click="addClienDialog = false"
              >取消</el-button
            >
          </template>
        </center>
      </el-form>
    </el-dialog>
    <!-- 新增客户dialog -->
    <el-dialog
      title="新增客户"
      top="30vh"
      :close-on-click-modal="false"
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
            <el-button plain @click="addMyClientDialog = false"
              >取 消</el-button
            >
          </template>
        </center>
      </el-form>
    </el-dialog>
    <!-- 生成二维码 -->
    <el-dialog :visible.sync="QRCodeDialog" v-if="QRCodeDialog" width="20%">
      <vue-qr
        style="width: 100%"
        :text="QRCodeUrl"
        colorLight="#fff"
        colorDark="#000"
        :margin="0"
      ></vue-qr>
    </el-dialog>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import { mapState } from "vuex";
export default {
  name: "bsSiteLlis",
  components: {
    VueQr
  },
  data() {
    return {
      dateTime: null,
      handSitesList: [],
      websiteInfoId: null,
      userId: null,
      sitesList: [],
      staffList: [],
      clientCurrentPage: 1,
      clientPageSize: 99,
      clientKeyword: "",
      keyword: null,
      defaultFormula: null,
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
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
      customerTemplate: [],
      clientListTotalCount: 0,
      clientList: [],
      addClienDialog: false,
      dialogTitle: "新增站点",
      defaultShareDomain: [],
      clienFormData: {
        miniPrice: 0,
        miniPriceDecimalPlaces: 1,
        url: null,
        isExportExcel: false,
        profit: 0,
        expireTime: null,
        customerInfoId: null,
        offerMethod: "汕头",
        currencyType: "¥",
        currencyTypeName: "RMB",
        totalCost: "0",
        exchange: 0,
        size: "24",
        decimalPlaces: 3,
        rejectionMethod: "四舍五入",
        websiteInfoId: null,
        isCustomerInfo: true
      },
      options: {
        // 报价配置项
        cu_deList: [],
        decimalPlaces: [],
        offerMethod: [],
        rejectionMethod: [],
        size: []
      },
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
        ],
        miniPrice: [{ required: true, message: "请输入价格", trigger: "blur" }],
        miniPriceDecimalPlaces: [
          { required: true, message: "请选择小数位数", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 点击站点选中站点
    handlerTag(item) {
      this.clienFormData.url = item.url;
      this.clienFormData.websiteInfoId = item.id;
    },
    // 获取站点列表
    async getDefaultSites() {
      const res = await this.$http.post("/api/SearchDropdownWebsiteInfos", {});
      console.log(res);
      if (res.data.result.code === 200) {
        this.sitesList = [{ name: "全部", id: null }, ...res.data.result.item];
        this.handSitesList = res.data.result.item;
        console.log(this.handSitesList, 123);
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
    // 获取系统配置项
    async getSelectCompanyOffer() {
      const res = await this.$http.post("/api/GetSelectCompanyOffer", {
        basisParameters: "CompanyProductOffer"
      });
      if (res.data.result.code === 200) this.options = res.data.result.item;
      else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取列表
    async getDataList() {
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
      const res = await this.$http.post("/api/SearchWebsiteShareInfosPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData = res.data.result.item.items;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 删除分享
    async handleDelete(row) {
      this.$confirm("确定要删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post(
            "/api/DeleteWebsiteShareInfo?id=" + row.id,
            {}
          );
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.getDataList();
          } else {
            this.$common.handlerMsgState({
              msg: "删除失败,请联系管理员！",
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
      this.getDataList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getDataList();
    },
    // 刷新登录码
    async resetLoginCode(row) {
      const res = await this.$http.post("/api/RefreshVerifyCode?id=" + row.id);
      const { code, item, msg } = res.data.result;
      if (code === 200) row.verifyCode = item;
      else {
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    },
    // 打开新增分享
    openAddClien() {
      this.clienFormData = {
        miniPrice: 0,
        miniPriceDecimalPlaces: 1,
        url: null,
        isExportExcel: false,
        profit: 0,
        expireTime: null,
        customerInfoId: null,
        offerMethod: "汕头",
        currencyType: "¥",
        currencyTypeName: "RMB",
        totalCost: "0",
        exchange: 0,
        size: "24",
        decimalPlaces: 3,
        rejectionMethod: "四舍五入",
        websiteInfoId: null,
        isCustomerInfo: true
      };
      this.clienFormData.totalCost = 0;
      this.clienFormData.url = null;
      this.clienFormData.customerInfoId = null;
      this.dialogTitle = "新增站点";
      this.defaultFormula = JSON.stringify(this.customerTemplate[0]);
      this.$nextTick(() => {
        this.addClienDialog = true;
      });
    },
    // 获取客户报价模板
    async getSelectProductOfferFormulaList() {
      const res = await this.$http.post(
        "/api/SelectProductOfferFormulaList",
        {}
      );
      if (res.data.result.code === 200) {
        this.customerTemplate = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 打开编辑分享
    openEdit(row) {
      this.clienFormData = {
        miniPrice: 0,
        miniPriceDecimalPlaces: 1,
        url: null,
        isExportExcel: false,
        profit: 0,
        expireTime: null,
        customerInfoId: null,
        offerMethod: "汕头",
        currencyType: "¥",
        currencyTypeName: "RMB",
        totalCost: "0",
        exchange: 0,
        size: "24",
        decimalPlaces: 3,
        rejectionMethod: "四舍五入",
        websiteInfoId: null,
        isCustomerInfo: true
      };
      this.defaultFormula = null;
      this.dialogTitle = "编辑站点";
      for (const key in row) {
        this.clienFormData[key] = row[key];
      }
      for (let i = 0; i < this.clientList.length; i++) {
        if (this.clientList[i].id == row.customerId) {
          this.clienFormData.customerInfoId = row.customerId;
        }
      }
      this.addClienDialog = true;
    },
    // 生成二维码
    generateQRCode(url) {
      if (!url) {
        return;
      }
      this.QRCodeUrl = url;
      this.QRCodeDialog = true;
    },
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
      this.$common.handlerMsgState({
        msg: "已复制好，可贴粘。",
        type: "success"
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
    // 提交新增客户
    subMyClient() {
      this.$refs.addMyClientRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            "/api/CreateCustomerInfo",
            this.addClientFormData
          );
          if (res.data.result.code === 200) {
            this.addMyClientDialog = false;
            this.$common.handlerMsgState({
              msg: "新增操作成功",
              type: "success"
            });
            this.getClientList();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        }
      });
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
    // 提交新增 | 编辑 分享
    async subProcessingLog() {
      this.$refs.addClientFormRef.validate(async valid => {
        if (valid) {
          let url = "/api/CreateWebsiteShareInfo";
          if (this.dialogTitle === "编辑站点")
            url = "/api/UpdateWebsiteShareInfo";
          console.log(this.clienFormData);
          const res = await this.$http.post(url, this.clienFormData);
          if (res.data.result.code === 200) {
            this.addClienDialog = false;
            this.getDataList();
            this.$common.handlerMsgState({
              msg: "操作成功",
              type: "success"
            });
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        }
      });
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
        console.log(this.clientList);
        this.clientListTotalCount = res.data.result.item.totalCount;
      }
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getDataList();
    }
  },
  computed: {
    ...mapState(["userInfo"])
  },
  created() {
    this.getDataList();
    this.getClientList();
    this.getStaffList();
    this.getDefaultSites();
    this.getSelectProductOfferFormulaList();
  },
  mounted() {
    this.getSelectCompanyOffer();
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
  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
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
@{deep} .el-form {
  .el-input,
  .el-select {
    width: 100%;
  }
  .formItemBox {
    display: flex;
    justify-content: space-between;
  }
  .lessThanPrice {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    border-top: 1px solid #dcdfe6;
  }
}
.isData {
  margin-left: 20px;
}
</style>
