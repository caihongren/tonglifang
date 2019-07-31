<template>
  <div class="populationgroup">
    <div class="box" :style="{height:isshowheight?'100%':'0px'}" v-show="isshowheight">
      <!-- 已经下发的任务 -->
      <div style="border:1px solid #ccc;margin:10px; border-radius: 10px; padding:5px;" class="population-top">
        <el-row :gutter="20">
          <el-col :span="3" :offset="1">
            <div class="grid-content bg-purple">
              <h2>已下发的任务</h2>
            </div>
          </el-col>
          <el-col :span="4" :offset="15">
            <div class="grid-content bg-purple-light" style="padding-top:12px">
              <el-button type="primary" @click="goadd">新增任务</el-button>
            </div>
          </el-col>
        </el-row>
        <template>
          <el-table :data="tableDatafalse" border :default-sort="{prop:'startTime', order: 'descending'}" style="width: 100%">
            <el-table-column fixed label="序号" type="index" min-width="20"></el-table-column>
            <el-table-column prop="startTime" label="下发日期" sortable :formatter="formatSex" min-width="100"></el-table-column>
            <el-table-column prop="name" sortable label="任务名称" min-width="100"></el-table-column>
            <el-table-column prop="finishTime" label="截止时间" :formatter="finishTime" min-width="100"></el-table-column>
            <el-table-column prop="total" label="下发总人数" min-width="50"></el-table-column>
            <el-table-column prop="complete" label="已提交报告人数" min-width="50"></el-table-column>
            <el-table-column label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="readOver(scope.row)" type="text" size="small">批阅</el-button>
                <el-button @click="stop(scope.row.id)" type="text" size="small">停止</el-button>
                <el-button @click="details(scope.row) ,isshowheight=false" type="text" size="small">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div style="margin:50px;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
        </div>

      </div>

      <!-- 已经完成的任务 -->
      <div style="border:1px solid #ccc;margin:10px; border-radius: 10px; padding:5px;">
        <el-row :gutter="20">
          <el-col :span="3" :offset="1">
            <div class="grid-content bg-purple">
              <h2>已完成的任务</h2>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light" style="padding-top:12px"></div>
          </el-col>
        </el-row>
        <template>
          <el-table :data="tableDatatrue" border style="width: 100%" :default-sort="{prop:'startTime', order: 'descending'}">
            <el-table-column fixed label="序号" type="index" min-width="20"></el-table-column>
            <el-table-column prop="startTime" label="下发日期" sortable :formatter="formatSex" min-width="100"></el-table-column>
            <el-table-column prop="name" sortable label="任务名称" min-width="100"></el-table-column>
            <el-table-column prop="finishTime" label="截止时间" :formatter="finishTime" min-width="100"></el-table-column>
            <el-table-column prop="total" label="下发总人数" min-width="50"></el-table-column>
            <el-table-column prop="complete" label="已提交报告人数" min-width="50"></el-table-column>
            <el-table-column label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="readOver(scope.row)" type="text" size="small">批阅</el-button>
                <el-button @click="deleteTask(scope.row.id)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div style="margin:50px;">
          <el-pagination @size-change="newhandleSizeChange" @current-change="newhandleCurrentChange" :current-page="newcurrentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="newlength"></el-pagination>
        </div>
      </div>

    </div>
    <!-- 弹出层 -->
    <el-dialog width="90%" title="场景文件" top="10vh" :visible.sync="innerVisible" append-to-body>
      <div style="height:600px">
        <Unity3D v-bind:tasks="tasks"></Unity3D>
      </div>
    </el-dialog>

    <el-dialog width="90%" title="指导文件" top="5vh" :visible.sync="innerVisibleNew" append-to-body>
      <div style="height:800px">
        <Examine ref="child" v-if="!innerVisibleNew"></Examine>
      </div>
    </el-dialog>
    <el-dialog width="90%" title="新增任务" top="10vh" :visible.sync="innerVisibleadd" append-to-body>
      <div style="height:40vh">
        <Editor if="innerVisibleadd" @taskissue="taskissue" v-if="innerVisibleadd"></Editor>
      </div>

    </el-dialog>
    <div style="width:94%;" :style="{height:!isshowheight?'100%':'0px'}">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <a @click="isshowheight=!isshowheight,isadd=!isadd">
              <h2>实验任务详情</h2>
            </a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <a>
              <h2>{{name}}</h2>
            </a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <newExperimentalTemplate v-if="!isshowheight" v-bind:isshow="isshow" v-bind:row="row" @detpage="detpage"></newExperimentalTemplate>
    </div>
  </div>
</template>
<script>
import {
  master,// 任务列表
  formatDate,// 时间格式转换
  deletedaTask,// 删除任务
  stopTask,// 停止任务
  getResource_by_id,// 根据资源id获取属性
} from "@/API/api";
import Unity3D from "./uity3D";
import FileSaver from "file-saver";
import Examine from "../views/Examine";
import Editor from "./tasks/Editor";
import newExperimentalTemplate from "./newExperimentalTemplate";
export default {
  name: "taskManagement",
  data() {
    return {
      name: "",
      isadd: false,
      isshow: {
        type: false,
        addtype: false,
        vall: false,
        look: false,
        deletebutton: false,
      },
      isshowheight: true, //子组件的页面打开
      row: {},
      offset: 0,
      limit: 10,
      length: 0,
      currentPage: 1,
      newoffset: 0,
      newlimit: 10,
      newlength: 0,
      newcurrentPage: 1,
      innerVisible: false,
      innerVisibleNew: false,
      innerVisibleadd: false,
      ChangeFlageEdit: false,
      tableDataOK: [],
      tableDatatrue: [],

      tableDatafalse: [],
      tasks: {
        id: "",
        name: "",
        path: "",
        type: ""
      }
    };
  },
  components: {
    Unity3D,
    Examine,
    Editor,
    newExperimentalTemplate
  },

  methods: {
    // 关闭详情页面
    detpage() {
      this.isshowheight = !this.isshowheight;
      this.innerVisible = false;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.masters();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.masters();
    },
    newhandleSizeChange(val) {
      this.newlimit = val;
      this.newmasters();
    },
    newhandleCurrentChange(val) {
      this.newoffset = (val - 1) * this.limit;
      this.newmasters();
    },
    // 到详情页面
    handleClick(id) {
      getResource_by_id({
        id: id
      })
        .then(res => {
          if (res.data.code == "0") {
            this.innerVisibleNew = true;
            this.goExamine(res.data.object.name, res.data.object.path);
            this.$refs.child.gopdf();
          } else {
            this.$message.error({
              message: "该资源不存在"
            });
          }
        })
        .catch(() => { });
    },
    // 根据id获取资源详细信息
    getResources(id) {
      getResource_by_id({
        id: id
      })
        .then(res => {
          this.download(res.data.object.path, res.data.object.name);
        })
        .catch(() => {
          this.$message.error({
            showClose: true,
            message: "该资源不存在",
            type: "warning"
          });
        });
    },
    // 下载文件
    download(src, name) {
      download({
        name: "你好.docx",
        url: "http://192.168.2.223:8080/course/static/icon/123.docx",
      }).then(res => {
        const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "你好.docx");
      })
    },
    // 到场景文件详情页
    go3D(id) {
      this.tasks.id = id;
      this.innerVisible = true;
    },
    formatSex(row) {
      //  return row.updatedAt
      return formatDate(row.startTime);
    },
    finishTime(row) {
      return formatDate(row.finishTime);
    },
    goadd() {
      // this.$router.push("/task/Editor");
      this.innerVisibleadd = true;
    },
    // 停止任务
    stop(id) {
      this.$confirm("此操作将停止该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          stopTask({
            taskExperimentId: id
          }).then(res => {
            if (res.data.code == "0") {
              this.$message({
                message: "停止成功",
                type: "success"
              });
              this.masters();
              this.newmasters();
            } else {
              this.$message({
                type: "info",
                message: "停止错误"
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
    // 批改
    readOver(row) {
      console.log(row)
      this.$router.push({
        path: "/task/Presentationteacher",
        query: {
          id: row.id,
          name: row.name,
          startTime: row.startTime,
          finishTime: row.finishTime,
          total: row.total,
          complete: row.complete,
        }
      });
    },
    //详情
    details(row) {
      this.isshowheight = false;
      this.name = row.name;
      this.row = row;
      this.isshow.deletebutton = false;
      this.isshow.type = false;
      this.isadd = true;
      this.isshow.addtype = false;
      this.isshow.vall = true; //文本域只读
      this.isshow.look = true;

    },
    // 删除任务
    deleteTask(id) {
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletedaTask({
            taskExperimentId: id
          }).then(res => {
            if (res.data.code == "0") {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.newmasters();
            } else {
              this.$message({
                type: "info",
                message: "删除错误"
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
    // 任务下发
    taskissue() {
      this.innerVisibleadd = false;
      this.masters();
    },
    // 加载列表
    masters() {
      master({
        offset: this.offset,
        limit: this.limit,
        completed: false
      }).then(res => {
        this.tableDatafalse = res.data.object;
        this.length = res.data.length;
      });
    },
    // 完成的列表
    newmasters() {
      master({
        offset: this.offset,
        limit: this.limit,
        completed: true
      }).then(res => {
        this.tableDatatrue = res.data.object;
        this.newlength = res.data.length;
      });


    },
    goExamine(name, path) {
      let examine = {};
      examine.sourcePath = this.$route.path;
      examine.name = name;
      examine.path = path;
      sessionStorage.setItem("examine", JSON.stringify(examine));
      let user = JSON.parse(sessionStorage.getItem("user"));
      // if (user.role == "teacher") {
      //   this.$router.push("/relayteacher/Examine");
      // } else if (user.role == "student") {
      //   this.$router.push("/relay/Examine");
      // } else {
      // }
    }
  },
  mounted() { },
  created() {
    this.masters();
    this.newmasters();
  }
  // 创建前设置增加滚动条
  // beforeCreate() {
  //   document
  //     .querySelector("body")
  //     .removeAttribute("style", "overflow-y:hidden ;");
  //   document
  //     .querySelector("body")
  //     .setAttribute("style", "overflow-y:scroll ;background-color:#EEE9E9	");
  //   // document.querySelector('body').setAttribute('style', 'background-color:#ccc')
  // },
  // 销毁前清除滚动
  // beforeDestroy() {
  //   document
  //     .querySelector("body")
  //     .removeAttribute("style", "overflow-y:scroll !important;");
  // }
};
</script>

<style lang="less" scoped>
.populationgroup {
  height: 95%;
  width: 80%;
  border: 1px solid #dddddd;
  margin: 0 10%;
  overflow: hidden;
  .box {
    height: 96vh;
    width: 102%;
    overflow: auto;
    transition: 0s;
    .population-top {
      position: relative;
      margin-bottom: 100px;
    }
  }
}

.breadcrumb {
  width: 80%;
  height: 50px;
  margin: 0 3%;
  font-size: 20px;
}
</style>
