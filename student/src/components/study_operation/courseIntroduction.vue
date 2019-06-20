<template>
  <el-row type="flex" class="row-bg">
    <el-col :span="24">
      <div class="outline">
        <h3><i class="el-icon-menu"></i> 课程概述 
        <el-button  class="Summary"   size= "small"  type="primary" @click="courseOverviewUpdateButton()" v-show="teacherStudentShow">修改</el-button>
        </h3>
        <p class="courseOverview">{{ courseOverview }}</p>
        <el-dialog title="修改课程概述" :visible.sync="courseOverviewDialogVisible">
          <el-input type="textarea" :rows="8" v-model="courseOverviewInput" autocomplete="off"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="courseOverviewDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="courseOverviewUpdate()">确 定</el-button>
          </div>
        </el-dialog>
        <h3><i class="el-icon-s-data"></i> 课程大纲 </h3>
        <div class="outline-c" v-for="item in chapterUnitDate" :key="item.id">
          <span style="font-size:16px">{{ item.section }}{{"."}}{{ item.name }}</span>
          <div v-for="unitItem in item.units" :key="unitItem.id">
            <span style="padding-left: 20px;">{{ unitItem.section }}{{"."}}{{ unitItem.name }}</span>
          </div>
        </div>
        <div class="target">
          <h3><i class="el-icon-reading"></i> 授课目标 
          <el-button  class="Summary"   size= "small"  type="primary" @click="teachingObjectivesUpdateButton()" v-show="teacherStudentShow">修改</el-button>
          </h3>
          <p class="target-c">{{teachingObjectives}} </p>
          <el-dialog title="修改授课目标" :visible.sync="teachingObjectivesDialogVisible">
          <el-input type="textarea" :rows="8" v-model="teachingObjectivesInput" autocomplete="off"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="teachingObjectivesDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="teachingObjectivesUpdate()">确 定</el-button>
          </div>
        </el-dialog>
        </div>


      </div>
    </el-col>
  </el-row>
</template>
<script>
import {
  get_course_description,
  get_chapter_and_unit_list,
  modify_course_description,
  modify_course_objectives
} from "@/API/api";
export default {
  data() {
    return {
      courseOverview: "", //课程概述内容
      teachingObjectives: "", //授课目标内容
      chapterUnitDate: [{ id: null, name: "", section: 1 }], //章节目录数据
      teacherStudentShow: false, //老师还是学生是否显示编组件
      courseOverviewDialogVisible: false, //修改课程概述弹出框是否显示
      teachingObjectivesDialogVisible: false, //修改课程概述弹出框是否显示
      courseOverviewInput: "", //修改授课目标编辑框
      teachingObjectivesInput: "" //修改授课目标编辑框
    };
  },
  methods: {
    //获取课程介绍内容
    getCourseDescription() {
      get_course_description({
        courseId: "7c6684b1-b41c-467a-8706-8b5ebb31d3a0"
      })
        .then(res => {
          this.courseOverview = res.data.object.description; //将课程介绍内容绑定到页面相应位置
          this.teachingObjectives = res.data.object.objectives; //将授课目标绑定到页面相应位置
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    //修改授课目标
    modifyCourseObjectives() {
      modify_course_objectives({
        courseId: "7c6684b1-b41c-467a-8706-8b5ebb31d3a0"
      })
        .then(res => {
          this.teachingObjectives = res.data.object.objectives; //将课程介绍内容绑定到页面相应位置
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    //获取所有章节
    getChapterAnd_UnitList() {
      get_chapter_and_unit_list()
        .then(res => {
          let obj = res.data.object;
          let databox = [];
          for (let i = 0; i < obj.length; i++) {
            let item = res.data.object[i];
            databox[i] = {};

            databox[i].id = item.id;
            databox[i].name = item.name;
            databox[i].section = i + 1;
            let units = [];
            for (let j = 0; j < item.units.length; j++) {
              units[j] = {};
              units[j].id = item.units[j].id;
              units[j].name = item.units[j].name;
              units[j].section = i + 1 + "." + (j + 1);
            }
            databox[i].units = units;
          }
          if (databox.length > 0) {
            this.chapterUnitDate = databox;//将章节内容绑定到页面相应位置
          }
        })
        .catch(function(error) {
          console.log(error);
        });
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
        courseId: "7c6684b1-b41c-467a-8706-8b5ebb31d3a0",
        description: this.courseOverviewInput
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message("修改成功！");
            this.getCourseDescription(); //获取课程介绍内容
          } else {
            this.$message("修改失败！");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
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
        courseId: "7c6684b1-b41c-467a-8706-8b5ebb31d3a0",
        objectives: this.teachingObjectivesInput
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message("修改成功！");
            this.modifyCourseObjectives(); //获取课程介绍内容
          } else {
            this.$message("修改失败！");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    this.getCourseDescription(); //获取课程介绍内容
    //  this.modifyCourseObjectives()
    this.getChapterAnd_UnitList(); //获取所有章节
    //判断学生/老师，隐藏/显示菜单操作按钮
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
.outline {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  padding-bottom: 100px;
  position: relative;
  h3 {
    line-height: 30px;
    padding: 0 30px;
    .Summary {
      position: absolute;
      right: 300px;
    }
    .el-icon-menu {
      color: #409eff;
    }
    .el-icon-s-data {
      color: #9c3c7f;
    }
    .el-icon-reading {
      color: rgb(219, 146, 11);
    }
  }
  .courseOverview {
    padding: 0 200px 0 60px;
    font-size: 16px;
    font-family: 微软雅黑;
    text-indent: 2em;
    line-height: 30px;
  }
  .outline-c {
    padding: 0 60px;
    font-size: 16px;
    font-family: 微软雅黑;
    line-height: 30px;
  }
  .target {
    // margin-top: 30px;
    width: 100%;
    .target-c {
      font-size: 16px;
      font-family: 微软雅黑;
      line-height: 30px;
      padding: 0 200px 0 60px;
      text-indent: 2em;
      line-height: 30px;
    }
  }
}
</style>





