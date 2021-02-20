<template>
  <div>
    <div class="show_container">
      <div class="header">
        <div class="detail">
          订单详情
        </div>
        <div class="num">
          数量
        </div>
        <div class="price">
          金额
        </div>
      </div>
      <div class="show_wrap" v-for="(item, index) in orderList" :key="index">
        <div class="show_header">
          <span>{{item.create_time | foematDate}}</span>
          <span>订单号：{{item.order_sn}}</span>
          <span>{{item.order_status | formatOrderStatus}}</span>
        </div>
        <div class="show_order">
          <div class="show_main">
            <div class="show_img">
              <el-image :src="item.product_pic"></el-image>
            </div>
            <div class="show_name">
              <span>{{item.product_name}}</span>
              <span>版本：{{item.product_version}}</span>
            </div>
            <div class="show_num">
              <span>*{{item.product_cnt}}</span>
            </div>
          </div>
          <!-- <div class="show_oneprice">
            <span>￥{{ item.product_price}}</span>
          </div> -->
          <div class="show_price">
            <span>￥{{item.product_cnt * item.product_price}}</span>
          </div>
          <div class="show_detail">
            <el-link @click.native="toOrderDetail(item.order_id)">订单详情</el-link>
          </div>
          <div class="show_btn">
            <el-button v-if="item.order_status == '0'" size="mini" @click.native="topay(item.order_id)">去支付</el-button>
            <el-button v-if="item.order_status == '1'" size="mini" @click.native="toshipp(item.order_id)">催卖家发货
            </el-button>
            <el-button v-if="item.order_status == '2'" size="mini" @click.native="toComfirm(item.order_id)">确认收货
            </el-button>
            <el-button v-if="item.order_status == '3'" size="mini"
              @click.native="toComment(item.order_id, item.product_id)">评价</el-button>
          </div>
        </div>
      </div>
      <div v-if="orderList.length == 0">没有订单数据</div>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNum"
      :page-size="pageSize" layout="total, prev, pager, next" :total="total">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    props: ['tabs'],
    data() {
      return {
        orderList: [],
        pageSize: 5,
        pageNum: 1,
        total: 0
      }
    },
    async created() {
      await this.getOrderList(this.tabs)
    },
    watch: {
      async tabs() {
        await this.getOrderList(this.tabs)
      },
      
    },
    methods: {
      // 获取订单列表
      async getOrderList(tab) {
        let orderList_res = await this.$store.dispatch('getOrderListById', {
          userId: this.$store.state.userInfo.customer_id,
          orderStatus: tab,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        })
        if (orderList_res.status == 200) {
          this.orderList = orderList_res.result
          if (orderList_res.result.length == 0) {
            this.total = 0
          } else {
            this.total = orderList_res.result[0].total
          }
        } else {
          this.orderList = orderList_res.message
        }
        console.log(orderList_res.result);
      },
      switchPage(tab) {
        this.$router.push({
          path: '/orderList',
          query: {
            tab: tab
          }
        })
      },
      // 去支付
      topay(id) {
        this.$router.push({
          path: '/orderPay',
          query: {
            orderId: id
          }
        })
      },
      // 跳转订单详情
      toOrderDetail(id) {
        let routeData = this.$router.resolve({
          path: "/orderDetail",
          query: {
            orderId: id
          }
        })
        window.open(routeData.href, '_blank');
      },
      // 去确认收货
      async toComfirm(id) {
        let {
          data: comfirm
        } = await this.$http.post("/order/confirmReceipt", {
          orderId: id
        })
        // console.log(comfirm);
        if (comfirm.status == 200) {
          this.$message.success("收货成功")
        }
        this.switchPage('3')
      },
      // 催发货
      async toshipp(id) {
        let {
          data: shipp_res
        } = await this.$http.post("/order/shipping", {
          orderId: id
        })
        // console.log(shipp_res);
        if (shipp_res.status == 200) {
          this.$message.success("已发货")
        }
        this.switchPage('2')
      },
      // 去评论
      toComment(order_id, goods_id) {
        this.$router.push({
          path: '/orderComment',
          query: {
            orderId: order_id,
            goodsId: goods_id
          }
        })
      },
      // 改页面条数
      handleSizeChange(val) {
        this.pageSize = val
      },
      // 改页数
      handleCurrentChange(val) {
        this.pageNum = val
        this.getOrderList(this.tabs)
      }
    },
    filters: {
      foematDate(value) {
        let str = String(value).substr(0, 10)
        return str
      },
      formatOrderStatus(value) {
        let status = ''
        switch (value) {
          case 0:
            status = '未支付'
            break
          case 1:
            status = '待发货'
            break
          case 2:
            status = '待收货'
            break
          case 3:
            status = '待评价'
            break
          default:
            status = '已完成'
        }
        return status
      }
    }
  }

</script>
<style scoped>
  .show_container {
    min-height: 500px;
    background-color: white;
  }

  .show_wrap {
    border: 1px solid #F1F1F1;
    margin-bottom: 5px;
  }

  .header {
    height: 30px;
    line-height: 30px;
    display: flex;
    margin-bottom: 10px;
    background-color: #F1F1F1;
  }

  .detail {
    flex: .8;
    padding-left: 200px;
  }

  .num {
    flex: .4;
  }

  .price {
    flex: .82;
  }

  .show_header {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    background-color: #F1F1F1;
    position: relative;
  }

  .show_header span:last-child {
    font-size: 13px;
    position: absolute;
    right: 10px;

  }

  /* 订单主体 */
  .show_order {
    position: relative;
  }

  .show_main {
    width: 600px;
    padding: 10px;
    display: flex;
    /* background-color: yellow; */
  }

  .show_img {
    width: 100px;
    height: 100px;
  }

  .show_name {
    width: 400px;
    margin-left: 10px;
    display: flex;
    flex-flow: column;
  }

  .show_name span:last-child {
    font-size: 14px;
    margin-top: 10px;
  }

  .show_num {
    width: 100px;
    text-align: center;
  }

  .show_oneprice {
    /* border: 1px solid red; */
    position: absolute;
    right: 420px;
    top: 20px;
  }

  .show_price {
    /* border: 1px solid red; */
    position: absolute;
    right: 320px;
    top: 20px;
  }

  .show_detail {
    position: absolute;
    top: 20px;
    right: 200px;
  }

  .show_btn {
    position: absolute;
    top: 20px;
    right: 50px;
  }

</style>
