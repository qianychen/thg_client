<template>
  <div class="container">
    <!-- 搜索 -->
    <div class="header">
      <el-row class="header_row">
        <el-col :span="4" class="logo" @click.native="toHome">
          <img src="@/assets/images/logo.png" alt="">
        </el-col>
        <el-col :span="16" class="search">
          <el-input :placeholder="placeKeyword" class="search_input" @keyup.enter.native="search" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click.native="search"></el-button>
          </el-input>
          <div class="hot_word">
            <div @click="hotSearch('小米')">小米</div>
            <div @click="hotSearch('连衣裙')">连衣裙</div>
            <div @click="hotSearch('休闲裤')">休闲裤</div>
          </div>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
    </div>
    <home-main></home-main>
  </div>

</template>
<script>
  import homeMain from "./homeMain.vue"

  export default {
    data() {
      return {
        placeKeyword: '手机',
        keyword: ''
      }
    },
    methods: {
      toHome() {
        this.$router.push('/')
      },
      async search() {
        let key = this.keyword == '' ? this.placeKeyword : this.keyword
        this.$router.push({
          path: '/search',
          query: {
            keyword: key
          }
        })
      },
      hotSearch(hot_word) {
        this.$router.push({
          path: '/search',
          query: {
            keyword: hot_word
          }
        })
      }
    },
    components: {
      homeMain
    }
  }

</script>
<style scoped>
  .container {
    width: 100%;
  }

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
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }

  .search_input {
    width: 70%;
    height: 40px;
  }

  .swith {
    min-height: 470px;
  }

  .hot_word {
    width: 70%;
    display: flex;
    justify-content: flex-start;
  }

  .hot_word div {
    margin-right: 15px;
    cursor: pointer;
    font-size: 12px;
    margin-top: 10px;
    color: #bbb;
  }

  .hot_word div:hover {
    color: red;
  }

  .hot_word div:first-child {
    color: red;
  }

</style>
