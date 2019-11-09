<template>
  <div class="box"  style="margin:20px;padding:20px">
    <div class="headline">
      <el-row type="flex" class="row-bg" justify="space-between">
        <!-- 二维码 -->
        <el-col :span="2">
          <!-- <div class="grid-content bg-purple lift">
            <img src alt="二维码加载中">
          </div> -->
        </el-col>
        <!-- 标题 -->
        <el-col :span="14">
          <div class="grid-content bg-purple-light">
            <p class="text">{{name}}{{pdfType==true?'':'(暂时不支持此类文件在线浏览，请下载)'}}</p>
            <!-- <p>{{pdfPath}}</p> -->
          </div>
        </el-col>
        <!-- 下载 -->
        <el-col :span="2">
          <div class="grid-content bg-purple right">
            <el-button type="primary" @click="download(pdfPath)">下载</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <iframe src="http://192.168.2.223:8081/static/advising/7a403d640a24426a85f00d8f96cf3c68实训二：电机点动控制实训指导书.pdf" style="width:100%;height:100%" ></iframe>
   -->
  <iframe :src="pdfPath" class="iframe" style="width:100%;height:100%" ></iframe>
  
  
  </div>

  <!-- v-if="pdfType" -->
</template>


<script>
import { guidelist, demo, snalist,fileDownload } from "../../API/api";
import { promises } from "fs";
import { parse } from "path";

export default {
  data() {
    return {
      id: this.$route.params.id,
      name: "实训指导",
      pdfId: "",
      pdfPath:'',
      pdfType:true,
    };
  },
  methods: {
   
     // 下载文件
    // download(src) {
    //   let data = src;

    //   if (!data) {
    //     return;
    //   }
    //   let courseUrl = "";
    //   if (JSON.parse(sessionStorage.getItem("course"))) {
    //     courseUrl = JSON.parse(sessionStorage.getItem("course")).url;
    //   }
    //   const fileName = this.name;
    //   let url = courseUrl + "/download_test?url=" + data + "&name=" + fileName;
    //   const elink = document.createElement("a");
    //   // elink.download = fileName;
    //   elink.style.display = "none";
    //   elink.href = url;
    //   document.body.appendChild(elink);
    //   elink.click();
    //   URL.revokeObjectURL(elink.href); // 释放URL 对象
    //   document.body.removeChild(elink);
    // },
     download(src,name){
           fileDownload({
              // method: "post",
              responseType: "blob",
              // url:`${baseUrl}/app/party-event/statistics-export?id=`+this.eventId,
              // timeout: 10000,
              // withCredentials: false //跨域
              name:'demo.pdf',
              path:"http://192.168.2.200:8080/creatorcourse/download_test?url=http://192.168.2.200:8080/creatorcourse/static/report/e9150eb0-7ff8-4b66-8e63-6a665f959d78.docx&name=实训七报告模板 .docx"
              // headers: {'Content-Type': 'application/json;charset=UTF-8'},
            }).then(res => {
              // if (res.status == 200) {
              //   const link = document.createElement("a");
              //   let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
              //   link.style.display = "none";
              //   link.href = URL.createObjectURL(blob);
              //   let num = "";
              //   for (let i = 0; i < 10; i++) {
              //     num += Math.ceil(Math.random() * 10);
              //   }
              //   link.setAttribute("download", "图例数据" + num + ".xls");
              //   document.body.appendChild(link);
              //   link.click();
              //   document.body.removeChild(link);
              // }
          });

      },
    type(puah){

    },

  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        this.id = this.$route.params.id;
        guidelist({
          taskExperimentId: this.id
        }).then(res => {
          this.name = res.data.object.name;
          this.pdfId=res.data.object.id;
      let path=res.data.object.path
       this.pdfPath=path
      if(this.pdfPath.indexOf('pdf')!=-1){
          return this.pdfType=true;
      }else{
          return this.pdfType=false;
      }
        });
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    guidelist({
      taskExperimentId: this.id
    }).then(res => {
      this.name = res.data.object.name;
      this.pdfId=res.data.object.id;
      let path=res.data.object.path
       this.pdfPath=path
      if(this.pdfPath.indexOf('pdf')!=-1){
          this.pdfType=true;
      }else{
          this.pdfType=false;
      }
    });
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 95%;
  height: 760px;
  border: 1px solid black;
  margin: 0 1%;
  
}
.headline {
  width: 96%;

  padding: 0 2%;
  height: 100px;
  background-color: pink;
  .lift {
    width: 80px;
    height: 80px;
    margin: 8px;
    border: black 1px solid;
    .img {
      width: 100%;
      height: 100%;
    }
  }
  .text {
    width: 100%;
    line-height: 100px;
    height: 100px;
    text-align: center;
    font-size: 30px;
    margin: 0;
  }
  .right {
    padding: 30px;
  }
}
p {
  white-space: nowrap;
  // 文本溢出显示省略号
  text-overflow: ellipsis;
  // 溢出的部分隐藏
  overflow: hidden;
}
</style>

