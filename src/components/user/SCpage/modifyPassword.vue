<template>
  <div>
    <div class="title">修改密码</div>
    <div class="bind_con">
      <el-form :model="psdInfo" :rules="rule" ref="ruleForm" label-width="100px">
        <el-form-item label="登录名：">
          {{userInfo.mobile_phone | formatPhone}}
        </el-form-item>
        <el-form-item label="旧密码：" prop="oldpass">
          <el-input v-model="psdInfo.oldpass" show-password></el-input>
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
      // 校验旧密码
      var validateOldPass = (rule, value, callback) => {
        if (value == '') {
          callback(new Error("请输入旧密码"))
        } else {
          if (value == this.hispass) {
            callback()
          } else {
            callback(new Error("密码错误"))
          }
        }
      }
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
        hispass: '',
        psdInfo: {
          oldpass: '',
          pass: '',
          checkpass: ''
        },
        rule: {
          oldpass: [{
            validator: validateOldPass,
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
    created() {
      this.getOldPass()
    },
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
            this.$router.push('/user/securityCentre')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      async getOldPass() {
        let {
          data: result
        } = await this.$http.post('/user/getOldPasswordById', {
          userId: this.userInfo.customer_id
        })
        // console.log(result)
        if (result.status == 200) {
          this.hispass = result.psd
        }
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
