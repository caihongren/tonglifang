<template>
  <div class="box">
    <!-- 右边菜单栏 -->
    <div class="menus">
      <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#313131" text-color="#fff" active-text-color="#ffd04b" style="text-align: center; font-size:18px;">
        <el-menu-item index="2">实训任务</el-menu-item>

      </el-menu>
    </div>

    <!-- 正文 -->
    <div class="interior">
      <!-- 表格 -->
      <div class="sousuo">

        <el-input placeholder="搜索任务" v-model="input5" class="input-with-select" @keyup.enter.native='sousuo()'>

          <el-button slot="append" class="el-icon-search" @click="sousuo()"></el-button>
        </el-input>
      </div>
      <div class="transition-box" v-show="isshowheight">
        <template>
          <el-table :data="tableData" :default-sort="{prop:'startTime', order: 'descending'}" border style="width: 94%;margin:5px 3%;height:80%" stripe :header-cell-style="{background:'#b2e2f8'}">
            <el-table-column prop="index" label="序号" type="index"></el-table-column>
            <el-table-column prop="name" label="名称" min-width="100" sortable></el-table-column>
            <el-table-column prop="masterName" label="教师" min-width="40" sortable></el-table-column>
            <el-table-column prop="startTime" label="下发时间" min-width="100" sortable>
              <template slot-scope="scope">{{scope.row.startTime|dateformat}}</template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="80"></el-table-column>
            <el-table-column prop="finishTime" label="截止时间" min-width="100" sortable>
              <template slot-scope="scope">{{scope.row.finishTime|dateformat}}</template>
            </el-table-column>
            <el-table-column prop="statu" label="状态" :formatter="completionStatusc" min-width="50"></el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button @click=" isshowheight=false,compileClick(scope.row)" type="text" size="mini" class="operationButton">{{scope.row.statu=="approved"||scope.row.statu=="submit"||scope.row.statu=="expired"?'去查看':'去完成'}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div style="margin:50px;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
        </div>
      </div>
      <div class="transition-box" v-show="!isshowheight">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <a @click="detpage">
                <h2>仿真实训</h2>
              </a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              <a>
                <h2>{{name}}</h2>
              </a>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <addTest v-bind:row="row" v-bind:showheight="showheight" v-if="innerVisible" @detpage="detpage" @handleSelect="handleSelect"></addTest>
      </div>

      <!-- 弹出层 -->
      <!-- <el-dialog width="90%" :title="name" top="5vh" :visible.sync="innerVisible">
      <div style="height:75vh">-->
      <!-- <Unity3D v-bind:tasks="tasks" ref="unity3D"></Unity3D> -->
      <!-- <addTest v-bind:row="row" v-if="innerVisible"></addTest>
        </div>
      </el-dialog>-->
    </div>
  </div>
</template>

<script>
import {
  bySubmitter, //获取实训任务列表
  project
} from "@/API/api";
import { mapState, mapActions } from "vuex";
import addTest from "./addTest";
import { write } from "fs";
export default {
  name: "myTest",
  data() {
    return {
      offset: 0,
      limit: 10,
      currentPage4: 1,
      length: 0,
      showheight: "100%",
      isshowheight: true,
      innerVisible: false,
      row: {},
      show2: true,
      name: "仿真实训",
      tableData: [],
      tableDataTruebox: [],//所有
      input5: '',
    };
  },
  components: {
    addTest
  },

  methods: {
    ...mapActions(["task"]),
    // 状态
    handleSizeChange(val) {
      this.limit = val;
      this.Submitter(); //获取实训任务列表
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.Submitter(); //获取实训任务列表
    },
    handleSelect(key) {
      this.$emit("handleSelect", key);
    },
    completionStatusc(row, column) {
      if (row.statu == "new") {
        return "未开始";
      } else if (row.statu == "save") {
        return "进行中";
      } else if (row.statu == "submit") {
        return "已提交";
      } else if (row.statu == "approved") {
        return "已批阅";
      } else if (row.statu == "expired") {
        return "已终止";
      }
      //  this.Submitter();
    },
    // 关闭详情页面
    detpage() {
      this.isshowheight = !this.isshowheight;
      this.innerVisible = !this.innerVisible;
      this.Submitter();
    },
    // 编辑
    compileClick(row) {
      this.name = row.name;
      this.row = row;
      this.innerVisible = true;
    },
    // 搜索
    sousuo() {
      this.tableData = []
      let tableDataTruebox = this.tableDataTruebox
      if (this.input5 != '') {
        // console.log(this.input5)
        for (let i = 0; i < tableDataTruebox.length; i++) {
          if (tableDataTruebox[i].name.indexOf(this.input5) != -1) {
            // console.log(tableDataTruebox[i])
            this.tableData.push(tableDataTruebox[i])
          }
        }
      } else {
        this.Submitter()
      }
    },
    //获取实训任务列表
    Submitter() {
      bySubmitter({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        this.tableData = res.data.object;
        this.length = res.data.object.length;
        this.task(res.data.object);
      });
    },
    Submitterbox() {
      bySubmitter({
        offset: 0,
        limit: 10000
      }).then(res => {
        console.log(res)
        this.tableDataTruebox = res.data.object
      });
    }
  },
  computed: {
    ...mapState(["taskList"])
  },
  mounted() { },

  created() {
    if (this.taskList.length > 0) {
      this.tableData = this.taskList;
      this.length = this.taskList.length;
    } else {
      this.Submitter(); //获取实训任务列表
    }
    this.Submitterbox()
  }

};
</script>

<style lang="scss" scoped>
.operationButton {
  color: #989898;
  font-size: 14px;
  border: none;
  margin-top: 0px;
  margin-right: 15px;
  border-radius: 0px;
  width: 70px;
  height: 30px;
}
.box {
  height: 100%;
  width: 100%;
  padding-left: 250px;
  overflow: hidden;
  background-color: #f1f1f1;
  position: relative;
  .menus {
    position: absolute;
    left: 0px;
    padding-top: 20px;
    z-index: 2;
    width: 250px;
    height: 100%;
    background-color: #313131;
    .el-menu-item {
      font-size: 18px;
    }
    .el-menu {
      border: 0px solid red;
    }
  }

  .interior {
    height: 93%;
    width: calc(100% - 78px);
    overflow: auto;
    background-color: #fff;
    margin-top: 20px;
    padding-top: 20px;
    margin-left: 20px;
    .sousuo {
      width: 350px;
      margin-left: 48px;
      margin-bottom: 10px;
      .el-icon-search:hover {
        color: #fff;
      }
    }
  }
}
.breadcrumb {
  width: 94%;
  margin: 0 3%;
  font-size: 20px;
  h2 {
    color: #00a0e9;
  }
}
.box .sousuo .el-button {
  background-color: #b2e2f8;
  border-radius: 0px;
}
.box .sousuo .el-button:hover {
  background-color: #66c6f2;
  border-radius: 0px;
}
</style>

