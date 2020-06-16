<template>
  <div class="comment-container">
    <div style="width:20%;">
      <el-tooltip
        class="item"
        effect="dark"
        content="输入搜索内容，回车或者失去焦点搜索，点击右侧x取消搜索结果"
        placement="top-start"
      >
        <el-input
          v-model="search"
          placeholder="请输入内容"
          @change="search.length?isSearch=true:isSearch=false"
        >
          <i class="el-icon-search el-input__icon" slot="suffix" v-show="!isSearch"></i>

          <i
            class="el-icon-close el-input__icon"
            slot="suffix"
            @click="isSearch=false;search=''"
            v-show="isSearch"
            style="cursor:pointer;"
          ></i>
        </el-input>
      </el-tooltip>
    </div>
    <el-table :data="comment" style="width: 100%">
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
                  @click="onReply(props.row._id,replies.row.from._id,replies.row.from.userName,props.row.article.title)"
                >回复</el-button>
                <el-button size="small" type="danger" circle>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="文章" prop="article.title"></el-table-column>
      <el-table-column label="评论人" prop="user.userName"></el-table-column>
      <el-table-column label="评论内容" prop="content"></el-table-column>
      <el-table-column label="评论时间">
        <template slot-scope="scope">{{scope.row.createTime|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <span>{{props.replies}}</span> -->
          <el-button
            @click="onReply(scope.row._id,scope.row.user._id,scope.row.user.userName,scope.row.article.title)"
          >回复</el-button>
          <el-button type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
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
  inject: ["reload"],
  data() {
    return {
      comment: [],
      page: 1,
      everyNum: 10,
      isSearch: false,
      search: null
    };
  },
  components: {},
  methods: {
    onReply(commentId, to, userName, title) {
      this.$prompt("回复给:" + userName, title, {
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
            this.reload();
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

    searchComment() {
      let page = this.page;
      let everyNum = this.everyNum;
      let userName;
      let title;
      if (this.isSearch) {
        userName = this.search;
        title = this.search;
      }
      let params = { page, everyNum, userName, title };
      this.axios
        .get("/comRep/queryList", { params })
        .then(res => {
          if (res.status == 200) {
            this.comment = res.data.data;
            console.log("comment", this.comment);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    page: {
      handler(nval) {
        if (nval <= 0) {
          return;
        }
        this.searchComment();
      },
      immediate: true
    },
    isSearch() {
      this.searchComment();
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
.comment-container {
  width: 100%;
}
</style>
