<template>
  <div class="banner">
    <div class="Breadcrumb" @click="guizone">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{course}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      style="background-color: #fff; position: absolute;top: -48px;left: 500px;"
      @select="handleSelect"
      background-color="#fff"
      text-color="black"
      active-text-color="#409EFF"
    >
      <router-link to="/relay/study">
        <el-menu-item index="1">课程学习</el-menu-item>
      </router-link>
      <router-link to="/relay/componentLibrary">
        <el-menu-item index="2">元件库</el-menu-item>
      </router-link>

      <router-link to="/relay/myTest">
        <el-menu-item index="3">实验任务</el-menu-item>
      </router-link>

      <router-link to="/relay/Dimension2" v-if="iswatchStorage2D">
        <el-menu-item index="10">二维设计空间</el-menu-item>
      </router-link>
      <router-link to="/relay/Dimension3" v-if="iswatchStorage3D">
        <el-menu-item index="11">
          <el-tag closable :disable-transitions="true" class="det" @close="det('3D')">三维设计空间</el-tag>
        </el-menu-item>
      </router-link>
    </el-menu>
    <div style="border-bottom: 1px solid #f5f5f5;width:100%"></div>
    <keep-alive :include="['myTest']">
      <router-view
        @gounity="gounity"
        @derunity="derunity"
        @yuangounity="yuangounity"
        @threadPoxi="threadPoxi"
        @handleSelect="handleSelect"
        @interspace="interspace"
      ></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex2: "1",
      course: "",
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
      wsUrl: "ws://localhost:65100/creator",
      // wsUrl: "ws://192.168.2.105:65100/creator",
      lockReconnect: false, //是否真正建立连接
      timeout: 60000, //30秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: 10000, //断开 重连倒计时
      agentData: {
        name: "mode",
        mode: "task_experiment_exercise_instance_editor",
        token: "",
        id: "",
        type: "",
        Expname: "",
        taskExperimentId: ""
      },
      newagentData: {},
      iswatchStorage2D: "", //判断2D或者3d界面
      iswatchStorage3D: "" //判断2D或者3d界面
    };
  },
  watch: {},
  methods: {
    handleSelect(key, keyPath) {
      // 刷新存储导航页面
      this.activeIndex2 = key;
      sessionStorage.setItem("page", key);
    },
    // 回首页归零
    guizone() {
      this.activeIndex2 = "1";
      sessionStorage.setItem("page", "1");
    },
    gounity(row) {
      //获取本地缓存中的令牌mytoken
      let token = localStorage.getItem("token");
      this.agentData.token = token;
      // this.agentData.id = id;
      this.agentData.id = row.id;
      this.agentData.Expname = row.name;
      this.agentData.type = row.type;

      this.agentData.taskExperimentId = this.id;
      this.threadPoxi();
      this.on_click_show_unity_window();

      this.$router.push("/sExperiment1/unity/" + this.id);
    },

    // 元件库3D
    yuangounity(type) {
      let token = localStorage.getItem("token");
      let data = {
        token: token,
        mode: "element_browser",
        type: type,
        name: "mode"
      };
      this.threadPoxi(data);
      let cmd =
        // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
        "{'opcode':4,'LocationX': 575,'LocationY':165,'LocationX_Right': 135,'LocationY_Buttom':80,'SizeX': 1210,'SizeY':700}";
      // "{'opcode':4,'LocationX': 755,'LocationY':135,'LocationX_Right': 15,'LocationY_Buttom':10,'SizeX': 1620,'SizeY':760}";
      // "{'opcode':4,'LocationX': 950,'LocationY':150,'LocationX_Right': 10,'LocationY_Buttom':100,}";

      if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
    },
    // 三维设计空间显示
    interspace() {
      let cmd =
        // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
        "{'opcode':4,'LocationX': 55,'LocationY':215,'LocationX_Right': 50,'LocationY_Buttom':10,'SizeX': 1820,'SizeY':900}";

      if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
    },
    // 关闭3D/
    derunity() {
      this.on_click_hide_unity_window();
    },
    threadPoxi(row) {
      // 实际调用的方法
      //参数
      let data = {};
      if (row) {
        data = row;
      } else {
        data = this.agentData;
      }
      //若是ws开启状态
      if (this.websock.readyState === this.websock.OPEN) {
        this.websocketsend(data);
      }
      // 若是 正在开启状态，则等待300毫秒
      else if (this.websock.readyState === this.websock.CONNECTING) {
        let that = this; //保存当前对象this
        setTimeout(function() {
          that.websocketsend(data);
        }, 300);
      }
      // 若未开启 ，则等待500毫秒
      else {
        this.initWebSocket();
        let that = this; //保存当前对象this
        setTimeout(function() {
          that.websocketsend(data);
        }, 500);
      }
    },
    initWebSocket() {
      //初始化weosocket
      //ws地址
      const wsuri = this.wsUrl;
      // const wsuri = "ws://localhost:65100/creator";
      // const wsuri = "ws://192.168.2.105:65100/creator";
      this.websock = new WebSocket(wsuri);
      //连接成功
      this.websock.onopen = this.websocketonopen;
      //连接错误
      this.websock.onerror = this.websocketonerror;
      //接收信息
      this.websock.onmessage = this.websocketonmessage;
      //连接关闭
      this.websock.onclose = this.websocketclose;
    },
    reconnect() {
      //重新连接
      var that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function() {
        //新连接
        that.initWebSocket();
        that.lockReconnect = false;
      }, 10000);
    },
    reset() {
      //重置心跳
      var that = this;
      //清除时间
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeoutObj);
      //重启心跳
      that.start();
    },
    start() {
      //开启心跳
      var self = this;
      self.timeoutObj && clearTimeout(self.timeoutObj);
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
      self.timeoutObj = setTimeout(function() {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.websock.readyState == 1) {
          //如果连接正常
          let data = { name: "heartbeat" };
          let str = JSON.stringify(data);
          self.websock.send(str);
        } else {
          //否则重连
          self.reconnect();
        }
        self.serverTimeoutObj = setTimeout(function() {
          //超时关闭
          self.websock.close();
        }, self.timeout);
      }, self.timeout);
    },
    websocketonopen() {
      //连接成功事件
      //生成二维码(参数内容，canvas的id)
      // s.qrcode(this.charId, "canvas");
      // //提示成功
      // s.success("连接成功", 3);
      //开启心跳
      this.start();
    },

    websocketonerror(e) {
      //连接失败事件
      //错误
      //错误提示
      // s.error("Websocket error, Check you internet!");
      //重连
      // this.reconnect();
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
    },
    websocketsend(agen) {
      //数据发送
      console.log("数据发送", agen);
      this.websock.send(JSON.stringify(agen));
    },
    websocketclose(e) {
      //关闭
    },
    on_click_hide_unity_window() {
      var cmd = "{'opcode':3}";

      if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
    },

    on_click_show_unity_window() {
      var cmd =
        // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
        "{'opcode':4,'LocationX': 125,'LocationY':150,'LocationX_Right': 125,'LocationY_Buttom':100,'SizeX': 1620,'SizeY':760}";
      if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
    },
    // 2d3D信息
    type2D3D() {
      const watchStorage2D = JSON.parse(
        sessionStorage.getItem("watchStorage2D")
      );
      const watchStorage3D = JSON.parse(
        sessionStorage.getItem("watchStorage3D")
      );
      if (watchStorage2D != null) {
        this.iswatchStorage2D = true;
      } else {
        this.iswatchStorage2D = false;
      }
      if (watchStorage3D != null) {
        this.iswatchStorage3D = true;
      } else {
        this.iswatchStorage3D = false;
      }
    },
    det(type) {
      if (type == "3D") {
        this.resetSetItem("watchStorage3D", null);
        if ("/relay/Dimension3" == this.$route.path) {
          let SourcePage = JSON.parse(sessionStorage.getItem("SourcePage"));
          this.handleSelect(SourcePage.index);
          this.derunity();
          this.$router.replace(SourcePage.path);
        } else {
          let page = sessionStorage.getItem("page");
          sessionStorage.setItem(
            "SourcePage",
            JSON.stringify({
              path: this.$route.path,
              index: page
            })
          );
        }
      } else if (type == "2D") {
      }
      // this.iswatchStorage3D = false;
    }
  },
  created() {
    let course = JSON.parse(sessionStorage.getItem("course"));
    this.course = course.course;
    this.initWebSocket();
    if (sessionStorage.getItem("page")) {
      this.activeIndex2 = sessionStorage.getItem("page");
    }
    this.type2D3D();
    window.addEventListener("setItem", () => {
      this.type2D3D();
    });
  },
  destroyed() {
    this.guizone();
    this.websock.close(); // 离开路由之后断开websocket连接
  }
};
</script>


<style lang="less" scoped>
.banner {
  position: relative;
  height: 100%;
  .Breadcrumb {
    position: absolute;
    top: -25px;
    left: 250px;
  }
  .el-menu-item {
    font-size: 16px;
    height: 48px;
    line-height: 48px;
    border-bottom: 2px solid red;
  }
}
.det {
  background-color: transparent;
  border: 0px solid red;
  font-size: 14px;

  color: inherit;
}
.el-menu-demo {
  height: 48px;
  // margin-top: -1px;
  // margin-bottom: 10px;
}
</style>


