<template>
  <div class="add_Test">
    <div class="interior">
      <!-- 表格 -->
      <el-form label-position="left" label-width="100px" :model="form" style="width:90%" id="right">
        <!-- 要求 -->
        <el-form-item label="要求" class="chongqing f18">
          <el-input type="textarea" :rows="2" v-model="form.textarea" :disabled="true"></el-input>
        </el-form-item>
        <!-- 实训指导书 -->
        <el-form-item label="实训指导书" class="chongqing f18">
          <span class="span">{{form.guide.name}}</span>
          <el-button
            icon="el-icon-plus"
            size="mini"
            @click="handleChange(form.guide.name, form.guide.path)"
            class="successPreservation"
            type="primary"
          >打开</el-button>
        </el-form-item>
        <!-- 参考附件 -->
        <el-form-item label="参考附件" class="chongqing f18">
          <el-table
            :data="form.reference"
            border
            style="width: 100%;margin:5px 0;text-align:center"
            stripe
            :header-cell-style="{background:'#b2e2f8'}"
          >
            <el-table-column prop="name" label="附件名称" min-width="150"></el-table-column>
            <el-table-column prop="typeName" label="类型" min-width="100"></el-table-column>
            <el-table-column label="操作" min-width="150">
              <template slot-scope="scope">
                <el-button @click="otherAnnexs(scope.row)" type="text">查看</el-button>
                <el-button @click="download(scope.row.name,scope.row.path)" type="text">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 实训报告 -->
        <el-form-item label="实训报告" class="f18">
          <el-row>
            <el-col :span="6">
              <div class="laboratoryBook" :title="form.report.name">
                {{form.report.name}}
                <i
                  @click="deletework()"
                  class="el-icon-circle-close"
                  v-show="islook"
                ></i>
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                <el-upload
                  class="upload-demo"
                  action="/img/taskUpload"
                  :before-upload="beforeUploadword"
                  style
                  :limit="5"
                >
                  <el-button
                    size="mini"
                    icon="el-icon-upload"
                    v-if="islook"
                    class="downPreservation"
                    type="primary"
                  >上传文件</el-button>
                </el-upload>
              </div>
            </el-col>
            <el-col :span="10">
              <div>
                <el-button
                  icon="el-icon-plus"
                  size="small"
                  @click="handleChange(form.report.name, form.report.path)"
                  v-if="open"
                  type="primary"
                  class="successPreservation"
                >打开</el-button>
                <el-button
                  size="mini"
                  @click="download(form.report.name,form.report.path)"
                  class="el-icon-top chongqing successPreservation"
                  type="primary"
                >导出</el-button>
                <el-button
                  size="mini"
                  @click="download(form.reportTemName,form.reportTemPath)"
                  class="el-icon-bottom chongqing downPreservation"
                  v-show="islook"
                  type="primary"
                >下载模板</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 仿真实训题 -->
        <el-form-item label="仿真实训题" class="f18">
          <template>
            <el-table
              :data="form.snapshoot"
              border
              style="width: 100%;margin:5px 0"
              stripe
              :header-cell-style="{background:'#b2e2f8'}"
            >
              <el-table-column prop="name" label="附件名称" min-width="100"></el-table-column>
              <el-table-column prop="typeName" label="类型" min-width="60"></el-table-column>
              <el-table-column prop="name" label="原题" min-width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="compileClick(scope.row)"
                    size="small"
                    type="text"
                  >{{scope.row.name}}</el-button>
                </template>
              </el-table-column>

              <!-- <el-table-column prop="projectName" label="快照" min-width="110">
                <template slot-scope="scope" v-if="scope.row.projectId != null && scope.row.projectId != ''">
                  {{scope.row.projectName|dateformat}}
                  <el-button type="text" size="small" @click="snapshotLook(scope.row)">
                    <span class="icon iconfont">&#xe643;</span>
                  </el-button>
                  <el-button type="text" @click="eacher(scope.row.simPath)">
                    <span class="icon iconfont">&#xeb99;</span>
                  </el-button>
                </template>
              </el-table-column>-->
            </el-table>
          </template>
        </el-form-item>
        <!-- 其他附件 -->
        <el-form-item label="其他附件" class="f18">
          <template>
            <el-row v-if="islook">
              <!-- <el-col :span="9">
                <div></div>
                <el-button @click="templateLibrary()" size="small" icon="el-icon-plus" class="chongqing">新建二维仿真</el-button>
                <el-button @click="visiblecopyscene()" size="small" icon="el-icon-plus">新建三维仿真</el-button>
              </el-col>-->
              <el-col :span="1">
                <div>
                  <el-upload
                    class="upload-demo"
                    action="/img/taskUpload"
                    :before-upload="beforeUpload"
                    style
                    :limit="5"
                  >
                    <el-button
                      size="mini"
                      icon="el-icon-upload"
                      class="downPreservation"
                      type="primary"
                    >上传文件</el-button>
                  </el-upload>
                </div>
              </el-col>
            </el-row>
            <el-table
              :data="form.otherAnnexs"
              border
              stripe
              :header-cell-style="{background:'#b2e2f8'}"
              style="margin:5px 0"
            >
              <el-table-column prop="name" label="附件名称" min-width="170" sortable></el-table-column>
              <el-table-column prop="typeName" label="类型" min-width="120"></el-table-column>
              <el-table-column label="操作" min-width="150">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="otherAnnexs(scope.row)">查看</el-button>
                  <el-button type="text" @click="det(scope.row.id)" size="small" v-show="islook">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
        <el-form-item label="教师批阅" v-if="isapproved">
          <div>分数：{{form.teacherScore}}</div>
          <div>
            <el-input type="textarea" :rows="2" v-model="form.teacherComment" :disabled="true"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="operation">
        <el-button
          @click="SubmitAnExperimentReport('save')"
          v-if="islook"
          type="primary"
          :loading="loading"
          class="successPreservation fright"
          size="mini"
        >保存</el-button>
        <el-button
          @click="isSubmitAnExperimentReport('submit')"
          v-if="islook"
          type="primary"
          :loading="loading"
          class="dangerSubmission fright"
          size="mini"
        >提交</el-button>
        <el-button
          @click="$emit('detpage')"
          v-if="!islook"
          class="dangerSubmission2 fright"
          type="primary"
          size="mini"
        >确定</el-button>
      </div>

      <!-- 弹窗 -->
      <!-- 新建2D弹出框 -->
      <el-dialog
        title="新建二维"
        :visible.sync="testTemplateLibrary"
        class="newBulletWindowFrame"
        width="45%"
      >
        <div>
          <el-input placeholder="请输入新增二维名称" v-model="taskExperiment.name" class="input-with-select">
            <el-select
              v-model="erweiSelect"
              slot="prepend"
              placeholder="请选泽二维模式"
              style="width:180px"
            >
              <el-option
                :label="item.name"
                :value="item"
                v-for="(item) in simulationResourcesType"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="testTemplateLibrary = false">取 消</el-button>
          <el-button type="primary" @click="addOtherAnnexes()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新建3d场景文件 -->
      <el-dialog title="新建三维" :visible.sync="dialogVisiblecopyscene" width="45%">
        <div>
          <el-input placeholder="请输入新增场景名称" v-model="taskExperiment.name" class="input-with-select">
            <el-select
              v-model="sanweiSelect1"
              slot="prepend"
              placeholder="请选泽三维模式"
              style="width:150px;margin-right:10px"
            >
              <el-option :label="item.name" :value="item" v-for="item in pattern" :key="item.id"></el-option>
            </el-select>
            <el-select
              v-model="sanweiSelect2"
              slot="prepend"
              placeholder="请选泽场景模式"
              style="width:150px"
            >
              <el-option :label="item.name" :value="item" v-for="item in patterncon" :key="item.id"></el-option>
            </el-select>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisiblecopyscene = false">取 消</el-button>
          <el-button type="primary" @click="addOtherSanwei()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 指导文件查看 -->
      <el-dialog width="74%" top="6vh" append-to-body :visible.sync="innerVisibleNewpdf">
        <div style="height:75vh">
          <Examine ref="child" v-if="innerVisibleNewpdf"></Examine>
        </div>
      </el-dialog>
      <!-- 视屏文件查看 -->
      <el-dialog
        width="74%"
        title="播放视屏"
        top="8vh"
        append-to-body
        :visible.sync="innerVisiblevideo"
      >
        <div style="height:75vh">
          <video id="player" width="100%" height="100%" controls>
            您的浏览器不支持HTML5
            <source :src="previewPath" />
            <!-- 提供默认的播放视频  -->
          </video>
        </div>
      </el-dialog>
      <!-- 快照折线图查看 -->
      <el-dialog
        width="50%"
        title="实训快照折线图"
        top="8vh"
        append-to-body
        :visible.sync="innerVisiblePolyline"
      >
        <div style="height:55vh">
          <div
            id="myChart2"
            :style="{width: '90%', height: '80%'}"
            class="myChart2"
            v-if="innerVisiblePolyline"
          ></div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="innerVisiblePolyline=false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Examine from "../../views/Examine";
import FileSaver from "file-saver";
import {
  snalist, //  加载快照列表
  taskUpload, // 上传文件
  saveTaskExperiment, //保存或提交
  experimentDetails, // 获取学生实训任务列表
  experiment_type_list, //添加实训类型
  sceneTypes, //获取仿真资源类型列表2维/3维
  addSimulationAnnex, //新增二维三维
  download //下载
} from "../../API/api";
export default {
  data() {
    return {
      //整个页面form内容
      form: {
        id: "", //id
        textarea: "", //要求
        guide: {
          //实训指导书
          id: "",
          name: "",
          path: ""
        },
        reference: [], //参考附件表单
        report: {
          //实训报告
          id: "",
          name: "",
          path: "",
          file: ""
        },

        snapshoot: [], //仿真实训题表单
        otherAnnexs: [], //其他附件表单
        teacherScore: "",
        teacherComment: "",
        reportTemName: "", //实训报告模板名称
        reportTemPath: "" //实训报告模板路径
      },
      innerVisibleNewpdf: false, //实训指导书指导文件查看
      //二维仿真模态框
      simulationResourcesType: [], //新建二维下拉框内容
      testTemplateLibrary: false, //二维模态框是否显示
      erweiSelect: "", //二维下拉框选中的值
      //三维仿真模态框
      dialogVisiblecopyscene: false, //三维模态框是否显示
      pattern: [], //新建三维第一个下拉框内容
      patterncon: [], //新建三维第二个下拉框内容
      sanweiSelect1: "", //三维模式下第一个拉框选中的值
      sanweiSelect2: "", //三维模式第二个下拉框选中的值
      innerVisiblePolyline: false, //折线图模态框是否显示
      loading: false, //保存提交中
      dimensionality: {
        //go2d对象
        simType: "",
        name: "",
        typeName: "",
        type: "",
        id: "",
        look: false
      },
      tasks: {
        //go3d对象
        taskExperimentId: "",
        id: "",
        name: "",
        path: "",
        type: "",
        look: false,
        expTypeId: ""
      },
      innerVisiblevideo: false,
      previewPath: "",
      jpgPreviewPath: false,
      islook: true,
      open: false,
      isapproved: false,

      //折线图部分
      series: [],
      duration: "",
      stepLength: "",
      stepLengthlist: [],
      legend: [],
      taskExperiment: {
        taskExperimentId: "",
        name: "",
        type: "",
        expType: ""
      }
    };
  },
  components: {
    // Unity3D,
    Examine
  },
  props: {
    row: Object,
    showheight: String
  },
  methods: {
    ...mapActions(["task"]),
    //取消文件预览
    //点击查看
    otherAnnexs(row) {
      if (row.id == "") {
        this.$confirm("新上传的文件请先保存后查看此文件", "提示", {
          confirmButtonText: "确定",
          type: "info"
        });
      } else {
        if (row.simType == "2d") {
          this.dimensionality.id = row.id;
          this.dimensionality.name = row.name;
          this.dimensionality.type = row.typeName;
          this.dimensionality.look = false;
          this.go2D(this.dimensionality);
        } else if (row.simType == "3d") {
          this.tasks.taskExperimentId = this.form.id;
          this.tasks.id = row.id;
          this.tasks.name = row.name;
          this.tasks.type = row.typeName;
          this.tasks.look = !this.islook;
          this.go3D(this.tasks);
        } else if (row.typeName == "pdf" || row.typeName == "PDF") {
          this.innerVisibleNewpdf = true;
          this.handleChange(row.name, row.path);
        } else if (
          row.typeName == "gif" ||
          row.typeName == "jpg" ||
          row.typeName == "jpeg" ||
          row.typeName == "png" ||
          row.typeName == "tif"
        ) {
          this.innerVisibleNewpdf = true;
          this.handleChange(row.name, row.path);
        } else if (
          row.typeName == "AVI" ||
          row.typeName == "avi" ||
          row.typeName == "MOV" ||
          row.typeName == "QT" ||
          row.typeName == "ASF" ||
          row.typeName == "RM" ||
          row.typeName == "NAVI" ||
          row.typeName == "DivX" ||
          row.typeName == "MPEG" ||
          row.typeName == "MPG" ||
          row.typeName == "DAT" ||
          row.typeName == "mp4" ||
          row.typeName == "wmv"
        ) {
          this.previewPath = row.path;
          this.innerVisiblevideo = true;
        } else {
          this.$confirm("文件暂不支持，请下载", "提示", {
            confirmButtonText: "确定",
            type: "info"
          });
        }
      }
    },
    //点击快照查看
    snapshotLook(row) {
      if (row.simType == "2d") {
        this.dimensionality.id = row.id;
        this.dimensionality.name = row.name;
        this.dimensionality.type = row.typeName;
        this.dimensionality.look = false;
        this.go2D(this.dimensionality);
      } else if (row.simType == "3d") {
        this.tasks.taskExperimentId = this.form.id;
        this.tasks.id = row.projectId;
        this.tasks.name = row.name;
        this.tasks.type = row.typeName;
        this.tasks.look = !this.islook;
        this.go3D(this.tasks);
      } else {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "该文件不支持查看，请下载"
        });
      }
    },

    // 下载文件
    download(name, path) {
      if (name == null || path == null) {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "下载错误或者为空"
        });
        return;
      }
      download({
        name: name,
        url: path
      }).then(res => {
        const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, name);
      });
    },
    // 删除实训报告
    deletework() {
      this.form.report = "";
    },
    // 上传实训报告文件
    beforeUploadword(file) {
      let source = file.name.substring(
        file.name.lastIndexOf(".") + 1,
        file.name.length
      );
      if (source == "pdf" || source == "PDF") {
        this.form.report.file = file;
        this.form.report.name = file.name;
        this.$message({
          showClose: true,
          duration: 1000,
          message: "上传实训报告成功",
          type: "success"
        });
      } else {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "仅限上传pdf格式，上传失败"
        });
      }
    },
    //获取新建二维仿真下拉框内容
    templateLibrary() {
      this.taskExperiment.name = "";
      this.taskExperiment.type = "";
      this.taskExperiment.expType = "";
      this.testTemplateLibrary = true; //模态框显示
      sceneTypes({
        alias: "2d"
      }).then(res => {
        this.simulationResourcesType = res.data.object;
      });
    },
    //获取新建三维仿真下拉框内容
    visiblecopyscene() {
      this.taskExperiment.name = "";
      this.taskExperiment.type = "";
      this.taskExperiment.expType = "";
      this.dialogVisiblecopyscene = true; //模态框显示
      sceneTypes({
        alias: "3d"
      }).then(res => {
        this.pattern = res.data.object;
      });
      //添加实训类型
      experiment_type_list().then(res => {
        this.patterncon = res.data.object;
      });
    },
    go2D(row) {
      if ((row.type == "" || row.name == "") && row.id == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "没有名称或类型"
        });
      } else {
        this.resetSetItem("watchStorage2D", JSON.stringify(row));
        this.testTemplateLibrary = false;

        let page = sessionStorage.getItem("page");
        sessionStorage.setItem(
          "SourcePage",
          JSON.stringify({
            path: this.$route.path,
            index: page
          })
        );
        this.$emit("handleSelect", 10);
        this.$router.push("/relay/Dimension2");
      }
      this.dimensionality.name = ""; //新建二维输入框清空
      this.dimensionality.type = ""; //新建二维输入框清空
    },
    go3D(row) {
      if ((row.type == "" || row.name == "") && row.id == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "没有名称或类型"
        });
      } else {
        this.resetSetItem("watchStorage3D", JSON.stringify(row));
        this.dialogVisiblecopyscene = false;

        let page = sessionStorage.getItem("page");
        sessionStorage.setItem(
          "SourcePage",
          JSON.stringify({
            path: this.$route.path,
            index: page
          })
        );
        this.$emit("handleSelect", 11);
        this.$router.push("/relay/Dimension3");
      }
    },
    // 上传其他附件文件
    beforeUpload(file) {
      this.form.otherAnnexs.push({
        id: "",
        file: file,
        name: file.name,
        typeName: file.name.substring(
          file.name.lastIndexOf(".") + 1,
          file.name.length
        ),
        dimensionality: ""
      });
      this.$message({
        showClose: true,
        duration: 1000,
        message: "添加文件成功",
        type: "success"
      });
    },
    //添加其他附件二维
    addOtherAnnexes() {
      this.testTemplateLibrary = false; //关闭新建二维模态框
      this.taskExperiment.type = this.erweiSelect.id;
      if (this.taskExperiment.name == "" || this.taskExperiment.type == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "没有名称或类型"
        });
        return;
      }
      addSimulationAnnex({
        taskExperimentId: this.taskExperiment.taskExperimentId,
        name: this.taskExperiment.name,
        type: this.taskExperiment.type,
        expType: this.taskExperiment.expType
      }).then(res => {
        if (res.data.code == "0") {
          this.form.otherAnnexs.push({
            id: res.data.object.id,
            name: this.taskExperiment.name,
            typeName: this.erweiSelect.name,
            simType: res.data.object.simType
          });
          //调用表格的查询方法
        }
      });
    },
    //添加其他附件三维
    addOtherSanwei() {
      this.dialogVisiblecopyscene = false;
      this.taskExperiment.type = this.sanweiSelect1.id;
      this.taskExperiment.expType = this.sanweiSelect2.id;
      if (this.taskExperiment.name == "" || this.taskExperiment.type == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "没有名称或类型"
        });
        this.dimensionality.name = ""; //清空内容
        this.dimensionality.typeName = ""; //清空内容
        return;
      }
      addSimulationAnnex({
        taskExperimentId: this.taskExperiment.taskExperimentId,
        name: this.taskExperiment.name,
        type: this.taskExperiment.type,
        expType: this.taskExperiment.expType
      }).then(res => {
        if (res.data.code == "0") {
          this.form.otherAnnexs.push({
            id: res.data.object.id,
            name: this.taskExperiment.name,
            typeName: this.sanweiSelect1.name,
            simType: res.data.object.simType
          });
          this.dimensionality.name = ""; //清空内容
          this.dimensionality.typeName = ""; //清空内容
          //调用表格的查询方法
        }
      });
    },
    // pdf到详情页面
    handleChange(name, path) {
      this.innerVisibleNewpdf = true;
      if (path != "") {
        this.goExamine(name, path);
      } else {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "该资源不存在"
        });
      }
    },
    //删除其他附件
    det(id) {
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          for (let i = 0; i < this.form.otherAnnexs.length; i++) {
            if (this.form.otherAnnexs[i].id == id) {
              this.form.otherAnnexs.splice(i, 1);
              break;
              return;
            }
          }
          this.$message({
            showClose: true,
            duration: 1000,
            message: "删除成功",
            type: "success"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            showClose: true,
            duration: 1000,
            message: "已取消删除"
          });
        });
    },
    //点击原题
    compileClick(row) {
      if (row.simType == "2d") {
        this.dimensionality.id = row.id;
        this.dimensionality.name = row.name;
        this.dimensionality.type = row.typeName;
        this.dimensionality.look = false;
        this.go2D(this.dimensionality);
      } else if (row.simType == "3d") {
        this.tasks.taskExperimentId = this.form.id;
        this.tasks.id = row.id;
        this.tasks.name = row.name;
        this.tasks.type = row.typeName;
        this.tasks.look = !this.islook;
        this.go3D(this.tasks);
      }
    },
    // 提交判断
    isSubmitAnExperimentReport(type) {
      this.$confirm("提交实训报告后将不可更改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.SubmitAnExperimentReport(type);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
          this.loading = false;
        });
    },

    // 提交保存的时候提交实训报告和其他附件到服务器
    SubmitAnExperimentReport(type) {
      //实训报告提交

      if (this.form.otherAnnexs.length > 0) {
        this.$message({
          showClose: true,
          duration: 2000,
          message: "正在上传文件。。。请勿关闭界面"
        });
      }

      this.loading = true;

      if (this.form.report.file != null && this.form.report.file != "") {
        let fd = new FormData();
        fd.append("file", this.form.report.file); //上传文件
        fd.append("type", "report");
        fd.append("taskExperimentId", this.form.id);
        taskUpload(fd).then(res => {
          if (res.data.code != 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "实训报告上传失败",
              type: "warning"
            });
            this.loading = false;
          }
          this.form.report.id = res.data.object;
          this.otherAnnexsUpload1(0, type); //其他附件提交
        });
      } else {
        this.otherAnnexsUpload1(0, type); //其他附件提交
      }
    },
    otherAnnexsUpload1(item, type) {
      let length = this.form.otherAnnexs.length;
      if (item < length) {
        this.$message({
          showClose: true,
          duration: 2000,
          message: "正在上传文件" + (item + 1) + "/" + length
        });
        if (this.form.otherAnnexs[item].file != undefined) {
          let fd1 = new FormData();
          fd1.append("file", this.form.otherAnnexs[item].file); //上传文件
          fd1.append("type", "annex");
          fd1.append("taskExperimentId", this.form.id);
          taskUpload(fd1)
            .then(res => {
              if (res.data.code == -1) {
                this.$message({
                  message: "其他附件上传失败",
                  type: "warning"
                });
                this.loading = false;
              }
              this.form.otherAnnexs[item].id = res.data.object;
              if (item == length) {
                return true;
              }
              this.otherAnnexsUpload1(item + 1, type);
            })
            .catch(function(error) {
              this.$message({
                showClose: true,
                duration: 1000,
                message: "其他附件上传失败",
                type: "warning"
              });
              this.loading = false;
            });
        } else {
          this.otherAnnexsUpload1(item + 1, type);
        }
      } else if (item == length && length > 0) {
        this.$message({
          message: "文件上传成功",
          type: "warning"
        });
        this.saveOrSubmit(type);
      } else if (length == 0) {
        this.saveOrSubmit(type);
      }
    },
    // 提交报告
    saveOrSubmit(type) {
      //  要确定上传完成提交
      let otherIds = [];
      for (var i = 0; i < this.form.otherAnnexs.length; i++) {
        if (
          this.form.otherAnnexs[i].id != null &&
          this.form.otherAnnexs[i].id != ""
        ) {
          otherIds.push(this.form.otherAnnexs[i].id);
        }
      }
      // 先提交word实训报告(假设提交成功)
      if (type == "submit") {
        saveTaskExperiment({
          taskExperimentId: this.form.id,
          operating: "submit",
          reportId: this.form.report.id,
          otherAnnexs: otherIds
        })
          .then(res => {
            if (res.data.msg == "SUCCESS") {
              this.$message({
                showClose: true,
                duration: 1000,
                message: "保存成功",
                type: "success"
              });
              this.$emit("detpage");
            }
          })
          .catch(() => {
            this.$message({
              showClose: true,
              duration: 1000,
              type: "info",
              message: "保存失败"
            });
            this.loading = false;
          });
      } else {
        saveTaskExperiment({
          taskExperimentId: this.form.id,
          operating: "save",
          reportId: this.form.report.id,
          otherAnnexs: otherIds
        })
          .then(res => {
            if (res.data.code == "0") {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.$emit("detpage");
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "保存失败"
            });
            this.loading = false;
          });
      }
    },
    // 详情页入口
    goExamine(name, path) {
      let examine = {};
      examine.sourcePath = this.$route.path;
      examine.name = name;
      examine.path = path;
      sessionStorage.setItem("examine", JSON.stringify(examine));
      let user = JSON.parse(sessionStorage.getItem("user"));
    },
    // 打开快照折线图详情
    eacher(path) {
      if (!path) {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "无法打开"
        });
        return;
      }
      this.innerVisiblePolyline = true;
      let data = {};
      this.$http
        .get(path)
        .then(res => {
          data = res.body.SimData;
          this.duration = res.body.duration;
          this.stepLength = res.body.stepLength;
          let one = (this.duration / this.stepLength).toFixed(4);
          let two = [];
          for (let i = 0; i < this.stepLength; i++) {
            two[i] = one * i;
          }
          this.stepLengthlist = two;
          for (var item in data) {
            this.series.push({
              name: data[item].Name,
              type: "line",
              barWidth: "60%",
              data: data[item].data
            });
            this.legend.push(data[item].Name);
          }
          this.visible2 = true;
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(
            document.getElementById("myChart2"),
            null
          );
          // 绘制图表
          myChart.setOption({
            // title: { text: '在Vue中使用echarts' },
            tooltip: {},
            legend: {
              data: this.legend
            },
            xAxis: {
              type: "category",
              data: this.stepLengthlist
            },
            yAxis: {
              name: "",
              type: "value"
            },
            dataZoom: [
              {
                dataZoomIndex: 1,
                start: 0,
                end: 10
              },
              {
                type: "inside"
              }
            ],
            series: this.series
          });
        })
        .catch(() => {
          this.$message.error({
            showClose: true,
            message: "快照暂时无数据",
            type: "warning",
            duration: 1000
          });
        });
    },

    initData() {
      if (this.row.id != undefined && this.row.id != "") {
        this.taskExperiment.taskExperimentId = this.row.id;
        experimentDetails({
          taskExperimentId: this.row.id
        }).then(res => {
          let data = res.data.object;
          this.form.reportTemName = data.reportTemName; //实训报告模板名称
          this.form.reportTemPath = data.reportTemPath; //实训报告模板路径
          this.form.textarea = data.description; //要求
          this.form.guide.path = data.guidePath; //实训指导书路径
          this.form.guide.name = data.guideName; //实训指导书名字
          this.form.report.name = data.reportName; //实训报告名字
          this.form.report.id = data.reportId; //实训报告Id
          this.form.report.path = data.reportPath; //实训报告路径
          this.form.snapshoot = data.simAnnexs; //仿真实训题表单
          this.form.otherAnnexs = data.otherAnnexs; //其他附件
          this.form.reference = data.referAnnexs; //参考附件表单
          this.form.teacherScore = data.score; //批阅分数
          this.form.teacherComment = data.comment; //批阅评语
        });
      }
    }
  },
  computed: {
    ...mapState(["taskList"])
  },
  created() {
    this.initData();
    this.form.id = this.row.id;
    if (this.row.statu == "new") {
      return "未开始";
    } else if (this.row.statu == "save") {
      return "进行中";
    } else if (this.row.statu == "submit") {
      this.islook = false;
      this.open = true;
      return "已提交";
    } else if (this.row.statu == "approved") {
      this.islook = false;
      this.isapproved = true;
      this.open = true;
      return "已批阅";
    } else if (this.row.statu == "expired") {
      this.islook = false;
      this.open = true;
      return "已终止";
    }
  }
};
</script>

<style lang="scss" scoped>
.fright {
  float: right;
}
.dangerSubmission2 {
  background-color: #66c6f2;
  border: none;
  width: 70px;
  height: 30px;
}
.dangerSubmission {
  margin-right: 10px;
  background-color: #66c6f2;
  border: none;
  width: 70px;
  height: 30px;
}
.successPreservation {
  background-color: #00a0e9;
  border: none;
  width: 70px;
  height: 30px;
}
.downPreservation {
  background-color: #00a0e9;
  border: none;
  width: 90px;
  height: 30px;
}
.add_Test {
  width: 96%;
  margin: 0 3%;
  height: 92%;
  overflow: hidden;
}
.myChart2 {
  min-width: 100px;
}

.interior {
  width: 102%;
  height: 100%;
  overflow: auto;
}

.laboratoryBook {
  height: 37px;
  padding-left: 8px;
  width: 260px;
  cursor: pointer;
  overflow: hidden;
  padding-right: 20px;
  border-radius: 5px;
  border: 1px solid #dddddd;
  position: relative;
}
.el-icon-circle-close {
  line-height: 40px;
  font-size: 22px;
  position: absolute;
  right: 5px;
  color: #dddddd;
}
.el-icon-circle-close:hover {
  color: rgb(7, 5, 24);
}
.span {
  padding-right: 200px;
}
.operation {
  margin-left: 185px;
  margin: 10px 0;
  height: 100px;
  width: calc(90% - 0px);
}
.f18 > :first-child {
  font-size: 16px;
}
</style>

<style  lang="scss">
.addTest {
  .el-form-item__label {
    font-size: 16px;
    color: black;
    font-weight: bold;
  }
  .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 30px;
  }
  .el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 40px;
  }
  .el-upload--text {
    width: 0px;
  }
  .el-radio {
    margin-right: 10px;
  }
}
</style>


