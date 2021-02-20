<template>
  <div class="user_info">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <basic-user @sec="tosec"></basic-user>
      </el-tab-pane>
      <el-tab-pane label="更改头像" name="second">
        <change-avatar></change-avatar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import basicUser from '@/components/user/userInfostep/basicUser'
  import changeAvatar from '@/components/user/userInfostep/changeAvatar'
  export default {
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
      tosec(val){
        this.activeName = val
      }
    },
    components: {
      basicUser,
      changeAvatar
    }
  }

</script>
<style scoped>
  .user_info {
    height: 100%;
  }

  .user_info .el-tabs {
    padding: 20px 0 0 50px;
  }

</style>
