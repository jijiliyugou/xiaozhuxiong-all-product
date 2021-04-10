<template>
  <div>
    <el-table
      size="mini"
      :data="tableData"
      ref="multipleTable"
      style="width: 100%"
      height="600px"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <!-- <el-table-column prop="companyNumber" label="公司编号" align="center"></el-table-column> -->
      <el-table-column
        prop="email"
        label="登录邮箱"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createdOn"
        label="登录时间"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.createdOn && scope.row.createdOn.replace(/T/g, " ") }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作"  width="200" align="center">
          <template slot-scope="scope">
            <el-button
              style="margin-right:10px;"
              size="mini"
              type="primary"
              @click.stop="openEdit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定要删除这个版本吗？"
              @confirm="handleDelete(scope.row)"
            >
              <el-button size="mini" @click.stop slot="reference" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column> -->
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
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: 0
    };
  },
  methods: {
    // 获取用户访问记录
    async getSearchLoginLogPage() {
      const res = await this.$http.post("/api/SearchLoginLogPage", {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        shareId: this.item.id
      });
      console.log(res);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData = res.data.result.item.items;
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    // 切换当前页
    currentChange(page) {
      this.currentPage = page;
      this.getSearchLoginLogPage();
    },
    // 切换当前页条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (this.currentPage * pageSize > this.totalCount) return false;
      this.getSearchLoginLogPage();
    }
  },
  created() {
    console.log(this.item);
    this.getSearchLoginLogPage();
  },
  mounted() {}
};
</script>
<style scoped lang="less"></style>
