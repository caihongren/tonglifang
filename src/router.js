import Vue from 'vue'
import Router from 'vue-router'
import home from './views/Home.vue'
import relay from './components/curriculum/relay.vue'
//登录注册页面
import register from './views/Register.vue'
import login from './views/login.vue'
//404
import NotFound from './views/404.vue'

//继保课程--------nav
import simulation from './components/cur__nav/simulation.vue'
import study from './components/cur__nav/study.vue'
import my__note from './components/cur__nav/my__note.vue'
import my__data from './components/cur__nav/my__data.vue'
import my__Submission from './components/cur__nav/my__Submission.vue'
//仿真实验操作 
import guidance from './components/simulation__operation/guidance.vue'
import Presentation from './components/simulation__operation/Presentation.vue'
import Enclosure from './components/simulation__operation/Enclosure.vue'
import snapshot from './components/simulation__operation/snapshot.vue'
import exportData from './components/simulation__operation/exportData.vue'
import unity from './components/simulation__operation/unity.vue'

// 
//  //暂时的效果
import sExperiment1 from './components/simulation__operation/guidance_path/sExperiment1.vue'
// import sExperiment2 from './components/simulation__operation/guidance_path/sExperiment2.vue'
// import sExperiment3 from './components/simulation__operation/guidance_path/sExperiment3.vue'
// simcontent
// import simcontent from './components/simulation__operation/guidance_path/simcontent.vue'


// 
// 
// 
// 
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/login'
    },

    {
      path: '/home',
      name: 'home',
      component: home
    },
    //登录注册
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '*',
      name: '/404',
      component: NotFound
    },
    {
      path: '/relay',
      name: 'relay',
      component: relay,
      children: [{
          path: '/relay',
          redirect: '/relay/simulation'
        },
        //仿真实验
        {
          path: '/relay/simulation',
          name: 'simulation',
          component: simulation,
          children: [
            //仿真实验操作
            // {
            //   path: '/simulation/guidance',
            //   name: 'guidance',
            //   component: guidance,
            //   children:[
              {path: '/simulation/simulation', redirect: '/guidance/sExperiment1/:id'},
              {path:'/guidance/sExperiment1/:id',name:'sExperiment1',component:sExperiment1,
            children:[
              {path:"/sExperiment1/guidance/:id",name:"guidance",component:guidance},    //实验指导
              {path:"/sExperiment1/Presentation/:id",name:"Presentation",component:Presentation},   //实验报告
              {path:"/sExperiment1/Enclosure/:id",name:"Enclosure",component:Enclosure},    //附件材料
              {path:"/sExperiment1/snapshot/:id",name:"snapshot",component:snapshot},    //实验快照
              {path:"/sExperiment1/exportData/:id",name:"exportData",component:exportData},    //导出数据
              {path:"/sExperiment1/unity/:id",name:"unity",component:unity}
            ]},
              // {path:'/guidance/sExperiment2',name:'sExperiment2',component:sExperiment2},
              // {path:'/guidance/sExperiment3',name:'sExperiment3',component:sExperiment3}
            //   ]
            // },
            // {
            //   path: '/simulation/Presentation',
            //   name: 'Presentation',
            //   component: Presentation
            // },
            // {
            //   path: '/simulation/Enclosure',
            //   name: 'Enclosure',
            //   component: Enclosure
            // },
            // {
            //   path: '/simulation/snapshot',
            //   name: 'snapshot',
            //   component: snapshot
            // },
            // {
            //   path: '/simulation/exportData',
            //   name: 'export',
            //   component: exportData
            // },
            // {
            //   path: '/simulation/unity',
            //   name: 'unity',
            //   component: unity
            // }
          ]
        },
        {
          path: '/relay/study',
          name: 'study',
          component: study
        },
        {
          path: '/relay/my__note',
          name: 'my__note',
          component: my__note
        },
        {
          path: '/relay/my__data',
          name: 'my__data',
          component: my__data
        },
        {
          path: '/relay/my__Submission',
          name: 'my__Submission',
          component: my__Submission
        }
      ]
    }
  ]
})






// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next();
//   } else {
//     let token = localStorage.getItem('Authorization');
 
//     if (token === 'null' || token === '') {
//       next('/login');
//     } else {
//       next();
//     }
//   }
// })

