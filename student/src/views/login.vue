<template>
  <div class="login">
    <div class="logo">
      <img src="../image/tonglifanglogo.png" alt />
    </div>
    <div class="loginimg"></div>
    <section class="form_container" >
      <div class="manage_tip">
        <el-form :model="loginUser" :rules="rules1" ref="loginForm" label-width="20px" class="loginUser">
          <div style="font-size:16px;margin:10px 0">仿真实训综合管理平台</div>
          <el-form-item prop="phone">
            <el-input v-model="loginUser.phone" @keyup.enter.native="submitForm('loginForm')" placeholder="Username" prefix-icon="el-icon-user-solid" class="Username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginUser.password" @keyup.enter.native="submitForm('loginForm')" placeholder="Password" prefix-icon="el-icon-s-goods" class="Password"></el-input>
          </el-form-item>
          <div class="detpass">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </div>
          <el-form-item class="login_btngroup">
            <el-button @click="submitForm('loginForm')" class="login_btn">登录</el-button>
          </el-form-item>
          <div class="detpass">
            <span style="cursor:pointer">忘记密码</span>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import { login, loginTime } from "./../API/api";

import { log } from "util";
import { mapActions } from "vuex";
import { userInfo } from "os";
import { stringify } from "querystring";
export default {
  name: "login",

  data() {
    return {
      checked: false,
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
          sessionStorage.clear();
          login(this.loginUser)
            .then(res => {
              if (res.data.code == 0) {
                var token = res.data.object.token;
                var user = res.data.object.account;
                localStorage.setItem("token", token);
                sessionStorage.setItem("token", token);
                // 发送token到wif
                let cmd = {
                  opcode: 10,
                  token: token
                };

                if (typeof wfapp !== "undefined") {
                  wfapp.start(JSON.stringify(cmd));
                }
                sessionStorage.setItem("user", JSON.stringify(user));

                this.user();
                if (user.role == "admin") {
                  this.$router.push("/addstudent/teacher");
                } else if(user.role == "product"){
                    // 产品管理
                      this.$router.push("/resourceDownload");
                }else {
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
                message: "连接失败",
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
      handler: function (val, oldVal) { },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    // 检测是否存在token,发送在线时长

    if (sessionStorage.getItem("token")) {
      loginTime();
      // sessionStorage.removeItem("token");
    }
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

.login {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  // background: url(./../image/timg.jpg);
  background-size: 100% 100%;
  .logo {
    height: 60px;
    // padding-top: 20px;
    padding-left:10px;
    img {
      width: 200px;
      height: 56px;
    }
  }
  .loginimg {
    background: url(./../image/login_02.png);
    height: 100%;
    width: 100%;
    background-size: 100% 100%;
  }
  .form_container {
    width: 380px;
    // height: 210px;
    position: absolute;
    top: 25%;
    right: 10%;
    padding: 25px;
    text-align: center;
    

    .manage_tip {
      background-color: #fff;
      border-radius: 4px;
      .title {
        font-family: "Microsoft YaHei";
        font-weight: bold;
        font-size: 26px;
        color: #fff;
      }
      .Username {
        // background-color: rgba(14, 166, 236, 0.212);
        border-radius: 20px;
      }
      .loginUser {
        margin-top: 20px;
        // background-color: rgba(14, 166, 236, 0.192);
        padding: 20px 40px 20px 20px;

        box-shadow: 0px 0px 20px #000000;
        .el-form-item {
          margin: 20px 20px 20px -8px;
        }
      }
      .login_btngroup {
        :hover {
          background-color: rgba(0, 174, 255, 0.847);

          border-radius: 2px;
        }
        .login_btn {
          width: 100%;
          border-radius: 2px;
          color: #fff;
          background-color: rgba(0, 174, 255, 0.747);
        }
      }
      .detpass {
        text-align: left;
        margin: 0 15px;
        display: none;
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
