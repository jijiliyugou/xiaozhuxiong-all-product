<template>
  <div class="bsHotProductTable">
    <div class="header">
      <div class="title">
        <i :class="['icon', productdata.className]"></i>
        <span>{{ productdata.title }}</span>
      </div>
      <div class="dayBox">
        <el-radio-group v-model="dayValue" size="mini" @change="changeTime">
          <el-radio-button
            v-for="(item, i) in dayList"
            :key="i"
            :label="item.value"
          ></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <Table :table="tableData"></Table>
  </div>
</template>

<script>
import { calculateDate } from "@/assets/js/common/common.js";
import Table from "@/components/table";
export default {
  name: "bsHotProductTable",
  components: {
    Table
  },
  props: {
    productdata: Object
  },
  data() {
    return {
      dayValue: "7天",
      dayList: [
        {
          value: "3天"
        },
        {
          value: "7天"
        },
        {
          value: "15天"
        },
        {
          value: "30天"
        }
      ],
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        columns: [
          {
            prop: "",
            label: "厂商",
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
            prop: "phoneNumber",
            label: "价钱",
            color: "red",
            render: row => {
              console.log(row);
            }
          },
          { prop: "contactsMan", label: "厂家" },
          { prop: "telePhoneNumber", label: "择样次数" }
        ]
      }
    };
  },
  created() {},
  mounted() {
    console.log(this.productdata);
  },
  methods: {
    // 天数请求
    changeTime(value) {
      this.timeData = Object.assign(calculateDate(value));
    }
  }
};
</script>
<style scoped lang="less">
.bsHotProductTable {
  padding: 0 20px;
  background: #ffffff;
  box-sizing: border-box;
  .header {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 4px;
    box-sizing: border-box;
    .title {
      height: 50px;
      font-size: 18px;
      font-weight: 700;
      flex: 1;
      display: flex;
      align-items: center;
      .icon {
        width: 24px;
        height: 18px;
        margin-right: 17px;
        &.searchProductIcon {
          background: url("~@/assets/images/searchProductIcon.png") no-repeat
            center;
          background-size: contain;
        }
        &.purchaseProductIcon {
          background: url("~@/assets/images/purchaseProductIcon.png") no-repeat
            center;
          background-size: contain;
        }
        &.sampleProductIcon {
          background: url("~@/assets/images/sampleProductIcon.png") no-repeat
            center;
          background-size: contain;
        }
        &.offerProductIcon {
          background: url("~@/assets/images/offerProductIcon.png") no-repeat
            center;
          background-size: contain;
        }
      }
    }
    .dayBox {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
