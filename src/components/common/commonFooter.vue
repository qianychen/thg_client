<template>
  <div class="footer" v-if="!$route.path.includes('/admin')">
    <div class="copy">&copy;学生本生</div>
    <div class="mode">
      <div class="mode_copy_1 mode_copy"></div>
      <div class="mode_copy_2 mode_copy"></div>
      <div class="mode_copy_3 mode_copy"></div>
      <div class="mode_copy_4 mode_copy"></div>
      <div class="mode_copy_5 mode_copy"></div>
    </div>

  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    methods: {

    }
  }

</script>
<style scoped>
  .footer {
    width: 1519px;
    min-width: 1100px;
    height: 100px;
    margin: 0 auto;
    background-color: white;
    z-index: -99;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }


  .mode {
    margin: 0 auto;
    display: flex;

  }

  .mode_copy {
    width: 103px;
    height: 32px;
    margin: 10px;
    background-color: pink;
    background-image: url('../../assets/images/footer.png');
  }

  .mode_copy_1 {
    background-position: -205px -111px;
  }

  .mode_copy_2 {
    background-position: -205px -74px;
  }

  .mode_copy_3 {
    background-position: -205px -37px;
  }

  .mode_copy_4 {
    background-position: -205px 0px;
  }

  .mode_copy_5 {
    background-position: 0px -155px;
  }

  .mode_copy_6 {
    background-position: 0px -99px;
  }

</style>
