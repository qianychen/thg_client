<template>
  <div>
    <div>
      <!-- 搜索框 -->
      <el-input v-model="rquery.keyword" placeholder="请输入商品名称" @keyup.native='search'
        style="width: 400px;margin-bottom: 10px;">
        <el-button slot="append"><i class="el-icon-search"></i></el-button>
      </el-input>
      <el-button type="primary" @click.native="showAddDialog">添加商品</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="goodsList" border>
      <el-table-column type="index" :index="formatindex">
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="goods_images">
            <!-- 上传按钮 -->
            <div class="goodsImage_btn">
              <el-upload class="upload-demo" action="#" :limit="8" :auto-upload="false" list-type="picture-card"
                :on-remove="removeImg" :on-change="(file, fileList)=>{ return bannerchange(file, fileList)}" multiple>
                <el-button>选取文件</el-button>
              </el-upload>
              <el-button size="small" type="primary" @click.native="uploadBanner( props.row.product_id, 0)">点击上传商品详情轮播图
              </el-button>
            </div>
            <!-- 图片列表 -->
            <div class="goods_title">商品详情页轮播图</div>
            <div class="goods_banner_list">
              <div class="goods_banner_item" v-for="item in props.row.image.goodsBanner" :key="item.product_pic_id">
                <img :src="item.pic_url" alt="">
                <div class="goodsdel">
                  <el-popconfirm title="是否删除该图片" @onConfirm="delGoodsImg(item.product_pic_id)">
                    <i slot="reference" class="el-icon-delete"></i>
                  </el-popconfirm>
                </div>
              </div>
            </div>
            <!-- 上传按钮 -->
            <div class="goodsImage_btn">
              <el-upload class="upload-demo" action="#" :limit="8" :auto-upload="false" list-type="picture-card"
                :on-remove="removeImg" :on-change="(file, fileList)=>{ return bannerchange(file, fileList)}" multiple>
                <el-button>选取文件</el-button>
              </el-upload>
              <el-button size="small" type="primary" @click.native="uploadBanner( props.row.product_id, 1)">点击上传商品详情主图
              </el-button>
            </div>
            <!-- 图片列表 -->
            <div class="goods_title">商品详情页主图</div>
            <div class="goods_main_list">
              <div class="goods_main_item" v-for="item in props.row.image.goodsMain" :key="item.product_pic_id">
                <img :src="item.pic_url" alt="">
                <el-popconfirm title="是否删除该图片" @onConfirm="delGoodsImg(item.product_pic_id)">
                  <i slot="reference" class="el-icon-delete"></i>
                </el-popconfirm>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="500px">
        <template v-slot="scope">
          <div class="table_proName">
            <div class="table_img">
              <img :src="scope.row.main_img"></img>
            </div>
            <div style="width: 300px;">
              <div>{{scope.row.product_name}}</div>
              <div style="font-size: 12px;margin: 5px;">{{scope.row.supplier.supplier_name}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品版本" width="150px">
        <template v-slot="scope">
          <div style="overflow: auto;" v-html="test(scope.row.sku)">
            <!-- {{test(scope.row.sku)}} -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品录入时间" width="160px">
        <template v-slot="scope">
          <div>
            {{scope.row.indate | formatTime}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品上架状态" width="120px">
        <template v-slot="scope">
          <div>
            <div :style="scope.row.publish_status == 1?'color: green;':'color: #aaa;'">
              {{scope.row.publish_status == 1? '已上架': '暂未上架'}}</div>
            <div v-if="!scope.row.publish_status">
              <el-link @click.native="changepublishStatus(scope.row.product_id, scope.row.audit_status, true)">点击上架
              </el-link>
            </div>
            <div v-else>
              <el-link @click.native="changepublishStatus(scope.row.product_id, scope.row.audit_status, false)">点击下架
              </el-link>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品审核" width="100px">
        <template v-slot="scope">
          <div>
            {{scope.row.audit_status == 1? '已审核': '未审核'}}
            <div v-if="!scope.row.audit_status">
              <el-link type="success" @click.native="changeAuidt(scope.row,scope.row.product_id, true)">审核通过</el-link>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px">
        <template v-slot="scope">
          <div>
            <el-button size="mini" type="warning" @click.native="toMOdify(scope.row.product_id)">修改</el-button>
            <el-popconfirm title="是否删除该商品？" @onConfirm="delGoods(scope.row.product_id)">
              <el-button slot="reference" size="mini" type="danger">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="rquery.pageNum"
      :page-size="rquery.pageSize" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 添加商品对话框 -->
    <el-dialog title="添加商品" :visible.sync="adddialogVisible" width="600px" :before-close="handleClose">
      <el-form ref="form" :model="goodsInfo" :rules="rule" label-width="110px">
        <el-form-item label="商品名称：" prop="product_name">
          <el-input v-model="goodsInfo.product_name" maxlength="50" placeholder="请填写商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品分类：" prop="catechosed">
          <el-cascader v-model="goodsInfo.catechosed" :props="cateoptions" :options="cateList" @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="店铺名称：" prop="supplier">
          <el-select filterable allow-create v-model="goodsInfo.supplier" placeholder="请选择或输入店铺名称">
            <el-option v-for="item in suppList" :key="item.supplier_id" :label="item.supplier_name"
              :value="item.supplier_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本：" prop="version">
          <div class="goods_version" v-for="(item, index) in skuList" :key="index">
            <el-input @blur="check" v-model="item['sku_version' + item.sku_id]" placeholder="请输入版本信息"></el-input>
            <el-input @blur="check" v-model.trim="item['sku_price' + item.sku_id]" type="number" min="0"
              placeholder="请输入价格">
            </el-input>
            <el-button size="mini" type="danger" @click.native="delSkuInput(item.sku_id)">删除</el-button>
          </div>
          <el-button size="mini" @click.native="addSkuInput">增加</el-button>
        </el-form-item>
        <el-form-item label="商品简介：">
          <el-input type="textarea" placeholder="请填写商品简介" v-model="goodsInfo.descript" maxlength="30" show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="封面图：" prop="img">
          <el-upload action="#" :show-file-list="false" :auto-upload="false" :on-change="addPic" class="upload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-upload"></i>

          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        cateList: [],
        goodsList: [],
        suppList: [],
        total: 0,
        rquery: {
          pageSize: 4,
          pageNum: 1,
          keyword: ''
        },
        sku_i: 0,
        // 添加
        adddialogVisible: false,
        goodsInfo: {
          product_name: '',
          catechosed: [],
          supplier: '',
          descript: ''
        },
        file: {},
        imageUrl: '',
        skuList: [],
        cateoptions: {
          value: 'category_id',
          label: 'category_name',
          children: 'children'
        },
        rule: {
          product_name: [{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }],
          catechosed: [{
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }],
          supplier: [{
            required: true,
            message: '请选择或输入店铺名称',
            trigger: 'blur'
          }],
          // version: [{
          //   required: true,
          //   message: '请填写版本信息',
          //   trigger: 'blur'
          // }],
          // img: [{
          //   required: true,
          //   message: '请上传封面',
          //   trigger: 'blur'
          // }],
        },
        addImgs: [],
        addmainList: [],
        length: 0
      }
    },
    created() {
      this.getAllGoods()
      this.getCate()
      this.getSupplier()
    },
    methods: {
      // 获取所有商品数据
      async getAllGoods() {
        let {
          data: res
        } = await this.$http.post("/admin/getAllGoods", {
          query: this.rquery
        })
        console.log(res);
        if (res.status != 200) return this.$message.error(res.message)
        this.goodsList = res.result
        this.total = res.result[0].total
      },
      // 获取分类
      async getCate() {
        let {
          data: result
        } = await this.$http.get("/goods/getCategory")
        console.log(result);
        this.cateList = result.result
      },
      // 获取所有店铺
      async getSupplier() {
        let {
          data: result
        } = await this.$http.post("/admin/getAllsupplier")
        console.log(result);
        this.suppList = result.result
      },
      // 改变上下架状态
      async changepublishStatus(product_id, audit_status, flag) {
        // 判断是否审核通过
        if (!audit_status) {
          return this.$message.error("该商品暂未审核通过,请先审核")
        }
        let publish_status = ''
        let str = ''
        // 判断点击的按钮是上架还是下架
        if (flag) {
          publish_status = 1
          str = "上架"
        } else {
          publish_status = 0
          str = '下架'
        }
        console.log(publish_status);
        let {
          data: res
        } = await this.$http.post("/admin/changepublishStatus", {
          product_id: product_id,
          publish_status: publish_status
        })
        console.log(res);
        if (res.status != 200) return this.$message.error(str + res.message)
        this.$message.success(str + res.message)
        this.getAllGoods()
        // this.$router.go(0)
      },
      // 改变商品审核状态
      async changeAuidt(row, product_id, flag) {
        console.log(row);
        if (row.image.goodsBanner.length == 0 || row.image.goodsMain.length == 0) {
          return this.$message.error("商品数据缺失，请检查")
        }
        if (!flag) return
        let {
          data: res
        } = await this.$http.post("/admin/changeAuidtStatus", {
          product_id: product_id
        })
        console.log(res);
        if (res.status != 200) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.getAllGoods()

      },
      // 商品搜索
      search() {
        this.getAllGoods()
      },
      // 分页
      handleSizeChange(val) {
        this.rquery.pageSize = val
      },
      // 分页
      handleCurrentChange(val) {
        this.rquery.pageNum = val
        this.getAllGoods()
      },
      // 自定义索引
      formatindex(index) {
        return (this.rquery.pageNum - 1) * this.rquery.pageSize + index + 1
      },
      // sku展示
      test(sku) {
        let str = ''
        sku.forEach(item => {
          str += item.sku_version + '  ￥' + item.sku_price + '<br>'
        })
        return str
      },
      // 添加对话框的关闭
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.sku_i = 0
            this.skuList = []
            this.imageUrl = ''
            this.$refs['form'].resetFields()
            done();
          })
          .catch(_ => {});
      },
      // 
      handleChange(value) {
        console.log(value);
      },
      // 显示添加商品的对话框
      showAddDialog() {
        this.addSkuInput()
        this.adddialogVisible = true
      },
      // 添加版本填写框
      addSkuInput() {
        // console.log(this.sku_i++);
        let index = this.sku_i++
        let sku_version = 'sku_version' + index
        let sku_price = 'sku_price' + index
        let temp = {}
        temp.sku_id = index
        temp[sku_version] = ''
        temp[sku_price] = ''
        this.skuList.push(temp)
      },
      // 删除版本填写框
      delSkuInput(sku_id) {
        // console.log(sku_id);
        let index = this.skuList.findIndex(item => {
          if (item.sku_id == sku_id) {
            return item
          }
        })
        // console.log(index);
        if (this.skuList.length <= 1) {
          this.$message.error("必须填一个版本")
        } else {
          this.skuList.splice(index, 1)
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.adddialogVisible = false
      },
      // 版本选择的提示消失
      check() {
        this.skuList.forEach((item, index) => {
          if (item['sku_price' + index] != '' && item['sku_version' + index] != '') {
            this.$nextTick(() => {
              this.$refs['form'].clearValidate(['version']);
            })
          }
        })
      },
      // 添加-选择图片
      addPic(file, fileList) {
        // console.log(file);
        const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
        const isLt2M = file.raw.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
          return
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return
        }
        this.file = file
        this.$refs['form'].clearValidate(['img']);
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let fd = new FormData()
            fd.append("home_img", this.file.raw)
            fd.append('goodsInfo', JSON.stringify(this.goodsInfo))
            fd.append('sku', JSON.stringify(this.skuList))
            let {
              data: res
            } = await this.$http.post('/admin/addGoods', fd)

            console.log(res);
            if (res.status != 200) return this.$message.error(res.message)
            this.$message.success(res.message)
            this.getAllGoods()
            this.adddialogVisible = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 添加上传的图片
      bannerchange(file, fileList) {
        fileList.forEach((item) => {
          if (this.addImgs.indexOf(item) == -1) {
            this.addImgs.push(item)
          }
        })
      },
      // 移除选定的图片
      removeImg(file, fileList) {
        let index = this.addImgs.findIndex((item) => {
          if (file.name == item.name) {
            return item
          }
        })
        this.addImgs.splice(index, 1)
      },
      // 上传详情img
      async uploadBanner(goods_id, flag) {
        // console.log(data);
        console.log(goods_id);
        let fd = new FormData()
        if (this.addImgs.length > 0) {
          this.addImgs.forEach(item => {
            fd.append('goodsImg', item.raw)
          })
          fd.append("goods_id", goods_id)
          fd.append("isMain", flag)
          console.log(fd.getAll('goodsImg'));
          let {
            data: res
          } = await this.$http.post('/admin/uploadGoodsBanner', fd)
          console.log(res);
          this.addImgs = []
          if (res.status != 200) return this.$message.error(res.message)
          this.$message.success(res.message)
          setTimeout(() => {
            window.location.reload()
          }, 50)
        }
      },
      // 删除商品详情图片
      async delGoodsImg(pic_id) {
        console.log(pic_id);
        let {
          data: res
        } = await this.$http.post('/admin/delGoodsImg', {
          product_pic_id: pic_id
        })
        console.log(res);
        if (res.status != 200) return this.$message.error(res.message)
        this.$message.success(res.message)
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      },
      // 删除商品
      async delGoods(goods_id) {
        console.log(goods_id);
        let {
          data: res
        } = await this.$http.post('/admin/delGoods', {
          goods_id: goods_id
        })
        console.log(res);
        if (res.status != 200) return this.$message.error(res.message)
        this.$message.success(res.message)
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      },
      // 跳转修改页面
      toMOdify(goods_id) {
        this.$router.push({
          path: '/admin/goodsBasicInfoModify',
          query: {
            goods_id: goods_id
          }
        })
      }
    }
  }

</script>
<style scoped>
  .table_proName {
    display: flex;
    align-items: center;
  }

  .table_img {
    width: 100px;
    height: 100px;
    margin: 5px;
  }

  .table_img img {
    width: 100%;
    height: 100%;
  }

  .upload {
    width: 80px;
    height: 80px;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upload i {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }

  .goods_version .el-input {
    width: 150px;
  }

  .avatar {
    width: 80px;
    height: 80px;
    transform: translateY(7px);
  }

  /* 商品图片展示 */
  .goods_images {
    height: 500px;
    overflow: auto;
    /* background-color: red; */
  }

  .goods_banner_list,
  .goods_main_list {
    display: flex;
    flex-flow: wrap;
  }

  .goods_title {
    margin: 10px 0 0 20px;
  }

  .goods_banner_item,
  .goods_main_item {
    width: 120px;
    height: 120px;
    margin: 20px;
    cursor: pointer;
  }

  .goods_banner_item img,
  .goods_main_item img {
    width: 100%;
    height: 100%;
  }

  .goodsdel {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
