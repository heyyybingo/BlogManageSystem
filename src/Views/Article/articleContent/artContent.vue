<template>
  <div class="artContent-container">
    <div v-html="content"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: ["content"],
  name: "",
  data() {
    return {};
  },
  components: {},
  methods: {}
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
