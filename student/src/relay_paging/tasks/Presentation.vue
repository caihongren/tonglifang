<template>
  <div class="Presentation">
    <div class="taskname">
      <el-row :gutter="20" type="flex" class="row-bg">
        <el-col :span="1"></el-col>
        <el-col :span="6">
          <div>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>
                <a @click="$router.push('/relayteacher/taskManagement')">
                  <h3>实训任务管理</h3>
                </a>
              </el-breadcrumb-item>
              <el-breadcrumb-item>
                <a>
                  <h3>{{name}}</h3>
                </a>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
        <el-col :span="4">
          <div>任务开始时间：{{ startTime|dateformat }}</div>
        </el-col>
        <el-col :span="4">
          <div>任务截止时间：{{ finishTime|dateformat }}</div>
        </el-col>
        <el-col :span="4">
          <div>总人数：{{ total }}</div>
        </el-col>
        <el-col :span="4">
          <div>已提交人数：{{ complete }}</div>
        </el-col>
      </el-row>
    </div>
    <el-container style="height:100%">
      <el-aside class="asidebox" width="250px">
        <el-col :span="24">
          <el-menu :default-active="String(sumber)" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#313131" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item-group :title="itembox.className" v-for="(itembox,index) in student" :key="index" style="font-size:18px;">
              <el-menu-item style="height: 40px;line-height: 40px;" @click="sumber=item.index,studentClick(item)" v-bind:index=" String(item.index)" v-for="(item) in itembox.students" :disabled="item.statu=='new'||item.statu=='save'||item.statu=='expired'?true:false" :key="item.index">
                <el-badge class="item" :is-dot="item.statu=='submit'?true:false">{{item.studentName}}</el-badge>
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </el-col>
      </el-aside>
      <!-- main内容部分 -->
      <el-container style="background-color: #f1f1f1;">
        <el-main style="margin:10px 20px;padding:0px;background-color: #fff;">
          <div class="mainbox">
            
            <div class="browse">{{pdfname}}
              <el-button class='but' @click="oldpdf()" type="primary" size="mini" v-show="ispdf">返回实训报告</el-button>
            </div>
            <div class="pdf">
              <div class="content">
                <iframe :src="pdfPath" class="iframe" style="width:100%;height:95%" v-if="pdfPath==''?false:true"></iframe>
                <div v-show="pdfPath==''?true:false" class="textshu"> 暂无数据。。。。</div>
              </div>
            </div>
            <div class="left" @click="switchover(-1)">
              <i class="el-icon-arrow-left" style="font-size: 20px;"></i>
            </div>
            <div class="right" @click="switchover(1)">
              <i class="el-icon-arrow-right" style="font-size: 20px;"></i>
            </div>
          </div>
        </el-main>
        <el-aside style="width: 396px;background-color: #fff;margin: 10px 20px 0px 0px;padding: 0 20px;">
          <div style="margin: 20px;" class="text chongqing">仿真实训题</div>
          <div style="margin: 20px;" class="chongqing">
            <el-table :data="row.tasks" style="width: 100%" border :header-cell-style="{background:'#b2e2f8'}">
              <el-table-column prop="projectName" label="名称" min-width="150"></el-table-column>
              <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                  <el-button @click="preview(scope.row,scope.row.scenePath)" type="text" size="small">查看</el-button>
                  <el-button type="text" size="small" @click="download(scope.row.scenePath,scope.row.projectName)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div style="margin: 20px;" class="text">附件</div>
          <div style="margin: 20px;">
            <el-table :data="row.accessory" style="width: 100%" border :header-cell-style="{background:'#b2e2f8'}">
              <el-table-column prop="name" label="名称" min-width="150"></el-table-column>

              <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                  <el-button @click="preview(scope.row,scope.row.path)" type="text" size="small">查看</el-button>
                  <el-button type="text" size="small" @click="download(scope.row.path,scope.row.name)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin: 20px;" class="text">批阅</div>
          <div style="margin: 20px;">
            <el-input type="textarea" :rows="2" placeholder="请输入评语" v-model="addfrom.remark"></el-input>
          </div>
          <div style="margin: 20px;" class="text">评分</div>
          <div style="margin: 20px;">

            <el-input v-model="addfrom.grade" placeholder="请输入百分制评分" style="width:100%"></el-input>
          </div>
          <div style="margin:20px;padding-bottom: 100px;">
            <el-button type="primary" size="mini" style="width:100%;height:40px; background-color: #00a0e9;font-size: 16px;" @click="readOver()" :disabled="disabled">批阅</el-button>
          </div>
        </el-aside>
      </el-container>
    </el-container>

    <!-- 文件预览失败警告框 -->
    <el-dialog title :visible.sync="innerVisiblevideo">
      <video id="player" width="100%" height="100%" controls autoplay="autoplay">
        您的浏览器不支持HTML5
        <source :src="previewPath" />
        <!-- 提供默认的播放视频  -->
      </video>
    </el-dialog>
    <el-dialog width="90%" top="8vh" append-to-body :visible.sync="innerVisibleNewpdf">
      <div style="height:75vh">
        <Examine ref="child" v-if="innerVisibleNewpdf"></Examine>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import Examine from "../../views/Examine";
import {
  download, //下载
  task_review_list, //教师批阅列表
  task_review_details, //教师查看学生任务详情
  task_review_score //教师批阅，打分，写评语
} from "../../API/api";
export default {
  name: "Presentationteacher",
  data() {
    return {
      innerVisiblevideo: false, //视屏窗口
      innerVisibleNewpdf: false, //图片窗口
      startTime: "", //任务开始时间
      finishTime: "", //任务结束时间
      total: "", //总人数
      complete: "", //已提交人数
      taskExperimentId: "", //当前任务id
      studentId: "", //当前学生id
      pdfName: "实训报告", //中间pdf预览名字
      pdfPath: "", //中间pdf预览路径
      disabled: true,
      row: {
        //右侧仿真实训题和附件
        tasks: [],
        accessory: []
      },
      res: "",
      pdfname:'实训报告',
      oldpaf:{
        name:'',
        path:'',
      },
      ispdf:false,
      name: "",
      sumber: 1,
      studentLength: 0, //学生最大 数量
      studentlist: new Map(),
      firststudent: [],
      theLasTonestudent: [],
      student: [],
      previewPath: "",

      addfrom: {
        grade: "", //评分
        remark: "" //评语
      },

      // 2D3D信息
      dimensionality: {
        dimensionality: "2D",
        name: "",
        type: "",
        id: "",
        look: false
      },
      tasks: {
        id: "",
        name: "",
        path: "",
        type: "",
        look: false
      }
    };
  },
  components: {
    Examine
  },
  methods: {
    // pdf到详情页面
    handleChange(name, path) {
      this.innerVisibleNewpdf = true;
      if (name != "" && path != "") {
        this.goExamine(name, path);
      } else {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "资源名称或路径不能为空"
        });
      }
    },
    // 详情页入口
    goExamine(name, path) {
      let examine = {};
      examine.sourcePath = this.$route.path;
      examine.name = name;
      examine.path = path;
      sessionStorage.setItem("examine", JSON.stringify(examine));
      let user = JSON.parse(sessionStorage.getItem("user"));
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 切换学生的pdf
    switchover(sum) {
      if (this.sumber <= 1 && sum < 0) {
        this.sumber = 1;
      } else if (this.sumber >= this.studentLength && sum > 0) {
        this.sumber = this.studentLength;
      } else {
        this.sumber += sum;
      }
      if (this.studentlist.has(this.sumber)) {
        let studentId = this.studentlist.get(this.sumber).studentId;
        this.task_review_details(studentId);
        return;
      } else {
        if (this.sumber == 1) {
          this.task_review_details(this.firststudent.studentId);
          this.sumber = this.firststudent.index;
        } else if (this.sumber == this.studentLength) {
          this.theLasTonestudent;
          this.task_review_details(this.theLasTonestudent.studentId);
          this.sumber = this.theLasTonestudent.index;
        } else {
          this.switchover(sum);
        }
      }
    },
    // 修改批阅状态
    amendstudent(studentid) {
      let student = this.student;
      for (let i = 0; i < student.length; i++) {
        for (let j = 0; j < student[i].students.length; j++) {
          if (student[i].students[j].studentId == studentid) {
            student[i].students[j].statu = "approved";
            break;
            return;
          }
        }
      }
      this.student = student;
    },

    //文件预览
    preview(row, path) {
      if (path == "") {
        this.$confirm("文件路径不支持", "提示", {
          confirmButtonText: "确定",
          type: "info"
        });
      } else {
        if (row.simType == "2d") {
          this.dimensionality.id = row.id;
          this.dimensionality.name = row.name;
          this.dimensionality.type = row.typeName;
          this.dimensionality.look = false;
          this.go2D(this.dimensionality);
        } else if (row.simType == "3d") {
          this.tasks.id = row.projectId;
          this.tasks.name = row.projectName;
          this.tasks.type = row.typeName;
          this.tasks.look = true;
          this.go3D(this.tasks);
        } else if (row.typeName == "pdf" || row.typeName == "PDF") {
          this.oldpaf={
            name: this.pdfName,
            path: this.pdfPath,
          };
          this.pdfPath = row.path;
          this.pdfName = row.name;
           this.pdfname = row.name;
           this.ispdf=true;
        } else if (
          row.typeName == "gif" ||
          row.typeName == "jpg" ||
          row.typeName == "jpeg" ||
          row.typeName == "png" ||
          row.typeName == "tif"
        ) {
          this.innerVisibleNewpdf = true;
          this.handleChange(row.name, row.path);
        } else if (
          row.typeName == "AVI" ||
          row.typeName == "avi" ||
          row.typeName == "MOV" ||
          row.typeName == "QT" ||
          row.typeName == "ASF" ||
          row.typeName == "RM" ||
          row.typeName == "NAVI" ||
          row.typeName == "DivX" ||
          row.typeName == "MPEG" ||
          row.typeName == "MPG" ||
          row.typeName == "DAT" ||
          row.typeName == "mp4" ||
          row.typeName == "wmv"
        ) {
          // var cmd = "{'opcode':7,'path':'" + path + "'}";
          // wfapp.start(cmd);

          this.previewPath = row.path;
          this.innerVisiblevideo = true;
        } else {
          this.$confirm("文件暂不支持，请下载", "提示", {
            confirmButtonText: "确定",
            type: "info"
          }).then(() => {

          })
          return;
        }
      }
    },
    // pdf详情回实训
    oldpdf(){
        this.pdfName=this.oldpaf.name;
        this.pdfPath=this.oldpaf.path;
        this.pdfname='实训报告'
        this.ispdf=false;
    },
    // 下载文件
    download(src, name) {
      if (!src) {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "文件路径不正确,无法下载"
        });
        return;
      }
      download({
        name: name,
        url: src
      }).then(res => {
        const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, name);
      });
    },
    //点击按钮进入untiy
    intounity() { },
    go2D(row) {
      const tasks = JSON.parse(sessionStorage.getItem("watchStorage2D"));
      if (tasks != null) {
        this.$confirm("请先关闭或保存二维设计空间?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push("/relayteacher/Dimension2");
          })
          .catch(() => {
            this.$message({
              showClose: true,
              duration: 1000,
              type: "info",
              message: "已取消删除"
            });
          });
        return;
      }

      if ((row.type == "" || row.name == "") && row.id == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "没有名称或类型"
        });
      } else {
        this.resetSetItem("watchStorage2D", JSON.stringify(row));
        this.testTemplateLibrary = false;

        let page = sessionStorage.getItem("pageTeacher");
        sessionStorage.setItem(
          "SourcePage",
          JSON.stringify({
            path: this.$route.path,
            row: this.res,
            index: page
          })
        );
        this.$emit("handleSelect", 10);
        this.$router.push("/relayteacher/Dimension2");
      }
    },
    go3D(row) {
      const tasks = JSON.parse(sessionStorage.getItem("watchStorage3D"));
      if (tasks != null) {
        this.$confirm("请先关闭或保存三维设计空间?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push("/relayteacher/Dimension3");
          })
          .catch(() => {
            this.$message({
              showClose: true,
              duration: 1000,
              type: "info",
              message: "已取消删除"
            });
          });
        return;
      }
      if ((row.type == "" || row.name == "") && row.id == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "没有名称或类型"
        });
      } else {
        this.resetSetItem("watchStorage3D", JSON.stringify(row));
        this.dialogVisiblecopyscene = false;

        let page = sessionStorage.getItem("pageTeacher");
        sessionStorage.setItem(
          "SourcePage",
          JSON.stringify({
            path: this.$route.path,
            row: this.res,
            student: this.sumber,
            index: page
          })
        );
        sessionStorage.setItem("studentid", this.sumber);
        this.$emit("handleSelect", 11);
        this.$router.push("/relayteacher/Dimension3");
      }
    },
    //获取教师批阅列表
    taskReviewList(taskExperimentId, courseId) {
      task_review_list({
        taskExperimentId: taskExperimentId,
        courseId: courseId
      }).then(res => {
        this.student = [];
        let data = res.data.object;
        let firststudent = true;
        let index = 0;
        for (var i = 0; i < data.length; i++) {
          let student = [];
          for (var j = 0; j < data[i].students.length; j++) {
            index++;
            data[i].students[j].index = index;
            if (
              data[i].students[j].statu != "new" &&
              data[i].students[j].statu != "save" &&
              data[i].students[j].statu != "expired"
            ) {
              this.studentlist.set(index, data[i].students[j]);
              if (firststudent) {
                this.firststudent = data[i].students[j];
                firststudent = false;
              }
              this.theLasTonestudent = data[i].students[j];
            }
          }
        }
        this.studentLength = index;
        this.student = data;
        if (sessionStorage.getItem("studentid")) {
          let student = this.studentlist.get(
            sessionStorage.getItem("studentid") * 1
          );
          this.task_review_details(student.studentId);
          this.sumber = student.index;
          setTimeout(res => {
            sessionStorage.removeItem("studentid");
          }, 1000);
          return;
        } else {
          this.task_review_details(this.firststudent.studentId);
          this.sumber = this.firststudent.index;
        }
      });
    },
    //教师查看学生任务详情
    task_review_details(studentid) {
      if (studentid == null || studentid == undefined) {
        return;
      }
      task_review_details({
        taskExperimentId: this.taskExperimentId,
        studentId: studentid
      }).then(res => {
        if (res.data.code == "0") {
          // console.log(res);
          this.ispdf=false;
          this.pdfname='实训报告'
          let simAnnexs = [];
          this.row.accessory = res.data.object.otherAnnexs;
          this.studentId = studentid;
          this.pdfPath = res.data.object.reportPath;
          this.pdfName = res.data.object.reportName;
          this.addfrom.grade = res.data.object.score;
          this.addfrom.remark = res.data.object.comment;
          for (let i = 0; i < res.data.object.simAnnexs.length; i++) {
            if (
              res.data.object.simAnnexs[i].scenePath != "" &&
              res.data.object.simAnnexs[i].scenePath != null
            ) {
              simAnnexs.push(res.data.object.simAnnexs[i]);
            }
          }
          this.row.tasks = simAnnexs;
          this.disabled = false;
        } else {
        }
      });
    },

    studentClick(item) {
      this.task_review_details(item.studentId);
    },
    //教师批阅，打分，写评语
    readOver() {
      if (this.taskExperimentId == "" || this.studentId == "") {
        this.$message({
          showClose: true,
          duration: 1000,
          message: "批阅错误",
          type: "error"
        });
        return;
      }

      if (this.addfrom.grade < 0 || this.addfrom.grade > 100) {
        this.addfrom.grade = "";
        this.$message({
          showClose: true,
          duration: 1000,
          message: "请输入正确的数字评分0-100",
          type: "error"
        });
        return;
      } else {
        task_review_score({
          taskExperimentId: this.taskExperimentId,
          studentId: this.studentId,
          score: this.addfrom.grade,
          comment: this.addfrom.remark
        }).then(res => {
          if (res.data.code == "0") {
            this.$message({
              type: "success",
              showClose: true,
              duration: 1000,
              message: "批阅成功"
            });
            this.amendstudent(this.studentId);
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "批阅失败",
              type: "error"
            });
          }
        });
      }
    },
    initData(res) {
      let row = "";
      if (res) {
        row = res;
        this.res = row;
      } else {
        row = this.$route.query;
        this.res = row;
      }
      this.taskExperimentId = row.id;
      this.name = row.name;
      this.startTime = row.startTime;
      this.finishTime = row.finishTime;
      this.total = row.total;
      this.complete = row.complete;
      let courseId = JSON.parse(sessionStorage.getItem("course")).id;
      this.taskReviewList(this.taskExperimentId, courseId);
    }
  },
  created() {
    let res = JSON.parse(sessionStorage.getItem("SourcePage"));
    if (this.$route.query.id) {
      this.initData();
    } else if (res.row != null) {
      this.initData(res.row);
    }
  }
};
</script>
<style lang="less" scoped>
.Presentation {
  background-color: #fff;
  height: 100%;
}
.taskname {
  width: 100%;
  height: 50px;
  line-height: 50px;
  // border: 1px solid #ccc;
  // border-radius: 6px;
  background-color: #b2e2f8;
}
.asidebox {
  height: 100%;
  // border: 1px solid #ccc;
  background-color: #313131;
  .el-menu {
    background-color: #313131;
    border: 0px;
  }
}
// 附件列表
.Enclosure,
.dataList {
  width: 100px;
  height: 100px;
  margin: 0 30%;
  border: 1px solid #f1f1f1;
}

.dataList {
  margin-top: 5px;
}
.unity > button {
  width: 100px;
  height: 100px;
  background-color: skyblue;
  margin-left: 30%;
  margin-top: 5px;
}
.Comment {
  width: 100px;
  margin-left: 30%;
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 35px;
}
.el-form {
  > .el-button {
    margin: 10px 0 0 80px;
  }
}
.mainbox {
  // border: 1px solid #ccc;
  height: 99%;
  overflow: hidden;
  position: relative;
  > .browse {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: #00a0e9;
  
    .but{
       position: absolute;
      top:6px;
      right: 10px;
      
      // margin: 6px;
      // float: right;
    }

    // border-bottom: 1px solid #ccc;
  }
  .pdf {
    height: 100%;
    width: 100%;
    overflow: auto;
    .content {
      height: 100%;
    }
  }
  .left {
    position: absolute;
    left: 10px;
    top: 50%;
    padding-top: 2px;
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: #ccc;
    cursor: pointer;
  }
  .right:hover {
    background-color: #74a778;
  }
  .left:hover {
    background-color: #74a778;
  }
  .right {
    position: absolute;
    right: 10px;
    top: 50%;
    padding-top: 2px;
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: #ccc;
    cursor: pointer;
  }
}
.text {
  font-size: 18px;
  color: #00a0e9;
}
.textshu {
  font-size: 18px;
  color: #00a0e9;
  padding-left: 20px;
}
</style>

<style>
.Presentation .el-breadcrumb__separator {
  color: black;
}
.Presentation .item .is-fixed {
  top: 11px;
}
.Presentation .el-menu-item-group__title {
  font-size: 18px;
}
</style>


