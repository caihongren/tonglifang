<template>
  <div class="relaybanner">
    <div class="Breadcrumb" @click="guizone()">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }" class="textcolor chongqing">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="textcolor">{{course}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo ralateacher"
      mode="horizontal"
      style=" position: absolute;top: -60px;left: 520px;line-height:60px;"
      @select="handleSelect"
      background-color="#0078d7"
      text-color="#fff"
      active-text-color="#ffc113"
    >
      <router-link to="/relayteacher/study/courseIntroduction">
        <el-menu-item index="1" class="Surveybox">课程管理</el-menu-item>
      </router-link>
      <router-link to="/relayteacher/componentLibrary">
        <el-menu-item index="2">元件库</el-menu-item>
      </router-link>
      <router-link to="/relayteacher/simulationDatabase" class="chongqing">
        <el-menu-item index="3">仿真资源库</el-menu-item>
      </router-link>
      <router-link to="/relayteacher/newExperimentalTemplateLibrary">
        <el-menu-item index="4">实训模板库</el-menu-item>
      </router-link>
      <router-link to="/relayteacher/taskManagement">
        <el-menu-item index="5">实训任务管理</el-menu-item>
      </router-link>
      <router-link to="/relayteacher/Dimension2" v-if="iswatchStorage2D">
        <el-menu-item index="10">二维设计空间</el-menu-item>
      </router-link>
      <!-- <router-link to="/relayteacher/Dimension3" v-if="iswatchStorage3D">
        <el-menu-item index="11">
三维设计空间
        </el-menu-item>
      </router-link>-->
      <router-link to="/relayteacher/Dimension3" v-if="iswatchStorage3D">
        <el-menu-item index="11">
          <el-tag closable :disable-transitions="true" class="det" @close="deet('3D')">三维设计空间</el-tag>
        </el-menu-item>
      </router-link>
      <!-- <router-link to="/relayteacher/Dimension2demo">
        <el-menu-item index="12">二维设计空间demo</el-menu-item>
      </router-link>-->
    </el-menu>
    <!-- <div style="border-bottom: 1px solid #f5f5f5;width:100%"></div> -->
    <keep-alive :include="['newExperimentalTemplateLibrary','taskManagement',]">
      <router-view
        @gounity="gounity"
        @derunity="derunity"
        @yuangounity="yuangounity"
        @threadPoxi="threadPoxi"
        @handleSelect="handleSelect"
        @deet="deet"
      ></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      iscourse: false,
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
      iswatchStorage3D: "", //判断2D或者3d界面
      path3D: "/relayteacher/Dimension3"
    };
  },
  methods: {
    // deet() {
    //   this.iswatchStorage3D = false;
    // },
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
      let courseid= JSON.parse(sessionStorage.getItem("course")).id ;
      let data = {
        token: token,
        courseid:courseid,
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

      //  if (typeof wfapp !== "undefined") {
      //     wfapp.start(cmd);
      //   }
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
    deet(type) {
      console.log(type);
      if (type == "3D") {
        this.resetSetItem("watchStorage3D", null);
        if ("/relayteacher/Dimension3" == this.$route.path) {
          let SourcePage = JSON.parse(sessionStorage.getItem("SourcePage"));
          this.handleSelect(SourcePage.index);
          this.derunity();
          console.log(SourcePage.path, "path");
          this.$router.replace(SourcePage.path);
        } else {
          let page = sessionStorage.getItem("pageTeacher");
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
      this.iswatchStorage3D = false;
    }
  },
  created() {
    let course = JSON.parse(sessionStorage.getItem("course"));
    if(sessionStorage.getItem("user")==null){
      this.$router.push('/login')
    }
    this.course = course.course;
    this.initWebSocket();
    if (sessionStorage.getItem("pageTeacher")) {
      // console.log(
      //   "当前页面",
      //   this.activeIndex,
      //   sessionStorage.getItem("pageTeacher")
      // );
      this.activeIndex = sessionStorage.getItem("pageTeacher");
    }
    this.type2D3D();
    window.addEventListener("setItem", () => {
      this.type2D3D();
    });
  },
  destroyed() {
    console.log("离开断开websocket连接");
    // this.guizone();
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
  height: 48px;
  // margin-top: -1px;
  // margin-bottom: 10px;
}
.el-menu-item {
  height: 60px;
  line-height: 65px;
  // min-width: 100px;
  margin: auto;
}
.relaybanner {
  position: relative;
  // height: 92%;
  height: calc(100% - 60px);
}
.Breadcrumb {
  position: absolute;
  top: -35px;
  left: 280px;
}
.det {
  background-color: transparent;
  border: 0px solid red;
  font-size: 18px;

  color: inherit;
}
</style>


<style>
.textcolor .el-breadcrumb__inner {
  color: #fff !important;
}
.ralateacher .el-menu-item{
    font-size: 18px;
}
</style>

