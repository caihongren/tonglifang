<template>
    <div class="coursePractice">
        <div class="coursePractice-top">
            <p>
                实训类型：
                <el-select v-model="selectform" slot="prepend" placeholder="请选择类型" @change="coursePractice()">
                    <el-option label="全部" value="all"></el-option>
                    <el-option :label="item.name" :value="item.id" v-for="(item) in trainingType" :key="item.id"></el-option>
                </el-select>
            </p>
            <div class="sousuo">
                <el-input placeholder="请输入要搜索的实训" v-model="search" class="input-with-select bottom" @keyup.enter.native="nowSearch()">
                    <el-button slot="append" class="el-icon-search" @click="nowSearch()"></el-button>
                </el-input>
            </div>
        </div>
        <div class="coursePractice-botton">
            <el-table :data="tableDatafalse" stripe :header-cell-style="{background:'#ebeffb'}" :default-sort="{prop:'startTime', order: 'descending'}" class="tabletop" :row-class-name="tableRowClassName">
                <el-table-column fixed label="序号" type="index" width="50"></el-table-column>
                <el-table-column prop="name" label="实训名称" sortable min-width="240"></el-table-column>
                <el-table-column label="教学模式" min-width="50">
                    <template slot-scope="scope">
                        <el-button @click="coachExamination(scope.row,'teaching')" type="text" size="medium" style="font-size:15px;" v-if="scope.row.teaching==true?true:false">打开教学</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="练习模式" min-width="50">
                    <template slot-scope="scope">
                        <el-button @click="coachExamination(scope.row,'exercise')" type="text" size="medium" style="font-size:15px;" v-if="scope.row.practice==true?true:false">打开练习</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="考核模式" min-width="50">
                    <template slot-scope="scope">
                        <el-button @click="coachExamination(scope.row,'examine')" type="text" size="medium" style="font-size:15px;" v-if="scope.row.exam==true?true:false">打开考核</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="下发日期" sortable :formatter="formatSex" min-width="70"></el-table-column>
                <el-table-column prop="finishTime" label="截止时间" :formatter="finishTime" min-width="70"></el-table-column>
                <el-table-column prop="statu" label="提交状态" min-width="50" :formatter="completionStatusc"></el-table-column>
            </el-table>
        </div>
        <div style="margin:50px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
        </div>
    </div>
</template>
<script>
import {
    formatDate, // 时间格式转换
    get_training_module, //获取实训模块
    get_training_type, //获取实训类型
    getTaskByStudent, // 获取课程实训列表
} from "@/API/api";
export default {
    data() {
        return {
            trainingModule: [],//实训模块
            trainingType: [],//实训类型
            selectform: 'all',
            addform: {
                type: "",
                name: "",
                typeId: "",
                expTypeId: ""
            },
            search: "",//搜索
            offset: 0,
            limit: 10,
            length: 0,
            currentPage: 1,
            tableDatafalse: []
        }
    },
    methods: {
        completionStatusc(row, ) {
            if (row.statu == "new") {
                return "未开始";
            } else if (row.statu == "save") {
                return "进行中";
            } else if (row.statu == "submit") {
                return "已提交";
            } else if (row.statu == "approved") {
                return "已批阅";
            } else if (row.statu == "expired") {
                return "已终止";
            }
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2 !== 0) {
                return 'warning-row';
            } else if (rowIndex % 2 == 0) {
                return 'success-row';
            }
            return '';
        },
        //获取实训类型
        obtainTrainingType() {
            get_training_type().then(res => {
                this.trainingType = res.data.object;
            });
        },
        //鼠标失焦
        Lose() {
            this.coursePractice()
        },
        //搜索
        nowSearch() {
            this.coursePractice();
        },
        // 获取课程实训列表
        coursePractice() {
            getTaskByStudent({
                innerr: false, //true 课程实训  false 我的实训
                trainingTypeId: this.selectform == 'all' ? null : this.selectform, // 类型id  不选传null
                trainingSearch: this.search, // 查找内容 不选传null
                offset: this.offset,
                limit: this.limit
            }).then(res => {
                this.length = res.data.length;
                this.tableDatafalse = res.data.object;
            });
        },
        handleSizeChange(val) {
            this.limit = val;
            this.coursePractice();
        },
        handleCurrentChange(val) {
            this.offset = (val - 1) * this.limit;
            this.coursePractice();
        },
        coachExamination(row, type) {
            let exam = row.exam;
            let practice = row.practice;
            let teaching = row.teaching;
            this.$router.push({
                name: "/relay/study/experimentDetails",
                params: {
                   id: row.trainingId,
          accountTaskId:row.accountTaskId,
                    name: row.name,
                    type: type,
                    teaching: teaching,
                    examine: exam,
                    practice: practice,
                    isteacher: false,
                }
            });

        },
        //时间格式转换
        formatSex(row) {
            return formatDate(row.startTime);
        },
        finishTime(row) {
            return formatDate(row.finishTime);
        },
    },
    created() {
        this.obtainTrainingType();
        this.coursePractice(); // 加载课程实训列表
    }
}
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
.el-table .warning-row {
  background: #f7faff;
}
</style>


