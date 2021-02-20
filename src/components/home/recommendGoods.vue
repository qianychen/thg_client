<template>
  <div class="recommend_content">
    <div class="recommend_header">
      <div>特惠商品</div>
    </div>
    <div class="goods_list">
      <div class="goods_item" @click="toGoodsDetail(item.product_id)" v-for="item in goods_list" :key="item.product_id">
        <div class="goods_img">
          <el-image :src="item.main_img"></el-image>
        </div>
        <div class="goods_title">
          {{item.product_name }}
        </div>
        <div class="goods_price">
          ￥{{item.price}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        goods_list: []
      }
    },
    created() {
      this.getRecommendGoods()
    },
    methods: {
      async getRecommendGoods() {
        let result = await this.$store.dispatch("recommendGoods", {
          num: 4
        })
        if (result.status != 200) return this.goods_list = []
        this.goods_list = result.result
        // console.log(this.goods_list);
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

    },
    filters: {
      //   formatTitle(val) {
      //     let str = String(val)

      //     return val
      //   }
    }
  }

</script>
<style scoped>
  .recommend_content {
    /* height: 150px; */
    margin: 20px 0;
    padding: 10px 0;
    background-color: white;
    display: flex;
  }

  .recommend_header {
    flex: 1;
    background-color: #E02A20;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .recommend_header>div {
    color: white;
    font-size: 30px;
    font-weight: bold;
  }

  .goods_list {
    flex: 4;
    display: flex;
  }

  .goods_item {
    flex: .25;
    cursor: pointer;
  }

  .goods_img {
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }

  .goods_img .el-image {
    width: 100%;
    height: 100%;
  }

  .goods_title {
    width: 200px;
    word-break: keep-all;
    /* 不换行 */
    white-space: nowrap;
    /* 不换行 */
    overflow: hidden;
    /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow: ellipsis;
    /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
    margin-top: 10px;
    padding: 0 10px;
  }

  .goods_price {
    color: red;
    font-size: 18px;
    font-weight: bold;
    padding-left: 20px;
    text-align: center;
    margin: 10px 0;
  }

</style>
