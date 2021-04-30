<template>
  <div class="bsPushRecordComponent">
    <el-table
      :data="tableData"
      style="width: 100%"
      ref="collecTable"
      :header-cell-style="{ background: '#f1f3f6' }"
    >
      <el-table-column prop="ch_pa" label="主题"> </el-table-column>
      <el-table-column prop="ch_pa" label="推送内容" min-width="250">
      </el-table-column>
      <el-table-column prop="ch_pa" label="推送时间" align="center">
      </el-table-column>
      <el-table-column label="推送状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.supplierName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center">
        <el-button size="medium" type="primary"> 再次推送 </el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    productList: {
      type: Array
    },
    pushDialog: {
      type: Boolean
    }
  },
  components: {},
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    //关闭弹框
    closeDialog() {
      this.$emit("handlePushDialog", false);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsPushRecordComponent {
}
</style>
