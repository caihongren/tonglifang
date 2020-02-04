<template>
  <div id="app">
    
    
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
      name: "",
      gender: ""
    };
  },
  methods: {
    ...mapActions(["user"]),
    handleOpen(key, keyPath) { },
    handleClose(key, keyPath) { },
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
      sessionStorage.setItem(
        "GoUser",
        JSON.stringify({
          path: this.$route.path
        })
      );
      if (this.status == "student") {
        this.$router.push("/user");
      } else if (this.status == "teacher") {
        this.$router.push("/user");
      } else {
        this.$router.push("/login");
      }
    },
    usertype() {
      if (sessionStorage.getItem("user")) {
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
      }
    },
    // 单击操作

  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.path == "/register" || val.path == "/login"||val.path == "/training"||val.path == "/gateway"||val.path == "/gat"||val.path == "/gatewayphone") {
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

    if (this.$route.path == "/register" || this.$route.path == "/login"||this.$route.path == "/training"||this.$route.path == "/gateway"||this.$route.path == "/gat"||this.$route.path == "/gatewayphone") {
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
  color: #1c262f;
  background-color: #fff;
  line-height: 61px;
  height: 61px;
  z-index: 99;
}
.Navigation-l {
  padding-top: 5px;
border-bottom:1px solid #1c262f;
  background-color: #2e3d49;
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
  /* min-width: 1000px; */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-family: "Open Sans", sans-serif;
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
  margin-top: 15px !important;
  margin-bottom: 15px !important;
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
</style>
<style scoped>
.el-button--text {
  color: #606266;
  margin-top: -18px;
}
</style>

