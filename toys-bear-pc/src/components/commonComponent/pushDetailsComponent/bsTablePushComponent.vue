<template>
  <div class="bsTablePushComponent">
    <!-- 表格数据 -->
    <el-table
      :data="plantList"
      ref="multipleTable"
      :header-cell-style="{ backgroundColor: '#f9fafc', color: '#666' }"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55">
      </el-table-column>
      <el-table-column label="员工" min-width="150">
        <template slot-scope="scope">
          <div class="imgBox">
            <el-image
              fit="contain"
              style="width: 50px; height: 50px"
              :src="scope.row.imgUrl"
            >
              <div slot="placeholder" class="errorImg">
                <img
                  style="width: 55px; height: 60px"
                  src="~@/assets/images/imgError.png"
                  alt
                />
              </div>
              <div slot="error" class="errorImg">
                <img
                  style="width: 55px; height: 60px"
                  src="~@/assets/images/imgError.png"
                  alt
                />
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="固定电话"
        align="center"
        min-width="150"
      ></el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="联系电话"
        align="center"
        min-width="150"
      ></el-table-column>
      <el-table-column
        prop="phone"
        label="泽洋总数"
        align="center"
        min-width="150"
      ></el-table-column>

      <el-table-column label="操作" min-width="250" align="center">
        <template slot-scope="scope">
          <el-button size="medium" type="success" @click="openBsSampleDetail">
            泽洋明细
          </el-button>

          <el-button size="medium" type="warning" @click="openBsPushRecord"
            >推送记录（{{ scope.$index }}）</el-button
          >
          <el-button size="medium" type="primary"> 在线咨询 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="择样明细"
      :visible.sync="sampleDetailDialog"
      width="1620px"
      :before-close="closeSampleDetailDialog"
    >
      <bsSampleDetailComponent></bsSampleDetailComponent>
    </el-dialog>

    <el-dialog
      title="推送记录"
      :visible.sync="pushRecordDialog"
      width="800px"
      :before-close="closePushRecordDialog"
    >
      <bsPushRecordComponent></bsPushRecordComponent>
    </el-dialog>
  </div>
</template>
<script>
import bsSampleDetailComponent from "@/components/commonComponent/pushDetailsComponent/bsSampleDetailComponent.vue";
import bsPushRecordComponent from "@/components/commonComponent/pushDetailsComponent/bsPushRecordComponent.vue";
export default {
  props: {
    plantList: {
      type: Array
    },
    multipleSelection: {
      type: Array
    }
  },
  components: { bsSampleDetailComponent, bsPushRecordComponent },
  data() {
    return {
      sampleDetailDialog: false,
      pushRecordDialog: false
    };
  },
  methods: {
    //单选
    handleSelectionChange(val) {
      this.$emit("update:multipleSelection", val);
    },
    //打开择样明细弹框
    openBsSampleDetail() {
      this.sampleDetailDialog = true;
    },
    //关闭择样明细弹框
    closeSampleDetailDialog() {
      this.sampleDetailDialog = false;
    },
    //打开推送记录弹框
    openBsPushRecord() {
      this.pushRecordDialog = true;
    },
    //关闭推送记录弹框
    closePushRecordDialog() {
      this.pushRecordDialog = false;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsTablePushComponent {
  @{deep} .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}
</style>
