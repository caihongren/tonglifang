<template>
  <div class="populationgroup">
    <div class="population" :style="{height:isshowheight?'100%':'0px'}" v-show="isshowheight">
      <div class="population-top">
        <div class="testFormwork">
          <h2 class="testFormwork-left">我的实验模板</h2>
          <el-button type="primary" icon="el-icon-plus" @click="newTemplate()" class="newlyBuild">新建</el-button>
          <el-button type="primary" icon="el-icon-document-copy" class="testFormwork-right" @click="dialogVisiblecopy = true">从内置模板克隆</el-button>
        </div>
        <div class="testFormwork-button">
          <el-table ref="singleTable" :data="tableDataFalse" stripe border highlight-current-row :header-cell-style="{background:'#ccc'}" class="tablebox">
            <el-table-column prop="index" label="序号" min-width="140" class="table1" type="index"></el-table-column>
            <el-table-column prop="name" label="名称" min-width="150"></el-table-column>
            <el-table-column prop="updatedAt" label="保存时间" min-width="120">
              <template slot-scope="scope">{{scope.row.updatedAt|dateformat}}</template>
            </el-table-column>
            <el-table-column prop="description" label="要求" min-width="149"></el-table-column>
            <el-table-column label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="dialogVisiblecopyMy=true,select=scope.row.id" type="text" size="small">克隆</el-button>
                <el-button type="text" @click="compileClick(scope.row) , isshowheight=false" size="small">编辑</el-button>
                <el-button type="text" @click="deleteTaskFormwork(scope.row.id)" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:50px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
          </div>
        </div>
      </div>
      <div class="population-button">
        <h2 class="built-inTemplate-top">内置试验模板</h2>
        <div class="built-inTemplate-button">
          <el-table ref="singleTable" :data="tableDataTrue" stripe border highlight-current-row :header-cell-style="{background:'#ccc'}" class="tablebox">
            <el-table-column prop="index" label="序号" min-width="140" class="table1" type="index"></el-table-column>
            <el-table-column prop="name" label="名称" min-width="150"></el-table-column>
            <el-table-column prop="description" label="要求" min-width="249"></el-table-column>
            <el-table-column label="查看详情" min-width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="seeTemplate(scope.row),isshowheight=false" size="small">查看</el-button>
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
    <!-- 克隆内置实验模板弹出框      -->
    <el-dialog title="克隆内置实验" :visible.sync="dialogVisiblecopy" width="30%">
      <div>
        <el-input placeholder="请输入新增模板名称" v-model="inputcopyname" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择克隆的模板" style="width:180px">
            <el-option :label="item.name" :value="item.id" v-for="item in tableDataTrue" :key="item.id"></el-option>
          </el-select>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblecopy = false">取 消</el-button>
        <el-button type="primary" @click="ReplicateTheBuiltInExperiment()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 克隆我的试验模板弹框 -->
    <el-dialog title="克隆我的实验模板" :visible.sync=" dialogVisiblecopyMy" width="30%">
      <div>
        <el-input placeholder="请输入新增模板名称" v-model="inputcopyname" class="input-with-select"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" dialogVisiblecopyMy = false">取 消</el-button>
        <el-button type="primary" @click="ReplicateTheBuiltInExperiment()">确 定</el-button>
      </span>
    </el-dialog>
    <div style="width:100%;" :style="{height:!isshowheight?'100%':'0px'}">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <a @click="isshowheight=!isshowheight,isadd=!isadd">
              <h2>实验模板库</h2>
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
  add_template,//新增模板
  delete_template,//删除实验模板
  getTemplateList,  // 加载实验模板列表
  cloneTemplate,//克隆
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
        deletebutton: false,


      },
      // addOrEditFlag: "",//点击的编辑还是新增按钮跳转到子组件
      isadd: false,
      isshowheight: true, //子组件的页面打开
      inputcopyname: "", //克隆时输入的新名称
      select: "", //克隆时选中的id
      testTemplateLibrary: false, //新建模态框初始隐藏
      dialogVisiblecopy: false, //从内置模板克隆模态框隐藏
      dialogVisiblecopyMy: false, //克隆模态框隐藏
      tableDataFalse: [], //实验模板
      tableDataTrue: [] //内置实验模板
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
    //点击新建模态框显示
    newTemplate() {

      const isshow = {};
      isshow.type = true;
      isshow.addtype = true;
      isshow.deletebutton = true;
      isshow.vall = false;//文本域可以编辑
      isshow.look = false;
      this.isshow = isshow;
      this.isadd = true;
      this.row = {};
      this.isshowheight = false;
      this.name = '新建模板'
      // this.newName = ''//新建模板名称清空
      // this.textarea = ''
    },
    // 加载实验模板列表
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
        for (let i = 0; i < res.data.object.length; i++) {
          this.tableDataTrue.push(res.data.object[i]);
        }
      });
    },
    //删除实验模板
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
              message: "删除成功",
              type: "success"
            });
            this.mySimulationResources();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 克隆内置实验模板
    ReplicateTheBuiltInExperiment() {
      this.dialogVisiblecopy = false;
      this.dialogVisiblecopyMy = false;
      if (this.inputcopyname == "" || this.inputcopyname.length == 0) {
        this.$message.error("重名名为空");
        return;
      }
      for (let i = 0; i < this.tableDataFalse.length; i++) {
        let item = this.tableDataFalse[i];
        if (item.name == this.inputcopyname) {
          this.$message.error("存在重复名字");
          return;
        }
      }
      cloneTemplate({
        id: this.select,
        name: this.inputcopyname
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "克隆成功",
            type: "success"
          });
          this.select = "";
          this.inputcopyname = "";
          this.mySimulationResources(); // 加载我的实验模板列表
        } else {
          this.$message.error("克隆失败");
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
    //内置实验模板查看按钮
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
      this.mySimulationResources(); // 加载我的实验模板列表
    }
  },
  created() {
    // 加载实验模板列表
    this.innerSimulationResources(); // 加载内置实验模板列表
    this.mySimulationResources(); // 加载我的实验模板列表
  }
};
</script>
<style lang="less" scoped>
.populationgroup {
  height: 100%;
  width: 80%;
  border: 1px solid #dddddd;
  margin: 0 10%;
  overflow: hidden;

  .population {
    height: 86vh;
    width: 102%;
    overflow: auto;
    transition: 0s;
    .population-top {
      position: relative;
      margin-bottom: 100px;
      .testFormwork-left {
        margin-left: 35px;
      }
      .newlyBuild {
        position: absolute;
        top: 0;
        right: 230px;
      }
      .testFormwork-right {
        position: absolute;
        right: 60px;
        top: 0px;
      }
    }
    .population-button {
      .built-inTemplate-top {
        margin-left: 35px;
      }
    }
  }
  .tablebox {
    width: 94%;
    margin: 0 35px;
  }
}
.breadcrumb {
  width: 94%;
  height: 50px;
  margin: 0 3%;
  font-size: 20px;
}
</style>
<style>
</style>

