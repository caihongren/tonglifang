import axios from 'axios'
// axios.defaults.baseURL = "http://192.168.2.223:8080"

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 登陆拦截

axios.interceptors.request.use(
    config =>{
        //获取本地缓存中的令牌mytoken
        let token=localStorage.getItem('token')
        config.headers['token']=token;
        return config
    },error =>{
            return Promise.reject(error)
        })
//登录
export const login=(params)=>{
    return axios.post("/api/signin",params)
}
export const curlist=()=>{
    return axios.get('/api/get_course_list')
} 



// 获取任务列表
export const simulist=(params)=>{
    return axios.post(`/img/get_task_experiment_by_submitter`,params)
} 






// 获取实验快照列表
export const snalist=(params)=>{
    return axios.post(`/img/get_task_experiment_project_list`,params)
} 
// 删除快照 del_task_experiment_project
export const snadel=(params)=>{
    return axios.post(`/img/del_task_experiment_project`,params)
} 




