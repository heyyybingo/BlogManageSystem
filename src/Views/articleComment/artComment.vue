<template>
  <div class="artComment">
    <el-page-header @back="goBack" content="文章评论"></el-page-header>
    <art-header
      :title="article.title"
      :createTime="article.createTime"
      :lastUpdateTime="article.lastUpdateTime"
      :favs="article.favs"
      :enters="article.enters"
      :author="article.author"
      :tags="article.tags"
      :_id="article._id"
      :simpleContent="article.simpleContent"
      v-loading="!isGetArticle"
    ></art-header>
    <comments :_id="_id" :isArt="true"></comments>
  </div>
</template>

<script type="text/ecmascript-6">
import artHeader from "../Article/articleHead/artHeader.vue";
import comments from "../../components/artComment/comments.vue";
export default {
  name: "",
  data() {
    return {
      _id: "",
      article: {},

      isGetArticle: false

      //   _id: this.$route.query._id
    };
  },
  components: { artHeader, comments },
  methods: {
    searchArtSimple() {
      let _id = this._id;
      console.log();
      let params = { _id };

      this.axios
        .get("/article/querySimple", { params })
        .then(res => {
          if (res.status == 200) {
            this.article = res.data.data;
            // this.$message({
            //   message: "获取文章信息成功"
            // });
            console.log("artComment", this.article);
            this.isGetArticle = true;
          }
        })
        .catch(err => {
          this.$message.error({
            message: "获取文章信息失败"
          });
          this.isGetArticle = true;
        });
    },

    goBack() {
      this.$router.back();
    }
  },

  created() {
    console.log("artComment Create");
    this._id = this.$route.query._id;
    this.searchArtSimple();
    // console.log("artComment", this.$route.query._id);
  }
};
</script>

<style lang="scss" scoped>
</style>
