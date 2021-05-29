<template>
  <el-container>
    <div class="testBox"></div>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
      <!-- <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;"> -->
      <div style="max-width: 1200px;minWidth:1024px;margin:0 auto;">
        <div class="searchBox">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="角色：">
              <el-select
                clearable
                v-model="messageModel"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in [
                    { itemCode: '', itemText: '全部' },
                    ...configList
                  ]"
                  :key="index"
                  :label="item.itemText"
                  :value="item.itemCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search"
              >查询</el-button
            >
            <el-form-item class="btnList">
              <el-button type="primary" icon="el-icon-plus" @click="openAdd"
                >新增</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="tableContent">
          <el-table :data="dataList" style="width: 100%">
            <!-- :default-sort="{ prop: 'date', order: 'descending' }" -->
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="70"
            ></el-table-column>
            <el-table-column label="角色" width="100" align="center">
              <template slot-scope="scope">
                <div>
                  {{ filterRole(scope.row.messageModel) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="messageExt"
              label="消息编号"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="title" label="消息名称" align="center">
            </el-table-column>
            <el-table-column label="参数" align="center">
              <template slot-scope="scope">
                <div>
                  {{ filterParameter(scope.row.itemList) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  style="margin-right:10px;"
                  @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-popconfirm
                  title="确定要删除此角色吗？"
                  @confirm="handleDelete(scope.row)"
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
        <!-- 新增编辑模板 -->
        <el-dialog
          title="消息类型"
          :visible.sync="addVisible"
          v-if="addVisible"
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
    </el-main>
    <el-footer style="padding:0;" height="162px">
      <bsFooter></bsFooter>
    </el-footer>
  </el-container>
</template>

<script>
import bsTop from "@/components/BsTop";
import bsFooter from "@/components/oldFooter";
import addMsgTp from "./addMsgTp/addMsgTp";
export default {
  components: { bsTop, bsFooter, addMsgTp },
  data() {
    return {
      currentRow: {},
      addVisible: false,
      isEdit: false,
      configList: [],
      dataList: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      messageModel: "",
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
      }
    };
  },
  methods: {
    // 提交消息模板
    async submit(data) {
      console.log(data);
      let api = "/api/PushSettings/CreateMessageTeplateSettings";
      if (this.isEdit) api = "/api/PushSettings/UpdateMessageTeplateSettings";
      const res = await this.$http.post(api, data);
      if (res.data.result.code === 200) {
        this.isEdit = false;
        this.addVisible = false;
        this.$message.success("新增成功");
        this.getMessageTeplateSettingsByPage();
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    close() {
      this.isEdit = false;
      this.addVisible = false;
    },
    search() {
      this.currentPage = 1;
      this.getMessageTeplateSettingsByPage();
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
    // 筛选角色
    filterRole(value) {
      const role = this.configList.find(val => val.itemCode == value);
      return role && role.itemText;
    },
    // 获取系统配置
    async getSystemConfig() {
      const res = await this.$http.post("/api/ServiceConfigurationList", {
        basisParameters: "OrderMessageModel"
      });
      if (res.data.result.code === 200) {
        this.configList = res.data.result.item;
        console.log(this.configList);
      } else {
        this.$message.error(res.data.result.msg);
      }
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
        this.dataList = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$message.error(res.data.result.message);
      }
    }
  },
  created() {
    this.getMessageTeplateSettingsByPage();
    this.getSystemConfig();
  },
  mounted() {}
};
</script>
<style scoped lang="less">
.searchBox {
  padding-top: 50px;
  box-sizing: border-box;
  .btnList {
    float: right;
  }
}
.tableContent {
  padding-bottom: 20px;
  box-sizing: border-box;
}
</style>
