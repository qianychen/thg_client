<template>
  <div class="detail_container">
    <!-- 详情信息 -->
    <div class="detail_meta">
      <!-- 左侧轮播图 -->
      <div class="leftBanner">
        <el-carousel ref="ban" height="360px">
          <el-carousel-item class="banner_item" v-for="item in goodsBanner" :key="item.product_pic_id">
            <el-image class="banner_img" :src="item.pic_url"></el-image>
          </el-carousel-item>
        </el-carousel>
        <!-- 轮播图缩略 -->
        <div class="left_spec">
          <div class="spec_img" v-for="(item, index) in goodsBanner" :key="item.product_pic_id"
            @click="changeBanner(index)">
            <el-image :src="item.pic_url"></el-image>
          </div>
        </div>
      </div>
      <!-- 右侧商品信息 -->
      <div class="right_wrap">
        <div class="detail_name">
          {{goodsDetail.product_name}}
        </div>
        <div class="detail_price">
          <span>价格：</span>
          <span>
            ￥{{chosedVersion.sku_price}}
          </span>
        </div>
        <div class="detail_skuList">
          <span>选择版本：</span>
          <div class="sku_item" :class="{choseVer: item.sku_id === chosedVersion.sku_id }"
            v-for="item in goodsDetail.sku" :key="item.sku_id" @click="getVersion(item)">
            {{item.sku_version}}
          </div>
        </div>
        <div class="detail_num">
          <span>数量：</span>
          <el-input-number size="mini" :min="1" :max="chosedVersion.sku_num" v-model="num"></el-input-number>
          <span>库存：{{chosedVersion.sku_num}}件</span>
        </div>
        <div class="detail_btn">
          <el-button :disabled="chosedVersion.sku_num == 0" @click.native="toBuy">立即购买</el-button>
          <el-button :disabled="chosedVersion.sku_num == 0" type="danger" @click.native="insertShopCart">加入购物车
          </el-button>
        </div>
        <div class="detail_serve">
          <span>服务承诺</span>
          <span>正品保证</span>
          <span>极速退款</span>
          <span>七天无理由退换</span>
        </div>
      </div>
    </div>
    <!-- 详情图片 -->
    <div class="detail_main">
      <!-- 供应商 -->
      <div class="supplier">
        <div class="supplier_title">
          {{supplier.supplier_name}}
        </div>
        <div class="supplier_score">
          <div>
            <div>描述</div>
            <span>{{supplier.desc_score}}</span>
          </div>
          <div>
            <div>服务</div>
            <span>{{supplier.serve_score}}</span>
          </div>
          <div>
            <div>物流</div>
            <span>{{supplier.logi_score}}</span>
          </div>
        </div>
        <!-- <div class="supplier_btn">
          <el-button type="warning" round>进店逛逛</el-button>
        </div> -->
      </div>
      <!-- 商品详情 -->
      <div class="detail">
        <div class="detail_title">
          <span :class="{ chose: switchPage == 'detail'}" @click="switchtab('detail')">商品详情</span>
          <span :class="{ chose: switchPage == 'comment'}" @click="switchtab('comment')">商品评价</span>
        </div>
        <!-- 主体详情图片 -->
        <div v-if="switchPage == 'detail'">
          <div class="detail_img" v-for="item in goodsMainImg" :key="item.product_pic_id">
            <el-image :src="item.pic_url"></el-image>
          </div>
        </div>
        <!-- 评价 -->
        <div class="comment" v-else-if="switchPage == 'comment'">
          <goods-comm :product_id="goods_id"></goods-comm>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import goodsComm from '@/components/goodsDetail/goodsComm'
  export default {
    data() {
      return {
        goods_id: this.$route.query.goods_id,
        goodsDetail: {},
        goodsBanner: [],
        goodsMainImg: [],
        supplier: {},
        chosedVersion: {},
        num: 0,
        orderList: {},
        switchPage: 'detail'
      }
    },
    async created() {
      await this.getGoodDetail()
    },
    methods: {
      // 获取商品详情
      async getGoodDetail() {
        let detail = await this.$store.dispatch("getGoodsDetailById", {
          goods_id: this.goods_id
        })
        if (detail.status == 200) {
          if (detail.result.length == 0) {
            this.$message.error("暂无该商品")
            setTimeout(() => {
              this.$router.go(-1)
            }, 200)
            return
          }
          this.goodsDetail = detail.result[0]
          this.goodsBanner = detail.result[0].image.goodsBanner
          this.goodsMainImg = detail.result[0].image.goodsMain
          this.supplier = detail.result[0].supplier
          this.getVersion(this.goodsDetail.sku[0])
        }
        // console.log(this.goodsDetail);
      },
      changeBanner(index) {
        this.$refs.ban.setActiveItem(index)
      },
      async getVersion(version) {
        // await this.getGoodDetail()
        this.chosedVersion = version
        // console.log(this.chosedVersion);
      },
      // 去购买
      toBuy() {
        let temp = [{
          goods: this.goodsDetail,
          amount: this.num,
          sku: this.chosedVersion
        }]
        console.log(temp);
        this.$router.push({
          path: '/settlement',
          query: {
            goodsData: JSON.stringify(temp)
          }
        })
      },
      // 加入购物车
      async insertShopCart() {
        let temp = {
          customer_id: this.$store.state.userInfo.customer_id,
          product_id: this.goods_id,
          sku_id: this.chosedVersion.sku_id,
          amount: this.num
        }
        // console.log(temp);
        let shopCart_res = await this.$store.dispatch("insertShopCart", {
          shopInfo: temp
        })
        console.log(shopCart_res);
        if (shopCart_res.status == 200) {
          this.$message.success("加入购物车成功")
        }
      },
      switchtab(path) {
        this.switchPage = path
      }
    },
    components: {
      goodsComm
    }
  }

</script>
<style scoped>
  .detail_container {
    width: 950px;
    min-width: 900px;
    min-height: 600px;
    margin: 0 auto;
  }

  .detail_meta {
    height: 480px;
    padding: 20px;
    display: flex;
    /* border: 1px solid #ccc; */
    background-color: white;
  }

  .leftBanner {
    flex: 1.5;
    margin-right: 20px;
  }

  .left_spec {
    width: 100%;
    cursor: pointer;
    display: flex;
    justify-content: space-around;
  }

  .banner_item {
    width: 290px;
    height: 320px;
  }

  .banner_img {
    width: 290px;
    height: 320px;
  }

  .spec_img .el-image {
    width: 50px;
    height: 50px;
  }

  /* 右侧 */
  .right_wrap {
    flex: 3;
    margin-left: 20px;
  }

  .detail_name {
    width: 80%;
    font-weight: bold;
    font-size: 18px;
    line-height: 30px;
  }

  .detail_price {
    margin: 20px 0;
  }

  .detail_price>span:last-child {
    height: 50px;
    line-height: 50px;
    color: red;
    font-weight: bold;
    font-size: 25px;
  }

  .detail_skuList {
    margin: 40px 0;
    display: flex;
  }

  .detail_skuList span:first-child {
    line-height: 40px;
  }

  .sku_item {
    margin-left: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    cursor: pointer;
  }

  .detail_btn {
    margin: 50px;
  }

  .detail_serve {
    font-size: 12px;
  }

  .detail_serve span:first-child {
    font-size: 16px;
  }

  .detail_num span:last-child {
    font-size: 10px;
  }

  /* 被选中的版本样式 */
  .choseVer {
    border: 1px solid red;
  }

  .detail_main {
    display: flex;
  }

  /* 供应商信息 */
  .supplier {
    width: 200px;
    /* min-width: 100px; */
    height: 200px;
    border: 1px solid #ccc;
    background-color: white;
  }

  .supplier_title {
    height: 50px;
    line-height: 50px;
    padding-left: 5px;
    background-color: white;
    border-bottom: 1px solid #ccc;
  }

  .supplier_score {
    margin-top: 20px;
    text-align: center;
    display: flex;
    justify-content: space-around;
  }

  .supplier_score span {
    display: block;
    margin-top: 5px;
    color: red;
  }

  .supplier_btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }


  /* 商品详情 */
  .detail {
    width: 790px;
    min-width: 790px;
  }

  .detail_title {
    height: 50px;
    line-height: 50px;
    /* color: red; */
    font-size: 18px;
    border: 1px solid #ccc;
    background-color: white;
    cursor: pointer;
  }

  .detail_title span {
    display: inline-block;
    width: 100px;
    text-align: center;
  }

  /* 选中详情或评论 */
  .chose {
    border-top: 1px solid red;
    background-color: rgb(243, 243, 243);
  }

  /* 评论 */
  .comment {
    height: 800px;
    margin-bottom: 50px;
    /* background-color: pink; */
  }

</style>
