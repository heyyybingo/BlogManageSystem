<template>
  <div class="artForm-container">
    <el-form :model="article" label-width="80px">
      <div class="header-content">
        <el-form-item label="文章标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>

        <el-form-item label="标签" v-model="article.tags">
          <el-tag
            v-for="(val,key) in article.tags"
            :key="key"
            closable
            @close="OnRemoveTag(key)"
            style="user-select:none;"
          >{{val}}</el-tag>
        </el-form-item>

        <el-form-item label="添加标签">
          <el-button icon="el-icon-plus" circle @click="drawer = true"></el-button>
        </el-form-item>
      </div>
      <el-card>
        <mavon-editor
          v-model="article.content"
          ref="md"
          @change="change"
          style="min-height: 600px"
        />
      </el-card>
      <el-form-item>
        <el-button type="primary" @click="OnCreate" v-if="!isUpdate">立即创建</el-button>
        <el-button type="primary" @click="OnUpdate" v-if="isUpdate">更新</el-button>
        <el-button @click="OnBack">取消</el-button>
      </el-form-item>
    </el-form>

    <el-drawer
      title="标签列表"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <el-checkbox-group v-model="newtags">
        <el-tag
          v-for="(item) in tags"
          :key="item._id"
          style="width:40%;margin:5px 0 5px 15px;overflow:hidden;"
        >
          <el-checkbox :label="item.tagName"></el-checkbox>
        </el-tag>

        <el-button
          type="primary"
          style="position:absolute;left:10px;bottom:10px;"
          @click="OnAddTags"
        >确认</el-button>
      </el-checkbox-group>
    </el-drawer>
  </div>
</template>

<script type="text/ecmascript-6">
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  props: ["isUpdate", "article"],
  name: "",
  data() {
    return {
      drawer: false,
      tags: ["nodejs", "helloword", "heyyybingo", "sbsbsbsbs"],
      newtags: [],
      direction: "rtl",
      editorOption: {}
    };
  },

  components: { mavonEditor },
  methods: {
   

    OnCreate() {
      // alert(
      //   this.article.title +
      //     " " +
      //     this.article.tags +
      //     " " +
      //     this.article.content
      // );
      let title = this.article.title;
      let tags = this.article.tags;
      let content = this.article.content;
      this.axios.post("/article/create", { title, tags, content }).then(res => {
        if (res.status == 200) {
          this.$notify({
            title: "成功",
            message: "文章【" + title + "】创建成功",
            type: "success"
          });
          let _id = res.data.data;
          this.$router.push({
            path: "/Home/article",
            query: {
              _id
            }
          });
        }
      });
    },
    OnUpdate() {
      // 更新文章
      let _id = this.article._id;
      let title = this.article.title;
      let tags = this.article.tags;
      let content = this.article.content;
      this.axios
        .post("/article/create", { _id, title, tags, content })
        .then(res => {
          if (res.status == 200) {
            this.$notify({
              title: "成功",
              message: "文章【" + title + "】创建成功",
              type: "success"
            });
            let _id = res.data.data;
            this.$router.push({
              path: "/Home/article",
              query: {
                _id
              }
            });
          }
        });
    },
    OnAddTags() {
      // 给文章插入标题，
      // alert(this.newtags);
      for (let tag of this.newtags) {
        this.article.tags.push(tag);
      }

      this.drawer = false;
    },
    OnBack() {
      this.$router.back();
    },
    OnRemoveTag(key) {
      this.article.tags.splice(key, 1);
    },
    handleClose(done) {
      // 关闭右侧抽屉
      done();
    },
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text);
      this.content = html;
    }
  },
  created() {
    this.axios.get("/tags/query", {}).then(res => {
      if (res.status == 200) {
        this.tags = res.data.data;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.artForm-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 10px 30px 10px 30px;
  width: 1500px;
  .header-content {
    width: 500px;
  }

  .el-card {
    padding-bottom: 30px;
    margin-bottom: 30px;
    .quill-editor {
      height: 500px;
    }
  }
}
</style>
