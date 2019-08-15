<template>
  <div class="populationgroup">
    <!-- 右边菜单栏 -->
    <div class="menus">
      <el-menu default-active="3" class="el-menu-vertical-demo" background-color="#313131" text-color="#fff" active-text-color="#ffd04b" style="text-align: center; font-size:18px;">
        <el-menu-item index="3" @click="istask=false,isshowheight=true,isadd=false">实训模板</el-menu-item>
        <el-menu-item index="2" @click="istask=true,isshowheight=true,isadd=false" class="chongqing">我的实训模板</el-menu-item>

      </el-menu>
    </div>

    <!-- 正文 -->
    <div class="population" :style="{height:isshowheight?'92%':'0px'}" v-show="isshowheight">
      <div class="population-top chongqing" v-show="istask">
        <div class="testFormwork">
          <p class="testFormwork-left">我的实训模板</p>
          <el-button type="primary" icon="el-icon-plus" @click="newTemplate()" class="newlyBuild" size="mini">新建</el-button>
          <el-button type="primary" icon="el-icon-document-copy" class="testFormwork-right" @click="dialogVisiblecopy = true" size="mini">从内置模板克隆</el-button>
        </div>
        <div class="testFormwork-button">
          <el-table ref="singleTable" :data="tableDataFalse" stripe border highlight-current-row :header-cell-style="{background:'#b2e2f8'}" class="tablebox">
            <el-table-column prop="index" label="序号" class="table1" type="index"></el-table-column>
            <el-table-column prop="name" label="名称" min-width="120" sortable></el-table-column>
            <el-table-column prop="updatedAt" label="保存时间" min-width="120" sortable>
              <template slot-scope="scope">{{scope.row.updatedAt|dateformat}}</template>
            </el-table-column>
            <el-table-column prop="description" label="要求" min-width="100"></el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button @click="dialogVisiblecopyMy=true,select=scope.row.id" type="text" size="small">克隆</el-button>
                <el-button type="text" @click="compileClick(scope.row) , isshowheight=false" size="small">编辑</el-button>
                <el-button type="text" @click="deleteTaskFormwork(scope.row.id)" size="small">删除</el-button>
                <el-button type="text" @click="transformation(scope.row.id)" size="small" v-if='isposition'>转换内置模板</el-button>

              </template>
            </el-table-column>
          </el-table>
          <div style="margin:50px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
          </div>
        </div>
      </div>
      <div class="population-button" v-show="!istask">
        <p class="built-inTemplate-top">实训模板</p>
        <div class="sousuo">
          <el-input placeholder="搜索模板" v-model="input5" class="input-with-select bottom " @keyup.enter.native='sousuo()'>
            <el-button slot="append" class="el-icon-search" @click="sousuo()"></el-button>
          </el-input>
        </div>
        <div class="built-inTemplate-button">
          <el-table ref="singleTable" :data="tableDataTrue" stripe border highlight-current-row :header-cell-style="{background:'#b2e2f8'}" class="tablebox">
            <el-table-column prop="index" label="序号" class="table1" type="index"></el-table-column>
            <el-table-column prop="name" label="名称" min-width="120" sortable></el-table-column>
            <el-table-column prop="description" label="要求" min-width="100"></el-table-column>
            <el-table-column label="查看详情" width="350">
              <template slot-scope="scope">
                <el-button type="text" @click="seeTemplate(scope.row),isshowheight=false">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:50px;">
            <el-pagination @size-change="handleSizeChangeinner" @current-change="handleCurrentChangeinner" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="lengthinner"></el-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹出框 -->
    <!-- 克隆内置实训模板弹出框      -->
    <el-dialog title="克隆内置实训" :visible.sync="dialogVisiblecopy" width="30%">
      <div>
        <el-input placeholder="请输入新增模板名称" v-model="inputcopyname" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择克隆的模板" style="width:180px">
            <el-option :label="item.name" :value="item.id" v-for="item in tableDataTrue" :key="item.id"></el-option>
          </el-select>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisiblecopy = false" class="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="ReplicateTheBuiltInExperiment()" class="Sure" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 克隆我的试验模板弹框 -->
    <el-dialog title="克隆我的实训模板" :visible.sync=" dialogVisiblecopyMy" width="30%">
      <div>
        <el-input placeholder="请输入新增模板名称" v-model="inputcopyname" class="input-with-select"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" dialogVisiblecopyMy = false" class="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="ReplicateTheBuiltInExperiment()" class="Sure" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <div style="width:100%;" :style="{height:!isshowheight?'100%':'0px'}">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <a @click="isshowheight=!isshowheight,isadd=!isadd">
              <h2>实训模板库</h2>
            </a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <a>
              <h2>{{name}}</h2>
            </a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <newExperimentalTemplate v-if="!isshowheight" v-bind:isshow="isshow" v-bind:row="row" @detpage="detpage"></newExperimentalTemplate>
    </div>
  </div>
</template>
<script>
import {
  add_template, //新增模板
  delete_template, //删除实训模板
  getTemplateList, // 加载实训模板列表
  cloneTemplate, //克隆
  updateTemplateInner,//设置模板为内置
} from "../API/api";
import newExperimentalTemplate from "./newExperimentalTemplate";
export default {
  name: "newExperimentalTemplateLibrary",
  data() {
    return {
      name: "",
      currentPage: 1,
      currentPage4: 1,
      offset: 0,
      limit: 10,
      offsetinner: 0,
      limitinner: 10,
      length: 0,
      lengthinner: 0,
      row: {},
      isshow: {
        type: false,
        addtype: false,
        vall: false,
        look: false,
        deletebutton: false
      },
      // addOrEditFlag: "",//点击的编辑还是新增按钮跳转到子组件
      isadd: false,
      isshowheight: true, //子组件的页面打开
      istask: false, //切换任务类型
      inputcopyname: "", //克隆时输入的新名称
      select: "", //克隆时选中的id
      // transformationId: "",//转换内置模板id
      testTemplateLibrary: false, //新建模态框初始隐藏
      dialogVisiblecopy: false, //从内置模板克隆模态框隐藏
      dialogVisiblecopyMy: false, //克隆模态框隐藏
      isposition: false,  //教导主任，特殊老师权限。
      tableDataFalse: [], //实训模板
      tableDataTrue: [],//内置实训模板
      tableDataTruebox: [],//内置所有
      input5: '',
    };
  },
  components: {
    newExperimentalTemplate
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
    addDialog() {
      this.addDialogVisible = true;
    },

    // 搜索
    sousuo() {
      this.tableDataTrue = []
      let tableDataTruebox = this.tableDataTruebox
      if (this.input5 != '') {
        for (let i = 0; i < tableDataTruebox.length; i++) {
          if (tableDataTruebox[i].name.indexOf(this.input5) != -1) {
            this.tableDataTrue.push(tableDataTruebox[i])
          }
        }
      } else {
        this.innerSimulationResources()
      }
    },
    //点击新建模态框显示
    newTemplate() {
      const isshow = {};
      isshow.type = true;
      isshow.addtype = true;
      isshow.deletebutton = true;
      isshow.vall = false; //文本域可以编辑
      isshow.look = false;
      this.isshow = isshow;
      this.isadd = true;
      this.row = {};
      this.isshowheight = false;
      this.name = "新建模板";
      // this.newName = ''//新建模板名称清空
      // this.textarea = ''
    },

    // 加载实训模板列表
    mySimulationResources() {
      getTemplateList({
        offset: this.offset,
        limit: this.limit,
        inner: false
      }).then(res => {
        this.tableDataFalse = [];
        this.length = res.data.length;
        for (let i = 0; i < res.data.object.length; i++) {
          this.tableDataFalse.push(res.data.object[i]);
        }
      });
    },
    // 获取内置仿真资源列表
    innerSimulationResources() {
      getTemplateList({
        offset: this.offsetinner,
        limit: this.limitinner,
        inner: true
      }).then(res => {
        this.tableDataTrue = [];
        this.lengthinner = res.data.length;
        this.tableDataTrue = res.data.object
      });
    },
    // 获取全部内置仿真资源
    innerSimulationResourcesbox() {
      getTemplateList({
        offset: 0,
        limit: 10000,
        inner: true
      }).then(res => {
        console.log(res)
        this.tableDataTruebox = [];
        this.lengthinner = res.data.length;
        this.tableDataTruebox = res.data.object;

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
          delete_template({
            id: id
          }).then(res => {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.mySimulationResources();
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
    // 转换内置模板
    transformation(id) {
      updateTemplateInner({
        id: id
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            duration: 1000,
            message: "转换成功",
            type: "success"
          });
          this.innerSimulationResources(); // 加载内置实训模板列表
          this.mySimulationResources(); // 加载我的实训模板列表
        } else {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: "转换失败"
          });
        }
      });

    },
    // 克隆内置实训模板
    ReplicateTheBuiltInExperiment() {
      this.dialogVisiblecopy = false;
      this.dialogVisiblecopyMy = false;
      if (this.inputcopyname == "" || this.inputcopyname.length == 0) {
        this.$message.error({
          showClose: true,
          type: "info",
          message: "重名名为空",
          duration: 1000
        });
        return;
      }
      for (let i = 0; i < this.tableDataFalse.length; i++) {
        let item = this.tableDataFalse[i];
        if (item.name == this.inputcopyname) {
          this.$message.error({
            showClose: true,
            type: "info",
            message: "存在重复名字",
            duration: 1000
          });
          return;
        }
      }
      cloneTemplate({
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
          this.select = "";
          this.inputcopyname = "";
          this.mySimulationResources(); // 加载我的实训模板列表
        } else {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: "克隆失败"
          });
        }
      });
    },
    // 编辑
    compileClick(row) {
      this.name = row.name;
      this.row = row;
      this.isshow.deletebutton = true;
      this.isshow.type = true;
      this.isadd = true;
      this.isshow.addtype = true;
      this.isshow.vall = false;
      this.isshow.look = false; //文本域可以编辑
    },
    //内置实训模板查看按钮
    seeTemplate(row) {
      this.name = row.name;
      this.row = row;
      this.isshow.deletebutton = false;
      this.isshow.type = false;
      this.isadd = true;
      this.isshow.addtype = false;
      this.isshow.look = false;
      this.isshow.vall = true; //文本域只读
    },
    // 关闭详情页面
    detpage() {
      this.isshowheight = !this.isshowheight;
      this.innerVisible = !this.innerVisible;
      this.mySimulationResources(); // 加载我的实训模板列表
    },
    //判断教导主任
    supervisor() {
      let user = JSON.parse(sessionStorage.getItem("user")) ;
     
      if (user.position == "supervisor"&&user.role=='teacher') {
        this.isposition = true;
      } else {
        this.isposition = false;
      }
    },
  },

  created() {
    //特殊教导主任权限
    this.supervisor()
    // 加载实训模板列表
    this.innerSimulationResourcesbox()
    this.innerSimulationResources(); // 加载内置实训模板列表
    this.mySimulationResources(); // 加载我的实训模板列表
  }
};
</script>
<style lang="less" scoped>
.el-button--mini {
  border-radius: 0px;
}
.populationgroup {
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
  .population {
    width: 95%;
    overflow: auto;
    background-color: #fff;
    margin-left: 20px;
    margin-top: 20px;
    margin-bottom: 200px;
    padding-top: 20px;
    height: 86vh;
    background-color: #fff;
    overflow: auto;
    transition: 0s;
    .population-top {
      position: relative;
      margin-bottom: 100px;
      .testFormwork-left {
        padding-bottom: 20px;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        color: #00a0e9;
      }
      .newlyBuild {
        background-color: #989898;
        border: none;
        position: absolute;
        top: 5px;
        right: 190px;
        :hover {
          color: #7db0cc;
        }
      }
      .testFormwork-right {
        background-color: #989898;
        border: none;
        position: absolute;
        right: 45px;
        top: 5px;
        :hover {
          color: #7db0cc;
        }
      }
    }
    .population-button {
      .built-inTemplate-top {
        padding-bottom: 20px;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        color: #00a0e9;
      }
      .sousuo {
        width: 350px;
        margin-left: 30px;
        margin-bottom: 10px;
        .el-icon-search:hover{
          color: #fff;
        }
      }
    }
  }
  .tablebox {
    width: 95%;
    margin: 0 30px;
  }
}

.breadcrumb {
  margin-top: 20px;
  width: 94.2%;
  height: 51px;
  font-size: 20px;
  background-color: #fff;
  padding-left: 20px;
  margin-left: 2%;
  margin-right: 2%;
  h2 {
    color: #00a0e9;
  }
}
</style>
<style>
.built-inTemplate-button .el-button--text {
  color: #989898;
}
.populationgroup .el-button--text {
  color: #989898;
}
.populationgroup .el-dialog__title {
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
.populationgroup .sousuo .el-button{
   background-color: #b2e2f8;
 border-radius: 0px;
}
.populationgroup .sousuo .el-button:hover{

 background-color: #66c6f2;
 border-radius: 0px;
}
</style>

