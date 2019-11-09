<template>
  <div class="coursePractice">
    <div class="coursePractice-top">
      <p>
        实训类型：
        <el-select v-model="selectform" slot="prepend" placeholder="请选择类型" @change="myPractice()">
          <el-option label="全部" value="all"></el-option>
          <el-option :label="item.name" :value="item.id" v-for="(item) in myTrainingType" :key="item.id"></el-option>
        </el-select>
      </p>
      <el-button type="primary" icon="el-icon-plus" @click="addTask()" class="simulationResourcesOverall-right" size="mini">新建</el-button>

      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" />
      <div class="search__box">
        <input class="search__txt" v-model="search" placeholder="请输入要搜索的实训" @keyup.enter="myPractice()" />
        <span class="search__btn" href="#" @click="myPractice()">
          <i class="fas fa-search"></i>
        </span>
      </div>

      <!-- <div class="sousuo1">
        <el-input placeholder="请输入要搜索的实训" v-model="search" class="input-with-select bottom" @keyup.enter.native="myPractice()">
          <el-button slot="append" class="el-icon-search" @click="myPractice()"></el-button>
        </el-input>
      </div>-->
    </div>
    <div class="coursePractice-botton">
      <el-table :data="tableDatafalse" stripe :header-cell-style="{background:'#ebeffb'}" :default-sort="{prop:'startTime', order: 'descending'}" class="tabletop" :row-class-name="tableRowClassName">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="实训名称" sortable min-width="250"></el-table-column>
        <el-table-column prop="updatedAt" label="编辑时间" sortable :formatter="formatSex" min-width="200"></el-table-column>
        <el-table-column label="教学模式" min-width="60">
          <template slot-scope="scope">
            <el-button @click="coachExamination(scope.row,'teaching')" type="text" size="medium" style="font-size:15px;">编辑教学</el-button>
          </template>
        </el-table-column>
        <el-table-column label="练习模式" min-width="60">
          <template slot-scope="scope">
            <el-button @click="coachExamination(scope.row,'exercise')" type="text" size="medium" style="font-size:15px;">编辑练习</el-button>
          </template>
        </el-table-column>
        <el-table-column label="考核模式" min-width="60">
          <template slot-scope="scope">
            <el-button @click="coachExamination(scope.row,'examine')" type="text" size="medium" style="font-size:15px;">编辑考核</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" >
          <template slot-scope="scope">
            <el-button
            v-if="isposition"
              type="text"
              size="medium"
              @click="transformation(scope.row.id)"
              style="font-size:15px;"
            >转到课程实训</el-button>
            <el-button
              type="text"
              size="medium"
              @click="isrechristen=true"
              style="font-size:15px;"
            >重命名</el-button>
            <el-button
              type="text"
              size="medium"
              @click="deleteTaskFormwork(scope.row.id)"
              style="font-size:15px;"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin:50px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
    </div>
    <!-- 新增任务弹出框 -->
    <el-dialog :visible.sync="addTest" width="40%" title="新建我的模板">
      <div>
        <el-input placeholder="新建名称" v-model="addform.name" class="input-with-select">
          <!-- <el-select v-model="addform.type" slot="prepend" placeholder="请选择类型" style="width:150px">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item) in myTrainingType"
              :key="item.id"
            ></el-option>
          </el-select> -->

          <el-select
            v-model="pattern"
            multiple
            slot="prepend"
            placeholder="请选择模式"
            style="width:300px;margin-left:20px"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item) in patternList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTest = false" class="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="append()" class="Sure" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 转换内置弹出框 -->
    <el-dialog :visible.sync="conversion" width="30%" title="转换内置">
      <div>
        <div>选择实训模块</div>
        <el-select v-model="builtIn" slot="prepend" placeholder="请选择类型" style="width:80%">
          <el-option :label="item.name" :value="item.id" v-for="(item) in trainingModule" :key="item.id"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="conversion = false" class="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="modifymodule()" class="Sure" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 重命名 -->
    <el-dialog :visible.sync="isrechristen " width="40%" title="重命名">
      <div>
        <el-input style="width:80%" clearable placeholder="请输入新名称" v-model="newname"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isrechristen = false" class="cancel" size="mini">取 消</el-button>
        <el-button type="primary" class="Sure" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  get_training_type, //获取实训类型
  get_training_module, //获取实训模块
  get_training_list, // 获取我的实训列表
  formatDate, // 时间格式转换
  add_training, //新增任务
  delete_training, //删除实训
  modify_training_module //修改实训模块并设置为内置
} from "@/API/api";
export default {
  data() {
    return {
      isposition: false, //教导主任，特殊老师权限。
      addform: {
        type: "",
        name: "",

        trainingTypeId: ""
      },
      isrechristen: false, //重命名
      newname: "",
      pattern: "", //模式
      patternList: [
        {
          id: 1,
          name: "教学模式"
        },
        {
          id: 2,
          name: "练习模式"
        },
        {
          id: 3,
          name: "考核模式"
        }
      ],
      builtIn: "", //选中模块id
      trainingId: "", //选中实训id
      trainingModule: "", //实训模板
      myTrainingType: "", //实训类型
      selectform: "all",
      search: null, //搜索
      tableDatafalse: [],
      addTest: false, //新增任务 弹出框关闭
      conversion: false, //转换内置 弹出框关闭
      offset: 0,
      limit: 10,
      length: 0,
      currentPage: 1
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return "warning-row";
      } else if (rowIndex % 2 == 0) {
        return "success-row";
      }
      return "";
    },
    //获取实训类型
    obtainMyTrainingType() {
      get_training_type().then(res => {
        console.log(res, "实训类型");
        this.myTrainingType = res.data.object;
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.myPractice();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.myPractice();
    },

    //点击新增任务
    addTask() {
      this.addTest = true; //新增任务 弹出框打开
      this.myPractice(); //获取我的实训列表
    },
    //转换内置
    transformation(id) {
      this.conversion = true; //新增任务 弹出框打开
      this.trainingId = id;
    },
    // 获取我的实训列表
    myPractice() {
      get_training_list({
        innerr: false, //true 课程实训  false 我的实训
        trainingTypeId: this.selectform == "all" ? null : this.selectform, // 类型id  不选传null
        trainingSearch: this.search, // 查找内容 不选传null
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        this.tableDatafalse = [];
        this.length = res.data.length;
        this.tableDatafalse = res.data.object;
        this.params();
      });
    },
    //点击新增任务弹出框确定
    append() {
      if (this.addform.name == "") {
        this.$message({
          showClose: true,
          duration: 1000,
          message: "没有名称",
          type: "error"
        });
        return;
      }
      let from = {};
      from.trainingName = this.addform.name;
      from.trainingTypeId = this.addform.type;
      add_training(from).then(res => {
        if (res.data.code == "-2") {
          this.$message({
            showClose: true,
            duration: 1000,
            type: "info",
            message: "新建名称重复"
          });
          this.addTest = true;
        } else if (this.addform.type == "" || this.addform.type == null) {
          this.$message({
            showClose: true,
            duration: 1000,
            type: "info",
            message: "请选择类型"
          });
          this.addTest = true;
        } else if (res.data.code == "0") {
          this.$message({
            showClose: true,
            duration: 1000,
            message: "新增成功",
            type: "success"
          });
          this.addform.name = "";
          this.addform.type = "";
          this.myPractice();
          this.addTest = false; //关闭新建模态框
        } else {
          this.$message({
            showClose: true,
            duration: 1000,
            type: "error",
            message: "新建失败"
          });
        }
      });
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
          examine: true,
          practice: true,
          isteacher: true
        }
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
            this.myPractice();
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
    // 转换实训
    modifymodule() {
      if (this.builtIn == "" || this.builtIn == null) {
        this.$message({
          showClose: true,
          duration: 1000,
          message: "选择实训模板",
          type: "error"
        });
        return;
      }
      modify_training_module({
        trainingId: this.trainingId, //实训id
        trainingModuleId: this.builtIn //模块id
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            type: "success",
            message: "转换成功",
            duration: 1000
          });
          this.trainingId = "";
          this.builtIn = "";
          this.myPractice();
          this.conversion = false;
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
    // 获取模块
    //获取实训模块
    obtainTrainingModule() {
      get_training_module().then(res => {
        console.log(res, "实验模板");
        this.trainingModule = res.data.object;
      });
    },

    // 时间格式转换
    formatSex(row) {
      return formatDate(row.updatedAt);
    },
    //判断教导主任
    supervisor() {
      let user = JSON.parse(sessionStorage.getItem("user"));

      if (user.position == "supervisor" && user.role == "teacher") {
        this.isposition = true;
      } else {
        this.isposition = false;
      }
    },
    // 接受内容
    params() {
      if (this.$route.query != null) {
        let list = this.tableDatafalse;
        for (let i = 0; i < list.length; i++) {
          if (this.$route.query.type == list[i].id) {
            this.coachExamination(list[i], "teaching");
            break;
          }
        }
      }
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.params();
        this.obtainMyTrainingType(); //获取实训类型
        this.obtainTrainingModule(); //
        this.supervisor(); //教导主任
        this.myPractice(); // 加载我的实训列表
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    this.obtainMyTrainingType(); //获取实训类型
    this.obtainTrainingModule(); //
    this.supervisor(); //教导主任
    this.myPractice(); // 加载我的实训列表
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
    position: relative;
    p {
      display: inline-block;
      margin-left: 30px;
      font-size: 16px;
    }
    .simulationResourcesOverall-right {
      width: 70px;
      height: 30px;
      background-color: #989898;
      border: none;
      position: absolute;
      border-radius: 0px;
      top: 5px;
      right: 40px;
    }
    // .sousuo1 {
    //   position: absolute;
    //   left: 350px;
    //   width: 260px;
    //   top: 0px;
    // }
  }
  .coursePractice-botton {
    width: 98%;
    padding-left: 30px;
  }
}
.el-table .warning-row {
  background: #f7faff;
}
.search__box {
  position: absolute;
  left: 450px;
  top: 20px;
  transform: translate(-50%, -50%);
  background: #989898;
  height: 40px;
  border-radius: 40px;
  padding: 10px 15px 10px 15px;
}

.search__box:hover > .search__txt {
  width: 160px;
  padding: 0 6px;
}

.search__box:hover > .search__btn {
  background: #fff;
}

.search__box:hover > .search__btn i {
  color: #34ace0;
  transition: 0.9s;
}

.search__btn {
  color: #e84118;
  float: right;
  width: 30px;

  height: 30px;
  margin-top: -5px;
  border-radius: 50%;
  background: #ebeffb;
  display: flex;
  justify-content: center;
  text-decoration: none;
}

.search__btn i {
  line-height: 30px;
  color: #34ace0;
  transition: 0.9s;
}

.search__txt {
  border: none;
  background: none;
  outline: none;
  float: left;
  padding: 0;
  color: #fff;
  font-size: 16px;
  transition: 0.2s;
  line-height: 10px;
  width: 0;
}
</style>

