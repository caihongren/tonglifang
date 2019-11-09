<template>
  <div class="box">
    <div style="height:50px" class="bottonbox">
      <span class="buttombox" style=" color:#00a0e9">任务编辑器</span>
    </div>

    <el-form label-width="80px">
      <el-form-item label="下发对象">
        <el-button type="primary" size="mini" @click="modal1 = true" v-if="studentname.length>0?false:true" class="choice">选择</el-button>
        <p class="student" v-if="studentname.length>0?true:false" @click="modal1 = true">{{studentname}}</p>
      </el-form-item>
      <el-form-item label="截止时间">
        <el-col :span="14">
          <el-date-picker v-model="value1" type="date" :picker-options="pickerOptions1" format="yyyy 年 MM 月 dd 日" placeholder="选择截止日期时间" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="模板选择">
        <template>
          <el-select v-model="taskTemplatebox" clearable placeholder="请选择模板" @change="clickone()">
            <el-option v-for="item in tableDataBox" :key="item.moduleId" :label="item.moduleName" :value="item.trainings"></el-option>
          </el-select>
        </template>
        <el-select v-model="trainingId" placeholder="请选择">
          <el-option v-for="item in taskTemplatebox" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox-group size="mini" >
        <el-checkbox label="教学模式" border :disabled="checkboxdis1" v-model="checkboxmodel1"></el-checkbox>
        <el-checkbox label="练习模式" border :disabled="checkboxdis1" v-model="checkboxmodel2"></el-checkbox>
        <el-checkbox label="考核模式" border :disabled="checkboxdis1" v-model="checkboxmodel3"></el-checkbox>
        </el-checkbox-group> 
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="open2" class="Arrow">下发</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择下发对象" :visible.sync="modal1" width="30%" append-to-body class="modify">
      <el-tree :data="students" show-checkbox check-strictly default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modal1 = false" size="mini" class="closeButton">取 消</el-button>
        <el-button type="primary" @click="getCheckedNodes" size="mini" class="preservation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addTaskExperiment, //下发任务
  getModuleAndTrainingSelf, //课程实训
  getModuleAndTrainingInner, //我的实训
  getclass, // 获取与用户同班级的信息  //教师获取课程下的学生
  formatDate
} from "./../../API/api";
import { log } from "util";
export default {
  name: "EditorCopy",
  data() {
    return {
      checkboxdis1: true,
      checkboxmodel1: false,
      checkboxmodel2: false,
      checkboxmodel3: false,

      value1: "",

      offset: 0,
      limit: 10000,
      studentname: "",
      trainingId: "",
      taskTemplatebox: [], //选中是模块集合
      addIssued: {
        trainingId: "",
        accountIds: [],
        startTime: "",
        finishTime: "",
        innerr: true, //下发的课程实训则为true，我的则是false
        teaching: true, //下发该模式则为true，否则为false
        practice: true, //下发该模式则为true，否则为false
        exam: true
      },
      tableDataBox: [],
      tcourseId: "",

      modal1: false,
      modal2: false,
      modal3: false,

      defaultProps: {
        children: "accounts",
        label: "name"
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一月后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", date);
            }
          }
        ],
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },

      students: []
    };
  },
  methods: {
    clickone() {
      this.trainingId = "";
      if (this.taskTemplatebox.length > 0) {
        if (this.taskTemplatebox[0].innerr == false) {
          //我的实训
          this.addIssued.innerr = false;
          this.checkboxdis1 = false;
          this.checkboxmodel1 = false;
          this.checkboxmodel2 = false;
          this.checkboxmodel3 = true;
        } else {
          // 内置实训
          this.addIssued.innerr = true;
          this.checkboxdis1 = true;
          this.checkboxmodel1 = true;
          this.checkboxmodel2 = true;
          this.checkboxmodel3 = true;
        }
      }
    },
    handleCurrentChange() { },
    open2() {
      //  下发时间为当前时间
      let finishTime = this.value1;

      if (finishTime == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "请选择下发时间",
          type: "warning"
        });
        return;
      }
      if (
        this.checkboxmodel1 == false &&
        this.checkboxmodel2 == false &&
        this.checkboxmodel3 == false
      ) {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "请选择下发模式",
          type: "warning"
        });
        return;
      } else {
        this.addIssued.teaching = this.checkboxmodel1;
        this.addIssued.practice = this.checkboxmodel2;
        this.addIssued.exam = this.checkboxmodel3;
      }
      this.addIssued.trainingId = this.trainingId;
      this.addIssued.startTime = formatDate(
        new Date().setTime(new Date().getTime())
      );
      finishTime.setHours(23);
      finishTime.setMinutes(59, 59, 148);
      this.addIssued.finishTime = formatDate(finishTime);
      if (this.addIssued.accountIds.length > 0) {
        if (this.addIssued.trainingId != "") {
          addTaskExperiment(this.addIssued)
            .then(res => {
              this.$message({
                showClose: true,
                duration: 1000,
                message: "下发成功",
                type: "success"
              });
              this.$emit("taskissue");
              // this.$router.push("/relayteacher/taskManagement");
            })
            .catch(res => { });
        } else {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: "请选择实训模板",
            type: "warning"
          });
        }
      } else {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "请选择下发对象",
          type: "warning"
        });
      }
    },
    getCheckedNodes() {
      this.modal1 = false;
      let studentname = "";
      let list = this.$refs.tree.getCheckedNodes();
      let accountIds = [];
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].accounts.length; j++) {
          accountIds.push(list[i].accounts[j].id);
        }
        if (i >= 1) {
          studentname += "," + list[i].name;
        } else {
          studentname += list[i].name;
        }
      }
      this.addIssued.accountIds = accountIds;
      this.studentname = studentname;
    },
    open4() {
      this.value1 = [];
      this.addIssued.accountIds = [];
      this.addIssued.trainingId = "";
      this.$message.error({
        showClose: true,
        duration: 1000,
        message: "删除成功"
      });
    },
    ok() {
      this.$Message.info({
        showClose: true,
        duration: 1000,
        message: "已选择"
      });
    },
    cancel() {
      this.$Message.info({
        showClose: true,
        duration: 1000,
        message: "重新选择"
      });
      // 关闭之后的回调
    },
    addok() {
      this.$Message.info({
        showClose: true,
        duration: 1000,
        message: "添加成功"
      });
    },
    addcancel() {
      this.$Message.info({
        showClose: true,
        duration: 1000,
        message: "添加失败"
      });
    },
    LOERok() {
      this.$Message.info({
        showClose: true,
        duration: 1000,
        message: "选择成功"
      });
    },
    LOERcancel() {
      this.$Message.info({
        showClose: true,
        duration: 1000,
        message: "选择失败"
      });
    }
  },
  mounted() {
    getModuleAndTrainingInner({}).then(res => {
      console.log(res,'内置模板')
      // this.tableDataBox = res.data.object;
      this.tableDataBox = [];
      getModuleAndTrainingSelf({}).then(res => {
        console.log(res,'我的实训模板list')
        this.tableDataBox = this.tableDataBox.concat({
          moduleId: "12312312",
          moduleName: "全部",
          ismy: true,
          trainings: res.data.object
        });
        // this.tableDataBox = this.tableDataBox.concat({
        //   moduleId: "12312312dwadaw",
        //   moduleName: "其他模板",
        //   ismy: false,
        //   trainings: []
        // });
        //默认选中我的实训
        this.taskTemplatebox = res.data.object;
        this.clickone();
      });
    });
  },
  created() {
    let course = JSON.parse(sessionStorage.getItem("course"));
    this.courseId = course.id;
    // 获取与用户同班级的信息  //教师获取课程下的学生
    getclass({
      courseId: this.courseId
    }).then(res => {
      for (let i = 0; i < res.data.object.length; i++) {
        for (let j = 0; j < res.data.object[i].accounts.length; j++) {
          res.data.object[i].accounts[j].disabled = true;
        }
      }
      this.students = res.data.object;
    });
  }
};
</script>
<style lang="less" scoped>
.modify .el-dialog__title {
  color: #00a0e9;
}
.choice {
  background-color: #00a0e9;
  border: none;
  border-radius: 0px;
}
.Arrow {
  background-color: #00a0e9;
  border: none;
  border-radius: 0px;
  float: right;
  margin-right: 100px;
}
@media screen and (min-width: 1200px) and (max-width: 1500px) {
  .tablebox {
    width: 1200px;
  }
}
@media screen and (min-width: 1500px) and (max-width: 1800px) {
  .tablebox {
    width: 1500px;
  }
}
@media screen and (min-width: 1800px) {
  .tablebox {
    width: 1800px;
  }
}
.box {
  width: 90%;
  margin: 5px 5%;
}
.bottonbox {
  position: relative;
  margin-top: 20px;
  margin: 20px 0px;
  line-height: 50px;
  font-size: 20px;
  font-weight: 700;

  border-radius: 5px;
  span {
    margin: 10px;
    margin-right: 80px;
  }
  .batch {
    margin: 10px 25px;
  }
  .Marking {
    margin: 10px 60px;
  }
  .search {
    float: right;
    position: absolute;
    top: 0;
    right: 10px;
    margin: 5px 10px;
  }
  .searchtext {
    position: absolute;
    top: 0;
    right: 100px;
  }
  .bottondel {
    position: absolute;
    top: 0;
    right: 320px;
  }
}

.student {
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}
.ul {
  width: 95%;
  height: 50px;
  margin: 0;

  .li {
    float: left;
    width: 20%;
    background-color: #ffffff;
    height: 60px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-right: 0px solid black;
    text-align: center;
    line-height: 60px;
  }
  .headline {
    background-color: #b2e2f8;
  }
}

.search {
  float: right;
  position: absolute;
  top: 0;
  right: 10px;
  margin: 5px 10px;
}
</style>

