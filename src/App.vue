<template>
  <div id="app">
    <el-row type="flex">
      <el-col :span="5">
        <img src="./image/tonglifanglogo.png" alt>
      </el-col>
      <el-col :span="11"></el-col>
      <el-col :span="2"></el-col>
      <el-col :span="4">
        <div class="grid-content">
         
        </div>
      </el-col>
      <el-col :span="2">
        <!-- <div class="grid-content">
          <el-button type="danger" size="mini" class="loginout">退出登陆</el-button>
        </div>-->
        <el-dropdown trigger="click">
          <el-button type="primary">
            {{user}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/login"><el-dropdown-item>退出登录</el-dropdown-item></router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <router-view/>
    <!-- <a id="autoRun" href="CreatorShell://" style="visibility: hidden;"  ref="autoRun" @runUnity="showU3d" /> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: "请登录"
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  created() {
    
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


  }
};
</script>


<style>
html,
body {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
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
  height: 60px;
  margin: 0 auto;
}
#app img {
  margin-left: 5%;
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

</style>
