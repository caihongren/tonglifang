<template>
  <div class="box study_student">
    <!-- 目录 -->
    <el-row type="flex" class="row-bg">
      <el-col :span="3" class="row-left">
        <div class="left">
          <div class="top">
            <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
              background-color="#313131"
              text-color="#fff"
              active-text-color="#ffd04b"
              router
            >
           
              <el-menu-item :index="courseIntroductionPath">
                <span slot="title" class="icon iconfont introduce">&#xe501; 课程介绍</span>
              </el-menu-item>
              <el-menu-item :index="trainingCourse" v-show="isshow">
                <span slot="title" class="icon iconfont introduce">&#xe622; 课程实训</span>
              </el-menu-item>
              <el-menu-item :index="studentTrainingCourse" v-show="isstudent">
                <span slot="title" class="icon iconfont introduce">&#xe622; 课程实训</span>
              </el-menu-item>
              <el-menu-item :index="myTraining" v-show="isshow">
                <span slot="title" class="icon iconfont introduce">&#xe538; 我的实训</span>
              </el-menu-item>
              <el-menu-item :index="myHomework" v-show="isstudent">
                <span slot="title" class="icon iconfont introduce">&#xe63f; 我的作业</span>
              </el-menu-item>
              <el-menu-item :index="averageScore" v-show="isshow">
                <span slot="title" class="icon iconfont introduce">&#xe734; 平均成绩</span>
              </el-menu-item>
              <!-- <el-menu-item :index="experimentDetails">
                <span slot="title" class="icon iconfont introduce">&#xe734; 教练考模式</span>
              </el-menu-item>-->

              <!-- <a download="下载.zip" href="http://cloud.icubespace.com/creator/download_file/PLCfangzhenruanjian.zip">
                <button>dawdadw</button>
              </a>-->
            </el-menu>
          </div>
        </div>
      </el-col>
      <el-col :span="21" style="background-color:#f1f1f1; width:100%">
        <div class="right">
          <router-view @threadPoxi="threadPoxi"  @yuangounity="yuangounity"></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { get_course_description } from "@/API/api";
export default {
  name: "study",
  data() {
    return {
      isshow: "true",
      icon: "",
      courseIntroductionPath: "", //课程介绍路由路径
      curriculumLearningPath: "", //课程学习路由路径
      trainingCourse: "", //学生端课程实训
      myTraining: "", //我的实训
      myHomework: "", //我的作业
      experimentDetails: "", //教考练
      studentTrainingCourse: "", //学生端课程实训
      averageScore: "", //平均成绩路由路径
      isstudent: "true"
    };
  },
  methods: {
    // 三维传值
    threadPoxi(row) {
      this.$emit("threadPoxi", row);
    },
    // 元件库传值
    yuangounity(row){
        this.$emit("yuangounity", row);
    },
    //判断教师还是学生
    courseIntroductionToInit() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      if (user.role == "teacher") {
        this.isstudent = false;
        this.trainingCourse = "/relayteacher/study/trainingCourse";
        this.myTraining = "/relayteacher/study/myTraining";
        this.experimentDetails = "/relayteacher/study/experimentDetails";
        this.courseIntroductionPath = "/relayteacher/study/courseIntroduction"; //课程介绍教师路由地址
        this.averageScore = "/relayteacher/study/averageScore"; //课程学习教师路由地址
      } else if (user.role == "student") {
        this.isshow = false;
        this.myHomework = "/relay/study/myHomework";
        this.experimentDetails = "/relay/study/experimentDetails";
        this.courseIntroductionPath = "/relay/study/courseIntroduction"; //课程介绍学生路由地址
        this.studentTrainingCourse = "/relay/study/studentTrainingCourse";
      } else {
        this.$router.push("/login");
      }
    }
  },
  created() {
    //获取课程介绍内容
    let course = JSON.parse(sessionStorage.getItem("course"));
    // console.log(course);
    get_course_description({
      courseId: course.id
    }).then(res => {
      // console.log(res, "888");
      this.icon = res.data.object.icon; //将课程概述内容绑定到页面相应位置
    });
    this.courseIntroductionToInit();
  }
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
      height: 100%;
      .left {
        position: relative;
        height: 100%;
        .top {
          background-color: #313131;
          text-align: center;
          height: 100%;
          display: flex;
          flex-direction: column;
          .introduce {
            font-family: "Microsoft YaHei";
            font-size: 18px;
            text-align: center;
          }
        }
      }
    }
    .right {
      background-color: #f1f1f1;
      position: relative;
      height: 100%;
      width: 100%;
    }
  }
}
</style>

<style lang="less" >
 

   .study_student .el-button--text {
  font-size: 16px;
  color:#9b9b9b
}
 .study_student .el-button--text :hover {
  color:#409EFF;
}
</style>



