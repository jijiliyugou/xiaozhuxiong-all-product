<template>
  <div class="orderWrap">
    <div class="orderBox">
      <div class="title">
        {{ myOrderLang.orderDetails }}
      </div>
      <div class="titleBox">
        <div class="titleText">{{ myOrderLang.orderInformation }}</div>
        <div class="exportBtn">
          <el-button
            type="warning"
            v-if="userInfo.isExportExcel"
            @click="exportOrder"
            plain
            ><i class="iconfont icon-daochujinruchukou"></i>
            {{ myOrderLang.exportOrder }}
          </el-button>
        </div>
      </div>
      <div class="orderInfo">
        <div class="one">
          <div class="left">
            <div class="keys">{{ myOrderLang.oddNumbers }}：</div>
            <div class="keys">{{ myOrderLang.companyName }}：</div>
          </div>
          <div class="right">
            <div class="values">{{ orderInfo.orderNumber }}</div>
            <div class="values">{{ orderInfo.companyName }}</div>
          </div>
        </div>
        <div class="two">
          <div class="left">
            <div class="keys">{{ myOrderLang.orderTime }}：</div>
            <div class="keys">{{ myOrderLang.contact }}：</div>
          </div>
          <div class="right">
            <div class="values">
              {{ orderInfo.createdOn.replace(/T/, " ") }}
            </div>
            <div class="values">{{ orderInfo.contactName }}</div>
          </div>
        </div>
        <div class="three">
          <div class="left">
            <div class="keys">{{ myOrderLang.email }}：</div>
            <div class="keys">{{ myOrderLang.remark }}：</div>
          </div>
          <div class="right">
            <div class="values">{{ orderInfo.email }}</div>
            <div class="values">{{ orderInfo.remark }}</div>
          </div>
        </div>
      </div>
      <div class="titleBox">
        <div class="titleText">{{ myOrderLang.productInformation }}</div>
        <div class="exportBtn"></div>
      </div>
      <div class="myTable">
        <el-table
          :header-cell-style="{
            backgroundColor: '#F5F5F5',
            color: '#666',
            'font-size': '14px',
            'font-weight': 700,
            padding: '5px 0'
          }"
          :data="tableList"
          id="myTable"
          ref="multipleTable"
          size="medium"
          :empty-text="publicLang.noData"
          tooltip-effect="dark"
          highlight-current-row
        >
          <el-table-column
            width="50"
            type="index"
            :label="myShoppingCartLang.id"
            align="center"
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
                    :src="scope.row.productImage"
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
                        ? scope.row.productName
                        : scope.row.productEName
                    }}
                  </p>
                  <p class="fa_no">{{ scope.row.outFactoryNumber }}</p>
                  <p class="price">
                    <span>{{ scope.row.currencyType }}</span>
                    <span class="priceText">{{ scope.row.productPrice }}</span>
                  </p>
                </div>
                <div class="item">
                  <div class="content">
                    <span>{{ myShoppingCartLang.packingMethod }}：</span>
                    <span>
                      {{ scope.row.packMethod }}
                    </span>
                  </div>
                  <div class="content">
                    <span>{{ myShoppingCartLang.productSpecification }}：</span>
                    <span
                      >{{ scope.row.sampleLenth }} x
                      {{ scope.row.sampleWidth }} x
                      {{ scope.row.sampleHeight }} (CM)</span
                    >
                  </div>
                  <div class="content">
                    <span>{{ myShoppingCartLang.packageSpecification }}：</span>
                    <span
                      >{{ scope.row.innerLenth }} x {{ scope.row.innerWidth }} x
                      {{ scope.row.innerHeight }} (CM)</span
                    >
                  </div>
                  <div class="content">
                    <span>{{ myShoppingCartLang.outerBoxSize }}：</span>
                    <span
                      >{{ scope.row.outerBoxLenth }} x
                      {{ scope.row.outerBoxWidth }} x
                      {{ scope.row.outerBoxHeight }} (CM)</span
                    >
                  </div>
                </div>
                <div class="item">
                  <div class="content">
                    <span>{{ myShoppingCartLang.packingQuantity }}：</span>
                    <span
                      >{{ scope.row.innerEn }} /
                      {{ scope.row.outerBoxLo }} (PCS)</span
                    >
                  </div>
                  <div class="content">
                    <span>{{ myShoppingCartLang.volumeVolume }}：</span>
                    <span
                      >{{ scope.row.productStere }} (CBM) /
                      {{ scope.row.productFeet }} (CUFT)</span
                    >
                  </div>
                  <div class="content">
                    <span>{{ myShoppingCartLang.grossNetWeight }}：</span>
                    <span
                      >{{ scope.row.outerBoxWeight }} /
                      {{ scope.row.outerBoxNetWeight }} (KG)</span
                    >
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="myShoppingCartLang.CTNS"
            align="center"
            prop="productCount"
            width="80"
          >
            <template slot-scope="scope">
              <span style="color: #FF3E3E;">
                {{ scope.row.productCount }}
              </span>
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
                <p class="item">{{ scope.row.totalProductStere }}cbm</p>
                <p class="item">{{ scope.row.totalProductFeet }}cuft</p>
                <p class="item price">
                  <span>{{ scope.row.currencyType }}</span>
                  <span class="priceText">{{ scope.row.totalPrice }}</span>
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 总数 -->
      <div class="totalWrapBox">
        <div class="totalBox" style="border-bottom:1px solid #e9e9e9;">
          <!-- 总体积 -->
          <div class="totalWrap totalVolume">
            {{ myShoppingCartLang.totalVolume }}：
            <span class="changeColor left">
              {{ orderInfo.totalStere }}cbm
            </span>
            <span class="changeColor right">
              {{ orderInfo.totalFeet }}cuft
            </span>
          </div>
          <!-- 总净重 -->
          <div class="totalWrap totalVolume">
            {{ myOrderLang.totalGrossNetWeight }}：
            <span class="changeColor">{{ orderInfo.totalGrossWeight }}/</span
            ><span class="changeColor">{{ orderInfo.totalNetWeight }}</span>
            <span class="changeColor">(kg)</span>
          </div>
        </div>
        <div class="totalBox">
          <!-- 总条数 -->
          <div class="totalWrap totalVolume">
            {{ myShoppingCartLang.totalRecords }} ：
            <span class="changeColor">
              {{ orderInfo.totalKuanshu }}
            </span>
          </div>
          <!-- 总箱数 -->
          <div class="totalWrap totalVolume">
            {{ myShoppingCartLang.totalQuantity }} ：
            <span class="changeColor">
              {{ orderInfo.totalCount }}
            </span>
          </div>
          <!-- 总个数 -->
          <div class="totalWrap totalVolume">
            {{ myShoppingCartLang.totalCount }}：
            <span class="changeColor">
              {{ orderInfo.totalNumber }}
            </span>
          </div>
          <!-- 总价 -->
          <div class="totalWrap totalPrice">
            {{ myShoppingCartLang.totalPrice }}：
            <span class="price">{{ userInfo.currencyType }}</span>
            <span style="margin-left:5px;" class="price">
              {{ orderInfo.totalAmount }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    item: {
      type: String
    }
  },
  data() {
    return {
      orderInfo: {},
      keyword: "",
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      tableList: []
    };
  },
  methods: {
    // 导出功能
    exportOrder() {
      this.$http
        .post(
          "/api/WebsiteShare/ExportOrderDetailToExcel",
          {
            shareOrderNumber: this.orderInfo.orderNumber,
            languageType: this.globalLang === "zh-CN" ? 2 : 1
          },
          { responseType: "blob" }
        )
        .then(res => {
          const fileName = this.orderInfo.companyName
            ? this.orderInfo.companyName + "_" + this.getCurrentTime() + ".xlsx"
            : this.getCurrentTime() + ".xlsx";
          const blob = res.data;
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容IE
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            // 兼容Google及fireFox
            const link = document.createElement("a");
            link.style.display = "none";
            link.download = fileName;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link.href); // 释放URL 对象
            document.body.removeChild(link);
          }
        });
    },
    // 获取年月日时分秒
    getCurrentTime() {
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      return (
        yy.toString() +
        (mm < 10 ? "0" + mm : mm.toString()) +
        (dd < 10 ? "0" + dd : dd.toString()) +
        (hh < 10 ? "0" + hh : hh.toString()) +
        mf.toString() +
        ss.toString()
      );
    },
    // 获取订单详情
    async getSearchShareOrderDetailsPage() {
      const res = await this.$http.get(
        "/api/WebsiteShare/SearchShareOrderDetails",
        {
          params: {
            shareOrderNumber: this.orderInfo.orderNumber
          }
        }
      );
      const { code, data, message } = res.data.result;
      if (code === 200) {
        this.tableList = data;
        console.log(this.tableList);
        this.totalCount = data.totalCount;
      } else {
        this.$message.error(message);
      }
    },
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
    // 打开产品详情
    openProductDetail(item) {
      item.imageUrls = [item.productImage];
      window.sessionStorage.setItem(
        "currentProductDetails",
        JSON.stringify(item)
      );
      let { href } = this.$router.resolve({
        path: "/productDetails"
      });
      window.open(href, "_blank");
    },
    // 计算总体积材积
    myTotalVolume(list) {
      let outerBoxStere = 0,
        outerBoxFeet = 0;
      for (let i = 0; i < list.length; i++) {
        outerBoxStere = this.add(
          outerBoxStere,
          this.multiply(list[i].productStere, list[i].productCount)
        );
        outerBoxFeet = this.add(
          outerBoxFeet,
          this.multiply(list[i].productFeet, list[i].productCount)
        );
      }
      return outerBoxStere + "(cbm) " + outerBoxFeet + "(cuft)";
    }
  },
  created() {
    this.orderInfo = JSON.parse(this.item);
  },
  mounted() {
    this.getSearchShareOrderDetailsPage();
  },
  computed: {
    advancedSearchLang() {
      return this.$t("lang.advancedSearch");
    },
    publicLang() {
      return this.$t("lang.publicLang");
    },
    myOrderLang() {
      return this.$t("lang.myOrder");
    },
    myShoppingCartLang() {
      return this.$t("lang.myShoppingCart");
    },
    ...mapState(["globalLang"]),
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.orderWrap {
  margin-top: 20px;
  width: 100%;
  .orderBox {
    width: 1240px;
    margin: 0 auto;
    padding: 0 23px;
    box-sizing: border-box;
    background-color: #fff;
    .title {
      padding: 20px 0;
      color: #333;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid #e9e9e9;
    }
    .titleBox {
      padding: 20px 0;
      color: #666;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .exportBtn {
        font-size: 14px;
        font-weight: 400;
        line-height: 55px;
        color: #ff760e;
        cursor: pointer;
        .el-button {
          width: 139px;
          height: 34px;
          border: 1px solid #ff760e;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .iconfont {
          margin-right: 10px;
        }
      }
    }
    .orderInfo {
      height: 130px;
      border: 1px solid #e9e9e9;
      font-size: 14px;
      display: flex;
      box-sizing: border-box;
      align-items: center;
      justify-content: space-between;
      .one,
      .two,
      .three {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        .left,
        .right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #333;
          .keys,
          .values {
            height: 20px;
            margin-top: 10px;
          }
        }
        .left {
          color: #999;
          .keys {
            text-align: right;
          }
        }
      }
    }
    .myTable {
      border: 1px solid #e9e9e9;
      @{deep} .el-table {
        color: #000;
        font-size: 14px;
        .el-input-number {
          .el-input {
            .el-input__inner {
              color: #ff3e3e;
            }
          }
        }
        .el-table-column--selection .cell {
          padding: 0;
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
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2; /* 这里是超出几行省略 */
              overflow: hidden;
              color: #333;
              font-weight: bold;
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
    }
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
  }
}
</style>
