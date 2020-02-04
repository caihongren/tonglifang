import Vue from 'vue'
import Router from 'vue-router'


//404
import NotFound from './views/404.vue'

import {
  demo
} from './API/api'

import global_ from '@/API/Global.js' //引用单机配置文件
// 
// 
// 
// 
var url = '/menhu'
// var url = '/gateway'
if (global_.standAlone) {
  // url = '/relay/home'
  url = '/gateway'
}

const title = document.title
// const title="虚拟仿真实训软件"
Vue.use(Router)

const router = new Router({

  hash: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    redirect: url
  },
  {
    path: '/menhu',
    name: 'menhu',
    component: () =>
      import('./views/menhu.vue')

  },








  {
    path: '*',
    name: '/404',
    component: NotFound
  },








  ]

})





router.beforeEach((to, from, next) => {
  if (to.meta.title == undefined || to.meta.title == null || to.meta.title == "") {
    document.title = title
  } else {
    document.title = to.meta.title
  }
  next()
})


// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆

//全局路由配置
// //路由开始之前的操作
// router.beforeEach((to, from, next) => {
//     NProgress.done().start()
//     let toName = to.name
//     // let fromName = from.name
//     let is_login = store.state.user_info.login

//     if (!is_login && toName !== 'login') {
//       next({
//         name: 'login'
//       })
//     } else {
//       if (is_login && toName === 'login') {
//         next({
//           path: '/'
//         })
//       } else {
//         next()
//       }
//     }
//   })

//   //路由完成之后的操作
//   router.afterEach(route => {
//     NProgress.done()
//   })


export default router
