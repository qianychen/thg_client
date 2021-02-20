<template>
  <div>
    <el-button type="success" @click.native="adddialogVisible = true">添加分类</el-button>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="adddialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="add" label-width="100px">
        <el-form-item label="分类层级">
          <el-select v-model="addForm.cate_level" @change="selOne" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类" v-if="addForm.cate_level != 0">
          <el-select v-model="addForm.one" @change="selTwo" placeholder="请选择">
            <el-option v-for="item in oneList" :key="item.category_id" :label="item.category_name"
              :value="item.category_id">
            </el-option>
          </el-select>
          <el-select v-model="addForm.two" v-if="addForm.cate_level == 2" placeholder="请选择">
            <el-option v-for="item in twoList" :key="item.category_id" :label="item.category_name"
              :value="item.category_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="addForm.cate_name" maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <hr>
    <!-- 表格主体 -->
    <el-table :data="cateList" :row-class-name="tableRowClassName" style="width: 100%;margin-bottom: 20px;"
      row-key="category_id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="category_name" label="分类名称" sortable>
      </el-table-column>
      <el-table-column prop="parent_id" label="分类父id" sortable>
      </el-table-column>
      <el-table-column label="分类层级" sortable>
        <template v-slot="scope">
          <div>
            {{scope.row.category_level == 0? "一级分类": scope.row.category_level == 1?"二级分类":"三级分类"}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <div>
            <el-button size="mini" type="warning" @click.native="modifyCate(scope.row.category_id)">修改
            </el-button>
            <!-- 
            <el-popconfirm title="确定删除吗？" @onConfirm="delCate(scope.row.category_id, scope.row.category_level)">
              <el-button slot="reference" size="mini" type="danger">删除
              </el-button>
            </el-popconfirm> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改分类提示框 -->
    <el-dialog title="修改分类名称" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" :rules="modifyrule" label-width="100px">
        <el-form-item label="分类名称:" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="submitCate('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        cateList: [],
        form: {
          name: '',
          cateId: 0
        },
        dialogVisible: false,
        modifyrule: {
          name: [{
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }]
        },
        // 添加分类
        adddialogVisible: false,
        addForm: {
          cate_level: 0,
          one: '',
          two: '',
          cate_name: ''
        },
        oneList: [],
        twoList: [],
        options: [{
            label: '一级分类',
            value: 0
          },
          {
            label: '二级分类',
            value: 1
          },
          {
            label: '三级分类',
            value: 2
          }
        ]
      }
    },
    created() {
      this.getCate()
    },
    methods: {
      // 获取分类
      async getCate() {
        let {
          data: result
        } = await this.$http.get("/goods/getCategory")
        console.log(result);
        this.cateList = result.result
      },
      // 列表变色
      tableRowClassName({
        row,
        rowIndex
      }) {
        if (row.category_level == 0) {
          return "success-row"
        } else if (row.category_level == 1) {
          return "warning-row"
        }
        return '';
      },
      // 修改分类
      async modifyCate(cate_id) {
        console.log(cate_id);
        let {
          data: res
        } = await this.$http.post("/admin/getCateById", {
          cateId: cate_id
        })
        console.log(res);
        if (res.status != 200) return this.$message.error("获取失败")
        this.form.name = res.result.category_name
        this.form.cateId = cate_id
        this.dialogVisible = true
      },
      // 提交修改表单
      submitCate(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let {
              data: res
            } = await this.$http.post("/admin/modifyCateName", {
              form: this.form
            })
            console.log(res);
            if (res.status != 200) return this.$message.error("修改失败")
            this.dialogVisible = false
            this.getCate()
            this.$message.success("修改成功")
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false
      },

      selOne() {
        let temp = this.cateList.filter(item => {
          if (item.category_level == 0) {
            return item
          }
        })
        this.oneList = temp
      },
      selTwo() {
        let temp = this.oneList.filter(item => {
          if (item.category_id == this.addForm.one) {
            return item
          }
        })
        console.log(temp);
        this.twoList = temp[0].children
      },
      async addCate() {
        if (this.addForm.cate_name == '') return this.$message.error("请输入分类名称")
        let {
          data: res
        } = await this.$http.post("/admin/addCate", {
          addForm: this.addForm
        })
        console.log(res);
        if (res.status != 200) return this.$message.error('添加失败')
        this.getCate()
        this.$message.success("添加成功")
        this.adddialogVisible = false
      },
      async handleClose(done) {
        this.addForm = {
            cate_level: 0,
            one: '',
            two: '',
            cate_name: ''
          },
          done();
      },
      delCate(id, cate_level) {
        // console.log(id, cate_level);
        // let level = cate_level == 0? '一':cate_level == 1? '二': '三'
        // this.$confirm(`您要删除的是${level}级分类, 该分类下的子分类也会被删除，是否继续?`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   });
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   });          
        // });
      }
    }
  }

</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

</style>
