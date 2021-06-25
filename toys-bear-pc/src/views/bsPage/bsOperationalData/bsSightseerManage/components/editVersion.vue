<template>
  <div>
    <el-form ref="shenheForm" label-width="100px" :model="formData">
      <el-form-item label="公司名称：" prop="companyName">
        <el-input v-model="formData.companyName" disabled></el-input>
      </el-form-item>
      <div class="myFlex">
        <el-form-item label="公司类型：" prop="companyType">
          <el-input
            :value="filterCompanyType(formData.companyType)"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="contactsMan">
          <el-input v-model="formData.contactsMan" disabled></el-input>
        </el-form-item>
      </div>
      <div class="myFlex">
        <el-form-item label="联系电话：" prop="landlineNumber">
          <el-input v-model="formData.landlineNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系手机：" prop="phoneNumber">
          <el-input v-model="formData.phoneNumber" disabled></el-input>
        </el-form-item>
      </div>
      <el-form-item label="QQ：" prop="qq">
        <el-input v-model="formData.qq" disabled></el-input>
      </el-form-item>
      <el-form-item label="公司地址：" prop="address">
        <el-input v-model="formData.address" disabled></el-input>
      </el-form-item>
      <el-form-item label="申请时间：" prop="createdOn">
        <el-input v-model="formData.createdOn" disabled></el-input>
      </el-form-item>
      <el-form-item
        label="营业执照："
        prop="businessLicense"
        v-if="formData.businessLicense"
      >
        <el-image
          style=" width: 100px;height: 150px;cursor: pointer;"
          @click.native="openViewImg(formData.businessLicense)"
          fit="contain"
          :src="formData.businessLicense"
        >
          <div slot="placeholder" class="image-slot">
            <img
              style=" width: 100px;height: 100px;object-fit:contain;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
          <div slot="error" class="image-slot">
            <img
              style=" width: 100px;height: 100px;object-fit:contain;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
        </el-image>
      </el-form-item>
      <el-form-item label="处理意见：" prop="remark">
        <el-input
          type="textarea"
          resize="none"
          v-model="formData.remark"
          show-word-limit
          suffix="123"
          :maxlength="$store.state.globalJson.Json.UserRestrictions[0].itemCode"
          class="txtWrap"
        ></el-input>
      </el-form-item>
      <center>
        <template>
          <el-button type="primary" @click="review(1)">通过</el-button>
          <el-button type="danger" @click="review(2)">拒绝</el-button>
        </template>
      </center>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    currentRow: {
      type: Object
    },
    clientTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {}
    };
  },
  methods: {
    // 过滤公司类型
    filterCompanyType(type) {
      const current = this.clientTypeList.find(v => v.itemCode === type);
      return current && current.itemText;
    },
    async review(flag) {
      this.formData.auditState = flag;
      const res = await this.$http.post("/api/AuditCompany", this.formData);
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "审核成功",
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
    openViewImg(url) {
      this.$PreviewPic({
        zIndex: 9999, // 组件的zIndex值 默认为2000
        index: 0, // 展示第几张图片 默认为0
        list: [url], // 需要展示图片list
        onClose: i => {
          // 关闭时的回调
          console.log(i);
        },
        onSelect: i => {
          // 点击某张图片的回调
          console.log(i);
        }
      });
    }
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.currentRow));
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.myFlex {
  display: flex;
  .el-form-item {
    flex: 1;
  }
}
</style>
