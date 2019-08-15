<template>
  <div class="box">
    <!-- 目录 -->
    <el-row type="flex" class="row-bg">
      <el-col :span="3" class="row-left">
        <div class="left">
          <div class="top">
            <el-menu default-active="1" class="el-menu-vertical-demo" background-color="#313131" text-color="#fff" active-text-color="#ffd04b" router>
              <el-menu-item :index="courseIntroductionPath">
                <span slot="title" class="icon iconfont introduce">&#xe501;　课程介绍</span>
              </el-menu-item>
              <el-menu-item :index="curriculumLearningPath">
                <span slot="title" class="icon iconfont introduce">&#xe622;　课程资源</span>
              </el-menu-item>
              <el-menu-item :index="averageScore" v-show='isshow'>
                <span slot="title" class="icon iconfont introduce">&#xe734;　平均成绩</span>
              </el-menu-item>
              <!-- <a download="下载.zip" href="http://cloud.icubespace.com/creator/download_file/PLCfangzhenruanjian.zip">
                <button>dawdadw</button>
              </a> -->
            </el-menu>
          </div>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="right">
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { get_course_description } from "@/API/api";
export default {
  data() {
    return {
      isshow: 'true',
      icon: "",
      courseIntroductionPath: "",//课程介绍路由路径
      curriculumLearningPath: "",//课程学习路由路径
      averageScore: "",//平均成绩路由路径
      isstudent: true,
    }
  },
  methods: {
    //判断教师还是学生
    courseIntroductionToInit() {

      let user = JSON.parse(sessionStorage.getItem("user"))
      if (user.role == "teacher") {
        this.curriculumLearning = false;
        this.courseIntroductionPath = "/relayteacher/study/courseIntroduction";//课程介绍教师路由地址
        this.curriculumLearningPath = "/relayteacher/study/curriculumLearning";//课程学习教师路由地址
        this.averageScore = "/relayteacher/study/averageScore";//课程学习教师路由地址
      } else if (user.role == "student") {
        this.isshow = false;
        this.curriculumLearning = true;
        this.isstudent = false
        this.courseIntroductionPath = "/relay/study/courseIntroduction";//课程介绍学生路由地址
        this.curriculumLearningPath = "/relay/study/curriculumLearning"; //课程学习教师路由地址
      } else {
        this.$router.push("/login");
      }
    }
  },
  created() {
    //获取课程介绍内容
    let course = JSON.parse(sessionStorage.getItem("course"));
    get_course_description({
      courseId: course.id,
    })
      .then(res => {
        this.icon = res.data.object.icon;//将课程介绍内容绑定到页面相应位置
      })
    this.courseIntroductionToInit();
  },
};
</script>
<style  lang="less" scoped >
.el-menu-vertical-demo {
  margin-top: 18px;
}

.box {
  height: 100%;
  width: 100%;
  .row-bg {
    height: 100%;
    width: 100%;
    .row-left {
      min-width: 250px;
      .left {
        position: relative;
        height: 98%;
        .top {
          background-color: #313131;
          text-align: center;
          height: 100%;
          display: flex;
          flex-direction: column;
          .introduce {
            font-style: "微软雅黑";
            font-size: 18px;
            text-align: center;
          }
        }
      }
    }
    .right {
      background-color: #f1f1f1;
      position: relative;
      height: 98.2%;
      width: 100%;
    }
  }
}
</style>



