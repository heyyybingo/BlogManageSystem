<template>
  <div>
    <mavon-editor v-model="content" ref="md" @change="change" style="min-height: 600px" />111
    <!-- <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    />-->
  </div>
</template>

<script type="text/ecmascript-6">
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";

// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";

// import { quillEditor } from "vue-quill-editor";
export default {
  props: ["content"],
  name: "",
  data() {
    return {
      //   content: "<h2>I am Example</h2>",
      editorOption: {
        // Some Quill options...
      }
    };
  },
  computed: {
    // editor() {
    //   return this.$refs.myQuillEditor.quill;
    // }
  },
  components: {
    // quillEditor
    mavonEditor
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
