<template>
  <div class="bsPushSettings">
    <div class="title">
      <div class="left">推送设置 ({{ totalCount }})</div>
      <div class="right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="medium"
          @click="openAddLanguage"
        >
          新增常用语
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="tableBox">
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="collecTable"
        :header-cell-style="{ backgroundColor: '#f9fafc' }"
      >
        <el-table-column prop="sort" label="排序" width="100"></el-table-column>
        <el-table-column prop="title" label="主题"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="200"
        >
          <el-button
            size="mini"
            type="primary"
            @click="openEdit(scope.row)"
            slot="reference"
            >编辑</el-button
          >
          <template slot-scope="scope">
            <el-popconfirm
              style="margin-left: 10px;"
              title="确定要删除此消息吗？"
              @confirm="handleDelete(scope.row)"
            >
              <el-button size="mini" type="warning" @click.stop slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
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
    <!-- 新增编辑推送常用语dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addLangDialog"
      v-if="addLangDialog"
      width="50%"
    >
      <bsAddOfferFormulaLang
        :editRow="editRow"
        :isEdit="isEdit"
        @submit="submit"
        @close="close"
      />
    </el-dialog>
  </div>
</template>

<script>
import bsAddOfferFormulaLang from "@/components/bsComponents/bsPersonalManageComponent/bsAddOfferFormulaLang";
export default {
  name: "bsPushSettings",
  components: {
    bsAddOfferFormulaLang
  },
  data() {
    return {
      currentRow: {},
      isEdit: false,
      editRow: {},
      dialogTitle: "新增常用语",
      addLangDialog: false,
      totalCount: 0,
      pageSize: 10,
      currentPage: 10,
      tableData: []
    };
  },
  methods: {
    async getPushSettingsPage() {
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
      const res = await this.$http.post("/api/PushSettings/ListByPage", { fd });
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      }
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getPushSettingsPage();
    },
    // 提交新增或编辑
    async submit(form) {
      const res = await this.$http.post("/api/PushSettings/Create", form);
      if (res.data.result.code === 200) {
        this.close();
        this.$common.handlerMsgState({
          msg: "新增成功",
          type: "success"
        });

        this.getPushSettingsPage();
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 关闭新增或编辑
    close() {
      this.addLangDialog = false;
    },
    // 打开新增推送
    openAddLanguage() {
      this.dialogTitle = "新增常用语";
      this.isEdit = false;
      this.addLangDialog = true;
    },
    // 打开编辑推送
    openEdit(row) {
      this.currentRow = row;
      this.isEdit = true;
      this.dialogTitle = "编辑常用语";
      this.addLangDialog = true;
    },
    // 删除推送
    async handleDelete(row) {
      const res = await this.$http.post("/api/PushSettings/Delete", {
        id: row.id
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "删除成功",
          type: "success"
        });
        this.getPushSettingsPage();
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
    }
  },
  created() {},
  mounted() {
    this.getPushSettingsPage();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsPushSettings {
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
    .right {
      .whiteCart {
        display: inline-block;
        vertical-align: bottom;
        width: 14px;
        height: 14px;
        background: url("~@/assets/images/whiteCart.png") no-repeat center;
        background-size: contain;
        margin-right: 10px;
      }
    }
  }
}
</style>
