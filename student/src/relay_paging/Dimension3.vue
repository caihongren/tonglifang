<template>
  <div class="box">
    <!-- 菜单-->
    <el-row>
      <el-col :span="7" :offset="1">
        <div class="grid-content bg-purple">
          <h2>仿真资源库/{{name}}(类型:{{type}})</h2>
        </div>
      </el-col>

      <el-col :span="2" :offset="14">
        <div class="grid-content bg-purple" style="padding:10px 0">
          <el-button type="primary" @click="detpage()">关闭</el-button>
        </div>
      </el-col>
    </el-row>
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
        mode: "task_experiment_exercise_instance_editor",
        token: "",
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
      // console.log(SourcePage.index)
      this.$emit("handleSelect", SourcePage.index);

      this.$emit("derunity");

      this.$router.replace(SourcePage.path);
    }
  },
  mounted() {
    this.$emit("threadPoxi", this.agentData);
    let cmd =
      // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
      "{'opcode':4,'LocationX': 55,'LocationY':215,'LocationX_Right': 50,'LocationY_Buttom':10,'SizeX': 1820,'SizeY':900}";
 
    wfapp.start(cmd);
    // this.$emit('interspace')
  },
  created() {
    const tasks = JSON.parse(sessionStorage.getItem("watchStorage3D"));
    console.log(tasks);
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

    console.log(this.agentData);
  },
  destroyed() {
    this.$emit("derunity"); // 离开路由之后关闭显示
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

  .show {
    width: 100%;
    height: 90%;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
}
</style>

