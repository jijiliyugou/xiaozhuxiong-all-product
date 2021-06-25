import { mapState } from "vuex";
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      orderList: []
    };
  },
  methods: {
    // 导出功能
    exportOrder(orderNumber, companyName) {
      this.$http
        .post(
          "/api/WebsiteShare/ExportOrderDetailToExcel",
          {
            shareOrderNumber: orderNumber,
            languageType: this.globalLang === "zh-CN" ? 2 : 1
          },

          {
            headers: {
              "content-type": "application/json"
            },
            responseType: "blob",
            timeout: 100000000000
          }
        )
        .then(res => {
          console.log(res);
          const fileName = companyName
            ? companyName + "_" + this.getCurrentTime() + ".xlsx"
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
    // 获取订单列表
    async getSearchShareOrdersPage() {
      const res = await this.$http.get(
        "/api/WebsiteShare/SearchShareOrdersPage",
        {
          params: {
            pageIndex: this.currentPage,
            pageSize: this.pageSize
            // loginEmail: this.customerInfo.id
          }
        }
      );
      const { code, data, message } = res.data.result;
      if (code === 200) {
        this.orderList = data.items;
        this.totalCount = data.totalCount;
      } else {
        this.$message.error(message);
      }
    },
    // 去详情页
    toOrderDetail(item) {
      this.$router.push({
        path: "/orderDetail",
        query: { item: JSON.stringify(item) }
      });
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (this.currentPage * pageSize > this.totalCount) return false;
      this.getSearchShareOrdersPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getSearchShareOrdersPage();
    }
  },
  created() {
    document.title = this.myOrderLang.myOrder;
  },
  mounted() {
    this.getSearchShareOrdersPage();
  },
  watch: {
    "$store.state.globalLang"(val) {
      if (val) document.title = this.myOrderLang.myOrder;
    }
  },
  computed: {
    myOrderLang() {
      return this.$t("lang.myOrder");
    },
    publicLang() {
      return this.$t("lang.publicLang");
    },
    ...mapState(["globalLang", "userInfo", "shareInfo", "customerInfo"])
  }
};
