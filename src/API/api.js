import axios from 'axios';
import global_ from './Global.js' //引用文件
import store from '../store'
import router from './../router';
// axios.defaults.baseURL = "http://192.168.2.223:8080"

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 登陆拦截


const loadJson = (url) => {
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
let standAlone = global_.standAlone
// let path = process.env.NODE_ENV !== 'production' ? '../config.json?' : './config.json?'
// loadJson(path + new Date().getTime()).then(
//   config => {
//     store.state.config = config.target
//     window.config = config
   
//     if (standAlone) {
//       require("../assets/css/danji.css");
//     }
//   }
// );
const doUrl = url => {
  let courseUrl = store.state.config
  if (JSON.parse(sessionStorage.getItem("course"))&&JSON.parse(sessionStorage.getItem("course")).url) {
    courseUrl = JSON.parse(sessionStorage.getItem("course")).url
  }

  const rules = [{
      //  target: 'http://192.168.2.223:8080', //
      // target: 'http://localhost:8080/creatoraccount',
      // target: 'http://192.168.2.200:8080/creatoraccount', //
      // target: 'http://sso.icubespace.com/account',
      // target: 'http://106.75.128.230:10000/zuul/creator/api/public/account',
      //target: 'http://192.168.2.200:10000/zuul/creator/api/public/account',
      //target: 'http://cloud.asp0755.com/creator/api/public/account',
      // target: 'http://192.168.0.200:9053',   //蹦迪昌平
      // target: 'http://106.75.128.230:9053', //线上昌平
      target:  store.state.config, //线上
      // target: 'http://106.75.128.230:9055', //线上昌平
      //target: 'http://sso.icubespace.com/zhengtie',

      pathRewrite: '^/apl',

    },
    {
      // target: 'http://192.168.2.223:8081', 
      // target: 'http://192.168.2.200:8080/creatorcourse', //
      // target: 'http://sso.icubespace.com/course',
      target: courseUrl,
      pathRewrite: '^/img',
    }

  ]
  let match = null;
  for (let index = 0; index < rules.length; index++) {
    const rule = rules[index];
    match = url.match(new RegExp(rule.pathRewrite, 'i'));
    if (match) {
      return url.replace(match[0], rule.target)
    }
  }
  if (!match) return url
}
// var responsetype=true
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
 
  // alert(response.headers.islogin);
  if (response.data.code == 410) {
    // if (sessionStorage.getItem('isLogins')) {
    //   return '';
    // } else {
    //   sessionStorage.setItem('isLogins', 'true')
    //   alert("此账号在别处登录！,请重新新登录。");
    //   let url = window.location.href.split('#')[0]
    //   window.location.href = url
    //   return '';
    // }
  } else {

    return response;
  }

})
axios.interceptors.request.use(
  config => {
    //获取本地缓存中的令牌mytoken
    let token = localStorage.getItem('token')
    let courseid = '123';
    if (sessionStorage.getItem("course") != null) {
      courseid = JSON.parse(sessionStorage.getItem("course")).id;
    }
    config.url = process.env.NODE_ENV == 'production' ? doUrl(config.url) : config.url;
    // if (config.url != "/apl/signin") {
    config.headers['token'] = token;
    config.headers['Cube-Token'] = token;
    
    config.headers['Cube-Domain'] = courseid;
    // config.headers['standAlone'] = global_.standAlone;
    // config.headers['standAlone'] = true;
    // }
    return config
  }, error => {
    return Promise.reject(error)
  })




// 测试
export const demo = () => {
  return axios.get(`/top/v2/movie/top250`)
}

// courseid
const courseID = () => {
  let courseid = '';
  if (sessionStorage.getItem("course") != null) {
    courseid = JSON.parse(sessionStorage.getItem("course")).id;
  }

  return courseid
}



//登录n
export const login = (params) => {

  // return axios.post("http://sso.icubespace.com/account/signin",params)
  // return axios.post("/apl/login", params) //高训

  return standAlone ? axios.get('./json/login.json') : axios.post("/apl/login", params)
}
// 微信登录接口 start
export const weixinglogin = (params) => {
  return axios.post("/apl/weixin/wechat_login", params) //高训
}
// 绑定微信
export const wechat_binding = (params) => {
  return axios.post("/apl/weixin/wechat_binding", params) //高训
}
// 验证是否绑定微信
export const wechat_check = (params) => {

  return axios.post("/apl/weixin/wechat_check", params) //高训
}
// 微信解绑
export const wechat_unbound = (params) => {

  return axios.post("/apl/weixin/wechat_unbound", params) //高训
}



// end
//发送退出  登录时间
export const loginTime = () => {
  return axios.post(`/apl/loginTime`)
}

// 获取课程
export const curlist = () => {

  return standAlone ? axios.get('./json/get_course_list.json') : axios.post('/apl/get_course_list', )
}
// 获取与用户同班级的信息  //教师获取课程下的学生
export const getclass = (params) => {
  return axios.post(`/apl/get_class_and_student`, params)
}

// 平均成绩
// 获取班级列表  
export const get_class_by_teacher = (params) => {
  return axios.post(`/apl/get_class_by_teacher`, params)
}
export const get_grade = (params) => {
  return axios.post(`/img/get_grade`, params)
}


// 获取用户信息
export const account_detail = (params) => {
  return axios.post(`/apl/user_info`, params)
}
// 用户自行修改密码
export const change_password_self = (params) => {
  return axios.post(`/apl/change_password_self`, params)
}

//获取课程介绍
export const get_course_description = (params) => {
  return standAlone ? axios.get('./json/get_course_description^' + params.courseId + '.json') : axios.post('/apl/get_course_description', params)

}

//修改课程介绍
export const modify_course_description = (params) => {
  return axios.post(`/apl/modify_course_description`, params)
}
//修改课程介绍
export const modify_course_objectives = (params) => {
  return axios.post(`/apl/modify_course_objectives`, params)
}
//课程实训列表
export const getModuleAndTrainingInner = () => {
  //   return axios.post(`/img/get_module_and_training_inner`)

  // return axios.get('./json/get_module_and_training_inner^' + courseID() + '.json')
  return standAlone ? axios.get('./json/get_module_and_training_inner^' + courseID() + '.json') : axios.post('/img/get_module_and_training_inner')

}
//我的实训列表
export const getModuleAndTrainingSelf = () => {
  return axios.post(`/img/get_module_and_training_self`)
}
//根据模块获取资源
export const get_resource_by_module = (params) => {
  return axios.post(`/img/get_resource_by_module`, params)
}
//根据实训获取资源
export const get_resource_by_training = (params) => {
  return axios.post(`/img/get_resource_by_training`, params)
}

//获取所有课程实训资源
export const get_resource_training_inner = () => {
  return axios.post(`/img/get_resource_training_inner`)
}

//获取所有我的实训资源
export const get_resource_training_self = () => {
  return axios.post(`/img/get_resource_training_self`)
}


//获取所有章
export const get_chapters = () => {
  return axios.post(`/img/get_chapters`)
}

//获取所有节
export const get_unit_list = (params) => {
  return axios.post(`/img/get_unit_list`, params)
}
// 获取章节
export const get_chapter_and_unit_list = (params) => {
  return standAlone ? false:axios.post(`/img/get_chapter_and_unit_list`, params)
}
// add shantie in 1.9
// 添加章
export const add_chapter = (params) => {
  return axios.post(`/img/add_chapter`, params)
}
// 添加节
export const add_unit = (params) => {
  return axios.post(`/img/add_unit`, params)
}
// 删除章
export const delete_chapter = (params) => {
  return axios.post(`/img/delete_chapter`, params)
}
// 删除节
export const delete_unit = (params) => {
  return axios.post(`/img/delete_unit`, params)
}

// end 
//资源下载
export const fileDownload = (params) => {
  return axios.post(`/img/download`, params)
}


//元件库
//获取原件组件
export const get_component_group = () => {
  return standAlone ? axios.get('./json/get_component_group.json') : axios.post('/img/get_component_group')

  //   return axios.post(`/img/get_component_group`)
}

//教师批阅列表
export const task_review_list = (params) => {
  return axios.post(`/img/task_review_list`, params)
}

//教师查看学生任务详情
export const task_review_details = (params) => {
  return axios.post(`/img/task_review_details`, params)
}
//教师批阅，打分，写评语
export const task_review_score = (params) => {
  return axios.post(`/img/task_review_score`, params)
}
//老师驳回学生任务
export const task_reject = (params) => {
  return axios.post(`/img/task_reject`, params)
}

//根据元件组获取元件
export const get_component_by_group = (params) => {
  return axios.post(`/img/get_component_by_group`, params)
}
//获取元件组和元件
export const get_group_and_component = () => {
  return axios.post(`/img/get_group_and_component`)
}
//修改元件介绍
export const modify_component_introduction = (params) => {
  return axios.post(`/img/modify_component_introduction`, params)
}
//元件重命名
export const rename_component = (params) => {
  return axios.post(`/img/rename_component`, params)
}
//元件添加
export const add_component = (params) => {
  return axios.post(`/img/add_component`, params)
}
//元件删除
export const delete_component = (params) => {
  return axios.post(`/img/delete_component`, params)
}
//元件搜索
export const search_component = (params) => {
  return axios.post(`/img/search_component`, params)
}
//根据元件id 获取元件
export const get_component_by_id = (params) => {
  return standAlone ? axios.get('./json/get_component_by_id^' + params.componentId + '.json') : axios.post('/img/get_component_by_id', params)


}
//修改元件参数
export const modify_component_parameter = (params) => {
  return axios.post(`/img/modify_component_parameter`, params)
}
//修改元件模型
export const modify_component_model = (params) => {
  return axios.post(`/img/modify_component_model`, params)
}
//添加元件组
export const add_component_group = (params) => {
  return axios.post(`/img/add_component_group`, params)
}
//删除元件组
export const delete_component_group = (params) => {
  return axios.post(`/img/delete_component_group`, params)
}


//实训模板库

//获取模板列表
export const getTemplateList = (params) => {
  return axios.post(`/img/get_template_list`, params)
}
//克隆模板
export const cloneTemplate = (params) => {
  return axios.post(`/img/clone_template`, params)
}
//删除模板
export const delete_template = (params) => {
  return axios.post(`/img/delete_template`, params)
}

//校验模板名称
export const check_template_name = (params) => {
  return axios.post(`/img/check_template_name`, params)
}
//新增模板
export const add_template = (params) => {
  return axios.post(`/img/add_template`, params)
}
//上传资源
export const uploadFile = (params) => {
  return axios.post(`/img/upload_file`, params)
}
//获取模板详情
export const getTemplate = (params) => {
  return axios.post(`/img/get_template`, params)
}


//获取实训任务列表

export const bySubmitter = (params) => {
  return axios.post(`/img/get_task_experiment_by_submitter`, params)
}
// 获取任务列表
export const simulist = (params) => {
  return axios.post(`/img/get_task_experiment_by_submitter`, params)
}
// 获取学生实训任务列表
export const experimentDetails = (params) => {
  return axios.post(`/img/get_task_experiment_details`, params)
}
// 获取制定任务的实训指导
export const guidelist = (params) => {
  return axios.post(`/img/get_task_experiment_guide`, params)
}
// 获取制定任务的实训报告
export const reportlist = (params) => {
  return axios.post(`/img/get_task_experiment_report`, params)
}
// 获取制定任务的附件
export const annex = (params) => {
  return axios.post(`/img/get_task_experiment_annex`, params)
}

// 获取实训快照列表
export const snalist = (params) => {
  return axios.post(`/img/get_task_experiment_project_list`, params)
}
// 删除快照 del_task_experiment_project
export const snadel = (params) => {
  return axios.post(`/img/del_task_experiment_project`, params)
}
// 设置模板为内置
export const updateTemplateInner = (params) => {
  return axios.post(`/img/update_template_inner`, params)
}

// 删除实训模板
export const deleteTemplate = (params) => {
  return axios.post(`/img/delete_task_experiment_template`, params)
}


// 添加资源通用
export const resource = (params) => {
  return axios.post(`/img/add_resource`, params)
}

// 添加资源
export const taskUpload = (params) => {
  return axios.post(`/img/task_upload`, params)
}


// 上传报告

export const report = (params) => {
  return axios.post(`/img/add_task_experiment_report`, params)
}
//保存或提交
export const saveTaskExperiment = (params) => {
  return axios.post(`/img/save_task_experiment`, params)
}

// 获取快照
export const project = (params) => {
  return axios.post(`/img/get_task_experiment_project`, params)
}
// 资源下载
export const download = (params) => {
  return axios.post(`/img/download`, params, {
    responseType: 'blob'
  })
}
// 根据资源id获取属性
export const getResource_by_id = (params) => {
  return axios.post(`/img/get_resource_by_id`, params)
}
// 获取内置任务列表

export const get_menu_and_training = (params) => {
  return axios.post(`/img/get_menu_and_training`, params)
}

// teacher端*************************************************************************************************

//实训模板列表
export const templateList = (params) => {
  return axios.post('/img/task_experiment_template_list', params)
}
// 修改实训模板属性
export const updateTemplate = (params) => {
  return axios.post('/img/update_task_experiment_template', params)
}
// 复制实训模版并重命名
export const copyTemplate = (params) => {
  return axios.post('/img/copy_task_experiment_template', params)
}
// 添加实训模版
export const addTemplate = (params) => {
  return axios.post('/img/add_task_experiment_template', params)
}


// 新课程实训8、30 的1.1.1版本新增
//获取实训列表
export const get_training_list = (params) => {
  return axios.post('/img/get_training_list', params)
}
// 获取实训详情
export const training_details = (params) => {

  return standAlone ? axios.get('./json/training_details^' + params.trainingId + '.json') : axios.post('/img/training_details', params)

  //   return axios.post('/img/training_details', params)
}
//编辑实训内容
export const edit_training = (params) => {
  return axios.post('/img/edit_training', params)
}

//获取实训模块
export const get_training_module = () => {
  return axios.post('/img/get_training_module')
}
//获取实训类型
export const get_training_type = () => {
  return axios.post('/img/get_training_type')
}
// 新增实训
export const add_training = (params) => {
  return axios.post('/img/add_training', params)
}
// 删除实训
export const delete_training = (params) => {
  return axios.post('/img/delete_training', params)
}
// 实训相关文件上传
export const add_training_resource = (params) => {
  return axios.post('/img/add_training_resource', params)
}
//添加实训模块
export const add_training_module = (params) => {
  return axios.post('/img/add_training_module', params)
}

//删除实训模块
export const delete_training_module = (params) => {
  return axios.post('/img/delete_training_module', params)
}

//添加实训类型
export const add_training_type = (params) => {
  return axios.post('/img/add_training_type', params)
}

//删除实训类型
export const delete_training_type = (params) => {
  return axios.post('/img/delete_training_type', params)
}
//修改实训模块并设置为内置
export const modify_training_module = (params) => {
  return axios.post('/img/modify_training_module', params)
}

// 实训查询选中元件
export const query_training_component = (params) => {
  return standAlone ? axios.get('./json/query_training_component^' + params.trainingId + '.json') : axios.post('/img/query_training_component', params)

}
// 实训编辑选中元件
export const modify_training_component = (params) => {
  return axios.post('/img/modify_training_component', params)
}


// 根据关联Id获取故障list
export const select_account_task_fault = (params) => {
  return axios.post('/img/select_account_task_fault', params)
}

//新课程实训8、30 的1.1.1版本新增end


// 任务列表
export const master = (params) => {
  return axios.post('/img/get_task_experiment_by_master', params)
}

// 任务列表
export const eportList = (params) => {
  return axios.post('/img/get_task_experiment_report_list', params)
}

// 获取任务报告
export const reportByMaster = (params) => {
  return axios.post('/img/get_task_experiment_report_by_master', params)
}
// 停止任务
export const stopTask = (params) => {
  return axios.post('/img/stop_task_experiment', params)
}


// 删除任务
export const deletedaTask = (params) => {
  return axios.post('/img/delete_task_experiment', params)
}

//获取仿真资源类型列表
export const getScene = () => {
  return axios.post('/img/get_scene_type_list')
}
//添加实训类型
export const experiment_type_list = () => {
  return axios.post('/img/experiment_type_list')
}

//下发任务
export const addTaskExperiment = (params) => {
  return axios.post('/img/add_task_experiment', params)
}
//学生获取任务列表
export const getTaskByStudent = (params) => {

  if (params.innerr == true) {
    return standAlone ? axios.get('./json/get_task_by_student^' + courseID() + '.json') : axios.post('/img/get_task_by_student', params)
  } else {
    return axios.post('/img/get_task_by_student', params)
  }
}
// 学生考核模式信息
export const get_exam_details = (params) => {
  return standAlone ? axios.get('./json/get_exam_details.json') : axios.post('/img/get_exam_details', params)
  //   return axios.post('/img/get_exam_details', params)
}
// 保存or提交任务
export const save_or_submit_task = (params) => {
  return axios.post('/img/save_or_submit_task', params)
}
// 获取仿真资源列表
export const getSimulation = (params) => {
  return axios.post('/img/get_simulation_resource_list', params)
}

//新增仿真资源
export const addSimulation = (params) => {
  return axios.post('/img/add_simulation_resource', params)

}
//克隆仿真资源
export const cloneSimulation = (params) => {
  return axios.post('/img/clone_simulation_resource', params)

}
//删除仿真资源
export const deletSimulation = (params) => {
  return axios.post('/img/delete_simulation_resource', params)

}
//修改仿真资源
export const modifySimulation = (params) => {
  return axios.post('/img/modify_simulation_resource', params)

}
//获取仿真资源类型列表2维/3维
export const sceneTypes = (params) => {
  return axios.post('/img/get_scene_types', params)
}
export const addSimulationAnnex = (params) => {
  return axios.post('/img/add_simulation_annex', params)
}

// add shantie 任务列表
export const get_training_inner = (params) => {
  return axios.post('/img/get_training_inner', params)
}


// 资源管理员***********************************************************************************
// add 试题库 12.10
// 获取试题列表
export const get_question_list = (params) => {
  return axios.post('/img/get_question_list', params)
}
// 添加新的试题
export const add_new_question = (params) => {
  return axios.post('/img/add_new_question', params)
}
// 修改试题
export const modify_question = (params) => {
  return axios.post('/img/modify_question', params)
}
// 删除试题
export const delete_question = (params) => {
  return axios.post('/img/delete_question', params)
}
// 根据试题ID获取试题详情
export const get_question = (params) => {
  return axios.post('/img/get_question', params)
}
// 试卷部分
// 根据试卷Id和试题类型获取试题列表
export const get_question_list_by_paper = (params) => {
  return axios.post('/img/get_question_list_by_paper', params)
}
// 添加或者修改试卷
export const add_and_modify_paper = (params) => {
  return axios.post('/img/add_and_modify_paper', params)
}
// 获取试卷列表
export const get_paper_list = (params) => {
  return axios.post('/img/get_paper_list', params)
}
// 获取试卷详情
export const get_paper_by_id = (params) => {
  return standAlone ? axios.get('./json/get_paper_by_id^' + params.id + '.json') : axios.post(`/img/get_paper_by_id`, params)

  
}
// 修改试卷试题
export const modify_paper_question = (params) => {
  return axios.post('/img/modify_paper_question', params)
}
// 删除试卷
export const delete_paper_by_id = (params) => {
  return axios.post('/img/delete_paper_by_id', params)
}
// 学生获取试卷列表
export const get_student_paper_list = (params) => {
  return standAlone ? axios.get('./json/get_student_paper_list.json') : axios.post(`/img/get_student_paper_list`, params)

}
// 学生提交试卷接口
export const modify_student_training_history = (params) => {
  return standAlone ? axios.get('./json/modify_student_training_history.json') : axios.post(`/img/modify_student_training_history`, params)

}
//学生获取试卷练习历史
export const get_student_training_history = (params) => {
  return axios.post('/img/get_student_training_history', params)
}
// 下发试卷
export const modify_paper_down = (params) => {
  return axios.post('/img/modify_paper_down', params)
}
// 获取老师下发后试卷列表
export const get_down_paper_list = (params) => {
  return axios.post(`/img/get_down_paper_list`, params)
}
// 老师获取学生成绩
export const get_student_paper_histroy = (params) => {
  return axios.post(`/img/get_student_paper_histroy`, params)
}
// 学习模式附件排序

export const drag_sort = (params) => {
  return axios.post(`/img/drag_sort`, params)
}

// admin端管理元*************************************************************************
export const getTeacherList = (params) => {
  return axios.post('/apl/get_teacher_list', params)

}
// 获取教师列表
export const addTeacher = (params) => {
  return axios.post('/apl/add_teacher', params)

}
// 添加教师
export const modifyTeacher = (params) => {
  return axios.post('/apl/modify_teacher_information', params)

}
// 修改教师信息
export const deletedaTeacher = (params) => {
  return axios.post('/apl/delete_teacher', params)

}
// 删除教师



export const getStudentList = (params) => {
  return axios.post('/apl/get_student_list', params)

}
//修改用户密码
export const changePassword = (params) => {
  return axios.post('/apl/change_password', params)
}
// 获取学生列表
export const addStudent = (params) => {
  return axios.post('/apl/add_student', params)
}
// 添加学生
export const modifyStudent = (params) => {
  return axios.post('/apl/modify_student_information', params)
}
// 修改学生信息
export const deleteStudent = (params) => {
  return axios.post('/apl/delete_student', params)
}
// 删除学生


export const getClassList = (params) => {
  return axios.post('/apl/get_class_list', params)
}

// 获取班级列表
export const addClass = (params) => {
  return axios.post('/apl/add_class', params)
}
// 添加班级

// 获取没有班级的学生列表
export const modifyClass = (params) => {
  return axios.post('/apl/modify_class_information', params)
}
export const get_students_no_class = (params) => {
  return axios.post('/apl/get_students_no_class', params)
}
// 修改班级信息
export const deleteClass = (params) => {
  return axios.post('/apl/delete_class', params)
}
// 删除班级

// 删除课程
export const delete_course = (params) => {
  return axios.post('/apl/delete_course', params)
}
// 修改课程

export const modify_course_information = (params) => {
  return axios.post('/apl/modify_course_information', params)
}

// 课程关系列表
export const getCourseList = (params) => {

  return axios.post('/apl/get_course_list_admin', params)
}
// 课程列表
export const getCourse = (params) => {
  return axios.post('/apl/get_course', params)
}

export const addCourse = (params) => {
  return axios.post('/apl/add_course', params)
}
// 添加课程
export const updateCourseUrl = (params) => {
  return axios.post('/apl/update_course_url', params)
}
// 更新课程服务地址



// 版本控制******************************************************************************
// 获取项目及版本列表
export const get_item_and_version = (params) => {
  return axios.post('/apl/get_item_and_version', params)
}
// 添加项目
export const add_item = (params) => {
  return axios.post('/apl/add_item', params)
}
// 删除项目
export const delete_item = (params) => {
  return axios.post('/apl/delete_item', params)
}
// 添加版本
export const add_version = (params) => {
  return axios.post('/apl/add_version', params)
}
// 删除版本
export const delete_version = (params) => {
  return axios.post('/apl/delete_version', params)
}
// 根据版本获取文件
export const get_document_by_version = (params) => {
  return axios.post('/apl/get_document_by_version', params)
}
// 上传文件
export const upload_document = (params) => {
  return axios.post('/apl/upload_document', params)
}
// 删除文件
export const delete_document = (params) => {
  return axios.post('/apl/delete_document', params)
}

// 编辑公告
export const modify_bulletin = (params) => {
  return axios.post('/apl/modify_bulletin', params)
}
// 课程列表
export const courseList = (params) => {
  return axios.post('/apl/course_list', params)
}
export const courseDetails = (params) => {
  return standAlone ? axios.get('./json/course_details.json') : axios.post('/img/course_details', params)

}
export const courseCatalog = (params) => {
  return standAlone ? axios.get('./json/course_catalog.json') : axios.post('/img/course_catalog', params)
  // return axios.post('/img/course_catalog',params)

}


// 自定义方法8888888888888
// 封装请求
export const axiosBox = (params, url) => {
  return axios.post(url, params)
}

// 为空NUllhe undefined panduan
export const tostring = (res) => {
  if (res == null || res == undefined) {
    return ''
  } else {
    return res
  }
}
export const tonumber = (res) => {
  if (res == null || res == undefined) {
    return []
  } else {
    return res
  }
}



// 时间格式转换
export function formatDate(date) {
  if (date == null || date == "" || date == undefined) {
    return
  } else {
    let datas = new Date(date)
    datas.setTime(datas.getTime() + 3600 * 1000 * 8)
    let dateee = datas.toJSON();
    return new Date(+new Date(dateee)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  }

}

//回车转换
export function Trim(str) {
  //str表示要转换的字符串
  return str.replace(/\n|\r\n/g, "<br/>");
}
//数组加回车转换
export function arrayTrim(array) {
  //str表示要转换的字符串
  let string = "";
  for (let i = 0; i < array.length; i++) {
    string += array[i] + "\n"
  }
  return string
}


// 计算文件大小,根据字节计算大小
export function Size(num) {
  // 
  if (typeof (num) != "number" || num <= 0) return false;
  if (num <= 1024) {
    return num + 'B';
  } else
  if (1024 < num && num <= 1024 * 1024) {
    return (num / 1024).toFixed(2) + "KB"
  } else if (1024 ** 2 < num && num <= 1024 ** 3) {
    return (num / (1024 ** 2)).toFixed(2) + "MB"
  } else if (1024 ** 3 < num && num <= 1024 ** 4) {
    return (num / (1024 ** 3)).toFixed(2) + "GB"
  } else if (1024 ** 4 < num && num <= 1024 ** 5) {
    return (num / (1024 ** 4)).toFixed(2) + "TB"
  } else if (1024 ** 5 < num && num <= 1024 ** 6) {
    return (num / (1024 ** 5)).toFixed(2) + "PB"
  } else if (num >= 1024 ** 6) {
    return ">1PB"
  }
}


// 判断身份
export function status() {
  let user = JSON.parse(sessionStorage.getItem("user"));
  if (user.role == "teacher") {
    return true;
  } else {
    return false;
  }
}

// 处理对象数组，返回数组内容
export function Anarrayofobjects(array, type) {
  let newarray = [];
  for (let i = 0; i < array.length; i++) {
    newarray.push(array[i][type])
  }

  return newarray;

}

// 数组洗牌
export function shuffle(array) {
  var m = array.length,
    t, i;
  // 如果还剩有元素…
  while (m) {
    // 随机选取一个元素…
    i = Math.floor(Math.random() * m--);
    // 与当前元素进行交换
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}