<template>
  <div>
    testHtml
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    created() {
      this.getWeath()
    },
    methods: {
      async getWeath() {
        let url = '/api/wuhan/app/data/list-total'
        let data = await this.$http.get(url)
        console.log(data);
      }
    }
  }

</script>
<style scoped>

</style>
