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
              return b.index - a.index;
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return a.index - b.index;
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
              return b.price - a.price;
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return a.price - b.price;
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
              return b.number - a.number;
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return a.number - b.number;
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
                this.multiply(b.productJson.ou_lo, b.number) -
                this.multiply(a.productJson.ou_lo, a.number)
              );
            });
            break;
          case 2:
            this.dataList.sort((a, b) => {
              return (
                this.multiply(a.productJson.ou_lo, a.number) -
                this.multiply(b.productJson.ou_lo, b.number)
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
          case 2:
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
          productNumber: val.shareProductJson.productNumber,
          productName: val.shareProductJson.name,
          productEName: val.shareProductJson.ename,
          productPrice: val.shareProductJson.price,
          productCount: Number(val.number),
          productFeet: val.shareProductJson.outerBoxFeet,
          productStere: val.shareProductJson.outerBoxStere,
          productImage: val.productImgs,
          currencyType: this.userInfo.currencyType,
          outerBoxLo: val.shareProductJson.outerBoxLo,
          packMethod:
            this.globalLang === "zh-CN"
              ? val.shareProductJson.packMethod
              : val.shareProductJson.ePackMethod,
          productInfo: val.shareProductJson
        };
      });
      const res = await this.$http.post(
        "/api/WebsiteShare/CreateShareOrder",
        this.formInfo
      );
      const { code, message } = res.data.result;
      if (code === 200) {
        this.$message.success(this.publicLang.submittedSuccessfully);
        const products = selectProducts.map(val => {
          return val.productNumber;
        });
        this.deleteSubmitProduct(products);
        this.$router.push("/index/myOrder");
      } else {
        this.$message.error(message);
      }
    },
    // 删除已提交的
    async deleteSubmitProduct(productNumbers) {
      const res = await this.$toys.post("/api/RemoveShoppingCart", {
        shareID: this.userInfo.shareId,
        customerRemarks: this.customerInfo.id,
        sourceFrom: "share",
        shopType: "customersamples",
        number: 1,
        currency: "￥",
        Price: 0,
        productNumber: productNumbers.toString()
      });
      console.log(res);
      if (res.data.result.code === 200) {
        this.$store.commit("handlerShopLength", res.data.result.item);
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
      const res = await this.$toys.post("/api/RemoveShoppingCart", {
        shareID: this.userInfo.shareId,
        customerRemarks: this.customerInfo.id,
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
            this.multiply(list[i].shareProductJson.price, list[i].number),
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
        customerRemarks: this.customerInfo.id,
        sourceFrom: "share",
        shopType: "customersamples"
      });
      if (res.data.result.code === 200) {
        this.dataList = res.data.result.item.map((val, i) => {
          const shareProduct = JSON.parse(val.shareProductJson);
          const product = JSON.parse(val.productJson);
          val.productJson = product;
          val.shareProductJson = shareProduct;
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
      my.shareProductJson = JSON.stringify(my.shareProductJson);
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
        row.number = Number(e.target.value.slice(1, 5));
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
    ...mapState(["globalLang", "userInfo", "shareInfo", "customerInfo"])
  },
  filters: {}
};
