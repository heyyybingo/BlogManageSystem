<template>
  <div class="artList-container">
    <div class="search-container">
      <el-input class="search-content" placeholder="输入搜索标题"></el-input>
      <el-button icon="el-icon-search" circle></el-button>
    </div>
    <el-table :data="articles" :row-style="{height:'80px'}" height="92%">
      <el-table-column prop="title" label="文章标题" width="220"></el-table-column>
      <el-table-column prop="favs" label="点赞" width="120"></el-table-column>
      <el-table-column prop="enters" label="浏览" width="120"></el-table-column>
      <el-table-column prop="simpleContent" label="简要内容" width="530" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="标签" width="250">
        <template slot-scope="scope">
          <el-tag v-for="(tag,i) in scope.row.tags" :key="i">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-button @click="OnArticle(scope.row._id)">查看</el-button>
          <el-button @click="OnUpdate(scope.row._id)">修改</el-button>
          <el-button
            @click="OnRemove(scope.row._id,scope.row.title)"
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn-container">
      <el-button @click="changePage(-1)" v-if="page>1">上一页</el-button>
      <el-button @click="changePage(1)" v-if="articles.length!=0">下一页</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "",
  data() {
    return {
      page: null,
      everyNum: 10,
      articles: []
    };
  },
  created() {
    this.page = 1;
  },
  components: {},
  methods: {
    changePage(num) {
      this.page = this.page + num;
    },
    OnArticle(_id) {
      this.$router.push({
        path: "/Home/article",
        query: {
          _id
        }
      });
    },
    OnUpdate(_id) {
      this.$router.push({
        path: "/Home/updateArticle",
        query: {
          _id
        }
      });
    },
    OnRemove(_id, title) {
      this.axios
        .post("/article/remove", { _id })
        .then(res => {
          if (res.status == 200) {
            this.$notify({
              title: "成功",
              message: "文章【" + title + "】删除成功",
              type: "success"
            });
            let page = this.page;
            let everyNum = this.everyNum;
            let params = { page, everyNum };
            return this.axios.get("/article/queryList", { params });
          }
        })
        .then(res => {
          if (res.status == 200) {
            this.articles = res.data.data;
          }
        });
    }
  },
  watch: {
    page(val) {
      let page = val;
      let everyNum = this.everyNum;
      let params = { page, everyNum };
      this.axios.get("/article/queryList", { params }).then(res => {
        if (res.status == 200) {
          this.articles = res.data.data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.artList-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  height: 820px;
  .search-container {
    padding: 20px 0px 20px 20px;
    .search-content {
      width: 200px;
    }
  }
  .btn-container {
    padding: 10px;
    float: right;
  }
}
</style>
