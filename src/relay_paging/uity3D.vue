<template>
  <div>
    <div>
      <button @click="threadPoxi()">
        仿真实训进行中。。。。
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: "",

      // imgswiper:true,
      Arrowshow: true,
      name: "",
      offset: 0,
      limit: 50,
      tableData: "",
      herdernone: true,
      twoChick: 4,
      red: { color: "red" },
      websock: null,
      show2: false,
      // wsUrl: "ws://localhost:65100/creator",
      wsUrl: "ws://192.168.2.105:65100/creator",
      lockReconnect: false, //是否真正建立连接
      timeout: 60000, //30秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: 10000, //断开 重连倒计时
      agentData: {
        name: "mode",
        mode: "task_experiment_exercise_template_editor",
        token: "",
        id: "",
        type: '',
        Expname: '',
        taskExperimentId: ""
      }
    };
  },
  props: {
    tasks: Object
  },
  methods: {

    on_click_hide_unity_window() {
      var cmd = "{'opcode':3}";

     if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
    },

    on_click_show_unity_window() {
      var cmd =
        // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
        "{'opcode':4,'LocationX': 125,'LocationY':175,'LocationX_Right': 125,'LocationY_Buttom':175,'SizeX': 1620,'SizeY':760}";

     if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
    },
    // 关闭webpack和unity3D
    detunity3D(id) {
      this.on_click_hide_unity_window()
      //  this.websock.close();
    },
  },
  created() {
    this.initWebSocket();
    this.agentData.type = this.tasks.type
    this.agentData.Expname = this.tasks.name
    this.agentData.id = this.tasks.id
  },
  mounted() {
    this.threadPoxi()
    this.on_click_show_unity_window()
  },
  destroyed() {
    this.websock.close(); // 离开路由之后断开websocket连接\
  }
};
</script>