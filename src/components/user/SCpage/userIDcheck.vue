<template>
  <div>
    <div class="title">身份认证</div>
    <!-- 查看实名信息 -->
    <div class="id_check" v-if="userInfo.id_card_no != null">
      <div class="check_header">
        <div>
          <div>已通过实名认证</div>
          <div>很高兴认识你，现在您可以享受更多的服务和保障</div>
        </div>
      </div>
      <div class="check_info">
        <div>您的身份信息：</div>
        <div class="id_info">
          <div>
            <label for="">姓名：</label>
            <span>{{userInfo.customer_name | formatRealName}}</span>
          </div>
          <div>
            <label for="">证件类型：</label>
            <span>{{userInfo.id_card_type == 1?'身份证':userInfo.id_card_type == 2?'军官证':'护照'}}</span>
          </div>
          <div>
            <label for="">证件号：</label>
            <span>{{userInfo.id_card_no |formatIdCardNo}}</span>
          </div>

        </div>
      </div>
    </div>
    <!-- 输入实名信息 -->
    <div class="id_check" v-else>
      <div class="input_header">
        <div>请输入实名信息</div>
      </div>
      <div class="input_info">
        <el-form :model="user" :rules="rule" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="姓名：" prop="customer_name">
            <el-input v-model="user.customer_name" placeholder="请输入真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="证件类型：" prop="id_card_type">
            <el-radio-group v-model="user.id_card_type">
              <el-radio :label="1">身份证</el-radio>
              <el-radio :label="2">军官证</el-radio>
              <el-radio :label="3">护照</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="证件号：" prop="id_card_no">
            <el-input v-model="user.id_card_no" maxlength="18" placeholder="请输入证件号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
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
        user: {
          customer_name: '',
          id_card_type: 1,
          id_card_no: ''
        },
        rule: {
          customer_name: [{
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur'
          }],
          id_card_no: [{
              required: true,
              message: '请输入身证号',
              trigger: 'blur'
            },
            {
              pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
              message: '身份证号码格式有误',
              trigger: 'blur'
            },
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            let {data: result} = await this.$http.post("/user/modifyUserIdCard",{
              user: this.user,
              userId: this.userInfo.customer_id
            })
            console.log(result);
            if(result.status == 400) return this.$message.error("实名认证失败")
            this.$message.success("实名认证成功")
            await this.$store.dispatch("getUserInfoById",{
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

  .id_check {
    margin: 40px 40px 0 40px;
    /* background-color: pink; */
  }

  .id_check>div {
    padding: 20px 0 0 40px;
  }

  .check_header {
    height: 150px;
    background-color: #EDFED0;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  .check_header>div {
    transform: translateX(-25%);
  }


  .id_info>div>label {
    display: inline-block;
    width: 100px;
    margin: 8px 0;
    text-align: right;
    /* background-color: red; */
  }

  /* 认证 */
  .input_header {
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ccc;
  }

  .input_info {
    width: 500px;
  }

</style>
