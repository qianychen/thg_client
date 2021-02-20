<template>
  <div>
    <el-input prefix-icon="el-icon-mobile-phone" placeholder="请输入手机号" v-model="accout"></el-input>
    <el-input prefix-icon="el-icon-lock" placeholder="请输入验证码" v-model="password" maxlength="6">
      <el-button slot="append">获取验证码</el-button>
      <!-- <el-button slot="append">30s后重试</el-button> -->
    </el-input>
    <el-button>登录</el-button>
    <div class="register">
      <span>免费注册</span>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        accout: '',
        password: ''
      }
    }
  }

</script>
<style scoped>
  .el-input {
    margin: 15px 0;
  }

  .el-button {
    width: 100%;
    color: white;
    background-color: #FF4400;
  }

  .register {
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    cursor: pointer;
    margin-top: 5px;
  }

</style>
