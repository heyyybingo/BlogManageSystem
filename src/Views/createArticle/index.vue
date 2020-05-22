<template>
  <div class="article-container">
    <art-form :isUpdate="false" :article="article"></art-form>
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
        content: "<h2>I am Example</h2>"
      }
    };
  },
  components: { artForm },
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
