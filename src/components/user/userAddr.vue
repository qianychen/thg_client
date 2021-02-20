<template>
  <div class="addr_con">
    <!-- 添加地址按钮 -->
    <div class="addr_add_btn">
      <el-button round type="primary" @click="addDialogVisible = true">新增收货地址</el-button>
      <span>您已创建 {{address.length}} 个收货地址，最多可创建 {{20-address.length}} 个</span>
    </div>
    <!-- 地址主体 -->
    <div class="addr_main" v-for="(item, index) in address" :key="item.customer_addr_id">
      <!-- 排序 -->
      <div class="addr_sort">
        <span>{{item.consignee}}&nbsp;{{item.province}}</span>
        <span class="def_icon" v-if="item.is_default == 1">
          默认地址
        </span>
      </div>
      <div class="addr_name">
        <label>收货人：</label>{{item.consignee}}
      </div>
      <div class="addr_phone">
        <label>手机：</label>{{item.mobile_phone}}
      </div>
      <div class="addr_city">
        <label>所在城市：</label>{{item.province}}{{item.city}}{{item.district}}
      </div>
      <div class="addr_addr">
        <label>地址：</label>{{item.address}}
      </div>
      <!-- 关闭按钮 -->
      <div class="del_addr">
        <el-popconfirm confirmButtonText='确定' cancelButtonText='取消' icon="el-icon-info" iconColor="red"
          title="您确定要删除该收货地址吗？" @onConfirm="delAddr(item.customer_addr_id)">
          <div slot="reference">×</div>
        </el-popconfirm>
      </div>
      <!-- 修改按钮 -->
      <div class="edit_btn">
        <span @click="onEditBtn(item.customer_addr_id)">编辑</span>
      </div>
      <!-- 设为默认地址按钮 -->
      <div class="setDef_btn">
        <span v-if="!item.is_default" @click="onSetDefBtn(item.customer_addr_id)">设为默认</span>
      </div>
    </div>
    <!-- 没有地址的时候show -->
    <div v-if="showAddr" class="addr_null">
      <div>未设置收货地址</div>
    </div>
    <!-- 添加地址对话框 -->
    <el-dialog title="添加收货地址" :visible="addDialogVisible" width="30%" @close="addDialogVisible = false">
      <!-- 添加表单 -->
      <el-form :model="addFrom" :rules="addrule" ref="ruleForm" hide-required-asterisk label-width="100px">
        <el-form-item label="收货人：" prop="consignee">
          <el-input v-model="addFrom.consignee" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile_phone">
          <el-input v-model="addFrom.mobile_phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="所在地区：" prop="addSelectedOptions">
          <el-cascader :options="options" v-model="addSelectedOptions" @change="addhandleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input v-model="addFrom.address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮确定 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="addAddr('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改收货地址" :visible="editDialogVisible" width="30%" @close="editDialogVisible = false">
      <!-- 修改表单 -->
      <el-form :model="editFrom" :rules="editrule" hide-required-asterisk ref="editruleForm" label-width="100px">
        <el-form-item label="收货人：" prop="consignee">
          <el-input v-model="editFrom.consignee" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile_phone">
          <el-input v-model="editFrom.mobile_phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="所在地区：" prop="editSelectedOptions">
          <el-cascader :options="options" v-model="editSelectedOptions" @change="edithandleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input v-model="editFrom.address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮确定 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editresetForm('editruleForm')">取 消</el-button>
        <el-button type="primary" @click="editAddr('editruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    regionData,
    CodeToText
  } from 'element-china-area-data'
  export default {
    data() {
      // 校验手机号
      var addcheckphone = async (rule, value, callback) => {
        if (value == '') {
          callback(new Error("请输入手机号"))
        } else {
          // 校验手机号是否正确
          let reg_phone = /^[1][3,4,5,7,8][0-9]{9}$/
          if (reg_phone.test(this.addFrom.mobile_phone)) {
            callback()
          } else {
            callback(new Error("请输入正确的手机号"))
          }
        }
      };
      // 校验手机号
      var editcheckphone = async (rule, value, callback) => {
        if (value == '') {
          callback(new Error("请输入手机号"))
        } else {
          // 校验手机号是否正确
          let reg_phone = /^[1][3,4,5,7,8][0-9]{9}$/
          if (reg_phone.test(this.editFrom.mobile_phone)) {
            callback()
          } else {
            callback(new Error("请输入正确的手机号"))
          }
        }
      };
      return {
        address: [],
        showAddr: false,
        // 地区选择的数据
        options: regionData,
        // 添加地址对话框数据
        addDialogVisible: false,
        addFrom: {
          consignee: '',
          mobile_phone: '',
          province: '',
          city: '',
          district: '',
          address: '',
          selectedAddr: ''
        },
        // 地区选择
        addSelectedOptions: [],
        addrule: {
          consignee: [{
            required: true,
            message: '请您填写收货人姓名',
            trigger: 'blur'
          }],
          mobile_phone: [{
            validator: addcheckphone,
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请您填写收货人详细地址',
            trigger: 'blur'
          }],
        },
        // 修改地址对话框数据
        editDialogVisible: false,
        editFrom: {
          consignee: '',
          mobile_phone: '',
          province: '',
          city: '',
          district: '',
          address: '',
          addr_code: ''
        },
        editrule: {
          consignee: [{
            required: true,
            message: '请您填写收货人姓名',
            trigger: 'blur'
          }],
          mobile_phone: [{
            validator: editcheckphone,
            trigger: 'blur'
          }],
          addSelectedOptions: [{
            required: true,
            message: '-',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请您填写收货人详细地址',
            trigger: 'blur'
          }],
        },
        editSelectedOptions: []
      }
    },
    async created() {
      await this.getUserAddrById()
    },
    methods: {
      // 设置默认地址
      async onSetDefBtn(id) {
        let {
          data: setDefAddr_res
        } = await this.$http.post('/user/setDefAddr', {
          addrId: id,
          userId: this.$store.state.userInfo.customer_id
        })
        if (setDefAddr_res.status == 200) {
          this.getUserAddrById()
        }
        console.log(setDefAddr_res);
      },
      // 修改表单的地址选择
      edithandleChange(value) {
        //我们选择地址后，addSelectedOptions 会保存对应的区域码，例如北京的区域码为'110000'
        //我们要取出区域码对应的汉字，就需要用CodeToText(区域码)进行输出
        this.editSelectedOptions = value
        this.editFrom.province = CodeToText[this.editSelectedOptions[0]]
        this.editFrom.city = CodeToText[this.editSelectedOptions[1]]
        this.editFrom.district = CodeToText[this.editSelectedOptions[2]]
        this.editFrom.addr_code = JSON.stringify(this.editSelectedOptions)
      },
      // 修改地址前的查询
      async onEditBtn(id) {
        // console.log(id);
        let editAddrSel_res = await this.$store.dispatch("getUserAddrByAddrId", {
          addrId: id
        })
        if (editAddrSel_res.status == 200) {
          this.editFrom = editAddrSel_res.addr
          this.editSelectedOptions = JSON.parse(editAddrSel_res.addr.addr_code)
        } else {
          this.$message.error("获取地址失败")
        }
        // console.log(editAddrSel_res);
        this.editDialogVisible = true
      },
      // 修改地址
      editAddr(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let editAddr_res = await this.$store.dispatch("modifyUserAddr", {
              editForm: this.editFrom
            })
            // console.log(editAddr_res);
            if (editAddr_res.status == 200) {
              await this.getUserAddrById()
              this.$message.success("修改地址成功")

            } else {
              this.$message.error("修改地址失败")
            }
            this.resetForm('editruleForm')
            this.editDialogVisible = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 修改重置添加表单
      editresetForm(formName) {
        this.$refs[formName].resetFields();
        this.editDialogVisible = false
      },
      // 添加表单的地址选择
      addhandleChange(value) {
        //我们选择地址后，addSelectedOptions 会保存对应的区域码，例如北京的区域码为'110000'
        //我们要取出区域码对应的汉字，就需要用CodeToText(区域码)进行输出
        this.addSelectedOptions = value
        this.addFrom.province = CodeToText[this.addSelectedOptions[0]]
        this.addFrom.city = CodeToText[this.addSelectedOptions[1]]
        this.addFrom.district = CodeToText[this.addSelectedOptions[2]]
        this.addFrom.selectedAddr = JSON.stringify(this.addSelectedOptions)
      },
      // 添加地址
      addAddr(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let add_res = await this.$store.dispatch("addUserAddr", {
              address: this.addFrom,
              userId: this.$store.state.userInfo.customer_id
            })
            if (add_res.status == 200) {
              await this.getUserAddrById()
              this.$message.success(add_res.message)
            } else if (add_res.status == 401) {
              this.$message.error(add_res.message)
            }
            // console.log(add_res);
            this.resetForm('ruleForm')
            this.addDialogVisible = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置添加表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.addDialogVisible = false
      },
      // 获取地址信息
      async getUserAddrById() {
        let addr_res = await this.$store.dispatch("getUserAddrById", {
          id: this.$store.state.userInfo.customer_id
        })
        // console.log(addr_res);
        if (addr_res.status == 200) {
          this.address = addr_res.address
          // 排序 将默认地址排到第一位
          this.address.forEach((item, index) => {
            if (item.is_default == 1) {
              let addr = this.address.splice(index, 1)
              return this.address.unshift(addr[0])
            }
          })
        }
        if (addr_res.status == 400) {
          this.showAddr = true
          this.address = addr_res.address
        }
      },
      // 删除地址
      async delAddr(addrId) {
        let delAddr_res = await this.$store.dispatch("delUserAddrById", {
          addrId: addrId
        })
        // console.log(delAddr_res);
        if (delAddr_res.status == 200) {
          // console.log('success');
          await this.getUserAddrById()
          this.$message.success("删除成功")
        }
        if (delAddr_res.status == 400) {
          this.$message.error("删除失败")
        }
      },

    },
  }

</script>
<style scoped>
  .addr_con {
    height: 100%;
    padding: 15px;
    display: flex;
    flex-flow: column;
  }

  .addr_main {
    height: 150px;
    border: 1px solid #E6E6E6;
    margin-top: 20px;
    padding-left: 20px;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    position: relative;
  }

  .addr_add_btn span {
    font-size: 13px;
    margin-left: 30px;
    color: rgb(105, 104, 104);

  }

  .addr_main label {
    display: inline-block;
    width: 90px;
    text-align: end;
  }

  .del_addr {
    font-size: 15px;
    cursor: pointer;
    color: #CCCCCC;
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .addr_null {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .edit_btn {
    font-size: 14px;
    color: rgb(70, 66, 252);
    position: absolute;
    right: 20px;
    bottom: 10px;
    cursor: pointer;
  }

  .edit_btn:hover {
    color: red;
  }

  .addr_sort {
    font-weight: bold;
  }

  .setDef_btn {
    font-size: 14px;
    color: rgb(70, 66, 252);
    position: absolute;
    right: 60px;
    bottom: 10px;
    cursor: pointer;
  }

  .def_icon {
    width: 50px;
    font-weight: normal;
    font-size: 12px;
    background-color: #FFAA45;
    padding: 3px;
    color: white;

  }

</style>
