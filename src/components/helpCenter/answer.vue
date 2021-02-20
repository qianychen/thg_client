<template>
  <div class="help">
    <div class="title">{{helpInfo.title}}</div>
    <div class="content">{{helpInfo.content}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        help_id: this.$route.query.help_id,
        helpInfo: ''
      }
    },
    created() {
      // console.log(this.help_id)
      this.getHelpById()
    },
    methods: {
      async getHelpById() {
        let {
          data: result
        } = await this.$http.get('/getHelpById', {
          params: {
            help_id: this.help_id
          }
        })
        this.helpInfo = result.result
        console.log(this.helpInfo);
      }
    }
  }

</script>
<style scoped>
  .help {
    margin: 20px;
  }

  .title {
    border-bottom: 1px solid #ccc;
    font-weight: bold;
  }

  .content {
    margin-top: 20px;
  }

</style>
