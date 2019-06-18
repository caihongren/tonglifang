<template>
  <div style="margin-top:20px;padding:20px">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="序号" width="150" fixed type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="updatedAt" label="实验时间" width="500">
        <template slot-scope="scope">{{scope.row.updatedAt|dateformat}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="deletecls(scope.row.id)" :loading="false">删除</el-button>
          <el-button
            type="primary"
            @click="downloadProject(scope.row.id, $event)"
            :loading="false"
          >导出</el-button>
          <el-button type="info" @click="eacher(scope.row.simPath)">详情数据</el-button>
          <el-button type="primary" @click="goexperiment(scope.row.id)">打开快照</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="margin:50px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="length"
      ></el-pagination>
    </div>

    <!-- 弹出框 -->

    <div id="popupbox">
      <el-popover placement="top" width="800" height="500" style="z-index:999" v-model="visible2">
        <div style="margin:20px;padding:20px">
          <div>
            <div class="Fraction">
              <h2>实验快照统计</h2>
            </div>
            <div id="myChart2" :style="{width: '700px', height: '500px'}"></div>
          </div>
        </div>

        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
          <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button>
        </div>
      </el-popover>
    </div>

    <!-- <div class="popup">
    <div class="popupindex">

      <h2>sawdawdada d </h2>
    </div>
    
    </div>-->
  </div>
</template> 
<script>
import { snalist, snadel, project, tonumber } from "@/API/api.js";
import { log } from "util";
export default {
  data() {
    return {
      derivecls: [],
      updataclsid: "",
      update: false,
      add: true,
      classInline: {
        classother: "1"
      },
      centerDialogVisible: false,
      tableData: [],
      total: 5,
      limit: 10,
      currentPage4: 1,
      offset: 0,
      length: 10,
      // taskExperimentId: this.$route.params.id,
      id: this.$route.params.id,
      visible2: false,
      series: [],
      duration: "",
      stepLength: "",
      stepLengthlist: [],
      legend: []
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getListNew();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.offset = val * this.limit;
      this.getListNew();
    },
    // 打开详情
    eacher(path) {
      console.log("dianji ");
      let data = {};
// "http://192.168.2.223:8081/static/sim/a3c22184-b8de-4819-9f07-ec20a16866de.CreatorSim"
      this.$http
        .get(
          path
        )
        .then(res => {
          console.log(res.body);
          data = res.body.SimData;
          this.duration = res.body.duration;
          this.stepLength = res.body.stepLength;
          let one = (this.duration / this.stepLength).toFixed(4);
          let two = [];
          // console.log(one);
          for (let i = 0; i < this.stepLength; i++) {
            two[i] = one * i;
          }
          // console.log(two);
          this.stepLengthlist = two;
          // this.stepLengthlist.push(this.duration)
          for (var item in data) {
            console.log(item, data[item], "qq");
            this.series.push({
              name: data[item].Name,
              type: "line",
              data: data[item].data
            });
            this.legend.push(data[item].Name);
          }

          // console.log(this.series);
          // console.log(this.stepLengthlist);

          // this.sdawd = this.series[0];
          // console.log(this.sdawd);
          this.visible2 = true;
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById("myChart2"));
          // 绘制图表
          myChart.setOption({
            // title: { text: '在Vue中使用echarts' },
            tooltip: {},
            legend: {
              data: this.legend
            },
            xAxis: {
              type: "category",
              data: this.stepLengthlist
            },
            yAxis: {
              name: "",
              type: "value"
            },
            dataZoom: [
              {
                dataZoomIndex: 1,

                start: 0,
                end: 10
              },
              {
                type: "inside"
              }
            ],
            series: this.series
          });
        })
           .catch(() => {
          this.$message.error({
                showClose:true,
                message:'快照暂时无数据',
                type: 'warning',
                duration:1000,
              })
        });

    },
    // 进入快照
    goexperiment(id) {
      this.$emit("gounity", id);
    },
    // 定义函数
    showclass(offset, limit, tableData, total) {},
    // 分页功能
    currentPage_change(offset) {
      this.offset = offset;
      this.showclass(this.offset, this.limit, this.tableData, this.total);
    },
    // 删除快照
    deletecls(id) {
      this.$confirm("你确定要删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          snadel(id).then(res => {
            if (res.data.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.showclass(
                this.offset,
                this.limit,
                this.tableData,
                this.total
              );
            } else {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 导出快照
    downloadProject(id) {
      let el = event.currentTarget;
      // console.log('导出快照',el.loading)
      project({
        id: id
      }).then(res => {
        console.log(res, "导出快照", id);
        this.download(res.data.object.scenePath, res.data.object.updatedAt);
      });
    },
    // 序号
    indexMethod(index) {
      return index + 1 + this.offset * this.limit;
    },
    // 下载文件
    download(data, name) {
      // console.log(data,name)
      let src = data;
      // window.location.href = this.downloadSrc;
      // window.open(this.downloadSrc, '_blank'); // 新开窗口下载
      if (!src) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([src]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.target = "_Blank";
      link.href = url;
      // link.href = src;
      // 获取文件名
      // download 属性定义了下载链接的地址而不是跳转路径
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    },
    //  加载快照列表
    getListNew() {
      snalist({
        taskExperimentId: this.id,
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        console.log(res.data, "实验快照");
        this.length = res.data.length;
        if (res.data.object.length > 0) {
          // this.id = res.data.object[0].id;
          this.tableData = res.data.object;
          // this.length=res.data.length;
        }
      });
    }
  },
  created() {
    this.getListNew();
  }
};
</script>







<style lang="less" scoped>
.snabanner {
  width: 100%;
  height: 100px;
  line-height: 5px;
}
.el-table-column {
  text-align: center;
}
.popup {
  width: 100%;
  height: 100%;
  position: fixed;
  border: 1px solid red;
  border-radius: 10px;
  top: 0px;
  left: 0%;
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>

<style>
#popupbox .el-popover {
  top: 100px;
  left: 30%;
}
</style>



