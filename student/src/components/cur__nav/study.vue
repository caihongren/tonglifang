<template>
  <div class="box">
    <!-- 目录 -->
    <el-row type="flex" class="row-bg">
      <el-col :span="3">
        <div class="grid-content bg-purple left">
          <div class="Catalog-img"><img src="./../../image/course-top1.png"></div>
          <div class="top">
            <el-menu default-active="1" class="el-menu-vertical-demo" background-color="rgb(35,38,41)" text-color="#fff" active-text-color="#ffd04b" router >
              <el-menu-item :index="courseIntroductionPath">
                <!-- <i class="el-icon-menu"></i> -->
                <span slot="title" class="introduce"><i class="icon iconfont" style="font-size:20px">&#xe501;</i> 课程介绍</span>
              </el-menu-item>
              <el-menu-item :index="curriculumLearningPath">
                <div class="two" >
                  <!-- <i class="el-icon-menu"></i> -->
                  <span slot="title" class="introduce">  <i class="icon iconfont" style="font-size:20px">&#xe622;</i> 课程学习</span>
                </div>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="grid-content bg-purple right">
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {get_course_description} from "@/API/api";
export default {
  data() {
    return {
      //curriculumLearning: true,
      icon:"",
      courseIntroductionPath: "",//课程介绍路由路径
      curriculumLearningPath: ""//课程学习路由路径
    }
  },
  methods: {
    //判断老师还是学生
    courseIntroductionToInit(){
      let  user= JSON.parse( sessionStorage.getItem("user"))
      if(user.role == "teacher"){
       this.curriculumLearning = false;
       this.courseIntroductionPath = "/relayteacher/study/courseIntroduction";//课程介绍老师路由地址
       this.curriculumLearningPath ="/relayteacher/study/curriculumLearning";//课程学习老师路由地址
      }else if(user.role == "student"){
        this.curriculumLearning = true;
        this.courseIntroductionPath = "/relay/study/courseIntroduction";//课程介绍学生路由地址
        this.curriculumLearningPath ="/relay/study/curriculumLearning"; //课程学习老师路由地址
      }else{
         this.$router.push("/login");
      }
     

    }
    
  },
  created() {
     //获取课程介绍内容
    get_course_description({
      courseId: "7c6684b1-b41c-467a-8706-8b5ebb31d3a0",
    })
      .then(res => {
        this.icon = res.data.object.icon;//将课程介绍内容绑定到页面相应位置
      })
      .catch(function(error) {
        console.log(error);
      });
    this.courseIntroductionToInit();
  },
};
</script>
<style  lang="less" scoped >
.el-menu{
background-color: rgb(35,38,41);
}
.el-menu-item{
  color: #fff;
  font-size:16px;
}
.box {
  margin-top: -1px;
  height: 100%;
  .row-bg {
    height: 100%;
    box-sizing: border-box;
    .left {
      position: relative;
      background-color: rgb(35,38,41);
      height: 98%;
      .Catalog-img {
        width: 100%;
        // height: 150px;
        img {
          width: 100%;
          // height: 150px;
        }
      }
      .top {
        text-align:center;
        height: 100%;
        display: flex;
        flex-direction: column;
        .el-menu{
          border: 1px solid rgb(35, 38, 41)
        }
        span {

          font-style: "微软雅黑";
          font-size: 16px;
        }
        .one {
          width: 100%;
          height: 10%;
          .introduce {
            padding-left: 35%;

          }
        }
        .two {
          width: 100%;
          height: 10%;
          .study {
            padding-left: 35%;
          }
        }
      }
      
    }
    .right {
      position: relative;
      height: 98%;
    }
  }
}
</style>

<style>
  .two .el-menu{
          border: 1px solid rgb(35, 38, 41)
        }
</style>


