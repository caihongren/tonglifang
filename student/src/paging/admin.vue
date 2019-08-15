<template>
  <div class="relaybanner">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo Surveybox"
      mode="horizontal"
      @select="handleSelect"
      background-color="#0078d7"
      text-color="#fff"
      active-text-color="#ffc113"
    >
      <!-- <router-link to="/addstudent/teacher">
        <el-menu-item index="1" style="font-size:18px;">基础管理</el-menu-item>
      </router-link> -->
    </el-menu>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  created(){
   
      if(sessionStorage.getItem("user")==null){
      this.$router.push('/login')
    }
  },
  //创建前设置增加滚动条
  beforeCreate() {
    // document.querySelector("body").setAttribute("style", "overflow-y:scroll;");
  },
  //销毁前清除滚动
  beforeDestroy() {
    // document
    //   .querySelector("body")
    //   .removeAttribute("style", "overflow-y:scroll;");
  }
};
</script>

<style lang="less" scoped>
.hhhh {
  color: #fff;
  background-color: #0078d7;
}
.relaybanner {
  position: relative;
    height:calc(100% - 60px);
}
// 分页导航条
a {
  text-decoration: none;
  display: inline-block;
}
.el-menu-item {
  height: 60px;
  margin-left: 35px;
  line-height: 60px;
}
.Surveybox {
  position: absolute;
  top: -60px;
  left: 200px;
  margin-left: 200px;
}
</style>
