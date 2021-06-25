<template>
  <!-- 常联系人 -->
  <div class="frequentContacts">
    <div class="frequentContacts_top">
      <div class="contacts_top_title">
        常联系人
      </div>
      <div class="contacts_top_search">
        <el-input
          size="small"
          v-model="search"
          placeholder="请输入关键词"
          clearable
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="frequentContacts_content">
      <el-scrollbar style="height: 100%;">
        <ul class="content_box">
          <li class="content_item" v-for="item in 40" :key="item"></li>
        </ul>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  props: ["dataOption"],
  data() {
    return {
      search: null
    };
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.frequentContacts {
  width: 80%;
  background-color: #fff;
  .frequentContacts_top {
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    box-sizing: border-box;
    padding: 0 20px;
    .contacts_top_title {
      font-weight: 700;
      font-size: 15px;
    }
    .contacts_top_search {
      width: 307px;
      height: 32px;
      background: #f1f3f6;
      border: 1px solid #dcdfe6;
      border-radius: 17px;
      overflow: hidden;
      @{deep} .el-input {
        background-color: #fff;
        input {
          border: none;
          border-radius: 17px;
        }
        .el-input-group__append {
          background-color: #fff;
          border: none;
          font-weight: 700;
          button {
            font-weight: 700;
            width: 50px;
            height: 32px;
          }
        }
      }
    }
  }
  .frequentContacts_content {
    height: 715px;
    box-sizing: border-box;
    padding-left: 20px;
    padding-top: 20px;
    .content_box {
      display: flex;
      flex-wrap: wrap;
      .content_item {
        width: 300px;
        height: 81px;
        opacity: 1;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        margin-right: 20px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
