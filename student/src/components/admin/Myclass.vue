<template>
  <div class="box">
    <div>
      <div class="add">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid-content bg-purple" style="padding:15px 30px">
              <el-button type="primary" @click="dialogFormVisibleadd = true">新增班级</el-button>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="grid-content bg-purple">
              <h2>班级管理</h2>
            </div>
          </el-col>
        </el-row>
      </div>
      <template>
        <el-table :data="tableData" border style="width: 90%;margin:5px 3%">
          <el-table-column fixed prop="major" label="专业" min-width="200"></el-table-column>
          <el-table-column prop="startYear" label="入学年" min-width="200"></el-table-column>
          <el-table-column prop="name" label="班级名称" min-width="200"></el-table-column>
          <el-table-column prop="length" label="学生人数" min-width="200"></el-table-column>

          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button
                @click="compileClick(scope.row),dialogFormVisible = true"
                type="primary"
                size="small"
              >编辑</el-button>
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
          <el-form-item label="专业*：" :label-width="formLabelWidth" prop="major">
            <el-input v-model="formadd.major" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="入学年：" :label-width="formLabelWidth">
            <!-- <el-select v-model="formadd.startYear" placeholder="请选择入学年">
            <el-option label="2019" value="2019"></el-option>
            <el-option label="2020" value="2020"></el-option>
            </el-select>-->
            <el-date-picker
              type="year"
              v-model="formadd.startYear"
              value-format="yyyy"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="班级名称：" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formadd.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="学生*：" :label-width="formLabelWidth">
            <el-button type="primary" @click="innerVisibleadd = true">选择</el-button>
          </el-form-item>
        </el-form>
        <!-- 学生穿梭框 -->
        <el-dialog width="35%" title="新增选择学生" :visible.sync="innerVisibleadd" append-to-body>
          <el-transfer
            v-model="value3"
            filterable
            :render-content="renderFunc"
            :titles="['未分配学生','班级']"
            :button-texts="[]"
            :props="{
      key: 'id',
      label: 'name'
    }"
            :data="dataadd"
          ></el-transfer>
          <div style="margin:20px;padding-left:60%;padding-top:20px;">
            <el-button @click="innerVisibleadd = false">取 消</el-button>
            <el-button type="primary" @click="  addstudentsonclk">确 定</el-button>
          </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
          <el-button type="primary" @click="  addclass">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑 -->
      <el-dialog title="编辑课程" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules">
          <el-form-item label="专业*：" :label-width="formLabelWidth" prop="major">
            <el-input v-model="form.major" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="入学年：" :label-width="formLabelWidth">
            <!-- <el-select v-model="form.startYear" placeholder="请选择入学年">
              <el-option label="2019" value="2019"></el-option>
              <el-option label="2020" value="2020"></el-option>
            </el-select>-->

            <el-date-picker
              type="year"
              v-model="form.startYear"
              value-format="yyyy"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="班级名称：" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="学生*：" :label-width="formLabelWidth">
            <el-button type="primary" @click="innerVisible = true">选择</el-button>
          </el-form-item>
        </el-form>
        <!-- 学生穿梭框 -->
        <el-dialog width="35%" title="编辑选择学生" :visible.sync="innerVisible" append-to-body>
          <el-transfer
            v-model="value2"
            filterable
            :render-content="renderFunc"
            :titles="['未分配学生','班级']"
            :button-texts="[]"
            :props="{
      key: 'id',
      label: 'name'
    }"
            @change="handleChange"
            :data="data"
          ></el-transfer>
          <div style="margin:20px;padding-left:60%;padding-top:20px;">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="  modifystudents">确 定</el-button>
          </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click=" modifyClassNew">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
 
<script>
import {
  getClassList,
  addClass,
  modifyClass,
  deleteClass,
  getStudentList,
  get_students_no_class
} from "../../API/api";
export default {
  data() {
    return {
      data: [],
      value2: [],
      dataadd: [],
      value3: [],
      studentNew: [],
      renderFunc(h, option) {
        return (
          <span style="width:100px;display: inline-block;">{option.name}</span>
        );
      },
      offset: 0,
      limit: 10,
      length: 20,
      currentPage4: 1,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },

      tableData: [
        {
          id: "id",
          major: "专业",
          startYear: "入学年份",
          name: "名称",
          length: "学生人数",
          students: [
            {
              id: "id",
              number: "学号",
              name: "姓名",
              gender: "性别",
              age: "年龄",
              phone: "电话",
              email: "邮箱"
            }
          ]
        }
      ],
      rules: {
        major: [{ required: true, message: "请输入专业名称", trigger: "blur" }],
        name: [{ required: true, message: "请输入班级名称", trigger: "blur" }]
      },
      dialogFormVisible: false,
      dialogFormVisibleadd: false,
      innerVisibleadd: false,
      innerVisible: false,
      formadd: {
        major: "",
        startYear: "",
        name: "",
        students: []
      },
      form: {
        id: "id",
        major: "专业",
        startYear: "入学年份",
        name: "名称",

        addStudents: [],
        deleteStudents: []
      },

      formLabelWidth: "120px"
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getClassListNew();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.offset = (val-1) * this.limit;
      this.getClassListNew();
    },
    // 修改编辑学生
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
      console.log(this.form);
      if (direction == "left") {
        // 减少人员
        for (let i = 0; i < movedKeys.length; i++) {
          this.form.deleteStudents.push(movedKeys[i]);
        }
      } else if (direction == "right") {
        // 增加人员

        for (let i = 0; i < movedKeys.length; i++) {
          this.form.addStudents.push(movedKeys[i]);
        }
      }
    },
    // 数组去重
    newlist(oldArr) {
      let allArr = []; //新数组
      for (var i = 0; i < oldArr.length; i++) {
        var flag = true;
        for (var j = 0; j < allArr.length; j++) {
          if (oldArr[i] == allArr[j]) {
            flag = false;
          }
        }
        if (flag) {
          allArr.push(oldArr[i]);
        }
      }

      return allArr;
    },
    interface(id) {
      console.log(id);
    },
    handleClick(row) {
      console.log(row);
    },
    // 新增加班级
    addclass() {
      console.log(this.formadd.students);
      if (this.formadd.students.length < 1) {
        this.$message.error({
          message: "班级学生为空",
          type: "warning"
        });
        return;
      }

      if (this.formadd.major != "" && this.formadd.name != "") {
        this.dialogFormVisibleadd = false;
        //  this.formadd.students.splice(0, 1);

        console.log(this.formadd);
        addClass(this.formadd)
          .then(res => {
            console.log(res);
            if (res.data.code == "0") {
              this.getStudentListNew();
              this.getClassListNew();
            } else if (res.data.code == "-1") {
              this.$message.error({
                message: "专业班级命名重复，添加失败",
                type: "warning"
              });
            } else {
              this.$message.error({
                message: "专业班级错误，添加失败",
                type: "warning"
              });
            }
          })
          .catch(() => {
            this.$message.error({
              message: "专业班级命名重复，添加失败",
              type: "warning"
            });
          });
      } else {
        this.$message.error({
          message: "专业或班级名称填写错误",
          type: "warning"
        });
      }
    },
    // 修改选中add的学生
    addstudentsonclk() {
      let student = this.value3;
      // this.formadd.students=student.splice(0,1)
      this.formadd.students = student;
      console.log(this.formadd.students);
      this.innerVisibleadd = false;
    },
    // 编辑学生
    modifystudents() {
      this.form.addStudents = this.newlist(this.form.addStudents);
      this.form.deleteStudents = this.newlist(this.form.deleteStudents);

      this.innerVisible = false;
    },
    // 取消编辑
    cancel() {},
    // 编辑
    compileClick(row) {
      console.log(row);
      this.data = [];
      //  this.data=this.studentNew
      //   console.log(this.studentNew)

      this.value2 = [];
      let forms = {
        id: row.id,
        major: row.major,
        name: row.name,
        startYear: row.startYear,
        addStudents: [],
        deleteStudents: []
      };
      // console.log(this.form);
      this.form = forms;
      if (row.students.length > 0) {
        for (let i = 0; i < row.students.length; i++) {
          this.data.push(row.students[i]);
          this.value2.push(row.students[i].id);
        }
      }
      get_students_no_class({
        offset: this.offset,
        limit: 1000
      }).then(res => {
        let students = this.data;
        for (let i = 0; i < res.data.object.length; i++) {
          students.push(res.data.object[i]);
        }
        this.data = students;
        this.getStudentListNew();
      });

      this.dialogFormVisible = true;
    },
    // 编辑修改确定

    modifyClassNew() {
      console.log(this.form);

      if (this.form.major != "" && this.form.name != "") {
        this.dialogFormVisible = false;
        //  this.formadd.students.splice(0, 1);

        console.log(this.form);
        modifyClass(this.form).then(res => {
          console.log(res);

          this.getClassListNew();
          this.getStudentListNew();
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
      this.$confirm("此操作将永久删除班级, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(row);
          deleteClass({
            id: row.id
          }).then(res => {
            this.getClassListNew();
            this.getStudentListNew();
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
    // 加载班级列表
    getClassListNew() {
      getClassList({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        console.log(res);
        this.tableData = res.data.object;
        this.length = res.data.length;
      });
    },
    getStudentListNew() {
      get_students_no_class({
        offset: this.offset,
        limit: 1000
      }).then(res => {
        console.log(res, "学生列表");
        this.dataadd = res.data.object;
        this.data = res.data.object;
        this.studentNew = res.data.object;
        let students = [];
        for (let i = 0; i < res.data.object.length; i++) {
          students.push(res.data.object[i]);
        }
        this.studentNew = students;
      });
    }
  },
  mounted() {},
  created() {
    this.getClassListNew();
    this.getStudentListNew();
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
