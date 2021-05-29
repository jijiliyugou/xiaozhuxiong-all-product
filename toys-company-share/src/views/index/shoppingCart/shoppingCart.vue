<template>
  <div class="myCartWrap">
    <div class="myCartBoX">
      <div class="wrapTitle">
        {{ myShoppingCartLang.myShoppingCart }}
        <span class="email" v-if="userInfo.loginEmail"
          >（{{ userInfo.loginEmail }}）</span
        >
      </div>
      <!-- 排序 -->
      <div class="sortBox">
        <p :class="{ sortID: true, active: isID !== 0 }" @click="sortID">
          <span class="text">{{ myShoppingCartLang.id }}</span>
          <i v-show="isID === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isID === 1"></i>
          <i v-show="isID === 2" class="el-icon-caret-top"></i>
        </p>
        <p :class="{ sortID: true, active: isPrice !== 0 }" @click="sortPrice">
          <span class="text">{{ myShoppingCartLang.price }}</span>
          <i v-show="isPrice === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isPrice === 1"></i>
          <i v-show="isPrice === 2" class="el-icon-caret-top"></i>
        </p>
        <p :class="{ sortID: true, active: isCTNS !== 0 }" @click="sortCTNS">
          <span class="text">{{ myShoppingCartLang.CTNS }}</span>
          <i v-show="isCTNS === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isCTNS === 1"></i>
          <i v-show="isCTNS === 2" class="el-icon-caret-top"></i>
        </p>
        <p
          :class="{ sortID: true, active: isTotalQTY !== 0 }"
          @click="sortTotalQTY"
        >
          <span class="text">{{ myShoppingCartLang.totalQTY }}</span>
          <i v-show="isTotalQTY === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isTotalQTY === 1"></i>
          <i v-show="isTotalQTY === 2" class="el-icon-caret-top"></i>
        </p>
        <p
          :class="{ sortID: true, active: isTotalAmount !== 0 }"
          @click="sortTotalAmount"
        >
          <span class="text">{{ myShoppingCartLang.totalAmount }}</span>
          <i v-show="isTotalAmount === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isTotalAmount === 1"></i>
          <i v-show="isTotalAmount === 2" class="el-icon-caret-top"></i>
        </p>
      </div>
      <!-- 表格 -->
      <div class="tableBoxWrap">
        <el-table
          :cell-style="idStyle"
          :header-cell-style="{
            backgroundColor: '#F5F5F5',
            color: '#666',
            'font-size': '14px',
            'font-weight': 700,
            padding: '0'
          }"
          :data="dataList"
          @selection-change="selectionChange"
          id="myTable"
          ref="multipleTable"
          size="medium"
          :empty-text="publicLang.noData"
          tooltip-effect="dark"
          highlight-current-row
        >
          <el-table-column
            type="selection"
            width="30"
            align="center"
          ></el-table-column>
          <el-table-column
            width="50"
            align="center"
            prop="index"
            :label="myShoppingCartLang.id"
          ></el-table-column>
          <el-table-column
            :label="myShoppingCartLang.productInformation"
            align="center"
          >
            <template slot-scope="scope">
              <div class="productInformation">
                <div class="imgBox" @click="openProductDetail(scope.row)">
                  <el-image
                    style="width: 100px; height: 100px; cursor: pointer;"
                    fit="contain"
                    :src="scope.row.productImgs"
                  >
                    <div slot="placeholder" class="image-slot">
                      <img
                        class="errorImg"
                        style="width: 100px; height: 100px"
                        src="~@/assets/images/logo.png"
                        alt
                      />
                    </div>
                    <div slot="error" class="image-slot">
                      <img
                        class="errorImg"
                        style="width: 100px; height: 100px"
                        src="~@/assets/images/logo.png"
                        alt
                      />
                    </div>
                  </el-image>
                </div>
                <div class="productNameBox">
                  <p class="name">
                    {{
                      globalLang === "zh-CN"
                        ? scope.row.productJson.name
                        : scope.row.productJson.ename
                    }}
                  </p>
                  <p class="fa_no">No.{{ scope.row.productJson.fa_no }}</p>
                  <p class="price">
                    <span>{{ userInfo.currencyType }}</span>
                    <span class="priceText">{{
                      scope.row.productJson.price
                    }}</span>
                  </p>
                </div>
                <div class="item">
                  <div class="content">
                    <span>{{ myShoppingCartLang.packingMethod }}：</span>
                    <span>
                      {{
                        globalLang === "zh-CN"
                          ? scope.row.productJson.ch_pa
                          : scope.row.productJson.en_pa
                      }}
                    </span>
                  </div>
                  <div class="content">
                    <span>{{ myShoppingCartLang.productSpecification }}：</span>
                    <span
                      >{{ scope.row.productJson.pr_le }} x
                      {{ scope.row.productJson.pr_wi }} x
                      {{ scope.row.productJson.pr_hi }} (CM)</span
                    >
                  </div>
                  <div class="content">
                    <span>{{ myShoppingCartLang.packageSpecification }}：</span>
                    <span
                      >{{ scope.row.productJson.in_le }} x
                      {{ scope.row.productJson.in_wi }} x
                      {{ scope.row.productJson.in_hi }} (CM)</span
                    >
                  </div>
                  <div class="content">
                    <span>{{ myShoppingCartLang.outerBoxSize }}：</span>
                    <span
                      >{{ scope.row.productJson.ou_le }} x
                      {{ scope.row.productJson.ou_wi }} x
                      {{ scope.row.productJson.ou_hi }} (CM)</span
                    >
                  </div>
                </div>
                <div class="item">
                  <div class="content">
                    <span>{{ myShoppingCartLang.packingQuantity }}：</span>
                    <span
                      >{{ scope.row.productJson.in_en }} /
                      {{ scope.row.productJson.ou_lo }} (PCS)</span
                    >
                  </div>
                  <div class="content">
                    <span>{{ myShoppingCartLang.volumeVolume }}：</span>
                    <span
                      >{{ scope.row.productJson.bulk_stere }} (CBM) /
                      {{ scope.row.productJson.bulk_feet }} (CUFT)</span
                    >
                  </div>
                  <div class="content">
                    <span>{{ myShoppingCartLang.grossNetWeight }}：</span>
                    <span
                      >{{ scope.row.productJson.gr_we }} /
                      {{ scope.row.productJson.ne_we }} (KG)</span
                    >
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="myShoppingCartLang.CTNS"
            align="center"
            width="100"
          >
            <template slot="header">
              <div style="line-height: normal;">
                <p style="padding:0;line-height: 13px;">
                  {{ myShoppingCartLang.CTNS }}
                </p>
                <p style="padding:0;line-height: 13px;">
                  {{ myShoppingCartLang.totalQTY }}
                </p>
              </div>
            </template>
            <template slot-scope="scope">
              <div>
                <div>
                  <input
                    class="inputNumber"
                    type="number"
                    @input="changeInputNumber($event, scope.row)"
                    @blur="blurInputValue($event, scope.row)"
                    @focus="selectInputValue($event)"
                    @keydown="nextInput($event)"
                    v-model="scope.row.number"
                  />
                </div>
                <div class="tableTotalNumber">
                  {{ multiply(scope.row.productJson.ou_lo, scope.row.number) }}
                  <span>PCS</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120" align="center">
            <template slot="header">
              <div style="line-height: normal;">
                <p style="padding:0;line-height: 13px;">
                  {{ myShoppingCartLang.totalVolume }}
                </p>
                <p style="padding:0;line-height: 13px;">
                  {{ myShoppingCartLang.totalAmount }}
                </p>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="tableTotalVolume">
                <div class="item">
                  <p class="item">
                    {{
                      multiply(
                        scope.row.number,
                        scope.row.productJson.bulk_stere
                      )
                    }}cbm
                  </p>
                  <p class="item">
                    {{
                      multiply(
                        scope.row.number,
                        scope.row.productJson.bulk_feet
                      )
                    }}cuft
                  </p>
                </div>
                <p class="item price">
                  <span>{{ userInfo.currencyType }}</span>
                  <span>
                    {{
                      priceCount(
                        scope.row.price,
                        scope.row.productJson.ou_lo,
                        scope.row.number
                      )
                    }}
                  </span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-popconfirm
                class="deleteBtn"
                :title="
                  globalLang === 'zh-CN'
                    ? '确定要删除此产品吗？'
                    : 'Are you sure you want to delete this product?'
                "
                @confirm="handleDelete(scope.row)"
              >
                <i class="el-icon-delete" slot="reference"></i>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="statisticsBox">
        <div class="totalWrapBox">
          <!-- 总数 -->
          <div class="totalBox" style="border-bottom:1px solid #e9e9e9;">
            <!-- 总体积 -->
            <div class="totalWrap totalVolume">
              {{ myShoppingCartLang.totalVolume }}：
              <span class="changeColor left">
                {{ myTotalOuterBoxStere }}cbm
              </span>
              <span class="changeColor right">
                {{ myTotalOuterBoxFeet }}cuft
              </span>
            </div>
            <!-- 总净重 -->
            <div class="totalWrap totalVolume">
              {{ myOrderLang.totalGrossNetWeight }}：
              <span class="changeColor">{{ myTotalMaozhong }}/</span
              ><span class="changeColor">{{ myTotalJingzhong }}</span>
              <span class="changeColor">(kg)</span>
            </div>
          </div>
          <div class="totalBox" style="border-bottom:1px solid #e9e9e9;">
            <!-- 总条数 -->
            <div class="totalWrap totalVolume">
              {{ myShoppingCartLang.totalRecords }} ：
              <span class="changeColor">
                {{ selectTableData.length }}
              </span>
            </div>
            <!-- 总箱数 -->
            <div class="totalWrap totalVolume">
              {{ myShoppingCartLang.totalQuantity }} ：
              <span class="changeColor">
                {{ myTotalQuantity }}
              </span>
            </div>
            <!-- 总个数 -->
            <div class="totalWrap totalVolume">
              {{ myShoppingCartLang.totalCount }}：
              <span class="changeColor">
                {{ myTotalGe }}
              </span>
            </div>
            <!-- 总价 -->
            <div class="totalWrap totalPrice">
              {{ myShoppingCartLang.totalPrice }}：
              <span class="price">{{ userInfo.currencyType }}</span>
              <span style="margin-left:5px;" class="price">
                {{ myTotalPrice }}
              </span>
            </div>
          </div>
        </div>
        <!-- 提交信息 -->
        <div class="contactInfoBox" v-if="userInfo.isCustomerInfo">
          <div class="title">{{ myShoppingCartLang.contactInformation }}</div>
          <div class="userInfoBox">
            <el-form
              label-position="right"
              label-width="130px"
              :model="formInfo"
            >
              <div class="wrapBox">
                <div class="left">
                  <el-form-item :label="myShoppingCartLang.companyName">
                    <el-input
                      maxlength="30"
                      v-model="formInfo.companyName"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="right">
                  <el-form-item :label="myShoppingCartLang.contact">
                    <el-input
                      maxlength="30"
                      v-model="formInfo.contactName"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="myShoppingCartLang.email">
                    <el-input
                      maxlength="30"
                      v-model="formInfo.email"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <el-form-item :label="myShoppingCartLang.remark">
                <el-input maxlength="255" v-model="formInfo.remark"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="submitBox">
          <el-button
            type="warning"
            :disabled="
              $refs.multipleTable && $refs.multipleTable.selection.length < 1
            "
            class="submitBtn"
            @click="submitOrder"
            >{{ myShoppingCartLang.submit
            }}<span
              v-if="
                $refs.multipleTable && $refs.multipleTable.selection.length > 0
              "
            >
              ({{
                $refs.multipleTable && $refs.multipleTable.selection.length
              }})
            </span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  data() {
    return {
      myTotalOuterBoxStere: 0,
      myTotalOuterBoxFeet: 0,
      myTotalPrice: 0,
      myTotalQuantity: 0,
      myTotalJingzhong: 0,
      myTotalMaozhong: 0,
      myTotalGe: 0,
      selectTableData: [],
      isID: 0,
      isPrice: 0,
      isCTNS: 0,
      isTotalQTY: 0,
      isTotalAmount: 0,
      dataList: [],
      formInfo: {
        loginEmail: "",
        companyName: "",
        contactName: "",
        email: "",
        remark: "",
        shareOrderDetails: []
      }
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
    priceCount(price, outerBoxLo, shoppingCount) {
      return this.multiply(this.multiply(price, outerBoxLo), shoppingCount);
    },
    // ID排序
    sortID() {
      this.isID = this.isID === 0 ? 1 : this.isID === 1 ? 2 : 0;
      this.isPrice = 0;
      this.isCTNS = 0;
      this.isTotalQTY = 0;
      this.isTotalAmount = 0;
      if (this.dataList.length) {
        switch (this.isID) {
          case 0:
            this.dataList.sort((a, b) => {
              return a.index - b.index;
            });
            break;
          case 1:
            this.dataList.sort((a, b) => {
              return a.index - b.index;
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return b.index - a.index;
            });
            break;
        }
      }
    },
    // 价格排序
    sortPrice() {
      this.isPrice = this.isPrice === 0 ? 1 : this.isPrice === 1 ? 2 : 0;
      this.isID = 0;
      this.isCTNS = 0;
      this.isTotalQTY = 0;
      this.isTotalAmount = 0;
      if (this.dataList.length) {
        switch (this.isPrice) {
          case 0:
            this.dataList.sort((a, b) => {
              return a.index - b.index;
            });
            break;
          case 1:
            this.dataList.sort((a, b) => {
              return a.price - b.price;
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return b.price - a.price;
            });
            break;
        }
      }
    },
    // 箱排序
    sortCTNS() {
      this.isCTNS = this.isCTNS === 0 ? 1 : this.isCTNS === 1 ? 2 : 0;
      this.isID = 0;
      this.isPrice = 0;
      this.isTotalQTY = 0;
      this.isTotalAmount = 0;
      if (this.dataList.length) {
        switch (this.isCTNS) {
          case 0:
            this.dataList.sort((a, b) => {
              return a.index - b.index;
            });
            break;
          case 1:
            this.dataList.sort((a, b) => {
              return a.number - b.number;
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return b.number - a.number;
            });
            break;
        }
      }
    },
    // 总数量排序
    sortTotalQTY() {
      this.isTotalQTY =
        this.isTotalQTY === 0 ? 1 : this.isTotalQTY === 1 ? 2 : 0;
      this.isID = 0;
      this.isPrice = 0;
      this.isCTNS = 0;
      this.isTotalAmount = 0;
      if (this.dataList.length) {
        switch (this.isTotalQTY) {
          case 0:
            this.dataList.sort((a, b) => {
              return a.index - b.index;
            });
            break;
          case 1:
            this.dataList.sort((a, b) => {
              return (
                this.multiply(a.productJson.ou_lo, a.number) -
                this.multiply(b.productJson.ou_lo, b.number)
              );
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return (
                this.multiply(b.productJson.ou_lo, b.number) -
                this.multiply(a.productJson.ou_lo, a.number)
              );
            });
            break;
        }
      }
    },
    // 总金额排序
    sortTotalAmount() {
      this.isTotalAmount =
        this.isTotalAmount === 0 ? 1 : this.isTotalAmount === 1 ? 2 : 0;
      this.isID = 0;
      this.isPrice = 0;
      this.isCTNS = 0;
      this.isTotalQTY = 0;
      // 购物车数量 * 外箱装量 *单价= 总金额
      if (this.dataList.length) {
        switch (this.isTotalAmount) {
          case 0:
            this.dataList.sort((a, b) => {
              return a.index - b.index;
            });
            break;
          case 1:
            this.dataList.sort((a, b) => {
              return (
                this.multiply(
                  this.multiply(a.number, a.productJson.ou_lo),
                  a.price
                ) -
                this.multiply(
                  this.multiply(b.number, b.productJson.ou_lo),
                  b.price
                )
              );
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return (
                this.multiply(
                  this.multiply(b.number, b.productJson.ou_lo),
                  b.price
                ) -
                this.multiply(
                  this.multiply(a.number, a.productJson.ou_lo),
                  a.price
                )
              );
            });
            break;
        }
      }
    },
    // 打开产品详情
    openProductDetail(item) {
      this.$router.push({
        path: "/productDetails",
        query: {
          id: item.productNumber
        }
      });
    },
    // 提交订单
    async submitOrder() {
      const selectProducts = this.$refs.multipleTable.selection;
      console.log(selectProducts);
      this.formInfo.currencyType = this.userInfo.currencyType;
      this.formInfo.shareOrderDetails = selectProducts.map(val => {
        return {
          productNumber: val.productNumber,
          productName: val.productJson.name,
          productEName: val.productJson.ename,
          productPrice: val.price,
          productCount: val.number,
          productFeet: val.productJson.bulk_feet,
          productStere: val.productJson.bulk_stere,
          productImage: val.productImgs,
          currencyType: this.userInfo.currencyType,
          outerBoxLo: val.productJson.ou_lo,
          packMethod:
            this.globalLang === "zh-CN"
              ? val.productJson.ch_pa
              : val.productJson.en_pa,
          productInfo: JSON.parse(val.shareProductJson)
        };
      });
      const res = await this.$http.post(
        "/api/WebsiteShare/CreateShareOrder",
        this.formInfo
      );
      const { code, message } = res.data.result;
      if (code === 200) {
        this.$message.success(this.publicLang.submittedSuccessfully);
        this.$router.push("/index/myOrder");
      } else {
        this.$message.error(message);
      }
    },
    // 单元格样式
    idStyle(column) {
      if (column.columnIndex === 0) {
        return "padding: 0;margin:0;";
      }
    },
    // 查看产品详情
    toProductDetail(item) {
      sessionStorage.setItem("currentProductDetails", JSON.stringify(item));
      let { href } = this.$router.resolve({
        path: "/productDetails"
      });
      window.open(href, "_blank");
    },
    // table勾选发生变化事件
    selectionChange(selection) {
      this.selectTableData = selection;
    },
    // 计算总个数量
    calculationTotalGe(list) {
      let number = 0;
      for (let i = 0; i < list.length; i++) {
        number = this.add(
          number,
          this.multiply(list[i].number, list[i].productJson.ou_lo)
        );
      }
      return number;
    },
    // 计算总毛重
    calculationTotalMaozhong(list) {
      let number = 0;
      for (let i = 0; i < list.length; i++) {
        number = this.add(
          number,
          this.multiply(list[i].number, list[i].productJson.gr_we)
        );
      }
      return number;
    },
    // 计算总净重
    calculationTotalJingzhong(list) {
      let number = 0;
      for (let i = 0; i < list.length; i++) {
        number = this.add(
          number,
          this.multiply(list[i].number, list[i].productJson.ne_we)
        );
      }
      return number;
    },
    // 计算总箱数量
    calculationTotalQuantity(list) {
      let number = 0;
      for (let i = 0; i < list.length; i++) {
        number = this.add(number, list[i].number || 0);
      }
      return number;
    },
    // 删除购物车中的某项
    async handleDelete(row) {
      console.log(row);
      const res = await this.$toys.post("/api/RemoveShoppingCart", {
        shareID: this.userInfo.shareId,
        customerRemarks: this.userInfo.loginEmail,
        sourceFrom: "share",
        shopType: "customersamples",
        number: 1,
        currency: "￥",
        Price: 0,
        productNumber: row.productNumber
      });
      console.log(res);
      if (res.data.result.code === 200) {
        this.$store.commit("handlerShopLength", res.data.result.item);
        this.$message.success("删除成功");
        row.isShop = false; // 删除产品列表加购
        this.$root.eventHub.$emit("resetShop", row);
        this.getShoppingCartList();
      } else {
        this.$message.success(res.data.result.msg);
      }
    },
    // 计算总价
    calculationTotalPrice(list) {
      let price = 0;
      for (let i = 0; i < list.length; i++) {
        price = this.add(
          price,
          this.multiply(
            this.multiply(list[i].price, list[i].number),
            list[i].productJson.ou_lo
          )
        );
      }
      return price;
    },
    // 计算总体积材积
    calculationTotalVolume(list) {
      let outerBoxStere = 0,
        outerBoxFeet = 0;
      for (let i = 0; i < list.length; i++) {
        outerBoxStere = this.add(
          outerBoxStere,
          this.multiply(list[i].productJson.bulk_stere, list[i].number)
        );
        outerBoxFeet = this.add(
          outerBoxFeet,
          this.multiply(list[i].productJson.bulk_feet, list[i].number)
        );
      }
      this.myTotalOuterBoxStere = outerBoxStere;
      this.myTotalOuterBoxFeet = outerBoxFeet;
    },
    // 获取购物车信息
    async getShoppingCartList() {
      const res = await this.$toys.post("/api/ShoppingCartList", {
        shareID: this.userInfo.shareId,
        customerRemarks: this.userInfo.loginEmail,
        sourceFrom: "share",
        shopType: "customersamples"
      });
      if (res.data.result.code === 200) {
        this.dataList = res.data.result.item.map((val, i) => {
          const product = JSON.parse(val.productJson);
          val.productJson = product;
          val.index = i + 1;
          return val;
        });
        console.log(this.dataList);
        this.$nextTick(() => {
          this.$refs.multipleTable.toggleAllSelection();
        });
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    // 失去焦点事件修改箱数
    async blurInputValue(e, val) {
      let my = JSON.parse(JSON.stringify(val));
      my.productJson = JSON.stringify(my.productJson);
      my.supplierJson = JSON.stringify(my.supplierJson);
      const res = await this.$toys.post("/api/UpdateShoppingCart", my);
      if (res.data.result.code != 200) {
        this.$message.error(res.data.result.msg);
      }
    },
    // 修改购物车数量
    changeInputNumber(e, row) {
      const re = /^[0-9]+.?[0-9]*/;
      console.log(e.target.value, !re.test(e.target.value));
      if (!re.test(e.target.value)) {
        row.number = 0;
      } else if (e.target.value.length > 5) {
        row.number = e.target.value.slice(0, 5);
      } else if (e.target.value.length > 1 && e.target.value[0] == 0) {
        row.number = e.target.value.slice(1, 5);
      }
    },
    // 点击选中输入框中的所有值
    selectInputValue(e) {
      e.currentTarget.select();
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
  created() {
    document.title = this.myShoppingCartLang.myShoppingCart;
  },
  mounted() {
    // this.dataList = this.shoppingList
    //   ? JSON.parse(JSON.stringify(this.shoppingList))
    //   : [];
    this.formInfo.contactName = this.userInfo.loginEmail;
    this.formInfo.loginEmail = this.userInfo.loginEmail;
    this.getShoppingCartList();
  },
  watch: {
    selectTableData: {
      deep: true,
      handler(list) {
        // 计算总个数
        this.myTotalGe = this.calculationTotalGe(list);
        // 计算总箱数
        this.myTotalQuantity = this.calculationTotalQuantity(list);
        // 计算总毛重
        this.myTotalMaozhong = this.calculationTotalMaozhong(list);
        // 计算总净重
        this.myTotalJingzhong = this.calculationTotalJingzhong(list);
        // 计算总体积材积
        this.calculationTotalVolume(list);
        // 计算总金额
        this.myTotalPrice = this.calculationTotalPrice(list);
      }
    },
    "$store.state.globalLang"(val) {
      if (val) document.title = this.myShoppingCartLang.myShoppingCart;
    }
  },
  computed: {
    myShoppingCartLang() {
      return this.$t("lang.myShoppingCart");
    },
    advancedSearchLang() {
      return this.$t("lang.advancedSearch");
    },
    publicLang() {
      return this.$t("lang.publicLang");
    },
    myOrderLang() {
      return this.$t("lang.myOrder");
    },
    ...mapState(["globalLang", "userInfo"])
  },
  filters: {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.myCartWrap {
  width: 100%;
  margin-top: 20px;
  .myCartBoX {
    max-width: 1240px;
    background-color: #fff;
    margin: 0 auto;
    .wrapTitle {
      height: 60px;
      padding: 0 32px;
      display: flex;
      align-items: center;
      color: #333;
      font-size: 20px;
      font-weight: bold;
      .email {
        font-size: 16px;
        color: #999;
        font-weight: 400;
      }
    }
    .sortBox {
      display: flex;
      align-items: center;
      height: 50px;
      background: #fcfcfc;
      box-sizing: border-box;
      padding: 0 20px 0 40px;
      .sortID {
        cursor: pointer;
        margin-right: 40px;
        .text {
          margin-right: 5px;
        }
        &.active {
          color: #ff760e;
        }
      }
    }
    .tableBoxWrap {
      padding: 0 20px;
      box-sizing: border-box;
    }
    @{deep} .el-table {
      color: #000;
      font-size: 14px;
      .el-input-number {
        .el-input {
          .el-input__inner {
            color: #ff3e3e;
            padding-left: 5px;
            padding-right: 5px;
          }
        }
      }
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
      .tableTotalNumber {
        color: #ff3e3e;
        font-size: 14px;
        margin-top: 5px;
      }
      .el-table-column--selection .cell {
        padding: 0;
      }
      .deleteBtn {
        cursor: pointer;
      }
      .productInformation {
        width: 100%;
        // height: 100px;
        min-height: 100px;
        display: flex;
        justify-content: space-between;
        .imgBox {
          width: 100px;
          height: 100%;
          position: relative;
        }
        .productNameBox {
          flex: 1;
          min-height: 100px;
          text-align: left;
          box-sizing: border-box;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          .name {
            color: #333;
            font-weight: bold;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;

            position: relative;
            line-height: 20px;
            max-height: 40px;
          }
          .fa_no,
          .price {
            color: #ff3e3e;
          }
          .price {
            font-weight: 600;
            .priceText {
              margin-left: 3px;
            }
          }
        }
        .item {
          flex: 1;
          text-align: left;
          box-sizing: border-box;
          padding: 0 10px;
          min-height: 100px;
          display: flex;
          flex-direction: column;
          color: #666666;
          font-size: 12px;
        }
      }
      .tableTotalVolume {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #ff3e3e;
        height: 90px;
        .price {
          font-weight: bold;
          font-size: 16px;
        }
      }
    }
    .statisticsBox {
      width: 100%;
      box-sizing: border-box;
      padding: 20px;
      color: #666;
      font-size: 14px;
      .totalBox {
        height: 50px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 25px;
        justify-content: flex-end;
        .totalWrap {
          margin-left: 40px;
          display: flex;
          align-items: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .totalVolume {
          .changeColor {
            color: #ff3e3e;
            font-size: 18px;
            &.right {
              margin-left: 15px;
            }
          }
        }
        .totalPrice {
          .price {
            color: #ff3e3e;
            font-size: 24px;
            font-weight: bold;
          }
        }
      }
      .contactInfoBox {
        margin-top: 20px;
        box-sizing: border-box;
        padding: 0 25px 10px 25px;
        font-size: 14px;
        color: #606266;
        background: #f5f5f5;
        .title {
          font-size: 16px;
          color: #666;
          font-weight: bold;
          box-sizing: border-box;
          padding: 26px 0;
        }
        @{deep} .userInfoBox {
          .el-form-item {
            color: #606266;
            .el-form-item__label {
              color: #606266;
            }
          }
          .wrapBox {
            display: flex;
            .left,
            .right {
              width: 40%;
            }
            .right {
              flex: 1;
              display: flex;
              .el-form-item {
                flex: 1;
              }
            }
          }
        }
      }
      .submitBox {
        height: 106px;
        padding: 0 43px;
        .submitBtn {
          width: 197px;
          height: 46px;
          // background: #FF760E;
          opacity: 1;
          border-radius: 5px;
          font-size: 18px;
          font-weight: bold;
          margin-top: 25px;
          float: right;
        }
      }
    }
  }
}
.deleteIcon {
  cursor: pointer;
}
.tablePrice {
  color: #ff3e3e;
  .price {
    margin-left: 5px;
  }
}
@{deep} .el-checkbox__input {
  padding: 6px;
  .el-checkbox__inner {
    width: 18px;
    height: 18px;
    &::after {
      left: 6px;
      top: 3px;
    }
  }
}
@{deep} .el-checkbox__input.is-indeterminate {
  .el-checkbox__inner::before {
    top: 7px;
  }
}
</style>
