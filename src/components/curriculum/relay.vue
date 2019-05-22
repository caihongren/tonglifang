<template>
  <div class="banner">
    <div class="Breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>继电保护</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#232629"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <router-link to="/relay/study"><el-menu-item index="1">课程学习</el-menu-item></router-link>
      <router-link to="/relay/simulation">
        <el-menu-item index="2">仿真实验</el-menu-item>
      </router-link>
      <router-link to="/relay/my__note">
        <el-menu-item index="3">我的笔记</el-menu-item>
      </router-link>
       <router-link to="/relay/my__data">
        <el-menu-item index="4">我的资料</el-menu-item>
      </router-link>
       <router-link to="/relay/my__Submission">
        <el-menu-item index="5">我的提交</el-menu-item>
      </router-link>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex2: "1"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>


<style lang="less" scoped>
.banner {
  position: relative;
  .Breadcrumb {
    position: absolute;
    top: -25px;
    left: 15%;
  }
  .el-menu-item{
    font-size: 16px
  }
}
</style>
