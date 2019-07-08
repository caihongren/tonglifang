<template>
  <div class="relaybanner">
    <div class="Breadcrumb" @click="guizone">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{course}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo ralateacher"
      mode="horizontal"
      style="background-color: rgb(35, 38, 41);"
      @select="handleSelect"
      background-color="#232629"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <router-link to="/relayteacher/study/courseIntroduction">
        <el-menu-item index="1" class="Surveybox">课程管理</el-menu-item>
      </router-link>
      <router-link to="/relayteacher/componentLibrary">
        <el-menu-item index="4">元件库</el-menu-item>
      </router-link>
      <!-- <router-link to="/relayteacher/newcomponentLibrary">
        <el-menu-item index="9">新元件库</el-menu-item>
      </router-link>-->
      <!-- <router-link to="/relayteacher/experimentalTemplateLibrary">
        <el-menu-item index="5">实验模板库</el-menu-item>
      </router-link>-->
      <!-- 新开实验模板库 -->
      <router-link to="/relayteacher/newExperimentalTemplateLibrary">
        <el-menu-item index="3">实验模板库</el-menu-item>
      </router-link>

      <router-link to="/relayteacher/taskManagement">
        <el-menu-item index="2">实验任务管理</el-menu-item>
      </router-link>

      <router-link to="/relayteacher/simulationDatabase">
        <!-- 仿真资源库 -->
        <el-menu-item index="6">仿真资源库</el-menu-item>
      </router-link>

      <router-link to="/relayteacher/Dimension2" v-if="iswatchStorage2D">
        <el-menu-item index="10">二维设计空间</el-menu-item>
      </router-link>
      <router-link to="/relayteacher/Dimension3" v-if="iswatchStorage3D">
        <el-menu-item index="11">三维设计空间</el-menu-item>
      </router-link>
        <router-link to="/task/Presentationteacher">
      
        <el-menu-item index="11">老师批阅</el-menu-item>
      </router-link>
    </el-menu>
  

    <keep-alive :include="['newExperimentalTemplateLibrary']">
      <router-view
        @gounity="gounity"
        @derunity="derunity"
        @yuangounity="yuangounity"
        @threadPoxi="threadPoxi"
        @handleSelect="handleSelect"
      ></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
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
        mode: "task_experiment_exercise_template_editor",
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
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      this.activeIndex = key;
      // console.log("存储页面", key);
      sessionStorage.setItem("pageTeacher", key);
    },
    // 回首页归零
    guizone() {
      // console.log("归零");
      this.activeIndex = "1";
      // console.log("存储页面", "1");
      sessionStorage.setItem("pageTeacher", "1");
    },
    gounity(row) {
      console.log("进入3d", row);
      console.log(this.id);
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
      // this.$router.push("/sExperiment1/unity/" + this.id);
    },
    // 元件库3D
    yuangounity(type) {
      let token = localStorage.getItem("token");
      let data = {
        token: token,
        name: "mode",
        mode: "element_browser",
        type: type
      };
      this.threadPoxi(data);
      let cmd =
        // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
        "{'opcode':4,'LocationX': 575,'LocationY':165,'LocationX_Right': 135,'LocationY_Buttom':80,'SizeX': 1210,'SizeY':700}";
      // "{'opcode':4,'LocationX': 755,'LocationY':135,'LocationX_Right': 15,'LocationY_Buttom':10,'SizeX': 1620,'SizeY':760}";
      // "{'opcode':4,'LocationX': 950,'LocationY':150,'LocationX_Right': 10,'LocationY_Buttom':100,}";

      wfapp.start(cmd);
    },
    // 关闭3D/
    derunity() {
      this.on_click_hide_unity_window();
    },
    threadPoxi(row) {
      // 实际调用的方法
      //参数
      console.log("发送");
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
          console.log("正常连姐");
          let data = { name: "heartbeat" };
          let str = JSON.stringify(data);
          self.websock.send(str);
        } else {
          //否则重连
          console.log("重连");
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
      console.log("WebSocket连接发生错误");
      //错误提示
      // s.error("Websocket error, Check you internet!");
      //重连
      // this.reconnect();
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      console.log(redata.value);
    },
    websocketsend(agen) {
      //数据发送
      console.log(agen, "数据发送");
      this.websock.send(JSON.stringify(agen));
    },
    websocketclose(e) {
      //关闭
      console.log("connection closed (" + e.code + ")");
    },
    on_click_hide_unity_window() {
      var cmd = "{'opcode':3}";

      wfapp.start(cmd);
    },

    on_click_show_unity_window() {
      var cmd =
        // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
        "{'opcode':4,'LocationX': 125,'LocationY':150,'LocationX_Right': 125,'LocationY_Buttom':100,'SizeX': 1620,'SizeY':760}";

      wfapp.start(cmd);
    },
    // 2d3D信息
    type2D3D() {
      const watchStorage2D = JSON.parse(
        sessionStorage.getItem("watchStorage2D")
      );
      const watchStorage3D = JSON.parse(
        sessionStorage.getItem("watchStorage3D")
      );
      // console.log(watchStorage2D, watchStorage3D, "2d3d");
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
    }
  },
  created() {
    let course = JSON.parse(sessionStorage.getItem("course"));
    // console.log(course);
    this.course = course.course;
    this.initWebSocket();
    if (sessionStorage.getItem("pageTeacher")) {
      console.log(
        "当前页面",
        this.activeIndex,
        sessionStorage.getItem("pageTeacher")
      );
      this.activeIndex = sessionStorage.getItem("pageTeacher");
    }
    this.type2D3D();
    window.addEventListener("setItem", () => {
      this.type2D3D();
    });
  },
  destroyed() {
    console.log("离开断开websocket连接");
    this.websock.close(); // 离开路由之后断开websocket连接
  }
};
</script>

<style lang="less" scoped>
// 分页导航条
a {
  text-decoration: none;
  display: inline-block;
}
.el-menu-demo {
  height: 50px;
  margin-top: -1px;
  // margin-bottom: 10px;
}
.el-menu-item {
  height: 48px;
  min-width: 100px;
  margin: auto;

  // margin-left: 35px;
}
.Surveybox {
  // margin-left: 200px;
}
.relaybanner {
  position: relative;
  height: 90%;
}
.Breadcrumb {
  position: absolute;
  top: -25px;
  left: 250px;
}
</style>

<style>
</style>
