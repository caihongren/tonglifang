<template>
  <div style="height:100%;overflow: auto;">
    <div class="box">
      <el-aside width="90%" border="true" style="margin:10px 5%">
        <div style="border:1px solid #ccc;margin:10px; border-radius: 10px; padding:5px;">
          <div style="height:50px" class="bottonbox">
            <el-row>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-button type="primary" icon="el-icon-search" class="search" style=" right: 340px;" @click="dialogVisiblecopy = true,open3()">从内置模板克隆</el-button>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-button type="primary" icon="el-icon-edit-outline" @click="dialogVisible = true,zone()" class="search" style=" right: 180px;">新增实验模板</el-button>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-button type="primary" icon="el-icon-plus" @click="dialogVisiblecopyscene = true" class="search">新建场景文件</el-button>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <span class="buttombox">我的实验模板</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div>
            <!-- 表格 -->
            <!-- 我的实验 -->
            <el-table ref="singleTable" :data="tableDataFalse" border highlight-current-row @current-change="handleCurrentChange" class="tablebox">
              <el-table-column prop="index" label="序号" min-width="100" class="table1" type="index"></el-table-column>
              <el-table-column prop="name" label="名称" min-width="250"></el-table-column>
              <el-table-column prop="experimentType" label="实验类型" min-width="249"></el-table-column>

              <el-table-column label="实验场景文件" min-width="200">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.sceneName" placement="top">
                    <el-button type="text" icon="el-icon-search" @click="go3D(scope.row.sceneId)"></el-button>
                  </el-tooltip>
                  <el-button type="text" @click="deleteTemplate(scope.row,2)" size="small">删除</el-button>

                  <el-upload class="upload-demo" action="/img/add_resource" :before-upload="beforeUploadword" style="display: inline-block">
                    <el-button type="text" size="small" @click="UploadTheSource(scope.row.id,2)">更换</el-button>
                  </el-upload>
                </template>
              </el-table-column>

              <el-table-column label="实验指导书" min-width="200">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.guideName" placement="top">
                    <el-button type="text" icon="el-icon-picture" @click="handleChange(scope.row.guideId)"></el-button>
                  </el-tooltip>
                  <el-button type="text" @click="deleteTemplate(scope.row,0)" size="small">删除</el-button>
                  <el-upload class="upload-demo" action="/img/add_resource" :before-upload="beforeUploadword" style="display: inline-block">
                    <el-button type="text" size="small" @click="UploadTheSource(scope.row.id,0)">上传</el-button>
                  </el-upload>
                </template>
              </el-table-column>

              <el-table-column label="实验报告" min-width="200">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.reportName" placement="top">
                    <el-button type="text" icon="el-icon-download" @click="download(scope.row.reportPath,scope.row.reportName)"></el-button>
                  </el-tooltip>
                  <el-button type="text" @click="deleteTemplate(scope.row,1)" size="small">删除</el-button>
                  <el-upload class="upload-demo" action="/img/add_resource" :before-upload="beforeUploadword" style="display: inline-block">
                    <el-button type="text" size="small" @click="UploadTheSource(scope.row.id,1)">上传</el-button>
                  </el-upload>
                </template>
              </el-table-column>

              <el-table-column label="操作" min-width="200">
                <template slot-scope="scope">
                  <el-button @click="dialogVisiblecopyMy=true,open3(scope.row.id)" type="text" size="small">克隆</el-button>
                  <el-button type="text" @click="deleteTemplate(scope.row,-1)" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 内置实验 -->
        <div style="border:1px solid #ccc;margin:10px; border-radius: 10px; padding:5px;">
          <div style="height:50px" class="bottonbox">
            <span class="buttombox">内置实验模板</span>
          </div>
          <div>
            <el-table ref="singleTable" :data="tableDataTrue" border highlight-current-row @current-change="handleCurrentChange" class="tablebox">
              <el-table-column prop="index" label="序号" min-width="100" class="table1" type="index"></el-table-column>
              <el-table-column prop="name" label="名称" min-width="250"></el-table-column>
              <el-table-column prop="experimentType" label="实验类型" min-width="249"></el-table-column>

              <el-table-column label="实验场景文件" min-width="250">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.sceneName" placement="top">
                    <el-button type="text" icon="el-icon-search" @click="go3D(scope.row.sceneId)"></el-button>
                  </el-tooltip>
                  {{scope.row.sceneName}}
                </template>
              </el-table-column>

              <el-table-column label="实验指导书" min-width="250">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.guideName" placement="top">
                    <el-button type="text" icon="el-icon-picture" @click="handleChange(scope.row.guideId)"></el-button>
                  </el-tooltip>
                  {{scope.row.guideName}}
                </template>
              </el-table-column>

              <el-table-column label="实验报告" min-width="200">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.reportName" placement="top">
                    <el-button type="text" icon="el-icon-download" @click="download(scope.row.reportPath,scope.row.reportName)"></el-button>
                  </el-tooltip>
                  {{scope.row.reportName}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 弹出层 -->
      </el-aside>
      <el-dialog title="新增实验模板" :visible.sync="dialogVisible" width="30%">
        <div class="experimentalTemplateLibraryAside">
          <el-input placeholder="请输入内容" v-model="addtest.name">
            <template slot="prepend">实验模板名称*</template>
          </el-input>
          <!-- 从已有模板选择场景文件 -->
          <el-row :gutter="20">
            <el-col :span="7">
              <div class="grid-content bg-purple">
                <span style="  line-height: 35px;margin: 0 10px;font-size: 18px;">场景文件:</span>
              </div>
            </el-col>

            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-select v-model="addtest.sceneId" placeholder="请选择模板场景文件">
                  <el-option v-for="item in tableDataTrue" :key="item.id" :label="item.name" :value="item.sceneId"></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <!-- 实验指导书 -->
          <el-row :gutter="20">
            <el-col :span="7">
              <div class="grid-content bg-purple">
                <span style="  line-height: 35px;margin: 0 10px;font-size: 18px;">实验指导书:</span>
              </div>
            </el-col>

            <el-col :span="5">
              <div class="grid-content bg-purple">
                <el-tooltip class="item" effect="dark" :content="addtestName.guideName" placement="top">
                  <el-button icon="el-icon-search"></el-button>
                </el-tooltip>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple">
                <el-upload class="upload-demo" action="/img/add_resource" :before-upload="beforeUploadword" style="width:100%">
                  <el-button @click="UploadTheSource('add',0)">上传</el-button>
                </el-upload>
              </div>
            </el-col>
          </el-row>
          <!-- 实验报告模板 -->
          <el-row :gutter="20" style="margin:0px 0">
            <el-col :span="7">
              <div class="grid-content bg-purple">
                <span style="  line-height: 35px;margin: 0 0px;font-size: 18px;">实验报告模板:</span>
              </div>
            </el-col>

            <el-col :span="5">
              <div class="grid-content bg-purple">
                <el-tooltip class="item" effect="dark" :content="addtestName.reportame" placement="top">
                  <el-button icon="el-icon-search"></el-button>
                </el-tooltip>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple">
                <el-upload class="upload-demo" action="/img/add_resource" :before-upload="beforeUploadword" style="width:100%">
                  <el-button @click="UploadTheSource('add',1)">上传</el-button>
                </el-upload>
              </div>
            </el-col>
          </el-row>

          <!-- 图片 -->
          <el-row :gutter="20" style="margin:0px 0">
            <el-col :span="7">
              <div class="grid-content bg-purple">
                <span style="  line-height: 35px;margin: 0 0px;font-size: 18px;">模板图片:</span>
              </div>
            </el-col>

            <el-col :span="13">
              <div class="grid-content bg-purple">
                <el-upload action="/img/add_resource" list-type="picture-card" :before-upload="beforeUploadimg" :on-remove="handleRemove">
                  <img :src="dialogImageUrl" alt style="width:100%;height:100%" v-if="dialogVisibleImg">
                  <i class="el-icon-plus"></i>
                </el-upload>

                <!-- <el-dialog :visible.sync="dialogVisibleImg" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt>
                </el-dialog>-->
              </div>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false,addTemplateMy()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 新建场景文件 -->
      <el-dialog title="新建场景文件" :visible.sync="dialogVisiblecopyscene" width="30%">
        <div>
          <el-input placeholder="请输入新增场景名称" v-model="tasks.name" class="input-with-select">
            <el-select v-model="tasks.type" slot="prepend" placeholder="请选泽场景模式" style="width:180px">
              <el-option :label="item.name" :value="item.name" v-for="(item) in pattern" :key="item.id"></el-option>
            </el-select>
          </el-input>
        </div>
        <el-dialog width="90%" title="场景文件" top="10vh" :visible.sync="innerVisible" :before-close="det3D" append-to-body>
          <div style="height:70vh">
            <!-- <Unity3D v-bind:tasks="tasks" ref="unity3D"></Unity3D> -->
          </div>
        </el-dialog>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblecopyscene = false">取 消</el-button>
          <el-button type="primary" @click="go3Dadd()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 3D文件弹出层 -->
      <el-dialog width="90%" title="场景文件" top="10vh" :visible.sync="innerVisibleNew" :before-close="det3D">
        <div style="height:70vh">
          <!-- <Unity3D v-bind:tasks="tasks" ref="unity3D"></Unity3D> -->
        </div>
      </el-dialog>

      <!-- 指导文件查看 -->
      <el-dialog width="90%" title="指导文件" top="10vh" :visible.sync="innerVisibleNewpdf">
        <div style="height:840px">
          <Examine ref="child"></Examine>
        </div>
      </el-dialog>

      <!-- 克隆内置实验 -->
      <el-dialog title="克隆内置实验" :visible.sync="dialogVisiblecopy" width="30%">
        <div>
          <el-input placeholder="请输入新增模板名称" v-model="inputcopyname" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择克隆的模板" style="width:180px">
              <el-option :label="item.name" :value="item.id" v-for="(item) in tableDataTrue" :key="item.id"></el-option>
            </el-select>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblecopy = false">取 消</el-button>
          <el-button type="primary" @click="ReplicateTheBuiltInExperiment()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 克隆我的实验 -->
      <el-dialog title="克隆我的实验模板" :visible.sync=" dialogVisiblecopyMy" width="30%">
        <div>
          <el-input placeholder="请输入新增模板名称" v-model="inputcopyname" class="input-with-select">
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click=" dialogVisiblecopyMy = false">取 消</el-button>
          <el-button type="primary" @click="ReplicateTheBuiltInExperiment(select)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import {
  Nxmission,
  templateList,
  updateTemplate,
  copyTemplate,
  addTemplate,
  resource,
  deleteTemplate,
  getResource_by_id,
  download,//下载
} from "../API/api";
import Unity3D from "./uity3D";
import { log } from "util";
import Examine from "../views/Examine";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      addtasklist: [],
      taskLength: 0,
      offset: 0,
      limit: 50,
      dialogVisible: false,
      dialogVisiblecopy: false,
      dialogVisiblecopyMy: false,
      dialogVisiblecopyscene: false,
      innerVisibleNewpdf: false,
      innerVisible: false,
      innerVisibleNew: false,
      dialogImageUrl: "",
      dialogVisibleImg: false,
      shuangchuanid: "",
      shuangchuantype: "",
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],

      addtest: {
        name: "",
        description: "",
        experimentTypeId: "",
        sceneId: "",
        guideId: "",
        reportId: "",
        iconId: "",
        annexId: ""
      },
      addtestName: {
        sceneName: "",
        guideName: "",
        reportName: ""
      },
      inputcopyname: "",
      select: "",

      modal1: false,
      modal2: false,
      modal3: false,

      tableData: [],
      tableDataTrue: [],
      tableDataFalse: [],
      tasks: {
        id: "",
        name: "",
        path: "",
        type: ""
      },
      pattern: [
        {
          name: "基础实验",
          id: "1"
        },
        {
          name: "创新实验",
          id: "2"
        },
        {
          name: "综合实验",
          id: "3"
        }
      ]
    };
  },
  components: {
    // Unity3D,
    Examine
  },
  methods: {
    // 到详情页面
    handleChange(id) {
      // console.log(id);
      getResource_by_id({
        id: id
      })
        .then(res => {
          // console.log(res);
          if (res.data.code == "0") {
            this.innerVisibleNewpdf = true;
            this.goExamine(res.data.object.name, res.data.object.path);
          } else {
            this.$message.error({
              message: "该资源不存在"
            });
          }

        })
        .catch(() => {

        });
    },
    // 详情页入口
    goExamine(name, path) {
      let examine = {};
      examine.sourcePath = this.$route.path;
      examine.name = name;
      examine.path = path;
      console.log(examine);
      sessionStorage.setItem("examine", JSON.stringify(examine));
      let user = JSON.parse(sessionStorage.getItem("user"));
      this.$refs.child.gopdf(name, path);
      // console.log(user, user.role);
      // if (user.role == "teacher") {
      //   this.$router.push("/relayteacher/Examine");
      // } else if (user.role == "student") {
      //   this.$router.push("/relay/Examine");
      // } else {
      // }
    },
    // 上传图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },

    beforeUploadimg(file) {
      // console.log(file.type);
      const isJPG = file.type;
      if (isJPG.indexOf("image/") == -1) {
        this.$message.error("只能上传图片");
        return false; //屏蔽了action的默认上传
      } else {
        let fd = new FormData();
        fd.append("file", file); //传图片

        fd.append("resourceTypeId", "");
        fd.append("resourceTypeName", "annex");
        // fd.append('id',this.srid);//传其他参数
        resource(fd).then(res => {
          // 图片验证

          this.dialogImageUrl = res.data.object.path;
          // "http://192.168.2.223:8081/static/annex/4919ab72-350b-42bc-be46-50d061f1ac71tonglifanglogo.png";

          // this.dialogImageUrl = file.url;
          this.dialogVisibleImg = true;
          this.addtest.iconId = res.data.object.id;
        });
        return false; //屏蔽了action的默认上传
      }
    },

    // 上传资源的来源
    UploadTheSource(id, type) {
      this.shuangchuanid = id;
      this.shuangchuantype = type;
    },
    handleCurrentChange() { },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    // 下载文件
    download(src, name) {
      download({
        name: name,
        url: src,
      }).then(res => {
        console.log(res, '下载')
        const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, name);
      })
      // let data = src;
      // // console.log(src,name,'下载')
      // if (!data) {
      //   this.$message.error("不存在该文件,没有上传文件");
      //   return;
      // }
      // let courseUrl = "";
      // if (JSON.parse(sessionStorage.getItem("course"))) {
      //   courseUrl = JSON.parse(sessionStorage.getItem("course")).url;
      //   console.log(courseUrl, "课程服");
      // }
      // const fileName = name;
      // let url = courseUrl + "/download_test?url=" + data + "&name=" + fileName;
      // console.log(url);
      // const elink = document.createElement("a");
      // // elink.download = fileName;
      // elink.style.display = "none";
      // elink.href = url;
      // document.body.appendChild(elink);
      // elink.click();
      // URL.revokeObjectURL(elink.href); // 释放URL 对象
      // document.body.removeChild(elink);
    },
    // 删除模板或者内蓉
    deleteTemplate(row, type) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type == -1) {
            deleteTemplate({
              id: row.id
            }).then(res => {
              console.log(res);
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.templateListadd();
              } else if (res.data.code == -1) {
                this.$message.error("该模板正在使用，无法删除");
              } else {
                this.$message.error("删除失败");
              }
            });
          } else {
            this.updateTemplateMy(row.id, type, "");
          }
          let parmas = {};
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除模板
    // 复制内置实验

    ReplicateTheBuiltInExperiment(id) {
      this.dialogVisiblecopy = false;
      this.dialogVisiblecopyMy = false;
      let type = true;
      //  this.open2()
      if (this.inputcopyname == "" || this.inputcopyname.length == 0) {
        this.$message.error("重名名为空");
        type = false;
        return;
      }
      for (let i = 0; i < this.tableDataFalse.length; i++) {
        let item = this.tableDataFalse[i];
        console.log(item.name);
        if (item.name == this.inputcopyname) {
          this.$message.error("存在重复名字");
          type = false;
          break;
          return;
        }
      }
      if (type) {
        copyTemplate({
          taskExperimentTemplateId: this.select,
          name: this.inputcopyname
        }).then(res => {
          console.log(res, "克隆");
          if (res.data.code == 0) {
            this.$message({
              message: "克隆成功",
              type: "success"
            });
            this.templateListadd();
          } else {
            this.$message.error("克隆失败");
          }
        });
      } else {
        this.$message.error("克隆失败");
      }
    },
    open2(id) {
      console.log(id);
      this.$message({
        message: "下发成功",
        type: "success"
      });
    },
    // 克隆内置实验
    open3(id) {
      console.log(id);
      this.inputcopyname = "";
      this.select = id;
    },
    // 修改实验模板
    updateTemplateMy(id, type, addid) {
      // 查找要修改的id
      let parmas = {};
      for (let i = 0; i < this.tableDataFalse.length; i++) {
        let item = this.tableDataFalse[i];
        if (item.id == id) {
          parmas = {
            id: item.id,
            name: item.name,
            description: item.description,
            experimentTypeId: item.experimentTypeId,
            sceneId: item.sceneId,
            guideId: item.guideId,
            reportId: item.reportId,
            iconId: item.iconId,
            annexId: item.annexId
          };
          break;
        }
      }
      // 更改type类型的内蓉

      if (type == 0) {
        // 实验指导
        parmas.guideId = addid;
      } else if (type == 1) {
        // 实验报告
        parmas.reportId = addid;
      } else if (type == 2) {
        // 实验场景文件
        parmas.sceneId = addid;
      } else {
        this.$message.error("修改失败");
        return;
      }

      console.log(parmas);
      updateTemplate(parmas).then(res => {
        console.log(res, "修改成功");
        this.templateListadd();
      });
    },
    // 增加实验模板
    addTemplateMy(prmas) {
      let type = true;
      if (this.addtest.name.length > 0) {
        for (let i = 0; i < this.tableDataFalse.length; i++) {
          if (this.tableDataFalse[i].name == this.addtest.name) {
            this.$message.error("命名重复");
            type = false;
            return;
          }
        }
      } else {
        this.$message.error("命名为空");
        type = false;
        return;
      }
      if (type) {
        addTemplate(this.addtest).then(res => {
          console.log(res, "新增实验成功");
          if (res.data.code == 0) {
            this.$message({
              message: "新增实验成功",
              type: "success"
            });
            this.templateListadd();
          } else {
            this.$message.error("新增实验失败");
          }
        });
      } else {
        this.$message.error("新增失败");
      }
    },
    // 上传文件

    // 上传实验报告
    beforeUploadword(file, id, item) {
      console.log(file);

      let fd = new FormData();
      fd.append("file", file); //传文件

      fd.append("resourceTypeId", "");
      fd.append("resourceTypeName", "");
      // fd.append('id',this.srid);//传其他参数
      resource(fd).then(res => {
        // this.downloadId=res.data.object.id;
        console.log(res, this.shuangchuanid, this.shuangchuantype);
        let url = res.data.object.path;
        let source = url.substring(url.lastIndexOf(".") + 1, url.length);

        // 新增文件上传
        if (this.shuangchuanid == "add") {
          if (this.shuangchuantype == 0) {
            // 实验指导
            if (
              source == "pdf" ||
              source == "PDF"
            ) {
              this.addtest.guideId = res.data.object.id;
              this.addtestName.guideName = res.data.object.name;
              this.$message({
                message: "上传实验指导成功",
                type: "success"
              });
            } else {
              this.$message.error("上传格式不正确，上传失败");
            }
          } else if (this.shuangchuantype == 1) {
            // 实验报告
            if (
              source == "DOCX" ||
              source == "docx" ||
              source == "DOC" ||
              source == "doc"
            ) {
              this.addtest.reportId = res.data.object.id;
              this.addtestName.reportame = res.data.object.name;
              this.$message({
                message: "上传实验报告成功",
                type: "success"
              });
            } else {
              this.$message.error("上传格式不正确，上传失败");
            }
          } else if (this.shuangchuantype == 2) {
            // 实验场景文件

            if (source == "cctb" || source == "ccti" || source == "cctc") {
              this.addtest.sceneId = res.data.object.id;
              this.addtestName.sceneName = res.data.object.name;
              this.$message({
                message: "上传场景文件成功",
                type: "success"
              });
            } else {
              this.$message.error(
                "上传格式不正确，上传失败,请选限定的场景文件"
              );
            }
          } else {
            this.$message.error("上传失败");
          }
          // 根据id更改
        } else if (this.shuangchuanid.length > 0) {
          let go = true;
          // 根据来源来筛选
          if (this.shuangchuantype == 0) {
            // 实验指导
            if (
              // source == "gif" ||
              // source == "jpg" ||
              // source == "jpeg" ||
              // source == "png" ||
              // source == "tif"
              source == "pdf" ||
              source == "PDF"
            ) {
              this.$message({
                message: "上传实验指导成功",
                type: "success"
              });
            } else {
              this.$message.error("实验指导上传格式不正确，上传失败");
              go = false;
              return;
            }
          } else if (this.shuangchuantype == 1) {
            // 实验报告
            if (
              source == "DOCX" ||
              source == "docx" ||
              source == "DOC" ||
              source == "doc"
            ) {
              // this.addtest.reportId = res.data.object.id;
              // this.addtestName.reportame = res.data.object.name;
              this.$message({
                message: "上传实验报告成功",
                type: "success"
              });
            } else {
              this.$message.error("实验报告上传格式不正确，上传失败");
              go = false;
              return;
            }
          } else if (this.shuangchuantype == 2) {
            // 实验场景文件

            if (source == "cctb" || source == "ccti" || source == "cctc") {
              this.$message({
                message: "上传场景文件成功",
                type: "success"
              });
            } else {
              this.$message.error(
                "上传格式不正确，上传失败,请选限定的场景文件"
              );
              go = false;
              return;
            }
          } else {
            this.$message.error("上传失败");
          }
          // 判断完修改
          if (go) {
            this.updateTemplateMy(
              this.shuangchuanid,
              this.shuangchuantype,
              res.data.object.id
            );
          } else {
            this.$message.error("修改上传失败");
          }
        }

        // this.$message({
        //   message: "上传成功",
        //   type: "success"
        // });
      });
      return false; //屏蔽了action的默认上传
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
    },
    // 去unity3D
    go3Dadd() {
      if (this.tasks.name != "" && this.tasks.type != "") {
        this.innerVisible = true;
        this.$emit("gounity", this.tasks);
      } else {
        this.$message.error("名称为空或未选择场景模式");
      }
    },
    go3D(id) {
      console.log(id);
      this.tasks.id = id;
      this.innerVisibleNew = true;
      this.$emit("gounity", this.tasks);
    },
    det3D() {
      console.log("关闭3D");
      this.innerVisible = false;
      this.innerVisibleNew = false;
      this.dialogVisiblecopyscene = false;

      (this.tasks = {
        id: "",
        name: "",
        path: "",
        type: ""
      }),
        this.$emit("derunity");

      // if(wfapp){
      //
      // }
      //  this.reload();
      // this.$refs.unity3D.detunity3D();
      this.templateListadd();
      //    var cmd =
      //   // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
      //   "{'opcode':5}"

      // wfapp.start(cmd);
      // this.$router.push("/relayteacher/experimentalTemplateLibrary");
    },

    // 清零
    zone() {
      this.addtest = {
        name: "",
        description: "",
        experimentTypeId: "",
        sceneId: "",
        guideId: "",
        reportId: "",
        iconId: "",
        annexId: ""
      };
    },
    // 加载实验模板列表
    templateListadd() {
      templateList({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        // (this.tableData = res.data.object),
        (this.taskLength = res.data.length), console.log(res, "模板列表");
        this.tableDataFalse = [];
        this.tableDataTrue = [];
        // 内置实验模板和我的模板进行判定
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data.object[i];
          if (item.innerr) {
            this.tableDataTrue.push(res.data.object[i]);
          } else {
            this.tableDataFalse.push(res.data.object[i]);
            // this.tableDataTrue.push(res.data.object[i]);
          }
        }
      });
    }
  },
  created() {
    // 加载实验模板列表
    this.templateListadd();
  }
  //  // 创建前设置增加滚动条
  // beforeCreate() {
  //   document
  //     .querySelector("body")
  //     .removeAttribute("style", "overflow-y:hidden ;");
  //   document
  //     .querySelector("body")
  //     .setAttribute("style", "overflow-y:scroll ;background-color:#EEE9E9	");
  //   // document.querySelector('body').setAttribute('style', 'background-color:#ccc')
  // }
  // // 销毁前清除滚动
  // beforeDestroy() {
  //   document.querySelector("body").removeAttribute("style", "overflow-y:scroll ;");
  //    document.querySelector("body").setAttribute("style", "overflow-y:hidden ;");
  // }
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
  margin: 0 10px;
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
</style>

<style lang="less">
.experimentalTemplateLibraryAside .el-row {
  padding-top: 10px;
}
.experimentalTemplateLibraryAside .el-col-24 {
  margin: 20px 0;
}
</style>


