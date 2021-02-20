<template>
  <el-container class="container">
    <el-header class="admin_header">
      <div class="login_header">
        <img src="../../assets/images/logo.png"></img>
        特惠购后台管理系统
      </div>
      <div class="login_out">
        <span @click="login0ut">退出</span>
      </div>
    </el-header>
    <el-container>
      <el-aside class="side" width="200px">
        <div>
          <el-menu router :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen"
            @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">

            <el-menu-item index="/admin/account">
              <i class="el-icon-menu"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/goods">
              <i class="el-icon-menu"></i>
              <span slot="title">商品管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/cate">
              <i class="el-icon-menu"></i>
              <span slot="title">分类管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/comment">
              <i class="el-icon-menu"></i>
              <span slot="title">评论管理</span>
            </el-menu-item>

          </el-menu>
        </div>
      </el-aside>
      <el-main class="admin_main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>
<script>
  export default {
    methods: {
      login0ut() {
        this.$store.commit("clearToken")
        this.$router.push("/")
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }

</script>
<style scoped>
  .container {
    height: 100vh;
  }

  .admin_header {
    height: 60px;
    line-height: 60px;
    padding-left: 50px;
    font-size: 20px;
    background-color: #545C64;
    font-weight: bold;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .login_header {
    margin-top: 10px;
    display: flex;
    align-items: center;
  }

  .admin_header img {
    height: 60px;
  }

  .login_out {
    cursor: pointer;
  }

  .side {
    background-color: #545C64;
  }

  .admin_main {
    height: 91vh;
    background-color: white;
  }

</style>
