<template>
  <div class="box">
    <el-row class="topMain">
      <el-col :span="23" class="colText">
        <h2>班级管理</h2>
      </el-col>
      <el-col :span="1" class="colIcon">
        <span class="icon iconfont newlyAdded" @click="dialogFormVisibleadd = true">&#xe6e8;</span>
      </el-col>
    </el-row>
    <template>
      <el-table :data="tableData" border style="width: 100%;" :header-cell-style="{background:'#b2e2f8'}">
        <el-table-column fixed prop="major" label="专业" min-width="200"></el-table-column>
        <el-table-column prop="startYear" label="入学年" min-width="200"></el-table-column>
        <el-table-column prop="name" label="班级名称" min-width="200"></el-table-column>
        <el-table-column prop="length" label="学生人数" min-width="200"></el-table-column>

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="compileClick(scope.row),dialogFormVisible = true" type="text" size="small">编辑</el-button>
            <el-button type="text" @click="outerVisible = true">删除</el-button>
            <!-- <el-button type="text" @click="det(scope.row)" size="small">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div style="margin:50px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
    </div>

     <el-dialog title="是否删除机械工程2019 7班" :visible.sync="outerVisible">
      <el-dialog width="30%" title="删除将无法撤回，是否继续删除" :visible.sync="innerVisible" append-to-body>
         <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="det(scope.row)">确定</el-button>
      </el-dialog>
      <div slot="footer" >
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增加 -->
    <el-dialog title="新增班级" :visible.sync="dialogFormVisibleadd" class="modify">
      <el-form :model="formadd" :rules="rules">
        <el-form-item label="专业*：" :label-width="formLabelWidth" prop="major">
          <el-input v-model="formadd.major" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="入学年：" :label-width="formLabelWidth">
          <el-date-picker type="year" v-model="formadd.startYear" value-format="yyyy" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="班级名称：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="formadd.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生*：" :label-width="formLabelWidth">
          <el-button type="primary" @click="innerVisibleadd = true">选择</el-button>
        </el-form-item>
      </el-form>
      <!-- 学生穿梭框 -->
      <el-dialog width="35%" title="新增选择学生" :visible.sync="innerVisibleadd" append-to-body class="modify">
        <el-transfer v-model="value3" filterable :render-content="renderFunc" :titles="['未分配学生','班级']" :button-texts="[]" :props="{
      key: 'id',
      label: 'name'
    }" :data="dataadd"></el-transfer>
        <div style="margin:20px;padding-left:60%;padding-top:20px;">
          <el-button type="primary" @click="innerVisibleadd = false" size="mini" class="cancel">取 消</el-button>
          <el-button type="primary" @click="  addstudentsonclk" size="mini" class="Sure">确 定</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisibleadd = false" size="mini" class="cancel">取 消</el-button>
        <el-button type="primary" @click="  addclass" size="mini" class="Sure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑课程" :visible.sync="dialogFormVisible" class="modify">
      <el-form :model="form" :rules="rules">
        <el-form-item label="专业*：" :label-width="formLabelWidth" prop="major">
          <el-input v-model="form.major" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="入学年：" :label-width="formLabelWidth">
          <el-date-picker type="year" v-model="form.startYear" value-format="yyyy" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="班级名称：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生*：" :label-width="formLabelWidth">
          <el-button type="primary" @click="innerVisible = true" class="Sure" size="mini">选择</el-button>
        </el-form-item>
      </el-form>
      <!-- 学生穿梭框 -->
      <el-dialog width="35%" title="编辑选择学生" :visible.sync="innerVisible" append-to-body class="modify">
        <el-transfer v-model="value2" filterable :render-content="renderFunc" :titles="['未分配学生','班级']" :button-texts="[]" :props="{
      key: 'id',
      label: 'name'
    }" @change="handleChange" :data="data"></el-transfer>
        <div style="margin:20px;padding-left:60%;padding-top:20px;" class="dialog-footer">
          <el-button type="primary" @click="innerVisible = false" size="mini" class="cancel"> 取 消</el-button>
          <el-button type="primary" @click="  modifystudents" size="mini" class="Sure">确 定</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false" size="mini" class="cancel">取 消</el-button>
        <el-button type="primary" @click=" modifyClassNew" size="mini" class="Sure">确 定</el-button>
      </div>
    </el-dialog>
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
      outerVisible: false,
      innerVisible: false,
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
      this.limit = val;
      this.getClassListNew();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.getClassListNew();
    },
    // 修改编辑学生
    handleChange(value, direction, movedKeys) {
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
    interface(id) { },
    handleClick(row) { },
    // 新增加班级
    addclass() {
      // if (this.formadd.students.length < 1) {
      //   this.$message.error({
      //     showClose: true,
      //     duration: 1000,
      //     message: "班级学生为空",
      //     type: "warning"
      //   });
      //   return;
      // }

      if (this.formadd.major != "" && this.formadd.name != "") {
        this.dialogFormVisibleadd = false;
        //  this.formadd.students.splice(0, 1);

        addClass(this.formadd)
          .then(res => {
            if (res.data.code == "0") {
              this.$message({
                showClose: true,
                duration: 1000,
                message: "新增班级成功",
                type: "success"
              });
              this.getStudentListNew();
              this.getClassListNew();
              this.formadd = {
                major: "",
                startYear: "",
                name: "",
                students: []
              };
            } else if (res.data.code == "-1") {
              this.$message.error({
                showClose: true,
                duration: 1000,
                message: "专业班级命名重复，添加失败",
                type: "warning"
              });
            } else {
              this.$message.error({
                showClose: true,
                duration: 1000,
                message: "专业班级错误，添加失败",
                type: "warning"
              });
            }
          })
          .catch(() => {
            this.$message.error({
              showClose: true,
              duration: 1000,
              message: "专业班级命名重复，添加失败",
              type: "warning"
            });
          });
      } else {
        this.$message.error({
          showClose: true,
          duration: 1000,
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
      this.innerVisibleadd = false;
    },
    // 编辑学生
    modifystudents() {
      this.form.addStudents = this.newlist(this.form.addStudents);
      this.form.deleteStudents = this.newlist(this.form.deleteStudents);

      this.innerVisible = false;
    },
    // 取消编辑
    cancel() { },
    // 编辑
    compileClick(row) {
      this.data = [];
      //  this.data=this.studentNew

      this.value2 = [];
      let forms = {
        id: row.id,
        major: row.major,
        name: row.name,
        startYear: row.startYear,
        addStudents: [],
        deleteStudents: []
      };
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
      });

      this.dialogFormVisible = true;
    },
    // 编辑修改确定

    modifyClassNew() {
      if (this.form.major != "" && this.form.name != "") {
        this.dialogFormVisible = false;
        //  this.formadd.students.splice(0, 1);

        modifyClass(this.form).then(res => {
          this.getClassListNew();
          this.getStudentListNew();
          this.$message({
            showClose: true,
            duration: 1000,
            message: "编辑成功",
            type: "success"
          });
        });
      } else {
        this.$message.error({
          showClose: true,
          duration: 1000,
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
          deleteClass({
            id: row.id
          }).then(res => {
            this.getClassListNew();
            this.getStudentListNew();
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
    // 加载班级列表
    getClassListNew() {
      getClassList({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        this.tableData = res.data.object;
        this.length = res.data.length;
      });
    },
    getStudentListNew() {
      get_students_no_class({
        offset: this.offset,
        limit: 1000
      }).then(res => {
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
  mounted() { },
  created() {
    this.getClassListNew();
    this.getStudentListNew();
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
.modify .el-dialog__title {
  color: #00a0e9;
}
</style>
