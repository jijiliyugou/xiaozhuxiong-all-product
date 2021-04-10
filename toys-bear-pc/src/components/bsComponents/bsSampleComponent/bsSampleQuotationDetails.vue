<template>
  <div class="bsSampleQuotationDetails">
    <div class="title">报价详情</div>
    <div class="hander">
      <div class="handerTop">
        <div class="flex_t">
          <p>
            报价单号：<span class="pId">{{ itemList.offerNumber }} </span>
          </p>
          <p>
            客户名称：<span>{{ itemList.customerName }} </span>
          </p>
          <p>
            操作员：<span style="color:#2D7FE4">{{ itemList.linkman }} </span>
          </p>
          <p>
            状态：<span
              :style="{
                color: itemList.status == 0 ? '#3368A9' : '#2D7FE4'
              }"
              >{{
                itemList.status == 0
                  ? "未审核"
                  : itemList.status == 1
                  ? "审核通过"
                  : "审核不通过"
              }}
            </span>
          </p>
        </div>
        <div class="flex_b">
          <p>
            报价时间：<span>{{ itemList.createdOn }} </span>
          </p>
          <p>
            报价备注：<span>{{ itemList.title }} </span>
          </p>
        </div>
      </div>
      <div class="handerTab">
        <el-table
          :header-cell-style="{ backgroundColor: '#f9fafc' }"
          :data="handerTabData"
          style="width: 100%"
          row-key="id"
          border
          lazy
        >
          <el-table-column
            align="center"
            prop="offerMethod"
            label="报价方式"
            width="180"
          >
          </el-table-column>
          <el-table-column align="center" prop="profit" label="利润率">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalCost"
            label="总费用"
            width="180"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="exchange"
            label="汇率"
            width="180"
          >
          </el-table-column>
          <el-table-column align="center" prop="decimalPlaces" label="小数位数">
          </el-table-column>

          <el-table-column align="center" prop="cu_deName" label="币种">
          </el-table-column>
          <el-table-column align="center" prop="size" label="每车尺寸">
          </el-table-column>
          <el-table-column
            align="center"
            prop="rejectionMethod"
            label="取舍方式"
          >
          </el-table-column>
          <el-table-column align="center" prop="miniPrice" label="价钱小于">
          </el-table-column>
          <el-table-column
            align="center"
            prop="miniPriceDecimalPlaces"
            label="小数位数"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="bsSampleTable">
      <div class="top">
        <div class="left">报价商品列表({{ tableData.length }})</div>
        <div class="right">
          <el-button @click="exportOrder()" type="warning"> 导出列表</el-button>
        </div>
      </div>
      <div class="tableBox">
        <el-table
          :data="tableData"
          style="width: 100%"
          ref="collecTable"
          :header-cell-style="{ background: '#f1f3f6' }"
        >
          <el-table-column prop="img" label="产品" align="center" width="300">
            <template slot-scope="scope">
              <div class="imgBox">
                <el-image
                  @click.native="goDetails(scope.row)"
                  fit="contain"
                  style="width:80px;height:60px;"
                  :src="scope.row.imageUrl && scope.row.imgUrlList[0]"
                >
                  <div slot="placeholder" class="errorImg">
                    <img src="~@/assets/images/imgError.png" alt />
                  </div>
                  <div slot="error" class="errorImg">
                    <img src="~@/assets/images/imgError.png" alt />
                  </div>
                </el-image>
                <div class="productName">
                  <div class="name" @click="goDetails(scope.row)">
                    {{ scope.row.name }}
                  </div>
                  <div class="factory">
                    <div class="factoryName" @click="toFactory(scope.row)">
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
              {{ scope.row.supplierName }}
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
          <el-table-column
            prop="boxNumber"
            label="箱数"
            align="center"
            width="100"
          >
          </el-table-column>
          <!-- <el-table-column label="箱数" align="center" width="100">
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
          </el-table-column> -->
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
          <el-table-column
            prop="unitPrice"
            label="单价"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <span style="color:#f56c6c">
                {{ scope.row.cu_de + scope.row.unitPrice }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="OfferTotalAmount"
            label="总价"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cu_de }}</span>
              <span style="color:#f56c6c">
                {{
                  priceCount(
                    scope.row.unitPrice,
                    scope.row.ou_lo,
                    scope.row.boxNumber
                  )
                }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="tableBto">
        <div class="right">
          <p class="item">
            <span class="itemTitle">总款数：</span>
            <span>{{ tableData.length }}</span>
          </p>
          <p class="item">
            <span class="itemTitle">总箱数：</span>
            <span>{{ myTotalQuantity(tableData) }}</span>
          </p>
          <p class="item">
            <span class="itemTitle">总体积/总材积：</span>
            <span
              >{{ myTotalVolume(tableData).outerBoxStere }}/{{
                myTotalVolume(tableData).outerBoxFeet
              }}</span
            >
          </p>
          <p class="item">
            <span class="itemTitle">总毛重/总净重：</span>
            <span>{{ totalMaozhong() }}/{{ totalJingzhong() }}(KG)</span>
          </p>
          <p class="item">
            <span class="itemTitle">总金额：</span>
            <span class="price">￥{{ myTotalPrice(tableData) }}</span>
          </p>
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
    </div>
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        title="订单模板"
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        top="60px"
        width="80%"
      >
        <bsExportOrder :options="orderRow" />
      </el-dialog>
    </transition>
  </div>
</template>

<script>
import bsExportOrder from "@/components/commonComponent/exportOrderComponent";
export default {
  name: "bsSampleQuotationDetails",
  components: {
    bsExportOrder
  },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      orderRow: {},
      exportTemplateDialog: false,
      handerTabData: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      itemList: {}
    };
  },
  created() {},

  mounted() {
    this.getProductOfferDetailPage();
    this.getProductOfferNumber();
  },
  methods: {
    //厂商跳转
    toFactory(item) {
      console.log(item);
      const fd = {
        name: item.supplierNumber,
        linkUrl: this.$route.path,
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
      this.$store.commit("myAddTab", fd);
    },
    // 获取该订单报价公式详情
    async getProductOfferNumber() {
      const fd = {
        OfferNumber: this.item.offerNumber
      };
      const res = await this.$http.post("/api/GetProductOfferByNumber", fd);
      if (res.data.result.code === 200) {
        this.handerTabData.push(res.data.result.item);
        this.itemList = res.data.result.item;
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    // 点击产品名字跳转
    goDetails(row) {
      const fd = {
        name: row.productName + row.fa_no,
        linkUrl: "/bsIndex/bsSampleQuotation",
        component: "bsProductDetails",
        refresh: true,
        label: row.fa_no || "产品详情",
        value: row
      };
      console.log(row);
      this.$store.commit("myAddTab", fd);
    },
    // 获取列表
    async getProductOfferDetailPage() {
      const fd = Object.assign(
        { skipCount: 1, maxResultCount: 9999 },
        this.item
      );

      const res = await this.$http.post("/api/ProductOfferDetailPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData = res.data.result.item.items;
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    // 导出找样
    exportOrder() {
      this.orderRow = {
        sampleNumber: this.item.offerNumber,
        name: this.item.customerName,
        api: "/api/ExportSampleOfferToExcel"
      };
      this.exportTemplateDialog = true;
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getVendorListPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getVendorListPage();
    },

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
    // 总数量
    sumPriceCount(boxNumber, ou_lo) {
      return this.multiply(boxNumber, ou_lo);
    },
    // 单个产品总价
    priceCount(unitPrice, ou_lo, boxNumber) {
      return this.multiply(this.multiply(unitPrice, ou_lo), boxNumber);
    },
    // 计算总净重
    totalJingzhong() {
      let number = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        number = this.add(
          number,
          this.multiply(this.tableData[i].boxNumber, this.tableData[i].ne_we)
        );
      }
      return number;
    },
    // 计算总毛重
    totalMaozhong() {
      let number = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        number = this.add(
          number,
          this.multiply(this.tableData[i].boxNumber, this.tableData[i].gr_we)
        );
      }
      return number;
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
    onSubmit() {},
    // 计算总箱数量
    myTotalQuantity() {
      let number = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        number = this.add(number, this.tableData[i].boxNumber || 0);
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
            this.multiply(list[i].unitPrice, list[i].boxNumber),
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
      val.shoppingCount = Number(e.target.value);
      this.$store.commit("replaceShoppingCartValueCount", this.tableData);
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
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsSampleQuotationDetails {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .title {
    height: 50px;
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
  .hander {
    .handerTop {
      padding-top: 26px;
      .flex_t {
        display: flex;
        align-content: center;
        margin-bottom: 18px;
        p {
          width: 235px;
          margin-right: 30px;
          font-weight: 400;
          .pId {
            font-weight: 700;
            font-size: 15px;
          }
        }
      }
      .flex_b {
        display: flex;
        align-content: center;
        p {
          margin-right: 30px;
          width: 235px;
        }
      }
    }
    .handerTab {
      margin-top: 25px;
    }
  }

  .bsSampleTable {
    padding-top: 15px;
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
    .tableBto {
      display: flex;
      align-items: center;
      height: 80px;
      padding-left: 10px;
      box-sizing: border-box;
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
        .el-image {
          cursor: pointer;
        }
        .productName {
          width: 190px;
          height: 60px;
          margin-left: 15px;
          cursor: pointer;
          .name,
          .factory {
            width: 190px;
            max-width: 190px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
            .factoryName {
              cursor: pointer;
            }
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
  }
}
</style>
