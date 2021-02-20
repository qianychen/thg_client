import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
// 主页
import home from '@/components/home/home'
import search from '@/components/home/search'
// 登陆
import userLoginWay from '@/components/login/userLoginWay'
import forgetPsd from '@/components/login/forgetPsd'
import loginPsd from '@/components/login/loginmain/loginPsd'
import loginAdmin from '@/components/login/adminlogin/loginAdmin'
// 注册
import register from '@/components/register/register'
// 用户中心
import userCenter from '@/components/user/userCenter'
import userInfo from '@/components/user/userInfo'
import userAddr from '@/components/user/userAddr'
import securityCentre from '@/components/user/securityCentre'
import userWallet from '@/components/user/userWallet'
import userIDcheck from '@/components/user/SCpage/userIDcheck'
import bindEmail from '@/components/user/SCpage/bindEmail'
import modifyPassword from '@/components/user/SCpage/modifyPassword'
import bindPhone from '@/components/user/SCpage/bindPhone'
// 商品详情
import goodsDetail from '@/components/goodsDetail/goodsDetail'
// 购物车
import shopCart from '@/components/shopCart/shopCart'
// 订单
import settlement from '@/components/order/settlement'
import orderPay from '@/components/order/orderPay'
import orderList from '@/components/order/orderList'
import orderDetail from '@/components/order/orderDetail'
import orderComment from '@/components/order/orderComment'
// 分类
import category from '@/components/category/category'
// 帮助中心
import help from '@/components/helpCenter/help'
import questions from '@/components/helpCenter/questions'
import answer from '@/components/helpCenter/answer'
// 后台
import admin from '@/components/admin/admin'
import accountManage from '@/components/admin/accountManage'
import cateManage from '@/components/admin/cateManage'
import goodsManage from '@/components/admin/goodsManage'
import commentManage from '@/components/admin/commentManage'
import goodsBasicInfoModify from '@/components/admin/goodsBasicInfoModify'

import test from '@/components/test'

Vue.use(Router)
//处理多次点击同路由报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

let router = new Router({
  routes: [{
      path: '/',
      redirect: '/index'
    },

    // testHtml
    {
      path: '/test',
      component: test,
    },
    // 主页
    {
      path: '/index',
      component: home,
    },
    // 商品分类
    {
      path: '/category',
      component: category,
    },
    // 帮助中心
    {
      path: '/help',
      component: help,
      children: [{
          path: '/',
          redirect: '/help/questions'

        },
        {
          path: 'questions',
          component: questions
        },
        {
          path: 'answer',
          component: answer
        }
      ]
    },
    // 搜索
    {
      path: '/search',
      component: search
    },
    // 商品详情
    {
      path: '/goodsDetail',
      component: goodsDetail
    },
    // 购物车
    {
      path: '/shopCart',
      component: shopCart
    },
    // 提交订单
    {
      path: '/settlement',
      component: settlement
    },
    // 订单支付
    {
      path: '/orderPay',
      component: orderPay
    },
    // 订单列表
    {
      path: '/orderList',
      name: 'orderList',
      component: orderList
    },
    // 订单详情
    {
      path: '/orderDetail',
      component: orderDetail
    },
    // 订单评论
    {
      path: '/orderComment',
      component: orderComment
    },
    // 登陆
    {
      path: '/login',
      component: userLoginWay,
      children: [{
          path: '/',
          redirect: '/login/loginPsd'
        },
        {
          path: 'loginPsd',
          component: loginPsd
        },
        {
          path: 'loginAdmin',
          component: loginAdmin
        },
        {
          path: 'forgetPsd',
          component: forgetPsd
        }
      ]
    },
    // 注册
    {
      path: '/register',
      component: register
    },
    // 个人中心
    {
      path: '/user',
      component: userCenter,
      children: [{
          path: '/',
          redirect: '/user/info'
        },
        {
          path: 'info',
          component: userInfo
        },
        {
          path: 'addr',
          component: userAddr
        },
        {
          path: 'securityCentre',
          component: securityCentre,
          children: [{
              path: 'userIDcheck',
              component: userIDcheck
            },
            {
              path: 'bindEmail',
              component: bindEmail
            },
            {
              path: 'bindPhone',
              component: bindPhone
            },
            {
              path: 'modifyPassword',
              component: modifyPassword
            },
          ]
        },
        {
          path: 'wallet',
          component: userWallet
        },
        {
          path: 'userIDcheck',
          component: userIDcheck
        },
        {
          path: 'bindEmail',
          component: bindEmail
        },
        {
          path: 'bindPhone',
          component: bindPhone
        },
        {
          path: 'modifyPassword',
          component: modifyPassword
        },
      ]
    },
    // 管理员
    {
      path: '/admin',
      component: admin,
      children: [{
          path: '/',
          redirect: '/admin/account'
        },
        {
          path: 'account',
          component: accountManage
        },
        {
          path: 'cate',
          component: cateManage
        },
        {
          path: 'goods',
          component: goodsManage
        },
        {
          path: 'comment',
          component: commentManage
        },
        {
          path: 'goodsBasicInfoModify',
          component: goodsBasicInfoModify
        },
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path.includes('/login') || to.path === '/register' || to.path === '/index' || to.path === '/category' || to.path.includes('/help') || to.path.includes('/search')) {
    return next()
  }

  // 获取token
  // const tokenValue = window.sessionStorage.getItem('token')
  const tokenValue = store.state.token
  // console.log(tokenValue);
  if (tokenValue) {
    next()
  } else {
    alert("请先登录")
    return next('/login')
  }
})


export default router
