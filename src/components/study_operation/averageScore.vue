<template>
  <div class="OverallSituation">
    <el-card class="box-card">
      <div slot="header">
        <span>班级名称</span>
      </div>
      <el-menu :default-active="String(classindex)" class="el-menu-vertical-demo">
        <el-menu-item v-bind:index="String(index+1)" v-for="(item,index) in classAll" :key="item.id" @click="classId=item.id, getStudent(item.id)">
          <div :title="item.name">{{item.name}}</div>
        </el-menu-item>
      </el-menu>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <span>任务名称</span>
      </div>
      <el-menu :default-active="String(taskindex)" class="el-menu-vertical-demo">
        <el-menu-item v-bind:index="String(index+1)" v-for="(item,index) in taskAll" :key="item.id" @click=" taskId=item.id,getStudent(item.id)">
          <div :title="item.name">{{item.name}}</div>
        </el-menu-item>
      </el-menu>
    </el-card>
    <div class="surface">
      <div class="task">
        <el-table :data="tableData" class="Arrow" border :header-cell-style="{background:'#ebeffb'}" stripe>
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column prop="accountName" label="学生" min-width="40"></el-table-column>
          <el-table-column prop="score" label="成绩" min-width="30"></el-table-column>
          <!-- <el-table-column prop="completed" label="完成进度" min-width="40"></el-table-column>
          <el-table-column prop="onlineTime" label="在线时长" min-width="50"></el-table-column> -->
        </el-table>
      </div>
      <div id="myCharts" class="myCharts"></div>
    </div>
  </div>
</template>

<script>
import {
  getclass, //教师获取课程下的学生
  master, //任务列表
  get_class_by_teacher, //班级列表
  get_grade
} from "../../API/api";
export default {
  data() {
    return {
      courseId: "", //课程id
      classAll: [], //所有班级列表
      taskAll: [], //所有任务列表
      classindex: "1", //默认选中第一个
      taskindex: "1",
      classId: "", //选中的课程或者任务id
      taskId: "",
      tableData: [], //所有学生列表
      student: [], //图表中学生名字
      timeDataNow: [] //图标中学生在线时长
    };
  },
  methods: {
    //获取所有班级列表
    getClass() {
      let course = JSON.parse(sessionStorage.getItem("course"));

      this.courseId = course.id;
      get_class_by_teacher({
        courseId: this.courseId
      }).then(res => {
        this.classAll = res.data.object;
        this.classId = res.data.object[0].id;
        this.getStudent();
      });
    },

    // 获取任务列表
    getTask() {
      master({
        offset: 0,
        limit: 10000
      }).then(res => {
        //调用接口获取所有任务列表
        this.taskAll = res.data.object;
        this.taskId = res.data.object[0].id;
        this.getStudent();
      });
    },
    // 根据任务id获取所有学生列表
    getStudent(id) {
      if (this.classId == "" || this.taskId == "") {
        return;
      }
      get_grade({
        classId: this.classId,
        taskExperimentId: this.taskId
      }).then(res => {
        this.student = [];
        this.timeDataNow = [];
        this.tableData = res.data.object;
        for (let i = 0; i < res.data.object.length; i++) {
          let item = res.data.object[i];
          this.student.push(item.accountName);
          if (item.score == null || item.score == "") {
            item.score = 0;
          }
          if (item.completed) {
            item.completed = '完成'
          } else {
            item.completed = '未完成'
          }
          this.timeDataNow.push(item.score);
        }
        this.initecharts(); //初始化图标对象
      });
    },
    initecharts() {
      //基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("myCharts"));

      // 绘制图表
      myChart.setOption({
        title: {
          text: ""
        },
        tooltip: {},
        xAxis: {
          data: this.student
        },
        yAxis: {},
        series: [
          {
            name: "平均成绩",
            type: "bar",
            data: this.timeDataNow
          }
        ]
      });
      window.onresize = myChart.resize;
    }
  },
  mounted() { },
  created() {
    this.getClass(); //获取所有班级
    this.getTask(); //获取所用任务
  }
};
</script>
<style lang="less" scoped>
.OverallSituation {
  width: 101%;
  height: 100%;
  overflow: auto;
  .box-card {
    width: 180px;
    height: 95%;
    float: left;
    margin-left: 20px;
    margin-top: 20px;
  }

  .surface {
    background-color: #fff;
    height: 95%;
    margin-left: 415px;
    margin-right: 20px;
    width: calc(100% - 452px);
    .task {
      margin-top: 20px;
      margin-bottom: 5px;

      padding: 10px 120px;
      width: calc(100% - 20px);
      .Arrow {
        width: 100%;
        height: 260px;
      }
    }
    .myCharts {
      margin-left: 20px;
      width: calc(100% - 20px);
      height: 65%;
    }
  }
}
</style>
<style lang="less" >
.el-card__body {
  overflow: auto;
  height: 90%;
  width: 105%;
}
.OverallSituation .el-menu {
  border: 0px solid red;
  li {
    line-height: 35px;
    height: 35px;
    padding: 0px !important;

    div {
      white-space: nowrap;
      width: 160px;
      height: 30px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>

