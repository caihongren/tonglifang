<template>
  <div class="user">
    <div class="head">个人中心</div>
    <div class="box">
      <el-form :model="form" :label-position="labelPosition" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="学号：" v-if="status=='student'?true:false">
          <el-input v-model="number" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="form.name" auto-complete="off" placeholder="请输入名称（必填）"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="man"></el-option>
            <el-option label="女" value="woman"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄：" prop="age">
          <el-input v-model="form.age" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="phone" disabled>
          <el-input v-model="form.phone" auto-complete="off" placeholder="请输入电话号码（必填）"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="width:100%;height:50px;">
        <div style="  float: left;padding-left:100px" class="dialog-footer">
          <el-button type="danger" @click="changePassword(form.id)" size="small" class="mima" >更改密码</el-button>
        </div>
        <div style="  float: right;" class="dialog-footer">
          <el-button type="primary" @click="getback()"  class="cancel">返回</el-button>
          <el-button type="primary" @click="modify('form')"  class="Sure">确 定</el-button>
        </div>
      </div>
    </div>
    <!-- 更改密码弹出框 -->
    <el-dialog type="password" :visible.sync="changePasswordVisible" append-to-body width="400px" top="15vh" title="更改密码" class="modify">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="请输入原密码" prop="oldpass">
          <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请输入新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')" size="mini" class="Sure">提交</el-button>
          <el-button type="primary" @click="resetForm('ruleForm')" size="mini" class="Reset">重置</el-button>
          <el-button type="primary" @click="changePasswordResources('ruleForm')" size="mini" class="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  curlist,
  account_detail,
  modifyTeacher,
  modifyStudent,
  change_password_self
} from "@/API/api.js";
import { log } from "util";
import { mapState, mapActions } from "vuex";
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
      curlist: [],

      status: "",
      changePasswordVisible: false,
      labelPosition: "right",
      number: "",
      form: {
        //编辑表单
        id: "",
        name: "",
        gender: "",
        age: "",
        phone: "",
        email: ""
      },

      ruleForm: {
        //密码提交表单
        oldpass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 0,
            max: 20,
            message: "长度为限制为20位",
            trigger: ["blur", "change"]
          }
        ],
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
        oldpass: [{ validator: validatePass, trigger: ["blur", "change"] }],
        pass: [{ validator: validatePass, trigger: ["blur", "change"] }],
        checkPass: [{ validator: validatePass2, trigger: ["blur", "change"] }]
      }
    };
  },
  methods: {
    // 密码提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changePasswordVisible = false;
          change_password_self({
            password: this.ruleForm.oldpass,
            newPassword: this.ruleForm.pass
          })
            .then(res => {
              this.$message({
                showClose: true,
                duration: 1000,
                type: "success",
                message: "更改密码成功!"
              });
              this.ruleForm.oldpass = "";
              this.ruleForm.pass = "";
              this.ruleForm.checkPass = "";
              this.$router.push("/login");
            })
            .catch(() => {
              this.changePasswordVisible = true;
              this.$message.error({
                showClose: true,
                duration: 1000,
                message: "密码修改错误",
                type: "warning"
              });
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
      this.changePasswordVisible = true;
    },
    // 点击取消
    changePasswordResources() {
      this.changePasswordVisible = false;
    },
    // 点击返回
    getback() {
      let path = JSON.parse(sessionStorage.getItem("GoUser"));
      if (path != null) {
        this.$router.push(path);
      } else {
        this.$router.push("/login");
      }
    },
    modify(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.status == "student") {
            modifyStudent(this.form)
              .then(res => {
                if (res.data.code == "0") {
                  this.$message({
                    showClose: true,
                    duration: 1000,
                    message: "修改成功",
                    type: "success"
                  });
                } else {
                  this.$message.error({
                    showClose: true,
                    duration: 1000,
                    message: "编辑错误",
                    type: "warning"
                  });
                }
              })
              .catch(() => {
                this.$message.error({
                  showClose: true,
                  duration: 1000,
                  message: "编辑错误",
                  type: "warning"
                });
              });
          } else if (this.status == "teacher") {
            modifyTeacher(this.form)
              .then(res => {
                if (res.data.code == "0") {
                  this.$message({
                    showClose: true,
                    duration: 1000,
                    message: "修改成功",
                    type: "success"
                  });
                  this.accountdetail();
                } else {
                  this.$message.error({
                    showClose: true,
                    duration: 1000,
                    message: "编辑错误",
                    type: "warning"
                  });
                }
              })
              .catch(() => {
                this.$message.error({
                  showClose: true,
                  duration: 1000,
                  message: "编辑错误",
                  type: "warning"
                });
              });
          } else {
            this.$message.error({
              showClose: true,
              duration: 1000,
              message: "无法识别身份",
              type: "warning"
            });
          }
        } else {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: "请看错误提示",
            type: "warning"
          });
          return false;
        }
      });
    },
    usertype() {
      let user = JSON.parse(sessionStorage.getItem("user"));

      if (user.role == "student") {
        this.status = "student";
      } else if (user.role == "teacher") {
        this.status = "teacher";
      } else {
        this.status = "";
        this.$router.push("/login");
      }
    },
    // 获取个人信息
    accountdetail() {
      account_detail().then(res => {
        let from = {
          id: res.data.object.id,
          name: res.data.object.name,
          age: res.data.object.age,
          phone: res.data.object.phone,
          gender: res.data.object.gender,
          email: res.data.object.email
        };
        if (from.gender == "man") {
          from.gender = "男";
        } else {
          from.gender = "女";
        }
        if (res.data.object.number) {
          this.number = res.data.object.number;
        }
        this.form = from;
      });
    }
  },
  created() {
    if (sessionStorage.getItem("user") == null) {
      this.$router.push('/login')
    }
    this.usertype();
    this.accountdetail();
  }
};
</script>
<style lang="less" scoped>
.user{
  background-color: #f1f1f1;
  height: 100%;
  overflow: auto;
}
.head {
  width: 100%;
  height: 100px;
  background-color: #f1f1f1;
  font-size: 40px;
  text-align: center;
  color: #00a0e9;
  line-height: 150px;
}
.box {
  width: 800px;
  background-color: #fff;
  margin: 50px auto;
  padding: 50px;
}
.dialog-footer .cancel {
  background-color: #66c6f2;
  border-radius: 0px;
  width: 70px;
  height: 35px;
  border: none;
}
.dialog-footer .Sure {
  background-color: #00a0e9;
  border: none;
  width: 70px;
  height: 35px;
  border-radius: 0px;
}
.dialog-footer .mima{
  border: none;
  width: 75px;
  height: 35px;
  border-radius: 0px;
}
.dialog-footer .Reset {
  background-color: #42aeec;
  border: none;
  width: 70px;
  height: 35px;
  border-radius: 0px;
}
.modify .el-dialog__title {
  color: #00a0e9;
}
</style>

