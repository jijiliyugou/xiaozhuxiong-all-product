<template>
  <div class="dialogComponents">
    <!-- 设置区域 -->
    <div class="tuijian">
      <div class="shezhi_xuan">
        <el-scrollbar style="height: 100%;">
          <div class="shezhi_xuan_box">
            <div
              class="shezhi_xuan_item"
              v-for="item in myAreaList"
              :key="item.id"
            >
              <el-checkbox v-model="item.checked">{{ item.name }}</el-checkbox>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <center class="tuijian_btn">
        <el-button type="primary" @click="submitShe">确定</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </center>
    </div>
  </div>
</template>

<script>
export default {
  props: ["areaList", "selectionList", "currentAreaRegion", "is_pi"],
  data() {
    return {
      myAreaList: []
    };
  },
  methods: {
    // 数组去重
    unique(arr, newArr) {
      for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) == -1) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    // 提交修改地区
    async submitShe() {
      const areaRegionIdList = this.myAreaList.filter(v => v.checked);
      const res = await this.$http.post("/api/UpdateProductAreaRegion", {
        productIdList: this.selectionList.map(v => v.id),
        areaRegionIdList: areaRegionIdList.map(v => v.id)
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改成功",
          type: "success"
        });
        this.$emit("subm");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {
    if (this.is_pi) {
      for (let i = 0; i < this.areaList.length; i++) {
        this.$set(this.areaList[i], "checked", false);
        this.myAreaList.push(this.areaList[i]);
      }
    } else {
      for (let i = 0; i < this.areaList.length; i++) {
        let flag = false;
        for (let j = 0; j < this.currentAreaRegion.length; j++) {
          if (this.areaList[i].id === this.currentAreaRegion[j]) {
            flag = true;
            break;
          }
        }
        this.$set(this.areaList[i], "checked", flag);
        this.myAreaList.push(this.areaList[i]);
      }
    }
  }
};
</script>
<style scoped lang="less">
.dialogComponents {
  .tuijian {
    .tuijian_xuan {
      height: 66px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tuijian_input {
      margin-top: 20px;
      display: flex;
      .tuijian_input_titleBox {
        .tuijian_input_title {
          white-space: nowrap; /*不换行*/
        }
      }
    }
    .tuijian_btn {
      margin-top: 20px;
      padding: 20px;
      box-sizing: border-box;
      .el-button {
        width: 120px;
      }
    }
    .shezhi_xuan {
      border-bottom: 1px solid #e5e5e5;
      height: 200px;
      .shezhi_xuan_box {
        display: flex;
        flex-wrap: wrap;
        padding: 20px;
        box-sizing: border-box;
        .shezhi_xuan_item {
          width: 50%;
          padding: 15px 0;
        }
      }
    }
  }
}
</style>
