<template>
  <div class="home-container">
    <el-container>
      <el-aside width="200px" height="100%">
        <div class="avatar">
          <el-avatar :size="size" :src="circleUrl"></el-avatar>
        </div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router="router"
        >
          <el-menu-item index="/Home/main">首页</el-menu-item>
          <el-menu-item index="/Home/createArticle">发布文章</el-menu-item>
          <el-menu-item index="/Home/artList">文章列表</el-menu-item>
          <el-menu-item index="/Home/tagList">标签管理</el-menu-item>
          <el-menu-item index="/Home/userManage">用户管理</el-menu-item>
          <el-menu-item index="/Home/article">文章页面</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "",
  data() {
    return {};
  },
  components: {},
  mounted() {
    this.$router.push("/Home/createArticle");
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.home-container {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  .el-container {
    height: 100%;

    .el-aside {
      background-color: #545c64;
      .avatar {
        padding: 20px;
        text-align: center;
        border-bottom: 1px solid #dcdfe6;
      }
      .el-menu {
        border: none;
      }
    }
  }
}
</style>
