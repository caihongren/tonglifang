<template>
  <div class="box">
    <router-link to="/task/DetailedList">
      <el-button type="primary" round style="margin:20px 20px 0 0">已下发任务清单</el-button>
    </router-link>
    <router-link to="/task/Editor">
      <el-button type="primary" round style="margin:20px 20px 0 0">下发任务</el-button>
    </router-link>
     <router-link to="/task/Addtask">
      <el-button type="primary" round>实验模板</el-button>
    </router-link>

    <!--eachers数据可视化  -->
    <div id="visual">
      <div>
        <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
        <div class="Fraction">各任务平均分数</div>
      </div>

      <div class="marginbox">
        <div id="myChartzhe" :style="{width: '300px', height: '300px'}"></div>
        <div class="distribution">各分数段人数分布</div>
      </div>
      <div>
        <div id="myChartzhe2" :style="{width: '300px', height: '300px'}"></div>
        <div class="achievement">各班平均成绩</div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
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
    drawLinezhe() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChartzhe"));
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
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  mounted() {
    this.drawLinezhe2();
    this.drawLinezhe();
    this.drawLine();
  },
    //创建前设置增加滚动条
beforeCreate () {
      document.querySelector('body').setAttribute('style', 'overflow-y:scroll;background-color:#EEE9E9	')
      // document.querySelector('body').setAttribute('style', 'background-color:#ccc')
},
//销毁前清除滚动
beforeDestroy () {
      document.querySelector('body').removeAttribute('style', 'overflow-y:scroll;')
},
};
</script>

<style lang="less" scoped>

@media screen and (min-width:1100px) and (max-width:1500px){
  .marginbox {margin: 0 11%;}

}
@media screen and (min-width:1500px) and (max-width:1800px){
  .marginbox {margin: 0 18%;}

}
@media screen and (min-width:1800px){
  .marginbox {margin: 0 22%;}

}
.box{
  width: 90%;
  margin: 5px 5%;
}

#visual {
  > div {
    display: inline-block;
    position: relative;
    top: 0px;
    left: 0;
    margin-bottom: 30px;
  }

  .Fraction,
  .distribution,
  .achievement {
    width: 300px;
    height: 20px;
    line-height: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
    font-size: 8px;
  }
  
}


</style>
