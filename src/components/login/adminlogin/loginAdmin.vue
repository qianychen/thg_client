<template>
  <div class="admin_login">
    <div class="admin_title">管理员登录</div>
    <el-form :model="adminInfo" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="管理员账号" prop="account">
        <el-input v-model="adminInfo.account"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="adminInfo.password" @keyup.enter.native="submitForm('ruleForm')" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登陆</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        adminInfo: {
          account: '',
          password: ''
        },
        rules: {
          account: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let {
              data: result
            } = await this.$http.post("/admin/login", {
              adminInfo: this.adminInfo
            })
            switch (result.status) {
              case 200:
                this.$store.commit('setToken', result.token)
                this.$router.push('/admin')
                this.$message.success("登陆成功")

                break
              case 400:
                this.$message.error("管理员不存在")
                break
              case 401:
                this.$message.error("密码错误")
                break
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }

</script>
<style scoped>
  .admin_login {
    width: 300px;
    padding: 20px;
    background-color: white;
  }

  .admin_title {
    width: 100px;
    font-size: 20px;
    margin: 0 auto;
    margin-bottom: 15px;
  }

</style>
