<template>
  <div class="Presentation">
    <div class="taskname">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple">任务开始时间：</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">任务截止时间：</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">总人数：</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">已提交人数：</div>
        </el-col>
      </el-row>
    </div>
    <el-container style="height:100%">
      <el-aside class="asidebox" width="200px">
        <el-col :span="24">
          <el-menu
            :default-active="String(sumber)"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item-group
              :title="itembox.name"
              v-for="(itembox,index) in student"
              :key="index"
            >
              <el-menu-item
                style="height: 40px;line-height: 40px;"
                @click="sumber=item.index,open(item)"
                v-bind:index=" String(item.index)"
                v-for="(item) in itembox.list"
                :key="item.index"
              >{{item.name}}</el-menu-item>
            </el-menu-item-group>
            <!-- <el-menu-item
              style="height: 40px;line-height: 40px;"
              @click="sumber=index,open(item)"
              v-bind:index=" String(index)"
              v-for="(item,index) in 100"
              :key="index"
            >选项{{index}}</el-menu-item>-->
          </el-menu>
        </el-col>
      </el-aside>
      <!-- main内容部分 -->
      <el-container>
        <el-main style="padding:3px 20px">
          <div class="mainbox">
            <div class="browse">{{name}}</div>
            <div class="pdf">
              <div class="content">
                <iframe :src="pdfPath" class="iframe" style="width:100%;height:95%"></iframe>
              </div>
            </div>
            <div class="left" @click="switchover(-1)">左</div>
            <div class="right" @click="switchover(1)">右</div>
          </div>
        </el-main>
        <el-aside width="300px">
          <div style="margin: 20px;">仿真实验题</div>
          <div style="margin: 20px;">
            <el-table :data="row.tasks" style="width: 100%" border>
              <el-table-column prop="name" label="名称" min-width="150"></el-table-column>

              <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                  <el-button @click="look(scope.row)" type="text" size="small">查看</el-button>
                  <el-button type="text" size="small" @click="download()">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div style="margin: 20px;">附件</div>
          <div style="margin: 20px;">
            <el-table :data="row.accessory" style="width: 100%" border>
              <el-table-column prop="name" label="名称" min-width="150"></el-table-column>

              <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                  <el-button @click="preview()" type="text" size="small">查看</el-button>
                  <el-button type="text" size="small" @click="download()">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin: 20px;">批阅</div>
          <div style="margin: 20px;">
            <el-input type="textarea" :rows="2" placeholder="请输入评语" v-model="addfrom.remark"></el-input>
          </div>
          <div style="margin: 20px;">
            <span style="margin-left: 20px;">评分：</span>
            <el-input v-model="addfrom.grade" placeholder="请输入评分" style="width:50%"></el-input>
          </div>
          <div style="margin:20px;padding-bottom: 100px;">
            <el-button
              type="primary"
              size="mini"
              style="width:100%;height:50px"
              @click="readOver"
            >批阅</el-button>
          </div>
        </el-aside>
      </el-container>
    </el-container>


      <!-- 文件预览失败警告框 -->
            <el-dialog title :visible.sync="previewVisible">
              <video id="player" width="100%" height="100%" controls>
                您的浏览器不支持HTML5
                <source :src="previewPath">
                <!-- 提供默认的播放视频  -->
              </video>
            </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: " 彩虹一夏的实验报告",
      textarea: "",
      Fractions: "90",
      previewVisible:false,
      Presentation: {
        start: "05/05/13:10",
        over: "05/05/15:10",
        Submission: "点击提交"
      },
      sumber: 2,
      student: [
        {
          name: "1班",
          id: "",
          list: [
            {
              name: "1",
              id: "",
              index: 1
            },
            {
              name: "2",
              id: "",
              index: 2
            },
            {
              name: "3",
              id: "",
              index: 3
            },
            {
              name: "4",
              id: "",
              index: 4
            }
          ]
        },
        {
          name: "2班",
          id: "",
          list: [
            {
              name: "小明",
              id: "",
              index: 5
            },
            {
              name: "小红",
              id: "",
              index: 6
            },
            {
              name: "小城",
              id: "",
              index: 7
            },
            {
              name: "大黄",
              id: "",
              index: 8
            }
          ]
        }
      ],
      pdfPath:'http://192.168.2.223:10501/static/material/f092c344-fe1f-41d8-8e8f-75bfef7c2840电机拖动与控制.pdf',
      row: {
        name: "实验报告",
        pdfPath:
          "http://192.168.2.223:10501/static/material/f092c344-fe1f-41d8-8e8f-75bfef7c2840电机拖动与控制.pdf",
        tasks: [
          {
            name: "三维实际",
            path: "dawdada",
            id: "dadada",
            type: ""
          },
          {
            name: "二维demo",
            path: "dawdada",
            id: "dadada",
            type: ""
          }
        ],
        accessory: [
          {
            name: "实验报告",
            path: "dawdada",
            id: "dadada",
            type: ""
          },
          {
            name: "实验指导书",
            path: "dawdada",
            id: "dadada",
            type: ""
          },
          {
            name: "视屏文件",
            path: "dawdada",
            id: "dadada",
            type: ""
          }
        ]
      },
      addfrom: {
        grade: "",
        remark: ""
      },

      // 2D3D信息
      dimensionality: {
        dimensionality: "2D",
        name: "",
        type: "",
        id: "",
        look: false
      },
      tasks: {
        id: "",
        name: "",
        path: "",
        type: "",
        look: false
      }
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 切换学生的pdf
    switchover(sum) {
      if (this.sumber == 1 && sum < 0) {
        this.sumber = 1;
      } else {
        this.sumber += sum;
      }
    },
    // 打开学生的pdf
    open(row) {
      console.log(row);
    },
    // 批阅
    readOver() {
      if (!Number.isInteger(this.addfrom.grade)) {
        this.addfrom.grade = "";
        this.$message.error("请输入正确的数字评分");
      }
    },
       //文件预览
    preview(path) {
      if(!path){
          this.$message.error({
          message: "无效路径"
        });
        return;
      }
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
        this.$message("暂不支持PPT文档在线预览,请下载!");
      } else if (
        source == "DOCX" ||
        source == "docx" ||
        source == "DOC" ||
        source == "doc"
      ) {
        this.$message("暂不支持word文档在线预览,请下载!");
      } else if (source == "rar" || source == "zip" || source == "7z") {
        this.$message("暂不支持压缩文件在线解压，请下载!");
      } else if (source == "PDF" || source == "pdf") {
        this.pdfPath = path;
       
      } else if (
        source == "gif" ||
        source == "jpg" ||
        source == "jpeg" ||
        source == "png" ||
        source == "tif"
      ) {
        this.pdfPath = path;
       
      } else {
        this.$confirm("文件暂不支持，请下载", "提示", {
          confirmButtonText: "确定",
          type: "info"
        }).then(() => { });
      }
    },
    // 下载文件
    download(src, name) {
      if (!src) {
        this.$message.error("文件路径不正确,无法下载");
      }
      let data = src;

      if (!data) {
        return;
      }
      let courseUrl = "";
      if (JSON.parse(sessionStorage.getItem("course"))) {
        courseUrl = JSON.parse(sessionStorage.getItem("course")).url;
      }
      const fileName = name;
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
    //点击按钮进入untiy
    intounity() {},
    // 查看
    look(row) {
      console.log(row);
      if (row.expTypeId == null) {
        this.dimensionality.id = row.id;
        this.dimensionality.name = row.name;
        this.dimensionality.type = row.typeName;
        this.dimensionality.look = false;
        this.go2D(this.dimensionality);
      } else {
        this.tasks.id = row.id;
        this.tasks.name = row.name;
        this.tasks.type = row.typeName;
        this.tasks.look = true;
        this.go3D(this.tasks);
      }
    },
    go2D(row) {
      console.log(row);
      const tasks = JSON.parse(sessionStorage.getItem("watchStorage2D"));
      if (tasks != null) {
        this.$confirm("请先关闭或保存二维设计空间?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push("/relayteacher/Dimension2");
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
        return;
      }

      if ((row.type == "" || row.name == "") && row.id == "") {
        this.$message.error({
          message: "没有名称或类型"
        });
      } else {
        this.resetSetItem("watchStorage2D", JSON.stringify(row));
        this.testTemplateLibrary = false;

        let page = sessionStorage.getItem("pageTeacher");
        sessionStorage.setItem(
          "SourcePage",
          JSON.stringify({
            path: this.$route.path,
            index: page
          })
        );
        this.$emit("handleSelect", 10);
        this.$router.push("/relayteacher/Dimension2");
      }
    },
    go3D(row) {
      console.log(row);
      const tasks = JSON.parse(sessionStorage.getItem("watchStorage3D"));
      if (tasks != null) {
        this.$confirm("请先关闭或保存三维设计空间?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push("/relayteacher/Dimension3");
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
        return;
      }
      if ((row.type == "" || row.name == "") && row.id == "") {
        this.$message.error({
          message: "没有名称或类型"
        });
      } else {
        this.resetSetItem("watchStorage3D", JSON.stringify(row));
        this.dialogVisiblecopyscene = false;

        let page = sessionStorage.getItem("pageTeacher");
        sessionStorage.setItem(
          "SourcePage",
          JSON.stringify({
            path: this.$route.path,
            index: page
          })
        );
        this.$emit("handleSelect", 11);
        this.$router.push("/relayteacher/Dimension3");
      }
    },
  },
  created(){
    console.log(this.$route.query.id,'实验id')
  }
};
</script>

<style lang="less" scoped>
.Presentation {
  background-color: #fff;
  height: 100%;
}
.taskname {
  width: 100%;
  height: 40px;
  line-height: 40px;
  // text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #cdc673;
  // margin-top: 20px;
}
.asidebox {
  height: 100%;
  border: 1px solid #ccc;
}
// 附件列表
.Enclosure,
.dataList {
  width: 100px;
  height: 100px;
  margin: 0 30%;
  border: 1px solid #ccc;
}
.dataList {
  margin-top: 5px;
}
.unity > button {
  width: 100px;
  height: 100px;
  background-color: skyblue;
  margin-left: 30%;
  margin-top: 5px;
}
.Comment {
  width: 100px;
  margin-left: 30%;
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 35px;
}
.el-form {
  > .el-button {
    margin: 10px 0 0 80px;
  }
}
.mainbox {
  border: 1px solid #ccc;
  height: 99%;
  overflow: hidden;
  position: relative;
  > .browse {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    border-bottom: 1px solid #ccc;
  }
  .pdf {
    height: 100%;
    width: 100%;
    overflow: auto;
    .content {
      height: 100%;
    }
  }
  .left {
    position: absolute;
    left: 10px;
    top: 50%;
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: #ccc;
    cursor: pointer;
  }
  .right {
    position: absolute;
    right: 10px;
    top: 50%;
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: #ccc;
    cursor: pointer;
  }
}
</style>


