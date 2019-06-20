<template>
  <div class="box">
    <el-row >
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <div>目录</div>
           <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="1-1" @contextmenu.prevent="rightShow()">选项1</el-menu-item>
          <el-menu-item index="1-2" @contextmenu.prevent="rightShow()">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-setting"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
    </el-menu>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-input v-model=" search" placeholder="请输入搜索内容"></el-input>
          <div  @contextmenu.prevent="rightShow()">文件夹</div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">
          
          <el-input v-model="input" placeholder="请输入标题"></el-input>
          <div ref="editor" style="text-align:left" class="editor"></div>
          <button v-on:click="getContent">查看内容</button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
 
<script>
import {
  getTeacherList,
  addTeacher,
  modifyTeacher,
  deletedaTeacher
} from "../../API/api";
import E from "wangeditor";
export default {
  data() {
    name: "editor";
    return {
      offset: 0,
      limit: 10,
      currentPage4: 1,
      length: 40,
      value: "dawdadad",
       search:'',
      input:'',
      editorContent: ""
    };
  },
  methods: {
    getContent: function() {
      alert(this.editorContent);
    },
    handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      rightShow(){
        console.log('右键')
      }
  },
  mounted() {
    var editor = new E(this.$refs.editor);
    editor.customConfig.onchange = html => {
      this.editorContent = html;
    };
    editor.create();
  },
  created() {
    document.oncontextmenu = function(){
　　return false;
}
    // this.getTeacherListNew();
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 99%;
  margin: 5px 0.5%;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 100%;
  overflow: auto;
}
</style>
<style lang="less" >
  .editor{
      .w-e-text-container{
        height: 800px !important;
      }
  }
</style>
