<template>
  <div class="box">
    <!-- 菜单-->
    <!-- <el-row>
      <el-col :span="7" :offset="1">
        <div class="grid-content bg-purple">
          <h2>{{name}}(类型:{{type}})</h2>
        </div>
      </el-col>

      <el-col :span="2" :offset="14">
        <div class="grid-content bg-purple" style="padding:10px 0">
          <el-button type="primary" @click="detpage()">关闭</el-button>
        </div>
      </el-col>
    </el-row>-->
    <!-- 显示框 -->
    <div class="show"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "机械设计3D图",
      type: "三维原理图",
      testTemplateLibrary: false, //新建模态框初始隐藏
      dialogVisiblecopyMy: false,
      formInline: {
        user: "",
        region: ""
      },
      agentData: {
        name: "mode",
        mode: "",
        token: "",
        courseid: "",
        id: "",
        type: "",
        Expname: "",
        taskExperimentId: "",
        look: false
      }
    };
  },
  methods: {
    // 关闭
    detpage() {
      this.resetSetItem("watchStorage3D", null);
      let page = sessionStorage.getItem("page");
      let pageTeacher = sessionStorage.getItem("pageTeacher");
      // 进行来源判断

      let SourcePage = JSON.parse(sessionStorage.getItem("SourcePage"));
      this.$emit("handleSelect", SourcePage.index);

      this.$emit("derunity");

      this.$router.replace(SourcePage.path);
    },
    on_click_show_unity_window(type) {
      let cmd = "";
      
      cmd =
        // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
        "{'opcode':4,'LocationX': 271,'LocationY':72,'LocationX_Right': 20,'LocationY_Buttom':15,'SizeX': 1820,'SizeY':900}";
      // console.log(typeof wfapp)
      if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
      //  wfapp.start(cmd);
       console.log('打开3D')
        // wfapp.start(cmd);
    },
    role(){
         //判断学生教师  字段
    
    let role = JSON.parse(sessionStorage.getItem("user")).role;
    if (role == "teacher") {
      this.agentData.mode = "task_experiment_exercise_template_editor";
    } else {
      this.agentData.mode = "task_experiment_exercise_instance_editor";
    }
    
    const tasks = JSON.parse(sessionStorage.getItem("watchStorage3D"));
    if (tasks != null) {
      this.$emit("threadPoxi", this.agentData);
    }
     this.on_click_show_unity_window();
     // this.$emit('interspace')
    },
  },
  mounted() {
    console.log('加载完成')
    this.role()
  },
  created() {
    const tasks = JSON.parse(sessionStorage.getItem("watchStorage3D"));

    if (tasks == null) {
      this.detpage();
      return;
    }
    this.$emit("handleSelect", 11);
    //获取本地缓存中的令牌mytoken
    let token = localStorage.getItem("token");
    let courseid = JSON.parse(sessionStorage.getItem("course")).id;
    this.name = tasks.name;
    this.type = tasks.type;
    this.agentData.token = token;
    this.agentData.courseid = courseid;
    this.agentData.id = tasks.id;
    // this.agentData.mode=tasks.mode;
    this.agentData.Expname = tasks.name;
    this.agentData.taskExperimentId = tasks.taskExperimentId;
    this.agentData.type = tasks.type;
    this.agentData.look = tasks.look;
      // this.role()
  },
  destroyed() {
    this.$emit("derunity"); // 离开路由之后关闭显示
  }
};
</script>
<style lang="less" scoped>
.box {
  width: 99%;
  margin: 0 0.5%;
  height: 100%;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;

  .show {
   width: calc(100% - 250px);
    margin-left: 250px;
    margin-top: 60px;
    height: calc(100% - 60px);
    border: 1px solid #ccc;
    border-radius: 5px;
  }
}
</style>

