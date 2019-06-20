import axios from 'axios'
// axios.defaults.baseURL = "http://192.168.2.223:8080"

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 登陆拦截


const doUrl = url => {

  let courseUrl = 'http://192.168.2.200:8080/creatorcourse'
  if (JSON.parse(sessionStorage.getItem("course"))) {
    courseUrl = JSON.parse(sessionStorage.getItem("course")).url
  }


  const rules = [{
      //  target: 'http://192.168.2.223:8080', //
      target: 'http://192.168.2.200:8080/creatoraccount', //
      // target: 'http://sso.icubespace.com/account',
      pathRewrite: '^/api',

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
axios.interceptors.request.use(
  config => {
    //获取本地缓存中的令牌mytoken
    let token = localStorage.getItem('token')

    config.url = process.env.NODE_ENV == 'production' ? doUrl(config.url) : config.url;
    // if (config.url != "/api/signin") {
    config.headers['token'] = token;
    // }

    return config
  }, error => {
    return Promise.reject(error)
  })
// 测试
export const demo = () => {
  return axios.get(`/top/v2/movie/top250`)


}

//登录n
export const login = (params) => {
  // return axios.post("http://sso.icubespace.com/account/signin",params)
  return axios.post("/api/signin", params)

}
export const curlist = () => {
  return axios.get(`/api/get_course_list`)
}
// 获取与用户同班级的信息
export const getclass = (params) => {
  return axios.post(`/api/get_class_and_student`, params)
}
//老师获取课程下的学生




//获取课程介绍
export const get_course_description = (params) => {
  return axios.post(`/api/get_course_description`, params)
}

//修改课程介绍
export const modify_course_description = (params) => {
  return axios.post(`/api/modify_course_description`, params)
}
//修改课程介绍
export const modify_course_objectives = (params) => {
  return axios.post(`/api/modify_course_objectives`, params)
}

//获取章节
export const get_chapter_and_unit_list = () => {
  return axios.post(`/img/get_chapter_and_unit_list`)
}

//获取所有章
export const get_chapters = () => {
  return axios.post(`/img/get_chapters`)
}

//获取所有节
export const get_unit_list = (params) => {
  return axios.post(`/img/get_unit_list`, params)
}

//添加章
export const add_chapter = (params) => {
  return axios.post(`/img/add_chapter`, params)
}

//添加节
export const add_unit = (params) => {
  return axios.post(`/img/add_unit`, params)
}

//删除章
export const delete_chapter = (params) => {
  return axios.post(`/img/delete_chapter`, params)
}

//删除节
export const delete_unit = (params) => {
  return axios.post(`/img/delete_unit`, params)
}

//修改章
export const modify_chapter_name = (params) => {
  return axios.post(`/img/modify_chapter_name`, params)
}

//修改节
export const modify_unit_name = (params) => {
  return axios.post(`/img/modify_unit_name`, params)
}

//获取全部学习资料
export const get_all_materials = (params) => {
  return axios.post(`/img/get_all_materials`, params)
}

//根据章获取学习资料
export const get_materials_by_chapter = (params) => {
  return axios.post(`/img/get_materials_by_chapter`, params)
}

//根据节获取学习资料
export const get_materials_by_unit = (params) => {
  return axios.post(`/img/get_materials_by_unit`, params)
}

//删除文件
export const delete_material = (params) => {
  return axios.post(`/img/delete_material`, params)
}

//上传
export const upload_material = (params) => {
  return axios.post(`/img/upload_material`, params)
}
//移动文件
export const modify_material_chapter_and_unit = (params) => {
  return axios.post(`/img/modify_material_chapter_and_unit`, params)
}
//修改文件名称
export const modify_material_name = (params) => {
  return axios.post(`/img/modify_material_name`, params)
}
//资源下载
export const fileDownload = (params) => {
  return axios.post(`/img/download`, params)
}


//元件库
//获取原件组件
export const get_component_group = () => {
  return axios.post(`/img/get_component_group`)
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
  return axios.post(`/img/get_component_by_id`, params)
}
//修改元件参数
export const modify_component_parameter = (params) => {
  return axios.post(`/img/modify_component_parameter`, params)
}


// 获取任务列表
export const simulist = (params) => {
  return axios.post(`/img/get_task_experiment_by_submitter`, params)
}
// 获取制定任务的实验指导
export const guidelist = (params) => {
  return axios.post(`/img/get_task_experiment_guide`, params)
}
// 获取制定任务的实验报告
export const reportlist = (params) => {
  return axios.post(`/img/get_task_experiment_report`, params)
}
// 获取制定任务的附件
export const annex = (params) => {
  return axios.post(`/img/get_task_experiment_annex`, params)
}

// 获取实验快照列表
export const snalist = (params) => {
  return axios.post(`/img/get_task_experiment_project_list`, params)
}
// 删除快照 del_task_experiment_project
export const snadel = (params) => {
  return axios.post(`/img/del_task_experiment_project`, params)
}



// 删除实验模板
export const deleteTemplate = (params) => {
  return axios.post(`/img/delete_task_experiment_template`, params)
}


// 添加资源
export const resource = (params) => {
  return axios.post(`/img/add_resource`, params)
}


// 上传报告

export const report = (params) => {
  return axios.post(`/img/add_task_experiment_report`, params)
}


// 获取快照
export const project = (params) => {
  return axios.post(`/img/get_task_experiment_project`, params)
}
// 资源下载
export const download = (params) => {
  return axios.post(`/img/download`, params)
}
// 根据资源id获取属性
export const getResource_by_id = (params) => {
  return axios.post(`/img/get_resource_by_id`, params)
}


// teacher端**********************
//下发任务
export const Nxmission = (params) => {
  return axios.post('/img/add_task_experiment', params)
}
//实验模板列表
export const templateList = (params) => {
  return axios.post('/img/task_experiment_template_list', params)

}
// 修改实验模板属性
export const updateTemplate = (params) => {
  return axios.post('/img/update_task_experiment_template', params)

}
// 复制实验模版并重命名
export const copyTemplate = (params) => {
  return axios.post('/img/copy_task_experiment_template', params)

}


// 添加实验模版
export const addTemplate = (params) => {
  return axios.post('/img/add_task_experiment_template', params)

}

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


// admin端管理元*************************
export const getTeacherList = (params) => {
  return axios.post('/api/get_teacher_list', params)

}
// 获取教师列表
export const addTeacher = (params) => {
  return axios.post('/api/add_teacher', params)

}
// 添加教师
export const modifyTeacher = (params) => {
  return axios.post('/api/modify_teacher_information', params)

}
// 修改教师信息
export const deletedaTeacher = (params) => {
  return axios.post('/api/delete_teacher', params)

}
// 删除教师



export const getStudentList = (params) => {
  return axios.post('/api/get_student_list', params)

}
// 获取学生列表
export const addStudent = (params) => {
  return axios.post('/api/add_student', params)

}
// 添加学生
export const modifyStudent = (params) => {
  return axios.post('/api/modify_student_information', params)

}
// 修改学生信息
export const deleteStudent = (params) => {
  return axios.post('/api/delete_student', params)

}
// 删除学生


export const getClassList = (params) => {
  return axios.post('/api/get_class_list', params)

}

// 获取班级列表
export const addClass = (params) => {
  return axios.post('/api/add_class', params)

}
// 添加班级

// 获取没有班级的学生列表
export const modifyClass = (params) => {
  return axios.post('/api/modify_class_information', params)

}
export const get_students_no_class = (params) => {
  return axios.post('/api/get_students_no_class', params)

}
// 修改班级信息
export const deleteClass = (params) => {
  return axios.post('/api/delete_class', params)

}
// 删除班级

// 删除课程
export const delete_course = (params) => {
  return axios.post('/api/delete_course', params)

}
// 修改课程

export const modify_course_information = (params) => {
  return axios.post('/api/modify_course_information', params)

}

export const getCourseList = (params) => {
  return axios.post('/api/get_course_list', params)

}
// 课程列表
export const addCourse = (params) => {
  return axios.post('/api/add_course', params)

}
// 添加课程
export const updateCourseUrl = (params) => {
  return axios.post('/api/update_course_url', params)

}
// 更新课程服务地址


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
  let datas = new Date(date)
  datas.setTime(datas.getTime() + 3600 * 1000 * 8)
  let dateee = datas.toJSON();
  return new Date(+new Date(dateee)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')

}
