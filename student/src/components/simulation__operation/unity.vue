<template>
  <div class="box">
    <div>
      <span>仿真实验进行中........</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      websock: null,
      wsUrl: "ws://localhost:65100/creator",
      agentData: []
    };
  },
  methods: {
    on_click_hide_unity_window() {
      var cmd = "{'opcode':3}";

      wfapp.start(cmd);
    }
  },
  created() {},
  destroyed() {
    this.on_click_hide_unity_window();
  }
};
</script>


<style lang="less" scoped>
div {
  span {
    font-size: 40px;
    font-weight: 900;
    color: #685f5f98;
  }
}
.box {
  background-color: black;
  width: 100%;
  height: 100%;
  padding-left: 20px;
}
.el-main {
  margin: 0;
  padding: 0;
  background-color: black;
}
</style>

<style>
</style>

