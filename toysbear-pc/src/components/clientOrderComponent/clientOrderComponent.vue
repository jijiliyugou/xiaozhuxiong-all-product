<template>
  <div>
    <el-table size="mini" :data="tableData" style="width:100%;" height="600px">
      <el-table-column
        prop="companyName"
        label="公司名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="contactName"
        label="联系人"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="orderNumber"
        label="订单编号"
        align="center"
      ></el-table-column>
      <el-table-column prop="totalAmount" label="总金额" align="center">
        <template slot-scope="scope">
          <span style="color:#ff0b00;">
            {{ scope.row.totalAmount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalCount"
        label="总箱数"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="totalKuanshu"
        label="总款数"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="totalNumber"
        label="总个数"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            style="margin-right:10px;"
            size="mini"
            type="primary"
            @click="openOrderDetail(scope.row)"
            >查看订单</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <center style="margin-top:20px;">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        background
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        :total="totalCount"
        :current-page.sync="currentPage"
        @current-change="currentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </center>
    <!-- 订单详情dialog -->
    <transition name="el-zoom-in-bottom">
      <el-dialog
        title="订单明细"
        :visible.sync="isOrderDetailDialog"
        append-to-body
        v-if="isOrderDetailDialog"
        top="60px"
        width="80%"
      >
        <clientOrderdetailComponent :shareOrderNumber="shareOrderNumber" />
      </el-dialog>
    </transition>
  </div>
</template>

<script>
import clientOrderdetailComponent from "@/components/clientOrderdetailComponent/clientOrderdetailComponent.vue";
export default {
  components: {
    clientOrderdetailComponent
  },
  props: ["item"],
  data() {
    return {
      shareOrderNumber: null,
      isOrderDetailDialog: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  methods: {
    // 打开订单详情
    openOrderDetail(item) {
      this.shareOrderNumber = item.orderNumber;
      this.isOrderDetailDialog = true;
    },
    // 获取分享客户订单
    async getSearchCompanyShareOrdersPage() {
      const res = await this.$http.post("/api/SearchCompanyShareOrdersPage", {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        shareId: this.item.id,
        customerId: this.item.customerId
      });
      console.log(res);
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    // 切换当前页
    currentChange(page) {
      this.currentPage = page;
      this.getSearchCompanyShareOrdersPage();
    },
    // 切换当前页条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (this.currentPage * pageSize > this.totalCount) return false;
      this.getSearchCompanyShareOrdersPage();
    }
  },
  created() {
    console.log(this.item);
    this.getSearchCompanyShareOrdersPage();
  },
  mounted() {}
};
</script>
<style scoped lang="less"></style>
