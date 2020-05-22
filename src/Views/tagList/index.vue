<template>
  <div class="tags-container">
    <div class="tagList-container">
      <div class="search-container">
        <el-input class="search-content" placeholder="输入标签名"></el-input>
        <el-button icon="el-icon-search" circle></el-button>
        <el-button icon="el-icon-plus" circle style="margin-left:200px;" @click="OnAddTag">添加</el-button>
      </div>
      <el-table :data="tags" height="700px" :row-style="{height:'70px'}">
        <el-table-column prop="tagName" label="标签名" width="220"></el-table-column>
        <el-table-column prop="hot" label="热度" width="220"></el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button @click="OnUpdateTag(scope.row)">修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="OnRemoveTag(scope.row._id,scope.row.tagName)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="btn-container">
        <el-button @click="changePage(-1)" v-if="page>1">上一页</el-button>
        <el-button @click="changePage(1)" v-if="tags.length!=0">下一页</el-button>
      </div>
    </div>
    <div class="update-form" v-show="isUpdateTag">
      <i class="el-icon-close" @click="CloseUpdate"></i>
      <el-form>
        <el-form-item label="标签名">
          <el-input v-model="tag.tagName"></el-input>
        </el-form-item>
        <el-form-item label="热度">
          <el-input v-model="tag.hot" type="number"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="UpdateTag()">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "",
  data() {
    return {
      isUpdateTag: false,
      page: null,
      everyNum: 10,
      tags: [
        {
          _id: "5eb3a5a0e4f16c43a7d6fcd6",
          tagName: "mongodb",
          hot: 0,
          __v: 0
        },
        {
          _id: "5eb3a591e4f16c43a7d6fcd5",
          tagName: "hellojs",
          hot: 0,
          __v: 0
        },
        {
          _id: "5eb3a580e4f16c43a7d6fcd4",
          tagName: "nodejs",
          hot: 0,
          __v: 0
        }
      ],
      tag: {
        _id: "",
        tagName: "",
        hot: 0
      }
    };
  },
  watch: {
    page(val) {
      console.log(val);
      let page = val;
      let everyNum = this.everyNum;
      let params = { page, everyNum };
      this.axios.get("/tags/query", { params }).then(res => {
        if (res.status == 200) {
          this.tags = res.data.data;
        }
      });
    }
  },
  components: {},
  created() {
    this.page = 1;
  },

  methods: {
    changePage(num) {
      this.page = this.page + num;
    },
    OnUpdateTag(tag) {
      this.tag = tag;
      this.isUpdateTag = true;
    },
    UpdateTag() {
      let tagId = this.tag._id;
      let tagName = this.tag.tagName;
      let hot = this.tag.hot;
      this.axios
        .post("/tags/update", { tagId, tagName, hot })
        .then(res => {
          if (res.status == 200) {
            this.$notify({
              title: "成功",
              message: "标签【" + tagName + "】更新成功",
              type: "success"
            });
            let page = this.page;
            let everyNum = this.everyNum;
            let params = { page, everyNum };
            return this.axios.get("/tags/query", { params });
          }
        })
        .then(res => {
          if (res.status == 200) {
            this.tags = res.data.data;
          }
        });
    },
    OnRemoveTag(tagId, tagName) {
      this.axios
        .post("/tags/remove", { tagId })
        .then(res => {
          if (res.status == 200) {
            this.$notify({
              title: "成功",
              message: "标签【" + tagName + "】删除成功",
              type: "success"
            });
            let page = this.page;
            let everyNum = this.everyNum;
            let params = { page, everyNum };
            return this.axios.get("/tags/query", { params });
          }
        })
        .then(res => {
          if (res.status == 200) {
            this.tags = res.data.data;
          }
        });
    },
    OnAddTag() {
      this.$prompt("清输入标签名", "创建标签", {
        confirmButtonText: "提交",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        let tagName = value;
        this.axios
          .post("/tags/create", { tagName })
          .then(res => {
            if (res.status == 200) {
              this.$notify({
                title: "成功",
                message: "标签【" + tagName + "】创建成功",
                type: "success"
              });
              let page = this.page;
              let everyNum = this.everyNum;
              let params = { page, everyNum };
              return this.axios.get("/tags/query", { params });
            }
          })
          .then(res => {
            if (res.status == 200) {
              this.tags = res.data.data;
            }
          });
      });
    },

    CloseUpdate() {
      this.isUpdateTag = false;
      this.tag = {};
    }
  }
};
</script>

<style lang="scss" scoped>
.tags-container {
  position: relative;
  width: 1500px;
  .tagList-container {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    width: 800px;
    .search-container {
      padding: 20px 0px 20px 20px;
      .search-content {
        width: 200px;
      }
    }
    .el-table {
      width: 700px;
      margin-left: auto;
      margin-right: auto;
    }
    .btn-container {
      padding: 10px;
      float: right;
    }
  }

  .update-form {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    padding: 50px;
    position: absolute;
    left: 800px;
    top: 30px;
    animation: UpdateForm 1s;
    .el-icon-close {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
  @keyframes UpdateForm {
    0% {
      opacity: 0;
      top: 0px;
    }
  }
}
</style>
