<template>
  <div class="user_con">
    <div class="sidebar">
      <div>设置</div>
      <ul class="sidebar_list">
        <li @click="switchPage('/user/info')" :class="{chose: $route.path.includes('/info')}">个人信息</li>
        <li @click="switchPage('/user/securityCentre')" :class="{chose: $route.path.includes('/securityCentre')}">安全中心</li>
        <li @click="switchPage('/user/addr')" :class="{chose: $route.path.includes('/addr')}">收货地址</li>
        <li @click="switchPage('/user/wallet')" :class="{chose: $route.path.includes('/wallet')}">我的钱包</li>
      </ul>
    </div>
    <div class="user_main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    created() {

    },
    methods: {
      // 页面跳转
      switchPage(path) {
        this.$router.push(path)
      },
    }
  }

</script>
<style scoped>
  .user_con {
    width: 900px;
    min-width: 800px;
    min-height: 600px;
    margin: 0 auto;
    display: flex;
    border-bottom: 2px solid #eee;
  }

  .sidebar {
    flex: 1;
  }

  .user_main {
    flex: 8;
    background-color: white;
  }

  .sidebar {
    width: 100%;
    text-align: center;
  }

  .sidebar>div {
    margin: 10px 0;
  }

  .sidebar_list li {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
  }

  .sidebar_list li:hover {
    color: rgb(241, 36, 70);
  }

  .chose {
    color: red;
  }

</style>
