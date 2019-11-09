<template>
  <div class="simulationResourcesOverallgroup">
    <!-- 右边菜单栏 -->
    <div class="menus">
      <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#313131" text-color="#fff" active-text-color="#ffd04b" style="text-align: center; font-size:18px;">
        <el-menu-item index="2" @click="istask=true">我的仿真资源</el-menu-item>
        <el-menu-item index="3" @click="istask=false">内置仿真资源</el-menu-item>
      </el-menu>
    </div>

    <!-- 正文 -->
    <div class="simulationResourcesOverall">
      <div class="simulationResourcesOverall-top" v-show="istask">
        <p class="simulationResourcesOverall-left">我的仿真资源</p>
        <el-button type="primary" icon="el-icon-plus" @click="newlyBuildButton()" class="simulationResourcesOverall-right" size="mini">新建</el-button>
        <el-table :data="tableDataFalse" stripe :default-sort="{prop:'createdAt', order: 'descending'}" :header-cell-style="{background:'#ebeffb'}" class="Simulation operation" :row-class-name="tableRowClassName">
          <el-table-column prop="index" label="序号" type="index" width="50"></el-table-column>
          <el-table-column prop="name" label="名称" min-width="120" sortable></el-table-column>
          <el-table-column prop="createdAt" label="保存时间" min-width="120" sortable>
            <template slot-scope="scope">{{scope.row.createdAt|dateformat}}</template>
          </el-table-column>
          <el-table-column prop="typeName" label="类型" min-width="100"></el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="compile(scope.row)">编辑</el-button>
              <el-button @click="dialogVisiblecopyMy=true,select=scope.row.id,inputcopyname=''" type="text" size="small">克隆</el-button>
              <el-button type="text" @click="deleteTaskFormwork(scope.row.id)" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin:50px;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
        </div>
      </div>
      <div class="simulationResourcesOverall-bottom" v-show="!istask">
        <p class="simulationResourcesOverall-leftbottom">内置仿真资源</p>
        <el-table :data="tableDataTrue" stripe :default-sort="{prop:'createdAt', order: 'descending'}" :header-cell-style="{background:'#ebeffb'}" class="Simulation operation" :row-class-name="tableRowClassName">
          <el-table-column prop="index" label="序号" type="index" width="50"></el-table-column>
          <el-table-column prop="name" label="名称" min-width="120"></el-table-column>
          <el-table-column prop="typeName" label="类型" min-width="100"></el-table-column>
          <el-table-column label="操作" width="350">
            <template slot-scope="scope">
              <el-button @click="look(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="dialogVisiblecopy=true,select=scope.row.id,inputcopyname=''" type="text" size="small" class="chongqing">克隆</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin:50px;">
          <el-pagination @size-change="handleSizeChangeinner" @current-change="handleCurrentChangeinner" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="lengthinner"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 新建弹出框 -->
    <el-dialog :visible.sync="testTemplateLibrary" width="40%" title="我的仿真资源">
      <div>
        <el-input placeholder="新建名称" v-model="addform.name" class="input-with-select">
          <el-select v-model="addform.type" slot="prepend" placeholder="请选择类型" style="width:150px">
            <el-option :label="item.name" :value="item.name" v-for="(item) in simulationResourcesType" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="addform.expTypeId" v-show="addform.type[0]=='三'?true:false" slot="prepend" placeholder="请选泽实训类型" style="width:150px;margin-left:10px">
            <el-option :label="item.name" :value="item.id" v-for="item in pattern" :key="item.id"></el-option>
          </el-select>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="testTemplateLibrary = false" class="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="append()" class="Sure" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 克隆我的仿真资源弹出框 -->
    <el-dialog title="克隆我的仿真资源" :visible.sync=" dialogVisiblecopyMy" width="30%">
      <div>
        <el-input placeholder="请输入新增模板名称" v-model="inputcopyname" class="input-with-select"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" dialogVisiblecopyMy = false" class="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="ReplicateTheBuiltInExperimentMy()" class="Sure" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 克隆内置仿真资源出框      -->
    <el-dialog title="克隆内置仿真资源" :visible.sync=" dialogVisiblecopy" width="30%">
      <div>
        <el-input placeholder="请输入新增模板名称" v-model="inputcopyname" class="input-with-select"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" dialogVisiblecopy = false" class="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="ReplicateTheBuiltInExperiment()" class="Sure" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getScene, //获取仿真资源类型列表
  getSimulation, //获取仿真资源列表
  addSimulation, //新增仿真资源
  cloneSimulation, //克隆仿真资源
  deletSimulation, //删除仿真资源
  modifySimulation, //修改仿真资源
  experiment_type_list //添加实训类型
} from "../API/api";
export default {
  data() {
    return {
      offset: 0,
      limit: 10,
      length: 0,
      offsetinner: 0,
      limitinner: 10,
      lengthinner: 0,
      currentPage: 1,
      currentPage4: 1,
      select: "", //克隆时选中的id
      simulationResourcesType: [], //类型
      tableDataFalse: [], //我的仿真资源
      tableDataTrue: [], //内置仿真资源
      inputcopyname: "", //克隆时输入的新名称
      testTemplateLibrary: false, //新建模态框初始隐藏
      dialogVisiblecopyMy: false, //克隆我的仿真资源弹出框隐藏
      dialogVisiblecopy: false, //克隆内置仿真资源弹出框隐藏
      istask: true, //切换任务类型
      addform: {
        type: "",
        name: "",
        typeId: "",
        expTypeId: ""
      },
      // 2D3D信息
      dimensionality: {
        dimensionality: "2D",
        name: "",
        type: "",
        id: "",
        look: false
      },
      tasks: {
        id: "",
        name: "",
        path: "",
        type: "",
        look: false
      },
      pattern: [],
      formLabelWidth: "120px"
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'warning-row';
      } else if (rowIndex % 2 == 0) {
        return 'success-row';
      }
      return '';
    },
    // 我的仿真资源分页
    handleSizeChange(val) {
      this.limit = val;
      this.mySimulationResources();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.mySimulationResources();
    },
    // 内置仿真资源分页
    handleSizeChangeinner(val) {
      this.limitinner = val;
      this.innerSimulationResources();
    },
    handleCurrentChangeinner(val) {
      this.offsetinner = (val - 1) * this.limit;
      this.innerSimulationResources();
    },
    //新增仿真资源按钮
    newlyBuildButton() {
      this.testTemplateLibrary = true; //模态框显示
      this.getSceneTypeList(); //获取仿真资源类型列表
      this.experiment_type_list(); //添加实训类型
    },
    //获取仿真资源类型列表
    getSceneTypeList() {
      getScene().then(res => {
        this.simulationResourcesType = res.data.object;
      });
    },
    //添加实训类型
    experiment_type_list() {
      experiment_type_list().then(res => {
        this.pattern = res.data.object;
      });
    },
    // 获取我的仿真资源列表
    mySimulationResources() {
      getSimulation({
        offset: this.offset,
        limit: this.limit,
        inner: false
      }).then(res => {
        this.tableDataFalse = [];
        this.length = res.data.length;
        this.tableDataFalse = res.data.object;
      });
    },
    // 获取内置仿真资源列表
    innerSimulationResources() {
      getSimulation({
        offset: this.offsetinner,
        limit: this.limitinner,
        inner: true
      }).then(res => {
        this.tableDataTrue = [];
        this.lengthinner = res.data.length;
        this.tableDataTrue = res.data.object;

      });
    },

    //删除仿真资源
    deleteTaskFormwork(id) {
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (sessionStorage.getItem("watchStorage3D") != null) {
            if (JSON.parse(sessionStorage.getItem("watchStorage3D")).id == id) {
              this.$emit("deet", "3D");
            }
          }
          if (sessionStorage.getItem("watchStorage2D") != null) {
            if (JSON.parse(sessionStorage.getItem("watchStorage2D")).id == id) {
              this.$emit("deet", "2D");
            }
          }
          deletSimulation({
            id: id
          }).then(res => {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.mySimulationResources(); // 加载我的内置仿真模板列表
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
    //克隆我的仿真资源
    ReplicateTheBuiltInExperimentMy(id) {
      let type = true;
      if (this.inputcopyname == "" || this.inputcopyname.length == 0) {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "重名名为空"
        });
        type = false;
        return;
      }
      for (let i = 0; i < this.tableDataFalse.length; i++) {
        let item = this.tableDataFalse[i];
        if (item.name == this.inputcopyname) {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: "存在重复名字"
          });
          type = false;
          return;
        }
      }
      if (type) {
        this.dialogVisiblecopyMy = false;
        cloneSimulation({
          id: this.select,
          name: this.inputcopyname
        }).then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "克隆成功",
              type: "success"
            });

            this.mySimulationResources(); // 加载我的内置仿真模板列表
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "克隆失败",
              type: "error"
            });
          }
        });
      }
    },
    // 克隆内置仿真资源
    ReplicateTheBuiltInExperiment(id) {
      let type = true;
      if (this.inputcopyname == "" || this.inputcopyname.length == 0) {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "重名名为空"
        });
        type = false;
        return;
      }
      for (let i = 0; i < this.tableDataFalse.length; i++) {
        let item = this.tableDataFalse[i];
        if (item.name == this.inputcopyname) {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: "存在重复名字"
          });
          type = false;
          return;
        }
      }
      if (type) {
        this.dialogVisiblecopy = false;
        cloneSimulation({
          id: this.select,
          name: this.inputcopyname
        }).then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: "克隆成功",
              type: "success",
              showClose: true,
              duration: 1000
            });
            this.mySimulationResources(); // 加载我的内置仿真模板列表
            this.innerSimulationResources(); // 加载内置仿真模板列表
          } else {
            this.$message.error({
              showClose: true,
              duration: 1000,
              message: "克隆失败"
            });
          }
        });
      }
    },
    // 新建实训
    append() {
      if (this.addform.name == "" || this.addform.type == "") {
        this.$message({
          showClose: true,
          duration: 1000,
          message: "没有名称或类型",
          type: "error"
        });
        return;
      }
      for (let i = 0; i < this.simulationResourcesType.length; i++) {
        if (this.simulationResourcesType[i].name == this.addform.type) {
          this.addform.typeId = this.simulationResourcesType[i].id;
          break;
        }
      }
      let from = {};
      from.name = this.addform.name;
      from.expTypeId = this.addform.expTypeId;
      from.typeId = this.addform.typeId;

      if (this.addform.type[0] == "三") {
        if (this.addform.expTypeId == "") {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: "请选择三维实训类型"
          });
          return;
        }
      }
      addSimulation(from).then(res => {
        if (res.data.code == "-2") {
          this.$message({
            showClose: true,
            duration: 1000,
            type: "info",
            message: "新建名称重复"
          });
        } else if (res.data.code == "0") {
          this.$message({
            showClose: true,
            duration: 1000,
            message: "新增成功",
            type: "success"
          });
          this.addform.name = "";
          this.addform.type = "";
          this.mySimulationResources();
        } else {
          this.$message({
            showClose: true,
            duration: 1000,
            type: "error",
            message: "新建失败"
          });
        }
      });
      this.testTemplateLibrary = false;
    },
    // 编辑
    compile(row) {
      if (row.expTypeId == null || row.expTypeId == "") {
        this.dimensionality.id = row.id;
        this.dimensionality.name = row.name;
        this.dimensionality.type = row.typeName;
        this.dimensionality.look = false;
      } else {
        this.tasks.id = row.id;
        this.tasks.name = row.name;
        this.tasks.type = row.typeName;
        this.tasks.look = false;
        this.go3D(this.tasks);
      }
    },
    // 查看
    look(row) {
      if (row.expTypeId == null) {
        this.dimensionality.id = row.id;
        this.dimensionality.name = row.name;
        this.dimensionality.type = row.typeName;
        this.dimensionality.look = false;
      } else {
        this.tasks.id = row.id;
        this.tasks.name = row.name;
        this.tasks.type = row.typeName;
        this.tasks.look = true;
        this.go3D(this.tasks);
      }
    },
    go3D(row) {
      const tasks = JSON.parse(sessionStorage.getItem("watchStorage3D"));
      if (tasks != null) {
        this.$confirm("请先关闭或保存三维设计空间?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push("/relayteacher/Dimension3");
          })
          .catch(() => {
            this.$message({
              showClose: true,
              duration: 1000,
              type: "info",
              message: "已取消删除"
            });
          });
        return;
      }
      if ((row.type == "" || row.name == "") && row.id == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "没有名称或类型"
        });
      } else {
        this.resetSetItem("watchStorage3D", JSON.stringify(row));
        this.dialogVisiblecopyscene = false;

        let page = sessionStorage.getItem("pageTeacher");
        sessionStorage.setItem(
          "SourcePage",
          JSON.stringify({
            path: this.$route.path,
            index: page
          })
        );
        this.$emit("handleSelect", 11);
        this.$router.push("/relayteacher/Dimension3");
      }
    },
    // 接受内容
    params() {
      this.innerSimulationResources(); // 加载内置仿真模板列表
      this.mySimulationResources(); // 加载我的内置仿真模板列表
      if (this.$route.query != null) {
        this.row = this.$route.query;
        if (this.$route.query.type == 1) {
          this.istask = true;
        } else if (this.$route.query.type == 2) {
          this.istask = false;
        }
      }
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.params();
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    this.innerSimulationResources(); // 加载内置仿真模板列表
    this.mySimulationResources(); // 加载我的内置仿真模板列表
  }
};
</script>
<style lang="less" scoped>
.simulationResourcesOverallgroup {
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
  }
  .simulationResourcesOverall {
    height: 95%;
    width: 97.6%;
    overflow: auto;
    background-color: #fff;
    margin-left: 20px;
    margin-top: 20px;
    padding-top: 20px;

    .simulationResourcesOverall-top {
      position: relative;
      margin-bottom: 80px;
      .simulationResourcesOverall-left {
        padding-bottom: 20px;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        color: #00a0e9;
      }
      .simulationResourcesOverall-right {
        background-color: #989898;
        border: none;
        position: absolute;
        border-radius: 0px;
        top: 5px;
        right: 50px;
        :hover {
          color: #0ac0d8;
        }
      }
      .Simulation {
        width: 95%;
        margin: 0 30px;
      }
    }
    .simulationResourcesOverall-bottom {
      .simulationResourcesOverall-leftbottom {
        padding-bottom: 20px;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        color: #00a0e9;
      }
      .Simulation {
        width: 95%;
        margin: 0 30px;
      }
    }
  }
}
</style>
<style  lang="less" >
.Simulation .el-button--text {
  color: #989898;
}
.simulationResourcesOverallgroup .el-dialog__title {
  color: #00a0e9;
}
.dialog-footer .cancel {
  background-color: #66c6f2;
  border-radius: 0px;
  width: 70px;
  height: 30px;
  border: none;
}
.dialog-footer .Sure {
  background-color: #00a0e9;
  border: none;
  width: 70px;
  height: 30px;
  border-radius: 0px;
}
.simulationResourcesOverallgroup .el-menu {
  border: 0px solid red;
}
.el-table .warning-row {
  background: #f7faff;
}
</style>


