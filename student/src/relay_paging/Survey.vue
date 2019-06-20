<template>
  <div class="relctive">
    <div class="AnnouncementManagement">公告管理</div>
    <el-table :data="tableData1" height="170" style="width: 30%" class="Notice">
      <el-table-column prop="index" label="任务编号" width="100%"></el-table-column>
      <el-table-column prop="content" label="内容" width="340%" height="30px"></el-table-column>
      <el-table-column prop="operation" label="操作" width="100%"></el-table-column>
    </el-table>
    <div class="UnfinishedTasks">未完成任务概览</div>
    <el-table :data="tableData" height="170" style="width: 39%" class="TaskTable">
      <el-table-column prop="index" label="任务编号" width="100%"></el-table-column>
      <el-table-column prop="date" label="任务名称" width="150%"></el-table-column>
      <el-table-column prop="name" label="下发范围" width="100%"></el-table-column>
      <el-table-column prop="address" label="下发时间" width="120%"></el-table-column>
      <el-table-column prop="number" label="提交人数" width="100%"></el-table-column>
      <el-table-column prop="details" label="详情" width="100%"></el-table-column>
    </el-table>

    <div class="cellspa">课程概况</div>

    <div class="frombox">
      <div style="margin: 20px;"></div>
      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
        <el-form-item label="课程名称:">
          <span>{{formLabelAlign.name}}</span>
        </el-form-item>
        <el-form-item label="任课教师:">
          <span>{{formLabelAlign.teacher}}</span>
        </el-form-item>
        <el-form-item label="课程学分:">
          <span>{{formLabelAlign.Fraction}}</span>
        </el-form-item>
        <el-form-item label="课程章节:">
          <span>{{formLabelAlign.chapter}}</span>
        </el-form-item>
        <el-form-item label="课程学时:">
          <span>{{formLabelAlign.hour}}</span>
        </el-form-item>
        <el-form-item label="教学要求:">
          <el-button type="primary" size="small" class="ml" @click="edit">编辑</el-button>
        </el-form-item>
        <div class="hideedit" v-if="show">
          <el-input
            type="textarea"
            :rows="10"
            placeholder="请输入内容"
            v-model="formLabelAlign.textarea1"
            @blur="lose"
            ref="input1"
          ></el-input>
        </div>
        <div class="inputbox">{{formLabelAlign.textarea1}}</div>
      </el-form>
    </div>

    <button class="download">Creator下载</button>

    <div id="visual">
      <div>
        <div id="myChart1" :style="{width: '300px', height: '300px'}"></div>
        <div class="Fraction">各班平均成绩</div>
      </div>

      <div class="marginbox">
        <div id="myChartzhe1" :style="{width: '300px', height: '300px'}"></div>
        <div class="distribution">各班在线时长</div>
      </div>
      <div>
        <div id="myChartzhe2" :style="{width: '300px', height: '300px'}"></div>
        <div class="achievement">各班报告提交率</div>
      </div>
      <div>
        <div id="myChart2" :style="{width: '300px', height: '300px'}"></div>
        <div class="Fraction">实验资源统计</div>
      </div>

      <div class="marginbox">
        <div id="myChart3" :style="{width: '300px', height: '300px'}"></div>
        <div class="distribution">元件资源统计</div>
      </div>
      <div>
        <div id="myChart4" :style="{width: '300px', height: '300px'}"></div>
        <div class="achievement">文档资源统计</div>
      </div>
    </div>

    <footer>
      <div>当前在线人数：45</div>
    </footer>
  </div>
</template>

<script>
import {curlist,login} from "../API/api"
export default {
  data() {
    return {
      id:'',
      course:'',
      labelPosition: "right",
      show:false,
      formLabelAlign: {
        name: "继电保护",
        teacher: "赵老师",
        Fraction: "5",
        chapter: "30",
        hour: "40",
        textarea1: "点击编辑按钮对此内容进行编辑"
      },
      loginUser: {
        phone: "54321678910",
        password: "123456",
        role:'teacher'
      },

      tableData: [
        {
          index: 1,
          date: "机电基础操作",
          name: "二班",
          address: "2018-05-05",
          number: "50/60"
        }
      ],
      tableData1: [
        {
          index: 1,
          content: "一二三四五六七八九十",
          operation: "详情"
        }
      ]
    };
  },
  methods: {
    //编辑按钮的点击时间
    edit() {
      this.show=!this.show,
      this.formLabelAlign.textarea1=this.formLabelAlign.textarea1
    },
    // 失去焦点事件
    lose(){
      this.show=false;
    },
    drawLine1() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart1"));
      // 绘制图表
      myChart.setOption({
        // title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          data: ["一班", "二班", "三班", "四班"]
        },
        yAxis: {},
        series: [
          {
            name: "分数",
            type: "bar",
            data: [70, 90, 55, 100]
          }
        ]
      });
    },
    drawLinezhe1() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChartzhe1"));
      // 绘制图表
      myChart.setOption({
        // title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          type: "category",
          data: [
            "40以下",
            "40-50",
            "50-60",
            "60-70",
            "70-80",
            "80-90",
            "90-100"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          },
          {
            data: [123, 423, 533, 123, 545, 655, 876],
            type: "line"
          },
          {
            data: [76, 231, 343, 543, 545, 222, 666],
            type: "line"
          }
        ]
      });
    },
    drawLinezhe2() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChartzhe2"));
      // 绘制图表
      myChart.setOption({
        // title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          type: "category",
          data: [
            "40以下",
            "40-50",
            "50-60",
            "60-70",
            "70-80",
            "80-90",
            "90-100"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          },
          {
            data: [123, 423, 533, 123, 545, 655, 876],
            type: "line"
          },
          {
            data: [76, 231, 343, 543, 545, 222, 666],
            type: "line"
          }
        ]
      });
    },
    drawLine2() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart2"));
      // 绘制图表
      myChart.setOption({
        // title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          data: ["一班", "二班", "三班", "四班"]
        },
        yAxis: {},
        series: [
          {
            name: "分数",
            type: "bar",
            data: [70, 20, 55, 100]
          }
        ]
      });
    },
    drawLine3() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart3"));
      // 绘制图表
      myChart.setOption({
        // title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          data: ["一班", "二班", "三班", "四班"]
        },
        yAxis: {},
        series: [
          {
            name: "分数",
            type: "bar",
            data: [70, 20, 55, 100]
          }
        ]
      });
    },
    drawLine4() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart4"));
      // 绘制图表
      myChart.setOption({
        // title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          data: ["一班", "二班", "三班", "四班"]
        },
        yAxis: {},
        series: [
          {
            name: "分数",
            type: "bar",
            data: [70, 20, 55, 100]
          }
        ]
      });
    }
  },
  mounted() {
    this.drawLine4();
    this.drawLine3();
    this.drawLine2();
    this.drawLinezhe2();
    this.drawLinezhe1();
    this.drawLine1();
  },

  //创建前设置增加滚动条
  beforeCreate() {
    document
      .querySelector("body")
      .setAttribute("style", "overflow-y:hidden;background-color:#fff	");
    // document.querySelector('body').setAttribute('style', 'background-color:#ccc')
  },
  //销毁前清除滚动
  created() {
    curlist().then(res=>{
      this.course=res.data.object
    })
    
  },
  beforeDestroy() {
    document
      .querySelector("body")
      .removeAttribute("style", "overflow-y:scroll;");
  }
};
</script>

<style lang="less" scoped>
@media screen and (min-width: 1100px) and (max-width: 1500px) {
  .relctive {
    width: 1200px;
    position: relative;
  }
  .Fraction,
  .distribution,
  .achievement {
    margin-left: 50px;
  }
}
@media screen and (min-width: 1500px) and (max-width: 1800px) {
  .relctive {
    width: 1500px;
    position: relative;
  }
  .Fraction,
  .distribution,
  .achievement {
    margin-left: 30px;
    position: absolute;
    top: -20px;
  }
}
@media screen and (min-width: 1800px) {
  .relctive {
    width: 1800px;
    position: relative;
  }
  .Fraction,
  .distribution,
  .achievement {
    margin-left: 10px;
  }
}

.cellspa {
  width: 20%;
  height: 60px;
  line-height: 60px;
  color: #0c83d3;
  background-color: #f6f6f6;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3px;
  display: inline-block;
}

//可视化数据
#visual {
  width: 80%;
  position: absolute;
  top: 0;
  left: 22%;
  > div {
    display: inline-block;
    position: relative;
    width: 20%;
    top: 0px;
    left: 0;
    margin-left: 10px;
  }

  .Fraction,
  .distribution,
  .achievement {
    width: 100%;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 16px;
    color: #171717;
    position: absolute;
    top: 0px;
  }
  .marginbox {
    margin: 0 15%;
  }
  #myChart1,
  #myChartzhe1,
  #myChartzhe2,
  #myChart2,
  #myChart3,
  #myChart4 {
    top: -30px;
  }
}
// .el-table__body-wrapper{

// }

//表单
.frombox {
  width: 20%;
  border: 1px solid #f6f6f6;
  color: #000;
}
.frombox input {
  font-size: 14px;
}
.el-input__inner {
  background-color: transparent;
}
.ml {
  margin-left: 74%;
}
.download {
  width: 12%;
  height: 50px;
  margin: -15px 70px;
  background-color: #ff9900;
  margin-top: 10px;
}
.hideedit{
  width: 220px;
  position: absolute;
  top: 330px;
  left: 20%;
  z-index: 2
}

// 公告栏
.AnnouncementManagement,
.UnfinishedTasks {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 700;
  border: 1px solid #ccc;
  text-align: center;
  background-color: #f9f9f9;
  position: absolute;
  color: #000;
  top: 540px;
}
.AnnouncementManagement {
  width: 30%;
  left: 24%;
}

.UnfinishedTasks {
  width: 37%;
  left: 62%;
}
.TaskTable {
  position: absolute;
  top: 580px;
  left: 62%;
  z-index: 99;
}
.Notice {
  position: absolute;
  top: 580px;
  left: 24%;
  z-index: 99;
}
.inputbox {
  width: 100%;
  height: 200px;
}
.el-table::before {
  height: 0;
}

// 底部
footer {
  width: 100%;
  height: 50px;
  background-color: #545c64;
  margin: 0 auto;
  margin-top: 60px;
  div {
    float: right;
    height: 50px;
    line-height: 50px;
    margin-right: 20px;
    color: #fff;
  }
}
</style>
