<template>
  <div class="artHeader-container">
    <div class="left">
      <el-form :inline="true" label-width="100px">
        <el-form-item label="标题">
          <el-input :disabled="true" v-model="title"></el-input>
        </el-form-item>
        <el-form-item label="浏览量">
          <el-input :disabled="true" v-model="enters" type="number"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input :disabled="true" v-model="createTime"></el-input>
        </el-form-item>

        <el-form-item label="作者">
          <el-input :disabled="true" v-model="author.userName"></el-input>
        </el-form-item>
        <el-form-item label="点赞">
          <el-input :disabled="true" v-model="favs" type="number"></el-input>
        </el-form-item>
        <el-form-item label="上次更新时间">
          <el-input :disabled="true" v-model="lastUpdateTime"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="100px">
        <el-form-item label="标签" v-model="tags" :inline="false">
          <span v-if="tags.length==0" style="line-height:40px;">空</span>
          <el-tag v-for="(val,i) in tags" :key="i">{{val}}</el-tag>
        </el-form-item>
      </el-form>
    </div>
    <el-form label-width="100px" class="right">
      <el-form-item label="简要内容">
        <el-input type="textarea" :rows="8" :disabled="true" v-model="simpleContent"></el-input>
      </el-form-item>
    </el-form>
    <el-form class="btn">
      <el-form-item>
        <el-button @click="OnUpdate">修改</el-button>

        <el-popconfirm
          confirmButtonText="好的"
          cancelButtonText="不用了"
          icon="el-icon-info"
          iconColor="red"
          title="这是一段内容确定删除吗？"
          @onConfirm="OnRemove"
        >
          <el-button slot="reference" type="danger" icon="el-icon-delete" circle></el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>
    <!-- <el-dropdown>
      <span class="el-dropdown-link">
        标签列表
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(val,i) in tags" :key="i">{{val}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>-->
    <!-- <div class="btn-right"></div> -->
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: [
    "title",
    "createTime",
    "lastUpdateTime",
    "simpleContent",
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
  display: flex;
  align-items: flex-start;
  // justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 1em 0 0 0;
  width: 1550px;
  .el-form {
  }
  .left {
    width: 60%;
    .el-row {
    }
  }
  .right {
    width: 25%;
  }
  .btn {
    align-self: flex-end;
    margin-left: 3em;
  }
}
</style>
