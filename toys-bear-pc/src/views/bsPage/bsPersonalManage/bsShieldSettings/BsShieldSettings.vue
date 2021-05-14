<template>
  <div class="bsShieldSettings">
    <div class="title">屏蔽设置 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="item">
        <span class="label">关键字：</span>
        <el-input
          v-focus
          type="text"
          size="medium"
          v-model="searchForm.keyword"
          clearable
          placeholder="请输入关键词"
          @keyup.native.enter="search"
        ></el-input>
      </div>
      <div class="item date">
        <span class="label">时间段：</span>
        <el-date-picker
          size="medium"
          value-format="yyyy-MM-ddTHH:mm:ss"
          v-model="searchForm.dateTime"
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
      <div class="item" :style="{ marginLeft: 'auto' }">
        <el-button
          @click="add(true)"
          type="primary"
          icon="el-icon-plus"
          size="medium"
        >
          新增屏蔽展厅
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
        <el-table-column label="序号" type="index" align="center" width="70">
        </el-table-column>
        <el-table-column prop="shieldName" label="展厅名称" min-width="180">
        </el-table-column>
        <el-table-column
          prop="hallNumber"
          label="展厅编号"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column label="屏蔽时间" align="center" min-width="150">
          <template slot-scope="scope">
            <span>
              {{ scope.row.createdOn && scope.row.createdOn.replace(/T/, " ") }}
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
            <el-button size="mini" type="danger" @click="del(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <center style="padding: 20px 0">
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
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        title="选择屏蔽展厅"
        class="exportOrder"
        v-if="isAddDialog"
        :visible.sync="isAddDialog"
        width="700px"
        top="32vh"
      >
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
          class="add_hall_dialog"
        >
          <el-form-item label="选择展厅">
            <el-select
              v-model="form.shieldNumber"
              filterable
              placeholder=""
              :style="{ width: '100%' }"
              @change="changeHall"
            >
              <el-option
                :label="item.companyName"
                :value="item.companyNumber"
                v-for="(item, index) in hallList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="add_hall_button">
              <el-button
                type="primary"
                @click="addHall"
                :style="{ width: '150px' }"
                size="mini"
                >保存</el-button
              >
              <el-button
                :style="{ width: '150px' }"
                size="mini"
                @click="add(false)"
                >取消</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "bsShieldSettings",
  components: {},
  data() {
    return {
      staffList: [],
      isAddDialog: false,
      orderRow: {},
      searchForm: {
        keyword: null,
        fromCompanyName: null,
        staffId: null,
        messageExt: null,
        readStatus: "-1",
        dateTime: null
      },
      tableData: [],
      totalCount: 0,
      pageSize: 99999,
      currentPage: 1,
      form: {
        shieldName: null,
        shieldNumber: null
      },
      hallList: []
    };
  },
  methods: {
    // 新增展厅屏蔽弹窗
    add(value) {
      this.isAddDialog = value;
    },
    // 导出
    exportOrder(row) {
      this.orderRow = row;
      this.exportTemplateDialog = true;
    },
    // 获取列表
    async getTableDataList() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyWord: this.searchForm.keyword,
        startTime: this.searchForm.dateTime && this.searchForm.dateTime[0],
        endTime: this.searchForm.dateTime && this.searchForm.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/GetExhibitionShieldPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData = res.data.result.item.items;
      }
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getTableDataList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getTableDataList();
    },
    //选择展厅change
    changeHall(value) {
      let obj = {};
      obj = this.hallList.find(item => {
        //遍历list的数据
        return item.companyNumber === value; //筛选出匹配数据
      });
      this.form.shieldName = obj.companyName;
    },
    //新增展厅屏蔽
    async addHall() {
      const fd = {
        ...this.form
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/InsertableExhibitionShield", fd);
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "屏蔽成功",
          type: "success"
        });
        this.isAddDialog = false;
        this.form = {
          shieldName: null,
          shieldNumber: null
        };
        this.getTableDataList();
      }
    },
    //确认是否删除
    del(id) {
      this.$confirm("是否删除？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.delHall(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消成功！"
          });
        });
    },
    //删除展厅屏蔽
    async delHall(id) {
      const fd = {
        id: id
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/DeleteExhibitionShield", fd);
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "删除屏蔽成功",
          type: "success"
        });
        this.getTableDataList();
      }
    },
    //获取展厅数据
    async getHallList() {
      const fd = {
        companyType: "Exhibition"
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/OrgCompanyList", fd);
      if (res.data.result.code === 200) {
        this.hallList = res.data.result.item;
        if (this.hallList.length) {
          var newArr = this.hallList.filter(
            item =>
              item.id !=
              (this.userInfo.commparnyList &&
                this.userInfo.commparnyList[0]["commparnyId"])
          );
          this.hallList = newArr;
        }
        this.getTableDataList();
      }
    }
  },
  created() {
    this.getHallList();
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsShieldSettings {
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
      max-width: 200px;
      margin-right: 20px;
      &.date {
        min-width: 300px;
      }
      .label {
        width: 70px;
        min-width: 70px;
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
          width: 190px;
          height: 60px;
          margin-left: 15px;
          .name,
          .factory {
            width: 190px;
            max-width: 190px;
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
      img {
        width: 80px;
        height: 60px;
      }
    }
  }
}
@{deep} .exportOrder {
  .el-dialog__body {
    padding: 0;
  }
  .add_hall_dialog {
    padding: 20px;
    .add_hall_button {
      margin-left: 100px;
    }
  }
}
</style>
