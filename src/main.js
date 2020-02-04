
import Vue from 'vue'
// 全局申明
import VUeResource from "vue-resource"
Vue.use(VUeResource)
import global_ from './API/Global.js'//引用文件
Vue.prototype.GLOBAL = global_//挂载到Vue实例上面

import App from './App.vue'
import axios from 'axios'
import router from './router'
import iView from 'iview'
import store from './store'
import './registerServiceWorker'
import XEUtils from 'xe-utils'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vueBeauty from 'vue-beauty'
import 'vue-beauty/package/style/vue-beauty.min.css'
import './assets/iconfont/index'
import moment from 'moment'



// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import VueParticles from 'vue-particles'  
Vue.use(VueParticles)  

// Vue.config.productionTip = false
Vue.use(vueBeauty)
Vue.use(ElementUI)
Vue.use(XEUtils)
Vue.config.productionTip = false
Vue.use(iView)
// Vue.use(websocket)
// Vue.prototype.$axios = axios
// Vue.filter('format',function(datastr){
//   return moment(datastr).format("YYYY年MM月DD日  hh:mm:ss")
// })
// Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
//   return moment(dataStr).format(pattern)
// })
Vue.filter('dateformat', function (date) {

  let datas = new Date(date)
  datas.setTime(datas.getTime() + 3600 * 1000 * 8)
  let dateee = datas.toJSON();

  return new Date(+new Date(dateee)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
})
Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'watchStorage2D' || key === 'watchStorage3D') {

    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val);

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal);
  }
}



export const loadJson = (url) => {
  return new Promise((resolve, reject) => {
    let xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("Micosoft.XMLHttp");
    xhr.open("GET", url);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(JSON.parse(xhr.response));
      }
    };
  })
}

(async () => {
  let path=process.env.NODE_ENV!=='production'?'../config.json?':'./config.json?'
  let config = await loadJson(path + new Date().getTime());
    store.state.config = config.target
    window.config=config
    if(config.danji){
      require("./assets/css/danji.css");
    }
    
    

  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
})()
