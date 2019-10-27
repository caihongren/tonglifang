<template>
  <div id="app">
    <el-row type="flex" class="Navigation" v-show="logintype" :style="{'background-color': (ishome==true ? '#fff':'#fff')}">
      <el-col :span="3" class="Navigation-l" v-show="logintype" style="min-width:250px">
        <img src="./image/tonglifanglogo5.png" slt class="logog" />
      </el-col>
      <el-col :span="19" style="border-bottom:1px solid #4d7283 ; line-height: 61px;"></el-col>

      <el-col :span="2" style="border-bottom:1px solid #4d7283; width:180px;">
        <img src="./image/学生头像.png" style="padding-top:18px; margin-right:-35px; height:40px;" v-if="sheadPortrait">
        <img src="./image/男老师头像.png" style="padding-top:15px; margin-right:-45px;height:45px;;" v-if="theadPortrait">
        <el-dropdown trigger="click" v-show="logintype" class="loginText">

          <el-button type="text">
            {{name}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <!-- <button @click="login">
              <el-dropdown-item>退出登录</el-dropdown-item>
            </button>-->
            <!-- 个人中心 -->

            <el-dropdown-item>
              <div @click="gouser()" v-if="status=='student'||status=='teacher'">个人中心</div>

            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="login">退出登录</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <router-view />
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

// window.onbeforeunload = function(e) {
//   window.localStorage.setItem("token", "123");
// };

export default {
  data() {
    return {
      sheadPortrait: false,
      theadPortrait: false,
      logintype: false,
      isuser: false,
      ishome: false,
      status: "",
      name: '',
      gender: "",
    };
  },
  methods: {
    ...mapActions(["user"]),
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    login() {
      // 退出清除缓存信息
      // localStorage.removeItem("token");
      sessionStorage.removeItem("user");

      let userupdata = {
        // name:'请登录'
      };
      // sessionStorage.setItem("user", JSON.stringify(userupdata));

      // this.user();

      this.$router.push("/login");
    },
    // 去个人中心
    gouser() {
      sessionStorage.setItem("GoUser", JSON.stringify({
        path: this.$route.path,
      })
      );
      if (this.status == 'student') {
        this.$router.push('/user')
      } else if (this.status == 'teacher') {
        this.$router.push('/user')
      } else {
        this.$router.push('/login')
      }
    },
    usertype() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      this.name = user.name;
      if (user.role == "student") {
        this.sheadPortrait = true;
        this.theadPortrait = false;
        this.status = "student";
      } else if (user.role == "teacher") {
        this.sheadPortrait = false;
        this.theadPortrait = true;
        this.status = "teacher";
      } else {
        this.status = "";
      }
    },
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.path == "/register" || val.path == "/login") {
          this.logintype = false;
        } else {
          this.logintype = true;
          if (val.path == "/home") {
            this.isuser = false;
            this.ishome = true;
          } else {
            this.isuser = true;
            this.ishome = false;
          }
          this.usertype();
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  computed: {
    ...mapState(["userlist"])
  },
  mounted() {

    // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据

  },
  beforeDestroy() {
    // localStorage.setItem("token", '123');
  },
  created() {
    if (this.$route.path == "/register" || this.$route.path == "/login") {
      this.logintype = false;
    } else {
      this.logintype = true;
      if (this.$route.path == "/home") {
        this.isuser = false;
        this.ishome = true;
      } else {
        this.isuser = true;
        this.ishome = false;
      }
      this.usertype();
    }
    // this.user();

    // window.location.href="CreatorShell://";

    // console.debug("run feiq");
    //     if (document.all) {
    //         this.$refs.autoRun.click();
    //     }
    //     else {
    //         var evt = document.createEvent("MouseEvents");
    //         evt.initEvent("click", true, true);
    //         // this.$refs.autoRun.dispatchEvent(evt);
    //         this.$refs.autoRun.click();
    //     }
  },
  mounted() { }
};
</script>


<style >
.Navigation {
  color: #282828;
  background-color: #fff;
  line-height: 61px;
  height: 61px;
}
.Navigation-l {
  padding-top: 5px;

  background-color: #282828;
}
.logog {
  margin-left: 10px;
  /* width: 100%; */
  height: 50px;
}
.loginText {
  margin-left: 40px;
  /* border-bottom:1px solid #4d7283 ; */
}
.el-icon-refresh {
  font-size: 25px;
  padding-left: 15px;
  color: #f3f3f3;
}
html,
body {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px !important;
  margin: 0px;
  overflow: hidden;
  min-width: 1000px;
  -webkit-touch-callout: none;  
    -webkit-user-select: none;  
    -khtml-user-select: none;  
    -moz-user-select: none;  
    -ms-user-select: none;  
    user-select: none;  
}
a {
  display: inline-block;
  text-decoration: none;
  color: aliceblue;
}
li {
  list-style: none;
}
h2,
h3 {
  font-weight: 800 !important;
  margin: 15px 0 !important;
}
#app {
  font-family: "Hiragino Sans GB", "Microsoft YaHei", Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  margin: 0 auto;
}
button {
  border: 0px solid red;
}

/* //login */

/* .loginout {
  margin-left: 10px;
} */

/* 账户的下拉菜单样式 */
.el-dropdown {
  vertical-align: top;
  line-height: 60px;
}
.el-upload__input {
  display: none !important;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: #f5f5f5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #ccc;
}
.el-upload-list--text {
  display: none;
}

/* 重庆分支功能隐藏 */

.chongqing {
  /* display: none !important; */
}
</style>
<style scoped>
.el-button--text {
  color: #606266;
  margin-top: -18px;
}
</style>

