<template>
  <div class="box">
    <el-row class="topMain">
      <el-col :span="1">
        <el-button type="primary" size="mini">下载模板</el-button>
      </el-col>
      <el-col :span="2">
        <el-upload action="/img/add_training_resource">
          <el-button type="primary" size="mini" style="margin:0px 25px">导入</el-button>
        </el-upload>
      </el-col>
      <el-col :span="16" class="colText">
        <h2>学生管理</h2>
      </el-col>
      <el-col :span="1" class="colIcon">
        <span class="icon iconfont newlyAdded" @click="dialogFormVisibleadd = true">&#xe6e8;</span>
      </el-col>
    </el-row>
    <template>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{background:'#b2e2f8'}"
      >
        <el-table-column fixed prop="number" label="学号/账号" min-width="30"></el-table-column>
        <el-table-column prop="name" label="学生名称" min-width="20"></el-table-column>
        <el-table-column prop="gender" label="性别" min-width="20"></el-table-column>
        <el-table-column prop="age" label="年龄" min-width="20"></el-table-column>
        <el-table-column prop="phone" label="电话/账号" min-width="40"></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="40"></el-table-column>
        <el-table-column prop="classes" label="已编班级" min-width="50"></el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button @click="compileClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" @click="outerVisible = true">删除</el-button>
            <!-- <el-button type="text" @click="det(scope.row.id)" size="small">删除</el-button> -->
            <el-button type="text" @click="changePassword(scope.row.id)" size="small">更改密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
     <el-dialog title="是否删除机械工程2019 6班 柯达同学" :visible.sync="outerVisible">
      <el-dialog width="30%" title="删除将无法撤回，是否继续删除" :visible.sync="innerVisible" append-to-body>
         <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="det(scope.row)">确定</el-button>
      </el-dialog>
      <div slot="footer" >
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">确定</el-button>
      </div>
    </el-dialog>
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
    <el-dialog title="新增学生" :visible.sync="dialogFormVisibleadd" class="modify">
      <el-form :model="formadd" :rules="rules" ref="formadd">
        <el-form-item label="学号：" :label-width="formLabelWidth" prop="number">
          <el-input v-model="formadd.number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生名称：" :label-width="formLabelWidth " prop="name">
          <el-input v-model="formadd.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话：" :label-width="formLabelWidth" prop="phone">
          <el-input
            v-model="formadd.phone"
            auto-complete="off"
            maxlength="11"
            placeholder="请输入电话号码（必填）"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别：" :label-width="formLabelWidth">
          <el-select v-model="formadd.gender" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄：" :label-width="formLabelWidth" prop="age">
          <el-input v-model="formadd.age" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱：" :label-width="formLabelWidth" prop="email">
          <el-input v-model="formadd.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogFormVisibleadd = false"
          size="mini"
          class="cancel"
        >取 消</el-button>
        <el-button type="primary" @click=" addstudent('formadd')" size="mini" class="Sure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑学生" :visible.sync="dialogFormVisible" class="modify">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="学号：" :label-width="formLabelWidth" prop="number">
          <el-input v-model="form.number" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话：" :label-width="formLabelWidth" prop="phone">
          <el-input
            v-model="form.phone"
            auto-complete="off"
            maxlength="11"
            placeholder="请输入电话号码（必填）"
          ></el-input>
        </el-form-item>
        <el-form-item label="学生名称：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" auto-complete="off" placeholder="请输入名称（必填）"></el-input>
        </el-form-item>
        <el-form-item label="性别：" :label-width="formLabelWidth">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄：" :label-width="formLabelWidth" prop="age">
          <el-input v-model="form.age" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱：" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false" size="mini" class="cancel">取 消</el-button>
        <el-button type="primary" @click="modifystudent('form')" size="mini" class="Sure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更改密码弹出框 -->
    <el-dialog
      type="password"
      :visible.sync="changePasswordVisible"
      append-to-body
      width="25%"
      top="15vh"
      title="更改密码"
      class="modify"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="请输入密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')" size="mini" class="Sure">提交</el-button>
          <el-button type="primary" @click="resetForm('ruleForm')" size="mini" class="Reset">重置</el-button>
          <el-button
            type="primary"
            @click="changePasswordResources('ruleForm')"
            size="mini"
            class="cancel"
          >取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
 
<script>
import {
  getStudentList,
  addStudent,
  modifyStudent,
  deleteStudent,
  changePassword //修改用户密码
} from "../../API/api";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error("请输入6到12位密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      nowUserId: "", //当前选中的用户id
  outerVisible: false,
      innerVisible: false,
      changePasswordVisible: false,
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
            pattern: /^1(3|5|7|8)\d{9}$/,
            message: "请输入正确的电话号码",
            trigger: ["blur", "change"]
          }
        ],
        number: [
          { required: true, message: "请输入学号", trigger: "blur" },
          {
            pattern: /^[0-9]{1,20}$/,
            min: 0,
            max: 20,
            message: "长度为1到20 个字符的数字",
            trigger: ["blur", "change"]
          }
        ],
        age: [
          {
            pattern: /^[0-9]{0,2}$/,
            message: "年龄为0到99岁",
            trigger: ["blur", "change"]
          }
        ],
        email: [
          {
            required: false,
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        pass: [{ validator: validatePass, trigger: ["blur", "change"] }],
        checkPass: [{ validator: validatePass2, trigger: ["blur", "change"] }]
      },
      dialogFormVisible: false,
      dialogFormVisibleadd: false,

      // 提交的表单
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
      ruleForm: {
        pass: "",
        checkPass: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    // 密码提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changePasswordVisible = false;
          changePassword({
            userId: this.nowUserId,
            password: this.ruleForm.pass
          })
            .then(res => {
              this.$message({
                showClose: true,
                duration: 1000,
                type: "success",
                message: "更改密码成功!"
              });
              this.ruleForm.pass = "";
              this.ruleForm.checkPass = "";
            })
            .catch(() => {
              this.changePasswordVisible = true;
              return false;
            });
        }
      });
    },
    // 密码重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 点击修改密码
    changePassword(userId) {
      this.nowUserId = userId;
      this.changePasswordVisible = true;
    },
    // 点击取消
    changePasswordResources() {
      this.changePasswordVisible = false;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getStudentListNew();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.getStudentListNew();
    },
    interface(id) {},
    handleClick(row) {},

    addstudent(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addStudent(this.formadd)
            .then(res => {
              if (res.data.code == "0") {
                this.dialogFormVisibleadd = false;
                this.$message({
                  showClose: true,
                  duration: 1000,
                  message: "新增学生成功",
                  type: "success"
                });
                this.getStudentListNew();
                this.formadd = {
                  number: "",
                  name: "",
                  gender: "男",
                  age: "",
                  phone: "",
                  email: ""
                };
              } else {
                this.$message.error({
                  showClose: true,
                  duration: 1000,
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(() => {
              this.$message.error({
                showClose: true,
                duration: 1000,
                message: "请求超时，添加失败",
                type: "warning"
              });
            });
        } else {
          this.$message({
            showClose: true,
            duration: 1000,
            message: "输入异常，请看错误提示",
            type: "error"
          });
          return false;
        }
      });
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
    modifystudent(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          modifyStudent(this.form)
            .then(res => {
              if (res.data.code == "0") {
                this.dialogFormVisible = false;
                this.$message({
                  showClose: true,
                  duration: 1000,
                  message: "编辑学生成功",
                  type: "success"
                });
                this.getStudentListNew();
              } else {
                this.$message.error({
                  showClose: true,
                  duration: 1000,
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(() => {
              this.$message({
                showClose: true,
                duration: 1000,
                message: "请求超时，编辑失败",
                type: "error"
              });
            });
        } else {
          this.$message({
            showClose: true,
            duration: 1000,
            message: "输入异常，请看错误提示",
            type: "error"
          });
          return false;
        }
      });
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
              showClose: true,
              duration: 1000,
              type: "success",
              message: "删除成功!"
            });
            this.getStudentListNew();
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
.dialog-footer .Reset {
  background-color: #42aeec;
  border: none;
  width: 70px;
  height: 30px;
  border-radius: 0px;
}
.modify .el-dialog__title {
  color: #00a0e9;
}
</style>
