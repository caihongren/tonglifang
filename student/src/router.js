import Vue from 'vue'
import Router from 'vue-router'
import home from './views/Home.vue'
import relay from './components/curriculum/relay.vue'
//登录注册页面
import register from './views/Register.vue'
import login from './views/login.vue'
//404
import NotFound from './views/404.vue'
import Examine from './views/Examine.vue'

//课程学习
import courseIntroduction from './components/study_operation/courseIntroduction.vue'
import curriculumLearning from './components/study_operation/curriculumLearning.vue'


//继保课程--------nav
import simulation from './components/cur__nav/simulation.vue'
import study from './components/cur__nav/study.vue'
import my__note from './components/cur__nav/my__note.vue'
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

// 
//  //暂时的效果
import sExperiment1 from './components/simulation__operation/guidance_path/sExperiment1.vue'
// import sExperiment2 from './components/simulation__operation/guidance_path/sExperiment2.vue'
// import sExperiment3 from './components/simulation__operation/guidance_path/sExperiment3.vue'
// simcontent
// import simcontent from './components/simulation__operation/guidance_path/simcontent.vue'


// paging
import relayteacher from './paging/relayteacher.vue'
import course1 from './paging/admin.vue'
import course2 from './paging/course2.vue'

//relay paging

import Survey from './relay_paging/Survey.vue'
import Resources from './relay_paging/Resources.vue'
import task from './relay_paging/task.vue'
import taskManagement from './relay_paging/taskManagement.vue'


import experimentalTemplateLibrary from './relay_paging/experimentalTemplateLibrary.vue'
//relay task Presentation
import Presentationteacher from './relay_paging/tasks/Presentation.vue'
import DetailedList from './relay_paging/tasks/DetailedList.vue'
import Editor from './relay_paging/tasks/Editor.vue'
import Addtask from './relay_paging/tasks/Addtask.vue'



///relay/Resources/files
import file from './Resources/file.vue'
// import topic from './Resources/Files/topic.vue'
// import video from './Resources/Files/video.vue'
//relay/resources/element
// import source from './Resources/element/source.vue'
// import Switch from './Resources/element/Switch.vue'
// import machinery from './Resources/element/machinery.vue'
// import Other from './Resources/element/Other.vue'
//relay/resources/Experiment
import Basics from './Resources/Experiment/Basics.vue'
import comprehensive from './Resources/Experiment/comprehensive.vue'
import innovate from './Resources/Experiment/innovate.vue'


// admin端
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
                    }]
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
                // 详情
                {
                    path: '/relay/Examine',
                    name: '/relay/Examine',
                    component: Examine
                }
            ]
        },


        //  跳转到老师端##############################
        {
            path: '/relayteacher',
            name: 'relayteacher',
            component: relayteacher,
            children: [
                //relay继电保护分页内容
                {
                    path: '/relayteacher/Survey',
                    name: 'Survey',
                    component: Survey
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
                // 详情
                {
                    path: '/relayteacher/Examine',
                    name: '/relayteacher/Examine',
                    component: Examine
                },
                {
                    path: '/relayteacher/Resources',
                    name: 'Resources',
                    component: Resources,
                    children: [
                        // {path:'/relay/resources',redirect:'/Resources/Files/file'},
                        {
                            path: '/relayteacher/resources/file/:id',
                            name: 'file',
                            component: file
                        },
                        // {path: '/Resources/Files/topic',name: 'topic',component: topic},
                        // {path: '/Resources/Files/video',name: 'video',component: video},
                        // {path: '/Resources/element/source', name: 'source',component: source},
                        // {path: '/Resources/element/Switch',name: 'Switch',component: Switch},
                        // {path: '/Resources/element/machinery',name: 'machinery',component: machinery},
                        // {path: '/Resources/element/Other',name: 'Other',component: Other},
                        {
                            path: '/Resources/Experiment/Basics',
                            name: 'Basics',
                            component: Basics
                        },
                        {
                            path: '/Resources/Experiment/comprehensive',
                            name: 'comprehensive',
                            component: comprehensive
                        },
                        {
                            path: '/Resources/Experiment/innovate',
                            name: 'innovate',
                            component: innovate
                        },

                    ]
                },
                {
                    path: '/relayteacher/task',
                    name: 'task',
                    component: task,
                    children: [

                    ]
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



       


        // 跳转到课程1
        {
            path: '/course1',
            name: 'course1',
            component: course1
        },
        //跳转到课程二
        {
            path: '/course2',
            name: 'course2',
            component: course2
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