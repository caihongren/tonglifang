<template>
  <div class="introduceBox">
    <!-- 下拉菜单 -->
    <el-row type="flex" class="row-bg">
      <!-- 左侧目录块 -->
      <el-col :span="3" class="leftCol">
        <div class="menu1">
          <el-button type="text" @click="getAllMaterials(), chapterReset()" size="mini" class=" Catalog-t">全部</el-button>
          <div class="chapter">
            <el-tree :data="data" node-key="id" :default-expanded-keys="expandedKeys" :expand-on-click-node="false" :props="defaultProps" ref="menuTree" :default-expand-all="true">
              <span class="custom-tree-node" :title="node.label" slot-scope="{ node }">
                <span @click="handleNodeClick(node)" class="menuContext">{{ node.data.section}}{{"."}}{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <!-- 右侧内容展示块 -->
      <el-col :span="21">
        <div class="right" id="right">
          <!-- 顶部文件操作按钮 -->
          <div class="operationButtons">
            <el-button type="primary" @click="fileDowload()" class="rename" size="mini" :loading="isdownload">下载</el-button>
          </div>

          <!-- 文件内容主体 -->
          <div class="fileContext">
            <!-- 文件罗列卡片 -->

            <div class="fileCard" v-for="item in fileArray" :key="item.id" align="center" @click="pitchOn(item.id)" @dblclick="preview(item.path)" @mouseover="fileCardMouseover(item.id)" @mouseout="fileCardMouseout(item.id)">
              <!-- 文件图标 -->
              <img :src="judge(item.path)" />
              <!-- 文件名 -->
              <span class="text" :title="item.name" :id="'span'+item.id" style="display:block;">{{ item.name }}</span>
              <!-- 遮罩层 -->
              <div :id="'bmbox'+item.id" align="left" v-bind:class="IsInArray(fileOperationArray, item.id) ? 'bmbox1' : 'bmbox'">
                <input type="checkbox" :id="'checkbox'+item.id" @change="fileCheckboxChange(item.id)" :checked="IsInArray(fileOperationArray, item.id)" />
                <!-- <div style="width:100px;height:60px;"></div> -->
              </div>
            </div>
            <!-- 文件预览失败警告框 -->
            <el-dialog title :visible.sync="previewVisible">
              <video id="player" width="100%" height="100%" controls>
                您的浏览器不支持HTML5
                <source :src="previewPath" />
                <!-- 提供默认的播放视频  -->
              </video>
            </el-dialog>
          </div>
          <div class="paging">
            <el-pagination @size-change="fileHandleSizeChange" @current-change="fileHandleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 30, 50, 100]" :page-size="nowPageSize" layout="total, sizes, prev, pager, next, jumper" :total="fileTotal"></el-pagination>
          </div>
        </div>
        <div class="filePreview" id="filePreview">
          <el-button type="primary" @click="cancelPreview()" size="mini" class="renReturname">返回</el-button>
          <iframe :src="pdfPreviewPath" class="iframe"></iframe>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  getModuleAndTrainingInner,//课程实训列表
  getModuleAndTrainingSelf,//我的实训列表
  get_resource_by_module, //根据模块获取资源
  get_resource_by_training, //根据实训获取资源
  get_resource_training_inner,//获取所有课程实训资源
  get_resource_training_self,//获取所有我的实训资源
  download //下载
} from "@/API/api";
let time = null;
import FileSaver from "file-saver";
export default {
  data() {
    return {
      data: [{ id: null, name: "" }], //章节目录数据
      expandedKeys: [], //默认展开的章节
      defaultProps: {
        children: "children",
        label: "label",
        section: "section"
      },
      isExpanded: false, //展开/关闭所有目录
      isdownload: false,
      node: "", //当前所在的章节
      fileArray: [],
      fileOperationArray: [], //文件多选框已选中文件id
      currentChapter: null,
      currentUnit: null,
      previewVisible: false, //是否显示文件预览弹出框
      previewPath: "", //预览文件路径
      pdfPreviewPath: "", //pdf预览路径
      fileTotal: 0, //分页文件总数
      nowCurrent: 0, //当前所在页
      nowPageSize: 30, //当前每页显示数量
      currentPage4: 1,
      chapterType: 1, //章，节，还是全不
      chapterResetId: "", //当前章节id
    };
  },
  methods: {
    //获取所有课程实训和我的实训(左侧目录)
    get_chaptersMy() {
      let dataBox = [];
      let index = 1;
      getModuleAndTrainingInner().then(res => {
        let obj = res.data.object;
        for (let i = 0; i < obj.length; i++) {
          let dataInner = {};
          dataInner.id = obj[i].moduleId;
          dataInner.label = obj[i].moduleName;
          dataInner.section = i + 1;
          dataInner.children = [];
          for (let j = 0; j < obj[i].trainings.length; j++) {
            let units = {};
            units.id = obj[i].trainings[j].id;
            units.label = obj[i].trainings[j].name;
            units.section = i + 1 + "." + (j + 1);
            dataInner.children.push(units);
          }
          index = i + 1;
          dataBox.push(dataInner);
        }

        getModuleAndTrainingSelf().then(res => {
          let obj = res.data.object;
          let dataInners = {
            id: '1',
            label: '我的实训',
            section: index + 1,
            children: []
          };
          for (let i = 0; i < obj.length; i++) {
            let dataMy = {};
            dataMy.id = obj[i].id;
            dataMy.label = obj[i].name;
            dataMy.section = i + 1;
            dataMy.children = [];
            dataInners.children.push(dataMy);
          }
          dataBox.push(dataInners);
          this.data = dataBox;
        });
      });
    },
    //获取所有课程实训和我的实训(右侧资源)
    getAllMaterials() {
      this.chapterType = 1;
      this.currentChapter = "";
      this.currentUnit = "";
      this.fileArray = [];//清空右侧资源
      this.getResourceTrainingInner();//获取所有课程实训
      this.getResourceTrainingSelf();//获取所有我的实训
      this.fileTotal = this.fileArray.length; //获取分页全部总数
    },
    //获取所有课程实训
    getResourceTrainingInner() {
      get_resource_training_inner({
      }).then(res => {
        for (var i = 0; i < res.data.object.length; i++) {
          this.fileArray.push({
            id: res.data.object[i].id,
            name: res.data.object[i].name,
            path: res.data.object[i].path
          });
        }
        this.fileTotal = this.fileArray.length; //获取分页全部总数
      })
    },
    //获取所有我的实训
    getResourceTrainingSelf() {
      get_resource_training_self({
      }).then(res => {
        for (var i = 0; i < res.data.object.length; i++) {
          this.fileArray.push({
            id: res.data.object[i].id,
            name: res.data.object[i].name,
            path: res.data.object[i].path
          });
        }
        this.fileTotal = this.fileArray.length; //获取分页全部总数
      })
    },
    //根据模块或实训获取资源
    handleNodeClick(node) {
      this.node = node;
      this.chapterReset();
      if (node.level == 1) {
        this.getResourceByModule(node.key);//根据模块获取资源
        this.currentChapter = node.parent.key;
        this.currentChapter = node.key;
        this.currentUnit = "";
      }
      if (node.level == 2) {
        this.getResourceByTraining(node.key); //根据实训获取资源
        this.currentChapter = node.parent.key;
        this.currentChapter = node.key;
        this.currentUnit = "";
      }
      this.clearFileOperation();//清空已选中文件
    },
    //根据模块获取资源
    getResourceByModule(moduleId) {
      get_resource_by_module({
        moduleId: moduleId,
      }).then(res => {
        if (res.data.code == 0) {
          this.fileArray = [];
          for (var i = 0; i < res.data.object.length; i++) {
            this.fileArray.push({
              id: res.data.object[i].id,
              name: res.data.object[i].name,
              path: res.data.object[i].path
            });
          }
          this.fileTotal = this.fileArray.length;
        }
      });
    },
    //根据实训获取资源
    getResourceByTraining(trainingId) {
      get_resource_by_training({
        trainingId: trainingId
      }).then(res => {
        if (res.data.code == 0) {
          this.fileArray = [];
          for (var i = 0; i < res.data.object.length; i++) {
            this.fileArray.push({
              id: res.data.object[i].id,
              name: res.data.object[i].name,
              path: res.data.object[i].path
            });
          }
          this.fileTotal = this.fileArray.length;
        }
      });
    },
    IsInArray(arr, value) {
      for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
          return true;
        }
      }
      return false;
    },
    //学习资料分页改变每页显示数量时触发此函数
    fileHandleSizeChange(val) {
      this.nowPageSize = val;
      if (this.chapterType == 1) {
        this.getAllMaterials(); //获取全部学习资料
      } else if (this.chapterType == 2) {
        this.getResourceByModule(this.chapterResetId);//根据模块获取资源
      } else if (this.chapterType == 3) {
        this.getResourceByTraining(this.chapterResetId); //根据实训获取资源
      }

    },
    //学习资料分页改变页码时触发此函数
    fileHandleCurrentChange(val) {
      this.nowCurrent = (val - 1) * this.nowPageSize;
      if (this.chapterType == 1) {
        this.getAllMaterials(); //获取全部学习资料
      } else if (this.chapterType == 2) {
        this.getResourceByModule(this.chapterResetId);//根据模块获取资源
      } else if (this.chapterType == 3) {
        this.getResourceByTraining(this.chapterResetId); //根据实训获取资源
      }
    },
    //清空已选中文件
    clearFileOperation() {
      for (var i = 0; i < this.fileOperationArray.length; i++) {
        document.getElementById(
          "checkbox" + this.fileOperationArray[i]
        ).checked = false;
        document.getElementById(
          "bmbox" + this.fileOperationArray[i]
        ).style.display = "none";
      }
      this.fileOperationArray = []; //清空已选中文件
    },
    //  下载 文件
    fileDowload() {
      if (this.fileOperationArray.length > 1) {
        this.$message({
          showClose: true,
          message: "只能下载一个文件",
          duration: 1000
        });
      } else if (this.fileOperationArray.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择文件",
          duration: 1000
        });
      } else {
        for (var i = 0; i < this.fileOperationArray.length; i++) {
          for (var j = 0; j < this.fileArray.length; j++) {
            let item = this.fileArray[j];
            if (this.fileOperationArray[i] == item.id) {
              this.Dowload(item.path, item.name);
            }
          }
        }
        this.clearFileOperation();
      }
    },
    Dowload(src, name) {
      this.$message({
        showClose: true,
        message: "正在下载。。。请稍后",
        duration: 2000
      });
      // return;
      this.isdownload = true;
      download({
        name: name,
        url: src
      }).then(res => {
        this.isdownload = false;
        this.$message({
          showClose: true,
          message: "下载成功！",
          duration: 1000,
          type: "success"
        });
        const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, name);
      });
    },
    //鼠标移入文件卡片调用此方法
    fileCardMouseover(fileId) {
      if (!this.fileOperationArray.includes(fileId)) {
        //判断此文件卡片是否被勾选
        document.getElementById("bmbox" + fileId).style.display = "block";
      }
    },
    //鼠标移出文件卡片调用此方法
    fileCardMouseout(fileId) {
      if (!this.fileOperationArray.includes(fileId)) {
        //判断此文件卡片是否被勾选
        document.getElementById("bmbox" + fileId).style.display = "none";
      }
    },
    //选中或去掉某个多选框时调用此方法
    fileCheckboxChange(value) {
      clearTimeout(time);
      time = null;
      if (document.getElementById("checkbox" + value).checked == true) {
        document.getElementById("bmbox" + value).style.display = "block";
        this.fileOperationArray.push(value);
      } else if (document.getElementById("checkbox" + value).checked == false) {
        document.getElementById("bmbox" + value).style.display = "none";
        this.fileOperationArray.splice(
          this.fileOperationArray.indexOf(value),
          1
        );
      } else {
      }
    },
    // 单击图片选中
    pitchOn(value) {
      if (time != null) {
        clearTimeout(time);
        return;
      }
      time = setTimeout(() => {
        document.getElementById("checkbox" + value).click();
        time = null;
      }, 200);
    },
    // 章节重置
    chapterReset() {
      this.nowCurrent = 0;
      this.nowPageSize = 30;
    },
    // 判断图片来源
    judge(url) {
      let source = url.substring(url.lastIndexOf(".") + 1, url.length);
      if (source == "PDF" || source == "pdf") {
        return require("./../../image/pdf.png");
      } else if (
        source == "DOCX" ||
        source == "docx" ||
        source == "DOC" ||
        source == "doc"
      ) {
        return require("./../../image/word.png");
      } else if (
        source == "ppt" ||
        source == "pptx" ||
        source == "PPT" ||
        source == "PPTX"
      ) {
        return require("./../../image/ppt.png");
      } else if (
        source == "AVI" ||
        source == "avi" ||
        source == "MOV" ||
        source == "QT" ||
        source == "ASF" ||
        source == "RM" ||
        source == "NAVI" ||
        source == "DivX" ||
        source == "MPEG" ||
        source == "MPG" ||
        source == "DAT" ||
        source == "mp4" ||
        source == "wmv"
      ) {
        return require("./../../image/video.png");
      } else if (
        source == "gif" ||
        source == "jpg" ||
        source == "jpeg" ||
        source == "png" ||
        source == "tif"
      ) {
        return require("./../../image/picture.png");
      } else if (source == "rar" || source == "zip" || source == "7z") {
        return require("./../../image/rar.png");
      } else {
        return require("./../../image/txt.png");
      }
    },
    //文件预览
    preview(path) {
      time = null;
      let source = path.substring(path.lastIndexOf(".") + 1, path.length);
      if (
        source == "AVI" ||
        source == "avi" ||
        source == "MOV" ||
        source == "QT" ||
        source == "ASF" ||
        source == "RM" ||
        source == "NAVI" ||
        source == "DivX" ||
        source == "MPEG" ||
        source == "MPG" ||
        source == "DAT" ||
        source == "mp4" ||
        source == "wmv"
      ) {
        // this.previewVisible = true;
        var cmd =
          // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
          "{'opcode':7,'path':'" + path + "'}";
        wfapp.start(cmd);

        this.previewPath = path;
      } else if (
        source == "ppt" ||
        source == "pptx" ||
        source == "PPT" ||
        source == "PPTX"
      ) {
        this.$message({
          showClose: true,
          message: "暂不支持PPT文档在线预览,请下载!",
          type: "warning",
          duration: 1000
        });
      } else if (
        source == "DOCX" ||
        source == "docx" ||
        source == "DOC" ||
        source == "doc"
      ) {
        this.$message({
          showClose: true,
          message: "暂不支持word文档在线预览,请下载!",
          type: "warning",
          duration: 1000
        });
      } else if (source == "rar" || source == "zip" || source == "7z") {
        this.$message({
          showClose: true,
          message: "暂不支持压缩文件在线解压，请下载!",
          type: "warning",
          duration: 1000
        });
      } else if (source == "PDF" || source == "pdf") {
        this.pdfPreviewPath = path;
        document.getElementById("right").style.display = "none";
        document.getElementById("filePreview").style.display = "block";
      } else if (
        source == "gif" ||
        source == "jpg" ||
        source == "jpeg" ||
        source == "png" ||
        source == "tif"
      ) {
        this.pdfPreviewPath = path;
        document.getElementById("right").style.display = "none";
        document.getElementById("filePreview").style.display = "block";
      } else {
        this.$confirm("文件暂不支持，请下载", "提示", {
          confirmButtonText: "确定",
          type: "info"
        }).then(() => { });
      }
    },
    //取消文件预览
    cancelPreview() {
      document.getElementById("right").style.display = "block";
      document.getElementById("filePreview").style.display = "none";
    },

  },
  mounted() {
    // //判断学生教师  字段
    // let role = JSON.parse(sessionStorage.getItem("user")).role;
    // if (role == "teacher") {
    //   this.agentData.mode = 'task_experiment_exercise_template_editor'
    // }
    // else {
    //   this.agentData.mode = 'task_experiment_exercise_instance_editor'
    // }
  },
  created() {
    this.get_chaptersMy(); //获取所有课程实训和我的实训
    this.getAllMaterials(); //获取全部资源
  },
};
</script>
<style lang="less" scoped>
.introduceBox {
  height: 100%;
  width: 100%;
  background-color: #f1f1f1;
  .row-bg {
    height: 100%;
    .leftCol {
      min-width: 250px;
      overflow: hidden;
      background-color: #313131;
      .grid-content {
        margin-top: 10px;
        background-color: #313131;
        .sousuo {
          position: relative;
          line-height: 30px;
          height: 35px;
          padding-left: 25px;
          padding-right: 20px;
          border: none;
          img {
            height: 22px;
            right: 30px;
            top: 5px;
            position: absolute;
          }
        }
      }
      .menu1 {
        background-color: #313131;
        position: relative;
        height: 88%;
        min-width: 360px;
        overflow-y: scroll;
        .Catalog-t {
          width: 65px;
          font-weight: 700;
          color: #fff;
          border: none;
          font-size: 18px;
          margin-left: 10px;
          :hover {
            cursor: pointer;
            overflow: hidden;
          }
        }
        .chapter {
          .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
            .menuContext {
              width: 191px;
              overflow: hidden;
              color: #dddd;
            }
          }
        }
      }
    }
    .right {
      height: 95%;
      width: 97.6%;
      background-color: #fff;
      margin-top: 20px;
      margin-left: 20px;

      .operationButtons {
        padding: 10px 60px;
        .rename {
          margin-right: 10px;
          background-color: #808080;
          border: none;
          border-radius: 0px;
        }
      }
      .fileContext {
        width: 102%;
        height: 76%;
        overflow: auto;
        .fileCard {
          float: left;
          width: 115px;
          height: 120px;
          cursor: pointer;
          position: relative;
          margin-top: 35px;
          .bmbox {
            width: 100px;
            height: 70px;
            background: #dddddd;
            background: rgba(67, 67, 71, 0.116);
            margin-left: 9px;
            display: none;
            position: absolute;
            top: -10px;
          }
          .bmbox1 {
            width: 100px;
            height: 70px;
            background: #dddddd;
            background: rgba(67, 67, 71, 0.116);
            margin-left: 9px;
            position: absolute;
            top: -10px;
          }
          img {
            width: 50px;
            height: 70px;
            display: block;
            padding-bottom: 20px;
          }
        }
      }

      .fileContext {
        width: 102%;
        height: 76%;
        overflow: auto;
        padding-left: 30px;
        .fileCard {
          float: left;
          width: 125px;
          height: 120px;
          cursor: pointer;
          position: relative;
          margin-top: 35px;
          img {
            width: 50px;
            height: 70px;
            display: block;
            padding-bottom: 20px;
          }
          .text {
            width: 75px;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            height: 40px;
            table-layout: fixed;
          }
          .bmbox {
            width: 100px;
            height: 70px;
            background: #dddddd;
            background: rgba(67, 67, 71, 0.116);
            display: none;
            position: absolute;
            top: -10px;
            margin-left: 9px;
          }
          .bmbox1 {
            width: 100px;
            height: 70px;
            background: #dddddd;
            background: rgba(67, 67, 71, 0.116);
            position: absolute;
            top: -10px;
            margin-left: 9px;
          }
        }
      }
      .paging {
        text-align: center;
        margin-right: 30%;
        margin: 50px;
      }
    }
    .filePreview {
      background-color: #fff;
      width: 95%;
      height: 95%;
      display: none;
      margin-left: 20px;
      margin-top: 20px;
      overflow: hidden;
      padding-top: 10px;
      padding-left: 20px;
      padding-right: 50px;
      .renReturname {
        background-color: #808080;
        border: none;
        border-radius: 0px;
      }
      .iframe {
        height: 95%;
        width: 102%;
        border: none;
      }
    }
  }
}
</style>
<style>
.introduceBox .el-tree {
  background-color: white;
}
.introduceBox .sousuo .el-input__inner {
  background-color: #282828;
  border-radius: 0px;
  border: none;
  color: #fff;
}
.introduceBox .chapter .el-tree {
  background-color: #313131;
}
.introduceBox .el-tree-node__content:hover {
  background-color: #282828;
}

.introduceBox .el-tree-node:focus > .el-tree-node__content {
  background-color: #282828 !important;
}
</style>
