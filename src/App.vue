<template>
  <div id="app">
    <common-header></common-header>
    <!-- 主体部分 -->
    <div class="main">
      <router-view />
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
  import commonHeader from '@/components/common/commonHeader'
  import commonFooter from '@/components/common/commonFooter'
  import {
    mapState
  } from 'vuex'
  export default {
    name: 'App',
    components: {
      commonHeader,
      commonFooter
    }
  }

</script>

<style scoped>
  .main{
    min-height: 600px;
  }

</style>
