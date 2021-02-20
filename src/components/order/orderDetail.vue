<template>
  <div class="order_detail">
    <!-- 改 -->
    <div class="title">
      订单详情
    </div>
    <div class="goods">
      <el-table ref="multipleTable" :data="list" style="width: 100%">
        <el-table-column label="商品" width="500">
          <template slot-scope="scope">
            <div class="shopCart_name">
              <el-image class="shopCart_img" :src="scope.row.product_pic"></el-image>
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
    </div>
    <div class="order">
      <div class="order_l">
        <div class="head">
          订单信息
        </div>
        <div>订单号：{{orderInfo.order_sn}}</div>
        <div>
          订单状态：
          <span v-if="orderInfo.order_status == 0">待支付</span>
          <span v-else-if="orderInfo.order_status == 1">待发货</span>
          <span v-else-if="orderInfo.order_status == 2">待收货</span>
          <span v-else-if="orderInfo.order_status == 3">待评价</span>
          <span v-else>已完成</span>
        </div>
        <div>
          收货人：
          {{orderInfo.shipping_user}}
          {{orderInfo.mobile_phone}}
        </div>
        <div>收货地址：
          {{orderInfo.province}}
          {{orderInfo.city}}
          {{orderInfo.district}}
          {{orderInfo.address}}
        </div>
        <div>
          下单时间：
          {{orderInfo.create_time | formatDate}}
        </div>
        <div v-if="orderInfo.order_status != 0">
          支付时间：
          {{orderInfo.pay_time | formatDate}}
        </div>
        <div v-if="orderInfo.order_status != 0 && orderInfo.order_status != 1">
          发货时间：
          {{orderInfo.shipping_time | formatDate}}
        </div>
        <div v-if="orderInfo.order_status != 0 && orderInfo.order_status != 1 && orderInfo.order_status != 2">
          收货时间：
          {{orderInfo.receive_time | formatDate}}
        </div>
      </div>
      <div class="order_r">
        <div class="head">
          快递信息
        </div>
        <div>
          快递公司：{{orderInfo.shipping_comp_name}}
        </div>
        <div>
          快递单号：{{orderInfo.shipping_sn}}
        </div>
      </div>
    </div>

    <div class="order_footer">
      <div class="pay" v-if="orderInfo.order_money != ''">
        商品总额：￥{{orderInfo.product_cnt * orderInfo.product_price}}
      </div>
      <div>
        运费：0.00
      </div>
      <div class="pay" v-if="orderInfo.payment_money != ''">
        实付款：￥{{orderInfo.product_cnt * orderInfo.product_price}}
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        orderId: this.$route.query.orderId,
        orderInfo: {},
        list: []
      }
    },
    created() {
      this.getOrderDetail()
    },
    methods: {
      // 获取订单详情
      async getOrderDetail() {
        let order_res = await this.$store.dispatch("getOrderInfoByOrderId", {
          orderId: this.orderId
        })

        if (order_res.status == 200) {
          this.orderInfo = order_res.orderInfo
          this.list.push(order_res.orderInfo)
        } else {
          this.$message.error("订单获取失败")
          this.$router.go(-1)
        }
        console.log(this.orderInfo);
      },

    },
    filters: {
      formatDate(value) {
        let d = new Date(value)

        var h = d.getHours(); //12
        var m = d.getMinutes(); //12
        var s = d.getSeconds(); //12
        if (h < 10) {
          h = "0" + h;
        }
        if (m < 10) {
          m = "0" + m;
        }
        // return 
        return String(value).substr(0, 10) + "  " + h + ':' + m + ':' + s
      }
    }
  }

</script>
<style scoped>
  .order_detail {
    width: 1100px;
    min-width: 900px;
    min-height: 600px;
    margin: 0 auto;
  }

  .title {
    height: 40px;
    line-height: 40px;
    padding-left: 30px;
    background-color: white;
  }

  .order {
    padding: 20px;
    background-color: white;
    /* display: flex;
    justify-content: space-around; */
  }

  .order_l {
    /* height: 150px; */
    padding: 10px;
  }

  .order_r {
    height: 150px;
    padding: 10px;
  }

  .order_l .head,
  .order_r .head {
    background-color: #ccc;
    padding: 10px;
    margin: 10px 0;
  }

  .order_l>div,
  .order_r>div {
    margin: 15px 0;
  }

  /* 商品列表 */
  .goods{
    padding: 0 20px;
    background-color: white;
    box-sizing: border-box;
  }
  .shopCart_name {
    display: flex;
    padding: 10px;
    cursor: pointer;
  }

  .shopCart_name span {
    width: 300px;
  }

  .shopCart_img {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }

  .shopCart_title {
    display: flex;
    flex-flow: column;
    font-weight: bold;
  }

  .shopCart_title>div {
    margin: 20px 0 0 20px;
  }

  .goods_list {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .order_footer {
    background-color: white;
    padding-right: 30px;
    text-align: right;
  }

  .pay {
    height: 50px;
    line-height: 50px;
    color: red;
    font-size: 20px;
  }

  .order_footer>div:first-child {
    color: black;
  }

</style>
