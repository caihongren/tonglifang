<template>
  <div>
    <el-container>
      <el-aside width="15%" style="min-width:290px">
        <div>
          <div class="Choice" @click="showOne=!showOne">
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">收到任务</div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <template>
                    <el-select v-model="taskOne" placeholder="全部">
                      <el-option v-for="item in tasks" :key="item.index" :label="item" :value="item"></el-option>
                    </el-select>
                  </template>
                </div>
              </el-col>
              <!-- <el-col :span="1"><div class="grid-content bg-purple"></div></el-col> -->
            </el-row>
          </div>
          <el-collapse-transition>
            <div v-show="showOne" class="TestList">
              <ul>
                <li v-for="(item,index) in itemArr" :key="item.id">
                  <i v-if="!item.inner" v-show="item.mode==taskOne||taskOne=='全部'" @click="istests(index,item.inner,item.type)" style="position: relative;display: block;">
                    <router-link :to="'/sExperiment1/guidance/'+item.id">
                      <!-- src="./../../image/nisfunbduhf.png" -->
                      <img class="img" :src="judge(item.path)" :style="{border:(istest==index?redcolor:color)}">
                      <i class="status" style="background-color:red;" v-if="item.status=='new'"></i>
                      <!-- <i class="status" style="background-color:red">{{item.status=="new"}}</i> -->
                      <i class="status" style="background-color:#3be450" v-if="item.status=='submit'"></i>
                      <span>{{item.name}}</span>
                    </router-link>
                  </i>
                </li>
              </ul>
            </div>
          </el-collapse-transition>

          <div class="Choice" @click="showTwo=!showTwo">
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">内置实训</div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <template>
                    <el-select v-model="taskTwo" placeholder="全部">
                      <el-option v-for="item in tasks" :key="item.index" :label="item" :value="item"></el-option>
                    </el-select>
                  </template>
                </div>
              </el-col>
              <!-- <el-col :span="1"><div class="grid-content bg-purple"></div></el-col> -->
            </el-row>
          </div>
          <el-collapse-transition>
            <div v-show="showTwo" class="TestList">
              <ul style="padding-bottom: 100px;">
                <li v-for="(item,index) in itemArr" :key="item.id">
                  <i v-if="item.inner" v-show="item.mode==taskTwo||taskTwo=='全部'" @click="istests(index,item.inner,item.type)">
                    <!-- <template slot-scope="scope"> -->
                    <router-link :to="'/sExperiment1/guidance/'+item.id">
                      <img class="img" :src="judge(item.path)" :style="{border:(istest==index?redcolor:color)}">
                      <span>{{item.name}}</span>
                    </router-link>
                    <!-- </template>  -->
                  </i>
                </li>
              </ul>
            </div>
          </el-collapse-transition>
        </div>
      </el-aside>
      <el-container style="width:85%">
        <router-view v-bind:innertype="innertype" @threadPoxi="threadPoxi"></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { simulist, project } from "@/API/api";
import { log } from "util";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      itemArr: [],
      type: "基础实训",
      limit: 100,
      offset: 0,
      showOne: true,
      showTwo: true,
      istest: -1,
      redcolor: "2px solid red",
      color: "2px solid #fff",
      taskOne: "全部",
      taskTwo: "全部",
      tasks: ["全部", "教学实训", "工程实践", "验证实训"],
      innertype: {
        inner: "",
        id: "id",
        type: "基础实训"
      }
    };
  },
  methods: {
    ...mapActions(['task']),
    istests(index, inner, type) {
      this.istest = index;
      this.innertype.inner = inner;
      this.innertype.type = type;
    },
    threadPoxi(type) {
      this.$emit("threadPoxi", type);
    },
    // 任务图片
    judge(path) {
      if (path == null || path == "") {
        return require("./../../image/nisfunbduhf.png");
      } else {
        return path;
      }
    },
    simulist() {
      simulist({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        this.itemArr = res.data.object;
        this.task(res.data.object)
      });
    }
  },
  computed: {
    ...mapState(["taskList"])
  },
  created() {
    if (this.taskList.length > 0) {
      this.itemArr = this.taskList
    } else {
      this.simulist();
    }
  },
  mounted() {
    // this.istests(0)
    setTimeout(() => {
      if (this.itemArr.length > 0) {
        for (let i = 0; i < this.itemArr.length; i++) {
          let item = this.itemArr[i];
          if (item.inner == false) {
            this.istests(i);
            this.$router.push("/sExperiment1/guidance/" + item.id);
            break;
          }
          if (this.itemArr[this.itemArr.length - 1].inner == true) {
            this.istests(0);
            this.$router.push("/sExperiment1/guidance/" + this.itemArr[0].id);
          }
        }
      }
    }, 500);
  }
};
</script>

<style lang="less" scoped>
a {
  color: #f0f0f0;
  font-size: 14px;
}
.el-aside {
  background-color: #232629;
  color: #333;
  text-align: center;
  overflow: hidden;
  width: 15%;
  > div {
    width: 110%;

    height: 880px;
    overflow-y: scroll;
    div {
      > ul {
        > li {
          margin: 40px 20% 0 0;
          a {
            > img {
              display: inline-block;
              width: 90%;
              border-radius: 8px;
              background-color: #ccc;
              // border-width:2px;
              // border-style:solid;
              // border-color: red;
            }
          }
        }
      }
    }
  }
}
.img {
  margin-left: 5%;
}
.Choice {
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: #f0f0f0;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin: 0;
  cursor: pointer;
  border-top: 1px solid #ffffff;
  border-bottom: 1px solid #ffffff;
}

.status {
  border: 1px solid #ffffff;
  width: 15px;
  height: 15px;
  display: block;
  border-radius: 50%;
  position: absolute;
  right: -1%;
  bottom: 95%;
  background-color: transparent;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
<style>
.Choice .el-input__inner {
  background-color: #232629;
  color: white;
}
</style>
