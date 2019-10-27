<template>
  <div class="banner">
    <el-container>
      <el-header v-if="herdernone" height="80px">
        <!-- <router-link to="/sExperiment1/unity"> -->
        <!-- <div >
            <img src="./../../../image/vivo.png" @click="SendExperimentExerciseInstanceEditor()">
        </div>-->
        <!-- </router-link>  -->
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-row :gutter="20">
              <el-col :span="5">
                <div class="grid-content bg-purple">
                  <div class="gounity" @click="show2=!show2">
                    <img src="./../../../image/vivo.png">
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <transition name="el-zoom-in-left">
                    <div v-show="show2" class="transition-box">
                      <el-button type="primary" @click="gounity('')">实训模板</el-button>

                      <el-button type="primary" @click="goguidance()">进入实训快照</el-button>

                    </div>
                  </transition>
                </div>
              </el-col>
            </el-row>
            <!-- <div class="gounity" @click="show2=true">
              <img src="./../../../image/vivo.png">
            </div>
            <div>
              <transition name="el-zoom-in-left">
                <div v-show="show2" class="transition-box">.el-zoom-in-</div>
              </transition>
            </div>-->
          </span>
          <!-- 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> -->
          <!-- <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="gounity('')">实训模板</div>
            </el-dropdown-item>
            <el-dropdown-item v-for="(item) in tableData" :key="item.id">
              <div @click="gounity(item.id)">{{item.updatedAt|dateformat}}</div>
            </el-dropdown-item>
          </el-dropdown-menu>-->
        </el-dropdown>
        <!-- <button @click="threadPoxi()">点击</button> -->
        <div class="action__bar">
          <ul>
            <!-- <li>
                <router-link :to="'/sExperiment1/exportData/'+id">
                  <div class="el-icon-position"></div>
                  <span>导出数据</span>
                </router-link>
            </li>-->
            <li @click="twoChick=1">
              <router-link :to="'/sExperiment1/snapshot/'+id">
                <div :style="{color:twoChick==1?'red':''}" class="el-icon-document-add"></div>
                <span :style="{color:twoChick==1?'red':''}">实训快照</span>
              </router-link>
            </li>
            <li @click="twoChick=2">
              <router-link :to="'/sExperiment1/Enclosure/'+id">
                <div :style="{color:twoChick==2?'red':''}" class="el-icon-document-copy"></div>
                <span :style="{color:twoChick==2?'red':''}">附件材料</span>
              </router-link>
            </li>
            <li @click="twoChick=3" v-if="!innertype.inner">
              <router-link :to="'/sExperiment1/Presentation/'+id">
                <div :style="{color:twoChick==3?'red':''}" class="el-icon-document-copy"></div>
                <span :style="{color:twoChick==3?'red':''}">实训报告</span>
              </router-link>
            </li>
            <li @click="twoChick=4">
              <router-link :to="'/sExperiment1/guidance/'+id">
                <div :style="{color:twoChick==4?'red':''}" class="el-icon-view"></div>
                <span :style="{color:twoChick==4?'red':''}">实训指导</span>

              </router-link>
            </li>
          </ul>
        </div>
      </el-header>
    </el-container>
    <div class="Arrow" @click="Arrow">
      <i class="el-icon-caret-top" v-show="Arrowshow"></i>
      <i class="el-icon-caret-bottom" v-show="!Arrowshow"></i>
    </div>
    <el-main>
      <!-- {{id}} -->
      <router-view @gounity='gounity'>
      </router-view>
    </el-main>
  </div>
</template>


<script>
import { log } from "util";
import { guidelist, snalist, formatDate } from "../../../API/api";
export default {
  props: ['innertype'],
  data() {
    return {
      id: this.$route.params.id,
      // imgswiper:true,

      Arrowshow: true,
      name: "",
      offset: 0,
      limit: 50,
      tableData: "",
      herdernone: true,
      twoChick: 4,
      red: { color: "red" },
      grend: { color: "pink" },
      websock: null,
      show2: false,

      agentData: {
        name: "mode",
        mode: "task_experiment_exercise_instance_editor",
        token: "",
        id: "",
        type: this.innertype.type,
        taskExperimentId: ""
      }
    };
  },
  methods: {
    time(data) {
      formatDate(data);
    },
    Arrow() {
      (this.Arrowshow = !this.Arrowshow), (this.herdernone = !this.herdernone);
    },
    // 进入快照
    goguidance() {
      this.twoChick = 1;
      this.$router.push('/sExperiment1/snapshot/' + this.id)
    },
    gounity(id) {
      //获取本地缓存中的令牌mytoken
      let token = localStorage.getItem("token");
      this.agentData.token = token;
      // this.agentData.id = id;
      this.agentData.id = id;

      this.agentData.taskExperimentId = this.id;

      this.threadPoxi();
      this.on_click_show_unity_window();
      this.$router.push("/sExperiment1/unity/" + this.id);
    },
    threadPoxi(id) {
      // 实际调用的方法
      //参数
      this.$emit("threadPoxi", this.agentData)



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
        "{'opcode':4,'LocationX': 290,'LocationY':200, 'SizeX': 1620,'SizeY':815}";

     if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
    },
    // 判断是否内置实训
  },
  watch: {
    "$route.params.id": function (newval, oldval) {
      this.id = newval;
      this.twoChick = 4;
      snalist({
        offset: this.offset,
        limit: this.limit,
        taskExperimentId: this.id
      }).then(res => {
        if (res.data.object.length > 0) {
          this.tableData = res.data.object;
        } else {
          this.tableData = [];
        }
      });
    }
  },
  created() {
    // this.initWebSocket();

  },
  mounted() {
    snalist({
      offset: this.offset,
      limit: this.limit,
      taskExperimentId: this.id
    }).then(res => {
      if (res.data.object.length > 0) {
        this.tableData = res.data.object;
      } else {
        this.tableData = [];
      }
    });
  },
  destroyed() {

  }
};
</script>


<style lang="less" scoped>
img {
  margin: 0;
}
.banner {
  width: 100%;

  .el-header {
    background-color: #313539;
    color: #333;
    a {
      > div {
        width: 60px;
        height: 60px;
        margin: 10px 0 0 10px;
        // background-color: #b3c0d1;
        > img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .gounity {
    width: 60px;
    height: 60px;
    margin: 10px 0 0 10px;
    // background-color: #b3c0d1;
    > img {
      width: 100%;
      height: 100%;
    }
  }
  img {
    margin-left: 5%;
  }
  .action__bar {
    width: 50%;
    height: 100%;
    float: right;
    position: relative;
    > ul {
      width: 90%;
      margin-left: 31%;
      margin-top: -10px;
      position: absolute;
      min-width: 500px;
      right: 0;
      > li {
        width: 15%;
        display: block;
        margin-top: 5px;
        float: right;
        div {
          width: 100%;
          height: 50px;
          font-size: 30px;
          line-height: 50px;
          // text-align: center;
          display: block;
          color: #f0f0f0;
        }
        div:hover {
          color: #ffd04b;
        }
        span {
          width: 100%;
          font-size: 14px;
          text-align: center;
        }
        span:hover {
          color: #ffd04b;
        }
      }
    }
  }
}
.transition-box {
  margin-bottom: 10px;
  width: 300px;
  height: 60px;
  border-radius: 4px;
  // background-color: #409eff;
  text-align: center;
  color: #fff;
  padding: 10px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}

//点击显示隐藏herader盒子
.Arrow {
  width: 100px;
  text-align: center;
  position: absolute;
  top: 47px;
  left: 55%;
  .el-icon-caret-top {
    margin-top: 68px;
    color: #fff;
  }
  i {
    font-size: 30px;
  }
}
.el-main {
  background-color: #f0f0f0;
  color: #333;
  // text-align: center;
  // line-height: 160px;
  display: block;
  // margin-top: 20px;
  padding: 0;
  height: 100%;
}
body > .el-container {
  margin-bottom: 40px;
}
.el-dropdown-menu {
  left: 110px !important;
}
</style>
