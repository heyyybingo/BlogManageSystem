<template>
  <div class="article-container">
    <artHeader
      :title="article.title"
      :createTime="article.createTime"
      :lastUpdateTime="article.lastUpdateTime"
      :favs="article.favs"
      :enters="article.enters"
      :author="author"
      :tags="article.tags"
      :_id="article._id"
    ></artHeader>
    <artContent :content="article.content"></artContent>
  </div>
</template>

<script type="text/ecmascript-6">
import artHeader from "./articleHead/artHeader.vue";
import artContent from "./articleContent/artContent.vue";
export default {
  name: "",
  data() {
    return {
      article: [],
      author: "..."
    };
  },
  components: { artHeader, artContent },
  methods: {},
  created() {
    let _id = this.$route.query._id;
    let params = { _id };
    this.axios
      .get("/article/query", { params } )
      .then(res => {
        if (res.status == 200) {
          this.article = res.data.data;
          let authorId = this.article.authorId;
          let params = { authorId };
          return this.axios.get("/manager/getAuthor", { params });
        }
      })
      .then(res => {
        if (res.status == 200) {
          this.author = res.data.data;
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
</style>
