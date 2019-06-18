<template>
  <div class="box">
    <div>
      <div class="add">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid-content bg-purple" style="padding:15px 30px">
              <el-button type="primary" @click="dialogFormVisibleadd = true">新增课程</el-button>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="grid-content bg-purple">
              <h2>课程管理</h2>
            </div>
          </el-col>
        </el-row>
      </div>
      <template>
        <el-table :data="tableData" border style="width: 90%;margin:5px 3%">
          <el-table-column fixed prop="name" label="课程名称" min-width="200"></el-table-column>
          <el-table-column prop="accounts" label="授课教师" min-width="150" :formatter="listspan"></el-table-column>
          <el-table-column label="班级" min-width="300" prop="classes" :formatter="listclassspan"></el-table-column>
          <el-table-column prop="semester" label="开设学期" min-width="300"></el-table-column>

          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button @click="classunp(scope.row)" type="primary" size="small">编辑</el-button>
              <el-button type="primary" @click="det(scope.row)" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
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
      <!-- 新增加 -->
      <el-dialog title="新增课程" :visible.sync="dialogFormVisibleadd">
        <el-form :model="formadd" :rules="rules">
          <el-form-item label="课程名称*：" :label-width="formLabelWidth" prop="course">
            <el-input v-model="formadd.course" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="授课老师：" :label-width="formLabelWidth">
            <el-select v-model="formadd.teachers" multiple placeholder="请选择老师">
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in teachers" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授课班级：" :label-width="formLabelWidth">
            <el-select v-model="formadd.classId" multiple placeholder="请选择班级">
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in getClass"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开设学期：" :label-width="formLabelWidth">
            <!-- <el-select v-model="formadd.semester" placeholder="请选择开设学期">
            <el-option label="2019" value="2019"></el-option>
            <el-option label="2020" value="2020"></el-option>
            </el-select>-->
            <el-date-picker
              type="year"
              v-model="formadd.semester"
              value-format="yyyy"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
          <el-button type="primary" @click="addCourse">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog title="编辑课程" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules">
          <el-form-item label="课程名称*：" :label-width="formLabelWidth" prop="course">
            <el-input v-model="form.course" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="授课老师：" :label-width="formLabelWidth">
            <template>
              <el-select v-model="form.teachers" placeholder="请选择老师" multiple>
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in teachers" ></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="授课班级：" :label-width="formLabelWidth">
            <el-select v-model="form.classId" placeholder="请选择班级" multiple>
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in getClass"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开设学期：" :label-width="formLabelWidth">
            <!-- <el-select v-model="form.semester" placeholder="请选择开设学期">
            <el-option label="1" value="man"></el-option>
            <el-option label="2" value="woman"></el-option>
            </el-select>-->
            <el-date-picker
              type="year"
              v-model="form.semester"
              value-format="yyyy"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click=" modifyCourseInformation ">确 定</el-button>
        </div>
      </el-dialog>
    </div>
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
  modify_course_information
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
        course: [{ required: true, message: "请输入课程名称", trigger: "blur" }]
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
        name: "",
        semester: "",
        classes: {},
        accounts: [
          {
            id: "id",
            name: "姓名",
            gender: "性别",
            age: "年龄",
            phone: "电话",
            email: "邮箱"
          }
        ]
      },
      teachers: [],
      getClass: [],
      formLabelWidth: "120px"
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      getCourseListNew();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.offset = val * this.limit;
      getCourseListNew();
    },
    interface(id) {
      console.log(id);
    },
    handleClick(row) {
      console.log(row);
    },
    // 编辑
    compileClick(row) {},
    // 删除
    det(row) {
      this.$confirm("此操作将永久删除该老师, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 教师span化
    listspan(row, column) {
      let list = row[column.property];

      if (list[0] == null || list == "") {
        return;
      }
      // console.log(list,"span")
      if (list.length > 0) {
        let newlist = list[0].name;
        for (let i = 1; i < list.length; i++) {
          newlist += "," + list[i].name;
        }

        return newlist;
      } else {
        return list[0].name;
      }

      // console.log(newlist)
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

      // console.log(newlist)
      // }
    },
    addCourse() {
      console.log(this.formadd);
      addCourse(this.formadd).then(res => {
        console.log(res);
        this.getCourseListNew();
        this.dialogFormVisibleadd = false;
      });
    },

    // 进入编辑
    classunp(row) {
      console.log(row);
      let froms = {
        id: row.id,
        course: row.name,
        classId: [],
        semester: row.semester,
        teachers: []
      };
      for (let i = 0; i < row.classes.length; i++) {
        froms.classId.push(row.classes[i].id);
      }
      for (let i = 0; i < row.accounts.length; i++) {
        froms.teachers.push(row.accounts[i].id);
      }

      // console.log(this.from);
      console.log(this.form);
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

        //  this.formadd.students.splice(0, 1);

        console.log(this.form);
        modify_course_information(this.form).then(res => {
          console.log(res);

          this.getCourseListNew();
          this.getTeacherListNew();
        });
      } else {
        this.$message.error({
          message: "专业或班级名称填写错误",
          type: "warning"
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
          console.log(row.id);
          delete_course({
            id: row.id
          }).then(res => {
            console.log(res);
            this.getCourseListNew();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 加载课程列表
    getCourseListNew() {
      getCourseList({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        console.log(res, "checheng");
        this.tableData = res.data.object;
        this.length = res.data.length;
        // this.tableData.teacher=this.listspan(res.data.object.accounts);
        // console.log()
      });
    },
    // 加载老师列表
    getTeacherListNew() {
      getTeacherList({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        console.log(res, "老师列表");
        this.teachers = res.data.object;
      });
    },
    // 加载班级列表
    getClassListNew() {
      getClassList({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        console.log(res, "班级列表");
        this.getClass = res.data.object;
      });
    }
  },
  mounted() {},
  created() {
    this.getCourseListNew();
    this.getTeacherListNew();
    this.getClassListNew();
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 99%;
  margin: 5px 0.5%;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 790px;
  overflow: auto;
}
.add {
  margin: 10px;
  padding: 10px;
}
h2 {
  text-align: center;
}
.left {
  border: 2px solid #ccc;
  margin: 5px;
  height: 500px;
  .ul {
    width: 100%;
    padding: 0;
    li {
      width: 95%;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      border: 1px solid black;
      margin: 2.5%;
      text-align: center;
      border-radius: 5px;
      h3 {
        margin: 0;
      }
    }
  }
}
</style>
