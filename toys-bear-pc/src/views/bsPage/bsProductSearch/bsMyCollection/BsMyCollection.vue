<template>
  <div class="bsMyCollection">
    <div class="title">我的收藏 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="item">
        <span class="label">关键字：</span>
        <el-input
          type="text"
          size="medium"
          v-model="keyword"
          placeholder="请输入关键词"
          clearable
          @keyup.native.enter="search"
        ></el-input>
      </div>
      <div class="item">
        <span class="label">时间段：</span>
        <el-date-picker
          size="medium"
          value-format="yyyy-MM-ddTHH:mm:ss"
          v-model="dateTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <div class="item">
        <el-button
          @click="search"
          type="primary"
          icon="el-icon-search"
          size="medium"
        >
          搜索
        </el-button>
      </div>
    </div>
    <div class="tableBox">
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="collecTable"
        :header-cell-style="{ backgroundColor: '#f9fafc' }"
      >
        <el-table-column prop="img" label="产品" width="300">
          <template slot-scope="scope">
            <div class="imgBox">
              <el-image
                fit="contain"
                style="width:80px;min-width: 80px;height:60px;"
                :src="scope.row.img"
                :preview-src-list="scope.row.imgUrlList"
              >
                <div
                  @click="handleDetail(scope.row)"
                  slot="placeholder"
                  class="errorImg"
                >
                  <img src="~@/assets/images/imgError.png" alt />
                </div>
                <div
                  @click="handleDetail(scope.row)"
                  slot="error"
                  class="errorImg"
                >
                  <img src="~@/assets/images/imgError.png" alt />
                </div>
              </el-image>
              <div class="productName">
                <div class="name" @click="handleDetail(scope.row)">
                  {{ scope.row.name }}
                </div>
                <div class="factory" @click="toFactory(scope.row)">
                  {{ scope.row.supplierName }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="资料来源">
          <template slot-scope="scope">
            {{ scope.row.exhibitionName }}
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
        <el-table-column label="外箱规格" align="center">
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
        <el-table-column label="装箱量" align="center" width="100">
          <template slot-scope="scope">
            <span> {{ scope.row.in_en }}/{{ scope.row.ou_lo }}(pcs) </span>
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
        <el-table-column prop="price" label="单价" align="center" width="100">
          <template slot-scope="scope">
            <span style="color:#f56c6c">
              {{ scope.row.cu_de + scope.row.price.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="handleDelete(scope.row)"
              >取消收藏</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <center style="padding:20px 0;">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40]"
          background
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
  </div>
</template>

<script>
import eventBus from "@/assets/js/common/eventBus";
export default {
  name: "bsMyCollection",
  data() {
    return {
      keyword: null,
      dateTime: null,
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  methods: {
    // 去厂商
    toFactory(item) {
      const fd = {
        name: item.supplierNumber,
        linkUrl: "/bsIndex/bsVendorQuery",
        component: "bsMyClientsDetail",
        refresh: true,
        noPush: true,
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
      this.$router.push("/bsIndex/bsVendorQuery");
    },
    // 获取列表
    async getCollectList() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.keyword,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/ProductCollectionPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData = res.data.result.item.items;
      }
    },
    // 取消收藏
    async handleDelete(row) {
      this.$confirm("确定要取消该收藏吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post("/api/CreateProductCollection", {
            productNumber: row.productNumber
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "取消收藏",
              type: "success"
            });
            await this.getCollectList();
            eventBus.$emit("resetProducts", this.tableData);
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "取消成功",
            type: "warning"
          });
        });
    },
    //点击跳转详情
    async handleDetail(row) {
      const fd = {
        name: row.productNumber,
        linkUrl: "/bsIndex/bsMyCollection",
        component: "bsProductDetails",
        refresh: true,
        label: row.fa_no || "产品详情",
        value: row
      };
      this.$store.commit("myAddTab", fd);
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getCollectList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getCollectList();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getCollectList();
    }
  },
  created() {},
  mounted() {
    eventBus.$on("resetMyCollection", () => {
      this.getCollectList();
    });
    this.getCollectList();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsMyCollection {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .title {
    height: 55px;
    line-height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
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
  .searchBox {
    height: 76px;
    display: flex;
    align-items: center;
    .item {
      display: flex;
      align-items: center;
      max-width: 290px;
      margin-right: 20px;
      .label {
        width: 58px;
        min-width: 58px;
      }
    }
  }
  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
      .imgBox {
        text-align: left;
        display: flex;
        font-size: 14px;
        .productName {
          // width: 160px;
          cursor: pointer;
          height: 60px;
          margin-left: 15px;
          .name,
          .factory {
            width: 160px;
            max-width: 160px;
            cursor: pointer;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
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
    .errorImg {
      cursor: pointer;
      img {
        width: 80px;
        height: 60px;
      }
    }
  }
}
</style>
