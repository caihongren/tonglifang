import Vue from 'vue'
import App from './App.vue'
import axios from './API/api'
import router from './router'
import store from './store'
import './registerServiceWorker'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
// Vue.filter('format',function(datastr){
//   return moment(datastr).format("YYYY年MM月DD日  hh:mm:ss")
// })
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})







// Vue.config.productionTip = false
Vue.use(ElementUI)
// Vue.use(websocket)
// Vue.prototype.$axios = axios






new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
