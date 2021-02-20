<template>
  <!-- 顶部导航  [[ -->
  <div class="topbar" v-if="!$route.path.includes('/admin')">
    <el-row type="flex" justify="space-between" class="topbar_con">
      <!-- 左侧导航  [[ -->
      <el-col :span="4" class="topbar_l" v-if="token.length == 0">
        <el-link :underline="false" @click="switchPage('/login')">亲，请登录</el-link>&nbsp;
        <el-link type="danger" :underline="false" @click.native="switchPage('/register')">免费注册</el-link>
      </el-col>
      <!-- 用户登录后显示 -->
      <el-col :span="4" class="topbar_l" v-else>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{userInfo.nick_name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="switchPage('/user/info')">账号管理</el-dropdown-item>
            <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <!-- 左侧导航  ]] -->
      <!-- 右侧导航  [[ -->
      <el-col :span="8" class="topbar_r">
        <el-link href="/">惠购首页</el-link>&nbsp;
        <el-dropdown>
          <el-link :underline="false">
            我的惠购<i class="el-icon-arrow-down el-icon--right"></i>
          </el-link>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="toOrder">订单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>&nbsp;
        <el-link :underline="false">
          <i class="el-icon-shopping-cart-1"></i>
          <span @click="switchPage('/shopCart')">购物车</span>
        </el-link>&nbsp;
        <el-link :underline="false" @click="switchPage('/category')">商品分类</el-link>&nbsp;
        <el-link :underline="false" @click="switchPage('/help')">帮助中心</el-link>&nbsp;
      </el-col>
    </el-row>
    <!-- 右侧导航  ]] -->
  </div>
  <!-- 顶部导航  ]] -->
</template>
<script>
  import {
    mapState
  } from 'vuex'
  export default {
    name: 'App',
    methods: {
      // 页面跳转
      switchPage(path) {
        this.$router.push(path)
      },
      // 登出
      loginOut() {
        this.$store.commit("clearToken")
        this.$message({
          message: '退出成功',
          type: 'success'
        })
        this.$router.push('/')
      },
      toOrder(){
        this.$router.push({
          name: 'orderList',
          params: {
            tab: 'all'
          }
        })
      }
    },
    computed: {
      ...mapState(['token', 'userInfo'])
    },
  }

</script>
<style scoped>
  .topbar {
    width: 1519px;
    margin: 0 auto;
    background-color: #E3E4E5;
  }

  .topbar_con {
    width: 80%;
    min-width: 1100px;
    height: 30px;
    margin: 0 auto;
  }

  .el-link {
    font-size: 13px;
    line-height: 30px;

  }

  .topbar_l {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .topbar_r {
    display: flex;
    justify-content: flex-end;
  }

</style>
