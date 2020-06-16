<template>
  <div class="article-container">
    <el-page-header @back="goBack" content="修改文章"></el-page-header>
    <art-form :isUpdate="true" :article="article"></art-form>
  </div>
</template>

<script type="text/ecmascript-6">
import artForm from "../../components/articleForm/index.vue";
export default {
  name: "",
  data() {
    return {
      article: {
        title: "helloword",
        tags: [],
        content: "<h2>I am Example</h2>",
        simpleContent: "简要内容"
      }
    };
  },
  components: { artForm },
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
