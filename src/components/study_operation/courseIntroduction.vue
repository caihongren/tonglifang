<template>
  <el-row type="flex" class="row-bg">
    <el-col :span="24" class="row-outline">
      <div class="outline">
        <!-- 课程概述 -->
        <div class="outline-top">
          <h3 class="icon iconfont">&#xe538; 课程概述
            <el-button class="Summary el-icon-edit-outline" size="mini" type="text" @click="courseOverviewUpdateButton()" v-show="teacherStudentShow"></el-button>
          </h3>
          <div class="line"></div>
          <p class="courseOverview" v-html="Trim(courseOverview)"></p>
        </div>
        <!-- 课程大纲 -->
        <div class="outline-top">
          <h3 class="icon iconfont">&#xe660; 课程大纲</h3>
          <div class="line"></div>
          <div class="outline-c" v-for="item in chapterUnitDate" :key="item.id">
            <span style="font-size:16px;color:#313131;">{{ item.section }}{{"."}}{{ item.name }}</span>
            <div v-for="unitItem in item.units" :key="unitItem.id">
              <span style="padding-left: 20px; color:#6e6e6e;">{{ unitItem.section }}{{"."}}{{ unitItem.name }}</span>
            </div>
          </div>
        </div>
        <!-- 授课目标 -->
        <div class="outline-top">
          <h3 class="el-icon-reading">
            授课目标
            <el-button class="Summary2 el-icon-edit-outline" size="mini" type="text" @click="teachingObjectivesUpdateButton()" v-show="teacherStudentShow"></el-button>
          </h3>
          <div class="line"></div>

          <p class="courseOverview" v-html="Trim(teachingObjectives) "></p>
        </div>
        <!-- 修改课程概述弹框 -->
        <el-dialog title="修改课程概述" :visible.sync="courseOverviewDialogVisible" class="modify">
          <el-input type="textarea" :rows="8" v-model="courseOverviewInput" autocomplete="off"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" class="cancel" @click="courseOverviewDialogVisible = false">取 消</el-button>
            <el-button type="primary" size="mini" class="Sure" @click="courseOverviewUpdate()">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改授课目标弹框 -->
        <el-dialog title="修改授课目标" :visible.sync="teachingObjectivesDialogVisible" class="modify">
          <el-input type="textarea" :rows="8" v-model="teachingObjectivesInput" autocomplete="off"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" class="cancel" @click="teachingObjectivesDialogVisible = false">取 消</el-button>
            <el-button type="primary" size="mini" class="Sure" @click="teachingObjectivesUpdate()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import {
  get_course_description,
  getModuleAndTrainingInner,
  modify_course_description,
  modify_course_objectives,//修改课程介绍
  Trim,
} from "@/API/api";
import { mapState, mapActions } from "vuex";
import { type } from "os";
import { types } from "util";
export default {
  data() {
    return {
      id: "", //课程id

      courseOverview: "", //课程概述内容
      teachingObjectives: "", //授课目标内容
      chapterUnitDate: [{ id: null, name: "", section: 1 }], //实训资源数据
      teacherStudentShow: false, //教师还是学生是否显示编组件
      courseOverviewDialogVisible: false, //修改课程概述弹出框是否显示
      teachingObjectivesDialogVisible: false, //修改课程概述弹出框是否显示
      courseOverviewInput: "", //修改授课目标编辑框
      teachingObjectivesInput: "" //修改授课目标编辑框
    };
  },
  computed: {
    ...mapState(["courseList"])
  },
  methods: {
    Trim,
    //获取课程介绍内容
    getCourseDescription() {
      get_course_description({
        courseId: this.id
      }).then(res => {
          this.courseOverview = res.data.object.description==null?'':res.data.object.description; //将课程介绍内容绑定到页面相应位置
          this.teachingObjectives = res.data.object.objectives==null?'':res.data.object.objectives; //将授课目标绑定到页面相应位置
        })
    },


    //修改授课目标
    modifyCourseObjectives() {
      modify_course_objectives({
        courseId: this.id
      })
        .then(res => {
          this.teachingObjectives = res.data.object.objectives; //将课程介绍内容绑定到页面相应位置
        })
    },
    //获取所有章节
    getChapterAnd_UnitList() {
      getModuleAndTrainingInner()
        .then(res => {
          this.addserial(res.data.object);
          // this.course(res.data.object);
        })

    },
    // 给章节加前缀
    addserial(row) {
      let obj = row;
      let databox = [];
      for (let i = 0; i < obj.length; i++) {
        let item = obj[i];
        databox[i] = {};
        databox[i].id = item.moduleId;
        databox[i].name = item.moduleName;
        databox[i].section = i + 1;
        let units = [];
        for (let j = 0; j < item.trainings.length; j++) {
          units[j] = {};
          units[j].id = item.trainings[j].id;
          units[j].name = item.trainings[j].name;
          units[j].section = i + 1 + "." + (j + 1);
        }
        databox[i].units = units;
      }
      if (databox.length > 0) {
        this.chapterUnitDate = databox; //将章节内容绑定到页面相应位置
      }
    },
    //修改课程概述弹出框显示
    courseOverviewUpdateButton() {
      this.courseOverviewDialogVisible = true;
      this.courseOverviewInput = this.courseOverview;
    },
    //修改课程概述方法
    courseOverviewUpdate() {
      this.courseOverviewDialogVisible = false;
      modify_course_description({
        courseId: this.id,
        description: this.courseOverviewInput
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "修改成功！",
              type: "success"
            });
            this.getCourseDescription(); //获取课程介绍内容
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "修改失败！",
              type: "error"
            });
          }
        })
    },
    //修改授课目标弹出框显示
    teachingObjectivesUpdateButton() {
      this.teachingObjectivesDialogVisible = true;
      this.teachingObjectivesInput = this.teachingObjectives;
    },
    //修改授课目标方法
    teachingObjectivesUpdate() {
      this.teachingObjectivesDialogVisible = false;
      modify_course_objectives({
        courseId: this.id,
        objectives: this.teachingObjectivesInput
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "修改成功！",
              type: "success"
            });
            this.getCourseDescription(); //获取课程介绍内容
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "修改失败！",
              type: "error"
            });
          }
        })
    }
  },
   watch: {
    $route: {
      handler: function (val, oldVal) {
          // 获取课程id
    this.id = JSON.parse(sessionStorage.getItem("course")).id;
    this.getCourseDescription(); //获取课程介绍内容
    //  this.modifyCourseObjectives()
    // 从vuex中取缓存的数据
    if (this.courseList.length > 0) {
      this.addserial(this.courseList);
    } else {
      this.getChapterAnd_UnitList(); //获取所有章节
    }
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    // 获取课程id
    this.id = JSON.parse(sessionStorage.getItem("course")).id;
    this.getCourseDescription(); //获取课程介绍内容
    //  this.modifyCourseObjectives()
    // 从vuex中取缓存的数据
    if (this.courseList.length > 0) {
      this.addserial(this.courseList);
    } else {
      this.getChapterAnd_UnitList(); //获取所有章节
    }

    //判断学生/教师，隐藏/显示菜单操作按钮
    let role = JSON.parse(sessionStorage.getItem("user")).role;
    if (role == "student") {
      this.teacherStudentShow = false;
    } else {
      this.teacherStudentShow = true;
    }
  }
};
</script>
<style lang="less" scoped>
.row-outline {
  width: 100%;
}
.outline {
  height: 100%;
  width: 103.3%;
  overflow: auto;
  position: relative;
  padding-left: 20px;
  padding-right: 67px;
  .outline-top {
    background-color: #fff;
    margin-top: 20px;
    margin-bottom: 25px;
    h3 {
      font-size: 18px;
      line-height: 30px;
      padding: 0 50px;
      padding-top: 40px;
      color: #c1262e;
      .Summary {
        position: absolute;
        right: 180px;
        font-size: 24px;
        color: black;
      }
      .el-icon-s-data {
        color: #c1262e;
      }
      .el-icon-reading {
        color: #c1262e;
      }
    }
    .line {
      margin: 0 50px 0 50px;
      height: 2px;
      background-color: #d9d9d9;
    }
    .courseOverview {
      padding: 0 50px 0 50px;
      font-size: 16px;
      font-family: "Microsoft YaHei";
      line-height: 30px;
      color: #6e6e6e;
      padding-top: 30px;
      white-space: pre-wrap;
    }
    .Summary2 {
      position: absolute;
      right: 180px;
      font-size: 24px;
      color: black;
      margin-top: -30px;
    }
  }

  .outline-c {
    padding: 0 50px;
    font-size: 16px;
    font-family: "Microsoft YaHei";
    line-height: 30px;
    padding-top: 10px;
  }
}
.dialog-footer .cancel {
  background-color: #66c6f2;
  border-radius: 0px;
  width: 70px;
  height: 30px;
  border: none;
}
.dialog-footer .Sure {
  background-color: #00a0e9;
  border: none;
  width: 70px;
  height: 30px;
  border-radius: 0px;
}
</style>
<style >
.modify .el-dialog__title {
  color: #00a0e9;
}
</style>





