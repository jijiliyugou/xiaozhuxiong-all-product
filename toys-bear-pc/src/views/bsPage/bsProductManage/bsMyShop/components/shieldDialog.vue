<template>
  <div class="shieldDialog">
    <div class="searchBox">
      <div class="left">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            clearable
            v-model="keyword"
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
    </div>
    <div class="tableBox">
      <Table :table="tableData" />
    </div>
    <center style="margin-top:20px">
      <template>
        <el-button type="primary" @click="handleShieid">确定</el-button>
        <el-button
          style="margin-left: 30px;"
          plain
          @click="$emit('closeShieldDialog')"
          >取消</el-button
        >
      </template>
    </center>
  </div>
</template>

<script>
import Table from "@/components/table.vue";
export default {
  name: "",
  components: {
    Table
  },
  data() {
    return {
      keyword: null,
      tableData: {
        data: [],
        height: "300",
        selection: true,
        showLoading: false,
        isIndex: true,
        columns: [
          {
            prop: "",
            label: "名称",
            align: "left",
            companyInfo: true,
            companyLogo: row => {
              return row.companyLogo;
            },
            linkman: row => {
              return row.linkman;
            },
            companyName: row => {
              return row.companyName;
            }
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "屏蔽时间",
            render: row => {
              return row.createdOn && row.createdOn.replace(/T/, " ");
            }
          },
          {
            prop: "isRecommend",
            isHiden: true,
            isSwitch: true,
            activeColor: "#13ce66",
            inactiveColor: "#ff4949",
            label: "是否屏蔽",
            value: "isRecommend",
            handlerChange: row => {
              console.log(row);
            }
          }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    //搜索
    search() {},
    //确定
    handleShieid() {}
  }
};
</script>
<style scoped lang="less">
.shieldDialog {
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
        margin-right: 20px;
        .label {
          width: 58px;
          min-width: 58px;
        }
      }
    }
  }
}
</style>
