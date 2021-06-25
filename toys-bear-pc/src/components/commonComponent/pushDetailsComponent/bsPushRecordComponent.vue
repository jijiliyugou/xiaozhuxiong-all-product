<template>
  <div class="bsPushRecordComponent">
    <Table :table="tableData"></Table>
  </div>
</template>

<script>
import Table from "@/components/table";
import eventBus from "@/assets/js/common/eventBus";
import { mapState } from "vuex";
export default {
  components: {
    Table
  },
  computed: {
    ...mapState(["userInfo"])
  },
  props: {
    pushRecordData: {
      type: Array
    },
    orderData: {
      type: Object
    },
    supplierNumber: {
      type: String
    }
  },
  data() {
    return {
      tableData: {
        data: [],
        showLoading: false,
        height: "500px",
        sizeMini: "mini",
        isIndex: true,
        columns: [
          {
            prop: "businessType",
            isHiden: true,
            label: "推送类型",
            render: row => {
              let msg;
              switch (row.businessType) {
                // case "0":
                //   msg = "系统通知";
                //   break;
                case 1:
                  msg = "系统消息";
                  break;
                case 2:
                  msg = "广告消息";
                  break;
                case 3:
                  msg = "订单消息";
                  break;
                case 4:
                  msg = "短信";
                  break;
              }
              return msg;
            }
          },
          {
            prop: "content",
            isHiden: true,
            label: "推送内容"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "推送时间",
            render: row => {
              return row.createdOn ? row.createdOn.replace(/T.*/, "") : "";
            }
          },
          {
            prop: "status",
            isHiden: true,
            label: "推送状态",
            render: row => {
              let msg = "";
              switch (row.status) {
                case 0:
                  msg = "<span style='color: #EB1515'>未查看</span>";
                  break;
                case 1:
                  msg = "<span style='color: #33A96A'>已查看</span>";
                  break;
              }
              return msg;
            }
          }
        ],
        btnWidth: 100,
        actions: [
          {
            type: "primary",
            textWrapper() {
              return "再次推送";
            },
            disabledWrapper: row => {
              let msg = "";
              switch (row.status) {
                case 0:
                  msg = false;
                  break;
                case 1:
                  msg = true;
                  break;
              }
              return msg;
            },
            methods: () => {
              eventBus.$emit("openPushDialog", this.supplierNumber);
            }
          }
        ]
      }
    };
  },
  methods: {
    //关闭弹框
    closeDialog() {
      this.$emit("handlePushDialog", false);
    }
  },
  created() {
    this.tableData.data = this.pushRecordData;
  },
  mounted() {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsPushRecordComponent {
}
</style>
