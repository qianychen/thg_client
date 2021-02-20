<template>
  <div class="main_container">
    <!-- 主页导航[[ -->
    <div class="main_con">
      <el-row>
        <!-- category -->
        <el-col :span="3" class="main_con_l">
          <!-- 一级分类 -->
          <div class="cate_con" v-for="(item, index) in categories" @mouseover="showCate(index, true)"
            @mouseout="showCate(index, false)">
            <span>
              {{ item.category_name}} >
            </span>

          </div>
          <div class="tips" v-show="rightShow" @mouseover="stayCate(true)" @mouseout="stayCate(false)">
            <!-- 二级分类 -->
            <div class="cate_two" v-for="two in rightNav" :key="two.category_id">
              <div>
                <span>{{two.category_name}}</span>
              </div>
              <!-- 三级分类 -->
              <div class="cate_three">
                <div v-for="three in two.children" :key="three.category_id" @click="search(three.category_name)">
                  <span>{{three.category_name}}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <!-- banner -->
        <el-col :span="17" class="main_con_m">
          <el-carousel class="banner" height="400px">
            <el-carousel-item class="banner_item" v-for="item in banner" :key="item.goods_id">
              <el-image :src="item.src" @click.native="toGoodsDeatil(item.goods_id)"></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <!-- user -->
        <el-col :span="4" class="main_con_r">
          <div class="homeUer">
            <!-- 用户头像和昵称 -->
            <div class="home_avatar">
              <!-- 登录后显示 -->
              <div v-if="token">
                <el-avatar :size="70" :src="userInfo.avatar"></el-avatar>
                <div class="home_nickName">{{userInfo.nick_name}}</div>
              </div>
              <!-- 登录前显示 -->
              <div v-else>
                <el-avatar :size="70" :src="defAvatar"></el-avatar>
                <div class="home_nickName">HI! 你好</div>
              </div>
            </div>
            <!-- 登陆按钮或 -->
            <div class="homeUser_btn">
              <div v-if="!token">
                <button @click="routePath('login')">登陆</button>
                <button @click="routePath('register')">注册</button>
              </div>
              <div class="home_order" v-else>
                <div @click="toOrder('0')">
                  <div class="home_order_num">{{order.topay}}</div>
                  待支付
                </div>
                <div @click="toOrder('2')">
                  <div class="home_order_num">{{order.toreceived}}</div>
                  待收货
                </div>
                <div @click="toOrder('3')">
                  <div class="home_order_num">{{order.toevaluated}}</div>
                  待评价
                </div>
                <div class="home_order_all" @click="routePath('/orderList')">
                  全部订单
                </div>
              </div>
            </div>
          </div>
          <!-- 主页帮助中心列表 -->
          <div class="help">
            <div class="help_all">
              <span>常用帮助</span>
              <span @click="routePath('/help/questions')">全部帮助>></span>
            </div>
            <div v-for="item in helpList" :key="item.help_id">
              <div class="help_item" @click="toAnswer(item.help_id)">
                {{item.title}}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 主页导航]] -->
    <recommend-goods></recommend-goods>
    <guess-like></guess-like>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex'
  import recommendGoods from '@/components/home/recommendGoods'
  import guessLike from '@/components/home/guessLike'
  export default {
    data() {
      return {
        defAvatar: 'http://127.0.0.1:3000/images/userAvatar/avatar.png',
        categories: [],
        banner: [{
            src: "http://127.0.0.1:3000/images/banner/banner1.jpg",
            goods_id: 12
          },
          {
            src: "http://127.0.0.1:3000/images/banner/banner2.png",
            goods_id: 19
          },
          {
            src: "http://127.0.0.1:3000/images/banner/banner3.png",
            goods_id: 2
          }
        ],
        rightNav: [],
        rightShow: false,
        order: {
          topay: 0,
          toreceived: 0,
          toevaluated: 0
        },
        helpList: []
      }
    },
    created() {
      this.getCategory()
      this.getAllOrder()
      this.getHelp()
    },
    methods: {
      // 获取分类
      async getCategory() {
        let {
          data: category_res
        } = await this.$http.get("/goods/getCategory")
        // console.log(category_res);
        if (category_res.status == 200) {
          this.categories = category_res.result
        }
        // console.log(this.categories)
      },
      // 页面跳转
      routePath(path) {
        this.$router.push(path)
      },
      // 获取全部订单
      async getAllOrder() {
        let orderList_res = await this.$store.dispatch('getOrderListById', {
          userId: this.$store.state.userInfo.customer_id,
          orderStatus: 'all',
          pageSize: 1000,
          pageNum: 1
        })
        // console.log(orderList_res.result);
        orderList_res.result.forEach(item => {
          if (item.order_status == 0) {
            this.order.topay++
          } else if (item.order_status == 2) {
            this.order.toreceived++
          } else if (item.order_status == 3) {
            this.order.toevaluated++
          }
        })
      },
      // 获取帮助
      async getHelp() {
        let {
          data: result
        } = await this.$http.get("/randomHelp")
        console.log(result);
        this.helpList = result.result
      },
      // 首页分类左侧控制
      showCate(index, flag) {
        if (flag) {
          this.rightNav = this.categories[index].children
          this.rightShow = true
        } else {
          this.catechose = 99
          this.rightShow = false
        }
      },
      // 首页分类保持右侧控制
      stayCate(flag) {
        if (flag) {
          this.rightShow = true
        } else {
          this.rightShow = false
        }
      },
      // 点击分类跳转搜索
      search(key) {
        // console.log(key);
        this.$router.push({
          path: '/search',
          query: {
            keyword: key
          }
        })
      },
      // 跳转订单列表页面
      toOrder(tab) {
        this.$router.push({
          name: 'orderList',
          params: {
            tab: tab
          }
        })
      },
      // 跳转帮助页面
      toAnswer(help_id) {
        this.$router.push({
          path: '/help/answer',
          query: {
            help_id: help_id
          }
        })
      },
      // 点击banner跳转商品详情
      toGoodsDeatil(id){
        this.$router.push({
          path: '/goodsDetail',
          query: {
            goods_id: id
          }
        })
      }
    },
    computed: {
      ...mapState(['userInfo', 'token'])
    },
    filters: {
      cate_filter: (value) => {
        return value
      },
    },
    components: {
      recommendGoods,
      guessLike
    }
  }

</script>
<style scoped>
  .main_container {
    width: 1200px;
    min-width: 1100px;
    min-height: 480px;
    margin: 0 auto;
  }

  .main_con {
    width: 1200px;
    height: 400px;
  }

  .main_con_l {
    min-width: 150px;
    height: 400px;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    background-color: white;
    border-left: 1px solid white;
  }

  /* 主分类 */
  .cate_con {
    /* height: 40px;
    line-height: 40px; */
    cursor: pointer;
    z-index: 10;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* .cate_con>span { */
  /* display: block;
    width: 80px;
    margin: 0 auto; */
  /* } */

  .cate_con>span:hover {
    color: red;
  }

  .chose {
    background-color: #F3F3F3;
  }

  /* 子分类 */
  .tips {
    width: 400px;
    height: 400px;
    /* border: 1px solid #FF5000; */
    background-color: #F3F3F3;
    position: absolute;
    top: 0px;
    left: 140px;
    z-index: 9;
  }

  .cate_two {
    margin-top: 10px;
    height: 100px;
    /* cursor: pointer; */
  }

  .cate_two>div>span {
    font-size: 20px;
    padding-left: 15px;
  }

  .cate_three {
    margin: 15px 0;
    font-size: 14px;
    display: flex;
    cursor: pointer;
  }

  .cate_three>div {
    margin: 0 15px;
  }

  /* banner */
  .main_con_m {
    height: 400px;
  }

  .main_con_r {
    height: 400px;
    background-color: white;
  }

  .el-image {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  /* 主页用户模块 */
  .homeUer {
    height: 150px;
    padding-top: 15px;
    /* background-color: red; */
    display: flex;
    flex-flow: column;
    align-items: center;
    text-align: center;
    cursor: pointer;
    background: url('../../assets/images/home_user_bgi.jpg')
  }


  .home_nickName {
    margin: 5px 0;
  }

  .homeUser_btn {
    width: 100%;
  }

  .homeUser_btn button {
    width: 60px;
    background-color: #D4237A;
    color: white;
    border: none;
    padding: 5px;
    margin-top: 3px;
    cursor: pointer;
  }

  .home_order {
    font-size: 10px;
    display: flex;
    justify-content: space-around;
  }

  .home_order>div {
    cursor: pointer;
  }

  .home_order>div:hover {
    color: red;
  }

  .home_order_num {
    color: red;
    font-size: 18px;
    margin: 2px 0;
  }

  .home_order_all {
    width: 30px;
    height: 40px;
    line-height: 20px;
    color: red;
    border-left: 2px solid #ccc;
  }

  .help {
    height: 235px;
    overflow: hidden;
  }

  .help_all {
    height: 30px;
    line-height: 30px;
    font-size: 10px;
    padding: 0 4px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }

  .help_item {
    padding: 0 5px;
    height: 35px;
    line-height: 35px;
    overflow: hidden;
    cursor: pointer;
  }

</style>
