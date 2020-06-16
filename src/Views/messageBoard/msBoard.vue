<template>
  <div class="msBoard">
    <div class="boardList">
      <!-- 板块列表 -->
      <el-table
        :data="boards"
        :row-class-name="tableRowClassName"
        height="250"
        @row-click="rowClick"
      >
        <el-table-column label="版块ID" prop="boardId"></el-table-column>
        <el-table-column label="名称" prop="title"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{scope.row.createTime|dateFormat}}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="onUpdateBoard(scope.row._id,scope.row.boardId,scope.row.title)"
              v-if="scope.row.boardId!=0"
            >编辑</el-button>
            <el-popconfirm
              confirmButtonText="好的"
              cancelButtonText="不用了"
              icon="el-icon-info"
              iconColor="red"
              title="这是一段内容确定删除吗？"
              @onConfirm="onRemove(scope.row._id)"
              v-if="scope.row.boardId!=0"
            >
              <el-button slot="reference" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <!-- <el-button >切换第二、第三行的选中状态</el-button> -->
        <el-button @click="dialogVisible=true;isUpdate=false;">添加板块</el-button>
      </div>
    </div>
    <el-divider>板块评论</el-divider>
    <div style="margin-top: 20px" class="boardComment">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{title}}</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <comments :_id="_id" :isArt="false" v-if="showComments" @commentReload="commentReload"></comments>
      </el-card>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <!--  -->
      <el-form
        :model="form"
        label-width="80px"
        style="width:70%;margin-left:auto;margin-right:auto;"
        ref="boardForm"
        :rules="rules"
      >
        <el-form-item label="板块ID" prop="boardId">
          <el-input v-model.number="form.boardId" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="板块名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onAddBoard('boardForm')" v-show="!isUpdate">创建</el-button>
          <el-button type="primary" @click="onUpdate('boardForm')" v-show="isUpdate">提交修改</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import moment from "moment";
import comments from "../../components/artComment/comments.vue";
export default {
  name: "",
  inject: ["reload"],
  data() {
    return {
      isUpdate: false,
      dialogVisible: false,
      showComments: true,
      form: {
        _id: "",
        boardId: 0,
        title: "默认板块"
      },
      rules: {
        boardId: [
          { required: true, message: "请输入板块ID", trigger: "blur" },
          {
            type: "number",
            message: "请输入数字",
            trigger: "blur"
          }
        ],
        title: [
          { required: true, message: "请输入板块名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },
      boards: [],
      comments: [],
      _id: null,
      title: ""
    };
  },
  components: { comments },
  methods: {
    commentReload() {
      this.showComments = false;
      this.$nextTick(() => {
        this.showComments = true;
      });
    },
    rowClick(row) {
      console.log(row);
      this._id = row.boardId;
      this.title = row.title;
    },
    tableRowClassName({ row, rowIndex }) {
      //   console.log("row", row);
      if (row.boardId == 0) {
        return "liuyan-row";
      }
    },
    onRemove(_id) {
      let data = { _id };
      this.axios
        .post("/messageBoard/removeBoard", data)
        .then(res => {
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
          }

          this.reload();
        })
        .catch(err => {
          if (err.response && err.response.status == 403) {
            this.$message.error({
              message: "ID或名称重复"
            });
          }
          console.log(err);
        });
    },
    onAddBoard(formName) {
      let boardId = this.form.boardId;
      let title = this.form.title;
      let data = { boardId, title };
      console.log("onAddBoard", data);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .post("/messageBoard/addBoard", data)
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                this.$message({
                  type: "success",
                  message: "创建成功"
                });
              }

              this.reload();
            })
            .catch(err => {
              if (err.response && err.response.status == 403) {
                this.$message.error({
                  message: "ID或名称重复"
                });
              }
              console.log(err);
            });
        } else {
          this.$message.error({
            message: "请检查输入"
          });
        }
      });
    },
    onUpdate(formName) {
      let _id = this.form._id;
      let boardId = this.form.boardId;
      let title = this.form.title;
      let data = { boardId, title, _id };
      console.log("onUpdate", data);

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .post("/messageBoard/updateBoard", data)
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                this.$message({
                  type: "success",
                  message: "更新成功"
                });
              }
              this.reload();
            })
            .catch(err => {
              if (err.response && err.response.status == 403) {
                this.$message.error({
                  message: "ID或名称重复"
                });
              }
              console.log(err);
            });
        } else {
          this.$message.error({
            message: "请检查输入"
          });
        }
      });
      //   this.form._id = null;
      //   this.form.boardId = null;
      //   this.form.title = null;
    },
    onUpdateBoard(_id, boardId, title) {
      this.form._id = _id;
      this.form.boardId = parseInt(boardId);
      this.form.title = title;
      this.dialogVisible = true;
      this.isUpdate = true;
    }
  },
  created() {
    this.axios
      .get("/messageBoard/allBoards")
      .then(res => {
        if (res.status == 200) {
          this.boards = res.data.data;
          this._id = this.boards[0].boardId;
          this.title = this.boards[0].title;
          console.log(this.boards);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  watch: {
    dialogVisible(nval) {
      if (!nval) {
        this.form._id = "";
        this.form.boardId = 0;
        this.form.title = "默认排名";
      }
    }
  },
  filters: {
    dateFormat(val) {
      return moment(val).format("YYYY/MM/DD HH:mm:ss");
    }
  }
};
</script>

<style lang="scss" >
.msBoard {
  .boardList {
    .el-table .liuyan-row {
      background: oldlace;
    }
    //
  }
}
</style>
