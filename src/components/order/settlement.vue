<template>
  <div class="settlement_wrap">
    <!-- 头部 -->
    <div class="settlment_hesader">
      <div class="logo">
        <img src="@/assets/images/logo.png" alt="" @click="toHome">
        <span>结算页</span>
      </div>
      <div class="step">
        <el-steps :active="2" finish-status="success" :align-center="true" style="margin-top: 20px">
          <el-step title="我的购物车"></el-step>
          <el-step title="填写核对订单信息"></el-step>
          <el-step title="成功提交订单"></el-step>
        </el-steps>
      </div>
    </div>
    <!-- 主体 -->
    <div class="check">填写并核对订单信息</div>
    <div class="settlment_main">
      <div class="check_order">
        <!-- 地址选择 -->
        <div v-if="address.length != 0" class="addr_chose">
          <div class="addr_title">
            收货人信息
          </div>
          <div class="addr_address">
            <el-radio-group v-model="radio">
              <el-radio @change="setAddr(item.customer_addr_id)" :label="item.customer_addr_id" v-for="item in address"
                :key="item.customer_addr_id">
                {{item.consignee}}
                {{item.province}}
                {{item.city}}
                {{item.district}}
                {{item.address}}
                {{item.mobile_phone | foematPhone}}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-else>请设置地址</div>
      </div>
      <!-- 商品列表 -->
      <div class="goods_list">
        <el-table ref="multipleTable" :data="goodsData" style="width: 100%">
          <el-table-column label="商品" width="500">
            <template slot-scope="scope">
              <div class="shopCart_name">
                <el-image class="shopCart_img" :src="scope.row.goods.main_img"></el-image>
                <div class="shopCart_title">
                  <span>
                    {{ scope.row.goods.product_name }}
                  </span>
                  <div>
                    <span>版本:</span> {{ scope.row.sku.sku_version }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价">
            <template slot-scope="scope">￥{{ scope.row.sku.sku_price }}</template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">* {{ scope.row.amount }}</template>
          </el-table-column>
          <el-table-column label="小计">
            <template slot-scope="scope"> {{ scope.row.amount *  scope.row.sku.sku_price }}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="cover"></div>
      <div class="check_order_info">
        <div class="check_price">
          <span>实付款: </span>
          <span>{{total}}</span>
        </div>
        <div class="check_city">
          <span>寄送至：</span>
          <span>
            {{choseAddr.province}}
            {{choseAddr.city}}
            {{choseAddr.district}}
            {{choseAddr.address}}
          </span>
        </div>
        <div>
          <span>收货人：</span>
          {{choseAddr.consignee}}
          {{choseAddr.mobile_phone}}
        </div>
        <div class="check_submit">
          <el-button @click.native="generateOrder">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        goodsData: JSON.parse(this.$route.query.goodsData),
        address: [],

        radio: 0,
        choseAddr: {}
      }
    },
    async created() {
      // console.log(this.goodsData)
      await this.getUserAddrById()
      if(this.address.length == 0){
        this.$message.error("请设置地址")
        this.$router.push('/user/addr')
        return
      }
      await this.setAddr(this.radio)
    },
    methods: {
      // 跳转主页
      toHome() {
        this.$router.push("/")
      },
      //   获取用户地址
      async getUserAddrById() {
        let address_res = await this.$store.dispatch("getUserAddrById", {
          id: this.$store.state.userInfo.customer_id
        })
        // console.log(address_res);
        if (address_res.status == 200) {
          let temp = await address_res.address.filter(item => {
            if (item.is_default == 1) {
              return item
            }
          })
          this.radio = temp[0].customer_addr_id
          this.address = address_res.address
          //   console.log(this.address);
        }
      },
      // 设置地址
      setAddr(addr_id) {
        let temp = this.address.findIndex(item => {
          if (item.customer_addr_id == addr_id) {
            return item
          }
        })
        this.choseAddr = this.address[temp]
        console.log(this.choseAddr);
      },
      // 生成订单
      async generateOrder() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let generateOrder_res = await this.$store.dispatch("generateOrder", {
          userId: this.$store.state.userInfo.customer_id,
          mobile_phone: this.$store.state.userInfo.mobile_phone,
          order_money: this.total,
          addrInfo: this.choseAddr,
          goods: this.goodsData,
        })
        console.log(this.goodsData);
        // 订单生成成功
        if (generateOrder_res.status == 200) {
          setTimeout(() => {
            this.$router.push({
              path: '/orderPay',
              query: {
                orderId: generateOrder_res.orderId
              }
            })
            loading.close();
          }, 500);
        }
      }
    },
    computed: {
      // 总价
      total() {
        let sum = 0
        this.goodsData.forEach(item => {
          sum += item.amount * item.sku.sku_price
        })
        return sum
      }
    },
    filters: {
      foematPhone(value) {
        let str = String(value)
        let start = str.substr(0, 3)
        let end = str.substr(7, 4)
        return start + '****' + end
      }
    }
  }

</script>
<style scoped>
  .settlement_wrap {
    width: 1100px;
    min-height: 600px;
    margin: 0 auto;
  }

  .settlment_hesader {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: white;
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

  .step {
    width: 500px;
  }

  /* 主体 */
  .settlment_main {
    min-height: 500px;
    background-color: white;
    position: relative;
  }

  .check {
    padding: 10px;
    font-size: 20px;
    background-color: white;
  }

  .check_order {
    padding: 10px;
    border: 1px solid #ccc;
  }

  .addr_title {
    font-weight: bold;
  }

  .addr_address {
    overflow-y: scroll;
    height: 60px;
    padding: 10px;
  }

  .addr_address .el-radio-group {
    display: flex;
    flex-flow: column;
  }

  .addr_address .el-radio {
    height: 40px;
    line-height: 40px;
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

  /*  */
  .cover {
    height: 200px;
  }

  .check_order_info {
    width: 300px;
    height: 200px;
    padding: 10px;
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    right: 0;
    border: 1px solid red;
  }

  .check_price {
    color: red;
  }

  .check_price>span:last-child {
    font-size: 25px;
  }

  .check_city {
    display: flex;
    flex-flow: column;
    margin: 10px 0;
  }

  .check_submit {
    position: absolute;
    bottom: 2px;
    right: 50px;
  }

  .check_submit .el-button {
    font-weight: bold;
    color: white;
    margin-left: 60px;
    background-color: #FF0036;
  }

</style>
