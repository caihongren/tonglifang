<template>
  <div>
    <el-row type="flex">
      <el-container>
        <el-aside width="15%">
          <el-col :span="12">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              :default-openeds="openeds"
              background-color="#fff"
              text-color="#000"
              active-text-color="#00add4"
            >
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>资源列表</span>
                </template>
                <el-submenu index="1-1">
                  <template slot="title">
                    <i class="el-icon-star-on"></i>
                    <span>文档资源</span>
                  </template>
                  <router-link to="/relayteacher/resources/file/1">
                    <el-menu-item index="1-1-1" class="el-icon-document">文件</el-menu-item>
                  </router-link>
                  <router-link to="/relayteacher/resources/file/2">
                    <el-menu-item index="1-1-2" class="el-icon-video-play">视频</el-menu-item>
                  </router-link>
                  <router-link to="/relayteacher/resources/file/3">
                    <el-menu-item index="1-1-3" class="el-icon-edit-outline">题库</el-menu-item>
                  </router-link>
                </el-submenu>
                <el-submenu index="1-2">
                  <template slot="title">
                    <i class="el-icon-star-on"></i>
                    <span>元件资源</span>
                  </template>
                  <router-link to="/relayteacher/resources/file/4">
                    <el-menu-item index="1-2-1" class="el-icon-warning">电源元件</el-menu-item>
                  </router-link>
                  <router-link to="/relayteacher/resources/file/5">
                    <el-menu-item index="1-2-2" class="el-icon-s-operation">开关元件</el-menu-item>
                  </router-link>
                  <router-link to="/relayteacher/resources/file/6">
                    <el-menu-item index="1-2-3" class="el-icon-magic-stick">电机元件</el-menu-item>
                  </router-link>
                  <router-link to="/relayteacher/resources/file/7">
                    <el-menu-item index="1-2-4" class="el-icon-paperclip">其他</el-menu-item>
                  </router-link>
                </el-submenu>
                <el-submenu index="1-3">
                  <template slot="title">
                    <i class="el-icon-star-on"></i>
                    <span>实验资源</span>
                  </template>
                  <router-link to="/Resources/Experiment/Basics">
                    <el-menu-item index="1-3-1" class="el-icon-s-help">基础实验</el-menu-item>
                  </router-link>
                  <router-link to="/Resources/Experiment/comprehensive">
                    <el-menu-item index="1-3-2" class="el-icon-s-finance">综合实验</el-menu-item>
                  </router-link>
                  <router-link to="/Resources/Experiment/innovate">
                    <el-menu-item index="1-3-3" class="el-icon-s-opportunity">创新实验</el-menu-item>
                  </router-link>
                </el-submenu>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>

        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      openeds: ["1", "1-1", "1-2", "1-3"]
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
  //创建前设置增加滚动条
  beforeCreate() {
    document
      .querySelector("body").setAttribute("style", "overflow-y:scroll;background-color:#EEE9E9	");
    // document.querySelector('body').setAttribute('style', 'background-color:#ccc')
  },
  //销毁前清除滚动
  beforeDestroy() {
    document
      .querySelector("body").removeAttribute("style", "overflow-y:scroll;");
  }
};
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
}
.el-col{
  width: 100%
}
.el-menu-item{
  width: 268px;
}
</style>
