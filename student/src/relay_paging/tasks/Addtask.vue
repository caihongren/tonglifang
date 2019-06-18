<template>
  <div class="box">
    <router-link to="/relayteacher/task">
      <el-button type="primary" size="small" icon="el-icon-back" style="margin-top:20px">返回</el-button>
    </router-link>
    <el-aside width="95%" border="true">
      <div style="height:50px" class="bottonbox">
        <span class="buttombox">实验模板</span>
        <el-button type="primary" icon="el-icon-search" class="search">新增实验模板</el-button>
      </div>
      <div>
          <!-- 表格 -->
            <el-table
        ref="singleTable"
        :data="tableData"
        border
        highlight-current-row
        @current-change="handleCurrentChange"
        class="tablebox"
      >
        <el-table-column prop="index" label="序号" width="100" class="table1" type="index"></el-table-column>
        <el-table-column prop="name" label="名称" width="250"></el-table-column>
        <el-table-column prop="experimentType" label="实验类型" width="249"></el-table-column>
        <el-table-column prop="guideName" label="实验指导书" width="249"></el-table-column>
        <el-table-column prop="reportName" label="实验报告" width="249"></el-table-column>
        
        <el-table-column prop="kong" label="附件" width="150">
          <Button type="primary" @click="dialogVisible = true">详情展开</Button>
          <Modal v-model="modal3" title="选择附件" @on-ok="addok" @on-cancel="addcancel">
            <Tree :data="data2" show-checkbox multiple></Tree>
          </Modal>
        </el-table-column>
        <el-table-column prop="sceneName" label="实验资源" width="249"></el-table-column>
        <el-table-column  label="操作" >
          <template slot-scope="scope">
        <el-button @click="open2(scope.row.id)" type="text" size="small">编辑</el-button>
        <el-button type="text" @click="open4" size="small">删除</el-button>
      </template>
        </el-table-column>
      </el-table>

      </div>
      

      <!-- 弹出层 -->
    </el-aside>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { Nxmission, templateList } from "./../../API/api";
import { log } from "util";
export default {
  data() {
    return {
      offset: 0,
      limit: 10,
      addtasklist: [],
      taskLength: 0,
      dialogVisible: false,
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      options: [
        {
          value: "s1",
          label: "异步点动机按钮启动控制"
        },
        {
          value: "s2",
          label: "电机顺序启动控制"
        },
        {
          value: "s3",
          label: "异步电动机手动单向运转控制"
        }
      ],
      modal1: false,
      modal2: false,
      modal3: false,

      data1: [
        {
          title: "班级列表",
          expand: true,
          selected: true,
          children: [
            {
              title: "一班",
              expand: true,
              children: [
                {
                  title: "潘淑云"
                },
                {
                  title: "李籽祥"
                },
                {
                  title: "王康宁"
                }
              ]
            },
            {
              title: "二班",
              expand: true,
              children: [
                {
                  title: "孙应龙",
                  checked: true
                },
                {
                  title: "贾守兵"
                }
              ]
            }
          ]
        }
      ],
      data2: [
        {
          title: "文件选择",
          expand: true,
          selected: true,
          children: [
            {
              title: "图片",
              expand: true,
              children: [
                {
                  title: "实验截图1.jpg"
                },
                {
                  title: "实验截图2.jpg"
                }
              ]
            },
            {
              title: "视频",
              expand: true,
              children: [
                {
                  title: "基础操作",
                  checked: true
                },
                {
                  title: "综合实验操作"
                }
              ]
            }
          ]
        }
      ],
      tableData: [
        {
          data: "按要求完成实验",
          termobj: "一班，二班",
          timeout: "2019-05-01 14:00:00——2019-05-29 16:00:00",
          file: "通过按钮添加",
          Resources: "通过按钮选择",
          operation: "删除操作"
        }
      ]
    };
  },
  methods: {
    handleCurrentChange() {},
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    open2(id) {
        console.log(id);
      this.$message({
        message: "下发成功",
        type: "success"
      });
    },
    open4() {
      this.$Message.error("删除成功");
    },
    ok() {
      this.$Message.info("已选择");
    },
    cancel() {
      this.$Message.info("重新选择");
      // 关闭之后的回调
    },
    addok() {
      this.$Message.info("添加成功");
    },
    addcancel() {
      this.$Message.info("添加失败");
    },
    LOERok() {
      this.$Message.info("选择成功");
    },
    LOERcancel() {
      this.$Message.info("选择失败");
    }
  },
  created() {
    // 加载实验模板列表
    templateList({
      offset: this.offset,
      limit: this.limit
    }).then(res => {
      (this.tableData = res.data.object),
        (this.taskLength = res.data.length),
        console.log(res);
    });
  }
};
</script>



<style lang="less" scoped>
@media screen and (min-width: 1200px) and (max-width: 1500px) {
  .tablebox {
    width: 1200px;
  }
}
@media screen and (min-width: 1500px) and (max-width: 1800px) {
  .tablebox {
    width: 1500px;
  }
}
@media screen and (min-width: 1800px) {
  .tablebox {
    width: 1800px;
  }
}
.box{
  margin:0 10px
}
.bottonbox {
  position: relative;
  margin-top: 20px;
  border: 1px solid #ccc;
  span {
    margin: 10px;
    margin-right: 80px;
  }
  .batch {
    margin: 10px 25px;
  }
  .Marking {
    margin: 10px 60px;
  }
  .search {
    float: right;
    position: absolute;
    top: 0;
    right: 10px;
    margin: 5px 10px;
  }
  .searchtext {
    position: absolute;
    top: 0;
    right: 100px;
  }
  .bottondel {
    position: absolute;
    top: 0;
    right: 320px;
  }
}
.search {
  float: right;
  position: absolute;
  top: 0;
  right: 10px;
  margin: 5px 10px;
}
.buttombox {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  font-weight: 700;
}
.el-date-picker {
}
</style>

