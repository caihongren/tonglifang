<template>
  <div class="box">
    <router-link to="/relayteacher/taskManagement">
      <el-button type="primary" size="small" icon="el-icon-back" style="margin-top:20px">返回</el-button>
    </router-link>
    <el-aside width="100%" border="true">
      <div style="height:50px" class="bottonbox">
        <span class="buttombox">任务编辑器</span>
        <!-- <el-button type="primary" icon="el-icon-search" class="search">新增任务</el-button> -->
      </div>
    </el-aside>
    <ul class="ul">
      <li class="li">说明</li>
      <li class="li">下发对象</li>
      <li class="li" style="width:28%">任务时间</li>
      <li class="li" style="width:17%">实验模板选择</li>

      <li class="li" style="width:14%;border-right:1px solid #ccc">操作</li>
    </ul>
    <ul class="ul">
      <li class="li">按要求完成任务</li>
      <li class="li">
        <el-button type="primary" @click="modal1 = true">选择</el-button>
      </li>
      <li class="li" style="width:28%">
        <el-date-picker
          v-model="value1"
          type="date"
          :picker-options="pickerOptions1"
          format="yyyy 年 MM 月 dd 日"
         
          placeholder="选择截止日期时间"
        ></el-date-picker>
      </li>
      <li class="li" style="width:17%">
        <template>
          <el-select v-model="addIssued.taskTemplateId" clearable placeholder="请选择">
            <el-option
              v-for="item in tableDataBox"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
      </li>
      <li class="li" style="width:14%;border-right:1px solid #ccc">
        <el-button type="primary" size="mini" @click="open2">下发</el-button>
        <el-button type="primary" size="mini" @click="open4">删除取消</el-button>
      </li>
    </ul>
    <el-dialog title="选择下发对象" :visible.sync="modal1" width="30%">
      <el-tree
        :data="students"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="getCheckedNodes">通过 node 获取</el-button> -->
        <el-button @click="modal1 = false">取 消</el-button>
        <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { Nxmission, templateList, getclass, formatDate } from "./../../API/api";
import { log } from "util";
export default {
  data() {
    return {
      value1: "",
      offset: 0,
      limit: 50,
      addIssued: {
        taskTemplateId: "",
        accountIds: [],
        annexIds: "",
        startTime: "",
        finishTime: ""
      },
      tableDataBox: [],
      tcourseId: "",

      modal1: false,
      modal2: false,
      modal3: false,

      defaultProps: {
        children: "accounts",
        label: "name"
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() +3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ],
         disabledDate(time) {
                    // console.log('111');
                    return time.getTime() < Date.now();
                }
      },

      students: []
    };
  },
  methods: {
   
    handleCurrentChange() {},
    open2() {
      // console.log(formatDate(this.value1[0]));
      //  下发时间为当前时间
      let finishTime=this.value1;
      // console.log(finishTime,formatDate(finishTime))
      if(finishTime==""){
        this.$message.error({
            message: "请选择下发时间",
            type: "warning"
          });
        return 
      }
      this.addIssued.startTime = formatDate(new Date().setTime(new Date().getTime() +3600 * 1000 * 8));
      this.addIssued.finishTime = formatDate(finishTime);
      // console.log(this.addIssued.startTime,this.addIssued.finishTime)
      // console.log(this.addIssued.accountIds.length);
      if (this.addIssued.accountIds.length > 0) {
        if (this.addIssued.taskTemplateId != "") {
          Nxmission(this.addIssued).then(res => {
            // console.log(res);
            this.$message({
              message: "下发成功",
              type: "success"
            });
            this.$router.push("/relayteacher/taskManagement");
          });
        } else {
          this.$message.error({
            message: "请选择实验模板",
            type: "warning"
          });
        }
      } else {
        this.$message.error({
          message: "请选择下发对象",
          type: "warning"
        });
      }
    },
    getCheckedNodes() {
      this.modal1 = false;
      // console.log(this.$refs.tree.getCheckedNodes());
      let list = this.$refs.tree.getCheckedNodes();
      let accountIds = [];
      for (let i = 0; i < list.length; i++) {
        // console.log(list[i]);
        if (list[i].accounts) {
        } else {
          accountIds.push(list[i].id);
        }
      }
      // console.log(accountIds);
      this.addIssued.accountIds = accountIds;
    },
    open4() {
      this.value1 = [];
      this.addIssued.accountIds = [];
      this.addIssued.taskTemplateId = "";
      this.$message.error("删除成功");
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
  mounted() {
    templateList({
      offset: this.offset,
      limit: this.limit
    }).then(res => {
      // console.log(res.data.object, "模板列表");

      this.tableDataBox = res.data.object;
    });
  },
  created() {
    let course = JSON.parse(sessionStorage.getItem("course"));
    this.courseId = course.id;
    // console.log(course);
    getclass({
      courseId: this.courseId
    }).then(res => {
      // console.log(res, "学生列表");
      this.students = res.data.object;
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
.box {
  width: 90%;
  margin: 5px 5%;
}
.bottonbox {
  position: relative;
  margin-top: 20px;
  border: 1px solid #ccc;
  margin: 20px 40px;

  border-radius: 5px;
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
.ul {
  width: 95%;
  height: 50px;
  margin: 0;
  .li {
    float: left;
    width: 20%;
    background-color: #ffffff;
    height: 60px;

    border: 1px solid #ccc;
    border-right: 0px solid black;
    text-align: center;
    line-height: 60px;
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

</style>

