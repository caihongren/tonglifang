<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">仿 真 实 验 操 作 系 统 登 录</span>
        <el-form :model="loginUser" :rules="rules1" ref="loginForm" label-width="80px" class="loginUser" >
          <el-form-item label="用户名：" prop="phone">
            <el-input v-model="loginUser.phone" @keyup.enter.native="submitForm('loginForm')" placeholder="Username" prefix-icon="el-icon-user-solid" class="Username"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input type="password" v-model="loginUser.password" @keyup.enter.native="submitForm('loginForm')" placeholder="Password" prefix-icon="el-icon-s-goods" class="Password"></el-input>
          </el-form-item>
          <el-form-item class="login_btngroup">
            <el-button @click="submitForm('loginForm')" class="login_btn">登录</el-button>

          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import { login } from "./../API/api";
import { log } from "util";
import { mapActions } from "vuex";
import { userInfo } from "os";
export default {
  name: "login",

  data() {
    return {
      loginUser: {
        phone: "",
        password: "",
        role: "student"
      },
      rules1: {
        phone: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 5, max: 18, message: "长度在5到18个字符之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 18, message: "长度在6到18个字符之间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...mapActions(["user"]),

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          sessionStorage.clear()
          login(this.loginUser)
            .then(res => {
              if (res.data.code == 0) {
                var token = res.data.object.token;
                var user = res.data.object.account;
                localStorage.setItem("token", token);
                sessionStorage.setItem("user", JSON.stringify(user));

                this.user();
                if (user.role == "admin") {
                  this.$router.push("/addstudent/teacher");
                } else {
                  this.$router.push("/home");
                }
              } else {
                this.$message.error({
                  showClose: true,
                  message: "用户名密码错误",
                  type: "warning",
                  duration: 1000
                });
              }
            })
            .catch(() => {
              this.$message.error({
                showClose: true,
                message: "用户名密码错误",
                type: "warning",
                duration: 1000
              });
            });
        } else {
          this.$message.error({
            showClose: true,
             duration: 1000,
            message: "您输入的账号或密码输入不正确",
            type: "warning"
          });
        }
      });
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
      },
      // 深度观察监听
      deep: true
    }
  },
  created(){
   
  }
};
</script>

<style lang="less" scoped>
.Username {
  opacity: 0.8;
}
.Password {
  opacity: 0.8;
}
.manage_tip.Username {
  background-color: rgba(14, 166, 236, 0.212);
  border-radius: 20px;
}
.login {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: url(./../image/timg.jpg);
  background-size: 100% 100%;
  .form_container {
    width: 380px;
    height: 210px;
    position: absolute;
    top: 15%;
    left: 40%;
    padding: 25px;
    text-align: center;

    .manage_tip {
      .title {
        font-family: "Microsoft YaHei";
        font-weight: bold;
        font-size: 26px;
        color: #fff;
      }
      .loginUser {
        margin-top: 20px;
        background-color: rgba(14, 166, 236, 0.192);
        padding: 20px 40px 20px 20px;
        border-radius: 5px;
        box-shadow: 0px 0px 20px #000000;
        .el-form-item {
          margin: 20px 20px 20px -8px;
        }
      }
      .login_btngroup {
        :hover {
          background-color: rgba(0, 174, 255, 0.747);
          border-radius: 20px;
        }
        .login_btn {
          width: 100%;
          border-radius: 20px;
          color: #fff;
          background-color: rgba(7, 4, 14, 0.185);
        }
      }

      a {
        width: 40%;
        .reg_btn {
          margin-left: 5%;
          width: 100%;
        }
      }
    }
  }
}
</style>
<style >
</style>
