<template>
  <div class="box" style=" width: 96%;margin:0 2%">
    <div class="headline">
      <el-row type="flex" class="row-bg" justify="space-between">
        <!-- 二维码 -->
        <el-col :span="2">
          <div class="grid-content bg-purple right">
            <!-- <el-button type="primary" @click="getback()">返回</el-button> -->
          </div>
        </el-col>
        <!-- 标题 -->
        <!-- <el-col :span="14">
          <div class="grid-content bg-purple-light">
            <p class="text">{{name}}{{pdfType==true?'':'(暂时不支持此类文件在线浏览，请下载)'}}</p> -->
            <!-- <p>{{pdfPath}}</p> -->
          <!-- </div>
        </el-col> -->
        <!-- 下载 -->
        <!-- <el-col :span="2">
          <div class="grid-content bg-purple right">
            <el-button type="primary" @click="download(pdfPath)">下载</el-button>
          </div>
        </el-col> -->
      </el-row>
    </div>
    <!-- <iframe src="http://192.168.2.223:8081/static/advising/7a403d640a24426a85f00d8f96cf3c68实训二：电机点动控制实训指导书.pdf" style="width:100%;height:100%" ></iframe>
    -->
    <iframe :src="pdfPath" class="
    
    " style="width:100%;height:99%"></iframe>
  </div>

  <!-- v-if="pdfType" -->
</template>


<script>
import { guidelist, demo, snalist, download } from "../API/api";
import { promises } from "fs";
import { parse } from "path";

export default {
  data() {
    return {
      id: "",
      name: "实训指导",
      pdfId: "",
      pdfPath: "",
      pdfType: true,
      changeFlageEdit: true,
      sourcePath: "",
      tableData: []
    };
  },
  props: {
    isChangeFlageEdit: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 下载文件
    download(src) {
      let data = src;
      if (!data) {
        return;
      }
      let courseUrl = "";
      if (JSON.parse(sessionStorage.getItem("course"))) {
        courseUrl = JSON.parse(sessionStorage.getItem("course")).url;
      }
      const fileName = this.name;
      let url = courseUrl + "/download_test?url=" + data + "&name=" + fileName;
      const elink = document.createElement("a");
      // elink.download = fileName;
      elink.style.display = "none";
      elink.href = url;
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    },
    
    type(puah,name) {
      this. gopdf()
    },
    getback() {
      this.$router.push(this.sourcePath);
    },

    // 详情页面外部界面介入函数
    goExamine(name, path) {
      let examine = {};
      examine.sourcePath = this.$route.path;
      examine.name = name;
      examine.path = path;
      sessionStorage.setItem("examine", JSON.stringify(examine));
      let user = JSON.parse(sessionStorage.getItem("user"));
      if (user.role == "teacher") {
        this.$router.push("/relayteacher/Examine");
      } else if (user.role == "student") {
        this.$router.push("/relay/Examine");
      } else {
      }
    },
    // pdf来源
    gopdf() {
      let examine = JSON.parse(sessionStorage.getItem("examine"));
      this.name = examine.name;
      this.sourcePath = examine.sourcePath;
      this.pdfPath = examine.path;
      let url = this.pdfPath;
      let source = url.substring(url.lastIndexOf(".") + 1, url.length);

      if (
        source == "gif" ||
        source == "jpg" ||
        source == "jpeg" ||
        source == "png" ||
        source == "tif" ||
        source == "PDF" ||
        source == "pdf"
      ) {
        this.pdfType = true;
      } else {
        this.pdfType = false;
      }
    }
  },
  watch: {
    changeFlageEdit: function(newValue) {
       this.gopdf();
    }
  },
  mounted() {
    this.gopdf();
  },
  created() {
    this.gopdf();
    this.changeFlageEdit = this.isChangeFlageEdit;
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 95%;
  height: 97%;
  border: 1px solid black;
  margin: 0 2%;
}
.headline {
  width: 96%;

  padding: 0 2%;
  height: 0px;
  background-color: #ccc;
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

