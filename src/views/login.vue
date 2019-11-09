<template>
  <div class="login" id="particles">
     
    <div class="logo">
      <img src="../image/tonglifanglogo.png" alt />
    </div>
    
    <div class="loginimg"> <vue-particles   color="#ffffff" :particleOpacity="0.6" :particlesNumber="80" shapeType="circle" :particleSize="4" linesColor="#fff" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="100" :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push" class="lizi">
      </vue-particles></div>
    <section class="form_container">
      <div class="manage_tip">
       
        <el-form :model="loginUser" :rules="rules1" ref="loginForm" label-width="20px" class="loginUser" v-show="!weixinglogins">
          <div style="font-size:16px;margin:10px 0">仿真实训综合管理平台</div>
          <el-form-item prop="phone">
            <el-input v-model="loginUser.phone" maxlength="20" @keyup.enter.native="submitForm('loginForm')" placeholder="Username" prefix-icon="el-icon-user-solid" class="Username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" maxlength="20" v-model="loginUser.password" @keyup.enter.native="submitForm('loginForm')" placeholder="Password" prefix-icon="el-icon-s-goods" class="Password"></el-input>
          </el-form-item>
          <div class="detpass">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </div>
          <el-form-item class="login_btngroup">
            <el-button @click="submitForm('loginForm')" class="login_btn">登录</el-button>
          </el-form-item>

          <div class="ggg" style="padding:10px 0;">
            <img src="./../image/wx.png">
            <span style="cursor:pointer;font-size:14px;" @click="weixinglogins=true">微信登录</span>
          </div>

        </el-form>
        <div id="wxlogin_container" v-show="weixinglogins"></div>

        <div class="gggg" v-show="weixinglogins" style="padding:10px 0;">
          <img src="./../image/return.png">
          <span style="cursor:pointer;font-size:14px;" @click="weixinglogins=false">返回账号登录</span>
        </div>
        <div class="detpass">
          <span style="cursor:pointer">忘记密码</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { login, loginTime, weixinglogin } from "./../API/api";

import { log } from "util";
import { mapActions } from "vuex";
import { userInfo } from "os";
import { stringify } from "querystring";
export default {
  name: "login",

  data() {
    return {
      
      weixinglogins: false,
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
        if (valid) {sessionStorage.clear();
        login(this.loginUser).then(res => {
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
                } else if (user.role == "product") {
                  // 产品管理
                  this.$router.push("/resourceDownload");
                } else if (user.role == "teacher") {
                  this.$router.push("/relayteacher/home");
                } else if (user.role == "student") {
                  this.$router.push("/relay/home");
                } else {
                  this.$router.push("/login");
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
    },
    // 接受内容
    params() {
      let url = window.location.href;
      url = url.split("#")[0];
      if (url.indexOf("?") == -1) {
        return;
      }
      url = url.split("?")[1];
      url = url.split("&");
      let params = {};

      for (let i = 0; i < url.length; i++) {
        let name = url[i].split("=")[0];
        params[name] = url[i].split("=")[1];
      }

      if (localStorage.getItem("code") == params.code) {
        return;
      }
      if (params.type == "binding") {
        this.$router.push("/weixinglogin");
      } else if (params.type == "login") {
        localStorage.setItem("code", params.code);
        weixinglogin({
          code: params.code
        }).then(res => {
          // 微信登录
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
            } else if (user.role == "product") {
              // 产品管理
              this.$router.push("/resourceDownload");
            } else if (user.role == "teacher") {
              this.$router.push("/relayteacher/home");
            } else if (user.role == "student") {
              this.$router.push("/relay/home");
            } else {
              this.$router.push("/login");
            }
          } else {
            this.$message.error({
              showClose: true,
              message: res.data.msg,
              type: "warning",
              duration: 3000
            });
          }
        });
      }
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.params();
      },
      // 深度观察监听
      deep: true
    }
  },
  mounted() {
    var obj = new WxLogin({
      self_redirect: false,
      id: "wxlogin_container",
      appid: "wx7822838b8a525873",
      scope: "snsapi_login",
      // redirect_uri: "http%3A%2F%2Fsso.icubespace.com%2Fchangping%2F#%2Flogin",
      redirect_uri: "http://projects.icubespace.com/wutie/?type=login#/login",
      // state: this.DEFAULT_LICENCE_ID
      //   ? this.DEFAULT_LICENCE_ID
      //   : "b4b22724034e42539eea7542354cbed2",
      // style: "black"
    });
  },
  created() {
    // 检测是否存在token,发送在线时长
    console.log('登录页面')
    this.params();
    if (sessionStorage.getItem("token")) {
      // loginTime();
      // sessionStorage.removeItem("token");
    }
  }
};
</script>

<style lang="less" scoped>
.ggg {
  position: relative;
  :hover {
    color: rgba(0, 174, 255, 0.847);
  }
  img {
    position: absolute;
    left: 70px;
    top: 6px;
  }
}
.gggg {
  position: relative;
  :hover {
    color: rgba(0, 174, 255, 0.847);
  }
  img {
    position: absolute;
    left: 100px;
    top: 13px;
  }
}
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
  background-size: 100% 100%;
  .logo {
    height: 60px;
    // padding-top: 20px;
    padding-left: 10px;
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
          background-color: rgba(22, 162, 226, 0.847);
          border-radius: 10px;
          box-shadow: 0px 0px 10px #3589d8;
        }
        .login_btn {
          width: 100%;
          color: #fff;
          background-color: rgba(0, 174, 255, 0.747);
          :hover {
            color: rgb(10, 228, 126);
          }
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
