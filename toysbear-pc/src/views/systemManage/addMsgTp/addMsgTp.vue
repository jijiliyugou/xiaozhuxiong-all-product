<template>
  <div class="msgTypeBox">
    <el-form
      label-width="100px"
      ref="myForm"
      :rules="myRules"
      :model="formData"
    >
      <div class="myScroll">
        <el-scrollbar style="height: 100%;" ref="myScrollbar">
          <el-form-item label="角色：" prop="messageModel">
            <el-select
              clearable
              v-model="formData.messageModel"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in configList"
                :key="index"
                :label="item.itemText"
                :value="item.parameter"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消息编号：" prop="messageExt">
            <div class="bangzuBox">
              <el-input v-model="formData.messageExt"></el-input>
              <div class="bangzu">
                <el-tooltip class="item" effect="dark" placement="top-end">
                  <div slot="content">
                    <p style="line-height: 23px;">
                      公司编号：0=系统通知，7=采购
                    </p>
                    <p style="line-height: 23px;">
                      展厅编号：0=系统通知，3=补样，5=借样，11=补样借样，12=洽谈
                    </p>
                  </div>
                  <div class="icon">?</div>
                </el-tooltip>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="消息名称：">
            <el-input v-model="formData.title"></el-input>
          </el-form-item>
          <div class="lineBox">
            <div class="line_title">参数设置：</div>
            <div class="line"></div>
          </div>
          <el-form-item
            :label="'参数' + (i + 1) + '：'"
            v-for="(item, i) in formData.itemList"
            :key="item.itemValue"
          >
            <div
              class="bangzuBox"
              @mouseenter="isDelete = i"
              @mouseleave="isDelete = null"
            >
              <el-input v-model="formData.itemList[i].itemText"></el-input>
              <div
                class="shanchu"
                @click="removeItemList(i)"
                v-show="isDelete === i"
              >
                <i class="el-icon-circle-close"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              plain
              type="primary"
              style="margin:0;"
              icon="el-icon-plus"
              @click="addItemList"
              >增加参数</el-button
            >
          </el-form-item>
        </el-scrollbar>
      </div>
      <el-form-item>
        <el-button class="btnW" type="primary" @click="addSubmit(formData)">
          确定
        </el-button>
        <el-button class="btnW" @click="$emit('close')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["isEdit", "configList", "currentRow"],
  data() {
    return {
      isDelete: null,
      paramList: 2,
      formData: {
        title: null,
        messageModel: null,
        messageExt: null,
        itemList: [
          {
            itemText: "",
            itemValue: 0
          },
          {
            itemText: "",
            itemValue: 1
          }
        ]
      },
      myRules: {
        messageModel: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        messageExt: [{ required: true, message: "请输入编号", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 提交
    addSubmit(item) {
      this.$refs.myForm.validate(valid => {
        if (valid) this.$emit("submit", item);
      });
    },
    // 删除参数
    removeItemList(i) {
      this.formData.itemList.splice(i, 1);
    },
    // 添加参数
    addItemList() {
      this.formData.itemList.push({
        itemText: "",
        itemValue: this.formData.itemList.length
      });
      this.$nextTick(() => {
        this.$refs.myScrollbar.wrap.scrollTop = 99999;
      });
    }
  },
  created() {},
  mounted() {
    if (this.isEdit) {
      if (this.currentRow.messageModel) {
        this.currentRow.messageModel = this.currentRow.messageModel.toString();
      }
      this.formData = JSON.parse(JSON.stringify(this.currentRow));
    }
  }
};
</script>
<style scoped lang="less">
.msgTypeBox {
  width: 100%;
  .btnW {
    width: 117px;
  }
  .bangzuBox {
    display: flex;
    .bangzu {
      width: 35px;
      min-width: 35px;
      position: relative;
      .icon {
        width: 18px;
        height: 18px;
        border-radius: 18px;
        background-color: #ffb300;
        position: absolute;
        right: 0;
        top: 10px;
        cursor: pointer;
        color: #fff;
        text-align: center;
        line-height: 19px;
        font-weight: bold;
      }
    }
    .shanchu {
      color: #f56c6c;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .lineBox {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 22px;
    .line_title {
      width: 88px;
      text-align: right;
      margin-right: 12px;
      font-weight: bold;
    }
    .line {
      width: 335px;
      height: 1px;
      background-color: #dcdfe6;
    }
  }
  .myScroll {
    height: 410px;
  }
}
</style>
