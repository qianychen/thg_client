<template>
  <div>
    <div class="comment_list">
      <div class="comment_item" v-for="item in commentList" :key="item.comment_id">
        <div class="c_user">
          {{item.nick_name}}
          <!-- {{item.audit_time |formatTime}} -->
        </div>
        <div class="c_main">
          <el-rate v-model="item.star" disabled text-color="#ff9900" score-template="{value}">
          </el-rate>
          <div class="content">{{item.content}}</div>

          <div class="vesion">
            <span>{{item.product_version}}&nbsp;{{item.audit_time |formatTime}}</span>
          </div>


        </div>
        <div class="c_goods">
          <!-- <span>版本:</span>
          {{item.product_version}}
          {{item.audit_time |formatTime}} -->
        </div>
      </div>
      <div class="empty" v-if="commentList.length == 0">暂无评论</div>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
      :page-sizes="[100, 200, 300, 400]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    props: ['product_id'],
    data() {
      return {
        commentList: [],
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    },
    mounted() {
      this.getGoodsComment()
    },
    methods: {
      async getGoodsComment() {
        let {
          data: result
        } = await this.$http.post("/goods/getGoodsCommentByGoodsId", {
          product_id: this.product_id,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        })
        // console.log(result);
        if (result.status != 200) return this.$message.error("获取失败")
        this.commentList = result.result
        this.total = result.result[0].total
        // console.log(this.commentList)
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getGoodsComment()
      }
    },
  }

</script>
<style scoped>
  .comment_list {
    height: 800px;
    margin-bottom: 10px;
    background-color: white;
  }

  .comment_item {
    display: flex;
    height: 120px;
    padding: 10px;
    background-color: white;
    border-bottom: 1px solid #ccc;
  }

  .c_user {
    margin-top: 30px;
  }

  .c_main {
    flex: 2;
    position: relative;
  }

  .content {
    height: 80px;
    overflow: hidden;
  }

  .vesion {
    position: absolute;
    bottom: 0;
  }

  .c_goods {
    flex: 1;
    margin-top: 20px;
  }

  .c_user {
    flex: .5;
  }

  .empty {
    height: 800px;
    background-color: white;
    font-size: 20px;
    color: #ccc;
    padding-top: 50px;
    text-align: center;
  }

</style>
