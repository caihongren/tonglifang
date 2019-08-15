<template>
  <div class="box">
    <el-row class="topMain">
      <el-col :span="23" class="colText">
        <h2>课程管理</h2>
      </el-col>
      <el-col :span="1" class="colIcon">
        <span class="icon iconfont newlyAdded" @click="dialogFormVisibleadd = true">&#xe77b;</span>
      </el-col>
    </el-row>
    <template>
      <el-table :data="tableData" border style="width: 100%;" :header-cell-style="{background:'#b2e2f8'}">
        <el-table-column fixed prop="course" label="课程名称" min-width="100"></el-table-column>
        <el-table-column prop="name" label="授课教师" min-width="76"></el-table-column>
        <el-table-column label="班级" min-width="150" prop="classes" :formatter="listclassspan"></el-table-column>
        <el-table-column prop="semester" label="开设学期" min-width="150"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="classunp(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" @click="det(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div style="margin:50px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
    </div>
    <!-- 新增加 -->
    <el-dialog title="新增排课" :visible.sync="dialogFormVisibleadd" class="modify">
      <el-form :model="formadd" :rules="rules">
        <el-form-item label="课程选择*：" :label-width="formLabelWidth">
          <el-select v-model="formadd.course" placeholder="请选择课程" style="">
            <el-option :label="item.course" :value="item.id" :key="item.id" v-for="item in getCourse"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授课教师：" :label-width="formLabelWidth">
          <el-select v-model="formadd.teachers" placeholder="请选择教师">
            <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in teachers"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授课班级：" :label-width="formLabelWidth">
          <el-select v-model="formadd.classId" multiple placeholder="请选择班级">
            <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in getClass"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开设学期：" :label-width="formLabelWidth">
          <el-date-picker type="year" v-model="formadd.semester" value-format="yyyy" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisibleadd = false" size="mini" class="cancel">取 消</el-button>
        <el-button type="primary" @click="addCourse" size="mini" class="Sure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑课程" :visible.sync="dialogFormVisible" class="modify">
      <el-form :model="form" :rules="rules">
        <el-form-item label="课程名称：" :label-width="formLabelWidth">
          <el-input v-model="form.course" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="授课教师：" :label-width="formLabelWidth">
          <template>
            <el-select v-model="form.teachers" placeholder="请选择教师">
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in teachers"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="授课班级：" :label-width="formLabelWidth">
          <el-select v-model="form.classId" placeholder="请选择班级" multiple>
            <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in getClass"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开设学期：" :label-width="formLabelWidth">
          <el-date-picker type="year" v-model="form.semester" value-format="yyyy" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false" size="mini" class="cancel">取 消</el-button>
        <el-button type="primary" @click=" modifyCourseInformation " size="mini" class="Sure">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>
 
<script>
import {
  getCourseList,
  addCourse,
  updateCourseUrl,
  delete_course,
  getTeacherList,
  getStudentList,
  getClassList,
  modify_course_information,
  getCourse
} from "../../API/api";
export default {
  data() {
    return {
      offset: 0,
      limit: 10,
      length: 10,
      currentPage4: 1,
      tableData: [],
      dialogFormVisible: false,
      dialogFormVisibleadd: false,
      rules: {
        course: [
          {
            required: true,
            message: "请输入课程名称",
            trigger: ["change", "blur"]
          }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      formadd: {
        course: "",
        classId: [],
        semester: "",
        teachers: []
      },
      form: {
        id: "",
        course: "",
        classId: [],
        semester: "",
        teachers: []
      },
      getCourse: [],
      teachers: [],
      getClass: [],
      formLabelWidth: "120px"
    };
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val;
     this.getCourseListNew();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.getCourseListNew();
    },
    interface(id) { },
    handleClick(row) { },
    // 编辑
    compileClick(row) { },

    // 教师span化
    listspan(row, column) {
      let list = row[column.property];

      if (list[0] == null || list == "") {
        return;
      }
      if (list.length > 0) {
        let newlist = list[0].name;
        for (let i = 1; i < list.length; i++) {
          newlist += "," + list[i].name;
        }

        return newlist;
      } else {
        return list[0].name;
      }

      // }

      // return 'a'
    },
    // 班级span化
    listclassspan(row, column) {
      let list = row[column.property];

      if (list == null || list == "") {
        return;
      }
      if (list.length > 0) {
        let newlist = list[0].name;
        for (let i = 1; i < list.length; i++) {
          newlist += "," + list[i].name;
        }
        return newlist;
      } else {
        return list[0];
      }
      // }
    },
    addCourse() {
      if (this.formadd.course == "") {
        this.$message({
          showClose: true,
          duration: 1000,
          type: "error",
          message: "请选择课程"
        });
        return;
      }
      if (this.formadd.teachers == "") {
        this.$message({
          showClose: true,
          duration: 1000,
          type: "error",
          message: "请选择教师"
        });
        return;
      }
      if (this.formadd.classId == "") {
        this.$message({
          showClose: true,
          duration: 1000,
          type: "error",
          message: "请选择班级"
        });
        return;
      }
      let from = this.formadd;
      addCourse({
        courseId: from.course,
        teacherId: from.teachers,
        classId: from.classId,
        semester: from.semester
      })
        .then(res => {
          if (res.data.code == "0") {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "拆分成功",
              type: "success"
            });
            this.getCourseListNew();

            this.dialogFormVisibleadd = false;
            this.formadd = {
              course: "",
              classId: [],
              semester: "",
              teachers: []
            };
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              type: "error",
              message: res.data.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            showClose: true,
            duration: 1000,
            type: "error",
            message: "添加失败"
          });
        });
    },

    // 进入编辑
    classunp(row) {
      let froms = {
        id: row.id,
        course: row.course,
        courseId: row.courseId,
        classId: [],
        semester: row.semester,
        teachers: row.teacherId
      };
      for (let i = 0; i < row.classes.length; i++) {
        froms.classId.push(row.classes[i].id);
      }

      this.form = froms;

      this.dialogFormVisible = true;
    },

    // 编辑
    modifyCourseInformation() {
      if (
        this.form.course != "" &&
        this.form.classId.length > 0 &&
        this.form.teachers.length > 0
      ) {
        this.dialogFormVisible = false;
        let from = this.form;
        modify_course_information({
          id: from.id,
          courseId: from.courseId,
          teacherId: from.teachers,
          classId: from.classId,
          semester: from.semester
        }).then(res => {
          if (res.data.code == "0") {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "编辑成功",
              type: "success"
            });

            this.getCourseListNew();
            this.getTeacherListNew();
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              type: "error",
              message: res.data.msg
            });
          }
        });
      } else {
        this.$message({
          showClose: true,
          duration: 1000,
          type: "error",
          message: "教师或班级名称为空"
          // type: "warning"
        });
      }
    },
    // 删除
    det(row) {
      this.$confirm("此操作将永久删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delete_course({
            id: row.id
          }).then(res => {
            this.getCourseListNew();
            this.$message({
              showClose: true,
              duration: 1000,
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            duration: 1000,
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 加载关系课程列表
    getCourseListNew() {
      getCourseList({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        this.tableData = res.data.object;
        this.length = res.data.length;
        // this.tableData.teacher=this.listspan(res.data.object.accounts);
      });
    },
    // 加载课程列表
    getCourseNew() {
      getCourse({
        offset: 0,
        limit: 10000
      }).then(res => {
        this.getCourse = res.data.object;
      });
    },
    // 加载教师列表
    getTeacherListNew() {
      getTeacherList({
        offset: this.offset,
        limit: 10000
      }).then(res => {
        this.teachers = res.data.object;
      });
    },
    // 加载班级列表
    getClassListNew() {
      getClassList({
        offset: this.offset,
        limit: 10000
      }).then(res => {
        this.getClass = res.data.object;
      });
    }
  },
  mounted() { },
  created() {
    this.getCourseListNew();
    this.getTeacherListNew();
    this.getClassListNew();
    this.getCourseNew();
  }
};
</script>

<style lang="less" scoped>
.box {
  padding: 20px;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  overflow: auto;
  .topMain {
    height: 50px;
    .colText {
      height: 100%;
      h2 {
        text-align: center;
        color: #0098e8;
      }
    }
    .colIcon {
      height: 100%;
      .newlyAdded {
        color: #9b9b9b;
        font-size: 18px;
        cursor: pointer;
        position: absolute;
        right: 60px;
        top: 20px;
      }
    }
  }
  .el-select{
    width: 100%
  }
}
</style>
<style >
.box .el-button--text {
  color: #9b9b9b;
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
.modify .el-dialog__title{
  color: #00a0e9;
}
</style>

