<template>
  <div class="box">
    <div class="interior">
      <!-- 表格 -->
      <div class="transition-box" v-show="isshowheight">
        <template>
          <el-table
            :data="tableData"
            :default-sort="{prop:'startTime', order: 'descending'}"
            border
            style="width: 94%;margin:5px 3%;height:100%"
            stripe
          >
            <el-table-column fixed type="index" label="序号" min-width="150"></el-table-column>
            <el-table-column prop="name" label="名称" min-width="120" sortable></el-table-column>
            <el-table-column prop="name" label="教师" min-width="200" sortable></el-table-column>
            <el-table-column prop="startTime" label="下发时间" min-width="200" sortable>
              <template slot-scope="scope">{{scope.row.startTime|dateformat}}</template>
            </el-table-column>
            <el-table-column prop="phone" label="要求" min-width="200"></el-table-column>
            <el-table-column prop="finishTime" label="截止时间" min-width="200" sortable>
              <template slot-scope="scope">{{scope.row.finishTime|dateformat}}</template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              :formatter="completionStatusc"
              min-width="100"
            ></el-table-column>
            <el-table-column label="操作" min-width="150">
              <template slot-scope="scope">
                <el-button
                  @click=" isshowheight=false,compileClick(scope.row)"
                  type="primary"
                  size="small"
                >去完成</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div style="margin:50px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="length"
          ></el-pagination>
        </div>
      </div>
      <div class="transition-box" v-show="!isshowheight">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <a @click="detpage">
                <h2>仿真实验</h2>
              </a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              <a>
                <h2>{{name}}</h2>
              </a>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <addTest
          v-bind:row="row"
          v-bind:showheight="showheight"
          v-if="innerVisible"
          @detpage="detpage"
          @handleSelect="handleSelect"
        ></addTest>
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
import { simulist, project } from "@/API/api";
import { mapState, mapActions } from "vuex";
import addTest from "./addTest";
import { write } from "fs";
export default {
  name: "myTest",
  data() {
    return {
      offset: 0,
      limit: 100,
      currentPage4: 1,
      length: 50,
      showheight: "100%",
      isshowheight: true,
      innerVisible: false,
      row: {},

      show2: true,
      name: "仿真实验",
      tableData: []
    };
  },
  components: {
    addTest
  },

  methods: {
    ...mapActions(["task"]),
    // 状态
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
     this.simulist()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.offset = (val - 1) * this.limit;
     this.simulist()
    },
    handleSelect(key) {
      this.$emit("handleSelect", key);
    },
    completionStatusc(row, column) {
      if (row.status == "new") {
        return "未开始";
      } else if (row.status == "save") {
        return "进行中";
      } else if (row.status == "submit") {
        return "已提交";
      }
    },
    // 关闭详情页面
    detpage() {
      this.isshowheight = !this.isshowheight;
      this.innerVisible = !this.innerVisible;
    },
    // 编辑
    compileClick(row) {
      this.name = row.name;
      console.log("----------------------", this.row);
      this.row = row;
      this.innerVisible = true;
    },
    simulist() {
      simulist({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        console.log(res)
        this.tableData = res.data.object;
        this.length=res.data.object.length;
        this.task(res.data.object);

      });
    }
  },
  computed: {
    ...mapState(["taskList"])
  },
  mounted() {},

  created() {
    console.log(this.taskList);
    if (this.taskList.length > 0) {
      this.tableData = this.taskList;
    } else {
      this.simulist();
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 95%;
  margin: 0px 2.5%;
  height: 90%;
  overflow: hidden;
  .interior {
    width: 102%;
    height: 100%;
    overflow: auto;
  }
}
.transition-box {
  // height: 100%;
  // width: 100%;
  // transition: 0s;
  // overflow: hidden;
}
.breadcrumb {
  width: 94%;
  height: 50px;
  margin: 0 3%;
  font-size: 20px;
}
</style>

