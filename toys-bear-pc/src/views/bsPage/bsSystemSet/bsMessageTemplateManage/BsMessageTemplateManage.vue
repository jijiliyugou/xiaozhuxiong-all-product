<template>
  <div class="bsMyCollection">
    <div class="title">消息模板管理</div>
    <div class="searchBox">
      <div class="item" style="width: 250px;">
        <span class="label">角色：</span>
        <el-select
          v-model="messageModel"
          style="width: 100%;"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, i) in [
              { label: '全部', value: '' },
              { label: '展厅', value: 1 },
              { label: '公司', value: 7 }
            ]"
            :key="i"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="medium"
          @click="search"
        >
          搜索
        </el-button>
      </div>

      <div style="flex: 1;text-align: right;">
        <el-button
          class="btnList"
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="openAdd"
          >新增</el-button
        >
      </div>
    </div>
    <div class="tableBox">
      <Table :table="tableData"></Table>
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

    <!-- 新增编辑模板 -->
    <el-dialog
      title="消息类型"
      :visible.sync="addVisible"
      v-if="addVisible"
      class="addMsgDialog"
      width="475px"
    >
      <addMsgTp
        :isEdit="isEdit"
        :configList="configList"
        :currentRow="currentRow"
        @submit="submit"
        @close="close"
      />
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/table";
import addMsgTp from "@/components/bsComponents/bsSystemSetComponent/addMsgTp/addMsgTp";
export default {
  name: "bsMessageTemplateManage",
  components: {
    Table,
    addMsgTp
  },
  data() {
    return {
      currentRow: {},
      addVisible: false,
      isEdit: false,
      configList: [],
      messageModel: "",
      pageSize: 10,
      totalCount: 0,
      tableData: {
        data: [],
        sizeMini: "mini",
        isIndex: true,
        columns: [
          {
            prop: "messageModel",
            label: "角色",
            render(row) {
              if (row.messageModel === 1) {
                return "<span>展厅</span>";
              } else if (row.messageModel === 7) {
                return "<span>公司</span>";
              }
            }
          },
          { prop: "messageExt", label: "消息编号" },
          { prop: "title", label: "消息名称" },
          {
            prop: "itemList",
            label: "参数",
            render: row => {
              return this.filterParameter(row.itemList);
            }
          }
        ],
        actions: [
          {
            classWrapper: () => {
              return "primary";
            },
            textWrapper: () => {
              return "编辑";
            },
            methods: row => {
              //编辑方法
              this.handleEdit(row);
            }
          },
          {
            classWrapper: () => {
              return "danger";
            },
            textWrapper: () => {
              return "删除";
            },
            methods: row => {
              //删除方法
              this.handleDelete(row);
            }
          }
        ]
      }
    };
  },
  methods: {
    // 打开编辑
    handleEdit(row) {
      this.isEdit = true;
      this.currentRow = row;
      this.addVisible = true;
    },
    // 打开新增
    openAdd() {
      this.isEdit = false;
      this.addVisible = true;
    },
    // 提交消息模板
    async submit(data) {
      console.log(data);
      let api = "/api/PushSettings/CreateMessageTeplateSettings",
        msg = "新增成功";
      if (this.isEdit)
        (api = "/api/PushSettings/UpdateMessageTeplateSettings"),
          (msg = "编辑成功");
      const res = await this.$http.post(api, data);
      if (res.data.result.code === 200) {
        this.isEdit = false;
        this.addVisible = false;
        this.$message.success(msg);
        this.getMessageTeplateSettingsByPage();
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    close() {
      this.isEdit = false;
      this.addVisible = false;
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.getMessageTeplateSettingsByPage();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (this.currentPage * pageSize > this.totalCount) return false;
      this.getMessageTeplateSettingsByPage();
    },
    // 筛选参数
    filterParameter(list) {
      if (list && list.length) {
        let str = "";
        for (let i = 0; i < list.length; i++) {
          str += list[i].itemText + "、";
        }
        str = str.substr(0, str.length - 1);
        return str;
      }
    },
    // 删除消息模板
    async handleDelete(row) {
      const res = await this.$http.post(
        "/api/PushSettings/DeleteMessageTeplateSettings",
        { id: row.id }
      );
      if (res.data.result.code === 200) {
        this.$message.success("删除成功");
        this.currentPage = 1;
        this.getMessageTeplateSettingsByPage();
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    //搜索
    search() {
      this.currentPage = 1;
      this.getMessageTeplateSettingsByPage();
    },
    // 获取列表
    async getMessageTeplateSettingsByPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        messageModel: this.messageModel
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post(
        "/api/PushSettings/MessageTeplateSettingsByPage",
        fd
      );
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$message.error(res.data.result.message);
      }
    }
  },
  created() {
    this.getMessageTeplateSettingsByPage();
  },
  mounted() {},
  computed: {}
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
  .btnList {
    float: right;
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
</style>
