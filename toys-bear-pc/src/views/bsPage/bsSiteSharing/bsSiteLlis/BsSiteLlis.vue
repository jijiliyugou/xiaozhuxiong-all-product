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
        <el-table-column
          prop="shareUrl"
          min-width="200"
          label="网址 (可单击打开)"
        >
          <template slot-scope="scope">
            <div :id="scope.row.id">
              <el-link type="info" :href="scope.row.shareUrl" target="_blank">
                {{ scope.row.shareUrl }}
              </el-link>
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
            <div class="loginCodeBox">
              <span :id="scope.row.verifyCode">
                {{ scope.row.verifyCode }}
              </span>
              <div class="copy">
                <i
                  class="el-icon-document-copy"
                  @click="copyUrl(scope.row.verifyCode)"
                ></i>
                <i
                  @click="resetLoginCode(scope.row)"
                  class="el-icon-refresh"
                ></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="100">
          <template slot-scope="scope">
            <span> {{ scope.row.createdOn.replace(/T.*/, "") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="业务员"
          align="center"
          prop="createdBy"
          show-overflow-tooltip
        >
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
      class="siteDialog"
      :title="dialogTitle"
      :visible.sync="addClienDialog"
      :close-on-click-modal="false"
      top="50px"
      width="930px"
    >
      <el-form
        ref="addClientFormRef"
        label-width="110px"
        size="medium"
        :rules="addRules"
        :model="clienFormData"
      >
        <div class="dialogForm">
          <div class="leftTab">
            <div
              :class="{ item: true, active: tp == 1 }"
              @click="handleTab('set', 1)"
            >
              站点设置
            </div>
            <div
              :class="{ item: true, active: tp == 2 }"
              @click="handleTab('formula', 2)"
            >
              报价公式
            </div>
            <div
              :class="{ item: true, active: tp == 3 }"
              @click="handleTab('advertising', 3)"
            >
              站点广告
            </div>
          </div>
          <div
            class="rightBox"
            id="rightBox"
            ref="rightBoxScroll"
            @scroll="handelScroll"
          >
            <div class="set" id="set">
              <div class="title">设置</div>
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
              <el-form-item label="客户名称：" prop="customerInfoId">
                <div class="formItemBox">
                  <el-select
                    v-model="clienFormData.customerInfoId"
                    filterable
                    clearable
                    placeholder="请输入/选择 客户"
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
              <div class="Excel">
                <el-form-item
                  label-width="166px"
                  label="是否允许客户导出："
                  prop="isExportExcel"
                >
                  <el-radio v-model="clienFormData.isExportExcel" :label="true"
                    >是</el-radio
                  >
                  <el-radio v-model="clienFormData.isExportExcel" :label="false"
                    >否</el-radio
                  >
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="站点过期时间："
                  prop="expireTime"
                >
                  <el-date-picker
                    v-model="clienFormData.expireTime"
                    type="datetime"
                    placeholder="请选择日期时间"
                    align="left"
                    value-format="yyyy-MM-ddTHH:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="selectLang">
                <el-form-item label="语言选择：" prop="websiteLanguage">
                  <el-checkbox-group v-model="clienFormData.websiteLanguage">
                    <el-checkbox
                      v-for="item in langs"
                      :label="item.id"
                      :key="item.id"
                    >
                      {{ item.itemText }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  label-width="230px"
                  label="客户提交订单，是否需填资料："
                  prop="isCustomerInfo"
                >
                  <el-radio v-model="clienFormData.isCustomerInfo" :label="true"
                    >是</el-radio
                  >
                  <el-radio
                    v-model="clienFormData.isCustomerInfo"
                    :label="false"
                    >否</el-radio
                  >
                </el-form-item>
              </div>
              <el-form-item label="显示价格：" prop="isCustomerInfo">
                <el-radio v-model="clienFormData.isCustomerInfo" :label="true"
                  >是</el-radio
                >
                <el-radio v-model="clienFormData.isCustomerInfo" :label="false"
                  >否</el-radio
                >
              </el-form-item>
              <el-form-item label="显示编号：" prop="isCustomerInfo">
                <el-radio v-model="clienFormData.isCustomerInfo" :label="true"
                  >出厂货号</el-radio
                >
                <el-radio v-model="clienFormData.isCustomerInfo" :label="false"
                  >展厅编号</el-radio
                >
                <el-radio v-model="clienFormData.isCustomerInfo" :label="true"
                  >平台编号</el-radio
                >
                <el-radio v-model="clienFormData.isCustomerInfo" :label="false"
                  >均不显示</el-radio
                >
              </el-form-item>
            </div>
            <div class="formula" id="formula">
              <div class="title">报价公式</div>
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
                  <div style="display: flex; justify-content:space-between;">
                    <el-input
                      maxlength="30"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      style="flex:1;"
                      v-model="clienFormData.profit"
                    >
                      <span slot="suffix">%</span>
                    </el-input>
                    <el-radio-group
                      style="flex:1;display:flex; align-items:center;margin-left: 20px;"
                      v-model="clienFormData.profitCalcMethod"
                    >
                      <el-radio :label="2">除法</el-radio>
                      <el-radio :label="1">乘法</el-radio>
                    </el-radio-group>
                  </div>
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
                    onkeyup="value=value.replace(/[^\d.]/g,'')"
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
                    onkeyup="value=value.replace(/[^\d.]/g,'')"
                    clearable
                    placeholder="请输入汇率"
                  ></el-input>
                </el-form-item>
                <el-form-item label="每车尺码：" prop="size">
                  <el-select
                    v-model.number="clienFormData.size"
                    @change="selectBlur"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请输入/选择尺码"
                  >
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
              <div
                class="chengchuTishi"
                v-show="clienFormData.profitCalcMethod == 2"
              >
                {{ chufa }}
              </div>
              <div
                class="chengchuTishi"
                v-show="clienFormData.profitCalcMethod == 1"
              >
                {{ chengfa }}
              </div>
              <div class="lessThanPrice">
                <div class="left">
                  <el-form-item label="价格小于：">
                    <el-input
                      v-model="clienFormData.miniPrice"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      clearable
                      placeholder="请输入"
                    >
                    </el-input>
                  </el-form-item>
                  <div class="tishi">当价格小于指定值，则调整小数位数</div>
                </div>
                <div class="right">
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
            </div>
            <div class="advertising" id="advertising">
              <div class="advertisingTising">
                <div class="title">站点广告</div>
                <el-button
                  @click="addAdvertising"
                  icon="el-icon-plus"
                  style="margin-left: 10px;height:36px"
                  size="mini"
                  type="primary"
                  >添加广告</el-button
                >
              </div>
              <el-table :data="advertisingTable" style="width: 100%">
                <el-table-column
                  prop="date"
                  label="图片"
                  align="center"
                  width="180"
                >
                  <template slot-scope="scope">
                    <el-image
                      style="width: 130px; height: 37px; cursor: pointer"
                      :src="scope.row.img"
                      fit="contain"
                    >
                      <div
                        slot="placeholder"
                        class="image-slot"
                        style="width: 130px; height: 37px; min-width: 130px"
                      >
                        <img
                          style="width: 130px; height: 37px; min-width: 130px"
                          :src="require('@/assets/images/imgError.png')"
                        />
                      </div>
                      <div
                        slot="error"
                        class="image-slot"
                        style="width: 130px; height: 37px; min-width: 130px"
                      >
                        <img
                          style="width: 130px; height: 37px; min-width: 130px"
                          :src="require('@/assets/images/imgError.png')"
                        />
                      </div>
                    </el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="链接" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.lianjie"> </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                  <template slot-scope="scope">
                    <div class="handle">
                      <img src="@/assets/images/up_f.png" alt="" />
                      <div
                        class="delete"
                        @click="handleDelete(scope.$index, scope.row)"
                      >
                        删除
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-form>
      <center style="margin-top: 20px; padding:0 0 20px 0">
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
    </el-dialog>
    <!-- 新增客户dialog -->
    <el-dialog
      title="新增客户"
      top="30vh"
      :close-on-click-modal="false"
      :visible.sync="addMyClientDialog"
      destroy-on-close
      width="1200px"
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
    <el-dialog :visible.sync="QRCodeDialog" v-if="QRCodeDialog" width="385px">
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
      langs: [],
      tp: 1,
      srcoll: "",
      rightBoxScroll: null, //滚动条的高度
      advertisingTable: [{}],
      chufa: "(出厂价+(总费用/(每车尺码/体积*外箱装量)))/(1-报价利润/100)/汇率",
      chengfa:
        "(出厂价+(总费用/(每车尺码/体积*外箱装量)))*(1+报价利润/100)/汇率",
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
        websiteLanguage: [],
        miniPrice: 1,
        miniPriceDecimalPlaces: 1,
        url: null,
        isExportExcel: false,
        profit: 0,
        profitCalcMethod: 2,
        expireTime: null,
        customerInfoId: null,
        offerMethod: "汕头",
        currencyType: "¥",
        currencyTypeName: "RMB",
        totalCost: "0",
        exchange: 1,
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
        websiteLanguage: [
          { required: true, message: "请选择语言", trigger: "change" }
        ],
        isCustomerInfo: [
          { required: true, message: "请选择是否提交资料", trigger: "change" }
        ],
        url: [{ required: true, message: "请选择站点域名", trigger: "change" }],
        isExportExcel: [
          { required: true, message: "请选择允许导出", trigger: "change" }
        ],
        profit: [{ required: true, message: "请输入利润率", trigger: "blur" }],
        customerInfoId: [
          { required: true, message: "请选择客户", trigger: "change" }
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
          { required: true, message: "请选择小数位数", trigger: "change" }
        ],
        rejectionMethod: [
          { required: true, message: "请选择取舍方式", trigger: "change" }
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
      this.getLanguageType();
    },
    // 获取系统配置语言列表
    async getLanguageType() {
      const res = await this.$http.post("/api/ServiceConfigurationList", {
        basisParameters: "languageType"
      });
      if (res.data.result.code === 200) this.langs = res.data.result.item;
      else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 下拉框输入事件
    selectBlur(val) {
      if (isNaN(Number(val))) {
        this.clienFormData.size = null;
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
        websiteLanguage: [],
        miniPrice: 1,
        miniPriceDecimalPlaces: 1,
        profitCalcMethod: 2,
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
        rejectionMethod: "四舍五入",
        websiteInfoId: null,
        isCustomerInfo: true
      };
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
      this.defaultFormula = null;
      // this.dialogTitle = "编辑站点";
      for (const key in row) {
        this.clienFormData[key] = row[key];
      }
      if (row.websiteLanguage) {
        this.clienFormData.websiteLanguage = JSON.parse(
          row.websiteLanguage
        ).map(val => val.id);
      } else {
        this.clienFormData.websiteLanguage = [];
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
    // 复制登录码
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
          const list = [];
          for (let i = 0; i < this.clienFormData.websiteLanguage.length; i++) {
            for (let j = 0; j < this.langs.length; j++) {
              if (this.langs[j].id == this.clienFormData.websiteLanguage[i]) {
                list.push(this.langs[j]);
                break;
              }
            }
          }
          this.clienFormData.websiteLanguage = JSON.stringify(list);
          for (const key in this.clienFormData) {
            if (
              this.clienFormData[key] == "undefined" ||
              this.clienFormData[key] == null ||
              this.clienFormData[key] == "" ||
              this.clienFormData[key] == undefined ||
              this.clienFormData[key] == "null"
            ) {
              delete this.clienFormData[key];
            }
          }
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
    },
    addAdvertising() {},
    // 点击导航菜单，页面滚动到指定位置
    handleTab(val, index) {
      this.tp = index;
      let total = document.getElementById(val).offsetTop;
      this.$refs.rightBoxScroll.scrollTop = total - 51;
    },
    // 滚动条事件
    handelScroll() {
      let setOffset = document.getElementById("set").offsetTop - 51;
      let formulaOffset = document.getElementById("formula").offsetTop - 51;
      // let advertisingOffset =
      //   document.getElementById("advertising").offsetTop - 51;

      if (this.$refs.rightBoxScroll.scrollTop === setOffset) {
        this.tp = 1;
      } else if (
        this.$refs.rightBoxScroll.scrollTop >= formulaOffset &&
        this.$refs.rightBoxScroll.scrollHeight -
          this.$refs.rightBoxScroll.scrollTop !=
          this.$refs.rightBoxScroll.clientHeight
      ) {
        this.tp = 2;
      } else if (
        this.$refs.rightBoxScroll.scrollHeight -
          this.$refs.rightBoxScroll.scrollTop ===
        this.$refs.rightBoxScroll.clientHeight
      ) {
        this.tp = 3;
      }
    }
  },
  computed: {
    ...mapState(["userInfo", "currentComparnyId"])
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
    "clienFormData.profit": {
      deep: true,
      handler(newVal) {
        if (newVal == 100) {
          if (this.clienFormData.profitCalcMethod == 2) {
            this.clienFormData.profit = 10;
            this.$common.handlerMsgState({
              msg: "除法利润率不可为100",
              error: "danger"
            });
          }
        }
      }
    },
    "clienFormData.profitCalcMethod": {
      deep: true,
      handler(newVal) {
        if (newVal == 2) {
          if (this.clienFormData.profit == 100) {
            this.clienFormData.profit = 10;
            this.$common.handlerMsgState({
              msg: "除法利润率不可为100",
              error: "danger"
            });
          }
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
      .loginCodeBox {
        position: relative;
        .copy {
          position: absolute;
          cursor: pointer;
          right: 0;
          top: 0;
          opacity: 0;
          i {
            &:first-of-type {
              margin: 0 5px;
            }
            &:hover {
              color: #5cb6ff;
            }
          }
        }
        &:hover {
          .copy {
            opacity: 1;
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
    .el-form-item {
      flex: 1;
    }
  }
  .chengchuTishi {
    color: #ff4848;
    box-sizing: border-box;
    padding-left: 120px;
    margin-bottom: 20px;
  }
  .lessThanPrice {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    border-top: 1px solid #dcdfe6;
    .left,
    .right {
      flex: 1;
      position: relative;
      .tishi {
        position: absolute;
        bottom: -5px;
        left: 120px;
        color: #ff4848;
      }
    }
  }
}

.siteDialog {
  @{deep}.el-dialog__body {
    padding: 0;
  }
  .dialogForm {
    width: 100%;
    // height: 100%;
    display: flex;
    .leftTab {
      width: 140px;
      min-width: 140px;
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
    .rightBox {
      flex: 1;
      padding: 0 20px;
      height: 600px;
      overflow: hidden;
      overflow-y: auto;
      .title {
        border: 0;
      }
      .Excel {
        display: flex;
        .el-form-item {
          flex: 1;
        }
      }
      .selectLang {
        display: flex;
        border-bottom: 1px solid #e5e5e5;
        .el-form-item {
          flex: 1;
          .el-checkbox-group {
            width: 100%;
          }
          &:last-of-type {
            .el-form-item__label {
              width: 220px !important;
            }
            .el-form-item__content {
              margin: 0 !important;
            }
          }
        }
      }
      .advertising {
        .advertisingTising {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .handle {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          .delete {
            width: 30px;
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>
