<template>
  <div class="box" style="padding:20px">
     
     <h3>附件材料</h3>
    <!-- <router-link to="/relay/simulation">
      <div class="el-icon-error"></div>
    </router-link> -->
    <template>
  <el-table
    :data="annexList"
    border
    style="width: 95%">
    <el-table-column
     fixed
      type="index"
      label="序号"
      width="120">
    </el-table-column>
    <el-table-column
     
      prop="updatedAt"
      label="日期"
      :formatter="formatSex"
      sortable
      width="200">
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称"
      width="250">
    </el-table-column>

    <el-table-column
      fixed="right"
      label="操作"
     >
      <template slot-scope="scope">
        <el-button @click="download(scope.row)" type= "primary">下载</el-button>
        
      </template>
    </el-table-column>
  </el-table>
</template>
  </div>
</template>

<script>
import {annex,formatDate} from '../../API/api';
import { promises } from "fs";
import { parse } from "path";
export default {
  data(){
    return{
      id:this.$route.params.id,
      annexList:[],
      length:"",

    }
  },
  methods: {
     // 下载文件
    download(row) {
      let data = row.path;
      // window.location.href = this.downloadSrc;
      // window.open(this.downloadSrc, '_blank'); // 新开窗口下载
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.target = "_Blank";
      link.href = url;
      // 获取文件名
      // download 属性定义了下载链接的地址而不是跳转路径
      link.setAttribute("download", row.name);
      document.body.appendChild(link);
      link.click();
    },
    handleClick(id){

    },
    formatSex(row){
    //  return row.updatedAt
      return formatDate(row.updatedAt)
      
    },
   
    
    
  },
  created() {
      annex({
          taskExperimentId:this.id,
      }).then(res=>{
          this.annexList=res.data.object
      })
  },
}
</script>


<style lang="less" scoped>
    .box {
      width: 95%;
      // height: 200px;
      border: 1px solid pink;
      height: 95%;
    }
</style>

