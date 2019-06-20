import Vue from 'vue'
// 全局申明
import VUeResource from "vue-resource"
Vue.use(VUeResource)
import App from './App.vue'
import axios from './API/api'
import router from './router'
import iView from 'iview'
import store from './store'
import './registerServiceWorker'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/index'
import moment from 'moment'
// Vue.filter('format',function(datastr){
//   return moment(datastr).format("YYYY年MM月DD日  hh:mm:ss")
// })
// Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
//   return moment(dataStr).format(pattern)
// })
Vue.filter('dateformat', function(date) {
 
  let datas=new Date(date)
  datas.setTime(datas.getTime() +3600 * 1000 * 8)
  let dateee = datas.toJSON();
 
    return new Date(+new Date(dateee)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
})

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts


// Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(iView)
// Vue.use(websocket)
// Vue.prototype.$axios = axios





new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
