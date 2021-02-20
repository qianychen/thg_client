<template>
  <div class="help">
    <div class="help_con">
      <div class="help_header">常见问题</div>
      <div class="help_content">
        <div class="left_help">
          <el-menu default-active="1">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title" @click="tohelp">账号问题</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="right_help">
          <router-view></router-view>
        </div>
      </div>
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
      tohelp(){
        this.$router.push("/help/questions")
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }

</script>
<style scoped>
  .help {
    min-height: 600px;
    height: 600px;
  }

  .help_con {
    width: 1100px;
    height: 100%;
    margin: 0 auto;
    padding: 30px 0 0 30px;
    box-sizing: border-box;
    background-color: white;

  }

  .help_header {
    font-size: 20px;
    font-weight: bold;
    padding: 10px;
    margin: 10px;
    background-color: #EAEAEA;
  }

  .help_content {
    display: flex;
  }

  .left_help {
    flex: .5;
    /* background-color: red; */
  }

  .right_help {
    flex: 2;
  }

</style>
