<template>
  <div class="box" style=" margin: 5px 5%;">
    <router-link to="/relayteacher/task">
      <el-button type="primary" size="small" icon="el-icon-back" style="margin-top:20px">返回</el-button>
    </router-link>

    <el-aside width="100%" height border="true">

      <!-- task组件内部的操作属性 -->
      <div style="height:50px" class="bottonbox">
        <span class="buttombox">已下发任务清单</span>
        <el-button type="primary" size="mini">下发批阅</el-button>
        <el-button type="primary" size="mini" class="batch">批量下载实验报告</el-button>
        <el-button type="primary" size="mini">撤回</el-button>
        <router-link to="/task/Presentation">
          <el-button type="primary" size="mini" class="Marking">批阅报告</el-button>
        </router-link>
        <el-button type="primary" size="mini" class="details">详情</el-button>

        <!-- 搜索框 -->
        <el-button type="primary" icon="el-icon-delete" class="bottondel"></el-button>
        <el-autocomplete
          class="searchtext"
          v-model="state4"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
        ></el-autocomplete>
        <el-button type="primary" icon="el-icon-search" class="search">搜索</el-button>
      </div>

      <!-- 表格    后期动态渲染 -->
      <el-table
        ref="multipleTable"
        :data="tableData3"
        border
        tooltip-effect="dark"
        header-align="center"
        style="width: 1500px;border='1';cellspacing='0';cellpadding='0'"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="任务名称" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="stuobj" label="对象" width="150"></el-table-column>
        <el-table-column prop="LHtime" label="下发时间" width="180"></el-table-column>
        <el-table-column prop="term" label="任务期限" width="200"></el-table-column>
        <el-table-column prop="Sbnam" label="提交人数" width="150"></el-table-column>
        <el-table-column prop="explain" label="说明" width="150"></el-table-column>
        <el-table-column prop="requirement" label="报告要求" width="150"></el-table-column>
        <el-table-column prop="noRead" label="待阅报告" width="150"></el-table-column>
        <el-table-column prop="comment" label="下发评论" width="150"></el-table-column>
      </el-table>
    </el-aside>
  </div>
</template>


<script>

import {master} from '../../API/api'
export default {
  data() {
    return {
      restaurants: [],
      state4: "",
      timeout: null,
      taskExperimentId:'',
      tableData3: [
        {
          date: "1",
          stuobj: "一班",
          LHtime: "2019-05-10",
          term: "2019-05-12——2019-05-20",
          Sbnam: "50/60",
          explain: "按要求完成实验",
          requirement: "有",
          noRead: "0",
          comment: "是"
        },
        {
          date: "2",
          stuobj: "二班",
          LHtime: "2019-05-10",
          term: "2019-05-12——2019-05-20",
          Sbnam: "45/70",
          explain: "按要求完成实验",
          requirement: "",
          noRead: "0",
          comment: "是"
        },
      
      ],
      multipleSelection: []
    };
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    //搜索框加载内容
    loadAll() {
      return [
        { value: "三全鲜食（北新泾店）", address: "长宁区新渔路144号" },
        {
          value: "Hot honey 首尔炸鸡（仙霞路）",
          address: "上海市长宁区淞虹路661号"
        }
      ];
    },
    //搜索框
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    // 表格
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  created() {
    // 请求任务列表
    master({
        taskExperimentId:"{{task_experiment_id_0}}",
  offset:0,
  limit:10

    }).then(res=>{
      console.log(res,'任务列表')
    })
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  //创建前设置增加滚动条
beforeCreate () {
      // document.querySelector('body').setAttribute('style', 'overflow-y:scroll;background-color:#EEE9E9	')
      // document.querySelector('body').setAttribute('style', 'background-color:#ccc')
},
//销毁前清除滚动
beforeDestroy () {
      // document.querySelector('body').removeAttribute('style', 'overflow-y:scroll;')
},
};
</script>

<style lang="less" scoped>
// 操作属性的按钮
.box{
  width: 90%;
  margin: 5px 5%;

}
.bottonbox {
  position: relative;
  margin-top: 20px;
  border: 1px solid #ccc;
  span {
    margin: 10px;
    margin-right: 25px;
  }
  // 批量下载
  .batch {
    margin: 10px 40px;
  }
  // 批阅报告
  .Marking {
    margin: 10px 60px;
  }
  //搜索
  .search {
    float: right;
    position: absolute;
    top: 0;
    right: 10px;
    margin: 5px 10px;
  }
  .searchtext {
    position: absolute;
    top: 5px;
    right: 120px;
  }
  .bottondel {
    position: absolute;
    top: 5px;
    right: 340px;
  }
}

// 弹出框的样式

//详情按钮样式
.details {
  margin-right: 20px;
}
//已下发任务清单
.buttombox {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  font-weight: 700;
}
</style>

