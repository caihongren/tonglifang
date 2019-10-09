<template>
  <div class="resourceDownload">
    <el-container>
      <el-header class="top">
        <div style="width:250px;"> <img src="../image/logo4.png"></div>
        <el-radio-group v-model="tabPosition" class="tabPosition">
          <el-radio-button label="top">课程管理</el-radio-button>
          <el-radio-button label="right">任务管理</el-radio-button>
          <el-radio-button label="bottom">元器件库</el-radio-button>
          <el-radio-button label="left">仿真资源库</el-radio-button>
          <el-radio-button label="ll">实训模板库</el-radio-button>
          <el-radio-button label="rr">实训资源</el-radio-button>

        </el-radio-group>

      </el-header>
      <el-container class="botton">
        <el-aside width="250px" class="botton-left">
          <div class="chapter">
            <el-menu default-active="2" background-color="#eae8f0e0" text-color="#4d7283" active-text-color="#00a0e9" style="text-align: center; font-size:18px; width:251px; font-weight:600;">
              <el-menu-item index="1">我的实训模板</el-menu-item>
              <el-menu-item index="2">内置实训模板</el-menu-item>
              <el-menu-item index="3">内置实训模板</el-menu-item>
              <el-menu-item index="4">内置实训模板</el-menu-item>
              <el-menu-item index="5">内置实训模板</el-menu-item>
              <el-menu-item index="6">内置实训模板</el-menu-item>
              <el-menu-item index="7">内置实训模板</el-menu-item>
            </el-menu>
          </div>
        </el-aside>
        <el-main class="botton-right">
          <h2>我的试验模板</h2>
          <el-table :data="tableDataFalse" style="width: 100%" :row-class-name="tableRowClassName" :header-cell-style="{background:'#ebeffb'}">
            <el-table-column prop="index" label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="name" label="名称" min-width="120"></el-table-column>
            <el-table-column prop="updatedAt" label="类型" min-width="120"></el-table-column>
            <el-table-column prop="description" label="大小" min-width="100"></el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button type="text" @click="resourceDownload(scope.row.path,scope.row.name)" size="small">下载</el-button>
                <el-button type="text" @click="resourceDelete(scope.row.id)" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:50px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>
<script>
export default {
  data() {
    return {

      tabPosition: 'left',
      currentPage: 1,
      currentPage4: 1,
      offset: 0,
      limit: 10,
      offsetinner: 0,
      limitinner: 10,
      tableDataFalse: [
        {
          name: "用户使用手册",
          updatedAt: "任务一",
          description: "200"
        },
        {
          name: "用户使用手册",
          updatedAt: "任务一",
          description: "200"
        },
        {
          name: "用户使用手册",
          updatedAt: "任务一",
          description: "200"
        },
        {
          name: "用户使用手册",
          updatedAt: "任务一",
          description: "200"
        }, {
          name: "用户使用手册",
          updatedAt: "任务一",
          description: "200"
        }, {
          name: "用户使用手册",
          updatedAt: "任务一",
          description: "200"
        }, {
          name: "用户使用手册",
          updatedAt: "任务一",
          description: "200"
        }, {
          name: "用户使用手册",
          updatedAt: "任务一",
          description: "200"
        }
      ]
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
    handleSizeChange(val) {
      this.limit = val;
      this.mySimulationResources();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.mySimulationResources();
    },
  },

};
</script>
<style lang="less" scoped>
.tabPosition {
  width: 60%;
  text-align: center;
  padding-top: 10px;
}
.chapter {
  margin-top: 20px;
  ul {
    li {
      color: #fff;
      font-size: 18px;
      margin: 20px 0px;
      text-align: center;
      cursor: pointer;
    }
  }
}
.resourceDownload {
  position: relative;
  background-color: #f8f7f7;
}
.top {
  margin-top: -60px;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #4d7283;
  img {
    margin-left: -20px;
    background-color: #eae8f0e0;
    float: left;
    box-shadow: 5px 0px 5px -4px rgb(180, 174, 174);
  }
}

.botton {
  width: 100%;
  height: 1000px;

  .botton-left {
    float: left;
    height: 100%;
    background-color: #eae8f0e0;
   box-shadow: 5px 0px 5px -4px rgb(180, 174, 174);
    // background-color: rgba(255 255 255 0);
  }
  .botton-right {
    margin-left: 20px;
    height: 87%;
    width: 83%;
    background-color: #f8f7f7;
    margin-right: 100px;

    h2 {
      text-align: center;
      color: #00a0e9;
      font-size: 20px;
    }
    .tabletop {
      width: 95%;
      margin: 0 30px;
    }
  }
}
</style>

<style>
.resourceDownload .el-radio-button__inner {
  border-color: #fff;
  border-bottom: none;
  border-radius: 0px;
  padding: 13px 25px;
  border-radius: 0px;
  font-size: 18px;
  box-sizing: border-box;
}

.el-table .warning-row {
  background: #f7faff;
}
.resourceDownload
  .top
  .tabPosition
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  background-color: #4d7283;
  color: #fff;
  border-radius: 5px 5px 0 0;
  border-color: #4d7283;
  box-shadow: -1px 0 0 0 #4d7283;
  height: 46px;
}
.resourceDownload .el-radio-button:first-child .el-radio-button__inner {
  border-left: 1px solid #fff;
}
</style>



