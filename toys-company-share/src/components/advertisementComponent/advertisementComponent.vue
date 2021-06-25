<template>
  <div class="advertisementComponent" v-if="list.length">
    <el-carousel arrow="never" height="550px">
      <el-carousel-item
        v-for="item in list"
        :key="item.id"
        @click.native="openLink(item)"
      >
        <el-image
          style="width:100%;height:550px;"
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
  height: 551px;
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
