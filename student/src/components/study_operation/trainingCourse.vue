<template>
  <div class="coursePractice">
    <div class="coursePractice-top">
      <p>
        实训模块：
        <el-select v-model="selectModular" slot="prepend" @change="coursePractice()">
          <el-option label="全部" value="all"></el-option>
          <el-option :label="item.name" :value="item.id" v-for="(item) in trainingModule" :key="item.id"></el-option>
        </el-select>
      </p>
      <p>
        实训类型：
        <el-select v-model="selectform" slot="prepend" @change="coursePractice()">
          <el-option label="全部" value="all"></el-option>
          <el-option :label="item.name" :value="item.id" v-for="(item) in trainingType" :key="item.id"></el-option>
        </el-select>
      </p>
      <el-button type="primary" style="margin-left:30px;" @click="dialogVisible=true" v-if="isposition">编辑模块和类型</el-button>
      <div class="sousuo">
        <el-input placeholder="请输入要搜索的实训" v-model="search" class="input-with-select bottom" @keyup.enter.native="nowSearch()">
          <el-button slot="append" class="el-icon-search" @click="nowSearch()"></el-button>
        </el-input>
      </div>
    </div>
    <div class="coursePractice-botton">
      <el-table :data="tableDatafalse" stripe :header-cell-style="{background:'#ebeffb'}" :default-sort="{prop:'startTime', order: 'descending'}" class="tabletop" :row-class-name="tableRowClassName">
        <el-table-column fixed label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="实训名称" sortable min-width="270"></el-table-column>
        <el-table-column label="教学模式" min-width="50">
          <template slot-scope="scope">
            <el-button @click="coachExamination(scope.row,'teaching')" type="text" size="medium" style="font-size:15px;">打开教学</el-button>
          </template>
        </el-table-column>
        <el-table-column label="练习模式" min-width="50">
          <template slot-scope="scope">
            <el-button @click="coachExamination(scope.row,'exercise')" type="text" size="medium" style="font-size:15px;">打开练习</el-button>
          </template>
        </el-table-column>
        <el-table-column label="考核模式" min-width="50">
          <template slot-scope="scope">
            <el-button @click="coachExamination(scope.row,'examine')" type="text" size="medium" style="font-size:15px;">打开考核</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="deleteTaskFormwork(scope.row.id)" style="font-size:15px;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin:50px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
    </div>

    <!-- 弹出层 -->
    <el-dialog title="编辑模块和类型" :visible.sync="dialogVisible" width="40%">
      <div>
        <!-- 新增模块 -->
        <div>

          <div class="addclasses">
            <p class="writtenWords">新增模块：</p>
            <el-input placeholder="请输入内容" v-model="addmodule" clearable style="width:60%"></el-input>
            <el-button type="primary" style="margin-left:30px;" @click="addmodules">确认新增模块</el-button>
          </div>
        </div>
        <!-- 删除模块 -->
        <div>
          <p class="writtenWords" style="width:300px;color:red;">注：模块内容为空才能删除。</p>
          <div class="addclasses">
            <p class="writtenWords">删除模块:</p>
            <el-select v-model="detmodule" slot="prepend" placeholder="请选择实训模块" style="width:437px">
              <el-option :label="item.name" :value="item.id" v-for="(item) in trainingModule" :key="item.id"></el-option>
            </el-select>
            <el-button type="danger" style="margin-left:30px;" @click="detmodules">确认删除模块</el-button>
          </div>
        </div>
        <!-- 新增类别 -->
        <div style="margin:10px 0px;">

          <div class="addclasses">
            <p class="writtenWords">新增类型：</p>
            <el-input placeholder="请输入内容" v-model="addTypes" clearable style="width:60%"></el-input>
            <el-button type="primary" style="margin-left:30px;" @click="addType">确认新增类别</el-button>
          </div>
        </div>
        <!-- 删除类别： -->
        <div style="margin:10px 0px;">

          <div class="addclasses">
            <p class="writtenWords">删除类型：</p>
            <el-select v-model="detTypes" slot="prepend" placeholder="请选择实训类型" style="width:437px">
              <el-option :label="item.name" :value="item.id" v-for="(item) in trainingType" :key="item.id"></el-option>
            </el-select>

            <el-button type="danger" style="margin-left:30px;" @click="detType">确认删除类别</el-button>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false" class="cancel" size="mini">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  get_training_module, //获取实训模块
  get_training_type, //获取实训类型
  get_training_list, // 获取课程实训列表
  delete_training,//删除
  add_training_module, //添加实训模块
  delete_training_module, //删除实训模块
  add_training_type,//添加实训类型
  delete_training_type,//删除实训类型
} from "@/API/api";
import { type } from "os";
import { log } from "util";
import { all } from 'q';
export default {
  data() {
    return {
      detTypes: "",
      addTypes: "",
      dialogVisible: false,
      isposition: false, //产品经理
      trainingModule: [], //实训模块
      trainingType: [], //实训类型
      tableDatafalse: [], //课程实训列表
      addform: {
        type: "",
        name: "",
        typeId: "",
        expTypeId: ""
      },
      selectModular: "all",
      selectform: "all",
      search: null, //搜索
      offset: 0,
      limit: 10,
      length: 0,
      currentPage: 1,
      addmodule: "",
      detmodule: '',
    };
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.limit = val;
      this.coursePractice();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.coursePractice();
    },
    coachExamination(row, type) {
      this.$router.push({
        name: "/relayteacher/study/experimentDetails",
        params: {
          id: row.id,
          name: row.name,
          type: type,
          teaching: true,
          exercise: true,
          practice: true,
          examine: true,
          isteacher: false,
        }
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return "warning-row";
      } else if (rowIndex % 2 == 0) {
        return "success-row";
      }
      return "";
    },
    //获取实训模块
    obtainTrainingModule() {
      get_training_module().then(res => {
        this.trainingModule = res.data.object;
      });
    },
    //获取实训类型
    obtainTrainingType() {
      get_training_type().then(res => {
        this.trainingType = res.data.object;
      });
    },

    //搜索
    nowSearch() {
      this.coursePractice();
    },
    // 获取课程实训列表
    coursePractice() {
      get_training_list({
        innerr: true, //true 课程实训  false 我的实训
        trainingModuleId: this.selectModular == "all" ? null : this.selectModular, // 模块id  不选传null
        trainingTypeId: this.selectform == "all" ? null : this.selectform, // 类型id  不选传null
        trainingSearch: this.search, // 查找内容 不选传null
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        this.length = res.data.length;
        this.tableDatafalse = res.data.object;
      });
    },
    //删除实训模板
    deleteTaskFormwork(id) {
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delete_training({
            trainingId: id
          }).then(res => {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.coursePractice();
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    },

    // 新增模块
    addmodules() {
      if (this.addmodule == "" || this.addmodule == null) {
        this.$message({
          showClose: true,
          type: "danger",
          message: "请填写新增模块名称",
          duration: 1000
        });
        return;
      }
      add_training_module({
        trainingModuleName: this.addmodule
      }).then(res => {
        console.log(res, '447774')
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            type: "success",
            message: "新增成功",
            duration: 1000
          });
          this.obtainTrainingModule();//获取实训模块
          this.addmodule = '';
          this.dialogVisible = false
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: res.data.msg,
            duration: 1000
          });
        }
      });
    },
    //删除模板
    detmodules() {
      let det = false;
      if (this.detmodule == "" || this.detmodule == null) {
        this.$message({
          showClose: true,
          type: "danger",
          message: "请选择模板",
          duration: 1000
        });
        return;
      }
      //查询数量
      get_training_list({
        innerr: true, //true 课程实训  false 我的实训
        trainingModuleId: this.detmodule, // 模块id  不选传null
        trainingTypeId: null, // 类型id  不选传null
        trainingSearch: null, // 查找内容 不选传null
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        if (res.data.length == 0) {
          delete_training_module({
            trainingModuleId: this.detmodule
          }).then(res => {
            if (res.data.code == 0) {
              this.$message({
                showClose: true,
                type: "success",
                message: "删除成功",
                duration: 1000
              });
              this.obtainTrainingModule();//获取实训模块
              this.detmodule = '';
              this.dialogVisible = false
            } else {
              this.$message({
                showClose: true,
                type: "danger",
                message: res.data.msg,
                duration: 1000
              });
            }
          });
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: "请先清空模板内的实训。",
            duration: 1000
          });
        }
      });

      return;

    },
    // 添加实训类型
    addType() {
      if (this.addTypes == null || this.addTypes == "") {
        this.$message({
          showClose: true,
          type: "danger",
          message: "请填写新增模块名称",
          duration: 1000
        });
        return;
      }
      add_training_type({
        trainingTypeName: this.addTypes
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            type: "success",
            message: "新增成功",
            duration: 1000
          });
          this.obtainTrainingType();//获取实训类型
          this.addTypes = '';
          this.selectform = 'all';
          this.coursePractice();
          this.dialogVisible = false
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: res.data.msg,
            duration: 1000
          });
        }
      });
    },
    //删除实训类型
    detType() {
      let det = false;
      if (this.detTypes == "" || this.detTypes == null) {
        this.$message({
          showClose: true,
          type: "danger",
          message: "请选择模板",
          duration: 1000
        });
        return;
      }
      delete_training_type({
        trainingTypeId: this.detTypes
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            type: "success",
            message: "删除成功",
            duration: 1000
          });
          this.obtainTrainingType();//获取实训类型

          this.detTypes = '';
          this.selectform = 'all';
          this.coursePractice();
          this.dialogVisible = false
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: res.data.msg,
            duration: 1000
          });
        }
      });




    },


    //判断教导主任
    supervisor() {
      let user = JSON.parse(sessionStorage.getItem("user"));

      if (user.position == "supervisor" && user.role == "teacher") {
        this.isposition = true;
      } else {
        this.isposition = false;
      }
    }
  },
  created() {
    this.obtainTrainingModule();//获取实训模块
    this.obtainTrainingType();//获取实训类型
    this.supervisor(); //判断身份
    this.coursePractice(); // 加载课程实训列表
  }
};
</script>
<style lang="less" scoped>
.coursePractice {
  margin-left: 20px;
  height: 95%;
  width: 97.6%;
  padding-top: 20px;
  background-color: #fff;
  margin-top: 20px;
  overflow: auto;
  .coursePractice-top {
    padding-bottom: 20px;
    p {
      display: inline-block;
      margin-left: 30px;
      font-size: 16px;
    }
    .sousuo {
      float: right;
      padding-right: 35px;
      min-width: 260px;
    }
  }

  .coursePractice-botton {
    width: 98%;
    padding-left: 30px;
  }
}
.addclasses {
  display: flex;
}
.writtenWords {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  display: inline-block;
  width: 100px;
}
</style>
<style scoped>
.coursePractice .el-button--text {
  font-size: 16px;
}
.el-table .warning-row {
  background: #f7faff;
}
</style>

