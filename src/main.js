// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/css/global.css'
import axios from 'axios'
import store from './store/index'
import filter from './filter/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import animated from 'animate.css' // npm install animate.css --save安装，在引入

Vue.use(animated)
Object.keys(filter).forEach(key => Vue.filter(key, filter[key]))
Vue.use(ElementUI);
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:3000/'



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
