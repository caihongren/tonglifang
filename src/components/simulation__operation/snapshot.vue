<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="序号" width="150" fixed type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="updatedAt" label="实验时间" width="500">
        <template slot-scope="scope">{{scope.row.updatedAt|dateformat}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            class="classbtn"
            @click="deletecls(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        @current-change="currentPage_change"
        :total="total"
        :page-size="limit"
      ></el-pagination>
    </div>
  </div>
</template> 
<script>
import { snalist,snadel } from "@/API/api.js";
import { log } from "util";
export default {
  data() {
    return {
      derivecls: [],
      updataclsid: "",
      update: false,
      add: true,
      classInline: {
        classother: "1"
      },
      centerDialogVisible: false,
      tableData: [],
      total: 5,
      limit: 3,
      offset: 0,
      // taskExperimentId: this.$route.params.id,
      id: this.$route.params.id,
      // b5dfb727-3d48-4eb4-864a-fb3fad80ff57
    };
  },
  methods: {
    // 定义函数
    showclass(offset, limit, tableData, total) {},
    // 分页功能
    currentPage_change(offset) {
      this.offset = offset;
      this.showclass(this.offset, this.limit, this.tableData, this.total);
    },
    // 删除快照
    // deletecls(id){
    //    this.$confirm('你确定要删除', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     })
    //     .then(() => {
        //  snadel(id).then(res=>{
        //    if(res.data.status==200){
        //       this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //   });
          //  this.showclass(this.offset,this.limit,this.tableData,this.total)
          //  }
          //  else{
          //     this.$message({
          //     type: 'error',
          //     message: '删除失败!'
          // });
          //  }
    //      })
    //     }).catch(() => {
    //         this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       });
    //     });
    // },
    // 序号
    indexMethod(index) {
      return index + 1 + (this.offset) * this.limit;
    }
  },
  created() {
    snalist({
      taskExperimentId: this.id,
      offset: this.offset,
      limit: this.limit
    }).then(res => {
      console.log(res.data, 5555555555555);
      this.id=res.data.object[0].id;
      this.tableData = res.data.object;
    });
  }
};
</script>







<style lang="less" scoped>
.snabanner {
  width: 100%;
  height: 100px;
  line-height: 5px;
}
.el-table-column {
  text-align: center;
}
</style>



