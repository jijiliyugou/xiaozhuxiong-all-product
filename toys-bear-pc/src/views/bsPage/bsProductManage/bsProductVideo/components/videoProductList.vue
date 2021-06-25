<template>
  <div class="videoProductList">
    <!-- 头部 -->
    <div class="top_title">
      <div class="titleLeft">
        <span>视频产品 ({{ totalCount }})</span>
      </div>
      <div class="right">
        <el-button
          type="primary"
          size="medium"
          @click="subSelectProduct"
          icon="el-icon-plus"
        >
          确定已选择({{ selectProductCount }})
        </el-button>
      </div>
    </div>
    <div class="tableBox">
      <bsGridComponent :productList="productList" :productType="true" />
      <!-- 分页 -->
      <center style="padding:20px 0;">
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
      </center>
    </div>
    <div class="footer" v-if="totalCount >= 12">
      <img src="@/assets/images/footerBg.png" alt="" />
    </div>
  </div>
</template>

<script>
import bsGridComponent from "@/components/bsComponents/bsProductSearchComponent/bsGridComponent";
export default {
  components: {
    bsGridComponent
  },
  data() {
    return {
      selectProductList: [],
      selectProductCount: 0,
      productList: [],
      currentPage: 1,
      pageSize: 12,
      totalCount: 0
    };
  },
  methods: {
    // 提交已选产品
    async subSelectProduct() {
      if (this.selectProductCount < 1) {
        this.$common.handlerMsgState({
          msg: "请选择产品",
          type: "danger"
        });
        return false;
      }
      this.$emit("submitSelectProduct", this.selectProductList);
    },
    // 获取厂商所有产品
    async getMyProductPage() {
      const res = await this.$http.post("/api/MyProductPage", {
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      });
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items.map(v => {
          v.isShoppingUpdate = false;
          return v;
        });
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.factoryTotalCount &&
        this.currentPage != 1
      )
        return false;
      this.getMyProductPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getMyProductPage();
    }
  },
  created() {},
  mounted() {
    this.getMyProductPage();
  },
  watch: {
    productList: {
      deep: true,
      handler(list) {
        this.selectProductList = list.filter(val => val.isShoppingUpdate);
        this.selectProductCount = this.selectProductList.length;
      }
    }
  }
};
</script>
<style scoped lang="less">
.top_title {
  height: 55px;
  font-size: 15px;
  font-weight: 700;
  padding-left: 15px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e5e5;
  .titleLeft {
    flex: 1;
  }
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
  margin-top: 20px;
}
.footer {
  padding: 20px;
  background-color: #fff;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
