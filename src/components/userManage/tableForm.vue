<template>
  <div>
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
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="userName" label="用户名" width="280"></el-table-column>
      <el-table-column prop="password" label="密码" width="280"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="280"></el-table-column>
      <el-table-column label="角色" width="180">
        <template slot-scope="scope">
          <span>{{roleName(scope.row.role)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            @change="onChangeState(scope.row._id,scope.row.state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-button
            @click="onUpdate(scope.row._id,scope.row.userName,scope.row.password,scope.row.email,scope.row.role,scope.row.state)"
          >编辑</el-button>
          <el-popconfirm
            :title="'确定删除'+scope.row.userName+'吗？'"
            @onConfirm="onRemoveUser(scope.row._id)"
          >
            <el-button slot="reference" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px">
      <el-button @click="dialogVisible=true;isUpdate=false">创建{{user=='Manager'?'管理员':'新用户'}}</el-button>
      <el-button style="float:right" @click="page=page+1" v-show="user.length>=everyNum">下一页</el-button>
      <el-button style="float:right" @click="page=page-1" v-show="page!=1">上一页</el-button>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      v-loading="formLoading"
    >
      <div style="display:flex;justify-content:center;">
        <el-form
          :model="form"
          :rules="rules"
          ref="addUserForm"
          label-width="80px"
          style="width:70%;"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" :disabled="isUpdate"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="管理权限" prop="role" v-if="user=='Manager'|isUpdate">
            <el-select v-model="form.role" placeholder="请选择">
              <el-option
                v-for="i in options.filter((item)=>{return item<userRole&&(item!=0||isUpdate)})"
                :key="i"
                :label="roleName(i)"
                :value="i"
              ></el-option>
            </el-select>
            <!-- <el-select v-model="form.role" placeholder="请选择" v-if="isUpdate">
              <el-option
                v-for="i in options.filter((item)=>{return item<userRole})"
                :key="i"
                :label="roleName(i)"
                :value="i"
              ></el-option>
            </el-select>-->
          </el-form-item>
        </el-form>
      </div>
      <div style="display:flex;justify-content:flex-end;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddUser('addUserForm')" v-if="!isUpdate">提交</el-button>
        <el-button type="primary" @click="onUpdateUser('addUserForm')" v-if="isUpdate">提交修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import roles from "../../lib/js/roles.js";
export default {
  props: ["user"],
  name: "",
  inject: ["reload"],
  data() {
    return {
      userRole: JSON.parse(sessionStorage.getItem("user")).role,
      options: [0, 1, 2, 10],
      formLoading: false,
      form: {
        _id: null,
        userName: null,
        password: null,
        email: null,
        state: null,
        role: null
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 18, message: "长度在 3 到 18 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 18, message: "长度在 3 到 18 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请检查邮箱格式", trigger: "blur" }
        ],
        role: [{ required: true, message: "请选择权限", trigger: "blur" }]
      },
      dialogVisible: false,
      users: [
        {
          userName: "test1",
          password: "123445",
          email: "xxxx@xxx.com",
          state: true,
          role: "管理员"
        }
      ],
      page: 1,
      everyNum: 10,
      search: "",
      isSearch: false,
      isUpdate: false
    };
  },

  components: {},
  methods: {
    roleName(num) {
      return roles(num);
    },
    onChangeState(_id, state) {
      this.axios
        .post("/user/updateUser", { _id, state })
        .then(res => {
          if (res.status == 200) {
            this.$message({
              message: "状态修改成功",
              type: "success"
            });
            this.reload();
          }
        })
        .catch(err => {
          if (err.response && err.response.status == 404) {
            this.$message.error({
              message: "修改失败，该用户已被删除或不存在"
            });
          }
          console.log(err);
        });
    },
    onUpdateUser(formName) {
      let _id = this.form._id;
      let userName = this.form.userName;
      let password = this.form.password;
      let email = this.form.email;
      let role = this.form.role;
      let state = this.form.state;
      let data = { _id, userName, password, email, role, state };
      console.log("onUpdateUser", data);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formLoading = true;
          this.axios
            .post("/user/updateUser", data)
            .then(res => {
              if (res.status == 200) {
                this.$message({
                  message: "创建成功",
                  type: "success"
                });
                this.reload();
              }
            })
            .catch(err => {
              if (err.response && err.response.status == 404) {
                this.$message.error({
                  message: "删除失败，该用户已经被删除或不存在"
                });
              }

              this.formLoading = false;
              this.dialogVisible = false;
            });
        } else {
          this.$message.error("请检查输入信息");
        }
      });
    },
    onUpdate(_id, userName, password, email, role, state) {
      this.form._id = _id;
      this.form.userName = userName;
      this.form.password = password;
      this.form.email = email;
      this.form.role = role;
      this.form.state = state;
      this.isUpdate = true;
      this.dialogVisible = true;
    },
    onRemoveUser(id) {
      let _id = id;
      this.axios
        .post("/user/removeUser", { _id })
        .then(res => {
          if (res.status == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.reload();
          }
        })
        .catch(err => {
          if (err.response && err.response.status == 404) {
            this.$message.error({
              message: "删除失败，该用户已经被删除或不存在"
            });
          }
          console.log(err);
        });
    },
    onAddUser(formName) {
      let userName = this.form.userName;
      let password = this.form.password;
      let email = this.form.email;
      let role = this.form.role;
      let data = { userName, password, email, role };
      console.log(data);
      let url = "/user/add" + this.user;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formLoading = true;
          this.axios
            .post(url, data)
            .then(res => {
              // console.log(result);
              console.log("then res", res);
              if (res.status == 200) {
                console.log(res.data);

                this.$message({
                  message: "创建成功",
                  type: "success"
                });
                this.reload();
              }
              this.formLoading = false;
              this.dialogVisible = false;
            })
            .catch(err => {
              console.log("catch err", err);
              if (err.response && err.response.status == 403) {
                this.$message.error("用户名重复！请重试！");
              }

              this.formLoading = false;
              this.dialogVisible = false;
            });
        } else {
          this.$message.error("请检查输入信息");
        }
      });
    },
    searchUser() {
      console.log(this.user);
      let page = this.page;
      let everyNum = this.everyNum;
      let userName;
      let email;
      let role = this.userRole;
      if (this.isSearch) {
        userName = this.search;
        email = this.search;
      }

      let data = { page, everyNum, userName, email, role };
      let url = "/user/find" + this.user;
      console.log("searchUser", data);
      this.axios
        .post(url, data)
        .then(result => {
          console.log(result);
          if (result.status == 200) {
            this.users = result.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addUser() {}
  },

  watch: {
    page: {
      handler(nval) {
        console.log(nval);
        this.searchUser();
      },
      immediate: true
    },
    isSearch(nval) {
      console.log(nval);
      this.searchUser();
    }
  },
  created() {
    // let user = JSON.parse(sessionStorage.getItem("user"));
    // this.userRole = user.role;
    // console.log("userRole", this.userRole);
  }
};
</script>

<style lang="scss" scoped>
</style>
