<template>
  <div class="relaybanner">
    <div class="Breadcrumb" @click="guizone()">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/relayteacher/teacherhome' }" class="textcolor">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="textcolor">{{course}}</el-breadcrumb-item>
        <el-breadcrumb-item
          class="textcolor"
          v-for="(item) in breadcrumb"
          v-bind:key="item"
        >{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 上侧导航栏 -->
    <el-radio-group v-model="activeIndex" class="tabPosition" @change="handleSelect" v-if="false">
      <el-radio-button label="1" class="disflax">
        <span class="nave" @click="tabPositionpath('/relayteacher/study/courseIntroduction')">课程管理</span>
      </el-radio-button>
      <el-radio-button label="2" class="disflax">
        <span class="nave" @click="tabPositionpath('/relayteacher/taskManagement')">任务管理</span>
      </el-radio-button>
      <el-radio-button label="3" class="disflax">
        <span class="nave" @click="tabPositionpath('/relayteacher/componentLibrary')">元器件库</span>
      </el-radio-button>
      <el-radio-button label="4" class="disflax">
        <span
          class="nave chongqing"
          @click="tabPositionpath('/relayteacher/simulationDatabase')"
        >仿真资源库</span>
      </el-radio-button>
      <el-radio-button label="6" class="disflax">
        <span class="nave" @click="tabPositionpath('/relayteacher/resources')">实训资源</span>
      </el-radio-button>
      <el-radio-button label="11" v-if="iswatchStorage3D" class="disflax">
        <span class="nave" @click="tabPositionpath('/relayteacher/Dimension3')">
          <el-tag closable :disable-transitions="true" class="det nave" @close="deet('3D')">三维设计空间</el-tag>
        </span>
      </el-radio-button>
    </el-radio-group>

    <!-- 左侧导航栏 -->

    <div class="leftNavigation">
      <div class="leftbox">
        <el-menu
          :default-active="pagepath"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @select="handleClose"
          background-color="#2e3d49"
          text-color="#7a8892"
          active-text-color="#ffffff"
          style="width:252px;border:0px;"
        >
          <el-menu-item index="-1" @click="tabPositionpath('/relayteacher/teacherhome')">首页</el-menu-item>
          <el-menu-item
            index=" -3"
            @click="tabPositionpath('/relayteacher/Dimension3')"
            v-if="iswatchStorage3D"
          >
            <el-tag
              closable
              :disable-transitions="true"
              class="det"
              style="font-size:16px"
              @close="deet('3D')"
            >三维设计空间</el-tag>
          </el-menu-item>

          <!-- <el-submenu :index="'-4#设备库管理'" v-if="issupervisor">
            <template slot="title">
              <span>设备库管理</span>
            </template>
            <el-menu-item :index=" '-4#设备库#全部'" @click="tabPositionpath('/relayteacher/componentLibrary',null,index)">全部</el-menu-item>
            <el-menu-item :index=" '-4#设备库#仪表'" @click="tabPositionpath('/relayteacher/componentLibrary',null,index)">仪表</el-menu-item>
            <el-menu-item :index=" '-4#设备库#工具'" @click="tabPositionpath('/relayteacher/componentLibrary',null,index)">工具</el-menu-item>
            <el-menu-item :index=" '-4#设备库#场景'" @click="tabPositionpath('/relayteacher/componentLibrary',null,index)">场景</el-menu-item>
            <el-menu-item :index=" '-4#设备库#设备'" @click="tabPositionpath('/relayteacher/componentLibrary',null,index)">设备</el-menu-item>
          </el-submenu>-->

          <el-submenu
            v-bind:index="String(index)"
            v-for="(item,index) in courselist"
            v-bind:key="item.id"
          >
            <template slot="title">
              <span>{{item.course}}</span>
            </template>

            <el-menu-item
              :index=" index+'#课程介绍'"
              @click="tabPositionpath('/relayteacher/study/courseIntroduction',index)"
            >课程介绍</el-menu-item>
            <!-- 任务列表 -->
            <!-- <el-menu-item
              :index=" index+'#'+items.name"
              @click="tabPositionpathparams('/relayteacher/study/experimentDetails',items,'practice',false,true)"
              v-for="(items,indexs ) in item.mymodule"
            >{{items.name}}</el-menu-item> -->

             <el-submenu
              class="jiantou"
              :index=" index+'#'+items.menuName"
              v-for="(items,indexs) in  item.mymodule"
              v-bind:key="items.menuId"
            >
              <template slot="title">
                <span :title="items.menuName">{{indexs+1}}{{"."}} {{items.menuName}}</span>
              </template>
              <components
                class="subset"
                :is="item2.type=='menu'?'el-submenu':'el-menu-item'"
                :index=" index+'#'+items.menuName+'#'+item2.menuName"
                v-for="(item2,index2) in items.menuOne"
                :key="item2.menuId+'submenu'"
                @click="tabPositionpathparams('/relayteacher/study/experimentDetails',item2,'practice',false,true)"
              >
                <template slot="title">
                  <span :title="item2.menuName">{{indexs+1}}{{"."}}{{index2+1}}.{{item2.menuName}}</span>
                </template>
                <el-menu-item
                  :index=" index+'#'+items.menuName+'#'+item2.menuName+'#'+item3.menuName"
                  v-for="(item3,index3) in item2.menuOne"
                  :key="item3.menuId+'submenu'"
                  @click="tabPositionpathparams('/relayteacher/study/experimentDetails',item3,'practice',false,true)"
                >
                  <template slot="title">
                    <span :title="item3.menuName">{{item3.menuName}}</span>
                  </template>
                </el-menu-item>
              </components>

              <!-- <el-menu-item :index=" index+'#'+items.menuName+'#'+itemss.name+'^'+itemss.id" v-for="(itemss ,indexss) in  items.trainings" v-bind:key="itemss.id" @click="tabPositionpathparams('/relayteacher/study/experimentDetails',itemss,'teaching',false)" :title="itemss.name">{{indexs+1}}{{"."}}{{indexss+1}}{{"."}}{{itemss.name}}</el-menu-item>
              -->
            </el-submenu>

            <!-- 内置实验模板库 -->
            <!-- <el-menu-item :index=" index+'#内置实训模板库'" @click="tabPositionpath('/relayteacher/study/trainingCourse',index)">内置实训模板库</el-menu-item> -->

            <!-- 实验模板库 -->
            <!-- <el-menu-item :index=" index+'#我的实训模板库'" @click="tabPositionpath('/relayteacher/study/myTraining',index)" v-if="!issupervisor">我的实训模板库</el-menu-item> -->

            <!-- 实训评估 -->

            <!-- </el-submenu> -->
            <!-- <el-submenu :index=" index+'#任务管理'" v-if="!issupervisor">
              <template slot="title">
                <span>任务管理</span>
              </template>
              <el-menu-item :index=" index+'#任务管理#已下发任务'" @click="tabPositionpath('/relayteacher/taskManagement',1,index)">已下发任务</el-menu-item>
              <el-menu-item :index=" index+'#任务管理#已结束任务'" @click="tabPositionpath('/relayteacher/taskManagement',2,index)">已结束任务</el-menu-item>
            </el-submenu>-->
            <!-- <el-submenu :index=" index+'#课程设备库'">
              <template slot="title">
                <span>课程设备库</span>
              </template>
              <el-menu-item
                :index=" index+'#课程设备库#全部'"
                @click="tabPositionpath('/relayteacher/componentLibrary',null,index)"
              >全部</el-menu-item>
              <el-menu-item
                :index=" index+'#课程设备库#'+items.name"
                v-for="(items) in  item.componentGroup"
                v-bind:key="items.id"
                @click="tabPositionpath('/relayteacher/componentLibrary',items.id,index)"
                :title="items.name"
              >{{items.name}}</el-menu-item>
            </el-submenu>-->
            <!-- 模型库 -->

            <el-menu-item
              :index=" index+'#模型库'"
              @click="tabPositionpath('/relayteacher/newcomponentLibrary',null,index)"
            >模型库</el-menu-item>
            <!-- 图纸库 -->

            <!-- <el-menu-item
              :index=" index+'#图纸库'"
              @click="tabPositionpath('/relayteacher/drawing',null,index)"
            >图纸库</el-menu-item>-->
            <el-submenu :index=" index+'#虚拟实验资源库'" v-if="issupervisor">
              <template slot="title">
                <span>虚拟实验资源库</span>
              </template>
              <el-menu-item
                :index=" index+'#虚拟实验资源库#仿真资源'"
                @click="tabPositionpath('/relayteacher/simulationDatabase',1,index)"
              >仿真资源</el-menu-item>
            </el-submenu>
            <!-- 试题库 -->
            <el-submenu :index=" index+'#试题库'">
              <template slot="title">
                <span>试题库</span>
              </template>
              <el-menu-item
                :index=" index+'#试题库#题库管理'"
                @click="tabPositionpath('/relayteacher/taskBank',index)"
              >题库管理</el-menu-item>
              <el-menu-item
                :index=" index+'#试题库#组卷管理'"
                @click="tabPositionpath('/relayteacher/testPaperGeneration',index)"
              >组卷管理</el-menu-item>
            </el-submenu>

            <!-- 试卷库 -->
            <el-submenu :index=" index+'#试卷'">
              <template slot="title">
                <span>试卷</span>
              </template>
             <el-menu-item
              :index=" index+'#试卷#练习试卷'"
              @click="tabPositionpath('/relayteacher/lowerHair',index)"
              v-if="!issupervisor"
            >练习试卷</el-menu-item>
            <el-menu-item
              :index=" index+'#试卷#考试试卷'"
              @click="tabPositionpath('/relayteacher/Examination',index)"
              v-if="!issupervisor"
            >考试试卷</el-menu-item>
            </el-submenu>
           
            <!-- <el-menu-item :index=" index+'#实训评估'" @click="tabPositionpath('/relayteacher/study/averageScore',index)" v-if="!issupervisor">实训评估</el-menu-item> -->
            <!-- <el-menu-item v-if="!issupervisor" :index=" index+'#自由创新实验'" @click="tabPositionpath('/relayteacher/freeTest',1,index)">自由创新实验</el-menu-item> -->
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <keep-alive :include="['newExperimentalTemplateLibrary',]">
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
import {
  get_component_group, //元件组
  get_training_module, //获取实训模块
  getModuleAndTrainingInner, //课程实训列表
  get_menu_and_training,
  get_training_inner,
  getModuleAndTrainingSelf, // 获取课程实训列表
  curlist //课程列表
} from "../API/api";
export default {
  data() {
    return {
      activeIndex: "1",
      iscourse: false,
      breadcrumb: [], //导航路径
      course: "",
      pagepath: "-1",
      courselist: [], //课程集合
      trainingModule: {}, //实训模块
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
        threeName: "",
        Expname: "",
        taskExperimentId: ""
      },
      newagentData: {},
      iswatchStorage2D: "", //判断2D或者3d界面
      iswatchStorage3D: "", //判断2D或者3d界面
      issupervisor: false, //是否教导主任
      path3D: "/relayteacher/Dimension3"
    };
  },

  methods: {
    // 菜单展开请求元件库,实训类型数据
    handleOpen(key, keyPath) {
      // 请求数据
      if (keyPath[0] >= 0 && keyPath.length == 1) {
        let course = this.courselist[key];
        this.course = course.course;
        sessionStorage.setItem("course", JSON.stringify(course));
        this.getlist(key);
      }
    },
    // 请求数据
    getlist(key) {
      //获取实训模块

      //获取实训模块

      getModuleAndTrainingInner().then(res => {
        if (res.data.code == 0) {
          this.courselist[key].module = res.data.object;
        }
      });
      // 获取我的实训
      get_menu_and_training().then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.courselist[key].mymodule = res.data.object;
        }
      });
      //获取元件库
      get_component_group().then(res => {
        if (res.data.code == 0) {
          this.courselist[key].componentGroup = res.data.object;
        }
      });
    },
    handleClose(key, keyPath) {
      let list = keyPath[keyPath.length - 1].split("#");
      let index = list.shift();
      if (list[list.length - 1].search("^") != -1) {
        list[list.length - 1] = list[list.length - 1].split("^")[0];
      }
      this.breadcrumb = list;

      if (keyPath[0] >= 0 && keyPath.length >= 1) {
        let course = this.courselist[index];
        this.course = course.course;
        sessionStorage.setItem("course", JSON.stringify(course));
      }
      let page = {
        course: this.course,
        pagelist: this.breadcrumb,
        path: key
      };
      sessionStorage.setItem("breadcrumb", JSON.stringify(page));

      if (keyPath[0] < 0) {
        if (key == "-1") {
          this.breadcrumb = [];
          this.course = "";
        } else if (key == "-3") {
          this.breadcrumb = [];
          this.course = "三维设计空间";
        } else if (keyPath[0] == "-5") {
          this.breadcrumb = ["传感器应用实训"];
          this.course = "传感器综合实训";
        }
      }
    },
    // 打开new3D
    tasks(path) {
      let tasks = {};
      tasks.id = "a01671c4-23eb-48bf-868f-6c01e9c8c150";
      tasks.name = "传感器应用实训";
      tasks.type = "三维设计模式";
      tasks.look = true;
      tasks.taskExperimentId = this.id;
      sessionStorage.setItem("watchStorage3D", JSON.stringify(tasks));
      this.$router.push("/relayteacher/newDimension3");
    },
    tabPositionpath(path, type, index) {
      this.$router.push({
        path: path,
        query: {
          type: type,
          index: index
        }
      });
      // this.$router.push(path);
    },
    tabPositionpathparams(path, row, type, boolean, inlay) {
      let teaching = true;
      let practice = true;
      let examine = true;
      // if (inlay) {
      //   teaching = true;
      //   practice = true;
      //   examine = false;
      // } else {
      //   teaching = false;
      //   practice = false;
      //   examine = true;
      // }
      teaching = false;
      practice = true;
      examine = false;
      //教导主任
      if (this.issupervisor) {
        teaching = true;
        practice = true;
        examine = true;
      }
      this.$router.push({
        path: path,
        query: {
          id: row.menuId,
          name: row.name,
          type: type,
          teaching: teaching,
          examine: examine,
          practice: practice,
          isteacher: boolean
        }
      });
    },

    handleSelect(key, keyPath) {
      this.activeIndex = key;

      sessionStorage.setItem("pageTeacher", key);
    },
    // 回首页归零
    guizone() {
      this.activeIndex = "1";
      sessionStorage.setItem("pageTeacher", "1");
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
      // this.$router.push("/sExperiment1/unity/" + this.id);
    },
    // 元件库3D
    yuangounity(type) {
      let token = localStorage.getItem("token");
      let courseid = JSON.parse(sessionStorage.getItem("course")).id;
      let data = {
        token: token,
        courseid: courseid,
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
          console.log("正常连接");
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
      if (type == "3D") {
        this.resetSetItem("watchStorage3D", null);
        if ("/relayteacher/Dimension3" == this.$route.path) {
          let SourcePage = JSON.parse(sessionStorage.getItem("SourcePage"));
          this.handleSelect(SourcePage.index);
          this.derunity();
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
    },
    //判断教导主任
    supervisor() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      if (user.position == "supervisor" && user.role == "teacher") {
        this.issupervisor = true;
      } else {
        this.issupervisor = false;
      }
    },
    // 左侧列表数据处理
    params() {
      curlist().then(res => {
        for (let i = 0; i < res.data.object.length; i++) {
          res.data.object[i].module = [];
          res.data.object[i].mymodule = [];
          res.data.object[i].componentGroup = [];
        }
        this.courselist = res.data.object;
        if (res.data.object.length > 0) {
          if (sessionStorage.getItem("course")) {
            let course = JSON.parse(sessionStorage.getItem("course"));
            let list = this.courselist;
            for (let i = 0; i < list.length; i++) {
              if (list[i].id == course.id) {
                this.getlist(i);
                break;
              }
            }
          } else {
            this.course = res.data.object[0].course;
            this.getlist(0);
            sessionStorage.setItem(
              "course",
              JSON.stringify(res.data.object[0])
            );
          }
        }
      });
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        if (
          val.path == "/relayteacher/teacherhome" ||
          val.path == "/relay/home"
        ) {
          console.log("回首页");
          this.breadcrumb = [];
          this.course = "";
        } else if (
          val.path == "/relayteacher/newdimension3" ||
          val.path == "/relay/newdimension3"
        ) {
          this.course = "传感器综合实训";
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  mounted() {
    if (sessionStorage.getItem("breadcrumb")) {
      let page = JSON.parse(sessionStorage.getItem("breadcrumb"));

      this.breadcrumb = page.pagelist;
      this.course = page.course;
      this.pagepath = page.path;
    }
  },
  created() {
    if (sessionStorage.getItem("user") == null) {
      this.$router.push("/login");
    }
    this.params();
    this.initWebSocket();
    this.supervisor();
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
.tabPosition {
  position: absolute;
  text-align: center;
  top: -54px;
  left: 500px;
  .nave {
    line-height: 51px;
    padding: 13px 25px;
  }
}
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
  z-index: 100;
}
.det {
  background-color: transparent;
  border: 0px solid red;
  font-size: 18px;
  color: inherit;
  margin-top: -10px;
}

//左侧导航栏
.leftNavigation {
  width: 250px;
  position: absolute;
  height: 100%;
  z-index: 3;
  background-color: #2e3d49;
  overflow: hidden;
  .leftbox {
    width: 260px;
    height: 100%;
    overflow-y: scroll;
  }
}
.el-menu-item.is-active {
  background-color: #1c262f !important;
}
</style>


<style>
.textcolor .el-breadcrumb__inner {
  color: #fff !important;
}
.ralateacher .el-menu-item {
  font-size: 18px;
}
.relaybanner .el-radio-button__inner {
  border-color: #fff;
  border-bottom: none;
  border-radius: 0px;
  padding: 0px 0px;
  border-radius: 0px;
  font-size: 18px;
  box-sizing: border-box;
}
.relaybanner .el-submenu .el-menu-item {
  padding: 0;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.relaybanner
  .tabPosition
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  background-color: #4d7283;
  color: #fff;
  border-radius: 5px 5px 0 0;
  border-color: #4d7283;
  box-shadow: -1px 0 0 0 #4d7283;
  height: 53px;
}
.relaybanner .el-radio-button:first-child .el-radio-button__inner {
  border-left: 1px solid #fff;
}
.relaybanner .tabPosition .el-tag {
  line-height: 0px;
  padding: 0 0;
}
.relaybanner .el-menu-item-group__title {
  padding: 0;
}

.relaybanner
  .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
  -webkit-box-shadow: 0 0 0px 0px #409eff;
  box-shadow: 0 0 0px 0px #409eff;
}
</style>

