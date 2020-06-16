<template>
  <div>
    <!-- <el-page-header content="用户管理"></el-page-header> -->

    <el-tabs v-model="activeName" @tab-click="saveClick()">
      <el-tab-pane label="普通用户" name="user">
        <userForm user="User"></userForm>
      </el-tab-pane>
      <el-tab-pane label="管理员" name="manager">
        <managerForm user="Manager"></managerForm>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import userForm from "../../components/userManage/tableForm.vue";
import managerForm from "../../components/userManage/tableForm.vue";
export default {
  name: "",
  data() {
    return {
      activeName: "user"
    };
  },
  components: { userForm, managerForm },
  methods: {
    saveClick() {
      sessionStorage.setItem("tabClick", this.activeName);
    }
  },
  created() {
    if (sessionStorage.getItem("tabClick")) {
      this.activeName = sessionStorage.getItem("tabClick");
    }
    console.log("activeName", this.activeName);
  }
};
</script>

<style lang="scss" scoped>
</style>
