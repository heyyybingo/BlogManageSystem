<template>
  <div class="article-container">
    <el-page-header @back="goBack" content="文章详情"></el-page-header>
    <artHeader
      :title="article.title"
      :createTime="article.createTime"
      :lastUpdateTime="article.lastUpdateTime"
      :favs="article.favs"
      :enters="article.enters"
      :author="article.author"
      :tags="article.tags"
      :_id="article._id"
      :simpleContent="article.simpleContent"
    ></artHeader>
    <artContent :content="article.content"></artContent>
  </div>
</template>

<script type="text/ecmascript-6">
import artHeader from "./articleHead/artHeader.vue";
import artContent from "./articleContent/artContent.vue";
import { mavonEditor } from "mavon-editor";
export default {
  name: "",
  data() {
    return {
      article: [],
      author: "..."
    };
  },
  components: { artHeader, artContent },
  methods: {
    goBack() {
      this.$router.back();
    }
  },
  created() {
    let _id = this.$route.query._id;
    let params = { _id };
    this.axios
      .get("/article/query", { params })
      .then(res => {
        if (res.status == 200) {
          this.article = res.data.data;
          let md = mavonEditor.getMarkdownIt();

          this.article.content = md.render(this.article.content);
          console.log(this.article);
          //
          // let params = { authorId };
        }
      })
      .catch(err => {
        this.$notify.error({
          title: "错误",
          message: "获取信息失败！检查服务端是否异常"
        });
      });
  }
};
</script>

<style lang="scss" scoped>
.article-container {
  .el-page-header {
    padding: 1em 0 1em 0;
  }
}
</style>
