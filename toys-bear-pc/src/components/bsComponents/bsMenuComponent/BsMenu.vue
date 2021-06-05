<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-03-31 17:09:19
 * @FilePath: \projectd:\LittleBearPC\toys-bear-pc\src\components\bsComponents\bsMenuComponent\BsMenu.vue
 * @LastEditTime: 2021-05-11 15:47:32
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="bsMenu">
    <el-scrollbar style="height: 100%;">
      <el-menu
        unique-opened
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        mode="vertical"
        router
        :collapse="isCollapse"
      >
        <el-menu-item @click="addRouterEvent(homeLink)" index="/bsIndex/bsHome">
          <i class="icon homeIcon"></i>
          <span slot="title">后台首页</span>
        </el-menu-item>
        <el-submenu
          v-for="item in routers"
          :key="item.parent.id"
          :index="item.parent.linkUrl"
        >
          <template slot="title">
            <i
              :class="{
                icon: true,
                productSearchIcon:
                  item.parent.linkUrl === '/bsIndex/bsProductSearchIndex',
                myInfoIcon: item.parent.linkUrl === '/bsIndex/bsMyNews',
                businessManageIcon:
                  item.parent.linkUrl === '/bsIndex/bsBusinessManage',
                bsSiteSharingIcon:
                  item.parent.linkUrl === '/bsIndex/bsSiteSharing',
                bsPersonalManageIcon:
                  item.parent.linkUrl === '/bsIndex/bsPersonalManage',
                bsMyClientsIcon: item.parent.linkUrl === '/bsIndex/bsMyClients'
              }"
            ></i>

            <span slot="title">
              <span v-if="item.parent.linkUrl !== '/bsIndex/bsMyNews'">
                {{ item.parent.name }}
              </span>
              <span v-else>
                <el-badge
                  :value="allCount"
                  :hidden="allCount < 1"
                  class="onehongdian"
                >
                  {{ item.parent.name }}
                </el-badge>
              </span>
            </span>
          </template>
          <el-menu-item
            @click="addRouterEvent(child)"
            v-for="child in item.children"
            :key="child.id"
            :index="child.linkUrl"
          >
            <span v-if="child.linkUrl != '/bsIndex/bsBusinessMsg'">
              <span
                style="font-size: 26px;position: relative; top: -2px;margin-right:5px;margin-left: 20px;"
                >·</span
              >{{ child.name }}</span
            >
            <template v-else>
              <span
                style="font-size: 26px;position: relative; top: -2px;margin-left: 20px;"
              >
                ·
              </span>
              <el-badge
                class="hongdian"
                :value="allCount"
                :hidden="allCount < 1"
              >
                {{ child.name }}
              </el-badge>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    isCollapse: {
      type: Boolean
    }
  },
  data() {
    return {
      homeLink: {
        linkUrl: "/bsIndex/bsHome",
        name: "后台首页",
        component: "bsHome",
        refresh: true
      }
    };
  },
  methods: {
    // 点击菜单事件
    addRouterEvent(route) {
      const list = route.linkUrl.split("/");
      const component = list[list.length - 1];
      const fd = {
        name: route.linkUrl,
        linkUrl: route.linkUrl,
        component: component,
        refresh: false,
        label: route.name
      };
      if (route.linkUrl === "/bsIndex/bsProductSearchIndex") {
        this.$store.commit("handleraddrSearch", false);
      }
      this.$store.commit("myAddTab", fd);
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState(["routers", "allCount"])
  }
};
</script>
<style scoped lang="less">
@import "./BsMenu.less";
</style>
