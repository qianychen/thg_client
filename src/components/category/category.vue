<template>
  <div class="category_container">
    <!-- 左 -->
    <div class="left_cate"></div>
    <!-- 右 -->
    <div class="right_cate">
      <div>
        <img src="@/assets/images/logo.png" alt="">
        <div>商品分类</div>
      </div>
      <div class="cate_list">
        <div class="cate_item" v-for="item in categories" :key="item.category_id">
          <div>{{item.category_name}}</div>
          <div>
            <div class="cate_two" v-for="two in item.children" :key="two.category_id">
              <div>{{two.category_name}}</div>
              <div>
                <div class="cate_three" v-for="three in two.children" :key="three.category_id">
                  <div @click="search(three.category_name)">{{three.category_name}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        categories: []
      }
    },
    created() {
      this.getCategory()
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
        console.log(this.categories)
      },
      search(key) {
        // console.log(key);
        this.$router.push({
          path: '/search',
          query: {
            keyword: key
          }
        })
      },
    },
  }

</script>
<style scoped>
  .category_container {
    width: 100%;
    min-width: 800px;
    min-height: 590px;
    margin: 10px auto;
    padding: 20px 0;
    background-color: white;
  }

  .right_cate {
    width: 1000px;
    height: 100%;
    margin: 0 auto;
  }

  .right_cate>div:first-child {
    display: flex;
    align-items: center;
    font-size: 30px;
  }

  .cate_list {
    margin-top: 30px;
  }

  .cate_item {
    margin-bottom: 20px;
  }

  .cate_item>div:first-child {
    margin: 0 0 10px 10px;
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 5px;
    border-bottom: 1px solid #ccc;
    /* cursor: pointer; */
  }

  .cate_item>div:last-child {
    display: flex;
    width: 100%;
  }

  .cate_two {
    width: 300px;
    margin: 0 40px;
  }

  .cate_two>div:first-child {
    margin: 10px 0;
    font-size: 18px;
  }

  .cate_two>div:last-child {
    display: flex;
    /* width: 200px; */
    flex-flow: wrap;
  }

  .cate_three>div {
    margin: 10px;
    cursor: pointer;
  }

</style>
