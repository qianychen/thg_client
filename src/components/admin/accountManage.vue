<template>
  <div>
    <el-table :data="users"  border style="width: 100%;height: 330px">
      <el-table-column type="index" :index="formatidnex">
      </el-table-column>
      <el-table-column prop="nick_name" label="昵称" width="180">
      </el-table-column>
      <el-table-column prop="mobile_phone" label="手机号">
      </el-table-column>
      <el-table-column prop="customer_email" label="邮箱">
      </el-table-column>
      <el-table-column prop="user_money" label="余额">
      </el-table-column>
      <el-table-column label="注册时间">
        <template slot-scope="scope">
          <div>
            {{scope.row.register_time | formatTime}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-popconfirm title="确定删除吗？" @onConfirm="delUser(scope.row.customer_id)">
              <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popconfirm>
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
        userList: [],
        pageSize: 5,
        pageNum: 1,
        total: 0
      }
    },
    created() {
      this.getUserList()
    },
    computed: {
      users() {
        return this.userList
      }
    },
    methods: {
      // 获取用户列表
      async getUserList() {
        let {
          data: result
        } = await this.$http.post("/admin/getUserList", {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        })
        console.log(result)
        if (result.status != 200) return this.$message.error("用户获取失败")
        this.userList = result.result
        this.total = result.result[0].total
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getUserList()
      },
      // 删除用户
      async delUser(user_id) {
        let {
          data: result
        } = await this.$http.post("/admin/delUserById", {
          userId: user_id
        })
        if (result.status != 200) return this.$message.error("用户删除失败")
        this.getUserList()
        this.$message.success("用户删除成功")
      },
      formatidnex(index) {
        return (this.pageNum - 1) * this.pageSize + index + 1
      }
    }
  }

</script>
<style scoped>

</style>
