<template>
  <div>
    <div class="title">
      修改商品基本信息
    </div>
    <div class="goods_form">
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
            <el-input v-model="item['sku_version' + item.sku_id]" placeholder="请输入版本信息"></el-input>
            <el-input v-model.trim="item['sku_price' + item.sku_id]" type="number" min="0" placeholder="请输入价格">
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
      <div class="sunmit_btn">
        <el-button type="primary" @click.native="submitModify">修改</el-button>
        <el-button type="info">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        goods_id: this.$route.query.goods_id,
        goods: {},
        goodsInfo: {
          goods_id: this.$route.query.goods_id,
          product_name: '',
          catechosed: [],
          supplier: '',
          descript: ''
        },
        cateList: [],
        suppList: [],
        imageUrl: '',
        file: {},
        skuList: [],
        sku_i: 0,
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
        },
        cateoptions: {
          value: 'category_id',
          label: 'category_name',
          children: 'children'
        },
      }
    },
    created() {
      //   console.log(this.goods_id);
      this.getGoodsById()
      this.getCate()
      this.getSupplier()
    },
    methods: {
      // 通过商品id获取商品信息
      async getGoodsById() {
        let {
          data: res
        } = await this.$http.post("/goods/getGoodsDetailById", {
          goods_id: this.goods_id
        })
        console.log(res);
        this.goods = res.result[0]
        this.goodsInfo.product_name = res.result[0].product_name
        this.goodsInfo.supplier = res.result[0].supplier.supplier_id
        this.goodsInfo.descript = res.result[0].descript
        this.goodsInfo.catechosed = [
          res.result[0].one_category_id,
          res.result[0].two_category_id,
          res.result[0].three_category_id,
        ]
        this.imageUrl = res.result[0].main_img
        res.result[0].sku.forEach((item, index) => {
          //   console.log(item);
          this.addSkuInput()
          //   console.log(this.skuList);
          this.skuList[(this.sku_i - 1)]['sku_version' + (this.sku_i - 1)] = item.sku_version
          this.skuList[(this.sku_i - 1)]['sku_price' + (this.sku_i - 1)] = item.sku_price
        })
      },
      // 获取分类
      async getCate() {
        let {
          data: result
        } = await this.$http.get("/goods/getCategory")
        // console.log(result);
        this.cateList = result.result
      },
      // 获取所有店铺
      async getSupplier() {
        let {
          data: result
        } = await this.$http.post("/admin/getAllsupplier")
        // console.log(result);
        this.suppList = result.result
      },
      handleChange(value) {
        console.log(value);
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
        this.imageUrl = URL.createObjectURL(file.raw);
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
      //   提交修改
      async submitModify() {

        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            let fd = new FormData()
            fd.append("uphome_img", this.file.raw)
            console.log(fd.get('uphome_img'));
            if (fd.get('uphome_img') == 'undefined') {
              fd.append("home_img", this.goods.main_img)
              //    console.log(this.goods.main_img);
            }
            fd.append('goodsInfo', JSON.stringify(this.goodsInfo))
            fd.append('sku', JSON.stringify(this.skuList))
            console.log(fd.get('home_img'));
            // console.log(fd.get('goodsInfo'));
            // console.log(fd.get('sku'));
            let {
              data: res
            } = await this.$http.post('/admin/submitModify', fd)

            console.log(res);
            if (res.status != 200) return this.$message.error(res.message)
            this.$message.success(res.message)
            setTimeout(()=>{
                this.$router.push("/admin/goods")
            }, 1000)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>
<style scoped>
  .title {
    font-weight: bold;
    font-size: 18px;
    margin-left: 20px;
  }

  .goods_form {
    width: 600px;
    margin: 20px;
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

</style>
