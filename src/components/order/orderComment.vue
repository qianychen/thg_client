<template>
  <div class="comment">
    <div class="header">
      <img src="@/assets/images/logo.png" alt="" @click="toHome">
      <span>评价</span>
    </div>
    <div class="order_info">
      <div class="order">
        <span>评价订单</span>
        <div>
          <span>订单号：{{orderInfo.order_sn}}</span>&nbsp;
          <span>{{orderInfo.receive_time | formatTime}}</span>
        </div>
      </div>
    </div>
    <div class="order_goods">
      <div class="show_goods">
        <div class="show_img">
          <img :src="orderInfo.product_pic" alt="">
        </div>
        <div class="show_product_name">
          {{orderInfo.product_name}}
        </div>
      </div>
      <div class="comment_content">
        <div>
          <span>商品评分：</span>
          <el-rate v-model="value2" :colors="colors">
          </el-rate>
          <div>评价晒单:</div>
          <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 20}" placeholder="请输入内容" v-model="textarea1"
            maxlength="100">
          </el-input>
        </div>
      </div>
    </div>
    <div class="comment_btn">
      <div>
        <el-button @click.native="makeComment">发布评论</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        orderId: this.$route.query.orderId,
        goodsId: this.$route.query.goodsId,
        orderInfo: {},
        textarea1: '',
        value2: 0,
        colors: ['#99A9BF', '#F7BA2A', '#FF9900']
      }
    },
    created() {
      this.getOrderCommentInfo()
    },
    methods: {
      // 跳转主页
      toHome() {
        this.$router.push('/')
      },
      async getOrderCommentInfo() {
        let {
          data: order_res
        } = await this.$http.post("/order/commentSelOrder", {
          orderId: this.orderId,
          goodsId: this.goodsId
        })
        // console.log(order_res);
        if (order_res == 400) return this.$message.error("订单数据获取失败")
        this.orderInfo = order_res.result
        console.log(this.orderInfo);
      },
      // 发布评论
      async makeComment() {
        if (this.textarea1 == '' || this.value2 == 0) {
          this.$message.error("请输入评价内容")
          return
        }
        let temp = {
          order_id: this.orderInfo.order_id,
          product_id: this.orderInfo.product_id,
          customer_id: this.orderInfo.customer_id,
          content: this.textarea1,
          star: this.value2
        }
        let {
          data: makeComment_res
        } = await this.$http.post("/order/makeComment", {
          orderInfo: temp
        })
        console.log(makeComment_res);
        if (makeComment_res.status != 200) return this.$message.error("发布失败")
        this.$message.success("发布成功")
        console.log('1');
        setTimeout(() => {
          console.log('2');
          this.$router.push({
            path: '/orderList',
            query: {
              tab: 'all'
            }
          })
        }, 500);
        // console.log(temp);
      }
    }
  }

</script>
<style scoped>
  .comment {
    width: 1100px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    align-items: center;
    background-color: white;
    padding: 10px;
  }

  .header span {
    margin-left: 10px;
    font-size: 22px;
  }

  /* 订单信息 */
  .order_info {
    margin: 15px 0;
    font-size: 18px;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .order>div {
    margin-top: 5px;
    font-size: 14px;
  }

  .order_goods {
    /* text-align: center; */
    display: flex;
    padding: 20px 0;
    background-color: white;
  }

  /* 商品展示 */
  .show_goods {
    flex: 1;
  }

  .show_img {
    padding: 20px;
    display: flex;
    justify-content: center;
  }

  .show_img img {
    width: 200px;
    height: 200px;
  }

  .show_product_name {
    width: 50%;
    margin: 0 auto;
  }

  /* 评价框 */
  .comment_content {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .comment_content>div {
    width: 100%;
  }

  .comment_content .el-textarea {
    width: 80%;
  }

  .comment_btn {
    margin: 10px 0;
    height: 80px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .comment_btn .el-button {
    background-color: #E43F42;
    color: white;
  }

</style>
