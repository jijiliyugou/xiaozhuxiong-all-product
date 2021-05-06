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
            <div class="title">产品款数：</div>
            {{ totalCount }}
          </div>
          <div class="item">
            <div class="title">订单编号：</div>
            {{ option.number }}
          </div>
          <div class="item">
            <div class="title">日期：</div>
            {{ option.happenDate.split("T")[0] }}
          </div>
          <div class="item">
            <div class="title">厂商数量：</div>
            {{ option.supplierCount }}
          </div>
          <div class="item">
            <div class="title">是否导入：</div>
            <el-checkbox style="marginLeft: 10px;" v-model="currentValue">
              是
            </el-checkbox>
          </div>
          <div
            class="item fanhui"
            style="cursor: pointer;"
            @click="$emit('fanhui')"
          >
            <i class="iconfont icon-fanhui" style="margin-right: 5px;"></i>
            返回
          </div>
        </div>
      </div>
    </div>
    <div class="tableBox">
      <div class="tableWrap">
        <el-table
          @sort-change="sort_change"
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
                class="tableImg"
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
            min-width="150"
            label="产品名称"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.pr_na"
                placement="top"
              >
                <div class="productName">
                  {{ scope.row.pr_na + "是的连接方式雷锋精神大幅降低了" }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="client_nu" align="center" label="公司编号">
            <template slot-scope="scope">
              {{ scope.row.client_nu }}
            </template>
          </el-table-column>
          <el-table-column prop="fa_no" align="center" label="货号">
            <template slot-scope="scope">
              {{ scope.row.fa_no }}
            </template>
          </el-table-column>
          <el-table-column prop="ch_pa" align="center" label="包装">
            <template slot-scope="scope">
              {{ scope.row.ch_pa }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ou_lo"
            align="center"
            width="100"
            label="内盒/装箱数"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.in_en }}</span
              >/<span>{{ scope.row.ou_lo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fa_pr" align="center" label="出厂价">
          </el-table-column>
          <el-table-column
            align="center"
            sortable="custom"
            prop="ha_in_qu"
            label="价格"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cu_de }}</span>
              <span>{{ scope.row.ha_in_qu }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品规格" align="center">
            <el-table-column prop="pr_le" label="长" align="center">
              <template slot-scope="scope">
                {{ scope.row.pr_le }}
              </template>
            </el-table-column>
            <el-table-column prop="pr_wi" label="宽" align="center">
              <template slot-scope="scope">
                {{ scope.row.pr_wi }}
              </template>
            </el-table-column>
            <el-table-column prop="pr_hi" label="高" align="center">
              <template slot-scope="scope">
                {{ scope.row.pr_hi }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="包装规格" align="center">
            <el-table-column prop="in_le" label="长" align="center">
              <template slot-scope="scope">
                {{ scope.row.in_le }}
              </template>
            </el-table-column>
            <el-table-column prop="in_wi" label="宽" align="center">
              <template slot-scope="scope">
                {{ scope.row.in_wi }}
              </template>
            </el-table-column>
            <el-table-column prop="in_hi" label="高" align="center">
              <template slot-scope="scope">
                {{ scope.row.in_hi }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="外箱规格" align="center">
            <el-table-column prop="ou_le" label="长" align="center">
              <template slot-scope="scope">
                {{ scope.row.ou_le }}
              </template>
            </el-table-column>
            <el-table-column prop="ou_wi" label="宽" align="center">
              <template slot-scope="scope">
                {{ scope.row.ou_wi }}
              </template>
            </el-table-column>
            <el-table-column prop="ou_hi" label="高" align="center">
              <template slot-scope="scope">
                {{ scope.row.ou_hi }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="bulk_stere" align="center" label="体积">
            <template slot-scope="scope">
              {{ scope.row.bulk_stere }}
            </template>
          </el-table-column>
          <el-table-column prop="bulk_feet" align="center" label="材积">
            <template slot-scope="scope">
              {{ scope.row.bulk_feet }}
            </template>
          </el-table-column>
          <el-table-column prop="gr_we" align="center" label="毛重">
            <template slot-scope="scope">
              {{ scope.row.gr_we }}
            </template>
          </el-table-column>
          <el-table-column prop="ne_we" align="center" label="净重">
            <template slot-scope="scope">
              {{ scope.row.ne_we }}
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            align="center"
            width="200"
            show-overflow-tooltip
            label="备注"
          >
            <template slot-scope="scope">
              <!-- <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.remark"
                placement="top"
              >
                <div class="remarkClass"> -->
              {{ scope.row.remark }}
              <!-- </div>
              </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column prop="ma_na" align="center" label="厂家名称">
            <template slot-scope="scope">
              {{ scope.row.ma_na }}
            </template>
          </el-table-column>
          <el-table-column
            prop="handset"
            align="center"
            width="100"
            label="厂商联系方式"
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row.supplierPhone }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="ma_nu" align="center" label="厂家编号">
            <template slot-scope="scope">
              {{ scope.row.ma_nu }}
            </template>
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
      currentValue: false,
      sortOrder: null,
      sortType: null,
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
    sort_change(column) {
      this.sortOrder = 1;
      switch (column.order) {
        case "descending": // 降序
          this.sortType = 1;
          break;
        case "ascending": // 升序
          this.sortType = 2;
          break;
        default:
          this.sortOrder = null;
          this.sortType = null;
          break;
      }
      this.currentPage = 1;
      this.getOrderDetail();
    },
    // 获取详情列表
    async getOrderDetail() {
      const fd = {
        maxResultCount: this.pageSize,
        skipCount: this.currentPage,
        orderType: this.option.orderType,
        sortOrder: this.sortOrder,
        sortType: this.sortType,
        sampleNumber: this.option.orderNumber
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "")
          delete fd[key];
      }
      const res = await this.$http.post("/api/SampleOrderDetailPageThree", fd);
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
      if (this.currentPage * pages > this.totalCount && this.currentPage != 1)
        return;
      this.getOrderDetail();
    }
  },
  created() {},
  mounted() {
    this.getOrderDetail();
  },
  watch: {
    currentValue(val) {
      console.log(val);
      if (val) {
        const currentSelectItem = {
          number: this.option.orderNumber,
          orderType: this.option.orderType,
          token:
            this.$store.state.userInfo && this.$store.state.userInfo.accessToken
        };
        this.$emit("resetCurrentValue", currentSelectItem);
      } else {
        this.$emit("resetCurrentValue", {
          number: null,
          orderType: null,
          token:
            this.$store.state.userInfo && this.$store.state.userInfo.accessToken
        });
      }
    }
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
      @{deep} .hallLogo {
        width: 80px;
        height: 80px;
        position: relative;
        img {
          width: 80px;
          height: 80px;
          position: absolute;
          left: 0;
          top: 0;
        }
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
      position: relative;
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
          &.fanhui {
            position: absolute;
            right: 18px;
            top: 18px;
            &:hover {
              color: #2d60b3;
            }
          }
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
.remarkClass {
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap; /*不换行*/
  text-overflow: ellipsis; /*超出部分文字以...显示*/
}
.productName {
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap; /*不换行*/
  text-overflow: ellipsis; /*超出部分文字以...显示*/
}
@{deep} .tableImg {
  width: 57px;
  height: 47px;
  position: relative;
  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 57px;
    height: 47px;
  }
}
</style>
