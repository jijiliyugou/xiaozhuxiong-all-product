<template>
  <div class="bsMyCollection">
    <div class="cartTitle">
      <span>购物车 ({{ myShoppingCartCount }})</span>
      <span>
        <el-button type="warning" size="medium" @click="analysisCode">
          <i class="iconfont icon-ico" style="margin-right: 5px;"></i>
          解析二维码
        </el-button>
        <el-upload
          action=""
          ref="uploadFile"
          :auto-upload="false"
          :on-change="changeFile"
          :http-request="httpFile"
          :accept="globalJson.Json.MessageRestriction[0].itemCode"
          style="display: none;"
        >
        </el-upload>
      </span>
    </div>
    <div class="tableBox" id="tableId">
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="myTableRef"
        size="mini"
        @selection-change="selectionChange"
        :cell-style="{ padding: 0, margin: 0 }"
        :header-cell-style="{ backgroundColor: '#f9fafc' }"
      >
        <el-table-column
          width="30"
          lable="选择"
          type="selection"
        ></el-table-column>
        <el-table-column label="序号" type="index" align="center" width="40">
        </el-table-column>
        <el-table-column label="产品" width="280">
          <template slot-scope="scope">
            <div class="imgBox">
              <el-tooltip
                effect="light"
                placement="right"
                popper-class="testtooltip"
              >
                <div slot="content">
                  <el-image
                    style="width: 300px;height: auto; cursor: pointer;"
                    :preview-src-list="[scope.row.productImgs]"
                    :src="scope.row.productImgs"
                    fit="contain"
                  >
                    <div
                      slot="placeholder"
                      class="image-slot"
                      style="width: 300px; height: 280px; min-width: 300px"
                    >
                      <img
                        style="width: 300px; height: 280px; min-width: 300px"
                        :src="require('@/assets/images/imgError.png')"
                      />
                    </div>
                    <div
                      slot="error"
                      class="image-slot"
                      style="width: 300px; height: 280px; min-width: 300px"
                    >
                      <img
                        style="width: 300px; height: 280px; min-width: 300px"
                        :src="require('@/assets/images/imgError.png')"
                      />
                    </div>
                  </el-image>
                </div>
                <el-image
                  @click.native="goDetails(scope.row)"
                  fit="contain"
                  style="width: 80px; height: 60px"
                  :src="scope.row.productImgs"
                >
                  <div slot="placeholder" class="errorImg">
                    <img src="~@/assets/images/imgError.png" alt />
                  </div>
                  <div
                    slot="error"
                    class="errorImg"
                    @click="goDetails(scope.row)"
                  >
                    <img src="~@/assets/images/imgError.png" alt />
                  </div>
                </el-image>
              </el-tooltip>
              <div class="productName">
                <div class="name" @click="goDetails(scope.row)">
                  <el-tooltip
                    effect="dark"
                    :disabled="scope.row.productJson.name.length < 15"
                    :content="scope.row.productJson.name"
                    placement="top-start"
                  >
                    <span
                      class=" spanName"
                      style="max-width:190px; display:inline-block"
                    >
                      {{ scope.row.productJson.name }}</span
                    >
                  </el-tooltip>
                </div>
                <div class="factory">
                  <div class="fcatoryName" @click="toFactory(scope.row)">
                    {{ scope.row.supplierName }}
                  </div>
                  <div class="icons">
                    <div class="cartInfoIcon" @click="toNews(scope.row)"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系厂商">
          <template slot-scope="scope">
            <div v-if="scope.row.supplierJson.phoneNumber">
              {{ scope.row.supplierJson.phoneNumber }}
            </div>
            <div v-if="scope.row.supplierJson.telephoneNumber">
              {{ scope.row.supplierJson.telephoneNumber }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="资料来源"
          min-width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.exhibitionCompany.companyName }}
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          align="center"
          prop="productJson.fa_no"
          label="出厂货号"
        ></el-table-column>
        <el-table-column
          width="60"
          align="center"
          prop="productJson.ch_pa"
          label="包装"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="产品规格(cm)"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot="header">
            <div>产品规格</div>
            <div>(cm)</div>
          </template>
          <template slot-scope="scope">
            <span>
              {{ scope.row.productJson.pr_le }}x{{
                scope.row.productJson.pr_wi
              }}x{{ scope.row.productJson.pr_hi }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="包装规格(cm)"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot="header">
            <div>包装规格</div>
            <div>(cm)</div>
          </template>
          <template slot-scope="scope">
            <span>
              {{ scope.row.productJson.in_le }}x{{
                scope.row.productJson.in_wi
              }}x{{ scope.row.productJson.in_hi }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="外箱规格(cm)"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot="header">
            <div>外箱规格</div>
            <div>(cm)</div>
          </template>
          <template slot-scope="scope">
            <span>
              {{ scope.row.productJson.ou_le }}x{{
                scope.row.productJson.ou_wi
              }}x{{ scope.row.productJson.ou_hi }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="体积(cbm)/材积(cuft)"
          width="150"
          show-overflow-tooltip
        >
          <template slot="header">
            <div>体积/材积</div>
            <div>(cbm)/(cuft)</div>
          </template>
          <template slot-scope="scope">
            <span>
              {{ scope.row.productJson.bulk_stere }}/{{
                scope.row.productJson.bulk_feet
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="毛重/净重(kg)"
          width="100"
          show-overflow-tooltip
        >
          <template slot="header">
            <div>毛重/净重</div>
            <div>(kg)</div>
          </template>
          <template slot-scope="scope">
            <span
              >{{ scope.row.productJson.gr_we }}/{{
                scope.row.productJson.ne_we
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="装箱量(pcs)"
          width="80"
          show-overflow-tooltip
        >
          <template slot="header">
            <div>装箱量</div>
            <div>(pcs)</div>
          </template>
          <template slot-scope="scope">
            <span>
              {{ scope.row.productJson.in_en }}/{{
                scope.row.productJson.ou_lo
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="箱数" width="50" min-width="50">
          <template slot-scope="scope">
            <input
              class="inputNumber"
              type="number"
              @input="changeInputNumber($event, scope.row)"
              @focus="selectInputValue($event)"
              @blur="blurInputValue($event, scope.row)"
              @keydown="nextInput($event)"
              v-model="scope.row.number"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="数量"
          min-width="60"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>
              {{
                $calculate.multiply(
                  scope.row.productJson.ou_lo,
                  scope.row.number
                )
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="price"
          label="单价"
          width="50"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span style="color: #f56c6c">
              {{ scope.row.currency + scope.row.price }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总价" min-width="60">
          <template slot-scope="scope">
            <p class="item price">
              <span>{{ scope.row.currency }}</span>
              <span>
                {{
                  $calculate.countTotalprice(
                    scope.row.productJson.price,
                    scope.row.productJson.ou_lo,
                    scope.row.number
                  )
                }}
              </span>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <div class="totalBox" id="totalBox">
        <div class="total_wrap">
          <div class="left">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <!-- <el-popconfirm
            class="deleteBtn"
            title="确定要删除选中的产品吗？"
            @confirm="removeMyShoppingCart"
          > -->

            <el-button
              slot="reference"
              type="primary"
              :disabled="
                $refs.myTableRef && $refs.myTableRef.selection.length < 1
              "
              style="margin-left: 20px"
              size="small"
              @click.stop="removeMyShoppingCart"
              plain
              >删除</el-button
            >
            <!-- </el-popconfirm> -->
          </div>
          <div class="right">
            <p class="item">
              <span class="itemTitle">总款数：</span>
              <span>{{ selectTableData.length }}</span>
            </p>
            <p class="item">
              <span class="itemTitle">总箱数：</span>
              <span>{{ myTotalCartons }}</span>
            </p>
            <p class="item">
              <span class="itemTitle">总数量：</span>
              <span>{{ myTotalQuantity }}</span>
            </p>
            <p class="item">
              <span class="itemTitle">总体积/总材积：</span>
              <span>{{ myTotalOuterBoxStere }}/{{ myTotalOuterBoxFeet }}</span>
            </p>
            <p class="item">
              <span class="itemTitle">总毛重/总净重：</span>
              <span>{{ myTotalMaozhong }}/{{ myTotalJingzhong }}(KG)</span>
            </p>
            <p class="item">
              <span class="itemTitle">总金额：</span>
              <span class="price">￥{{ myTotalPrice }}</span>
            </p>
            <el-button
              type="warning"
              @click="openSubOrder"
              style="margin-left: 10px"
              size="small"
              >生成报价</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 提交信息 -->
    <el-dialog
      title="生成报价"
      :visible.sync="subDialogVisible"
      v-if="subDialogVisible"
      width="800px"
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
            <el-form-item label="客户名称：" prop="customerId">
              <div class="formItemBox">
                <el-select
                  v-model="clienFormData.customerId"
                  filterable
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
            <el-form-item label="备注：">
              <el-input
                maxlength="50"
                show-word-limit
                v-model="clienFormData.title"
              ></el-input>
            </el-form-item>
            <el-form-item label="默认公式：" prop="defaultFormula">
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
                  <!-- <el-input
                    maxlength="30"
                    v-model="clienFormData.offerMethod"
                  ></el-input> -->
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
                    onkeyup="value=value.replace(/[^\d.]/g,'')"
                    v-model.number="clienFormData.exchange"
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
                  <div style="display: flex; justify-content:space-between;">
                    <el-input
                      maxlength="30"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      style="flex:1;"
                      v-model.number="clienFormData.profit"
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
                    v-model.number="clienFormData.totalCost"
                    onkeyup="value=value.replace(/[^\d.]/g,'')"
                    clearable
                    placeholder="请输入总费用"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="每车尺码：" prop="size">
                  <!-- <div style="display: flex; justify-content:space-between;"> -->
                  <el-select
                    style="width: 100%"
                    @change="selectBlur"
                    max-length="2"
                    v-model.number="clienFormData.size"
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
                  <!-- <el-radio-group
                      style="flex:1;display:flex; align-items:center;margin-left: 20px;"
                      v-model="clienFormData.profitCalcMethod"
                    >
                      <el-radio :label="2">除法</el-radio>
                      <el-radio :label="1">乘法</el-radio>
                    </el-radio-group>
                  </div> -->
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
                    v-model.number="clienFormData.miniPrice"
                    onkeyup="value=value.replace(/[^\d.]/g,'')"
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
    </el-dialog>
    <!-- 解析二维码后的 -->
    <el-dialog
      title="解析二维码"
      top="30vh"
      :close-on-click-modal="false"
      :visible.sync="showCodeValue"
      width="450px"
    >
      <bsQRcodeValue
        @close="showCodeValue = false"
        @submitCode="submitCode"
        :QRcodeValue="QRcodeValue"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import eventBus from "@/assets/js/common/eventBus";
import { getQrUrl } from "@/assets/js/common/common.js";
import bsQRcodeValue from "./bsQRcodeValue.vue";
export default {
  name: "bsShoppingCart",
  components: {
    bsQRcodeValue
  },
  data() {
    return {
      QRcodeValue: {},
      showCodeValue: false,
      chufa: "(出厂价+(总费用/(每车尺码/体积*外箱装量)))/(1-报价利润/100)/汇率",
      chengfa:
        "(出厂价+(总费用/(每车尺码/体积*外箱装量)))*(1+报价利润/100)/汇率",
      myTotalPrice: 0,
      myTotalOuterBoxStere: 0,
      myTotalOuterBoxFeet: 0,
      myTotalJingzhong: 0,
      myTotalQuantity: 0,
      myTotalCartons: 0,
      myTotalMaozhong: 0,
      selectTableData: [],
      tableData: [],
      cartList: [],
      addMyClientDialog: false,
      addClientFormData: {
        name: null,
        phoneNumber: null,
        remark: null
      },
      addMyClientRules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }]
      },
      clientList: [],
      clientCurrentPage: 1,
      clientPageSize: 99,
      clientKeyword: "",
      options: {
        // 报价配置项
        cu_deList: [],
        decimalPlaces: [],
        offerMethod: [],
        rejectionMethod: [],
        size: []
      },
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
        miniPrice: 0,
        miniPriceDecimalPlaces: 1
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
          message: "请输入/选择尺码",
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
      customerTemplate: [],
      isIndeterminate: false,
      checkAll: false,
      subDialogVisible: false
    };
  },
  methods: {
    // 提交扫码加购
    async submitCode() {
      this.$store.commit("updateAppLoading", true);
      const res = await this.$http.post(
        "/api/AddShoppingCart",
        {
          userID: this.userInfo.userInfo.id,
          companyNumber: this.userInfo.commparnyList[0].companyNumber,
          // sourceFrom: "active",
          sourceFrom: "QRCodeSearch",
          number: 1,
          currency: "￥",
          Price: 0,
          shopType: "companysamples",
          productNumber: this.QRcodeValue.productNumber
        },
        {
          timeout: 9999999
        }
      );
      if (res.data.result.code === 200) {
        this.getShoppingCartList();
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }

      this.showCodeValue = false;
      // this.$store.commit("updateAppLoading", true);
    },
    // 发送上传图片
    async httpFile(file) {
      const result = getQrUrl(file.raw);
      result
        .then(res => {
          if (res.data) {
            console.log(res.data, "识别二维码成功");
            // this.$message.success("识别二维码成功!");
            this.$http
              .post("/api/QRCodeSearchProduct", { qRcode: res.data })
              .then(res => {
                if (res.data.result.code === 200) {
                  this.QRcodeValue = res.data.result.item;
                  this.showCodeValue = true;
                } else {
                  this.$common.handlerMsgState({
                    msg: res.data.result.msg,
                    type: "danger"
                  });
                }
              });
          } else {
            this.$common.handlerMsgState({
              msg: "识别二维码失败, 请重新上传",
              type: "danger"
            });
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "识别二维码失败, 请重新上传",
            type: "danger"
          });
        });
    },
    // 选择文件
    changeFile(file) {
      // 当前选中文件的大小
      const rowFileSize = file.size;
      // 图片
      const imgSize = Number(
        this.globalJson.Json.MessageRestriction[7].itemCode
      );
      // 图片大小验证
      if (rowFileSize > imgSize) {
        this.$common.handlerMsgState({
          msg: "图片太大",
          type: "danger"
        });
        return false;
      }
      this.httpFile(file);
    },
    // 打开解析二维码
    analysisCode() {
      this.$confirm("请上传二维码", {
        title: "解析二维码",
        confirmButtonText: "上传",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$refs.uploadFile.$refs["upload-inner"].handleClick();
        })
        .catch(() => {});
    },
    // 计算总箱数量
    calculationTotalBoxCartons(list) {
      let number = 0;
      for (let i = 0; i < list.length; i++) {
        number = this.$calculate.add(number, list[i].number || 0);
      }
      this.myTotalCartons = number;
    },
    // 计算总数量
    calculationTotalBox(list) {
      let number = 0;
      for (let i = 0; i < list.length; i++) {
        number = this.$calculate.add(
          number,
          this.$calculate.multiply(list[i].productJson.ou_lo, list[i].number) ||
            0
        );
      }
      this.myTotalQuantity = number;
    },
    // 计算总毛重
    calculationTotalMaozhong(list) {
      let number = 0;
      for (let i = 0; i < list.length; i++) {
        number = this.$calculate.add(
          number,
          this.$calculate.multiply(list[i].number, list[i].productJson.gr_we)
        );
      }
      this.myTotalMaozhong = number;
    },
    // 计算总净重
    calculationTotalJingzhong(list) {
      let number = 0;
      for (let i = 0; i < list.length; i++) {
        number = this.$calculate.add(
          number,
          this.$calculate.multiply(list[i].number, list[i].productJson.ne_we)
        );
      }
      this.myTotalJingzhong = number;
    },
    // 计算总价
    calculationTotalPrice(list) {
      let price = 0;
      for (let i = 0; i < list.length; i++) {
        price = this.$calculate.add(
          price,
          this.$calculate.multiply(
            this.$calculate.multiply(list[i].price, list[i].number),
            list[i].productJson.ou_lo
          )
        );
      }
      this.myTotalPrice = price;
    },
    // 计算总体积材积
    calculationTotalVolume(list) {
      let outerBoxStere = 0,
        outerBoxFeet = 0;
      for (let i = 0; i < list.length; i++) {
        outerBoxStere = this.$calculate.add(
          outerBoxStere,
          this.$calculate.multiply(
            list[i].productJson.bulk_stere,
            list[i].number
          )
        );
        outerBoxFeet = this.$calculate.add(
          outerBoxFeet,
          this.$calculate.multiply(
            list[i].productJson.bulk_feet,
            list[i].number
          )
        );
      }
      this.myTotalOuterBoxStere = outerBoxStere;
      this.myTotalOuterBoxFeet = outerBoxFeet;
    },
    // 下拉框输入事件
    selectBlur(val) {
      if (isNaN(Number(val))) {
        this.clienFormData.size = null;
      }
    },
    // 去聊天
    toNews(item) {
      const fd = {
        name: item.supplierNumber + "bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: item.supplierName,
        value: {}
      };
      this.$store.commit("myAddTab", fd);
    },
    // 点击产品名字跳转
    goDetails(row) {
      const fd = {
        name: row.productNumber,
        linkUrl: this.$route.path,
        component: "bsProductDetails",
        refresh: true,
        label: row.fa_no || "产品详情",
        value: row
      };
      this.$router.push("/bsIndex/bsProductSearchIndex");
      this.$store.commit("myAddTab", fd);
    },
    //厂商跳转
    toFactory(item) {
      const fd = {
        name: item.supplierNumber,
        linkUrl: "/bsIndex/bsShoppingCart",
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
    // 打开新增客户
    openAddMyClient() {
      this.addClientFormData = {
        name: null,
        phoneNumber: null,
        remark: null
      };
      this.addMyClientDialog = true;
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
        this.clientListTotalCount = res.data.result.item.totalCount;
      }
    },
    // 删除购物车
    removeMyShoppingCart() {
      this.$confirm("确定要删除选中的产品吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const selectProducts = this.$refs.myTableRef.selection;
          let productNumber = [];
          // for (let i = 0; i < selectProducts.length; i++) {
          //   productNumber.push(selectProducts[i].productJson.productNumber);
          // }
          productNumber = selectProducts.map(
            val => val.productJson.productNumber
          );
          const fd = {
            userID: this.userInfo.userInfo.id,
            companyNumber: this.userInfo.commparnyList[0].companyNumber,
            // sourceFrom: "active",
            shopType: "companysamples",
            productNumber: productNumber.join()
          };
          this.$store.commit("updateAppLoading", true);
          const res = await this.$http.post("/api/RemoveShoppingCart", fd, {
            timeout: 9999999
          });
          if (res.data.result.code === 200) {
            for (let i = 0; i < selectProducts.length; i++) {
              eventBus.$emit(
                "resetProductIsShop",
                selectProducts[i].productJson
              );
            }
            this.getShoppingCartList();
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
          } else {
            this.$common.handlerMsgState({
              msg: "删除失败",
              type: "danger"
            });
          }
          this.$store.commit("updateAppLoading", false);
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "已取消删除",
            type: "warning"
          });
        });
    },
    // 修改购物车数量
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
      val.number = Number(e.target.value);
      // this.$store.commit("replaceShoppingCartValueCount", this.tableData);
    },
    // 失去焦点事件修改箱数
    async blurInputValue(e, val) {
      let my = JSON.parse(JSON.stringify(val));
      my.productJson = JSON.stringify(my.productJson);
      my.supplierJson = JSON.stringify(my.supplierJson);
      const res = await this.$http.post("/api/UpdateShoppingCart", my);
      if (res.data.result.code != 200) {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 点击全选
    handleCheckAllChange(val) {
      if (val) this.$refs.myTableRef.toggleAllSelection();
      else this.$refs.myTableRef.clearSelection();
      this.isIndeterminate = false;
    },
    // 点击箱数选中输入框中的所有值
    selectInputValue(e) {
      e.currentTarget.select();
    },
    // table勾选发生变化事件
    selectionChange(selection) {
      this.selectTableData = selection;
      if (selection.length) {
        if (selection.length === this.tableData.length) {
          this.isIndeterminate = false;
          this.checkAll = true;
        } else this.isIndeterminate = true;
      } else {
        this.isIndeterminate = false;
        this.checkAll = false;
      }
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
    },
    // 打开提交订单
    openSubOrder() {
      this.clienFormData = {
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
        miniPrice: 0,
        miniPriceDecimalPlaces: 1
      };
      const selectProducts = this.$refs.myTableRef.selection;
      if (selectProducts.length < 1) {
        this.$common.handlerMsgState({
          msg: "请选择要提交的产品",
          type: "danger"
        });
        return false;
      }
      this.subDialogVisible = true;
    },
    // 提交订单
    async submitOrder() {
      this.$refs.addSubmitOrderRef.validate(async valid => {
        if (valid) {
          const selectProducts = this.$refs.myTableRef.selection;
          this.clienFormData.quotationProductList = selectProducts.map(val => {
            return {
              productNumber: val.productJson.productNumber,
              boxNumber: val.number,
              offerAmount: val.price
            };
          });
          if (
            this.userInfo.commparnyList[0].companyType == "Sales" ||
            this.userInfo.commparnyList[0].companyType == "Exhibition"
          ) {
            this.clienFormData.productOfferType = "company";
          }
          for (let i = 0; i < this.clientList.length; i++) {
            if (this.clienFormData.customerId == this.clientList[i].id) {
              this.clienFormData.customerName = this.clientList[i].name;
            }
          }
          this.clienFormData.miniPrice = this.clienFormData.miniPrice || 0;
          this.clienFormData.miniPriceDecimalPlaces =
            this.clienFormData.miniPriceDecimalPlaces || 0;
          const res = await this.$http.post(
            "/api/CreateProductOffer",
            this.clienFormData
          );
          const { code, msg } = res.data.result;
          if (code === 200) {
            this.$common.handlerMsgState({
              msg: "提交成功",
              type: "success"
            });
            let productNumber = [];
            for (let i = 0; i < selectProducts.length; i++) {
              productNumber.push(selectProducts[i].productJson.productNumber);
              eventBus.$emit(
                "resetProductIsShop",
                selectProducts[i].productJson
              );
            }
            const data = {
              userID: this.userInfo.userInfo.id,
              companyNumber: this.userInfo.commparnyList[0].companyNumber,
              // sourceFrom: "active",
              shopType: "companysamples",
              productNumber: productNumber.join()
            };
            const res = await this.$http.post("/api/RemoveShoppingCart", data);
            if (res.data.result.code === 200) {
              this.getShoppingCartList();
            }
            this.subDialogVisible = false;
            const fd = {
              name: "/bsIndex/bsSampleQuotation",
              linkUrl: "/bsIndex/bsSampleQuotation",
              component: "bsSampleQuotation",
              refresh: true,
              label: "找样报价"
            };
            this.$store.commit("myAddTab", fd);
            this.$router.push("/bsIndex/bsSampleQuotation");
          } else {
            this.$common.handlerMsgState({
              msg: msg,
              type: "danger"
            });
          }
        }
      });
    },
    // 关闭提交订单
    closeSub() {
      this.clienFormData = {
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
        miniPrice: 0,
        miniPriceDecimalPlaces: 1
      };
      this.subDialogVisible = false;
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
    // 获取购物车列表
    async getShoppingCartList() {
      const fd = {
        userID: this.userInfo.userInfo.id,
        companyNumber: this.userInfo.commparnyList[0].companyNumber
      };
      const res = await this.$http.post("/api/ShoppingCartList", fd, {
        timeout: 9999999
      });
      if (res.data.result.code === 200) {
        this.cartList = res.data.result.item;
        for (let i = 0; i < this.cartList.length; i++) {
          this.cartList[i] = Object.assign(
            this.cartList[i],
            { productJson: JSON.parse(this.cartList[i].productJson) },
            { supplierJson: JSON.parse(this.cartList[i].supplierJson) }
          );
        }

        this.tableData = this.cartList;
        // console.log(this.tableData, "解析的列表");
        this.$store.commit(
          "handlerShoppingCartCount",
          res.data.result.item.length
        );

        this.$nextTick(() => {
          const totalEl = document.getElementById("totalBox");
          totalEl.style.width =
            document.getElementById("tableId").offsetWidth + 60 + "px";
          this.$refs.myTableRef && this.$refs.myTableRef.toggleAllSelection();
        });
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  async mounted() {
    await this.getSelectProductOfferFormulaList();
    await this.getSelectCompanyOffer();
    await this.getClientList();
    await this.getShoppingCartList();
    eventBus.$on("handlergetClientList", () => {
      this.getShoppingCartList();
    });
    const totalEl = document.getElementById("totalBox");
    eventBus.$on("handlerLeft", left => {
      totalEl.style.left = -left + "px";
    });
  },
  beforeDestroy() {
    eventBus.$off("handlergetClientList");
  },
  computed: {
    ...mapState(["userInfo", "myShoppingCartCount", "globalJson"])
  },
  watch: {
    selectTableData: {
      deep: true,
      handler(list) {
        // 计算总箱数
        this.calculationTotalBoxCartons(list);
        // 计算总数量
        this.calculationTotalBox(list);
        // 计算总毛重
        this.calculationTotalMaozhong(list);
        // 计算总净重
        this.calculationTotalJingzhong(list);
        // 计算总体积材积
        this.calculationTotalVolume(list);
        // 计算总金额
        this.calculationTotalPrice(list);
      }
    },
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
.bsMyCollection {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .cartTitle {
    height: 55px;
    line-height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
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
  .tableBox {
    padding-bottom: 60px;
    @{deep} .el-table {
      font-size: 12px;
      .el-table__header-wrapper .el-checkbox {
        display: none;
        font-size: 13px;
      }
      .el-table__header-wrapper {
        .cell {
          font-size: 13px;
          padding: 10px 0;
        }
      }
      .el-table__body-wrapper {
        .cell {
          padding: 10px 0;
        }
      }
      .inputNumber {
        width: 40px;
        min-width: 40px;
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
      .price {
        color: #ff3e3e;
      }
      .tableTotalNumber {
        color: #ff3e3e;
        // font-size: 14px;
        margin-top: 5px;
      }
      .imgBox {
        text-align: left;
        display: flex;
        // font-size: 14px;
        cursor: pointer;
        .productName {
          // width: 170px;
          height: 60px;
          margin-left: 15px;
          .name,
          .factory {
            width: 170px;
            max-width: 170px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
            .spanName {
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
          }
          .factory {
            color: #3368a9;
            display: flex;
            align-items: center;
            .fcatoryName {
              width: 100px;
              max-width: 100px;
              cursor: pointer;
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
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
    .totalBox {
      position: absolute;
      width: 100%;
      margin-right: 30px;
      z-index: 1;
      left: 0;
      bottom: 0;
      box-sizing: border-box;
      padding-right: 20px;
      .total_wrap {
        background-color: #fff;
        display: flex;
        height: 80px;
        padding: 0 20px;
        box-sizing: border-box;
        align-items: center;
      }
      .left {
        min-width: 130px;
      }
      .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .item {
          margin-right: 30px;
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
    .errorImg {
      img {
        width: 80px;
        height: 60px;
        cursor: pointer;
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
  }
}
.formItemBox {
  display: flex;
  justify-content: space-between;
  .el-select {
    flex: 1;
  }
}
@media screen and (max-width: 1919px) {
  .totalBox {
    padding-right: 10px !important;
    bottom: 10px !important;
  }
}
</style>
