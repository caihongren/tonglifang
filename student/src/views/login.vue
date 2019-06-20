<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">仿 真 实 验 操 作 系 统 登 录</span>
        <el-form
          :model="loginUser"
          :rules="rules1"
          ref="loginForm"
          label-width="80px"
          class="loginUser"
        >
          <el-form-item label="用户名" prop="phone">
            <el-input v-model="loginUser.phone" @keyup.enter.native="submitForm('loginForm')" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginUser.password" @keyup.enter.native="submitForm('loginForm')" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm('loginForm')"  class="login_btn">登录</el-button>
            <router-link to="/register">
              <el-button class="reg_btn">注册</el-button>
            </router-link>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import {login} from './../API/api'
import { log } from 'util';
import{mapActions} from 'vuex'
import { userInfo } from 'os';
export default {
  name: "login",

  data() {
    return {
      loginUser: {
        phone: "",
        password: "",
        role:'student'
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
      },
      
    };
  },
  methods: {
    ...mapActions([
      'user'
    ]),
    
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      this.$refs[formName].validate(valid => {
        if (valid) {
          login(this.loginUser).then(res=>{
            // console.log(res,"登录信息");
            if(res.data.code==0){
              var token=res.data.object.token;
              var user=res.data.object.account;
              localStorage.setItem("token",token);
              sessionStorage.setItem("user",JSON.stringify(user))
              
              this.user();
              if(user.role=="admin"){
                  this.$router.push("/addstudent/teacher");
              }else{
                  this.$router.push("/home");
              }
              // this.$router.push("/home");
              
            }else{
              this.$message.error({
                showClose:true,
                message:'用户名密码错误',
                type: 'warning',
                duration:1000,
              })
              
            }
          })
          .catch(() => {
          this.$message.error({
                showClose:true,
                message:'用户名密码错误',
                type: 'warning',
                duration:1000,
              })
        });
          
        } else {
          this.$message.error({
                showClose:true,
                message:'您输入的账号或密码输入不正确',
                type: 'warning',
               
              })
         
        }
      });
    }
  },
  watch:{
    $route: {
    handler: function(val, oldVal){
      console.log(val);
    },
    // 深度观察监听
    deep: true
  }
  },
};
</script>

<style lang="less" scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: url(./../image/150325rxssts2sf2ft72df.jpg);
  background-size: 100% 100%;
  .form_container {
    width: 370px;
    height: 210px;
    position: absolute;
    top: 15%;
    left: 36%;
    padding: 25px;
    border-radius: 5px;
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
        background-color: #fff;
        padding: 20px 40px 20px 20px;
        border-radius: 5px;
        box-shadow: 0px 5px 10px #ccc;
      }
      .login_btn {
        width: 40%;
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
