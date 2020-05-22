<template>
  <div class="artHeader-container">
    <el-form :inline="true">
      <el-form-item label="标题">
        <el-input :disabled="true" v-model="title"></el-input>
      </el-form-item>
      <el-form-item label="浏览量">
        <el-input :disabled="true" v-model="enters" type="number"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input :disabled="true" v-model="createTime"></el-input>
      </el-form-item>
      <el-row>
        <el-form-item label="作者">
          <el-input :disabled="true" v-model="author"></el-input>
        </el-form-item>
        <el-form-item label="点赞">
          <el-input :disabled="true" v-model="favs" type="number"></el-input>
        </el-form-item>
        <el-form-item label="上次更新时间">
          <el-input :disabled="true" v-model="lastUpdateTime"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <el-dropdown>
      <span class="el-dropdown-link">
        标签列表
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(val,i) in tags" :key="i">{{val}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="btn-right">
      <el-button @click="OnUpdate">修改</el-button>
      <el-button type="danger" icon="el-icon-delete" circle @click="OnRemove"></el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: [
    "title",
    "createTime",
    "lastUpdateTime",
    "favs",
    "enters",
    "author",
    "tags",
    "_id"
  ],
  name: "",
  data() {
    return {
      //   tags: [
      //     "nodejs",
      //     "nodejs",
      //     "nodejs",
      //     "nodejs",
      //     "nodejs",
      //     "nodejs",
      //     "nodejs",
      //     "nodejs"
      //   ]
    };
  },
  components: {},
  methods: {
    OnUpdate() {
      console.log("update");
      let _id = this._id;
      this.$router.push({
        path: "/Home/updateArticle",
        query: {
          _id
        }
      });
    },
    OnRemove() {
      console.log("remove");

      let _id = this._id;
      console.log(_id);
      this.axios.post("/article/remove", { _id }).then(res => {
        if (res.status == 200) {
          this.$notify({
            title: "成功",
            message: "文章【" + this.title + "】删除成功",
            type: "success"
          });
          this.$router.push("/Home/artList");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.artHeader-container {
  position: relative;
  display: block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  height: 150px;
  width: 100%;

  .el-form {
    position: absolute;
    top: 20px;
    .el-form-item {
      margin-left: 60px;
    }
  }
  .el-dropdown {
    position: absolute;
    top: 20px;
    right: 500px;
  }
  .btn-right {
    position: absolute;
    right: 50px;
    bottom: 30px;
  }
}
</style>
