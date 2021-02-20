<template>
  <div>
    <el-table :data="commentList" style="width: 100%">
      <el-table-column label="商品名称" width="280">
        <template v-slot="scope">
          <div>
            {{scope.row.product_name | formatGoodsName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="评论内容" width="360">
      </el-table-column>
      <el-table-column prop="nick_name" label="用户昵称" width="150">
      </el-table-column>
      <el-table-column label="评论时间" width="150">
        <template v-slot="scope">
          <div>
            {{scope.row.audit_time | formatTime}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="150">
        <template v-slot="scope">
          <div>
            {{scope.row.audit_status == 0? '未审核':'已审核'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <div>
            <el-button v-if="scope.row.audit_status == 0" size="mini" type="success"
              @click.native="modifyStatus(scope.row.comment_id, scope.row.audit_status)">
              已审核
            </el-button>
            <el-button v-else size="mini" type="warning"
              @click.native="modifyStatus(scope.row.comment_id, scope.row.audit_status)">
              未审核
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
      :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        commentList: [],
        pageSize: 5,
        pageNum: 1,
        total: 0,
        value: 0
      }
    },
    created() {
      this.getComment()
    },
    methods: {
      // 获取评论
      async getComment() {
        let {
          data: res
        } = await this.$http.post("/admin/getComment", {
          pagesize: this.pageSize,
          pagenum: this.pageNum
        })
        if (res.status != 200) return this.$message.error("获取失败")
        this.commentList = res.data
        this.total = res.data[0].total
        console.log(res);
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getUserList()
      },
      // 修改评论状态
      async modifyStatus(id, status) {
        let {
          data: res
        } = await this.$http.post("/admin/modifyCommentStatus", {
          comment_id: id,
          status: status
        })
        console.log(res);
        if (res.status != 200) return this.$message.error("修改失败")
        this.getComment()
        this.$message.success("修改成功")
      }
    }
  }

</script>
<style scoped>

</style>
