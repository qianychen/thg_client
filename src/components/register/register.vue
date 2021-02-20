<template>
  <div class="register">
    <el-card class="register_con" align-center>
      <div class="logo">
        <img src="@/assets/images/logo.png" alt="" @click="toHome">
        <span>用户注册</span>
      </div>
      <hr>
      <div class="regi_main">
        <el-form :model="user" :rules="rules" ref="ruleForm" label-width="120px" hide-required-asterisk
          :status-icon="true">
          <el-form-item label="手机号:" prop="phone">
            <el-input v-model="user.phone" placeholder="请输入手机号" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="验证码:" prop="code">
            <el-input v-model="user.code" autocomplete="off" placeholder="验证码">
              <el-button slot="append" v-if="isSendBtn" :disabled="isSendCode" @click.native="sendcode">发送验证码
              </el-button>
              <el-button slot="append" v-else>{{count}}s后重试</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="登陆密码:" prop="pass">
            <el-input type="password" v-model="user.pass" autocomplete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认登陆密码:" prop="checkpass">
            <el-input type="password" v-model="user.checkpass" autocomplete="off" placeholder="再次输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      // 校验手机号
      var checkphone = async (rule, value, callback) => {
        if (value == '') {
          callback(new Error("请输入手机号"))
        } else {
          // 校验手机号是否正确
          let reg_phone = /^[1][3,4,5,7,8][0-9]{9}$/
          if (reg_phone.test(this.user.phone)) {
            let {
              data: check_phone_res
            } = await this.$http.post("/user/checkPhone", {
              phone: this.user.phone
            })
            // 判断是否被注册
            if (check_phone_res.status == 400) {
              callback(new Error(check_phone_res.message))
            } else {
              this.isSendCode = false
              callback()
            }
          } else {
            callback(new Error("请输入正确的手机号"))
          }
        }
      };
      // 校验验证码
      var checkcode = async (rule, value, callback) => {
        if (value == '') {
          callback(new Error("请输入验证码"))
        } else {
          if (value == this.codeNum) {
            callback()
          } else {
            callback(new Error("验证码错误"))
          }
        }
      };
      // 校验密码
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.user.checkpass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      // 再次校验密码
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.user.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        isSendCode: true,
        codeNum: null,
        count: 30,
        isSendBtn: true,
        user: {
          phone: '',
          code: '',
          pass: '',
          checkpass: ''
        },
        rules: {
          phone: [{
            validator: checkphone,
            trigger: 'blur'
          }],
          code: [{
            validator: checkcode,
            trigger: 'blur'
          }],
          pass: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkpass: [{
            validator: validatePass2,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      // 跳转主页
      toHome() {
        this.$router.push('/')
      },
      // 提交表单
      async submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let {
              data: regi_res
            } = await this.$http.post('user/register', this.user)
            if (regi_res.status == 200) {
              this.$message.success({
                message: regi_res.message
              })
              // this.$router.push('/login')
              // 注册成功提示账号(test)
              let str = '您的账号为：' + this.user.phone + '，密码为：' + this.user.pass
              this.$alert(str, '注册成功', {
                confirmButtonText: '前往登陆',
                callback: action => {
                  this.$router.push('/login')
                }
              });
            }else{
              this.$message.error("注册失败")
            }
          } else {
            return false;
          }
        });
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 发送验证码
      async sendcode() {
        this.isSendBtn = false
        let {
          data: code_res
        } = await this.$http.post('user/sendcode')
        this.codeNum = code_res.code
        setTimeout(() => {
          this.$message.success({
            message: '您的验证码为：' + code_res.code
          })
        }, 1000)

        // 按钮显示/隐藏
        let timeId = setInterval(() => {
          this.isSendBtn = false
          this.count--
          if (this.count == 0) {
            this.isSendBtn = true
            clearInterval(timeId)
            this.count = 30
          }
        }, 1000)
      }
    }
  }

</script>
<style scoped>
  .register {
    height: 82vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .register_con {
    min-width: 725px;

  }

  .regi_main {
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .logo {
    display: flex;
    align-items: center;
  }

  .logo img {
    width: 80px;
    height: 80px;
    margin: 10px;
    cursor: pointer;
  }

  .logo span {
    font-size: 25px;
    font-weight: bold;
  }

</style>
