<template>
  <div style="height:100%" class="addstudent">
    <el-row class="main" type="flex">
      <el-col :span="4" class="left">
        <el-menu default-active="1" class="el-menu-vertical-demo menuMain" background-color="#313131" active-text-color="#ffc113">
          <el-menu-item index="1" @click="inter(1)" class="buoom butop">
            <span class="icon iconfont menuContext" slot="title">&#xe637;　教师管理</span>
          </el-menu-item>
          <el-menu-item index="2" @click="inter(2)" class="buoom">
            <span class="icon iconfont menuContext" slot="title">&#xe503;　学生管理</span>
          </el-menu-item>
          <el-menu-item index="3" @click="inter(3)" class="buoom">
            <span class="icon iconfont  menuContext" slot="title">&#xe7be;　班级管理</span>
          </el-menu-item>
          <el-menu-item index="4" @click="inter(4)" class="buoom">
            <span class="icon iconfont menuContext " slot="title">&#xe6e3;　排课管理</span>
          </el-menu-item>
        </el-menu>

      </el-col>
      <el-col :span="20" class="right">
        <div class="rightContext">
          <router-view />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    inter(id) {
      let url = [
        "/addstudent/teacher",
        "/addstudent/student",
        "/addstudent/Myclass",
        "/addstudent/course"
      ];
      if (id > 0) {
        this.$router.push(url[id - 1]);
      }
    }
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  min-width: 970px;
  .left {
    padding-top: 15px;
    text-align: center;
    height: 100%;
    max-width: 250px;
    min-width: 250px;
    background-color: #313131;
    .menuContext {
      font-size: 18px;
      font-family: "sans-serif";
      padding-bottom: 17px;
    }
  }
  .right {
    height: 100%;
    min-height: 750px;
    background-color: #f1f1f1;
    width: calc(100% - 250px);
    .rightContext {
      // width: calc(100% - 70px);
      margin: 20px;

      background-color: #ffffff;
      height: 96%;
    }
  }
}
</style>
<style>
.left .el-menu {
  border: 0;
}
.left .menuMain .butop {
  border-top: none;
}
.addstudent .el-menu-item {
  color: #fff;
}
</style>

