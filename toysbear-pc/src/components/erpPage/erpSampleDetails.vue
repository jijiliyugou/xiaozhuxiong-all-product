<template>
  <div class="detailBox">
    <div class="toploaut">
      <div class="left">
        <el-image class="hallLogo" :src="require('@/assets/images/logo.png')">
          <div slot="error" class="image-slot">
            <img
              style="width: 80px; height: 80px"
              :src="option.fromCompanyLogo"
              alt
            />
          </div>
        </el-image>
      </div>
      <div class="right">
        <div class="addrs">{{ option.fromCompanyName }}</div>
        <div class="sampleDetail">
          <div class="item">
            <div class="title">本次代号：</div>
            {{ option.the_nu }}
          </div>
          <div class="item">
            <div class="title">择样数量：</div>
            {{ totalCount }}
          </div>
          <div class="item">
            <div class="title">择样编号：</div>
            {{ option.number }}
          </div>
          <div class="item">
            <div class="title">择样时间：</div>
            {{ option.happenDate.split("T")[0] }}
          </div>
          <div class="item">
            <div class="title">厂商数量：</div>
            {{ tableData | filterTableData }}
          </div>
        </div>
      </div>
    </div>
    <div class="tableBox">
      <div class="tableWrap">
        <el-table
          :header-cell-style="{ backgroundColor: '#2D60B3', color: '#fff' }"
          size="mini"
          :data="tableData"
          height="500"
          style="width: 100%"
        >
          <el-table-column
            fixed="left"
            prop="imgUrl"
            align="center"
            label="图片"
          >
            <template slot-scope="scope">
              <el-image
                style="width: 57px; height: 47px;"
                :preview-src-list="scope.row.imgUrl"
                :src="scope.row.imgUrl && scope.row.imgUrl[0]"
              >
                <div slot="error" class="image-slot">
                  <img
                    style="width: 57px; height: 47px; borderRadius: 50%;"
                    src="~@/assets/images/logo.png"
                    alt
                  />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="pr_na"
            fixed="left"
            align="center"
            label="产品名称"
          >
          </el-table-column>
          <el-table-column prop="client_nu" align="center" label="公司编号">
          </el-table-column>
          <el-table-column prop="fa_no" align="center" label="货号">
          </el-table-column>
          <el-table-column prop="ch_pa" align="center" label="包装">
          </el-table-column>
          <el-table-column prop="ou_lo" align="center" label="装箱量">
          </el-table-column>
          <el-table-column prop="fa_pr" align="center" label="出厂价">
          </el-table-column>
          <el-table-column align="center" prop="ha_in_qu" label="价格">
          </el-table-column>
          <el-table-column label="包装" align="center">
            <el-table-column prop="in_le" label="长" align="center">
            </el-table-column>
            <el-table-column prop="in_wi" label="宽" align="center">
            </el-table-column>
            <el-table-column prop="in_hi" label="高" align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column label="外箱" align="center">
            <el-table-column prop="ou_le" label="长" align="center">
            </el-table-column>
            <el-table-column prop="ou_wi" label="宽" align="center">
            </el-table-column>
            <el-table-column prop="ou_hi" label="高" align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column prop="bulk_stere" align="center" label="体积">
          </el-table-column>
          <el-table-column prop="bulk_feet" align="center" label="材积">
          </el-table-column>
          <el-table-column prop="gr_we" align="center" label="毛重">
          </el-table-column>
          <el-table-column prop="ne_we" align="center" label="净重">
          </el-table-column>
          <el-table-column prop="remark" align="center" label="备注">
          </el-table-column>
          <!-- <el-table-column
          prop="name"
          align="center"
          label="摊位号">
        </el-table-column> -->
          <el-table-column prop="ma_na" align="center" label="厂家名称">
          </el-table-column>
          <el-table-column prop="ma_nu" align="center" label="厂家编号">
          </el-table-column>
        </el-table>
        <div class="erweimaWrap">
          <erweimaComponent />
        </div>
      </div>
      <center class="paginationWrap">
        <el-pagination
          layout="total, sizes, prev, pager, next"
          background
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          @current-change="currentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
  </div>
</template>

<script>
import erweimaComponent from "./erweimaComponent";
export default {
  components: {
    erweimaComponent
  },
  props: ["option"],
  data() {
    return {
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      tableData: []
    };
  },
  filters: {
    filterTableData(list) {
      const newdata = [];
      let i, j;
      for (i = 0; i < list.length; i++) {
        for (j = i + 1; j < list.length; j++) {
          if (list[i].ma_nu === list[j].ma_nu) {
            j = false;
            break;
          }
        }
        if (j) newdata.push(list[i]);
      }
      return newdata.length;
    }
  },
  methods: {
    // 获取详情列表
    async getOrderDetail() {
      const res = await this.$http.post("/api/SampleOrderDetailPage", {
        maxResultCount: this.pageSize,
        skipCount: this.currentPage,
        id: this.option.erpOrderID,
        sampleNumber: this.option.orderNumber
      });
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData = res.data.result.item.items;
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    currentChange(page) {
      this.currentPage = page;
      this.getOrderDetail();
    },
    handleSizeChange(pages) {
      this.pageSize = pages;
      if (this.currentPage * pages > this.totalCount) return;
      this.getOrderDetail();
    }
  },
  created() {},
  mounted() {
    console.log(this.option);
    this.getOrderDetail();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
[v-cloak] {
  display: none;
}
.detailBox {
  width: 1200px;
  margin: 0 auto;
  .toploaut {
    width: 100%;
    height: 110px;
    background-color: #fff;
    margin: 20px 0;
    display: flex;
    .left {
      width: 110px;
      height: 110px;
      padding: 15px;
      box-sizing: border-box;
      .hallLogo {
        width: 80px;
        height: 80px;
      }
    }
    .right {
      flex: 1;
      height: 110px;
      padding: 23px 15px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .addrs {
        color: #333333;
        font-size: 18px;
        font-weight: bold;
      }
      .sampleDetail {
        color: #181818;
        display: flex;
        font-size: 14px;
        .item {
          display: flex;
          margin-right: 40px;
          &:last-of-type {
            margin: 0;
          }
          .title {
            color: #999999;
          }
        }
      }
    }
  }
  .tableBox {
    .tableWrap {
      height: 500px;
      background-color: #fff;
      position: relative;
      .erweimaWrap {
        position: absolute;
        right: -130px;
        bottom: 0px;
      }
    }
    @{deep} .paginationWrap {
      padding: 20px 0;
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #2d60b3;
        color: #fff;
      }
    }
  }
}
</style>
