<template>
  <div class="login-container">
    <el-form :model="form" :rules="rules" label-width="auto" ref="form" class="login-form">
      <!-- 标题 -->
      <h1>博客管理系统</h1>
      <!-- 填写用户名密码 -->
      <el-form-item label="用户名" prop="userName" class="login-input">
        <el-input v-model="form.userName" maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" class="login-input">
        <el-input v-model="form.password" maxlength="15"></el-input>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "",
  data() {
    return {
      form: {
        //表单信息
        userName: "",
        password: ""
      },
      rules: {
        // 表单规则
        userName: [
          { required: true, message: "请输入用户名信息", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  components: {},
  created() {
    if (sessionStorage.getItem("force")) {
      // 如果是强制登出的就不自动登录
      return;
    }
    this.login();
  },
  methods: {
    login() {
      let token = localStorage.getItem("token");
      console.log("token", token);
      if (token) {
        // 以前登录过，验证token有没有过期
        this.axios.post("/testLogin").then(res => {
          if (res.status == 200) {
            const h = this.$createElement;
            this.$notify({
              title: "提示",
              message: h("i", { style: "color: teal" }, "登录成功")
            });
            console.log(res.data.data);
            sessionStorage.setItem("user", JSON.stringify(res.data.data));
            this.$router.push("/Home");
          }
        });
      } else {
        console.log("第一次登录");
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let userName = this.form.userName;
          let password = this.form.password;
          let data = { userName, password };
          console.log(data);
          this.axios
            .post("/account/managerLogin", { userName, password })
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                // 登录成功
                // this.router.push("/Home");
                let token = res.data.data;
                localStorage.setItem("token", token);
                this.login();
                // const h = this.$createElement;
                // this.$notify({
                //   title: "提示",
                //   message: h("i", { style: "color: teal" }, "登录成功")
                // });
                // sessionStorage.setItem("user", JSON.stringify(res.data.data));
                // this.$router.push("/Home");
              } else {
                throw 1;
              }
            })
            .catch(err => {
              if (err.response && err.response.status == 403) {
                this.$message.error("用户名或密码错误");
              }
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  animation: enterAnimation 1s;

  @keyframes enterAnimation {
    0% {
      opacity: 0;
      margin-left: 10%;
    }
    100% {
      opacity: 1;
    }
  }
  .login-form {
    margin-top: 10%;
    text-align: center;
    height: 300px;
    width: 40%;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    h1 {
      font-family: "Helvetica Neue";
      color: #848c9c;
    }
    .login-input {
      width: 350px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
