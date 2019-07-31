<template>
  <div class="OverallSituation">
    <div class="eee">
      <el-table :data="tableData" border style="width: 73%" height="260px" :header-cell-style="{background:'#dddddd'}" stripe>
        <el-table-column prop="index" label="序号" type="index"></el-table-column>
        <el-table-column prop="student" label="学生" min-width="80"></el-table-column>
        <el-table-column prop="achievement" label="平均成绩" min-width="80"></el-table-column>
        <el-table-column prop="avgTime" label="平均时间" min-width="80"></el-table-column>
        <el-table-column prop="onlineTime" label="在线时长" min-width="50"></el-table-column>
      </el-table>
    </div>
    <div class="center">任务：
      <el-select v-model="renwuSelectvalue" placeholder="请选择" @change="timeDataChange()">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div id="myCharts" :style="{width: '70%', height: '60%'}" class="myCharts"></div>
  </div>
</template>

<script>
import {
  getclass, //老师获取课程下的学生
  master,//任务
} from "../API/api";
export default {
  data() {
    return {
      student: [],
      currentPage4: 1,
      tableData: [],
      options: [],
      renwuSelectvalue: '',
      timeDataNow: []
    }
  },
  methods: {
    initecharts() {
      //基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('myCharts'));

      // 绘制图表
      myChart.setOption({
        title: {
          text: '学生学习情况统计'
        },
        tooltip: {},
        xAxis: {
          data: this.student
        },
        yAxis: {},
        series: [{
          name: '平均时间',
          type: 'bar',
          data: this.timeDataNow
        }]
      });
    },
    initData() {
      let course = JSON.parse(sessionStorage.getItem("course"));
      this.courseId = course.id;
      getclass({
        courseId: this.courseId
      }).then(res => {
        this.tableData = [];
        this.student = [];
        this.timeDataNow = [];
        for (var i = 0; i < res.data.object.length; i++) {
          for (var j = 0; j < res.data.object[i].accounts.length; j++) {
            var chengji = 50 + Math.round(Math.random() * 50);
            var shijian = 1 + Math.round(Math.random() * 20);
            var shichang = 1 + Math.round(Math.random() * 20)
            this.tableData.push({
              student: res.data.object[i].accounts[j].name,
              achievement: chengji + '分',
              avgTime: shijian + '小时',
              onlineTime: shichang + '小时'
            });
            this.student.push(res.data.object[i].accounts[j].name);
            this.timeDataNow.push(shijian);
          }
        }
        this.initecharts();
      });
    },
    timeDataChange() {
      this.initData();
    },
    master() {
      master({
        offset: 0,
        limit: 10
      }).then(res => {
        this.options = [];
        for (var i = 0; i < res.data.object.length; i++) {
          this.options.push({
            value: res.data.object[i].id,
            label: res.data.object[i].name
          });
        }
        if (res.data.object.length > 0) {
          this.renwuSelectvalue = res.data.object[0].id;
        }
      });
    }
  },
  mounted() {

  },
  created() {
    this.master();
    this.initData();
  },
}
</script>
<style lang="less" scoped>
.OverallSituation {
  width: 100%;
  height: 100%;
  overflow: auto;
  .eee {
    text-align: center;
    margin: -0.5px;
    margin-left: 20%;
    width: 80%;
  }
  .center {
    margin-left: 20%;
    margin-top: 1%;
  }
  .myCharts {
    margin-top: 1;
    margin-left: 13%;
  }
}
</style>
