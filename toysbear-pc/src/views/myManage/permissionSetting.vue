<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
      <!-- 搜索 -->
      <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
        <div class="searchBox">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="关键字查询">
              <el-input
                @keyup.enter.native="search"
                clearable
                v-model="searchForm.keyword"
                placeholder="输入关键字"
                style="width: 90%"
              ></el-input>
            </el-form-item>
            <el-form-item label="时间段搜索">
              <el-date-picker
                v-model="searchForm.dateTile"
                value-format="yyyy-MM-ddTHH:mm:ss"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="—"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="btnList">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="primary" @click="openHall">屏蔽展厅</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 列表 -->
        <div class="tableContent">
          <el-table
            size="mini"
            :data="tableData"
            style="width: 100%"
            :default-sort="{ prop: 'date', order: 'descending' }"
          >
            <el-table-column
              prop="shieldName"
              label="展厅名称"
            ></el-table-column>
            <el-table-column
              prop="shieldNumber"
              label="展厅编号"
            ></el-table-column>
            <el-table-column
              prop="createdOn"
              label="屏蔽时间"
              sortable
              align="center"
            >
              <template slot-scope="scope">
                {{
                  scope.row.createdOn && scope.row.createdOn.replace(/T/g, " ")
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-button
              style="margin-right:10px;"
              size="mini"
              type="danger"
              @click="openEdit(scope.row)"
              >删除</el-button
            > -->
                <el-popconfirm
                  title="确定要删除此展厅的屏蔽设置吗？"
                  @onConfirm="handleDelete(scope.row)"
                >
                  <el-button size="mini" slot="reference" type="danger"
                    >删除</el-button
                  >
                </el-popconfirm>
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
        </div>
      </div>
      <!-- <div style="maxWidth:1200px;minWidth:800px;margin:0 auto;">
    </div> -->
      <!-- 选择屏蔽展厅dialog -->
      <el-dialog
        title="选择展厅"
        :visible.sync="addHallDialog"
        destroy-on-close
        width="30%"
      >
        <el-form ref="addVersionForm" label-width="100px" :model="FormData">
          <el-form-item label="请选择展厅" prop="shieldNumber">
            <el-select v-model="FormData.shieldOption" placeholder="请选择展厅">
              <el-option
                v-for="item in hallList"
                :key="item.companyNumber"
                :label="item.companyName"
                :value="JSON.stringify(item)"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <center>
            <template>
              <el-button type="primary" @click="subProcessingLog"
                >提 交</el-button
              >
              <el-button type="danger" @click="addHallDialog = false"
                >取 消</el-button
              >
            </template>
          </center>
        </el-form>
      </el-dialog>
    </el-main>
    <el-footer style="padding:0;" height="162px">
      <bsFooter></bsFooter>
    </el-footer>
  </el-container>
</template>

<script>
import bsTop from "@/components/BsTop";
import bsFooter from "@/components/oldFooter";
export default {
  components: { bsTop, bsFooter },
  data() {
    return {
      hallList: [],
      isUpLoad: false,
      addHallDialog: false,
      FormData: {
        shieldOption: null
      },
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      editLogRules: {
        platForm: [
          { required: true, message: "请选择终端", trigger: "change" }
        ],
        vesion: [
          { required: true, message: "请输入版本号", trigger: "blur" },
          { min: 1, max: 9999, message: "请输入版本号", trigger: "blur" }
        ],
        fileUrl: [
          { required: true, message: "请输入链接地址", trigger: "blur" },
          { min: 1, max: 9999, message: "请输入链接地址", trigger: "blur" }
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      searchForm: {
        keyword: "",
        state: "",
        dateTile: null
      }
    };
  },
  methods: {
    // 获取展厅列表
    async getOrgCompanyList() {
      const res = await this.$http.post("/api/OrgCompanyList", {
        companyType: "Exhibition"
      });
      if (res.data.result.code === 200) {
        this.hallList = res.data.result.item.filter(
          val =>
            val &&
            val.companyNumber !==
              this.$store.state.userInfo.commparnyList[0].companyNumber
        );
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    // 列表查询
    search() {
      this.currentPage = 1;
      this.getExhibitionShieldPage();
    },
    // 获取屏蔽列表
    async getExhibitionShieldPage() {
      const fd = {
        startTime: this.searchForm.dateTile && this.searchForm.dateTile[0],
        endTime: this.searchForm.dateTile && this.searchForm.dateTile[1],
        keyword: this.searchForm.keyword,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/GetExhibitionShieldPage", fd);
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      }
    },
    // 切换当前页
    currentChange(page) {
      this.currentPage = page;
      this.getExhibitionShieldPage();
    },
    // 切换当前页条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (this.currentPage * pageSize > this.totalCount) return false;
      this.getExhibitionShieldPage();
    },
    // 打开选择屏蔽展厅
    openHall() {
      this.addHallDialog = true;
    },
    // 提交屏蔽
    async subProcessingLog() {
      if (!this.FormData.shieldOption) {
        this.$message.error("请选择展厅");
        return false;
      }
      const fd = JSON.parse(this.FormData.shieldOption);
      const res = await this.$http.post("/api/InsertableExhibitionShield", {
        shieldNumber: fd.companyNumber,
        shieldName: fd.companyName
      });
      if (res.data.result.code === 200) {
        await this.getExhibitionShieldPage();
        this.addHallDialog = false;
        this.$message.success("屏蔽成功");
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    // 删除
    async handleDelete(row) {
      const res = await this.$http.post("/api/DeleteExhibitionShield", {
        id: row.id
      });
      if (res.data.result.code === 200) {
        this.$message.success("删除成功");
        this.getExhibitionShieldPage();
      } else {
        this.$message.error("删除失败,请检查网络！");
      }
    }
  },
  watch: {},
  mounted() {
    this.getExhibitionShieldPage();
    this.getOrgCompanyList();
  },
  created() {}
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.searchBox {
  padding-top: 50px;
  .btnList {
    float: right;
  }
}
.tableContent {
  padding: 20px 0;
}
</style>
