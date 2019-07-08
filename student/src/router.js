import Vue from 'vue'
import Router from 'vue-router'
import home from './views/Home.vue'
import relay from './paging/relay.vue'
//登录注册页面
import register from './views/Register.vue'
import login from './views/login.vue'
//404
import NotFound from './views/404.vue'
import Examine from './views/Examine.vue'



//课程学生端********************
import simulation from './components/cur__nav/simulation.vue'
import study from './components/cur__nav/study.vue'
import my__note from './components/cur__nav/my__note.vue'
import my__notedemo from './components/cur__nav/my__notedemo.vue'
import my__data from './components/cur__nav/my__data.vue'
import my__Submission from './components/cur__nav/my__Submission.vue'
import componentLibrary from './components/cur__nav/componentLibrary.vue'



//仿真实验操作 
import guidance from './components/simulation__operation/guidance.vue'
import Presentation from './components/simulation__operation/Presentation.vue'
import Enclosure from './components/simulation__operation/Enclosure.vue'
import snapshot from './components/simulation__operation/snapshot.vue'
import exportData from './components/simulation__operation/exportData.vue'
import unity from './components/simulation__operation/unity.vue'


import sExperiment1 from './components/simulation__operation/guidance_path/sExperiment1.vue'
//课程学习
import courseIntroduction from './components/study_operation/courseIntroduction.vue'
import curriculumLearning from './components/study_operation/curriculumLearning.vue'



// paging 老师端******************
import relayteacher from './paging/relayteacher.vue'
//relay paging
import taskManagement from './relay_paging/taskManagement.vue'
import experimentalTemplateLibrary from './relay_paging/experimentalTemplateLibrary.vue'
import myTest from './components/cur__nav/myTest.vue'
import newExperimentalTemplateLibrary from './relay_paging/newExperimentalTemplateLibrary.vue'
import simulationDatabase from './relay_paging/simulationDatabase.vue'
import dimension2 from './relay_paging/Dimension2.vue'
import dimension3 from './relay_paging/Dimension3.vue'




//relay task Presentation
import Presentationteacher from './relay_paging/tasks/Presentation.vue'
import DetailedList from './relay_paging/tasks/DetailedList.vue'
import Editor from './relay_paging/tasks/Editor.vue'
import Addtask from './relay_paging/tasks/Addtask.vue'






// admin端******************
import admin from './paging/admin.vue'
import addstudent from './components/admin/addstudent.vue'
import Myclass from './components/admin/Myclass.vue'
import student from './components/admin/student.vue'
import teacher from './components/admin/teacher.vue'
import course from './components/admin/course.vue'

// 
// 
// 
// 
Vue.use(Router)

export default new Router({
    hash: 'history',
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

        // 学生端############################
        {
            path: '/relay',
            name: 'relay',
            component: relay,
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
                        {
                            path: '/simulation/simulation',
                            redirect: '/guidance/sExperiment1/:id'
                        },
                        {
                            path: '/guidance/sExperiment1/:id',
                            name: 'sExperiment1',
                            component: sExperiment1,
                            children: [{
                                    path: "/sExperiment1/guidance/:id",
                                    name: "guidance",
                                    component: guidance
                                }, //实验指导
                                {
                                    path: "/sExperiment1/Presentation/:id",
                                    name: "Presentation",
                                    component: Presentation
                                }, //实验报告
                                {
                                    path: "/sExperiment1/Enclosure/:id",
                                    name: "Enclosure",
                                    component: Enclosure
                                }, //附件材料
                                {
                                    path: "/sExperiment1/snapshot/:id",
                                    name: "snapshot",
                                    component: snapshot
                                }, //实验快照
                                {
                                    path: "/sExperiment1/exportData/:id",
                                    name: "exportData",
                                    component: exportData
                                }, //导出数据
                                {
                                    path: "/sExperiment1/unity/:id",
                                    name: "unity",
                                    component: unity
                                }
                            ]
                        },

                    ]
                },
                {
                    path: '/relay/myTest',
                    name: '/relay/myTest',
                    component: myTest
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
                        {
                            path: "/relay/study/curriculumLearning",
                            name: "curriculumLearning",
                            component: curriculumLearning
                        }
                    ]
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
                },
                // 我的笔记demo
                {
                    path: '/relay/my__notedemo',
                    name: 'my__notedemo',
                    component: my__notedemo
                },
                // 详情
                {
                    path: '/relay/Examine',
                    name: '/relay/Examine',
                    component: Examine
                },
                // 二维设计图
                {
                    path: '/relay/dimension2',
                    name: '/relaydimension2',
                    component: dimension2
                },
                // 三维设计图
                {
                    path: '/relay/dimension3',
                    name: '/relaydimension3',
                    component: dimension3
                },
            ]
        },


        //  跳转到老师端##############################
        {
            path: '/relayteacher',
            name: 'relayteacher',
            component: relayteacher,
            children: [

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
                            path: "/relayteacher/study/curriculumLearning",
                            name: "relayteacher/curriculumLearning",
                            component: curriculumLearning
                        }
                    ]
                },
                //元件库
                {
                    path: '/relayteacher/componentLibrary',
                    name: 'relayteacher/componentLibrary',
                    component: componentLibrary
                },
              
                //实验模板件库
                {
                    path: '/relayteacher/experimentalTemplateLibrary',
                    name: 'experimentalTemplateLibrary',
                    component: experimentalTemplateLibrary
                },
                //新开实验模板库
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
                // 详情
                {
                    path: '/relayteacher/Examine',
                    name: '/relayteacher/Examine',
                    component: Examine
                },
                // 二维设计图
                {
                    path: '/relayteacher/dimension2',
                    name: 'dimension2',
                    component: dimension2
                },
                // 三维设计图
                {
                    path: '/relayteacher/dimension3',
                    name: 'dimension3',
                    component: dimension3
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
                //新建实验
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
            component: admin,
            children: [

                {
                    path: '/admin/addstudent',
                    name: 'addstudent',
                    component: addstudent,
                    children: [
                        // 教师管理
                        {
                            path: '/addstudent/teacher',
                            name: 'teacher',
                            component: teacher
                        },
                        // 学生管理
                        {
                            path: '/addstudent/student',
                            name: 'student',
                            component: student
                        },
                        // 班级管理
                        {
                            path: '/addstudent/Myclass',
                            name: 'Myclass',
                            component: Myclass
                        },
                        // 课程管理
                        {
                            path: '/addstudent/course',
                            name: 'course',
                            component: course
                        },
                    ]
                },
            ]
        },

    ]
})






// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆

// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next();
//   } else {
//     let token = localStorage.getItem('token');

//     if (token === 'null' || token === '') {
//       next('/login');
//     } else {
//       next();
//     }
//   }
// })