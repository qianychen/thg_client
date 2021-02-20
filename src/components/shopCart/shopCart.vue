<template>
  <div class="shopCart_con">
    <!-- 搜索 -->
    <div class="header">
      <el-row class="header_row" type="flex">
        <el-col :span="4" class="logo" @click.native="toHome">
          <img src="@/assets/images/logo.png" alt="">
        </el-col>
        <el-col :span="6">
          <div class="shop_title">
            <div>购物车</div>
          </div>
        </el-col>
        <el-col :span="14" class="search">
          <el-input placeholder="请输入商品名称" class="search_input" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click.native="getGoods"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="title">
      <span>全部商品</span>
      <span>{{shopCartList.length}}</span>
    </div>
    <div class="shopCart_box">
      <el-table ref="multipleTable" :data.sync="shopList" tooltip-effect="dark" style="width: 100%"
        @cell-click="toGoodsDetail" @selection-change="handleSelectionChange" @select-all="selectAll">
        <el-table-column type="selection" width="55">
        </el-table-column>
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
        <el-table-column label="单价" width="120">
          <template slot-scope="scope">￥{{ scope.row.sku.sku_price }}</template>
        </el-table-column>
        <el-table-column label="数量" width="200">
          <template slot-scope="scope">
            <el-input-number size="mini" @change="goodsNumChange(scope.row)" :max="scope.row.sku.sku_num" :min="0"
              v-model="scope.row.amount">
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="小计">
          <template slot-scope="scope">
            ￥{{scope.row.sku.sku_price * scope.row.amount}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button size="mini" @click.native="delShopCart(scope.row)">删除</el-button> -->
            <el-popconfirm title="确定删除吗？" @onConfirm="delShopCart(scope.row)">
              <el-button slot="reference" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="shop_count">
      <div class="count">
        <div class="check_all">
          <el-checkbox v-model="checked" @change="checkAll">全选</el-checkbox>
        </div>
        <div class="shop_total">
          <span>总计：</span>
          <span>{{total}}</span>
        </div>
        <div class="shop_count_btn">
          <el-button @click.native="toSettlement">去结算</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        keyword: '',
        shopCartList: [],
        multipleSelection: [],
        checked: false,
      }
    },
    created() {
      this.getShopCartInfo()
    },
    computed: {
      shopList() {
        return this.shopCartList
      },
      total() {
        let sum = 0
        this.multipleSelection.forEach(item => {
          sum += item.amount * item.sku.sku_price
        })
        return `￥` + sum
      }
    },
    methods: {
      // 返回主页
      toHome() {
        this.$router.push('/')
      },
      // 跳转搜索界面
      getGoods() {
        let key = this.keyword
        this.$router.push({
          path: '/search',
          query: {
            keyword: key
          }
        })
      },
      // 获取购物车数据
      async getShopCartInfo() {
        let shopcart_res = await this.$store.dispatch("getShopCartInfo", {
          userId: this.$store.state.userInfo.customer_id
        })
        //   console.log(shopcart_res);
        if (shopcart_res.status == 200) {
          this.shopCartList = shopcart_res.result
        }
        console.log(this.shopCartList);
      },
      // 表格多选框选中的数据
      handleSelectionChange(val) {
        this.multipleSelection = val;
        // console.log(this.multipleSelection);
      },
      // 结算条的全选
      checkAll(flag) {
        if (flag) {
          this.$refs.multipleTable.toggleAllSelection()
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      // 点击表格全选
      selectAll(sele) {
        if (sele.length == 0) {
          this.checked = false
        } else {
          this.checked = true
        }
      },
      // 购物车商品数量改变
      async goodsNumChange(shopCartInfo) {
        // console.log(shopCartInfo);
        if (shopCartInfo.amount > shopCartInfo.sku.sku_num) {
          this.$message.error("数量超过库存")
        }
        let modifyShopNum_res = await this.$store.dispatch("modifyShopCartAmount", {
          cartId: shopCartInfo.cart_id,
          amount: shopCartInfo.amount
        })
        // 如果商品数量为0 取消选中
        if (shopCartInfo.amount == 0) {
          this.$refs.multipleTable.toggleRowSelection(shopCartInfo, false);
        } else {
          this.$refs.multipleTable.toggleRowSelection(shopCartInfo, true);
        }
        //  console.log(modifyShopNum_res);
      },
      // 点击商品名称跳转商品详情
      toGoodsDetail(row, col, cell, cb) {
        // console.log(col);
        if (col.label == '商品') {
          this.$router.push({
            path: '/goodsDetail',
            query: {
              goods_id: row.product_id
            }
          })
        }
      },
      // 删除
      async delShopCart(row) {
        console.log(row);
        let del_res = await this.$store.dispatch("delShopCartGoods", {
          cartId: row.cart_id
        })
        console.log(del_res);
        if (del_res.status == 200) {
          this.$message.success("删除成功")
          this.getShopCartInfo()
        } else {
          this.$message.error("删除失败")
        }
      },
      // 跳转结算页面
      toSettlement() {
        // console.log(this.multipleSelection);
        // if 有勾选商品 
        if (this.multipleSelection.length != 0) {
          this.$router.push({
            path: '/settlement',
            query: {
              goodsData: JSON.stringify(this.multipleSelection)
            }
          })
        }
      }
    },
    filters: {
      formatName(value) {
        const cNumber = '30' // 设置限定字数
        if (!value) return ''
        if (value.length > cNumber) {
          return value.slice(0, cNumber) + '...'
        }
        return value
      }
    }
  }

</script>
<style scoped>
  .shopCart_con {
    width: 100%;
    min-width: 900px;

  }

  /* 搜索 */
  .header {
    width: 1519px;
    margin: 0 auto;
    margin-bottom: 5px;
    height: 120px;
    background-color: white;
  }

  .header_row {
    width: 80%;
    min-width: 800px;
    margin: 0 auto;
  }

  .shop_title {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 30px;
  }

  .logo {
    width: 200px;
    margin: 5px;
    cursor: pointer;
  }

  .logo>img {
    margin-left: 50px;
  }

  .search {
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search_input {
    width: 70%;
    height: 40px;
  }

  .title {
    width: 1100px;
    height: 50px;
    line-height: 50px;
    background-color: white;
    padding-left: 30px;
    font-size: 20px;
    box-sizing: border-box;
    margin: 0 auto;
    color: #E7231A;
    border-bottom: 1px solid #ccc;
  }

  /* 购物车模块 */
  .shopCart_box {
    width: 1100px;
    min-height: 480px;
    margin: 0px auto;
    margin-bottom: 10px;
    background-color: white;
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

  .shop_count {
    position: relative;
  }

  .count {
    width: 1100px;
    margin: 0 auto;
    background-color: white;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
  }

  .check_all {
    position: absolute;
    left: 10px;
  }

  .shop_total {
    margin: 0 20px;
  }

  .shop_total span:last-child {
    color: red;
  }

  .shop_count_btn {
    padding: 10px;
  }

  .shop_count_btn .el-button {
    color: white;
    background-color: #E64347;
  }

</style>
