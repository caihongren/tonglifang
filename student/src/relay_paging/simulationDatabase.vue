<template>
  <div class="simulationResourcesOverallgroup">
    <div class="simulationResourcesOverall">
      <div class="simulationResourcesOverall-top">
        <h2 class="simulationResourcesOverall-left">我的仿真资源</h2>
        <el-button type="primary" icon="el-icon-plus" @click="newlyBuildButton()" class="simulationResourcesOverall-right">新建</el-button>
        <el-table :data="tableDataFalse" border stripe :default-sort="{prop:'createdAt', order: 'descending'}" :header-cell-style="{background:'#ccc'}" class="Simulation operation">
          <el-table-column prop="index" label="序号" min-width="140" class="table1" type="index"></el-table-column>
          <el-table-column prop="name" label="名称" min-width="120" sortable></el-table-column>
          <el-table-column prop="createdAt" label="保存时间" min-width="120" sortable>
            <template slot-scope="scope">{{scope.row.createdAt|dateformat}}</template>
          </el-table-column>
          <el-table-column prop="typeName" label="类型" min-width="100"></el-table-column>
          <el-table-column label="操作" min-width="150">
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
      <div class="simulationResourcesOverall-bottom">
        <h2 class="simulationResourcesOverall-leftbottom">内置仿真资源</h2>
        <el-table :data="tableDataTrue" stripe border :default-sort="{prop:'createdAt', order: 'descending'}" :header-cell-style="{background:'#ccc'}" class="Simulation operation">
          <el-table-column prop="index" label="序号" min-width="40" class="table1" type="index"></el-table-column>
          <el-table-column prop="name" label="名称" min-width="120"></el-table-column>
          <el-table-column prop="typeName" label="类型" min-width="100"></el-table-column>
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button @click="look(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="dialogVisiblecopy=true,select=scope.row.id,inputcopyname=''" type="text" size="small">克隆</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin:50px;">
        <el-pagination @size-change="handleSizeChangeinner" @current-change="handleCurrentChangeinner" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="lengthinner"></el-pagination>
      </div>
    </div>
    <!-- 新建弹出框 -->
    <el-dialog :visible.sync="testTemplateLibrary" width="40%">
      <div>
        <el-input placeholder="新建名称" v-model="addform.name" class="input-with-select">
          <el-select v-model="addform.type" slot="prepend" placeholder="请选择类型" style="width:150px">
            <el-option :label="item.name" :value="item.name" v-for="(item) in simulationResourcesType" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="addform.expTypeId" v-show="addform.type[0]=='三'?true:false" slot="prepend" placeholder="请选泽实验类型" style="width:150px;margin-left:10px">
            <el-option :label="item.name" :value="item.id" v-for="item in pattern" :key="item.id"></el-option>
          </el-select>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="testTemplateLibrary = false">取 消</el-button>
        <el-button type="primary" @click="append()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 克隆我的仿真资源弹出框 -->
    <el-dialog title="克隆我的仿真资源" :visible.sync=" dialogVisiblecopyMy" width="30%">
      <div>
        <el-input placeholder="请输入新增模板名称" v-model="inputcopyname" class="input-with-select"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" dialogVisiblecopyMy = false">取 消</el-button>
        <el-button type="primary" @click="ReplicateTheBuiltInExperimentMy()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 克隆内置仿真资源出框      -->
    <el-dialog title="克隆内置仿真资源" :visible.sync=" dialogVisiblecopy" width="30%">
      <div>
        <el-input placeholder="请输入新增模板名称" v-model="inputcopyname" class="input-with-select"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" dialogVisiblecopy = false">取 消</el-button>
        <el-button type="primary" @click="ReplicateTheBuiltInExperiment()">确 定</el-button>
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
  experiment_type_list //添加实验类型
} from "../API/api";
export default {
  data() {
    return {
      offset: 0,
      limit: 10,
      length: 0,
      offsetinner: 0,
      limitinner: 20,
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
      this.experiment_type_list(); //添加实验类型
    },
    //获取仿真资源类型列表
    getSceneTypeList() {
      getScene().then(res => {
        this.simulationResourcesType = res.data.object;
      });
    },
    //添加实验类型
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
        let tableDataFalse = [];
        this.length = res.data.length;
        for (let i = 0; i < res.data.object.length; i++) {
          tableDataFalse.push(res.data.object[i]);
        }
        this.tableDataFalse = tableDataFalse;
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
        let tableDataTrue = [];
        this.lengthinner = res.data.length;
        for (let i = 0; i < res.data.object.length; i++) {
          tableDataTrue.push(res.data.object[i]);
        }
        this.tableDataTrue = tableDataTrue;
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
          if(sessionStorage.getItem("watchStorage3D")!=null){
            if(JSON.parse(sessionStorage.getItem("watchStorage3D")).id==id){
           
              this.$emit("deet","3D")
            }
          }
           if(sessionStorage.getItem("watchStorage2D")!=null){
            if(JSON.parse(sessionStorage.getItem("watchStorage2D")).id==id){
           
              this.$emit("deet","2D")
            }
          }
          deletSimulation({
            id: id
          }).then(res => {
            this.$message({
              message: "删除成功",
              type: "success",
              duration:2000,
            });
            this.mySimulationResources(); // 加载我的内置仿真模板列表
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
             duration:2000,
          });
        });

    },
    //克隆我的仿真资源
    ReplicateTheBuiltInExperimentMy(id) {
      // this.dialogVisiblecopyMy = false;
      let type = true;
      if (this.inputcopyname == "" || this.inputcopyname.length == 0) {
        this.$message.error("重名名为空");
        type = false;
        return;
      }
      for (let i = 0; i < this.tableDataFalse.length; i++) {
        let item = this.tableDataFalse[i];
        if (item.name == this.inputcopyname) {
          this.$message.error("存在重复名字");
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
              message: "克隆成功",
              type: "success"
            });

            this.mySimulationResources(); // 加载我的内置仿真模板列表
          } else {
            this.$message.error("克隆失败");
          }
        });
      }
    },
    // 克隆内置仿真资源
    ReplicateTheBuiltInExperiment(id) {
      let type = true;
      if (this.inputcopyname == "" || this.inputcopyname.length == 0) {
        this.$message.error("重名名为空");
        type = false;
        return;
      }
      for (let i = 0; i < this.tableDataFalse.length; i++) {
        let item = this.tableDataFalse[i];
        if (item.name == this.inputcopyname) {
          this.$message.error("存在重复名字");
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
              type: "success"
            });
            this.mySimulationResources(); // 加载我的内置仿真模板列表
            this.innerSimulationResources(); // 加载内置仿真模板列表
          } else {
            this.$message.error("克隆失败");
          }
        });
      }
    },
    // 新建实验
    append() {
      if (this.addform.name == "" || this.addform.type == "") {
        this.$message.error({
          message: "没有名称或类型"
        });
        return;
      }
      for (let i = 0; i < this.simulationResourcesType.length; i++) {
        if ((this.simulationResourcesType[i].name == this.addform.type)) {
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
            message: "请选择三维实验类型"
          });
          return;
        }
      }
      addSimulation(from).then(res => {console.log(res.data.code);
        if (res.data.code == "-2") {
          this.$message({
            type: "info",
            message: "新建名称重复"
          });
        } else if (res.data.code == "0") {
          this.$message({
            message: "新增成功",
            type: "success"
          });
          this.addform.name == "";
          this.addform.type == "";
          this.mySimulationResources();

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
        this.go2D(this.dimensionality);
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
        this.go2D(this.dimensionality);
      } else {
        this.tasks.id = row.id;
        this.tasks.name = row.name;
        this.tasks.type = row.typeName;
        this.tasks.look = true;
        this.go3D(this.tasks);
      }
    },
    go2D(row) {
      const tasks = JSON.parse(sessionStorage.getItem("watchStorage2D"));
      if (tasks != null) {
        this.$confirm("请先关闭或保存二维设计空间?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push("/relayteacher/Dimension2");
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
        return;
      }

      if ((row.type == "" || row.name == "") && row.id == "") {
        this.$message.error({
          message: "没有名称或类型"
        });
      } else {
        this.resetSetItem("watchStorage2D", JSON.stringify(row));
        this.testTemplateLibrary = false;

        let page = sessionStorage.getItem("pageTeacher");
        sessionStorage.setItem(
          "SourcePage",
          JSON.stringify({
            path: this.$route.path,
            index: page
          })
        );
        this.$emit("handleSelect", 10);
        this.$router.push("/relayteacher/Dimension2");
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
              type: "info",
              message: "已取消删除"
            });
          });
        return;
      }
      if ((row.type == "" || row.name == "") && row.id == "") {
        this.$message.error({
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
  width: 80%;
  border: 1px solid #dddddd;
  margin: 0 10%;
  overflow: hidden;
  .simulationResourcesOverall {
    height: 100%;
    width: 101.1%;
    overflow: auto;
    .simulationResourcesOverall-top {
      position: relative;
      margin-bottom: 80px;
      .simulationResourcesOverall-left {
        margin-left: 30px;
      }
      .simulationResourcesOverall-right {
        position: absolute;
        top: 0px;
        right: 47px;
      }
      .Simulation {
        width: 95%;
        margin: 0 30px;
      }
    }
    .simulationResourcesOverall-bottom {
      .simulationResourcesOverall-leftbottom {
        margin-left: 30px;
      }
      .Simulation {
        width: 95%;
        margin: 0 30px;
      }
      .simulationOperation {
        width: 97.5%;
        margin-left: 20px;
      }
    }
  }
}
</style>


