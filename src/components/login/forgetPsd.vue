<template>
  <div class="forget">
    <div class="title">忘记密码</div>
    <div class="bind_con">
      <el-form :model="psdInfo" :rules="rule" ref="ruleForm" label-width="100px">
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="psdInfo.phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="验证码:" prop="code">
          <el-input v-model="psdInfo.code" autocomplete="off" placeholder="验证码">
            <el-button slot="append" v-if="isSendBtn" :disabled="isSendCode" @click.native="sendcode">发送验证码
            </el-button>
            <el-button slot="append" v-else>{{count}}s后重试</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="pass">
          <el-input v-model="psdInfo.pass" maxlength="20" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkpass">
          <el-input v-model="psdInfo.checkpass" maxlength="20" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      // 校验手机号
      var checkphone = async (rule, value, callback) => {
        if (value == '') {
          callback(new Error("请输入手机号"))
        } else {
          // 校验手机号是否正确
          let reg_phone = /^[1][3,4,5,7,8][0-9]{9}$/
          if (reg_phone.test(this.psdInfo.phone)) {
            let {
              data: check_phone_res
            } = await this.$http.post("/user/checkPhone", {
              phone: this.psdInfo.phone
            })
            // 判断是否被注册
            if (check_phone_res.status == 400) {
              this.isSendCode = false
              callback()
            } else {
              callback(new Error('手机号未注册'))
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
          if (this.psdInfo.checkpass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      // 再次校验密码
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.psdInfo.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        codeNum: '',
        isSendCode: true,
        isSendBtn: true,
        count: 30,
        psdInfo: {
          phone: '',
          code: '',
          pass: '',
          checkpass: ''
        },
        rule: {
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
    created() {},
    methods: {
      //   绑定
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
              let {
                data: result
              } = await this.$http.post("/user/modifyPassWord", {
                psdInfo: this.psdInfo,
                userId: this.userInfo.customer_id
              })
              console.log(result);
              if (result.status != 200) return this.$message.error(result.message)
              this.$message.success(result.message)
              this.$router.push('/login/loginPsd')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
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
    },
    computed: {
      ...mapState(['userInfo'])
    },
  }

</script>
<style scoped>
  .forget {
    width: 400px;
    background-color: white;
    padding: 20px;
  }

  .title {
    background-color: #F3F8FE;
    font-size: 10px;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    margin-bottom: 10px;
  }

</style>
