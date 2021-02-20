<template>
  <div class="orderPay_container">
    <div class="orderPay_header">
      <div class="logo">
        <img src="@/assets/images/logo.png" alt="" @click="toHome">
        <span>收银台</span>
      </div>
      <div class="orderPay_title">
        <span>订单提交成功，请尽快支付！</span>
        <span>订单号：{{orderInfo.order_sn}}</span>
        <div>请您尽快支付，否则订单会自动取消</div>
      </div>
      <div class="goods_show">
        <el-link @click.native="is_show = !is_show">订单详情</el-link>
      </div>
    </div>
    <transition name="slide-fade">
      <el-table v-if="is_show" ref="multipleTable" :data="oGoods" style="width: 100%">
        <el-table-column label="商品" width="500">
          <template slot-scope="scope">
            <div class="shopCart_name">
              <div class="shopCart_title">
                <span>
                  {{ scope.row.product_name }}
                </span>
                <div>
                  <span>版本:</span> {{ scope.row.product_version }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价">
          <template slot-scope="scope">￥{{ scope.row.product_price }}</template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">* {{ scope.row.product_cnt }}</template>
        </el-table-column>
        <el-table-column label="小计">
          <template slot-scope="scope"> {{ scope.row.product_cnt *  scope.row.product_price }}</template>
        </el-table-column>
      </el-table>
    </transition>
    <!-- orderpay——main -->
    <div class="orderPay_main">
      <el-radio-group v-model="pay_way">
        <el-radio :label="1">
          <span>余额
            <span> 可用余额： {{this.$store.state.userInfo.user_money}}</span>
          </span>
          <span class="onpay" v-if="pay_way == 1">支付：
            {{orderInfo.order_money}}
          </span>
        </el-radio>
        <el-radio :label="2" disabled>
          网银
        </el-radio>
        <el-radio :label="3" disabled>
          支付宝
        </el-radio>
      </el-radio-group>
      <!-- 支付密码 -->
      <!-- <div class="psd">
        <span>请输入6位数支付密码：</span>
        <el-input placeholder="请输入密码" size="small" maxlength="6" onkeyup="value=value.replace(/[^\d]/g,'')"
          v-model="input" show-password></el-input>
      </div> -->
      <div class="just_pay">
        <el-button @click.native="pay">立即支付</el-button>
      </div>
    </div>
    <el-dialog :show-close="false" :visible.sync="dialogVisible" width="30%">
      <span>支付成功</span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        orderId: this.$route.query.orderId,
        orderInfo: {},
        oGoods: [],
        pay_way: 1,
        input: '',
        dialogVisible: false,
        is_show: false
      }
    },
    async created() {
      console.log(this.orderId);
      await this.getOrderInfoByOrderId()
    },
    methods: {
      toHome() {
        this.$router.push("/")
      },
      // 通过订单id获取信息
      async getOrderInfoByOrderId() {
        let order_res = await this.$store.dispatch("getOrderInfoByOrderId", {
          orderId: this.orderId
        })
        if (order_res.status == 200) {
          this.orderInfo = order_res.orderInfo
          this.oGoods.push(order_res.orderInfo)
        }
        console.log(this.orderInfo);
      },
      // 立即支付
      async pay() {
        //   如果用户没钱 就不能买
        if (this.userInfo.user_money < this.orderInfo.order_money) {
          this.$message.error("余额不足")
          this.$router.push("/user/wallet")
          return
        }
        let {
          data: modifyOrder_res
        } = await this.$http.post("/order/modifyOrderState", {
          userId: this.userInfo.customer_id,
          orderId: this.orderInfo.order_id,
          payWay: this.pay_way,
          payMoney: this.orderInfo.order_money
        })
        console.log(modifyOrder_res);
        switch (modifyOrder_res.status) {
          case 200:
            this.$message.success(modifyOrder_res.message)
            setTimeout(() => {
              this.$router.push("/")
              // 跳转订单详情页面
              let routeData = this.$router.resolve({
                path: "/orderDetail",
                query: {
                  orderId: this.orderInfo.order_id
                }
              })
              window.open(routeData.href, '_blank');
            }, 1000);
            break;
          case 304:
            this.$message.error(modifyOrder_res.message)
            // 跳转订单详情页面
            this.$router.push("/")
            // 跳转订单详情页面
            let routeData = this.$router.resolve({
              path: "/orderDetail",
              query: {
                orderId: this.orderInfo.order_id
              }
            })
            window.open(routeData.href, '_blank');
            break
          case 400:
            this.$message.error(modifyOrder_res.message)
            this.$router.go(-1)
            break
        }
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
  }

</script>
<style scoped>
  .orderPay_container {
    width: 1100px;
    min-height: 600px;
    margin: 0 auto;
  }

  .orderPay_header {
    padding: 10px;
    display: flex;
    align-items: center;
    margin: 0 0 20px 0;
    position: relative;
    /* background-color: white; */
  }

  .logo {
    display: flex;
    align-items: center;
  }

  .logo>img {
    width: 80px;
    height: 80px;
    cursor: pointer;
  }

  .logo>span {
    font-size: 30px;
    color: #707070;
  }

  .orderPay_title {
    margin-left: 20px;
  }

  .orderPay_title div {
    margin-top: 5px;
    font-size: 13px;
  }

  /* 主体 */
  .orderPay_main {
    min-height: 460px;
  }

  .orderPay_main {
    background-color: white;
  }

  .orderPay_main .el-radio-group {
    display: flex;
    flex-flow: column;
  }

  .orderPay_main .el-radio-group .el-radio {
    width: 100%;
    height: 80px;
    padding: 10px;
    box-sizing: border-box;
    line-height: 50px;
    border: 1px solid #ccc;
  }

  .onpay {
    position: absolute;
    right: 20px;
    color: red;
    font-weight: bold;
  }

  .psd {
    width: 200px;
    margin: 30px;
  }

  .psd span {
    display: block;
    font-size: 12px;
    margin-bottom: 10px;
  }

  .just_pay {
    margin: 30px;
  }

  .just_pay .el-button {
    color: white;
    background-color: red;
  }

  .goods_show {
    position: absolute;
    right: 10px;
    align-self: flex-end;
  }

  /* 订单商品详情动画 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s ease;
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    /* transform: translateY(10px); */
    opacity: .5;
  }

</style>
