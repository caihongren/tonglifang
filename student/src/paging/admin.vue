<template>
  <div class="relaybanner">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <router-link to="/addstudent/teacher">
        <el-menu-item index="1" class="Surveybox">基础管理</el-menu-item>
      </router-link>
      <!-- <router-link to="/relayteacher/resources">
        <el-menu-item index="2">资源管理</el-menu-item>
      </router-link>
      <router-link to="/relayteacher/task">
        <el-menu-item index="3">任务管理</el-menu-item>
      </router-link> -->
    </el-menu>
    <router-view/>
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
  //创建前设置增加滚动条
  beforeCreate() {
    document
      .querySelector("body")
      .setAttribute("style", "overflow-y:scroll;background-color:#EEE9E9	");
    // document.querySelector('body').setAttribute('style', 'background-color:#ccc')
  },
  //销毁前清除滚动
  beforeDestroy() {
    document
      .querySelector("body")
      .removeAttribute("style", "overflow-y:scroll;");
  }
};
</script>

<style lang="less" scoped>
// 分页导航条
a {
  text-decoration: none;
  display: inline-block;
}
.el-menu-demo {
  height: 50px;
  margin-top: -1px;
  margin-bottom: 10px;
}
.el-menu-item {
  height: 48px;
  margin-left: 35px;
}
.Surveybox{
  margin-left: 200px;
}
.relaybanner{
  // height: 100%;
}

</style>
