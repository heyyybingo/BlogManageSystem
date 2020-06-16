<template>
  <div>
    <el-table :data="comment" style="width: 100%" v-loading="!isGetComment">
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- <span>{{props.replies}}</span> -->
          <el-table :data="props.row.replies">
            <el-table-column label="from" prop="from.userName"></el-table-column>
            <el-table-column label="to" prop="to.userName"></el-table-column>
            <el-table-column label="回复内容" prop="content"></el-table-column>
            <el-table-column label="时间" prop="createTime">
              <template slot-scope="replies">{{replies.row.createTime|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="replies">
                <!-- <span>{{props.replies}}</span> -->
                <el-button
                  circle
                  size="small"
                  @click="onReply(props.row._id,replies.row.from._id,replies.row.from.userName)"
                >回复</el-button>
                <el-popconfirm
                  confirmButtonText="好的"
                  cancelButtonText="不用了"
                  icon="el-icon-info"
                  iconColor="red"
                  title="这是一段内容确定删除吗？"
                  @onConfirm="onRemoveReply(replies.row._id)"
                >
                  <el-button slot="reference" type="danger" circle size="small">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!-- <el-table-column label="文章" prop="article.title"></el-table-column> -->
      <el-table-column label="评论人" prop="user.userName"></el-table-column>
      <el-table-column label="评论内容" prop="content"></el-table-column>
      <el-table-column label="评论时间">
        <template slot-scope="scope">{{scope.row.createTime|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <span>{{props.replies}}</span> -->
          <el-button @click="onReply(scope.row._id,scope.row.user._id,scope.row.user.userName)">回复</el-button>

          <el-popconfirm
            confirmButtonText="好的"
            cancelButtonText="不用了"
            icon="el-icon-info"
            iconColor="red"
            title="这是一段内容确定删除吗？"
            @onConfirm="onRemoveComment(scope.row._id)"
          >
            <el-button slot="reference" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="isArt?onAddComment():onAddBoardComment()">添加评论</el-button>
      <!-- <el-button @click="dialogVisible=true;isUpdate=false">创建{{user=='Manager'?'管理员':'新用户'}}</el-button> -->
      <el-button style="float:right" @click="page=page+1" v-show="comment.length>=everyNum">下一页</el-button>
      <el-button style="float:right" @click="page=page-1" v-show="page!=1">上一页</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import moment from "moment";
export default {
  name: "",
  props: ["_id", "isArt"],
  inject: ["reload"],
  data() {
    return { comment: [], page: 1, everyNum: 10, isGetComment: false };
  },
  components: {},
  methods: {
    onRemoveReply(replyId) {
      let data = { replyId };
      this.axios
        .post("/comRep/removeReply", data)
        .then(res => {
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
          }
          if (this.isArt) {
            this.reload();
          } else {
            this.$emit("commentReload");
          }
        })
        .catch(err => {
          if (err.response && err.response.status == 404) {
            this.$message.error({
              message: "删除失败"
            });
          }
          console.log(err);
        });
    },
    onRemoveComment(commentId) {
      let data = { commentId };
      this.axios
        .post("/comRep/removeComment", data)
        .then(res => {
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
          }
          if (this.isArt) {
            this.reload();
          } else {
            this.$emit("commentReload");
          }
        })
        .catch(err => {
          if (err.response && err.response.status == 404) {
            this.$message.error({
              message: "删除失败"
            });
          }
          console.log(err);
        });
    },
    onReply(commentId, to, userName) {
      this.$prompt("回复给:" + userName, "回复", {
        comfirmButtonText: "确认",
        cancelButtonText: "取消",
        inputValidator: str => {
          if (str.length < 3 || str.length > 255) {
            return "长度3-255字符之间";
          }
          return true;
        }
      }).then(({ value }) => {
        let content = value;
        let data = { commentId, to, content };
        console.log("addReply", data);
        this.axios
          .post("/comRep/addReply", data)
          .then(res => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "回复成功"
              });
            }
            if (this.isArt) {
              this.reload();
            } else {
              this.$emit("commentReload");
            }
          })
          .catch(err => {
            if (err.response && err.response.status == 403) {
              this.$message.error({
                message: "回复失败,该评论不存在或被删除"
              });
            }
          });
      });
    },
    onAddBoardComment() {
      this.$prompt("", "评论", {
        inputPlaceholder: "输入评论内容，3～255字符之间",
        inputValidator: str => {
          if (str.lengths < 3 || str.lengths > 255) {
            return "长度在3-255字符之间";
          }
          return true;
        }
      }).then(({ value }) => {
        let boardId = this._id;
        let content = value;
        let data = { boardId, content };
        this.axios
          .post("/messageBoard/addComments", data)
          .then(res => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "添加评论成功"
              });
            }
            // this.reload();
            this.$emit("commentReload");
          })
          .catch(err => {
            console.log(err);
            this.$message.error({
              message: "添加评论失败！"
            });
          });
      });
    },
    onAddComment() {
      this.$prompt("", "评论", {
        inputPlaceholder: "输入评论内容，3～255字符之间",
        inputValidator: str => {
          if (str.lengths < 3 || str.lengths > 255) {
            return "长度在3-255字符之间";
          }
          return true;
        }
      }).then(({ value }) => {
        let article = this._id;
        let content = value;
        let data = { article, content };
        this.axios
          .post("/comRep/addComment", data)
          .then(res => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "添加评论成功"
              });
            }
            this.reload();
          })
          .catch(err => {
            console.log(err);
            this.$message.error({
              message: "添加评论失败！"
            });
          });
      });
    },
    searchArtComment() {
      let article = this._id;
      let page = this.page;
      let everyNum = this.everyNum;
      let params = { article, page, everyNum };

      this.axios
        .get("/comRep/articleComments", { params })
        .then(res => {
          if (res.status == 200) {
            this.comment = res.data.data;
            this.isGetComment = true;
          }
        })
        .catch(err => {
          this.$message.error({
            message: "获取评论信息失败"
          });
          this.isGetComment = true;
        });
    },
    searchBoardComment() {
      let boardId = this._id;
      let page = this.page;
      let everyNum = this.everyNum;
      let params = { boardId, page, everyNum };

      this.axios
        .get("/messageBoard/queryById", { params })
        .then(res => {
          if (res.status == 200) {
            console.log(res.data.data);
            this.comment = res.data.data.comments;
            this.isGetComment = true;
          }
        })
        .catch(err => {
          console.log(err);
          //   this.$message.error({
          //     message: "获取评论信息失败"
          //   });
          this.isGetComment = true;
        });
    }
  },
  watch: {
    page: {
      handler() {
        this.comment = [];
        if (this.isArt) {
          this.searchArtComment();
        } else {
          this.searchBoardComment();
        }
      },
      immediate: true
    },
    _id(nval) {
      console.log("newid", nval);
      this.page = -1;
      this.$nextTick(() => {
        this.page = 1;
      });
    }
  },
  filters: {
    dateFormat(val) {
      return moment(val).format("YYYY/MM/DD HH:mm:ss");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
