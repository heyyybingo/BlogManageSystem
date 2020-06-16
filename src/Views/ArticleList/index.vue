<template>
  <div class="artList-container">
    <div style="width:20%;">
      <el-tooltip class="item" effect="dark" content="搜索文章标题,简要内容以及标签相关" placement="top-start">
        <el-input
          v-model="search"
          placeholder="请输入内容"
          @change="search.length?isSearch=true:isSearch=false"
        >
          <i class="el-icon-search el-input__icon" slot="suffix" v-show="!isSearch"></i>

          <i
            class="el-icon-close el-input__icon"
            slot="suffix"
            @click="isSearch=false;search=''"
            v-show="isSearch"
            style="cursor:pointer;"
          ></i>
        </el-input>
      </el-tooltip>
    </div>
    <el-table :data="articles" :row-style="{height:'80px'}" height="92%" class="tb">
      <el-table-column prop="title" label="文章标题" width="220"></el-table-column>
      <el-table-column prop="favs" label="点赞" width="60"></el-table-column>
      <el-table-column prop="enters" label="浏览" width="60"></el-table-column>
      <el-table-column prop="author.userName" label="作者" width="120"></el-table-column>
      <el-table-column prop="simpleContent" label="简要内容" width="530" show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="标签" width="250">
        <template slot-scope="scope">
          <el-tag v-for="(tag,i) in scope.row.tags" :key="i">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-button @click="OnArticle(scope.row._id)">查看</el-button>
          <el-button @click="OnUpdate(scope.row._id)">修改</el-button>
          <el-button @click="onArtComment(scope.row._id)">评论管理</el-button>
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
  inject: ["reload"],
  data() {
    return {
      page: 1,
      everyNum: 10,
      articles: [],
      search: null,
      isSearch: false
    };
  },
  created() {},
  components: {},
  methods: {
    onSearchArtList() {
      let page = this.page;
      let everyNum = this.everyNum;
      let title;
      let simpleContent;
      let tags;
      if (this.isSearch) {
        title = this.search;
        simpleContent = this.search;
        tags = this.search;
      }
      let params = { page, everyNum, title, simpleContent, tags };
      console.log("SearchArtList", params);
      this.axios.get("/article/queryList", { params }).then(res => {
        if (res.status == 200) {
          this.articles = res.data.data;
        }
      });
    },
    changePage(num) {
      this.page = this.page + num;
    },
    onArtComment(_id) {
      this.$router.push({
        path: "/Home/artComment",
        query: {
          // _id,
          _id
        }
      });
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
      this.axios.post("/article/remove", { _id }).then(res => {
        if (res.status == 200) {
          this.$notify({
            title: "成功",
            message: "文章【" + title + "】删除成功",
            type: "success"
          });
          this.reload();
        }
      });
    }
  },
  watch: {
    page: {
      handler() {
        this.onSearchArtList();
      },
      immediate: true
    },
    isSearch() {
      this.onSearchArtList();
    }
  }
};
</script>

<style lang="scss" >
.artList-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  height: 820px;
  // .search-container {
  //   padding: 20px 0px 20px 20px;
  //   .search-content {
  //     width: 200px;
  //   }
  // }
  .tb .cell {
  }
  .btn-container {
    padding: 10px;
    float: right;
  }
}
</style>
