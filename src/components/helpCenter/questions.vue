<template>
  <div>
    <ul class="help_item">
      <li v-for="item in helpList" :key='item.help_id'>
        <el-link @click.native="toAnswer(item.help_id)">{{item. title}}</el-link>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        helpList: []
      }
    },
    created() {
      this.gethelp()
    },
    methods: {
      async gethelp() {
        let {
          data: result
        } = await this.$http.get("/help")
        // console.log(result);
        this.helpList = result.result
        console.log(this.helpList);
      },
      toAnswer(help_id) {
        this.$router.push({
          path: '/help/answer',
          query: {
            help_id: help_id
          }
        })
      }
    }
  }

</script>
<style scoped>
  .help_item {
    margin: 10px 0 0 20px;
  }

  .help_item li {
    margin: 10px;
  }

</style>
