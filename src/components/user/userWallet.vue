<template>
  <div class="wallet_container">
    <div class="wallet">
      <div class="user_money">
        <div>
          <label for="">钱包余额：</label>
          <span>￥{{userInfo.user_money |formatUserMoney}}</span>
        </div>
      </div>
      <div class="user_pay">
        <div>支付宝：<el-link>未绑定</el-link>
        </div>
        <div>银行卡：<el-link>未绑定</el-link>
        </div>
      </div>
    </div>
    <div class="pay_form">
      <div>账户余额充值</div>
      <div class="pay_num">
        <div class="pay_item" :class="{chose: choseIndex == index}" @click="choseNum(index, item)"
          v-for="(item, index) in payNumList" :key="item">
          <div>￥{{item}}</div>
        </div>
      </div>
      <div class="custom" :class="{chose: choseIndex == 99}">
        <el-input v-model="customMoney" placeholder="请输入充值的金额" maxlength="9" @input='regNum' @change="choseCustom"
          @focus="choseNum(99, '')">
          <template slot="prepend">自定义充值</template>
        </el-input>
      </div>
      <div class="pay_btn">
        <el-button type="primary" @click.native='UserRecharge'>立即充值</el-button>
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
        payNumList: [
          100,
          200,
          500,
          1000,
          10000
        ],
        choseIndex: 90,
        customMoney: '',
        choseMoney: 0
      }
    },
    methods: {
      // 样式选择
      choseNum(index, item) {
        if (item == '') {
          this.choseIndex = index
          return
        }
        this.choseMoney = item
        console.log(item);
        this.choseIndex = index
      },
      // 自定义输入数值
      choseCustom() {
        this.choseMoney = this.customMoney
      },
      // 校验自定义输入的类型
      regNum() {
        var re = /^[0-9]*$/
        if (!re.test(this.customMoney)) {
          this.customMoney = ''
          this.$message({
            type: 'error',
            message: '只能输入数字',
            duration: 1000
          })
          return
        }
      },
      // 立即充值
      async UserRecharge() {
        if(this.choseIndex == 90){
          this.$message.error('请选择充值数量')
          return
        }
        let {data: res} = await this.$http.post("/user/UserRecharge",{
          user_money: this.choseMoney,
          old_money: this.userInfo.user_money,
          user_id: this.userInfo.customer_id
        })
        console.log(res);
        if(res.status != 200) return this.$message.error("充值失败")
        await this.$store.dispatch("getUserInfoById",{
          id: this.userInfo.customer_id
        })
        this.$message.success("充值成功")
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
  }

</script>
<style scoped>
  .wallet_container {
    height: 100%;
  }

  .wallet {
    height: 200px;
    display: flex;
  }

  .wallet>div {
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user_money {
    flex: 1;
  }

  .user_money>div>span {
    font-size: 18px;
    color: red;
  }

  .user_pay {
    flex: 1;
    display: flex;
    flex-flow: column;
  }

  /* 下半部分 */
  .pay_form>div:first-child {
    margin: 10px;
    padding-left: 20px;
  }

  .pay_num {
    display: flex;
    flex-flow: wrap;
    justify-content: space-around;
  }

  /* .pay_num>div:last-child {
    width: 100px;
    visibility: hidden;
  } */

  .pay_item {
    width: 100px;
    height: 70px;
    border: 1px solid #ccc;
    cursor: pointer;
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .custom {
    width: 400px;
    margin: 10px 0 10px 30px;
    border: 1px solid #DCDFE6;
  }

  .pay_btn {
    margin: 30px;
  }

  .chose {
    border: 1px solid skyblue;
  }

</style>
