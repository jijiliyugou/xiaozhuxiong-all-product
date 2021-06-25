<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-06-16 12:05:50
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\components\advertisementComponent\advertisementComponentMb.vue
 * @LastEditTime: 2021-06-16 12:12:18
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="advertisementComponent" v-if="list.length">
    <el-carousel arrow="never" height="133px">
      <el-carousel-item
        v-for="item in list"
        :key="item.id"
        @click.native="openLink(item)"
      >
        <el-image
          style="width:100%;height:133px;"
          fit="cover"
          :src="item.imgUrl"
        ></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "advertisementComponentMb",
  data() {
    return {
      list: []
    };
  },
  methods: {
    // 跳转广告链接
    openLink(item) {
      window.open(item.linkUrl, "_blank");
    },
    // 获取广告
    async getWebsiteShareAdByShareIdList() {
      const res = await this.$toys.post("/api/GetWebsiteShareAdByShareIdList", {
        shareId: this.userInfo.shareId
      });
      console.log(res);
      if (res.data.result.code === 200) {
        this.list = res.data.result.item;
      } else {
        this.$message.error(res.data.result.msg);
      }
    }
  },
  created() {},
  mounted() {
    this.getWebsiteShareAdByShareIdList();
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.advertisementComponent {
  width: 100%;
  height: 133px;
  cursor: pointer;
  @{deep} .el-carousel__indicator {
    .el-carousel__button {
      width: 8px;
      height: 8px;
      background-color: #fff;
      border-radius: 4px;
    }
    &.is-active {
      .el-carousel__button {
        width: 30px;
        height: 8px;
        background-color: #fff;
        border-radius: 4px;
      }
    }
  }
}
</style>
