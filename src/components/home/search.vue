<template>
  <div>
    <!-- 搜索 -->
    <div class="header">
      <el-row class="header_row">
        <el-col :span="4" class="logo" @click.native="toHome">
          <img src="@/assets/images/logo.png" alt="">
        </el-col>
        <el-col :span="16" class="search">
          <el-input placeholder="请输入商品名称" @keyup.enter.native="getGoods" class="search_input" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click.native="getGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
    </div>
    <div class="search_box">

      <!-- 搜索的结果 -->
      <div class="search_con">
        <!-- 搜索结果列表 -->
        <div class="search_list">
          <div class="search_item" v-for="(item, index) in goodsList" :key="item.product_id"
            @click="toGoodsDetail(item.product_id)">
            <div class="goods_img">
              <img :src="item.main_img"></img>
            </div>
            <div class="goods_price">
              {{item.price | formatPrice}}
            </div>
            <div class="goods_name">
              {{item.product_name | formatName}}
            </div>
            <div class="supplier">
              {{item.supplier.supplier_name}}
            </div>
            <div class="supplier_caove"></div>
          </div>
        </div>
        <div class="emptyData" v-if="goodsList.length == 0">暂无数据</div>
      </div>
      <!-- 左侧热卖 -->
      <div class="leftGoods">
        <div class="left_title">
          <div>精选商品</div>
          <div>广告</div>
        </div>
        <div class="left_item" @click="toGoodsDetail(item.product_id)" v-for="(item, index) in randomRecommendGoods"
          :key="item.product_id">
          <div>
            <el-image :src="item.main_img"></el-image>
          </div>
          <div class="left_price">
            {{item.price | formatPrice}}
          </div>
          <div class="left_name">
            {{item.product_name | formatName}}
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="page">
      <el-pagination prev-text="上一页" next-text="下一页" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5]" :page-size="pagesize"
        layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        keyword: this.$route.query.keyword,
        goodsList: [],
        pagenum: 1,
        pagesize: 8,
        total: 0,
        randomRecommendGoods: []
      }
    },
    created() {
      this.getGoods()
      this.randomRecommend()
      console.log(this.goodsList);
    },
    methods: {
      // 返回主页
      toHome() {
        this.$router.push('/')
      },
      // 通过关键词获取商品信息
      async getGoods() {
        let query = {
          keyword: this.keyword,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
        let goods_res = await this.$store.dispatch('getGoodsByKeyword', query)
        if (goods_res.status == 200) {
          this.goodsList = goods_res.result
          if (goods_res.result.length != 0) {
            this.total = goods_res.result[0].total
          }
        } else {
          this.$message.error("商品获取失败")
        }
        // console.log(goods_res);
      },
      // 当前页数改变
      handleCurrentChange(val) {
        this.pagenum = val
      },
      // 当前页数据条数改变
      handleSizeChange(val) {
        this.pagesize = val
      },
      // 跳转商品详情
      toGoodsDetail(goods_id) {
        let routeData = this.$router.resolve({
          path: '/goodsDetail',
          query: {
            goods_id: goods_id
          }
        })
        window.open(routeData.href, '_blank');
      },
      // 随机推荐
      async randomRecommend() {
        let result = await this.$store.dispatch("recommendGoods", {
          num: 2
        })
        if (result.status == 200) {
          this.randomRecommendGoods = result.result
        }
        console.log(this.randomRecommendGoods);
      }
    },
    filters: {
      formatPrice(value) {
        return '￥' + value
      },
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
  .header {
    width: 1519px;
    margin: 0 auto;
    height: 120px;
    background-color: white;
  }

  .header_row {
    width: 80%;
    min-width: 800px;
    margin: 0 auto;
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

  .search_box {
    width: 1200px;
    height: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;

  }

  /* 左侧推荐 */
  .leftGoods {
    min-width: 200px;
    flex: .3;
    display: flex;
    flex-flow: column;
    align-items: center;
    margin: 0 5px;
    background-color: white;
  }

  .left_title {
    width: 80%;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
  }

  .left_title>div:last-child {
    font-size: 8px;
    color: #ccc;
    margin-top: 5px;
    background-color: #eee;
  }

  .left_item {
    width: 80%;
    margin: 10px 0;
    border: 1px solid #ccc;
    cursor: pointer;
  }

  .left_price {
    color: red;
    padding-left: 5px;
  }

  .left_name {
    padding: 5px;
  }

  /* 商品列表 */
  .search_con {
    flex: 2;
    min-width: 800px;
    min-height: 470px;
    background-color: white;
    position: relative;
  }

  .search_list {
    display: flex;
    flex-flow: wrap;
    /* justify-content: space-around; */
  }

  .search_item {
    min-width: 21%;
    max-width: 22%;
    flex: .25;
    margin: 10px;
    padding: 5px;
    cursor: pointer;
    border: 1px solid #ccc;
    position: relative;
  }



  .goods_img img {
    width: 100%;
    height: 100%;
  }

  .goods_price {
    color: red;
    font-size: 20px;
    font-weight: bold;
    margin: 10px;
  }

  .supplier {
    position: absolute;
    left: 10px;
    bottom: 0px;
    font-size: 12px;
    margin: 10px 0;
  }

  .supplier_caove {
    height: 30px;
  }

  .page {
    min-width: 500px;
    margin: 20px 50px 20px 0;
    display: flex;
    justify-content: center;
  }

  .emptyData {
    color: #ccc;
    font-size: 25px;
    margin: 0 auto;
    margin-top: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

</style>
