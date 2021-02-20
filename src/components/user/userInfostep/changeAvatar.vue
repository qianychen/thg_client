<template>
  <div class="ava_manger">
    <div class="ava_title">头像上传</div>
    <div class="ava_upload">
      <el-upload class="avatar-uploader" action="#" :http-request="httpRequest" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div>点击上方图片上传头像</div>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        imageUrl: ''
      };
    },
    created() {
      this.imageUrl = this.userInfo.avatar
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      handleAvatarSuccess(res, file) {
        // console.log(file);
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        // console.log(file);
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 自定义上传文件
      async httpRequest(data) {
        // let url = 'http://127.0.0.1:3000/user/modifyUserAvatar'
        let fd = new FormData()
        fd.append('userAvatar', data.file)
        fd.append('id', this.userInfo.customer_id)
        let {
          data: res
        } = await this.$http.post("/user/modifyUserAvatar", fd)
        console.log(res);
        if (res.status != 200) return this.$message.error("上传头像失败")
        this.$message.success("上传头像成功")
        await this.$store.dispatch("getUserInfoById", {
          id: this.userInfo.customer_id
        })
        setTimeout(() => {
          this.$router.go(0)
        }, 100)
      }
    }
  }

</script>
<style scoped>
  .ava_manger {
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .ava_title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
  }

  .ava_upload {
    border-radius: 30px;
    margin-bottom: 20px;
  }

  .avatar-uploader .el-upload {
    border: 1px solid black;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    border-radius: 50%;
    border: 3px solid orange;
  }

</style>
