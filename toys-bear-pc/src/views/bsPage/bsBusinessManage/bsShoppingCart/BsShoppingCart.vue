<template>
  <div class="bsMyCollection">
    <div class="title">购物车 ({{ tableData.length }})</div>
    <div class="tableBox">
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
        <el-table-column label="序号" type="index" align="center" width="60">
        </el-table-column>
        <el-table-column :autoFit="true" label="产品" width="300">
          <template slot-scope="scope">
            <div class="imgBox">
              <el-image
                @click.native="goDetails(scope.row)"
                fit="contain"
                style="width: 80px; height: 60px"
                :src="scope.row.img"
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
                    <div class="cartInfoIcon" @click="toNews(scope.row)"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="资料来源" min-width="80">
          <template slot-scope="scope">
            <div
              style="
                overflow: hidden;
                width: 80px;
                white-space: nowrap;
                text-overflow: ellipsis;
              "
            >
              {{ scope.row.exhibitionName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="60"
          align="center"
          prop="fa_no"
          label="出厂货号"
        ></el-table-column>
        <el-table-column width="60" align="center" prop="ch_pa" label="包装">
        </el-table-column>
        <el-table-column align="center" label="产品规格" min-width="100">
          <template slot-scope="scope">
            <span>
              {{ scope.row.pr_le }}x{{ scope.row.pr_wi }}x{{
                scope.row.pr_hi
              }}(cm)
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="包装规格" min-width="130">
          <template slot-scope="scope">
            <span>
              {{ scope.row.in_le }}x{{ scope.row.in_wi }}x{{
                scope.row.in_hi
              }}(cm)
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="外箱规格" min-width="130">
          <template slot-scope="scope">
            <span>
              {{ scope.row.ou_le }}x{{ scope.row.ou_wi }}x{{
                scope.row.ou_hi
              }}(cm)
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="体积/材积" min-width="130">
          <template slot-scope="scope">
            <span>
              {{ scope.row.bulk_stere }}(cbm)/{{ scope.row.bulk_feet }}(cuft)
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="毛重/净重">
          <template slot-scope="scope">
            <span> {{ scope.row.gr_we }}/{{ scope.row.ne_we }}(kg) </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="装箱量">
          <template slot-scope="scope">
            <span> {{ scope.row.in_en }}/{{ scope.row.ou_lo }}(pcs) </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="箱数" min-width="70">
          <template slot-scope="scope">
            <input
              class="inputNumber"
              type="number"
              @input="changeInputNumber($event, scope.row)"
              @focus="selectInputValue($event)"
              @keydown="nextInput($event)"
              v-model="scope.row.shoppingCount"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="总数量" min-width="60">
          <template slot-scope="scope">
            <span>
              {{ multiply(scope.row.ou_lo, scope.row.shoppingCount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="price"
          label="单价"
          min-width="60"
        >
          <template slot-scope="scope">
            <span style="color: #f56c6c">
              {{ scope.row.cu_de + scope.row.price }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总价" min-width="60">
          <template slot-scope="scope">
            <p class="item price">
              <span>{{ scope.row.cu_de }}</span>
              <span>
                {{
                  priceCount(
                    scope.row.price,
                    scope.row.ou_lo,
                    scope.row.shoppingCount
                  )
                }}
              </span>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <div class="totalBox">
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
    <!-- 提交信息 -->
    <el-dialog title="生成报价" :visible.sync="subDialogVisible" width="40%">
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
                  <el-input
                    maxlength="30"
                    v-model="clienFormData.offerMethod"
                  ></el-input>
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
                  <el-input maxlength="30" v-model="clienFormData.profit">
                    <span slot="suffix">%</span>
                  </el-input>
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
                    v-model="clienFormData.size"
                    style="width: 100%"
                    placeholder="请选择尺码"
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
            <el-form-item label="报价备注：">
              <el-input
                maxlength="50"
                show-word-limit
                v-model="clienFormData.title"
              ></el-input>
            </el-form-item>
          </el-form>
          <center>
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
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import eventBus from "@/assets/js/common/eventBus";
export default {
  name: "bsShoppingCart",
  data() {
    return {
      myTotalPrice: 0,
      myTotalOuterBoxStere: 0,
      myTotalOuterBoxFeet: 0,
      myTotalJingzhong: 0,
      myTotalQuantity: 0,
      myTotalMaozhong: 0,
      selectTableData: [],
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
      customerTemplate: [],
      isIndeterminate: false,
      checkAll: false,
      tableData: [],
      subDialogVisible: false
    };
  },
  methods: {
    /*
     * 判断obj是否为一个整数
     */
    isInteger(obj) {
      return Math.floor(obj) === obj;
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
    // 单个产品总价
    priceCount(price, ou_lo, shoppingCount) {
      return this.multiply(this.multiply(price, ou_lo), shoppingCount);
    },
    // 计算总箱数
    calculationTotalBox(list) {
      let number = 0;
      for (let i = 0; i < list.length; i++) {
        number = this.add(number, list[i].shoppingCount || 0);
      }
      this.myTotalQuantity = number;
    },
    // 计算总毛重
    calculationTotalMaozhong(list) {
      let number = 0;
      for (let i = 0; i < list.length; i++) {
        number = this.add(
          number,
          this.multiply(list[i].shoppingCount, list[i].gr_we)
        );
      }
      this.myTotalMaozhong = number;
    },
    // 计算总净重
    calculationTotalJingzhong(list) {
      let number = 0;
      for (let i = 0; i < list.length; i++) {
        number = this.add(
          number,
          this.multiply(list[i].shoppingCount, list[i].ne_we)
        );
      }
      this.myTotalJingzhong = number;
    },
    // 计算总价
    calculationTotalPrice(list) {
      let price = 0;
      for (let i = 0; i < list.length; i++) {
        price = this.add(
          price,
          this.multiply(
            this.multiply(list[i].price, list[i].shoppingCount),
            list[i].ou_lo
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
        outerBoxStere = this.add(
          outerBoxStere,
          this.multiply(list[i].bulk_stere, list[i].shoppingCount)
        );
        outerBoxFeet = this.add(
          outerBoxFeet,
          this.multiply(list[i].bulk_feet, list[i].shoppingCount)
        );
      }
      this.myTotalOuterBoxStere = outerBoxStere;
      this.myTotalOuterBoxFeet = outerBoxFeet;
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
    // 选择客户
    changeCustomer(val) {
      for (let i = 0; i < this.clientList.length; i++) {
        if (this.clientList[i].id == val) {
          this.clienFormData.customerName = this.clientList[i].name;
        }
      }
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
    // 删除购物车
    removeMyShoppingCart() {
      this.$confirm("确定要删除选中的产品吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const selectProducts = this.$refs.myTableRef.selection;
          for (let i = 0; i < selectProducts.length; i++) {
            for (let j = 0; j < this.tableData.length; j++) {
              if (
                selectProducts[i].productNumber ===
                this.tableData[j].productNumber
              ) {
                this.tableData.splice(j, 1);
              }
            }
          }
          this.$common.handlerMsgState({
            msg: "删除成功",
            type: "success"
          });
          eventBus.$emit("resetMyCart", this.tableData);
          this.$store.commit("resetShoppingCart", selectProducts);
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
      val.shoppingCount = Number(e.target.value);
      this.$store.commit("replaceShoppingCartValueCount", this.tableData);
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
        if (selection.length === this.shoppingList.length) {
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
              productNumber: val.productNumber,
              boxNumber: val.shoppingCount,
              offerAmount: val.price
            };
          });
          if (this.userInfo.commparnyList[0].companyType == "Sales") {
            this.clienFormData.productOfferType = "company";
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
            for (let i = 0; i < this.tableData.length; i++) {
              for (let j = 0; j < selectProducts.length; j++) {
                if (
                  this.tableData[i].productNumber ===
                  selectProducts[j].productNumber
                )
                  this.tableData.splice(i, 1);
              }
            }
            this.$store.commit("resetShoppingCart", selectProducts);
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
    }
  },

  created() {
    this.getSelectProductOfferFormulaList();
    this.getSelectCompanyOffer();
  },
  mounted() {
    this.getClientList();
    this.tableData = this.shoppingList
      ? JSON.parse(JSON.stringify(this.shoppingList))
      : [];
    this.$nextTick(() => {
      this.$refs.myTableRef.toggleAllSelection();
    });
    eventBus.$on("resetMyShoppingCart", () => {
      this.tableData = this.shoppingList
        ? JSON.parse(JSON.stringify(this.shoppingList))
        : [];
    });
  },
  computed: {
    ...mapGetters({
      shoppingList: "myShoppingList"
    }),
    ...mapState(["userInfo"])
  },
  watch: {
    selectTableData: {
      deep: true,
      handler(list) {
        // 计算总箱数
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
  .tableBox {
    @{deep} .el-table {
      .el-table__header-wrapper .el-checkbox {
        display: none;
      }
      .el-table__header-wrapper {
        .cell {
          padding: 10px 0;
        }
      }
      .el-table__body-wrapper {
        .cell {
          padding: 10px 0;
        }
      }
      font-size: 12px;
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
      .price {
        color: #ff3e3e;
      }
      .tableTotalNumber {
        color: #ff3e3e;
        font-size: 14px;
        margin-top: 5px;
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
      display: flex;
      align-items: center;
      height: 80px;
      box-sizing: border-box;
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
        }
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
</style>
