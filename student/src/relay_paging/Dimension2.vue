<template>
  <div class="box">
    <!-- 菜单-->
    <el-row :gutter="20">
      <el-col :span="7" :offset="1">
        <div class="grid-content bg-purple">
          <h2>仿真资源库/{{name}}(类型:{{type}})</h2>
        </div>
      </el-col>

      <el-col :span="2" :offset="14">
        <div class="grid-content bg-purple" style="padding:10px 0">
          <!-- <el-button type="primary">保存</el-button>
          <el-button type="primary">导出</el-button>-->
          <el-button type="primary" @click="detpage()">关闭</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 显示框 -->
    <div>
      <el-tabs type="border-card">
        <el-tab-pane style="height:70vh">
          <span slot="label">设计空间</span>
          设计空间
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "机械设计图",
      type: "二维原理图",
      testTemplateLibrary: false, //新建模态框初始隐藏
      dialogVisiblecopyMy: false,
      formInline: {
        user: "",
        region: ""
      },
      tasks: {
        id: "",
        name: "",
        path: "",
        type: ""
      },
      agentData: {
        name: "mode",
        mode: "",
        token: "",
        id: "",
        type: "",
        Expname: "",
        taskExperimentId: ""
      }
    };
  },
  methods: {
    // 关闭
    detpage() {
      this.resetSetItem("watchStorage2D", null);
      let page = sessionStorage.getItem("page");
      let pageTeacher = sessionStorage.getItem("pageTeacher");
      // 进行来源判断

      let SourcePage = JSON.parse(sessionStorage.getItem("SourcePage"));
      this.$emit("handleSelect", SourcePage.index);
      this.$router.replace(SourcePage.path);
    }
  },
  mounted() {
     //判断学生老师  字段
    let role = JSON.parse(sessionStorage.getItem("user")).role;
    if (role == "teacher") {
      this.agentData.mode = 'task_experiment_exercise_template_editor'
    }
    else {
      this.agentData.mode = 'task_experiment_exercise_instance_editor'
    }
  },

  created() {
     this.$emit("handleSelect", 10);
  const tasks = JSON.parse(sessionStorage.getItem("watchStorage2D"));
    //获取本地缓存中的令牌mytoken
    let token = localStorage.getItem("token");
    this.name=tasks.name;
    this.type=tasks.type;
    this.agentData.token = token;
    this.agentData.id = tasks.id;
    this.agentData.Expname = tasks.name;
    this.agentData.type = tasks.type;
    if (tasks.look == true) {
      this.agentData.look = tasks.look;
    }





  }
};
</script>
<style lang="less" scoped>
.box {
  width: 96%;
  margin: -1px 2%;
  height: 95%;
  border: 1px solid #ccc;
  padding: 5px;
}
</style>

