<template>
  <div class="artContent-container">
    <div v-highlight v-html="content"></div>
  </div>
</template>

<script type="text/ecmascript-6">
// import "github-markdown-css";

import hljs from "highlight.js";
export default {
  props: ["content"],
  name: "",
  data() {
    return {};
  },
  computed: {},
  components: {},
  methods: {},
  created() {},
  directives: {
    highlight: el => {
      let blocks = el.querySelectorAll("pre code");
      blocks.forEach(block => {
        hljs.highlightBlock(block);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.artContent-container {
  margin-top: 20px;
  border-top: 1px solid #dcdfe6;
  height: 730px;
  width: 1590px;
  overflow: scroll;
  padding: 10px 10px 0 10px;
}
</style>
