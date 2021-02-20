<template>
  <div class="guess_you_like">
    <div class="guess_title">
      为您推荐
    </div>
    <div class="goods_List">
      <div class="goods_item" @click="toGoodsDetail(item.product_id)" v-for="item in goods_list" :key="item.product_id">
        <div class="goods_img">
          <el-image :src="item.main_img"></el-image>
        </div>
        <div class="goods_title">
          {{item.product_name}}
        </div>
        <div class="goods_price">
          ￥{{item.price}}
        </div>
      </div>
    </div>
    <div class="page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
        :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <div v-if="goods_list.length == 0">暂无数据</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        goods_list: [],
        pagesize: 8,
        pagenum: 1,
        total: 0
      }
    },
    created() {
      this.getGoods()
    },
    methods: {
      async getGoods() {
        let result = await this.$store.dispatch('getGoodsByKeyword', {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        // console.log(result);
        if (result.status != 200) return this.goods_list = []
        this.goods_list = result.result
        this.total = result.result[0].total
        console.log(this.goods_list);
      },
      handleSizeChange(val) {
        this.pagesize = val
      },
      handleCurrentChange(val) {
        this.pagenum = val
        this.getGoods()
      },
      toGoodsDetail(goods_id) {
        console.log(goods_id);
        let routeData = this.$router.resolve({
          path: '/goodsDetail',
          query: {
            goods_id: goods_id
          }
        })
        window.open(routeData.href, '_blank');
      }
    }
  }

</script>
<style scoped>
  .guess_title {
    width: 120px;
    margin: 10px auto;
    font-size: 30px;
  }

  .goods_List {
    height: 500px;
    display: flex;
    flex-flow: wrap;
    background-color: white;
  }

  .goods_item {
    min-width: 298px;
    max-width: 298px;
    height: 250px;
    flex: .4;
    cursor: pointer;
    border: 1px solid #ccc;
  }

  .goods_img {
    width: 150px;
    height: 150px;
    margin: 0 auto;
    padding-top: 20px;
  }

  .goods_img .el-image {
    width: 100%;
    height: 100%;
  }

  .goods_title {
    width: 200px;
    margin: 0 auto;
    padding: 10px 0;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .goods_price {
    color: red;
    font-size: 22px;
    padding: 0 0 10px 50px;
  }

  .page {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
