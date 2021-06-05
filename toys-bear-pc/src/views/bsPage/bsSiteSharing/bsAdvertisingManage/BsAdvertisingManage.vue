<template>
  <div class="BsAdvertisingManage">
    <div class="title">广告管理 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="left">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            v-model="keyword"
            clearable
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
        </div>
        <div class="item" v-if="userInfo.userInfo.isMain">
          <span class="label">业务员：</span>
          <el-select
            v-model="userId"
            filterable
            size="medium"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in staffList"
              :key="item.id"
              :label="item.linkman"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
      <el-button
        @click="handleAddAdvertising"
        type="primary"
        icon="el-icon-plus"
        size="medium"
      >
        新增
      </el-button>
    </div>
    <div class="tableBox">
      <Table :table="tableData"></Table>
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
    <!-- 新增弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="isDialog" width="700px">
      <el-form
        ref="formDataRef"
        label-width="100px"
        :rules="rules"
        :model="dialogFromData"
      >
        <el-form-item label="图片标题:" prop="title">
          <el-input
            v-model="dialogFromData.title"
            placeholder="请输入图片标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告图片:" prop="imgUrl">
          <el-upload
            action="api"
            style="width:100%"
            list-type="picture-card"
            ref="upload"
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeAvatarUpload"
            :on-change="changeUpload"
            :on-remove="handleRemove"
            :file-list="editImages"
            accept=".jpg,.png,.JPG,.PNG,"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p class="uploadText">
            图片格式(jpg、png) 内存最大不超过2MB， 尺寸为 : 长1920 x 宽550像素
          </p>
        </el-form-item>
        <el-form-item label="默认链接:" prop="defaultLinkUrl">
          <el-input
            v-model="dialogFromData.defaultLinkUrl"
            placeholder="请输入默认链接"
          ></el-input>
        </el-form-item>
      </el-form>
      <center>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="
              dialogTitle === '新增广告图'
                ? comfirmAddAdvertising()
                : comfirmUpdateAdvertising()
            "
            >确 定</el-button
          >
          <el-button @click="isDialog = false">取 消</el-button>
        </span>
      </center>
    </el-dialog>
    <el-dialog
      :title="dialogRelation"
      :visible.sync="isDialogRelation"
      width="700px"
    >
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Table from "@/components/table";
export default {
  name: "BsAdvertisingManage",
  components: {
    Table
  },
  data() {
    return {
      editImages: [],
      file: null,
      dialogTitle: "",
      dialogRelation: "已关联站点（0）",
      isDialogRelation: false,
      isDialog: false,
      staffList: [],
      userId: null,
      keyword: null,
      dateTime: null,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      dialogFromData: {
        imgUrl: "",
        title: null,
        defaultLinkUrl: null
      },
      rules: {
        title: [{ required: true, message: "请输入图片标题", trigger: "blur" }],
        imgUrl: [
          { required: true, message: "请选择上传图片", trigger: "change" }
        ],
        defaultLinkUrl: [
          { required: true, message: "请输入默认链接", trigger: "blur" },
          { type: "url", message: `请输入正确的url`, trigger: "change" }
        ]
      },
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: true,
        columns: [
          {
            prop: "imgUrl",
            label: "图片",
            elImageUrl: true,
            widht: 200,
            style: "width: 150px; height: 43px; min-width: 82px",
            elImage: row => {
              return row.imgUrl;
            }
          },
          { prop: "title", label: "广告标题" },
          { prop: "createdBy", label: "业务员" },
          { prop: "email", label: "关联站点数" },
          {
            prop: "createdOn",
            label: "登录时间",
            render: row => {
              return row.createdOn.replace(/T.*/, "");
            }
          }
        ],
        btnWidth: 250,
        actions: [
          {
            type: "primary",
            textWrapper() {
              return "编辑";
            },
            methods: row => {
              this.handleUpdate(row);
            }
          },
          // 暂时不做
          // {
          //   type: "success",
          //   textWrapper() {
          //     return "关联站点";
          //   },
          //   methods: row => {
          //     console.log(row);
          //   }
          // },
          {
            type: "danger",
            textWrapper() {
              return "删除";
            },
            methods: row => {
              this.handelDelete(row);
            }
          }
        ]
      }
    };
  },
  methods: {
    // 获取公司下的员工列表
    async getStaffList() {
      const res = await this.$http.post("/api/CompanyUserList", {
        orgCompanyID: this.$store.state.userInfo.commparnyList[0].commparnyId
      });
      if (res.data.result.code === 200) {
        this.staffList = res.data.result.item.personnels;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取列表
    async GetWebsiteShareAdPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.keyword,
        userId: this.userId,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/GetWebsiteShareAdPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData.data = res.data.result.item.items;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    //新增
    handleAddAdvertising() {
      this.dialogTitle = "新增广告图";
      this.isDialog = true;
    },
    // 选择图片/判断图片大小尺寸
    changeUpload(file, fileList) {
      let that = this;
      const width = 1920;
      const height = 551;
      let img = new Image();
      const isLt2M = file.size / 1024 / 1024 < 2; // 限制小于2M
      img.src = URL.createObjectURL(file.raw);
      img.onload = function() {
        // console.log(img.width, img.height, "图片大小");
        console.log(width, height);
        const valid = img.width === width && img.height === height;
        console.log(valid, "valid");
        console.log(isLt2M, "isLt2M");
        if (valid && isLt2M) {
          that.file = file.raw;
          that.editImages = fileList;
          if (fileList.length > 1) fileList.shift();
        } else {
          fileList.pop();
          that.$message.error("图片尺寸限制为1920 x 550，大小不可超过2MB");
        }
      };
    },

    // 删除图片事件
    handleRemove(file, fileList) {
      this.dialogFromData.imgUrl = "";
      this.editImages = fileList;
      this.$refs["upload"].clearFiles();
    },
    // 预览片事件
    handlePictureCardPreview(file) {
      this.$PreviewPic({
        zIndex: 9999, // 组件的zIndex值 默认为2000
        index: 0, // 展示第几张图片 默认为0
        list: [file.url], // 需要展示图片list
        onClose: i => {
          // 关闭时的回调
          console.log(i);
        },
        onSelect: i => {
          // 点击某张图片的回调
          console.log(i);
        }
      });
    },
    async handleAvatarSuccess() {
      this.dialogFromData.imageUrl = await this.successUpload();
    },
    // 上传图片
    async successUpload() {
      const fd = new FormData();
      fd.append("BusinessType", "Head");
      fd.append("file", this.file);
      return await this.$http.post("/api/File/InsertPic", fd);
    },
    // 判断图片大小尺寸
    beforeAvatarUpload(file) {
      let _this = this;
      const isLt2M = file.size / 1024 / 1024 < 2; // 限制小于1M
      const isSize = new Promise(function(resolve, reject) {
        let width = 1920; // 限制图片尺寸为654X270
        let height = 551;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width === width && img.height === height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          _this.$message.error("图片尺寸限制为1920 x 550，大小不可超过2MB");
          return Promise.reject();
        }
      );
      if (!isLt2M) {
        _this.$message.error("图片尺寸限制为1920 x 550，大小不可超过2MB");
      }
      return isSize & isLt2M;
    },
    // 确定新增广告
    async comfirmAddAdvertising() {
      console.log(this.dialogFromData);
      if (this.editImages.length != 0) {
        const imgRes = await this.successUpload();
        if (imgRes.data.result.code === 200) {
          this.dialogFromData.imgUrl =
            imgRes.data.result.object[0] &&
            imgRes.data.result.object[0].filePath
              ? imgRes.data.result.object[0].filePath
              : this.dialogFromData.imgUrl;
        } else {
          this.$messsage.error("头像上传失败");
          return false;
        }
        this.$refs.formDataRef.validate(async valid => {
          if (valid) {
            const res = await this.$http.post(
              "/api/CreateWebsiteShareAd",
              this.dialogFromData
            );
            if (res.data.result.code === 200) {
              this.isDialog = false;
              this.dialogFromData = {};
              this.editImages = [];
              this.$common.handlerMsgState({
                msg: "新增操作成功",
                type: "success"
              });
              this.GetWebsiteShareAdPage();
            } else {
              this.$common.handlerMsgState({
                msg: res.data.result.msg,
                type: "danger"
              });
            }
          }
        });
      } else {
        this.$refs.formDataRef.validateField("imgUrl");
      }
    },
    // 打开编辑
    handleUpdate(item) {
      this.dialogTitle = "编辑广告图";
      this.isDialog = true;
      if (item.imgUrl) this.$set(this, "editImages", [{ url: item.imgUrl }]);
      // this.dialogFromData = Object.assign({}, item);
      this.dialogFromData.id = item.id;
      this.dialogFromData.title = item.title;
      this.dialogFromData.imgUrl = item.imgUrl;
      this.dialogFromData.defaultLinkUrl = item.defaultLinkUrl;

      console.log(this.dialogFromData);
    },
    // 确定编辑请求
    async comfirmUpdateAdvertising() {
      if (this.editImages.length != 0) {
        const imgRes = await this.successUpload();
        if (imgRes.data.result.code === 200) {
          this.dialogFromData.imgUrl =
            imgRes.data.result.object[0] &&
            imgRes.data.result.object[0].filePath
              ? imgRes.data.result.object[0].filePath
              : this.dialogFromData.imgUrl;
        } else {
          this.$messsage.error("头像上传失败");
          return false;
        }
        console.log(this.dialogFromData);
        this.$refs.formDataRef.validate(async valid => {
          if (valid) {
            const res = await this.$http.post(
              "/api/UpdateWebsiteShareAd",
              this.dialogFromData
            );
            if (res.data.result.code === 200) {
              this.isDialog = false;
              this.dialogFromData = {};
              this.editImages = [];
              this.$common.handlerMsgState({
                msg: "编辑操作成功",
                type: "success"
              });
              this.GetWebsiteShareAdPage();
            } else {
              this.$common.handlerMsgState({
                msg: res.data.result.msg,
                type: "danger"
              });
            }
          }
        });
      } else {
        this.$refs.formDataRef.validateField("imgUrl");
      }
    },
    // 删除广告
    async handelDelete(item) {
      const res = await this.$http.post("/api/DeleteWebsiteShareAd", item);
      if (res.data.result.code === 200) {
        this.GetWebsiteShareAdPage();
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
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.GetWebsiteShareAdPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.GetWebsiteShareAdPage();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.GetWebsiteShareAdPage();
    }
  },
  created() {
    this.GetWebsiteShareAdPage();
  },
  mounted() {
    this.getStaffList();
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.BsAdvertisingManage {
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
    .left {
      flex: 1;
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
  @{deep} .el-upload {
    width: 100%;
  }
  @{deep}.avatar-uploader {
    width: 100%;
    height: 200px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      line-height: 200px;
      margin: 0 auto;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

  .uploadText {
    padding-top: 5px;
    color: #b9b9b9;
    line-height: 30px;
  }
}
</style>
