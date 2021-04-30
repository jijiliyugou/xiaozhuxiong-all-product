<template>
  <div class="bsSampleUpdata">
    <div class="title">
      <div class="left">报价详情</div>
      <div class="right"></div>
    </div>
    <!-- <bsSampleSearch
      ref="refSearchData"
      :isEdit="isEditOffMethod"
      :searchFormData="item"
    ></bsSampleSearch> -->
    <bsSampleQuotationTopComponent
      :itemList="itemList"
      :showEditMethod="showEditMethod"
      :handerTabData="handerTabData"
      @openEditOffMethods="openEditOffMethods"
    ></bsSampleQuotationTopComponent>
    <div class="bsSampleTable">
      <div class="top">
        <div class="left">报价产品列表({{ offerProductList.length }})</div>
        <div class="right">
          <el-button @click="handleSelect" class="el-icon-plus" type="primary">
            选择报价产品</el-button
          >
        </div>
      </div>
      <div class="tableBox">
        <el-table
          :data="offerProductList"
          style="width: 100%"
          ref="collecTable"
          :header-cell-style="{ backgroundColor: '#f9fafc' }"
        >
          <el-table-column label="序号" type="index" align="center" width="70">
          </el-table-column>
          <el-table-column prop="img" label="产品" width="300">
            <template slot-scope="scope">
              <div class="imgBox">
                <el-image
                  @click.native="goDetails(scope.row)"
                  fit="contain"
                  style="width:80px;height:60px;"
                  :src="scope.row.imgUrlList && scope.row.imgUrlList[0]"
                >
                  <div slot="placeholder" class="errorImg">
                    <img
                      style="width:60px;height:60px;"
                      src="~@/assets/images/imgError.png"
                      alt
                    />
                  </div>
                  <div slot="error" class="errorImg">
                    <img
                      style="width:60px;height:60px;"
                      src="~@/assets/images/imgError.png"
                      alt
                    />
                  </div>
                </el-image>
                <div class="productName">
                  <div class="name" @click="goDetails(scope.row)">
                    {{ scope.row.name }}
                  </div>
                  <div class="factory">
                    <div class="fcatoryName" @click="toFactory(scope.row)">
                      {{ scope.row.supplierName }}
                    </div>
                    <div class="icons">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.supplierPhone || '暂时没有厂商电话'"
                        placement="top"
                      >
                        <div class="cartPhoneIcon"></div>
                      </el-tooltip>
                      <div class="cartInfoIcon"></div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="资料来源" align="center">
            <template slot-scope="scope">
              {{ scope.row.companyName }}
            </template>
          </el-table-column>
          <el-table-column
            prop="fa_no"
            label="出厂货号"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column prop="ch_pa" label="包装" align="center" width="100">
          </el-table-column>
          <el-table-column label="产品规格" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.ou_le }}x{{ scope.row.ou_wi }}x{{
                  scope.row.ou_hi
                }}(cm)
              </span>
            </template>
          </el-table-column>

          <el-table-column label="包装规格" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.in_le }}x{{ scope.row.in_wi }}x{{
                  scope.row.in_hi
                }}(cm)
              </span>
            </template>
          </el-table-column>
          <el-table-column label="外箱规格" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.ou_le }}x{{ scope.row.ou_wi }}x{{
                  scope.row.ou_hi
                }}(cm)
              </span>
            </template>
          </el-table-column>
          <el-table-column label="体积/材积" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.bulk_stere }}(cbm)/{{ scope.row.bulk_feet }}(cuft)
              </span>
            </template>
          </el-table-column>
          <el-table-column label="毛重/净重" align="center" width="100">
            <template slot-scope="scope">
              <span> {{ scope.row.gr_we }}/{{ scope.row.ne_we }}(kg) </span>
            </template>
          </el-table-column>
          <el-table-column label="装箱量" align="center" width="100">
            <template slot-scope="scope">
              <span> {{ scope.row.in_en }}/{{ scope.row.ou_lo }}(pcs) </span>
            </template>
          </el-table-column>
          <el-table-column label="箱数" align="center" width="100">
            <template slot-scope="scope">
              <input
                class="inputNumber"
                type="number"
                @input="changeInputNumber($event, scope.row)"
                @focus="selectInputValue($event)"
                @keydown="nextInput($event)"
                v-model="scope.row.boxNumber"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="ch_pa"
            label="总数量"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <span>
                {{ sumPriceCount(scope.row.boxNumber, scope.row.ou_lo) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="厂价" align="center" width="100">
            <template slot-scope="scope">
              <span style="color:#f56c6c"> ￥{{ scope.row.price }} </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="offerAmount"
            label="报出价"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <span style="color:#f56c6c">
                {{ scope.row.cu_de + scope.row.offerAmount }}
              </span>
            </template>
          </el-table-column>

          <ex-table-column :autoFit="true" width="100" label="报出总价">
            <template slot-scope="scope">
              <p class="item price">
                <span style="color:#f56c6c">{{ scope.row.cu_de }}</span>
                <span style="color:#f56c6c">
                  {{
                    priceCount(
                      scope.row.offerAmount,
                      scope.row.ou_lo,
                      scope.row.boxNumber
                    )
                  }}
                </span>
              </p>
            </template>
          </ex-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 统计 -->
    <div class="tableBtoBox">
      <div class="tableBto">
        <div class="right">
          <p class="item">
            <span class="itemTitle">总款数：</span>
            <span>{{ offerProductList.length }}</span>
          </p>
          <p class="item">
            <span class="itemTitle">总箱数：</span>
            <span>{{ myTotalQuantity(offerProductList) }}</span>
          </p>
          <p class="item">
            <span class="itemTitle">总体积/总材积：</span>
            <span
              >{{ myTotalVolume(offerProductList).outerBoxStere }}/{{
                myTotalVolume(offerProductList).outerBoxFeet
              }}</span
            >
          </p>
          <p class="item">
            <span class="itemTitle">总毛重/总净重：</span>
            <span>{{ totalMaozhong() }}/{{ totalJingzhong() }}(KG)</span>
          </p>
          <p class="item">
            <span class="itemTitle">总金额：</span>
            <span class="price"
              >{{ item.cu_de + myTotalPrice(offerProductList) }}
            </span>
          </p>
          <el-button
            type="primary"
            @click="openSub(false)"
            style="margin-left: 10px;"
            size="small"
            >确定提交</el-button
          >
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <!-- <center style="padding:20px 0;">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[12, 24, 36, 48]"
          background
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center> -->
    <!-- 提交信息 -->
    <el-dialog
      title="修改报价信息"
      :visible.sync="subDialogVisible"
      width="40%"
    >
      <div class="contactInfoBox">
        <div class="userInfoBox">
          <el-form
            label-position="right"
            label-width="100px"
            ref="addSubmitOrderRef"
            :rules="addInfoRules"
            :model="clienFormData"
          >
            <el-form-item label="报价客户：" prop="customerId">
              <div class="formItemBox">
                <el-select
                  @change="changeCustomer"
                  v-model="clienFormData.customerId"
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
            <el-form-item label="报价备注：" prop="title">
              <el-input
                maxlength="50"
                show-word-limit
                v-model="clienFormData.title"
              ></el-input>
            </el-form-item>
            <el-form-item label="默认公式：">
              <el-select
                v-model="clienFormData.defaultFormula"
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, i) in customerTemplate"
                  :key="i"
                  :label="item.name"
                  :value="JSON.stringify(item)"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <div class="wrapBox">
              <div class="left">
                <el-form-item label="报价方式：" prop="offerMethod">
                  <el-select
                    style="width: 100%"
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
                <el-form-item label="币种：" prop="cu_de">
                  <el-select
                    style="width: 100%"
                    v-model="clienFormData.cu_de"
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
                <el-form-item label="汇率：" prop="exchange">
                  <el-input
                    maxlength="30"
                    v-model="clienFormData.exchange"
                  ></el-input>
                </el-form-item>
                <el-form-item label="小数位数：" prop="decimalPlaces">
                  <el-select
                    style="width: 100%"
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
              </div>
              <div class="right">
                <el-form-item label="利润率：" prop="profit">
                  <!-- <el-input maxlength="30" v-model="clienFormData.profit">
                    <span slot="suffix">%</span>
                  </el-input> -->
                  <div style="display: flex; justify-content:space-between;">
                    <el-input
                      maxlength="30"
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
                <el-form-item label="总费用：" prop="totalCost">
                  <el-input
                    v-model="clienFormData.totalCost"
                    clearable
                    placeholder="请输入总费用"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="每车尺码：" prop="size">
                  <el-select
                    @change="selectBlur"
                    v-model.number="clienFormData.size"
                    filterable
                    default-first-option
                    allow-create
                    style="width: 100%"
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
                <el-form-item label="取舍方式：" prop="rejectionMethod">
                  <el-select
                    v-model="clienFormData.rejectionMethod"
                    style="width: 100%"
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
                <el-form-item label="价格小于：" prop="miniPrice">
                  <el-input
                    v-model="clienFormData.miniPrice"
                    clearable
                    placeholder="请输入"
                  >
                  </el-input>
                </el-form-item>
                <div class="tishi">当价格小于指定值，则调整小数位数</div>
              </div>
              <div class="right">
                <!-- xiaoshuweishu -->
                <el-form-item label="小数位数：" prop="miniPriceDecimalPlaces">
                  <el-select
                    v-model="clienFormData.miniPriceDecimalPlaces"
                    style="width: 100%"
                    placeholder="请选择取舍方式"
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
          </el-form>
          <center style="margin-top: 40px;">
            <el-button
              size="medium"
              @click="submitOrder"
              style="width: 120px"
              type="primary"
            >
              确定
            </el-button>
            <el-button
              size="medium"
              @click="closeSub"
              style="width: 120px; margin-left: 24px"
            >
              取消
            </el-button>
          </center>
        </div>
      </div>
      <!-- 新增客户dialog -->
      <el-dialog
        title="新增客户"
        top="30vh"
        :close-on-click-modal="false"
        :visible.sync="addMyClientDialog"
        destroy-on-close
        append-to-body
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
          <el-form-item label="备注" prop="title">
            <el-input
              type="textarea"
              placeholder="请输入备注信息"
              :rows="4"
              resize="none"
              v-model="addClientFormData.title"
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
    </el-dialog>
  </div>
</template>
<script>
// import { mapState } from "vuex";
// import bsSampleSearch from "@/components/bsComponents/bsSampleComponent/bsSampleSearch";
import bsSampleQuotationTopComponent from "@/components/bsComponents/bsSampleComponent/bsSampleQuotationTopComponent";
import eventBus from "@/assets/js/common/eventBus.js";
export default {
  name: "bsSampleUpdata",
  components: {
    bsSampleQuotationTopComponent
  },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      chufa: "(出厂价+总费用/(每车尺码/外箱材积*外箱装量)/(1-报价利润%)/汇率",
      chengfa: "(出厂价+总费用/(每车尺码/外箱材积*外箱装量)*(1+报价利润%)/汇率",
      showEditMethod: true,
      addClientFormData: {
        name: null,
        phoneNumber: null,
        remark: null
      },
      addMyClientDialog: false,
      addMyClientRules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }]
      },
      options: {
        // 报价配置项
        cu_deList: [],
        decimalPlaces: [],
        offerMethod: [],
        rejectionMethod: [],
        size: []
      },
      customerTemplate: [],
      clientList: [],
      clienFormData: {
        title: null,
        defaultFormula: null,
        customerId: null,
        customerName: null,
        quotationProductList: [],
        profitCalcMethod: 2,
        profit: 0,
        offerMethod: "汕头",
        cu_de: "¥",
        cu_deName: "RMB",
        totalCost: "0",
        exchange: 0,
        size: "24",
        decimalPlaces: 3,
        rejectionMethod: "四舍五入",
        miniPrice: null,
        miniPriceDecimalPlaces: null
      },
      addInfoRules: {
        customerId: [
          {
            required: true,
            message: "请选择客户",
            trigger: "change"
          }
        ],
        defaultFormula: [
          {
            required: true,
            message: "请选择默认公式",
            trigger: "change"
          }
        ],
        offerMethod: [
          {
            required: true,
            message: "请输入报价方式",
            trigger: "blur"
          }
        ],
        cu_de: [
          {
            required: true,
            message: "请选择币别",
            trigger: "change"
          }
        ],
        exchange: [
          {
            required: true,
            message: "请输入汇率",
            trigger: "blur"
          }
        ],
        decimalPlaces: {
          required: true,
          message: "请选择小数位数",
          trigger: "change"
        },
        profit: {
          required: true,
          message: "请输入利润率",
          trigger: "blur"
        },
        totalCost: {
          required: true,
          message: "请输入总费用",
          trigger: "blur"
        },
        size: {
          required: true,
          message: "请选择尺码",
          trigger: "change"
        },
        rejectionMethod: {
          required: true,
          message: "请选择取舍方式",
          trigger: "change"
        }
        // miniPrice: {
        //   required: true,
        //   message: "请输入价格",
        //   trigger: "blur"
        // },
        // miniPriceDecimalPlaces: {
        //   required: true,
        //   message: "请选择小数位数",
        //   trigger: "change"
        // }
      },
      subDialogVisible: false,
      itemList: {},
      handerTabData: [],
      offerProductList: [],
      searchForm: {},
      tableData: [],
      totalCount: 0,
      pageSize: 500,
      currentPage: 1
    };
  },
  created() {},
  mounted() {
    this.getProductOfferNumber();
    eventBus.$on("resetOffProduct", () => {
      this.getProductOfferDetailPage();
    });
  },
  beforeDestroy() {
    eventBus.$off("resetOffProduct");
  },
  methods: {
    // 打开编辑报价方式
    async openEditOffMethods() {
      //   this.clienFormData = {
      //     title: null,
      //     defaultFormula: null,
      //     customerId: null,
      //     customerName: null,
      //     quotationProductList: [],
      //     profit: 0,
      //     offerMethod: "汕头",
      //     cu_de: "¥",
      //     cu_deName: "RMB",
      //     totalCost: "0",
      //     exchange: 0,
      //     size: "24",
      //     decimalPlaces: 3,
      //     rejectionMethod: "四舍五入",
      //     miniPrice: 0,
      //     miniPriceDecimalPlaces: 1
      //   };

      await this.getSelectCompanyOffer();
      await this.getSelectProductOfferFormulaList();
      await this.getClientList();
      for (const key in this.itemList) {
        this.clienFormData[key] = this.itemList[key];
      }
      const clientItem = this.clientList.find(
        val => val.id == this.clienFormData.customerId
      );
      if (!clientItem) {
        this.clienFormData.customerId = null;
      }
      this.subDialogVisible = true;
    },
    // 下拉框输入事件
    selectBlur(val) {
      if (isNaN(Number(val))) {
        this.clienFormData.size = null;
      }
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
            this.$common.handlerMsgState({
              msg: "新增操作成功",
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
    // 关闭提交订单
    closeSub() {
      this.subDialogVisible = false;
    },
    // 提交订单
    async submitOrder() {
      this.$refs.addSubmitOrderRef.validate(async valid => {
        if (valid) {
          await this.openSub(true);
          this.subDialogVisible = false;
          this.getProductOfferNumber();
        }
      });
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
    // 选择客户
    changeCustomer(val) {
      for (let i = 0; i < this.clientList.length; i++) {
        if (this.clientList[i].id == val) {
          this.clienFormData.customerName = this.clientList[i].name;
        }
      }
    },
    // 获取客户列表
    async getClientList() {
      const fd = {
        skipCount: 1,
        maxResultCount: 9999
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
      if (this.timer) {
        // 如果存在延时器就清除
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.getClientList();
      }, 1000);
    },
    // 获取该订单报价公式详情
    async getProductOfferNumber() {
      if (this.item.offerNumber.indexOf("S") < 0) {
        const fd = {
          OfferNumber: this.item.offerNumber
        };
        const res = await this.$http.post("/api/GetProductOfferByNumber", fd);
        if (res.data.result.code === 200) {
          this.$set(this.handerTabData, 0, res.data.result.item);
          this.itemList = res.data.result.item;
          for (const key in this.itemList) {
            this.clienFormData[key] = this.itemList[key];
          }
        } else {
          this.$message.error(res.data.result.msg);
        }
      }
      this.getProductOfferDetailPage();
    },
    // 去厂商
    toFactory(item) {
      const fd = {
        name: item.supplierNumber,
        linkUrl: "/bsIndex/bsVendorQuery",
        component: "bsMyClientsDetail",
        refresh: true,
        label: item.supplierName,
        value: {
          companyNumber: item.supplierNumber,
          companyLogo: item.supplierPersonnelLogo,
          companyName: item.supplierName,
          contactsMan: item.supplierPersonnelName,
          phoneNumber: item.supplierPhone,
          address: item.supplierAddres || item.supplierAddress
        }
      };
      this.$router.push("/bsIndex/bsVendorQuery");
      this.$store.commit("myAddTab", fd);
    },
    // 点击产品名字跳转
    goDetails(row) {
      const fd = {
        name: row.productName + row.fa_no,
        linkUrl: this.$route.path,
        component: "bsProductDetails",
        refresh: true,
        label: row.fa_no || "产品详情",
        value: row
      };
      this.$store.commit("myAddTab", fd);
    },
    // 获取列表
    async getProductOfferDetailPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        ...this.item
      };
      const res = await this.$http.post("/api/ProductOfferDetailPage", fd);
      if (res.data.result.code === 200) {
        this.offerProductList = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    //确定提交数据
    async openSub(flag) {
      let quotationProductList = [];
      this.offerProductList.forEach(item => {
        quotationProductList.push({
          productNumber: item.productNumber,
          boxNumber: item.boxNumber,
          offerAmount: item.offerAmount
        });
      });
      this.clienFormData.quotationProductList = quotationProductList;

      const res = await this.$http.post(
        "/api/UpdateProductOffer",
        this.clienFormData
      );
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "提交成功",
          type: "success"
        });
        this.$store.commit("initOfferProductList");
        if (flag) return false;
        const fd = {
          name: "/bsIndex/bsSampleQuotation",
          linkUrl: "/bsIndex/bsSampleQuotation",
          component: "bsSampleQuotation",
          refresh: true,
          label: "找样报价"
        };
        if (this.$store.state.tabList.length < 2) {
          return false;
        }
        const url = "编辑" + this.item.offerNumber;
        this.$store.commit("closeTab", url);
        this.$router.push("/bsIndex/bsSampleQuotation");
        this.$store.commit("myAddTab", fd);
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          error: "danger"
        });
      }
    },
    //确定删除
    async handleDelete(row) {
      this.$confirm("确定要删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post("/api/UpdateProductOfferDetail", {
            id: row.id
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            // this.$store.commit("popOfferProductList", row);
            this.getProductOfferDetailPage();
            eventBus.$emit("resetSamplelist");
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              error: "danger"
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
    //选择报价产品
    handleSelect() {
      // const myValue = {
      //   offerNumber: .offerNumber,
      //   list: this.offerProductList
      // };
      this.item.topValue = this.itemList;
      const fd = {
        name: this.item.offerNumber,
        linkUrl: "/bsIndex/bsSampleQuotation",
        component: "bsSampleOfferCommodity",
        refresh: true,
        label: this.item.offerNumber,
        value: this.item
      };
      this.$store.commit("myAddTab", fd);
    },
    isInteger(obj) {
      return Math.floor(obj) === obj;
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getProductOfferDetailPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getProductOfferDetailPage();
    },
    // 新增客户
    openAddMyClient() {
      this.addClientFormData = {
        name: null,
        phoneNumber: null,
        remark: null
      };
      this.addMyClientDialog = true;
    },
    /*
     * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
     * @param floatNum {number} 小数
     * @return {object}
     *   {times:100, num: 314}
     */
    toInteger(floatNum) {
      const ret = { times: 1, num: 0 };
      if (this.isInteger(floatNum)) {
        ret.num = floatNum;
        return ret;
      }
      const strfi = floatNum + "";
      const dotPos = strfi.indexOf(".");
      const len = strfi.substr(dotPos + 1).length;
      const times = Math.pow(10, len);
      const intNum = parseInt(floatNum * times + 0.5, 10);
      ret.times = times;
      ret.num = intNum;
      return ret;
    },
    /*
     * 核心方法，实现加减乘除运算，确保不丢失精度
     * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
     *
     * @param a {number} 运算数1
     * @param b {number} 运算数2
     * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
     *
     */
    operation(a, b, digits, op) {
      const o1 = this.toInteger(a);
      const o2 = this.toInteger(b);
      const n1 = o1.num;
      const n2 = o2.num;
      const t1 = o1.times;
      const t2 = o2.times;
      const max = t1 > t2 ? t1 : t2;
      let result = null;
      switch (op) {
        case "add":
          if (t1 === t2) {
            // 两个小数位数相同
            result = n1 + n2;
          } else if (t1 > t2) {
            // o1 小数位 大于 o2
            result = n1 + n2 * (t1 / t2);
          } else {
            // o1 小数位 小于 o2
            result = n1 * (t2 / t1) + n2;
          }
          return result / max;
        case "subtract":
          if (t1 === t2) {
            result = n1 - n2;
          } else if (t1 > t2) {
            result = n1 - n2 * (t1 / t2);
          } else {
            result = n1 * (t2 / t1) - n2;
          }
          return result / max;
        case "multiply":
          result = (n1 * n2) / (t1 * t2);
          return result;
        case "divide":
          result = (n1 / n2) * (t2 / t1);
          return result;
      }
    },
    // 加
    add(a, b, digits) {
      return this.operation(a, b, digits, "add");
    },
    // 减
    subtract(a, b, digits) {
      return this.operation(a, b, digits, "subtract");
    },
    // 乘
    multiply(a, b, digits) {
      return this.operation(a, b, digits, "multiply");
    },
    // 除
    divide(a, b, digits) {
      return this.operation(a, b, digits, "divide");
    },
    // 总数量
    sumPriceCount(boxNumber, ou_lo) {
      return this.multiply(boxNumber, ou_lo);
    },
    // 单个产品总价
    priceCount(price, ou_lo, boxNumber) {
      return this.multiply(this.multiply(price, ou_lo), boxNumber);
    },
    // 计算总体积材积
    myTotalVolume(list) {
      let outerBoxStere = 0,
        outerBoxFeet = 0;
      for (let i = 0; i < list.length; i++) {
        outerBoxStere = this.add(
          outerBoxStere,
          this.multiply(list[i].bulk_stere, list[i].boxNumber)
        );
        outerBoxFeet = this.add(
          outerBoxFeet,
          this.multiply(list[i].bulk_feet, list[i].boxNumber)
        );
      }
      return {
        outerBoxStere,
        outerBoxFeet
      };
    },
    // 计算总净重
    totalJingzhong() {
      let number = 0;
      for (let i = 0; i < this.offerProductList.length; i++) {
        number = this.add(
          number,
          this.multiply(
            this.offerProductList[i].boxNumber,
            this.offerProductList[i].ne_we
          )
        );
      }
      return number;
    },
    // 计算总毛重
    totalMaozhong() {
      let number = 0;
      for (let i = 0; i < this.offerProductList.length; i++) {
        number = this.add(
          number,
          this.multiply(
            this.offerProductList[i].boxNumber,
            this.offerProductList[i].gr_we
          )
        );
      }
      return number;
    },
    onSubmit() {},
    // 计算总箱数量
    myTotalQuantity() {
      let number = 0;
      for (let i = 0; i < this.offerProductList.length; i++) {
        number = this.add(number, this.offerProductList[i].boxNumber || 0);
      }
      return number;
    },
    // 计算总价
    myTotalPrice(list) {
      let price = 0;
      for (let i = 0; i < list.length; i++) {
        price = this.add(
          price,
          this.multiply(
            this.multiply(list[i].offerAmount, list[i].boxNumber),
            list[i].ou_lo
          )
        );
      }
      return price;
    },

    // 点击箱数选中输入框中的所有值
    selectInputValue(e) {
      e.currentTarget.select();
    },
    // 修改数量
    changeInputNumber(e, val) {
      const re = /^[0-9]+.?[0-9]*/;
      if (!re.test(e.target.value)) {
        e.target.value = 0;
      } else if (e.target.value.length > 5) {
        e.target.value = e.target.value.slice(0, 5);
      } else if (!e.target.value) {
        e.target.value = 0;
      } else if (e.target.value.length > 1 && e.target.value[0] == 0) {
        e.target.value = e.target.value.slice(1, 5);
      }
      val.boxNumber = Number(e.target.value);
      this.$store.commit("changeOfferProductNumber", this.offerProductList);
    },
    // 点击上下键盘
    nextInput(e) {
      if (e.keyCode === 40) {
        const inputs = document.getElementsByClassName("inputNumber");
        for (let i = 0; i < inputs.length; i++) {
          // 如果是最后一个，则焦点回到第一个
          if (i == inputs.length - 1) {
            inputs[0].focus();
          } else if (e.target == inputs[i]) {
            inputs[i + 1].focus();
            break; //不加最后一行eles就直接回到第一个输入框
          }
        }
        e.stopPropagation();
        e.preventDefault();
        e.returnValue = false;
        e.cancelBubble = true;
      } else if (e.keyCode === 38) {
        const inputs = document.getElementsByClassName("inputNumber");
        for (let i = 0; i < inputs.length; i++) {
          // 如果是最后一个，则焦点回到第一个
          if (i === 0) {
            inputs[inputs.length - 1].focus();
          } else if (e.target == inputs[i]) {
            inputs[i - 1].focus();
            break; //不加最后一行eles就直接回到第一个输入框
          }
        }
        e.stopPropagation();
        e.preventDefault();
        e.returnValue = false;
        e.cancelBubble = true;
      }
    }
  },
  watch: {
    "clienFormData.defaultFormula": {
      deep: true,
      handler(newVal) {
        if (newVal) {
          const obj = JSON.parse(newVal);
          this.clienFormData.profit = obj.profit;
          this.clienFormData.offerMethod = obj.offerMethod;
          this.clienFormData.cu_de = obj.cu_de;
          this.clienFormData.cu_deName = obj.cu_deName;
          this.clienFormData.exchange = obj.exchange;
          this.clienFormData.size = obj.size;
          this.clienFormData.decimalPlaces = obj.decimalPlaces;
          this.clienFormData.rejectionMethod = obj.rejectionMethod;
          this.clienFormData.profitCalcMethod = obj.profitCalcMethod;
        }
      }
    },
    "clienFormData.cu_de": {
      deep: true,
      handler(newVal) {
        if (newVal) {
          this.options.cu_deList.forEach(val => {
            if (val.parameter === newVal)
              this.clienFormData.cu_deName = val.itemCode;
          });
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsSampleUpdata {
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
  .bsSampleTable {
    margin-bottom: 80px;
    .top {
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
    }
  }
  .tableBtoBox {
    position: fixed;
    right: 27px;
    bottom: 0px;
    width: 1652px;
    z-index: 30;
    .tableBto {
      display: flex;
      align-items: center;
      height: 80px;
      padding: 0 30px;
      box-sizing: border-box;
      background-color: #fff;
      .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .item {
          margin-right: 15px;
          display: flex;
          align-items: center;
          // .itemTitle {
          // }
          .price {
            color: #eb1515;
            font-weight: 700;
            font-size: 18px;
          }
        }
      }
    }
  }

  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
      .inputNumber {
        width: 50px;
        outline: none;
        -moz-appearance: textfield;
        text-align: center;
        color: #ff3e3e;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
        }
      }
      .imgBox {
        text-align: left;
        display: flex;
        font-size: 14px;
        cursor: pointer;
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
            display: flex;
            align-items: center;
            .factoryName {
              cursor: pointer;
            }
            .icons {
              display: flex;
              .cartPhoneIcon,
              .cartInfoIcon {
                width: 20px;
                height: 20px;
                margin-left: 15px;
                cursor: pointer;
              }
              .cartPhoneIcon {
                background: url("~@/assets/images/cartPhoneIcon.png") no-repeat
                  center;
                background-size: contain;
              }
              .cartInfoIcon {
                background: url("~@/assets/images/cartInfoIcon.png") no-repeat
                  center;
                background-size: contain;
              }
            }
          }
          .name {
            margin-top: 8px;
          }
        }
      }
    }
  }
}
.contactInfoBox {
  box-sizing: border-box;
  .userInfoBox {
    padding-right: 20px;
    .wrapBox,
    .lessThanPrice {
      display: flex;
      padding-top: 20px;
      border-top: 1px solid #dcdfe6;
      .left,
      .right {
        flex: 1;
        position: relative;
        .tishi {
          position: absolute;
          bottom: -5px;
          left: 100px;
          color: #ff4848;
        }
      }
    }
    .chengchuTishi {
      color: #ff4848;
      box-sizing: border-box;
      padding-left: 100px;
      margin-bottom: 20px;
    }
  }
  .formItemBox {
    display: flex;
    justify-content: space-between;
    .el-select {
      flex: 1;
    }
  }
}
</style>
