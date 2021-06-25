<template>
  <div class="relevanceSiteDialog">
    <div class="head">
      <div class="left">
        <el-button
          size="medium"
          @click="deleteRelevanceSite"
          :disabled="
            $refs.multipleTable && $refs.multipleTable.selection.length < 1
          "
          style="margin:0 5px"
          >批量删除</el-button
        >
        <el-button
          size="medium"
          @click="openisBatchUpdateDialog"
          :disabled="
            $refs.multipleTable && $refs.multipleTable.selection.length < 1
          "
          >批量修改链接</el-button
        >
      </div>
      <div class="right">
        <el-button @click="openIsSelectReDialog" type="primary" size="medium"
          >+ 添加关联站点</el-button
        >
      </div>
    </div>
    <el-table
      size="small"
      height="550px"
      ref="multipleTable"
      :data="relevanceSiteDialogData"
      @selection-change="handleSelectionChange"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="{ backgroundColor: '#f9fafc' }"
    >
      <el-table-column type="selection" align="center" width="50">
      </el-table-column>
      <el-table-column label="序号" type="index" align="center" width="50">
      </el-table-column>
      <el-table-column
        prop="customerName"
        label="站点/客户"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.webName }}/{{ scope.row.customerName }}
        </template>
      </el-table-column>
      <el-table-column prop="linkUrl" label="广告链接地址" align="center">
        <template slot-scope="scope">
          <el-input
            @blur="handleUpdataAdvertising(scope.row, scope.$index)"
            v-model="scope.row.linkUrl"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <div class="handle">
            <div class="delete" @click="handleDeleteAdvertising(scope.row)">
              删除
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 选择关联站点弹框 -->
    <el-dialog
      title="选择关联站点"
      :visible.sync="isSelectReDialog"
      append-to-body
      width="550px"
      class="isSelectReDialogBoby"
    >
      <div class="head">
        <div class="item">
          <span class="label">关键词：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            v-model="title"
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
      <el-table
        size="small"
        height="400px"
        ref="selectTableDataRef"
        :data="selectTableData"
        @selection-change="selectTableDataChange"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f9fafc' }"
      >
        <el-table-column
          style=" display: block;"
          type="selection"
          align="center"
          width="50"
        >
        </el-table-column>
        <el-table-column label="序号" type="index" align="center" width="50">
        </el-table-column>
        <el-table-column prop="webName" label="站点" align="center" width="180">
        </el-table-column>

        <el-table-column prop="customerName" label="客户" align="center">
        </el-table-column>
      </el-table>
      <center style="margin-top:20px">
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            :disabled="
              $refs.selectTableDataRef &&
                $refs.selectTableDataRef.selection.length < 1
            "
            @click="handelSelect"
            >确 定</el-button
          >
          <el-button @click="isSelectReDialog = false">取 消</el-button>
        </span>
      </center>
    </el-dialog>
    <!-- 批量修改链接 -->
    <el-dialog
      title="批量修改链接"
      :visible.sync="isBatchUpdateDialog"
      append-to-body
      width="550px"
      class="isSelectReDialogBoby"
    >
      <div class="head">
        <div class="batch">
          <span class="label">广告链接地址：</span>
          <el-input
            type="text"
            size="medium"
            v-model="linkUrl"
            clearable
            @keyup.native.enter="search"
          ></el-input>
        </div>
      </div>
      <center>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handelBatchUpdateDialog"
            >确 定</el-button
          >
          <el-button @click="isBatchUpdateDialog = false">取 消</el-button>
        </span>
      </center>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "relevanceSiteDialog",
  props: {
    relevanceSiteDialogData: {
      type: Array
    },
    itemData: {
      type: Object
    }
  },
  data() {
    return {
      title: "",
      linkUrl: "",
      multipleSelection: [],
      selectTableDataChange: [],
      selectTableData: [],
      isSelectReDialog: false,
      isBatchUpdateDialog: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 删除单个广告关联
    async handleDeleteAdvertising(val) {
      let idList = [];
      idList.push(val.id);
      const res = await this.$http.post("/api/DeleteWebsiteShareAdRelation", {
        idList
      });
      if (res.data.result.code === 200) {
        this.$emit("GetWebsiteShareAdRelationList", this.itemData.id);
        this.$common.handlerMsgState({
          msg: "删除成功",
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: "删除失败",
          type: "danger"
        });
      }
    },
    // 全选已关联站点
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    deleteRelevanceSite() {
      this.$confirm("确认删除选中关联站点？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const selectProducts = this.$refs.multipleTable.selection;
          let idList = [];
          idList = selectProducts.map(val => val.id);
          const res = await this.$http.post(
            "/api/DeleteWebsiteShareAdRelation",
            { idList }
          );
          if (res.data.result.code === 200) {
            this.$emit("GetWebsiteShareAdRelationList", this.itemData.id);
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
          } else {
            this.$common.handlerMsgState({
              msg: "删除失败",
              type: "danger"
            });
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "已取消删除",
            type: "warning"
          });
        });
    },
    // 搜索
    search() {
      this.GetWebsiteShareList();
    },
    // 查询所有站点与客户
    async GetWebsiteShareList() {
      const fd = {
        title: this.title
      };
      const res = await this.$http.post("/api/GetWebsiteShareList", fd);
      if (res.data.result.code === 200) {
        // this.selectTableData = res.data.result.item;
        let idList = this.relevanceSiteDialogData.map(item => item.shareId);
        this.selectTableData = res.data.result.item.filter(
          item => !idList.includes(item.id)
        );
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 打开添加关联站点
    openIsSelectReDialog() {
      this.GetWebsiteShareList();
      this.isSelectReDialog = true;
    },
    // 确定选择关联站点
    async handelSelect() {
      const selectProducts = this.$refs.selectTableDataRef.selection;
      console.log(selectProducts);
      let relations = [];
      for (let i = 0; i < selectProducts.length; i++) {
        relations.push({
          shareId: selectProducts[i].id,
          linkUrl: this.itemData.defaultLinkUrl,
          sort: i
        });
      }
      const fd = {
        adId: this.itemData.id,
        relations: relations
      };
      const res = await this.$http.post(
        "/api/CreateWebsiteShareAdRelationListByAdId",
        fd
      );
      if (res.data.result.code === 200) {
        this.isSelectReDialog = false;
        this.$emit("GetWebsiteShareAdRelationList", this.itemData.id);
        this.$common.handlerMsgState({
          msg: "关联站点成功",
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    //打开修改批量链接
    openisBatchUpdateDialog() {
      this.isBatchUpdateDialog = true;
    },
    // 批量修改链接
    handelBatchUpdateDialog() {
      const selectProducts = this.$refs.multipleTable.selection;
      let relations = [];
      for (let i = 0; i < selectProducts.length; i++) {
        relations.push({
          id: selectProducts[i].id,
          linkUrl: this.linkUrl,
          sort: i
        });
      }
      const fd = {
        type: 1,
        adId: this.itemData.id,
        relations: relations
      };
      this.UpdateWebsiteShareAdRelation(fd);
    },
    //修改链接接口
    async UpdateWebsiteShareAdRelation(fd) {
      const res = await this.$http.post(
        "/api/UpdateWebsiteShareAdRelation",
        fd
      );
      if (res.data.result.code === 200) {
        this.isBatchUpdateDialog = false;
        this.$emit("GetWebsiteShareAdRelationList", this.itemData.id);
        this.$common.handlerMsgState({
          msg: "修改链接成功",
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 编辑input
    handleUpdataAdvertising(item, index) {
      let relations = [];
      relations.push({
        id: item.id,
        linkUrl: item.linkUrl,
        sort: index
      });

      const fd = {
        type: 1,
        adId: this.itemData.id,
        relations: relations
      };
      this.UpdateWebsiteShareAdRelation(fd);
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.relevanceSiteDialog {
  padding-bottom: 15px;
  @{deep} .el-table__header-wrapper .el-checkbox {
    display: block;
    font-size: 13px;
  }
  .head {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .handle {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .delete {
      color: red;
      width: 30px;
    }
  }
}
</style>
