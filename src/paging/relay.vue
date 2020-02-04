<template>
  <div class="banner">
    <div class="Breadcrumb" @click="guizone()">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/relay/home' }" class="textcolor chongqing">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="textcolor">{{course}}</el-breadcrumb-item>
        <el-breadcrumb-item
          class="textcolor"
          v-for="(item) in breadcrumb"
          v-bind:key="item"
        >{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      style="background-color: #fff; position: absolute;top: -60px;left: 520px;"
      @select="handleSelect"
      background-color="#fff"
      text-color="#dddddd"
      active-text-color="#ffc113"
    >
      <router-link to="/relay/study">
        <el-menu-item index="1">课程学习</el-menu-item>
      </router-link>
      <router-link to="/relay/componentLibrary">
        <el-menu-item index="2">元器件库</el-menu-item>
      </router-link>
      <router-link to="/relay/myTest">
        <el-menu-item index="3">实训任务</el-menu-item>
      </router-link>
      <router-link to="/relay/resources">
        <el-menu-item index="4">实训资源</el-menu-item>
      </router-link>
      <router-link to="/relay/Dimension3" v-if="iswatchStorage3D">
        <el-menu-item index="11">
          <el-tag closable :disable-transitions="true" class="det" @close="det('3D')">三维设计空间</el-tag>
        </el-menu-item>
      </router-link>
    </el-menu>-->
    <!-- 上测导航栏 -->
    <el-radio-group v-model="activeIndex2" class="tabPosition" @change="handleSelect" v-if="false">
      <el-radio-button label="1">
        <span class="nave" @click="tabPositionpath('/relay/study')">课程学习</span>
      </el-radio-button>
      <el-radio-button label="2">
        <span class="nave" @click="tabPositionpath('/relay/componentLibrary')">元器件库</span>
      </el-radio-button>
      <!-- <el-radio-button label="3" >
        <span class="nave" @click="tabPositionpath('/relay/myTest')">实训任务</span>
      </el-radio-button>-->
      <el-radio-button label="4">
        <span class="nave chongqing" @click="tabPositionpath('/relay/resources')">实训资源</span>
      </el-radio-button>
      <el-radio-button label="11" v-if="iswatchStorage3D">
        <span class="nave" @click="tabPositionpath('/relay/Dimension3' )">
          <el-tag closable :disable-transitions="true" class="det nave" @close="det('3D')">三维设计空间</el-tag>
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
          <el-menu-item index="-1" @click="tabPositionpath('/relay/home')">首页</el-menu-item>
          <!-- <el-menu-item index=" -3" @click="tabPositionpath('/relay/home')" v-if="iswatchStorage3D">
            <el-tag closable :disable-transitions="true" class="det" style="font-size:16px" @close="deet('3D')">三维设计空间</el-tag>
          </el-menu-item>-->
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
              @click="tabPositionpath('/relay/study/courseIntroduction',index)"
            >课程介绍</el-menu-item>

            <!-- <el-submenu :index=" index+'#实训练习'">
              <template slot="title">实训练习</template>
              <el-menu-item-group v-for="(items) in  item.module" v-bind:key="items.moduleId">
                <el-menu-item :index=" index+'#'+items.moduleName+'#'+itemss.name+'^'+itemss.trainingId" v-for="(itemss) in  items.studentTasks" v-bind:key="itemss.trainingId" :title="itemss.name" @click="tabPositionpathparams('/relay/study/experimentDetails',itemss,'teaching',true)">
                  <span class="icon iconfont">{{items.moduleName=='虚拟仿真实训'?'&#xe617;':''}}{{items.moduleName=='工程场景实训'?'&#xe64d;':''}}{{items.moduleName=='虚实联动实训'?'&#xe63e;':''}}</span>
                  {{itemss.name}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>-->

            <!-- <el-submenu :index=" index+'#实训任务'" class="danji">
              <template slot="title">实训任务</template>
                <el-menu-item :index=" index+'#实训任务#'+items.name+'^'+items.accountTaskId" v-for="(items) in  item.mymodule" v-bind:key="items.accountTaskId" :title="items.name" @click="tabPositionpathparams('/relay/study/experimentDetails',items,'examine',false)">{{items.name}}</el-menu-item>
              <el-submenu :index=" index+'#实训任务#故障排除'">
                <template slot="title">故障排除</template>
                <el-menu-item :index=" index+'#实训任务#故障排除#'+items.name+'^'+items.accountTaskId" v-for="(items) in  item.mymodule" v-bind:key="items.accountTaskId" :title="items.name" @click="tabPositionpathparams('/relay/study/experimentDetails',items,'examine',false)">{{items.name}}</el-menu-item>
              </el-submenu>
            </el-submenu>-->
            <!-- <el-menu-item
              :index=" index+'#'+items.name"
              v-for="(items) in  item.mymodule"
              v-bind:key="items.accountTaskId"
              :title="items.name"
              @click="tabPositionpathparams('/relay/study/experimentDetails',items,'practice',false)"
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
                @click="tabPositionpathparams('/relay/study/experimentDetails',item2,'practice',false)"
              >
                <template slot="title">
                  <span :title="item2.menuName">{{indexs+1}}{{"."}}{{index2+1}}.{{item2.menuName}}</span>
                </template>
                <el-menu-item
                  :index=" index+'#'+items.menuName+'#'+item2.menuName+'#'+item3.menuName"
                  v-for="(item3,index3) in item2.menuOne"
                  :key="item3.menuId+'submenu'"
                  @click="tabPositionpathparams('/relay/study/experimentDetails',item3,'practice',false)"
                >
                  <template slot="title">
                    <span :title="item3.menuName">{{item3.menuName}}</span>
                  </template>
                </el-menu-item>
              </components>

              <!-- <el-menu-item :index=" index+'#'+items.menuName+'#'+itemss.name+'^'+itemss.id" v-for="(itemss ,indexss) in  items.trainings" v-bind:key="itemss.id" @click="tabPositionpathparams('/relayteacher/study/experimentDetails',itemss,'teaching',false)" :title="itemss.name">{{indexs+1}}{{"."}}{{indexss+1}}{{"."}}{{itemss.name}}</el-menu-item>
              -->
            </el-submenu>

            <!-- 模型库 -->
            <el-menu-item
              :index=" index+'#模型库'"
              @click="tabPositionpath('/relay/newcomponentLibrary',null,index)"
            >模型库</el-menu-item>

            <!-- 图纸库 -->
            <!-- <el-menu-item :index=" index+'#图纸库'" >图纸库</el-menu-item> -->

            <!-- 试题部分 -->

            <el-submenu :index=" index+'#试卷'">
              <template slot="title">
                <span>试卷</span>
              </template>
              <el-menu-item
                :index=" index+'#试卷管理#练习试卷'"
                @click="tabPositionpath('/relay/lowerHairStudents',1,index)"
              >练习试卷</el-menu-item>
              <el-menu-item
                :index=" index+'#试卷管理#考试试卷'"
                @click="tabPositionpath('/relay/ExaminationStudents',2,index)"
              >考试试卷</el-menu-item>
            </el-submenu>

            <!-- <el-menu-item class="danji" :index=" index+'#自由创新实验'" @click="tabPositionpath('/relay/freeTest',1,index)">自由创新实验</el-menu-item> -->
          </el-submenu>

          <!-- //课程2 -->
          <!-- 传感器综合实训 -->
          <!-- <el-submenu index="-5">
            <template slot="title">
              <span>传感器综合实训</span>
            </template>
            <el-menu-item
              index="-5#传感器应用实训"
              @click="tasks('/relay/newdimension3')"
            >传感器应用实训</el-menu-item>
          </el-submenu>-->
        </el-menu>
      </div>
    </div>

    <keep-alive :include="['myTest',]">
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
import {
  get_component_group, //元件组
  get_training_module, //获取实训模块
  getModuleAndTrainingInner, //课程实训列表
  getTaskByStudent, // 获取课程实训列表
  get_menu_and_training,
  get_training_inner,
  curlist, //课程列表
  login
} from "../API/api";
import global_ from "../API/Global.js"; //引用文件
export default {
  data() {
    return {
      activeIndex2: "1",
      breadcrumb: [], //导航路径
      course: "",
      courselist: [], //课程集合
      pagepath: "-1",
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
        mode: "task_experiment_exercise_instance_editor",
        token: "",
        id: "",
        type: "",
        Expname: "",
        threeName: "",
        taskExperimentId: ""
      },
      newagentData: {},
      iswatchStorage2D: "", //判断2D或者3d界面
      iswatchStorage3D: "" //判断2D或者3d界面
    };
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {});
  },
  watch: {},
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

      getTaskByStudent({
        innerr: true, //true 课程实训  false 我的实训
        trainingTypeId: null, // 类型id  不选传null
        trainingSearch: null, // 查找内容 不选传null
        offset: 0,
        limit: 10000
      }).then(res => {
        if (res.data.code == 0) {
          this.courselist[key].module = res.data.object;
        }
      });
      get_menu_and_training().then(res => {
        if (res.data.code == 0) {
          console.log(res);
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
      this.$router.push("/relay/newDimension3");
    },
    tabPositionpath(path, type) {
      this.$router.push({
        path: path,
        query: {
          type: type
        }
      });
      // this.$router.push(path);
    },
    tabPositionpathparams(path, row, type, inlay) {
      let exam = row.exam;
      let practice = row.practice;
      let teaching = row.teaching;
      if (practice == null) {
        practice = true;
      }
      if (teaching == null) {
        teaching = true;
      }
      if (inlay) {
        teaching = true;
        practice = true;
        exam = false;
      } else {
        teaching = false;
        practice = false;
        exam = true;
      }
      teaching = false;
      practice = false;
      exam = false;

      this.$router.push({
        path: path,
        query: {
          id: row.menuId,
          accountTaskId: row.accountTaskId,
          taskId: row.taskId ? row.taskId : "",
          name: row.name,
          type: type,
          teaching: teaching,
          examine: exam,
          practice: practice,
          isteacher: false
        }
      });
    },

    handleSelect(key, keyPath) {
      // 刷新存储导航页面
      this.activeIndex2 = key;

      sessionStorage.setItem("page", key);
    },
    // 回首页归零
    guizone() {
      this.activeIndex2 = 1;
      // this.activeIndex2 = "1";

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
      let courseid = JSON.parse(sessionStorage.getItem("course")).id;
      let data = {
        token: token,
        courseid: courseid,
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

      // if (typeof wfapp !== "undefined") {
      //   wfapp.start(cmd);
      // }
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
    },
    // 自动化登录
    automation() {
      login().then(res => {
        if (res.data.code == 0) {
          let token = res.data.object.token;
          let user = res.data.object.account;
          localStorage.setItem("token", token);
          sessionStorage.setItem("token", token);
          // 发送token到wif
          let cmd = {
            opcode: 10,
            token: token
          };
          if (typeof wfapp !== "undefined") {
            wfapp.start(JSON.stringify(cmd));
          }
          sessionStorage.setItem("user", JSON.stringify(user));
        } else {
          this.$message.error({
            showClose: true,
            message: "用户名密码错误",
            type: "warning",
            duration: 1000
          });
        }
      });
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
  mounted() {
    if (sessionStorage.getItem("breadcrumb")) {
      let page = JSON.parse(sessionStorage.getItem("breadcrumb"));
      this.breadcrumb = page.pagelist;
      this.course = page.course;
      this.pagepath = page.path;
    }
  },
  created() {
    if (sessionStorage.getItem("user") == null && global_.standAlone) {
      this.automation();
    } else {
      // this.$router.push("/login");
    }

    this.params();
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
    // this.guizone();
    this.websock.close(); // 离开路由之后断开websocket连接
  }
};
</script>


<style lang="less" scoped>
.el-menu-item.is-active {
  background-color: #1c262f !important;
}
.tabPosition {
  text-align: center;
  position: absolute;
  top: -47px;
  left: 500px;
  .nave {
    line-height: 45px;
    padding: 13px 25px;
  }
  .det {
    padding: 0;
  }

  // padding-top: 10px;
}
.banner {
  position: relative;
  height: calc(100% - 60px);

  .Breadcrumb {
    position: absolute;
    top: -35px;
    left: 280px;
    z-index: 100;
  }
  .el-menu-item {
    // font-size: 16px;
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    border-bottom: 0px solid red;
  }
}
.det {
  background-color: transparent;
  border: 0px solid red;
  font-size: 18px;
  padding: 0;
  color: inherit;
}
.el-menu-demo {
  height: 48px;
  // margin-top: -1px;
  // margin-bottom: 10px;
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
</style>
<style >
.textcolor .el-breadcrumb__inner {
  color: #fff !important;
}
.banner .el-radio-button__inner {
  border-color: #fff;
  border-bottom: none;
  border-radius: 0px;
  padding: 0px 0px;
  border-radius: 0px;
  font-size: 18px;
  box-sizing: border-box;
}
.banner .el-submenu .el-menu-item {
  padding: 0;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.banner .el-menu-item-group__title {
  padding: 0;
}
.banner
  .tabPosition
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  background-color: #4d7283;
  color: #fff;
  border-radius: 5px 5px 0 0;
  border-color: #4d7283;
  box-shadow: -1px 0 0 0 #4d7283;
  height: 46px;
}
.banner .el-radio-button:first-child .el-radio-button__inner {
  border-left: 1px solid #fff;
}
.banner .el-tag {
  line-height: 0px;
  padding: 0 0;
}
.banner .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
  -webkit-box-shadow: 0 0 0px 0px #409eff;
  box-shadow: 0 0 0px 0px #409eff;
}
</style>


