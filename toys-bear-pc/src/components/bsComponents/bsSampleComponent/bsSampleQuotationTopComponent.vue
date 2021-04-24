<template>
  <div class="hander">
    <div class="handerTop">
      <div class="flex_t">
        <p>
          报价单号：<span class="pId">{{ itemList.offerNumber }} </span>
        </p>
        <p>
          客户名称：<span>{{ itemList.customerName }} </span>
        </p>
        <p>
          操作员：<span style="color: #2d7fe4">{{ itemList.linkman }} </span>
        </p>
        <p>
          状态：<span
            :style="{
              color: itemList.status == 0 ? '#3368A9' : '#2D7FE4'
            }"
            >{{
              itemList.status == 0
                ? "未审核"
                : itemList.status == 1
                ? "审核通过"
                : "审核不通过"
            }}
          </span>
        </p>
      </div>
      <div class="flex_b">
        <p>
          报价时间：<span v-if="itemList.createdOn"
            >{{ itemList.createdOn.replace(/T/, " ") }}
          </span>
        </p>
        <div class="right">
          <p class="remark">
            报价备注：<span>{{ itemList.title }} </span>
          </p>
          <div class="editOffmethod" v-if="showEditMethod">
            <el-button
              type="primary"
              @click="openEditOffMethods"
              icon="el-icon-edit"
              size="medium"
            >
              修改报价信息
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="handerTab">
      <el-table
        :header-cell-style="{ backgroundColor: '#f9fafc' }"
        :data="handerTabData"
        style="width: 100%"
        row-key="id"
        border
        lazy
      >
        <!-- <el-table-column
            align="center"
            prop="offerMethod"
            label="报价方式"
            width="180"
          >
          </el-table-column> -->
        <el-table-column align="center" prop="profit" label="利润率">
        </el-table-column>
        <el-table-column
          align="center"
          prop="totalCost"
          label="总费用"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="exchange"
          label="汇率"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="decimalPlaces" label="小数位数">
        </el-table-column>

        <el-table-column align="center" prop="cu_deName" label="币种">
        </el-table-column>
        <el-table-column align="center" prop="size" label="每车尺寸">
        </el-table-column>
        <el-table-column align="center" prop="rejectionMethod" label="取舍方式">
        </el-table-column>
        <el-table-column align="center" prop="miniPrice" label="价钱小于">
        </el-table-column>
        <el-table-column
          align="center"
          prop="miniPriceDecimalPlaces"
          label="小数位数"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemList: {
      type: Object
    },
    handerTabData: {
      type: Array
    },
    showEditMethod: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    openEditOffMethods() {
      this.$emit("openEditOffMethods");
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.hander {
  .handerTop {
    padding-top: 26px;
    .flex_t {
      display: flex;
      align-content: center;
      margin-bottom: 10px;
      p {
        width: 235px;
        margin-right: 30px;
        font-weight: 400;
        .pId {
          font-weight: 700;
          font-size: 15px;
        }
      }
    }
    .flex_b {
      display: flex;
      align-content: center;
      align-items: center;
      p {
        margin-right: 30px;
        width: 235px;
      }
      .right {
        flex: 1;
        display: flex;
        align-items: center;
        .remark {
          flex: 1;
        }
      }
    }
  }
  .handerTab {
    margin-top: 25px;
  }
}
</style>
