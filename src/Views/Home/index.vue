<template>
  <div class="home-container">
    <el-container>
      <el-aside width="200px" height="100%">
        <div class="avatar">
          <div>
            <el-avatar :size="size" :src="circleUrl"></el-avatar>
          </div>
          <el-button size="mini" @click="logout">退出登录</el-button>
        </div>

        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router="router"
        >
          <!-- <el-menu-item index="/Home/main">首页</el-menu-item> -->
          <el-menu-item index="/Home/createArticle">发布文章</el-menu-item>
          <el-menu-item index="/Home/artList">文章列表</el-menu-item>
          <el-menu-item index="/Home/tagList">标签管理</el-menu-item>
          <el-menu-item index="/Home/userManage">用户管理</el-menu-item>
          <!-- <el-menu-item index="/Home/article">文章页面</el-menu-item> -->
          <el-menu-item index="/Home/comment">评论管理</el-menu-item>
          <el-menu-item index="/Home/messageBoard">留言板</el-menu-item>
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
    //
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" >
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
  width: 100%;
}
.home-container {
  position: absolute;
  height: 100%;
  width: 100%;
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

    .el-main {
      width: 100%;
    }
  }
}
</style>
