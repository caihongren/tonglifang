import Vue from 'vue'
import Router from 'vue-router'
import home from './views/Home.vue'


//登录注册页面

import login from './views/login.vue'
// import weixinglogin from './views/weixinglogin.vue'
// import download from './views/download.vue'



//404
import NotFound from './views/404.vue'
import Examine from './views/Examine.vue'
import user from './views/user.vue'

//课程学生端********************
// import relay from './paging/relay.vue'
import study from './components/cur__nav/study.vue'
import componentLibrary from './components/cur__nav/componentLibrary.vue'
import resources from './components/cur__nav/resources.vue'






//课程管理
import courseIntroduction from './components/study_operation/courseIntroduction.vue'
import averageScore from './components/study_operation/averageScore.vue'
import experimentDetails from './components/study_operation/experimentDetails.vue'
import myTraining from './components/study_operation/myTraining.vue'
import trainingCourse from './components/study_operation/trainingCourse.vue'
import myHomework from './components/study_operation/myHomework.vue'
import studentTrainingCourse from './components/study_operation/studentTrainingCourse.vue'




// paging 教师端******************

import taskManagement from './relay_paging/taskManagement.vue'
import newExperimentalTemplateLibrary from './relay_paging/newExperimentalTemplateLibrary.vue'
import simulationDatabase from './relay_paging/simulationDatabase.vue'
import freeTest from './relay_paging/freeTest.vue'
import dimension3 from './relay_paging/Dimension3.vue'





//relay task Presentation
import Presentationteacher from './relay_paging/tasks/Presentation.vue'
import DetailedList from './relay_paging/tasks/DetailedList.vue'
import Editor from './relay_paging/tasks/Editor.vue'
import Addtask from './relay_paging/tasks/Addtask.vue'
import { demo } from './API/api'






// admin端******************
// import admin from './paging/admin.vue'
// import addstudent from './components/admin/addstudent.vue'
// import Myclass from './components/admin/Myclass.vue'
// import student from './components/admin/student.vue'
// import teacher from './components/admin/teacher.vue'
// import course from './components/admin/course.vue'

// 
// 
// 
// 
const title = document.title
// const title="虚拟仿真实训软件"
Vue.use(Router)
const router = new Router({

    hash: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/resourceDownload',
        name: 'resourceDownload',
        component: () =>
            import('./views/resourceDownload.vue')

    },
    {
        path: '/download',
        name: 'download',
        component: () =>
            import('./views/download.vue')

    },

    {
        path: '/demo',
        name: 'demo',
        component: () =>
            import('./views/demo.vue')

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
        component: login,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/weixinglogin',
        name: 'weixinglogin',
        meta: {
            title: '微信绑定'
        },
        component: () =>
            import('./views/weixinglogin.vue')
    },


    // 个人中心
    {
        path: '/user',
        name: '/user',
        component: user
    },
    {
        path: '*',
        name: '/404',
        component: NotFound
    },

    // 学生端############################
    {
        path: '/relay',
        name: 'relay',
        component: () =>
            import('./paging/relay.vue'),
        beforeEnter: ((to, from, next) => {
            if (to.path === '/login') {
                next();
            } else {
                let token = localStorage.getItem('token');

                if (token === 'null' || token === '') {
                    next('/login');
                } else {
                    next();
                }
            }
        }),
        children: [{
            path: '/relay',
            redirect: '/relay/study',

        },
        {
            path: '/relay/home',
            name: '/relay/home',
            component: home
        },
        //元件库
        {
            path: '/relay/componentLibrary',
            name: 'componentLibrary',
            component: componentLibrary
        },
      
        //课程学习
        {
            path: '/relay/study',
            name: 'study',
            component: study,
            redirect: '/relay/study/courseIntroduction',
            children: [{
                path: "/relay/study/courseIntroduction",
                name: "courseIntroduction",
                component: courseIntroduction
            },

            // 课程实训
            {
                path: "/relay/study/studentTrainingCourse",
                name: "studentTrainingCourse",
                component: studentTrainingCourse
            },
            // 教考模式
            {
                path: "/relay/study/experimentDetails",
                name: "/relay/study/experimentDetails",
                component: experimentDetails
            },
            // 我的作业
            {
                path: "/relay/study/myHomework",
                name: "myHomework",
                component: myHomework
            },
      
            ]
        },

        //实训资源
        {
            path: '/relay/resources',
            name: 'resources',
            component: resources
        },

        // 详情
        {
            path: '/relay/Examine',
            name: '/relay/Examine',
            component: Examine
        },
        // 三维设计图
        {
            path: '/relay/dimension3',
            name: '/relaydimension3',
            component: dimension3
        },
        // 自由创新实验
        {
            path: '/relay/freeTest',
            name: 'freeTest',
            component: freeTest
        },
        // 三维设计图
        {
            path: '/relay/newdimension3',
            name: 'newdimension3',
            component: () =>
                import('./relay_paging/newDimension3.vue'),
        },
        ]
    },


    //  跳转到教师端##############################

    {
        path: '/relayteacher',
        name: 'relayteacher',
        component: () =>
            import('./paging/relayteacher.vue'),
        children: [{
            path: '/relayteacher/home',
            name: '/relayteacher/home',
            component: home
        },
        // 课程管理

        {
            path: '/relayteacher/study',
            name: 'relayteacher/study',
            component: study,
            children: [{
                path: "/relayteacher/study/courseIntroduction",
                name: "relayteacher/courseIntroduction",
                component: courseIntroduction
            },
            {
                path: "/relayteacher/study/averageScore",
                name: "relayteacher/averageScore",
                component: averageScore
            },
            // 课程实训
            {
                path: "/relayteacher/study/trainingCourse",
                name: "trainingCourse",
                component: trainingCourse
            },
            // 教考模式
            {
                path: "/relayteacher/study/experimentDetails",
                name: "/relayteacher/study/experimentDetails",
                component: experimentDetails
            },
            // 我的实训
            {
                path: "/relayteacher/study/myTraining",
                name: "myTraining",
                component: myTraining
            },
            ]
        },

        //元件库
        {
            path: '/relayteacher/componentLibrary',
            name: 'relayteacher/componentLibrary',
            component: componentLibrary
        },
        //实训资源
        {
            path: '/relayteacher/resources',
            name: 'relayteacher/resources',
            component: resources
        },
        //实训模板库
        {
            path: '/relayteacher/newExperimentalTemplateLibrary',
            name: 'newExperimentalTemplateLibrary',
            component: newExperimentalTemplateLibrary
        },
        //仿真资源库
        {
            path: '/relayteacher/simulationDatabase',
            name: 'simulationDatabase',
            component: simulationDatabase
        },

        // 试题库，题库
        {
            path: '/relayteacher/taskBank',
            name: 'taskBank',
            component: () =>
            import('./relayteacher_pading/taskBank.vue'),
        },
        // 自由创新实验
        {
            path: '/relayteacher/freeTest',
            name: 'freeTest',
            component: freeTest
        },

        // 详情
        {
            path: '/relayteacher/Examine',
            name: '/relayteacher/Examine',
            component: Examine
        },

        // 三维设计图
        {
            path: '/relayteacher/dimension3',
            name: 'dimension3',
            component: dimension3
        },
        // 三维设计图
        {
            path: '/relayteacher/newdimension3',
            name: 'newdimension3',
            component: () =>
                import('./relay_paging/newDimension3.vue'),
        },



        //跳转到任务管里单
        {
            path: '/relayteacher/taskManagement',
            name: 'taskManagement',
            component: taskManagement,
            children: [

            ]
        },

        //跳转到批阅报告页面
        {
            path: '/task/Presentationteacher',
            name: 'Presentationteacher',
            component: Presentationteacher
        },
        // 跳转到已发布任务清单页面
        {
            path: '/task/DetailedList',
            name: 'DetailedList',
            component: DetailedList
        },
        //跳转到任务编辑器
        {
            path: '/task/Editor',
            name: 'Editor',
            component: Editor
        },
        //新建实训
        {
            path: '/task/Addtask',
            name: 'Addtask',
            component: Addtask
        },



        ]
    },

    // admin端##############################
    {
        path: '/admin',
        name: 'admin',
        component: () =>
            import('./paging/admin.vue'),
        children: [

            {
                path: '/admin/addstudent',
                name: 'addstudent',
                component: () =>
                    import('./components/admin/addstudent.vue'),
                children: [
                    // 教师管理
                    {
                        path: '/addstudent/teacher',
                        name: 'teacher',
                        meta: {
                            title: '教师管理'
                        },
                        component: () =>
                            import('./components/admin/teacher.vue')
                    },
                    // 学生管理
                    {
                        path: '/addstudent/student',
                        name: 'student',
                        meta: {
                            title: '学生管理'
                        },
                        component: () =>
                            import('./components/admin/student.vue')
                    },
                    // 班级管理
                    {
                        path: '/addstudent/Myclass',
                        name: 'Myclass',
                        meta: {
                            title: '班级管理'
                        },
                        component: () =>
                            import('./components/admin/Myclass.vue')
                    },
                    // 课程管理
                    {
                        path: '/addstudent/course',
                        name: 'course',
                        meta: {
                            title: '课程管理'
                        },
                        component: () =>
                            import('./components/admin/course.vue')
                    },
                ]
            },
        ]
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