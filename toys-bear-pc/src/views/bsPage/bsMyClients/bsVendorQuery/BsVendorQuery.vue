<template>
  <div class="bsVendorQuery">
    <div class="title">
      <div class="left">厂商查询</div>
    </div>
    <div class="searchBox">
      <div class="left">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            type="text"
            size="medium"
            v-model="keyword"
            clearable
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
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
    </div>
    <div class="clientList">
      <div class="titleLeft">
        <p>客户列表</p>
        <p>( {{ totalCount }} )</p>
      </div>
    </div>
    <div class="tableBox">
      <!-- 客户列表 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f9fafc' }"
        @row-click="handleDetail"
      >
        <el-table-column label="厂商">
          <template slot-scope="scope">
            <div class="nameBox">
              <el-avatar
                style="background-color:#E4EFFF;"
                :size="40"
                :src="scope.row.companyLogo"
              >
                <p class="errText">
                  {{ scope.row.linkman }}
                </p>
              </el-avatar>
              <span style="margin-left:10px" class="name">{{
                scope.row.companyName
              }}</span>
              <span class="isMain" v-if="scope.row.isMain"><i>主账号</i></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="ContactsMan"
          label="联系人"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="phoneNumber"
          label="手机"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="phoneNumber"
          label="电话"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="address" label="地址">
        </el-table-column>
        <el-table-column
          align="center"
          prop="ProductCount"
          label="产品数量"
          width="200"
        >
        </el-table-column>
      </el-table>
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
  </div>
</template>

<script>
export default {
  name: "bsVendorQuery",
  data() {
    return {
      totalCount: 0,
      pageSize: 12,
      currentPage: 1,
      keyword: null,
      dateTime: null,
      tableData: []
    };
  },
  methods: {
    async getVendorListPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.keyword,
        OppositeRole: "Supplier"
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/ContactsCompanyListByID", fd);
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      }
    },
    //点击详情
    async handleDetail(e) {
      const fd = {
        name: e.companyName,
        linkUrl: "/bsIndex/bsVendorQuery",
        component: "bsMyClientsDetail",
        refresh: true,
        noPush: true,
        label: e.companyName,
        value: e
      };
      this.$store.commit("myAddTab", fd);
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getVendorListPage();
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getVendorListPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getVendorListPage();
    }
  },
  created() {},
  mounted() {
    this.getVendorListPage();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
@{deep} .el-table {
  color: #666;
  tr {
    cursor: pointer;
  }
  .nameBox {
    width: 300px;
    display: flex;
    align-items: center;
    .el-avatar {
      color: #3368a9;
      img {
        width: 40px;
        min-height: 40px;
      }
    }
  }
}
.bsVendorQuery {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .title {
    height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    .name {
      margin-left: 16px;
    }
    .isMain {
      margin-left: 10px;
      width: 44px;
      height: 18px;
      text-align: center;
      background: #ff4848;
      border-radius: 9px;
      color: #fff;
      font-size: 12px;
      i {
        display: block;
        position: relative;
        top: -3px;
        -webkit-transform: scale(0.7);
        -moz-transform: scale(0.7);
        -ms-transform: scale(0.7);
        transform: scale(0.7);
      }
    }
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      .item {
        display: flex;
        align-items: center;
        max-width: 258px;
        margin-right: 20px;
        .label {
          width: 58px;
          min-width: 58px;
        }
      }
    }
  }
  .clientList {
    min-height: 100%;
    background-color: #fff;
    padding: 0 20px;
    .titleLeft {
      height: 55px;
      font-size: 15px;
      font-weight: 700;
      padding-left: 15px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      align-items: center;
      p:nth-child(2) {
        font-weight: 500;
      }
    }
  }
}
</style>
