<template>
  <div id="app">
    <el-row type="flex">
      <el-col :span="5">
        <img src="./image/tonglifanglogo.png" style="margin-left: 5%;" slt>
      </el-col>
      <el-col :span="11"></el-col>
      <el-col :span="2"></el-col>
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="2">
        <!-- <div class="grid-content">
          <el-button type="danger" size="mini" class="loginout">退出登陆</el-button>
        </div>-->
        <el-dropdown trigger="click" v-show="logintype">
          <el-button type="primary">
            {{userlist.name}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <button   @click="login"><el-dropdown-item>退出登录</el-dropdown-item></button>
            <!-- <el-dropdown-item>
              <div @click="login">退出登录</div>
            </el-dropdown-item> -->
            <!-- 个人中心 -->
            <!-- <el-dropdown-item><div @click="login"> 个人中心 </div></el-dropdown-item> -->

            <!-- <button   @click="login"><el-dropdown-item>退出登录</el-dropdown-item></button> -->
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <router-view/>
    <!-- <a id="autoRun" href="CreatorShell://" style="visibility: hidden;"  ref="autoRun" @runUnity="showU3d" /> -->
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      logintype: false
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
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");

      let userupdata = {
        // name:'请登录'
      };
      sessionStorage.setItem("user", JSON.stringify(userupdata));

      this.user();
      this.$router.push("/login");
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        // console.log(val,"路由变化",val.path);
        if (val.path == "/register" || val.path == "/login") {
          this.logintype = false;
        } else {
          this.logintype = true;
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  computed: {
    ...mapState(["userlist"])
  },
  created() {
    // console.log(this.$route)
    if (this.$route.path == "/register" || this.$route.path == "/login") {
      this.logintype = false;
    } else {
      this.logintype = true;
    }
    this.user();

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
  mounted() {}
};
</script>


<style >
html,
body {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px !important;
  margin: 0px;
  overflow: hidden;
  
}
a {
  display: inline-block;
  text-decoration: none;
  color: aliceblue;
}
li {
  list-style: none;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
    width: 8px;
    height: 8px;
    background-color: #F5F5F5;
}
 
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 5px;
    background-color: #F5F5F5;
}
 
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #ccc;
}
.el-upload-list--text{
  display: none;
}

</style>
