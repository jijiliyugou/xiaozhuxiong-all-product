<template>
  <div class="myCartWrap">
    <bsTop />
    <div class="myCartBoX">
      <div class="wrapTitle">
        购物车
        <span class="email" v-if="userInfo.loginEmail"
          >（{{ userInfo.loginEmail }}）</span
        >
      </div>
      <!-- 排序 -->
      <div class="sortBox">
        <p :class="{ sortID: true, active: isID !== 0 }" @click="sortID">
          <span class="text">ID</span>
          <i v-show="isID === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isID === 1"></i>
          <i v-show="isID === 2" class="el-icon-caret-top"></i>
        </p>
        <p :class="{ sortID: true, active: isPrice !== 0 }" @click="sortPrice">
          <span class="text">价格</span>
          <i v-show="isPrice === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isPrice === 1"></i>
          <i v-show="isPrice === 2" class="el-icon-caret-top"></i>
        </p>
        <!-- <p :class="{ sortID: true, active: isCTNS !== 0 }" @click="sortCTNS">
          <span class="text">箱量</span>
          <i v-show="isCTNS === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isCTNS === 1"></i>
          <i v-show="isCTNS === 2" class="el-icon-caret-top"></i>
        </p>
        <p
          :class="{ sortID: true, active: isTotalQTY !== 0 }"
          @click="sortTotalQTY"
        >
          <span class="text">总个数</span>
          <i v-show="isTotalQTY === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isTotalQTY === 1"></i>
          <i v-show="isTotalQTY === 2" class="el-icon-caret-top"></i>
        </p>
        <p
          :class="{ sortID: true, active: isTotalAmount !== 0 }"
          @click="sortTotalAmount"
        >
          <span class="text">总价</span>
          <i v-show="isTotalAmount === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isTotalAmount === 1"></i>
          <i v-show="isTotalAmount === 2" class="el-icon-caret-top"></i>
        </p> -->
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
          id="myTable"
          ref="multipleTable"
          size="medium"
          empty-text="暂无数据"
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
            label="序号"
          ></el-table-column>
          <el-table-column label="产品信息" align="center">
            <template slot-scope="scope">
              <div class="productInformation">
                <div class="imgBox" @click="openProductDetail(scope.row)">
                  <el-image
                    style="width: 100px; height: 100px; cursor: pointer;"
                    fit="contain"
                    :src="scope.row.img"
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
                    {{ scope.row.name }}
                  </p>
                  <p class="fa_no">No.{{ scope.row.fa_no }}</p>
                  <p class="price">
                    <span>{{ userInfo.currencyType }}</span>
                    <span class="priceText">{{ scope.row.price }}</span>
                  </p>
                </div>
                <div class="item">
                  <div class="content">
                    <span>包装方式：</span>
                    <span>
                      {{ scope.row.ch_pa }}
                    </span>
                  </div>
                  <div class="content">
                    <span>产品规格：</span>
                    <span
                      >{{ scope.row.pr_le }} x {{ scope.row.pr_wi }} x
                      {{ scope.row.pr_hi }} (CM)</span
                    >
                  </div>
                  <div class="content">
                    <span>包装规格：</span>
                    <span
                      >{{ scope.row.in_le }} x {{ scope.row.in_wi }} x
                      {{ scope.row.in_hi }} (CM)</span
                    >
                  </div>
                  <div class="content">
                    <span>外箱规格：</span>
                    <span
                      >{{ scope.row.ou_le }} x {{ scope.row.ou_wi }} x
                      {{ scope.row.ou_hi }} (CM)</span
                    >
                  </div>
                </div>
                <div class="item">
                  <div class="content">
                    <span>装箱量：</span>
                    <span
                      >{{ scope.row.in_en }} / {{ scope.row.ou_lo }} (PCS)</span
                    >
                  </div>
                  <div class="content">
                    <span>体积/材积：</span>
                    <span
                      >{{ scope.row.bulk_stere }} (CBM) /
                      {{ scope.row.bulk_feet }} (CUFT)</span
                    >
                  </div>
                  <div class="content">
                    <span>毛重/净重：</span>
                    <span
                      >{{ scope.row.gr_we }} / {{ scope.row.ne_we }} (KG)</span
                    >
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="箱量" align="center" width="100">
            <template slot="header">
              <div style="line-height: normal;">
                <p style="padding:0;line-height: 13px;">
                  总个数
                </p>
              </div>
            </template>
            <template slot-scope="scope">
              <div>
                <div class="tableTotalNumber">
                  {{ scope.row.ou_lo * scope.row.shoppingCount }}
                  <span>PCS</span>
                </div>
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column width="120" align="center">
            <template slot="header">
              <div style="line-height: normal;">
                <p style="padding:0;line-height: 13px;">
                  总体积
                </p>
                <p style="padding:0;line-height: 13px;">
                  总价
                </p>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="tableTotalVolume">
                <div class="item">
                  <p class="item">
                    {{
                      multiply(scope.row.shoppingCount, scope.row.bulk_stere)
                    }}cbm
                  </p>
                  <p class="item">
                    {{
                      multiply(scope.row.shoppingCount, scope.row.bulk_feet)
                    }}cuft
                  </p>
                </div>
                <p class="item price">
                  <span>{{ userInfo.currencyType }}</span>
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
              </div>
            </template>
          </el-table-column> -->
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-popconfirm
                class="deleteBtn"
                title="确定要删除此产品吗？"
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
              总体积：
              <span class="changeColor left">
                {{ myTotalVolume(dataList).bulk_stere }}cbm
              </span>
              <span class="changeColor right">
                {{ myTotalVolume(dataList).bulk_feet }}cuft
              </span>
            </div>
            <!-- 总净重 -->
            <div class="totalWrap totalVolume">
              总毛/净重：
              <span class="changeColor">{{ totalMaozhong() }}/</span
              ><span class="changeColor">{{ totalJingzhong() }}</span>
              <span class="changeColor">(kg)</span>
            </div>
            <div class="totalWrap totalVolume">
              总条数：
              <span class="changeColor">
                {{ dataList.length }}
              </span>
            </div>
          </div>
          <!-- <div class="totalBox" style="border-bottom:1px solid #e9e9e9;"> -->
          <!-- 总条数 -->
          <!-- 总箱数 -->
          <!-- <div class="totalWrap totalVolume">
              总箱数：
              <span class="changeColor">
                {{ myTotalQuantity(dataList) }}
              </span>
            </div> -->
          <!-- 总个数 -->
          <!-- <div class="totalWrap totalVolume">
              总个数：
              <span class="changeColor">
                {{ myTotalGe(dataList) }}
              </span>
            </div> -->
          <!-- 总价 -->
          <!-- <div class="totalWrap totalPrice">
              总价：
              <span class="price">{{ userInfo.currencyType }}</span>
              <span style="margin-left:5px;" class="price">
                {{ myTotalPrice(dataList) }}
              </span>
            </div> -->
          <!-- </div> -->
        </div>
        <!-- 提交信息 -->
        <div class="contactInfoBox">
          <!-- <div class="title">联系信息</div> -->
          <div class="userInfoBox">
            <el-form
              label-position="right"
              label-width="130px"
              :model="formInfo"
            >
              <!-- <div class="wrapBox">
                <div class="left">
                  <el-form-item label="客户名称">
                    <el-input
                      maxlength="30"
                      v-model="formInfo.companyName"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="right">
                  <el-form-item label="联系人">
                    <el-input
                      maxlength="30"
                      v-model="formInfo.contactName"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input
                      maxlength="30"
                      v-model="formInfo.email"
                    ></el-input>
                  </el-form-item>
                </div>
              </div> -->
              <el-form-item label="备注">
                <el-input maxlength="255" v-model="formInfo.remark"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="submitBox">
          <el-popconfirm
            class="deleteBtn"
            title="确定要删除选中的产品吗？"
            @confirm="removeMyShoppingCart"
          >
            <el-button
              slot="reference"
              class="submitBtn"
              :disabled="
                $refs.multipleTable && $refs.multipleTable.selection.length < 1
              "
              type="danger"
            >
              批量删除<span
                v-if="
                  $refs.multipleTable &&
                    $refs.multipleTable.selection.length > 0
                "
              >
                ({{
                  $refs.multipleTable && $refs.multipleTable.selection.length
                }})
              </span>
            </el-button>
          </el-popconfirm>
          <el-button
            type="warning"
            :disabled="
              $refs.multipleTable && $refs.multipleTable.selection.length < 1
            "
            class="submitBtn"
            @click="submitOrder"
            >提 交<span
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
    <bsFooter />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import bsTop from "@/components/BsTop";
import bsFooter from "@/components/oldFooter";
export default {
  components: { bsTop, bsFooter },
  data() {
    return {
      isID: 0,
      isPrice: 0,
      isCTNS: 0,
      isTotalQTY: 0,
      isTotalAmount: 0,
      dataList: [],
      formInfo: {
        remark: "",
        productNumberList: []
      },
      tableList: []
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
      const prices = this.multiply(this.multiply(price, ou_lo), shoppingCount);
      return prices;
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
              return a.shoppingCount - b.shoppingCount;
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return b.shoppingCount - a.shoppingCount;
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
              return a.ou_lo * a.shoppingCount - b.ou_lo * b.shoppingCount;
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return b.ou_lo * b.shoppingCount - a.ou_lo * a.shoppingCount;
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
                a.shoppingCount * a.ou_lo * a.price -
                b.shoppingCount * b.ou_lo * b.price
              );
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return (
                b.shoppingCount * b.ou_lo * b.price -
                a.shoppingCount * a.ou_lo * a.price
              );
            });
            break;
        }
      }
    },
    // 打开产品详情
    openProductDetail(item) {
      window.sessionStorage.setItem(
        "currentProductDetails",
        JSON.stringify(item)
      );
      let { href } = this.$router.resolve({
        path: "/productDetails"
      });
      window.open(href, "_blank");
    },
    // 提交订单
    async submitOrder() {
      const selectProducts = this.$refs.multipleTable.selection;
      this.formInfo.productNumberList = selectProducts.map(
        val => val.productNumber
      );
      // console.log(JSON.stringify(this.formInfo));
      const res = await this.$http.post(
        "/api/CreateCompanySamplelist",
        this.formInfo
      );
      const { code, message } = res.data.result;
      if (code === 200) {
        this.$message.success("提交成功");
        for (let i = 0; i < this.dataList.length; i++) {
          for (let j = 0; j < selectProducts.length; j++) {
            if (
              this.dataList[i].productNumber === selectProducts[j].productNumber
            )
              this.dataList.splice(i, 1);
          }
        }
        this.$store.commit("resetShoppingCart", selectProducts);
        this.$router.push("/sampleManage");
      } else {
        this.$message.error(message);
      }
    },
    // 删除订单
    removeMyShoppingCart() {
      const selectProducts = this.$refs.multipleTable.selection;
      for (let i = 0; i < selectProducts.length; i++) {
        for (let j = 0; j < this.dataList.length; j++) {
          if (
            selectProducts[i].productNumber === this.dataList[j].productNumber
          ) {
            this.dataList.splice(j, 1);
          }
        }
      }
      this.$message.success("删除成功");
      this.$store.commit("resetShoppingCart", selectProducts);
    },
    // 单元格样式
    idStyle(column) {
      if (column.columnIndex === 0) {
        return "padding: 0;margin:0;";
      }
    },
    // 计算总个数量
    myTotalGe() {
      let number = 0;
      for (let i = 0; i < this.dataList.length; i++) {
        number = this.add(
          number,
          this.multiply(this.dataList[i].shoppingCount, this.dataList[i].ou_lo)
        );
      }
      return number;
    },
    // 计算总毛重
    totalMaozhong() {
      let number = 0;
      for (let i = 0; i < this.dataList.length; i++) {
        number = this.add(
          number,
          this.multiply(this.dataList[i].shoppingCount, this.dataList[i].gr_we)
        );
      }
      return number;
    },
    // 计算总净重
    totalJingzhong() {
      let number = 0;
      for (let i = 0; i < this.dataList.length; i++) {
        number = this.add(
          number,
          this.multiply(this.dataList[i].shoppingCount, this.dataList[i].ne_we)
        );
      }
      return number;
    },
    // 计算总箱数量
    myTotalQuantity() {
      let number = 0;
      for (let i = 0; i < this.dataList.length; i++) {
        number = this.add(number, this.dataList[i].shoppingCount || 0);
      }
      return number;
    },
    // 删除购物车中的某项
    handleDelete(row) {
      this.$store.commit("popShopping", row);
      this.dataList.forEach((val, i) => {
        if (val.productNumber === row.productNumber) {
          this.dataList.splice(i, 1);
          this.$message.success("删除成功");
        } else {
          this.$message.success("删除失败，此产品编号意外错误");
        }
      });
    },
    // 计算总价
    myTotalPrice(list) {
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
      return price;
    },
    // 计算总体积材积
    myTotalVolume(list) {
      let bulk_stere = 0,
        bulk_feet = 0;
      for (let i = 0; i < list.length; i++) {
        bulk_stere = this.add(
          bulk_stere,
          this.multiply(list[i].bulk_stere, list[i].shoppingCount)
        );
        bulk_feet = this.add(
          bulk_feet,
          this.multiply(list[i].bulk_feet, list[i].shoppingCount)
        );
      }
      return {
        bulk_stere,
        bulk_feet
      };
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
      this.$store.commit("replaceShoppingCartValueCount", this.dataList);
    },
    // 点击选中输入框中的所有值
    selectInputValue(e) {
      e.currentTarget.select();
    },
    // 点击上下键盘
    nextInput(e) {
      const inputs = document.getElementsByClassName("inputNumber");
      if (inputs.length) {
        if (e.keyCode === 40) {
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
    }
  },
  created() {},
  mounted() {
    this.dataList = this.shoppingList
      ? JSON.parse(JSON.stringify(this.shoppingList))
      : [];
    // 默认全选
    this.$refs.multipleTable.toggleAllSelection();
  },
  computed: {
    ...mapState(["userInfo"]),
    ...mapGetters({
      shoppingList: "myShoppingList"
    })
  },
  filters: {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.myCartWrap {
  width: 100%;
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
        padding: 20px;
        font-size: 14px;
        color: #606266;
        background: #f5f5f5;
        .el-form-item {
          margin: 0;
        }
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
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .submitBtn {
          width: 197px;
          height: 46px;
          opacity: 1;
          border-radius: 5px;
          font-size: 18px;
          font-weight: bold;
        }
        .deleteBtn {
          margin-right: 40px;
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
