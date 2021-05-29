// 计算方法
export default {
  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  isInteger(obj) {
    return Math.floor(obj) === obj;
  },
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
  // 单个产品总数量
  countTotalQuantity(boxNumber, ou_lo) {
    return this.multiply(boxNumber, ou_lo);
  },
  // 单个产品总价
  countTotalprice(price, ou_lo, boxNumber) {
    return this.multiply(this.multiply(price, ou_lo), boxNumber);
  },

  // 计算总数量
  calculationTotalBox(list) {
    let number = 0;
    for (let i = 0; i < list.length; i++) {
      number = this.add(
        number,
        this.multiply(list[i].productCount, list[i].ou_lo) || 0
      );
    }
    return number;
  }

  // 计算总箱数
  //   countTotalCartons() {
  //     let number = 0;
  //     for (let i = 0; i < this.offerProductList.length; i++) {
  //       number = this.add(number, this.offerProductList[i].boxNumber || 0);
  //     }
  //     return number;
  //   },
};
