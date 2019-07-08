<template>
  <div style="height:100%;overflow: auto;">
    <div class="box">
      <!-- 已经下发的任务 -->
      <div style="border:1px solid #ccc;margin:10px; border-radius: 10px; padding:5px;">
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
          <el-table :data="tableDatafalse" border :default-sort="{prop:'taskExperiment.startTime', order: 'descending'}" style="width: 100%">
            <el-table-column fixed label="序号" type="index" min-width="120"></el-table-column>
            <el-table-column
              prop="taskExperiment.startTime"
              label="下发日期"
              sortable
              :formatter="formatSex"
              min-width="200"
            ></el-table-column>
            <el-table-column
              prop="taskExperimentTemplate.name"
              sortable
              label="任务名称"
              min-width="200"
            ></el-table-column>
            <el-table-column prop="experimentType.name" label="类型" min-width="120"></el-table-column>
            <el-table-column label="实验模板" min-width="250">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看指导文件" placement="top">
                  <el-button
                    @click="handleClick(scope.row.taskExperimentTemplate.guideId)"
                    type="text"
                    size="small"
                  >实验指导</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="下载实验报告" placement="top">
                  <el-button
                    @click="getResources(scope.row.taskExperimentTemplate.reportId)"
                    type="text"
                    size="small"
                  >实验报告</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="打开实验场景" placement="top">
                  <el-button
                    @click="go3D(scope.row.taskExperimentTemplate.sceneId)"
                    type="text"
                    size="small"
                  >实验场景</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="taskExperiment.finishTime"
              label="截止时间"
              :formatter="finishTime"
              min-width="200"
            ></el-table-column>
            <el-table-column prop="taskExperiment.total" label="下发总人数" min-width="120"></el-table-column>
            <el-table-column prop="taskExperiment.complete" label="已提交报告人数" min-width="120"></el-table-column>
            <el-table-column label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="readOver(scope.row)" type="text" size="small">批阅</el-button>
                <el-button @click="stop(scope.row.taskExperiment.id)" type="text" size="small">停止</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
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
          <el-table :data="tableDatatrue" border style="width: 100%"  :default-sort="{prop:'taskExperiment.startTime', order: 'descending'}">
            <el-table-column fixed label="序号" type="index" min-width="120"></el-table-column>
            <el-table-column
              prop="taskExperiment.startTime"
              label="下发日期"
              sortable
              :formatter="formatSex"
              min-width="200"
            ></el-table-column>
            <el-table-column
              prop="taskExperimentTemplate.name"
              sortable
              label="任务名称"
              min-width="200"
            ></el-table-column>
            <el-table-column prop="experimentType.name" label="类型" min-width="120"></el-table-column>
            <el-table-column label="实验模板" min-width="250">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看指导文件" placement="top">
                  <el-button
                    @click="handleClick(scope.row.taskExperimentTemplate.guideId)"
                    type="text"
                    size="small"
                  >实验指导</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="下载实验报告" placement="top">
                  <el-button
                    @click="getResources(scope.row.taskExperimentTemplate.reportId)"
                    type="text"
                    size="small"
                  >实验报告</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="打开实验场景" placement="top">
                  <el-button
                    @click="go3D(scope.row.taskExperimentTemplate.sceneId)"
                    type="text"
                    size="small"
                  >实验场景</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="taskExperiment.finishTime"
              label="截止时间"
              :formatter="finishTime"
              min-width="200"
            ></el-table-column>
            <el-table-column prop="taskExperiment.total" label="下发总人数" min-width="120"></el-table-column>
            <el-table-column prop="taskExperiment.complete" label="已提交报告人数" min-width="120"></el-table-column>
            <el-table-column label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="readOver(scope.row)" type="text" size="small">批阅</el-button>
                <el-button
                  @click="deleteTask(scope.row.taskExperiment.id)"
                  type="text"
                  size="small"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>

      <!-- 弹出层 -->
      <el-dialog width="90%" title="场景文件" top="10vh" :visible.sync="innerVisible" append-to-body>
        <div style="height:600px">
          <Unity3D v-bind:tasks="tasks"></Unity3D>
        </div>
      </el-dialog>

      <el-dialog width="90%" title="指导文件" top="5vh" :visible.sync="innerVisibleNew" append-to-body>
        <div style="height:800px">
          <Examine ref="child"></Examine>
        </div>
      </el-dialog>
      <el-dialog width="90%" title="新增任务" top="10vh" :visible.sync="innerVisibleadd" append-to-body>
        <div style="height:40vh">
          <Editor  if='innerVisibleadd' @taskissue='taskissue'></Editor>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  master,
  formatDate,
  deletedaTask,
  stopTask,
  getResource_by_id
} from "../API/api";
import Unity3D from "./uity3D";
import Examine from "../views/Examine";
import Editor from "./tasks/Editor";
export default {
  data() {
    return {
      offset: 0,
      limit: 50,
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
    Editor
  },

  methods: {
    // 到详情页面
    handleClick(id) {
      // console.log(id);
      getResource_by_id({
        id: id
      })
        .then(res => {
          // console.log(res);
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
        .catch(() => {});
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
      let data = src;

      if (!data) {
        return;
      }
      let courseUrl = "";
      if (JSON.parse(sessionStorage.getItem("course"))) {
        courseUrl = JSON.parse(sessionStorage.getItem("course")).url;
      }
      const fileName = name;
      let url = courseUrl + "/download_test?url=" + data + "&name=" + fileName;
      const elink = document.createElement("a");
      // elink.download = fileName;
      elink.style.display = "none";
      elink.href = url;
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    },
    // 到场景文件详情页
    go3D(id) {
      this.tasks.id = id;
      this.innerVisible = true;
    },
    formatSex(row) {
      //  return row.updatedAt
      return formatDate(row.taskExperiment.startTime);
    },
    finishTime(row) {
      return formatDate(row.taskExperiment.finishTime);
    },
    goadd() {
      // this.$router.push("/task/Editor");
      this.innerVisibleadd = true;
    },
    stop(id) {
      this.$confirm("此操作将停止该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          stopTask({
            id: id
          }).then(res => {
            this.$message({
              message: "停止成功",
              type: "success"
            });
            this.masters();
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
      console.log(row);
        this.$router.push({
          path: '/task/Presentationteacher',
          query: {
            id: row.taskExperiment.id
          }
        })
    },
    deleteTask(id) {
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletedaTask({
            id: id
          }).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.masters();
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
    taskissue(){
        this.innerVisibleadd=false;
        this.masters();
    },
    // 加载列表
    masters() {
       console.log('aaaa')
      master({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        //   this.tableDataOK=[
        //   {name:1},{name:1},{name:1},{name:1},{name:1},{name:1}
        // ]
        console.log(res);
        let boxtrue = [];
        let boxfalse = [];
        // this.tableDataOK = res.data.object;
        this.tableDatatrue = [];
        this.tableDatafalse = [];
        for (let i = 0; i < res.data.object.length; i++) {
          let item = res.data.object[i];
          if (item.taskExperiment.completed) {
            boxtrue.push(item);
          } else {
            boxfalse.push(item);
          }
        }
        this.tableDatatrue = boxtrue;
        this.tableDatafalse = boxfalse;

        // for(let i=0;i<res.data.object.length;i++){
        //     let item=res.data.object[i]
        //     box[i]={}
        //     box[i].id=item.taskExperiment.id;
        // }
        // this.tableDataOk=box;
      });
    },
    goExamine(name, path) {
      let examine = {};
      examine.sourcePath = this.$route.path;
      examine.name = name;
      examine.path = path;
      sessionStorage.setItem("examine", JSON.stringify(examine));
      let user = JSON.parse(sessionStorage.getItem("user"));
      // console.log(user, user.role);
      // if (user.role == "teacher") {
      //   this.$router.push("/relayteacher/Examine");
      // } else if (user.role == "student") {
      //   this.$router.push("/relay/Examine");
      // } else {
      // }
    }
  },
  mounted() {},
  created() {
    this.masters();
   
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
@media screen and (min-width: 1100px) and (max-width: 1500px) {
  .marginbox {
    margin: 0 11%;
  }
}
@media screen and (min-width: 1500px) and (max-width: 1800px) {
  .marginbox {
    margin: 0 18%;
  }
}
@media screen and (min-width: 1800px) {
  .marginbox {
    margin: 0 22%;
  }
}
.box {
  width: 90%;
  margin: 5px 5%;
}
.Breadcrumb {
  position: absolute;
  top: -25px;
  left: 250px;
}
</style>
