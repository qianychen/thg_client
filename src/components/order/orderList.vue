<template>
  <div class="order">
    <div class="order_list">
      <div class="tabs">
        <div :class="{chose: ctab == 'all'}" @click="toList('all')">全部订单</div>
        <div :class="{chose: ctab == '0'}" @click="toList('0')">待付款</div>
        <div :class="{chose: ctab == '1'}" @click="toList('1')">待发货</div>
        <div :class="{chose: ctab == '2'}" @click="toList('2')">待收货</div>
        <div :class="{chose: ctab == '3'}" @click="toList('3')">评价</div>
      </div>
      <div>
        <order-list-show :tabs="ctab"></order-list-show>
      </div>

    </div>
  </div>
</template>
<script>
  import orderListShow from '@/components/order/orderListShow'
  export default {
    data() {
      return {
        tab: this.$route.query.tab,
        orderList: [],
        ctab: 'all',
      }
    },
    async created() {
      if (this.tab == undefined) {
        this.ctab == 'all'
        return
      }
      console.log(this.tab);
      this.ctab = this.tab
    },
    watch: {
      '$route'(to, from) {
        console.log(to);
        console.log(from);
        this.$router.go(0);
      }
    },
    methods: {
      toList(tab1) {
        this.ctab = tab1
        this.tab = tab1
      }
    },
    components: {
      orderListShow
    }
  }

</script>
<style scoped>
  .order {
    width: 1100px;
    min-width: 900px;
    margin: 0 auto;
  }

  .order_list {
    min-height: 600px;
    padding: 10px;
    background-color: white;
  }

  .tabs {
    display: flex;
    background-color: white;
    border-bottom: 1px solid #AADDEE;
    margin-bottom: 5px;
  }

  .tabs div {
    padding: 10px;
    /* border: 1px solid #ccc; */
    border-radius: 5px;
    /* background-color: #ade; */
    cursor: pointer;
  }

  .tabs div:hover {
    color: #E4393C;
  }

  .chose {
    font-weight: bold;
    color: #E4393C;
    /* background-color: #F1F1F1 !important; */
  }

</style>
