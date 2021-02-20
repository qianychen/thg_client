<template>
  <el-card class="login">
    <div>
      <div class="login_way">
        <span class="chose">密码登录</span>
      </div>
      <el-input prefix-icon="el-icon-user-solid" placeholder="手机号/邮箱" v-model="accout"></el-input>
      <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="password" show-password
        @keyup.enter.native="login"></el-input>
      <el-button @click="login">登录</el-button>
      <div class="forget">
        <span @click="switchPage('/login/forgetPsd')">忘记密码</span>
        <span @click="switchPage('/register')">免费注册</span>
        <span @click="switchPage('/login/loginAdmin')">管理员登录</span>
      </div>
    </div>
  </el-card>
</template>
<script>
  export default {
    data() {
      return {
        accout: '',
        password: '',
        type: ''
      }
    },
    methods: {
      switchPage(path){
        this.$router.push(path)
      },
      // 登录
      async login() {
        let res_phone = /^[1][3,4,5,7,8][0-9]{9}$/
        let reg_email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        // 正则校验是邮箱还是手机号
        if (res_phone.test(this.accout)) {
          this.type = 'phone'
        } else if (reg_email.test(this.accout)) {
          this.type = 'email'
        } else {
          this.$message({
            message: '请输入正确的手机号或邮箱',
            type: 'error'
          })
          return
        }
        // console.log(this.type);
        // 请求登录
        let result = await this.$store.dispatch("login", {
          accout: this.accout,
          password: this.password,
          type: this.type
        })
        // 提示信息
        switch (result.status) {
          case 200:
            this.$message({
              message: '登陆成功',
              type: 'success'
            })

            this.$router.push('/')
            break
          case 400:
            this.$message({
              message: '用户名不存在',
              type: 'error'
            })
            break
          case 401:
            this.$message({
              message: '密码错误',
              type: 'error'
            })
            break
        }
        console.log(result);
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

  .forget {
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    cursor: pointer;
    margin-top: 5px;
  }

  .login {
    width: 400px;
    height: 300px;
  }

  .login_way {
    height: 30px;
    font-size: 18px;
    font-weight: bold;
  }

  .login_way span {
    padding-bottom: 3px;
    cursor: pointer;
  }

  .chose {
    border-bottom: 2px solid black;
  }

</style>
