<template>
  <div>
    <div class="title">绑定手机</div>
    <div class="bind_con">
      <el-form :model="phoneInfo" :rules="rule" ref="ruleForm" label-width="100px">
        <el-form-item label="登录名：">
          {{userInfo.mobile_phone | formatPhone}}
        </el-form-item>
        <el-form-item label="旧手机号：" prop="oldPhone">
          <el-input v-model="phoneInfo.oldPhone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="新手机号：" prop="phone">
          <el-input v-model="phoneInfo.phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="code">
          <el-input v-model="phoneInfo.code">
            <el-button v-if="is_send" slot="append" @click.native="getCode" :disabled="is_send_code">发送验证码</el-button>
            <el-button v-else slot="append">{{count}}s重试</el-button>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">绑定</el-button>
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
      // 校验旧手机号
      var checkOldPhone = (rule, value, callback) => {
        if (value == '') {
          callback(new Error("请输入手机号"))
        } else {
          if (this.phoneInfo.oldPhone == this.userInfo.mobile_phone) {
            callback()
          } else {
            callback(new Error("请输入正确的手机号"))
          }
        }
      }
      // 校验手机号
      var checkphone = async (rule, value, callback) => {
        if (value == '') {
          callback(new Error("请输入手机号"))
        } else {
          // 校验手机号是否正确
          let reg_phone = /^[1][3,4,5,7,8][0-9]{9}$/
          if (reg_phone.test(this.phoneInfo.phone)) {
            let {
              data: check_phone_res
            } = await this.$http.post("/user/checkPhone", {
              phone: this.phoneInfo.phone
            })
            // 判断是否被注册
            if (check_phone_res.status == 400) {
              callback(new Error(check_phone_res.message))
            } else {
              this.is_send_code = false
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
          if (value == this.ecode) {
            callback()
          } else {
            callback(new Error("验证码错误"))
          }
        }
      };
      // 校验邮箱
      var checkemail = async (rule, value, callback) => {
        if (value == '') {
          callback(new Error("请输入邮箱地址"))
        } else {
          // 校验邮箱格式是否正确
          let reg_email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
          if (reg_email.test(this.emailInfo.email)) {
            let {
              data: result
            } = await this.$http.post('/user/checkEmail', {
              email: this.emailInfo.email
            })
            if (result.status != 200) return callback("邮箱已绑定")
            callback()
          } else {
            callback(new Error("请输入正确的邮箱"))
          }
        }
      };
      return {
        phoneInfo: {
          oldPhone: '',
          phone: '',
          code: ''
        },
        is_send_code: true,
        ecode: '',
        is_send: true,
        count: 30,
        rule: {
          oldPhone: [{
            validator: checkOldPhone,
            trigger: 'blur'
          }],
          phone: [{
            validator: checkphone,
            trigger: 'blur'
          }],
          code: [{
            validator: checkcode,
            trigger: 'blur'
          }],
        }
      }
    },
    methods: {
      // 获取随机验证码
      async getCode() {
        let {
          data: result
        } = await this.$http.post("/user/sendCode")
        this.ecode = result.code
        this.is_send = false
        this.$message.success("您的验证码：" + this.ecode)
        let timeId = setInterval(() => {
          this.count--
          if (this.count == 0) {
            clearInterval(timeId)
            this.is_send = true
          }
        }, 1000)
        // console.log(result);
      },
      //   绑定
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let {
              data: result
            } = await this.$http.post("/user/modifyPhone", {
              phoneInfo: this.phoneInfo,
              userId: this.userInfo.customer_id
            })
            console.log(result);
            if (result.status != 200) return this.$message.error("绑定失败")
            this.$message.success("绑定成功")
            await this.$store.dispatch("getUserInfoById", {
              id: this.userInfo.customer_id
            })
            this.$router.push("/user/securityCentre")
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
  }

</script>
<style scoped>
  .title {
    background-color: #F3F8FE;
    font-size: 10px;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    font-weight: bold;
  }

  .bind_con {
    width: 500px;
    margin: 40px 0 0 40px;
  }

</style>
