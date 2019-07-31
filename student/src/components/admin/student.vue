<template>
  <div class="box">
    <div>
      <div class="add">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid-content bg-purple" style="padding:15px 30px">
              <el-button type="primary" @click="dialogFormVisibleadd = true">新增学生</el-button>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="grid-content bg-purple">
              <h2>学生管理</h2>
            </div>
          </el-col>
        </el-row>
      </div>
      <template>
        <el-table :data="tableData" border style="width: 90%;margin:5px 3%">
          <el-table-column fixed prop="number" label="学号" min-width="50"></el-table-column>
          <el-table-column prop="name" label="学生名称" min-width="75"></el-table-column>
          <el-table-column prop="gender" label="性别" min-width="60"></el-table-column>
          <el-table-column prop="age" label="年龄" min-width="60"></el-table-column>
          <el-table-column prop="phone" label="电话" min-width="100"></el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="100"></el-table-column>
          <el-table-column prop="classes" label="已编班级" min-width="150"></el-table-column>

          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button @click="compileClick(scope.row)" type="primary" size="small">编辑</el-button>
              <el-button type="primary" @click="det(scope.row.id)" size="small">删除</el-button>
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
      <el-dialog title="新增学生" :visible.sync="dialogFormVisibleadd">
        <el-form :model="formadd" :rules="rules">
          <el-form-item label="学号*：" :label-width="formLabelWidth" prop="number">
            <el-input v-model="formadd.number" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="学生名称*：" :label-width="formLabelWidth " prop="name">
            <el-input v-model="formadd.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别：" :label-width="formLabelWidth">
            <el-select v-model="formadd.gender" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄：" :label-width="formLabelWidth">
            <el-input v-model="formadd.age" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话*：" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="formadd.phone" auto-complete="off" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" :label-width="formLabelWidth">
            <el-input v-model="formadd.email" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
          <el-button type="primary" @click=" addstudent">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog title="编辑学生" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules">
          <el-form-item label="学号*：" :label-width="formLabelWidth" prop="number">
            <el-input v-model="form.number" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="学生名称*：" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别：" :label-width="formLabelWidth">
            <el-select v-model="form.gender" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄：" :label-width="formLabelWidth">
            <el-input v-model="form.age" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话*：" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="form.phone" auto-complete="off" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" :label-width="formLabelWidth">
            <el-input v-model="form.email" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifystudent">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
 
<script>
import {
  getStudentList,
  addStudent,
  modifyStudent,
  deleteStudent
} from "../../API/api";
export default {
  data() {
    return {
      offset: 0,
      limit: 10,
      length: 20,
      currentPage4: 1,
      tableData: [],
      rules: {
        name: [{ required: true, message: "请输入学生名称", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "长度为11 个字符的电话号码",
            trigger: "blur"
          }
        ],
        number: [
          { required: true, message: "请输入学号", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度为1到20 个字符的数字",
            trigger: "blur"
          }
        ]
      },
      dialogFormVisible: false,
      dialogFormVisibleadd: false,
      formadd: {
        number: "",
        name: "",
        gender: "男",
        age: "",
        phone: "",
        email: ""
      },
      form: {
        id: "",
        number: "",
        name: "",
        gender: "男",
        age: "",
        phone: "",
        email: "",
        classes: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val;
      this.getStudentListNew();
    },
    handleCurrentChange(val) {
      this.offset = (val-1) * this.limit;
      this.getStudentListNew();
    },
    interface(id) {
    },
    handleClick(row) {
    },
    addstudent() {
      let mReg = /^1(3|5|7|8)\d{9}$/;
      let pReg = /^\w{6,12}$/;
      if (
        this.formadd.name != "" &&
        mReg.test(this.formadd.phone) &&
        this.formadd.number.length > 0
      ) {
        // 正则匹配手机验证;

        this.dialogFormVisibleadd = false;
        this.formadd.age = Number(this.formadd.age);
        addStudent(this.formadd)
          .then(res => {
            this.getStudentListNew();
          })
          .catch(() => {
            this.$message.error({
              message: "手机号码重复或者错误",
              type: "warning"
            });
          });
      } else {
        this.$message.error({
          message: "名称.学号或电话号码格式错误",
          type: "warning"
        });
      }
    },
    // 编辑
    compileClick(row) {
      let froms = {
        id: row.id,
        number: row.number,
        name: row.name,
        gender: row.gender,
        age: row.age,
        phone: row.phone,
        email: row.email,
        class: row.class
      };
      this.form = froms;

      this.dialogFormVisible = true;
    },
    modifystudent() {
      let mReg = /^1(3|5|7|8)\d{9}$/;
      let pReg = /^\w{6,12}$/;
      if (
        this.form.name != "" &&
        mReg.test(this.form.phone) &&
        this.form.number.length > 0
      ) {
        this.dialogFormVisible = false;

        this.form.age = Number(this.form.age);
        modifyStudent(this.form)
          .then(res => {
            this.getStudentListNew();
          })
          .catch(() => {
            this.$message.error({
              message: "手机号码重复或者错误",
              type: "warning"
            });
          });
      } else {
        this.$message.error({
          message: "名称，学号或电话号码格式错误",
          type: "warning"
        });
      }
    },
    // 删除
    det(id) {
      this.$confirm("此操作将永久删除该学生, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteStudent({
            id: id
          }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getStudentListNew();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //获取学生
    getStudentListNew() {
      getStudentList({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        this.tableData = res.data.object;

        this.length = res.data.length;
      });
    }
  },
  mounted() {},
  created() {
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
