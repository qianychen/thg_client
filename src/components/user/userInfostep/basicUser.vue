<template>
  <div>
    <div class="basic_user">
      <div class="basic">基本资料</div>
      <el-form :model="newuser" :rules="rule" ref="ruleForm" label-width="100px" hide-required-asterisk>
        <el-form-item label="当前头像：">
          <el-avatar class="avatar" @click.native="toSec" :size="100" :src="newuser.avatar" alt="加载失败"></el-avatar>
        </el-form-item>
        <el-form-item label="昵称：" prop="nick_name">
          <el-input v-model="newuser.nick_name" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="gender">
          <el-radio-group v-model="newuser.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="0">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="生日：" prop="birthday">
          <el-date-picker :value="newuser.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" @change="getBirthday">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
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
      return {
        user: {},
        newuser: {
          avatar: '',
          nick_name: '',
          gender: 0,
          birthday: '',
          customer_id: 0
        },
        rule: {
          nick_name: [{
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted() {
      this.getUserInfo()
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      getBirthday(e) {
        console.log(e);
        this.newuser.birthday = e
      },
      toSec() {
        this.$emit("sec", 'second')
        console.log('aa');
      },
      // 获取用户信息
      async getUserInfo() {
        let userInfo_res = await this.$store.dispatch("getUserInfoById", {
          id: this.userInfo.customer_id
        })
        if (userInfo_res.status == 200) {
          this.user = userInfo_res.userInfo
          this.newuser.avatar = userInfo_res.userInfo.avatar
          this.newuser.nick_name = userInfo_res.userInfo.nick_name
          this.newuser.gender = userInfo_res.userInfo.gender
          this.newuser.birthday = userInfo_res.userInfo.birthday
          this.newuser.customer_id = userInfo_res.userInfo.customer_id
        } else {
          this.$message.error({
            message: '获取用户信息失败，请刷新重试'
          })
        }
        // console.log(this.user);
      },
      // 提交修改表单
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let {
              data: res
            } = await this.$http.post('/user/modifyUserInfo', this.newuser)
            if (res.status == 200) {
              this.$message.success("修改成功")
              this.getUserInfo()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }

</script>
<style scoped>
  .basic_user {
    width: 400px;
    margin: 30px 0 0 50px;
  }

  .basic {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
  }

  .avatar {
    cursor: pointer;
    border: 3px solid orange;
  }

</style>
