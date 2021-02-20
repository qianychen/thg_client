<template>
  <div class="sc">
    <div v-if="$route.path == '/user/securityCentre'">
      <!-- 基础信息 -->
      <div class="base_info">
        <div class="head">您的基础信息</div>
        <div class="info">
          <div>
            <label for="">会员名：</label>
            <span>{{userInfo.nick_name}}</span>
          </div>
          <div>
            <label for="">登录邮箱：</label>
            <span v-if="userInfo.customer_email != null">{{userInfo.customer_email}}</span>
            <span v-else>未绑定邮箱</span>
          </div>
          <div>
            <label for="">绑定手机：</label>
            <span>{{userInfo.mobile_phone | formatPhone}}</span>
          </div>
        </div>
      </div>
      <!-- 安全服务 -->
      <div class="safe">
        <div class="head">您的安全服务</div>
        <div>
          <ul class="safe_ul">
            <li>
              <div class="state">
                <div class="ready" v-if="userInfo.id_card_no != null">已完成</div>
                <div class="noready" v-else>未设置</div>
              </div>
              <div class="title">
                身份认证
              </div>
              <div class="desc">
                <div>
                  用于提升账号的安全性和信任级别。认证后的有卖家记录的账号不能修改认证信息。
                </div>
              </div>
              <div class="opt">
                <el-link v-if="userInfo.id_card_no == null" @click.native="switchPage('/user/userIDcheck')">设置</el-link>
                <el-link v-else @click.native="switchPage('/user/securityCentre/userIDcheck')">查看</el-link>
              </div>
            </li>
            <li>
              <div class="state">
                <div class="ready" v-if="userInfo.customer_email != null">已完成</div>
                <div class="noready" v-else>未设置</div>
              </div>
              <div class="title">
                绑定邮箱
              </div>
              <div class="desc">
                <div>
                  绑定邮箱后，您即可享受丰富的邮箱服务，如邮箱找回密码等。
                </div>
              </div>
              <div class="opt">
                <el-link v-if="userInfo.customer_email == null" @click.native="switchPage('/user/bindEmail')">设置
                </el-link>
                <el-link v-else @click.native="switchPage('/user/securityCentre/bindEmail')">修改</el-link>
              </div>
            </li>
            <li>
              <div class="state">
                <div class="ready">已完成</div>
                <!-- <div class="noready">未设置</div> -->
              </div>
              <div class="title">
                登录密码
              </div>
              <div class="desc">
                <div>
                  安全性高的密码可以使账号更安全。
                  建议您定期更换密码，且设置一个包含数字和字母，并长度超过6位以上的密码。
                </div>
              </div>
              <div class="opt">
                <el-link @click.native="switchPage('/user/securityCentre/modifyPassword')">修改</el-link>
              </div>
            </li>
            <li>
              <div class="state">
                <div class="ready">已完成</div>
                <!-- <div class="noready">未设置</div> -->
              </div>
              <div class="title">
                绑定手机
              </div>
              <div class="desc">
                <div>
                  绑定手机后，您即可享受丰富的手机服务，如手机找回密码等。
                </div>
              </div>
              <div class="opt">
                <el-link @click.native="switchPage('/user/securityCentre/bindPhone')">修改</el-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 三级页面 -->
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      return {

      }
    },
    methods: {
      switchPage(path) {
        this.$router.push(path)
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
  }

</script>
<style scoped>
  .sc {
    padding: 30px;
  }

  .base_info {
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }

  .head {
    font-weight: bold;
  }

  .info {
    padding: 10px 0 0 20px;
    display: flex;
    flex-flow: column;
  }

  .info label {
    display: inline-block;
    width: 100px;
    height: 25px;
  }

  .info span {
    display: inline-block;
    width: 150px;
  }

  /* 安全服务 */

  .safe_ul li {
    height: 60px;
    display: flex;
    margin-top: 20px;
  }

  .state {
    flex: 1;
    font-size: 14px;
  }

  .state>div {
    height: 30px;

    background: url('../../assets/images/msg_bg.png') no-repeat;
  }

  .state .ready {
    padding-top: 20px;
    background-position: 15px -250px;
  }

  .state .noready {
    padding-top: 20px;
    background-position: 15px -200px;
  }

  .title {
    flex: 1;
    font-size: 12px;
  }

  .desc {
    flex: 3.5;
    font-size: 10px;
  }

  .opt {
    flex: 1.5;
    padding-left: 10px;
  }

</style>
