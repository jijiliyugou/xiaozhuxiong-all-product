<template>
  <div class="bsCertificateManages">
    <div class="title">
      <div class="titleLeft">
        <span>证书管理 ({{ totalCount }})</span>
      </div>
      <div class="right">
        <el-button @click="openDialog" type="primary" size="medium">
          新增证书
        </el-button>
      </div>
    </div>
    <div class="_x"></div>
    <div class="tableBox">
      <Table :table="tableData" />
      <!-- 分页 -->
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
    <el-dialog title="新增证书" :visible.sync="IsCertificateForm" width="500px">
      <el-form
        :model="addCertificateForm"
        :rules="addCertificateRules"
        size="medium"
        ref="refAddCertificateForm"
        label-width="110px"
      >
        <el-form-item label="证书名称" prop="certificateName">
          <el-input v-model="addCertificateForm.certificateName"></el-input>
        </el-form-item>
        <el-form-item label="证书编号" prop="certificateNumber">
          <el-input v-model="addCertificateForm.certificateNumber"></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="effectiveTime">
          <el-date-picker
            v-model="addCertificateForm.effectiveTime"
            type="datetime"
            placeholder="选择有效期"
            style="width:100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="证书图片" prop="name">
          <el-upload
            action=""
            ref="uploadFile"
            :auto-upload="false"
            :on-change="changeFile"
            :http-request="httpFile"
            :accept="globalJson.Json.MessageRestriction[0].itemCode"
          >
          </el-upload>
        </el-form-item>
      </el-form>
      <center style="margin-top:20px">
        <template>
          <el-button type="primary" @click="handerConfig">确定</el-button>
          <el-button
            style="margin-left: 30px;"
            plain
            @click="IsCertificateForm = false"
            >取消</el-button
          >
        </template>
      </center>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/table.vue";
export default {
  name: "bsCertificateManages",
  components: {
    Table
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 12,
      totalCount: 0,
      IsCertificateForm: false,
      addCertificateForm: {},
      addCertificateRules: {
        certificateName: [
          { required: true, message: "请输入证书名称", trigger: "blur" }
        ],
        certificateNumber: [
          { required: true, message: "请输入证书编号", trigger: "blur" }
        ],
        effectiveTime: [
          {
            required: true,
            message: "请选择有效期",
            trigger: "blur"
          }
        ]
      },

      tableData: {
        data: [],
        selection: true,
        showLoading: false,
        isIndex: true,

        columns: [
          {
            prop: "certificateName",
            isHiden: true,
            label: "证书名称"
          },
          {
            prop: "createdBy",
            isHiden: true,
            label: "操作员"
          },
          {
            prop: "effectiveTime",
            isHiden: true,
            label: "有效期",
            render: row => {
              return row.createdOn && row.createdOn.replace(/T/, " ");
            }
          },
          {
            prop: "certificateNumber",
            isHiden: true,
            label: "证书编号"
          },
          {
            prop: "productCount",
            isHiden: true,
            label: "已绑定产品数量"
          },
          {
            prop: "fa_no",
            isHiden: true,
            label: "图片"
          }
        ],
        actions: [
          {
            type: "primary",
            textWrapper() {
              return "编辑";
            },
            disabledWrapper(row) {
              // 条件禁用
              console.log(row);
            },
            methods: row => {
              console.log(row);
            }
          },
          {
            type: "danger",
            disabledWrapper(row) {
              // 条件禁用
              console.log(row, 2222);
            },
            textWrapper() {
              return "删除";
            },
            methods: row => {
              console.log(row);
            }
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    this.GetManuCertificatePage();
  },
  methods: {
    // 获取证书
    async GetManuCertificatePage() {
      const fd = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      };
      const res = await this.$http.post("/api/ManuCertificatePage", fd);
      if (res.data.result.code === 200) {
        // this.productList = res.data.result.item.items;
        // this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 打开新增弹框
    openDialog() {
      console.log(2222);
      this.IsCertificateForm = true;
    },
    // 提交事件
    async submitEvent(url) {
      const res = await this.$http.post("/api/CreateManuProductVideo", {
        productNumbersList: [],
        videoTitle: this.formData.name,
        videoAddress: url
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "新增成功",
          type: "success"
        });
        this.$emit("sub");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 确定新增
    handerConfig() {
      this.$refs.refAddCertificateForm.validate(async valid => {
        if (valid) {
          console.log(this.addCertificateForm);
          const result = await this.successUpload();
          console.log(result, "上传视频返回");
          if (result.data.result.code === 200) {
            const url = result.data.result.object[0].filePath;
            this.submitEvent(url);
          } else {
            this.$common.handlerMsgState({
              msg: result.data.result.message,
              type: "danger"
            });
          }
          // const res = await this.$http.post(
          //   "/api/CreateWebsiteShareInfo",
          //   this.clienFormData
          // );
          // if (res.data.result.code === 200) {
          //   this.shareId = res.data.result.item.id;
          //   this.CreateWebsiteShareAdRelationList();
          //   this.$emit("submit");
          // } else {
          //   this.$common.handlerMsgState({
          //     msg: res.data.result.msg,
          //     type: "danger"
          //   });
          // }
        }
      });
    },
    // 选择证书图片
    changeFile(file) {
      // 当前选中文件的大小
      const rowFileSize = file.size;
      // 图片
      const imgSize = Number(
        this.globalJson.Json.MessageRestriction[7].itemCode
      );
      // 图片大小验证
      if (rowFileSize > imgSize) {
        this.$common.handlerMsgState({
          msg: "图片太大",
          type: "danger"
        });
        return false;
      }
      // this.httpFile(file);
    },
    // 上传视频
    async successUpload() {
      const fd = new FormData();
      fd.append("CompanyNumber", this.userInfo.commparnyList[0].companyNumber);
      fd.append("TypeName", "company");
      fd.append("file", this.formData.file.raw);
      return await this.$http.post("/api/File/UploadProductFile", fd);
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.GetManuCertificatePage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.GetManuCertificatePage();
    }
  }
};
</script>
<style scoped lang="less">
.bsCertificateManages {
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
    .titleLeft {
      flex: 1;
    }
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
  .tableBox {
    padding: 20px 0;
  }
}
</style>
