<template>
  <div class="newPop-upBox">
    <div class="modalFrameTemplateLibrary">
      <div style="margin-top:20px;" v-show="isshow.type">
        <span style="font-size:20px;font-weight:500;">模板名称</span>
        <el-input type="text" v-model="newName" placeholder="请输入新增模板名称" class="input-with-select" :title=newName>
          <i class="el-icon-edit el-input__icon" slot="suffix"></i>
        </el-input>
      </div>
      <div class="modalFrameInputBox">
        <span>要求:</span>
        <el-input class="inputBox" type="textarea" :rows="3" autocomplete="off" placeholder="请输入内容..." v-model="textarea" :readonly="isshow.vall"></el-input>
      </div>
      <div class="laboratoryInstructions">
        <!-- 实验指导书 -->
        <el-form :inline="true" class="demo-form-inline">

          <el-form-item label="实验指导书">
            <div class="laboratoryBook"> {{addFilelable.name}}</div>
            <i @click="deleteContent()" class="el-icon-circle-close" v-show="isshow.deletebutton"></i>

          </el-form-item>
          <el-button icon="el-icon-plus" size="small" @click="handleChange(addFilelable.name, addFilelable.path)" class='ffd' v-show="isshow.look">打开</el-button>
          <el-form-item v-show="isshow.addtype">
            <el-button @click="addCourseResourcesButton(1)">
              从课程资源库增加
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
          </el-form-item>
          <el-form-item v-show="isshow.addtype">
            <el-upload class="upload-demo" action="/img/add_resource" :before-upload="beforeUploadFile" style="display: inline-block">
              <el-button size="small" type="primary" class="upload" @click="UploadTheSource(1)">
                上传文件
                <i class="el-icon-upload"></i>
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <!-- 实验报告 -->
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="实验报告模板" class="f18">
            <div class="laboratoryTemplate" :title="addFilelableTwo.name">
              <i @click="deleteContentTwo()" class="el-icon-circle-close" v-show="isshow.deletebutton"></i>
              {{addFilelableTwo.name}}
            </div>
          </el-form-item>
          <el-form-item v-show="isshow.addtype">
            <el-button @click="addCourseResourcesButton(2)">
              从课程资源库增加
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
          </el-form-item>
          <el-form-item v-show="isshow.addtype">
            <el-upload class="upload-demo" action="/img/add_resource" :before-upload="beforeUploadFile" style="display: inline-block">
              <el-button size="small" type="primary" class="upload" @click="UploadTheSource(2)">
                上传文件
                <i class="el-icon-upload"></i>
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <!-- 仿真实验题附件 -->
        <el-form :inline="true" class="demo-form-inline questions">
          <el-form-item label="仿真实验题附件" class="f18"></el-form-item>
          <el-form-item style="padding-left:52px;" v-show="isshow.addtype">
            <el-button @click="addingSimulation(1)">
              从仿真资源库增加
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
          </el-form-item>
          <el-form-item v-show="isshow.addtype">
            <el-button @click="experimentalStation()">
              增加试验台
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
          </el-form-item>
          <el-form-item v-show="isshow.addtype">
            <el-upload class="upload-demo" action :before-upload="beforeUploadSimulation" style="display: inline-block">
              <el-button size="small" type="primary" class="upload" style="height:40px">
                上传仿真资源
                <i class="el-icon-upload"></i>
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <!-- 仿真实验题附件表格 -->

        <el-table :data="tableData1" stripe border :header-cell-style="{background:'#ccc'}" style="width: 80%;margin-left: 185px;top:-22px">
          <el-table-column prop="name" label="附件名称" min-width="50"></el-table-column>
          <el-table-column prop="typeName" label="类型" min-width="40"></el-table-column>
          <el-table-column label="操作" min-width="50">
            <template slot-scope="scope">
              <el-button @click="lookover(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="deleteTaskFormwork(scope.row.id)" type="text" size="small" v-show="isshow.addtype">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 参考附件 -->
        <el-form :inline="true" class="demo-form-inline questions">
          <el-form-item label="参考附件" class="f18"></el-form-item>
          <el-form-item style="padding-left:100px;" v-show="isshow.addtype">
            <el-button @click="addCourseResourcesButton(3)">
              从课程资源库增加
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
          </el-form-item>
          <el-form-item v-show="isshow.addtype">
            <el-button @click="addingSimulation(2)">
              从仿真资源库增加
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
          </el-form-item>
          <el-form-item v-show="isshow.addtype">
            <el-upload class="upload-demo" action="/img/add_resource" :before-upload="beforeUploadReference" style="display: inline-block">
              <el-button size="small" type="primary" class="upload">
                添加文件
                <i class="el-icon-upload"></i>
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <!-- 参考附件表格 -->
        <el-table :data="tableData2" stripe border :header-cell-style="{background:'#ccc'}" style="width: 80%;margin-left: 185px;top:-22px">
          <el-table-column prop="name" label="附件名称" min-width="50"></el-table-column>
          <el-table-column prop="typeName" label="类型" min-width="40"></el-table-column>
          <el-table-column label="操作" min-width="0">
            <template slot-scope="scope">
              <el-button @click="lookover(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small" @click="download33(scope.row.path,scope.row.name)" v-show="isshow.addtype">下载</el-button>
              <el-button @click="deleteFeferenceAttachments(scope.row.id)" type="text" size="small" v-show="isshow.addtype">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 从课程资源库增加弹窗 -->

      <el-dialog :visible.sync="addDialogVisible" append-to-body title="课程资源库">
        <div class="searchimg">
          <div class="searchres">
            <p>搜索资源库：</p>
          </div>
          <div class="searchresmin">
            <el-autocomplete class="inline-input" :title="fileSearchValue.name" v-model="fileSearchValue.name" :fetch-suggestions="querySearch" placeholder="请搜索" @select="handleSelect"></el-autocomplete>
            <img src="../image/search .png" />
          </div>
        </div>
        <div class="content">
          <p class="addcontent">添加内容：</p>
          <el-input class="inputContent" v-model="fileAddValue.name" :disabled="true" placeholder="内容"></el-input>
        </div>章：
        <el-select v-model="zhangSelectValue" placeholder="全部" @change="get_unit_list_all(zhangSelectValue)">
          <el-option v-for="item in chapterSelectData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>节：
        <el-select v-model="jieSelectValue" placeholder="全部" @change="get_materials_by_unit(jieSelectValue)">
          <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>资料：
        <el-select v-model="fileSelectValue.id" placeholder="请选择" @change="addFileInput(fileSelectValue.id)">
          <el-option v-for="item in addfileArray" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addFileFalse()">取 消</el-button>
          <el-button type="primary" @click="addFile5()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 从仿真资源库添加弹窗 -->
      <el-dialog :visible.sync="addSimulationVisible" append-to-body width="25%" top="15vh" title="仿真资源库">
        仿真资源库：
        <el-select v-model="addSimulationResourcesValue" placeholder="请选择">
          <el-option v-for="item in simulationResourcesAll" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addSimulationResourcesCancel()">取 消</el-button>
          <el-button type="primary" @click="addSimulationResources()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加实验台弹窗 -->
      <el-dialog :visible.sync="addexperimentalStation" append-to-body width="25%" top="15vh" title="元件库">
        实验台：
        <el-select placeholder="请选择">
          <el-option></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addexperimentalStationcesCancel()">取 消</el-button>
          <el-button type="primary" @click="addexperimentalStationResources()">确 定</el-button>
        </div>
      </el-dialog>
      <el-button type="primary" @click="$emit('detpage')" class="closeButton" :loading="loading">关闭</el-button>
      <el-button type="primary" @click="savePreservation()" class="preservation" v-show="isshow.addtype" :loading="loading"> 保存</el-button>
    </div>
    <!-- 指导文件查看 -->
    <el-dialog width="90%" title="指导文件" top="8vh" append-to-body :visible.sync="innerVisibleNewpdf">
      <div style="height:75vh">
        <Examine ref="child" v-if="innerVisibleNewpdf"></Examine>
      </div>
    </el-dialog>
    <!-- 视屏文件查看 -->
    <el-dialog title :visible.sync="innerVisiblevideo">
      <video id="player" width="100%" height="100%" controls autoplay="autoplay">
        您的浏览器不支持HTML5
        <source :src="previewPath">
        <!-- 提供默认的播放视频  -->
      </video>
    </el-dialog>
  </div>
</template>
<script>
import {
  add_template, //新增模板
  getSimulation, //获取仿真资源列表
  get_chapters, //获取所有章
  get_unit_list, //获取所有节
  get_all_materials, //获取所有学习资料
  get_materials_by_unit, //根据节获取学习资料
  uploadFile, // 上传
  getTemplate,//获取模板详情
  getResource_by_id,
  download,//下载
} from "@/API/api";
import Examine from "../views/Examine";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      dimensionality: {//go2d对象
        simType: "",
        name: "",
        typeName: "",
        type: "",
        id: "",
        look: false
      },

      tasks: {//go3d对象
        taskExperimentId: '',
        id: "",
        name: "",
        path: "",
        type: "",
        look: false,
        expTypeId: ''
      },
      innerVisibleNewpdf: false,
      innerVisiblevideo: false,
      previewPath: '',
      restaurantsPdf: [],
      restaurantsWord: [],
      restaurantsAll: [],
      restaurants: [],
      id: null,
      /**
       * 模板名称
       */
      newName: "", //实验模板名称

      /**
       * 要求
       */
      textarea: "", //要求输入框

      /**
       * 实验指导书
       */

      fileArrayPDF: [], //筛选的pdf文件
      addFilelable: {
        path: "",
        name: "",
        id: "",
        stem: "" //是从课程资源库增加还是上传的文件
      }, //实验指导书已选择的资源

      /**
       * 实验报告模板
       */

      fileArrayWord: [], //筛选的word文件
      addFilelableTwo: {
        name: "",
        id: "",
        stem: "" //是从课程资源库增加还是上传的文件
      }, //实验报告模板已选择的资源

      /**
       * 仿真实验题附件
       */
      tableData1: [], //仿真实验题附件表格数据
      simulationsData: [], //新建时上传到后台的仿真实验题附件

      /**
       * 参考附件
       */
      tableData2: [], //参考附件表格数据
      fileArray: [], //课程资源库所有文件
      AnnexTemplateData: [], //新建时上传到后台的参考附件

      /**
       * 从课程资源库增加模态框
       */
      addDialogVisible: false, //从课程资源库增加模态框是否显示
      typeFlag: "", //从课程资源库增加资源到哪个位置的标识
      chapterSelectData: [], //章下拉框内容
      zhangSelectValue: "", //已选择的章内容
      unitData: [], //节下拉框内容
      jieSelectValue: "", //节选择的章内容
      addfileArray: [], //资料下拉框内容
      fileSearchValue: {
        //搜索文件已选择的内容
        id: "",
        name
      },
      fileSelectValue: {
        //章节下拉框已选择的文件内容
        id: "",
        name
      },
      fileAddValue: {
        //添加内容已选择的文件内容
        id: "",
        name
      },
      //fileSelectValue: "", //已选择的文件内容

      /**
       * 仿真资源库增加模态框
       */
      addSimulationVisible: false, //仿真资源库增加弹出框是否显示
      flag: "", //添加仿真资源库到哪里(仿真实验题附件/参考附件)
      simulationResourcesAll: [], //我的仿真资源和内置仿真资源
      addSimulationResourcesValue: "",//从仿真资源库增加当前选中值
      addexperimentalStation: false,//试验台弹出框是否显示
      loading:false,  //是否保存中
    };
  },
  components: {
    // Unity3D,
    Examine
  },
  props: {
    row: Object,
    isshow: Object,
    addOrEditFlag: Number
  },
  methods: {
    // 查看
    lookover(row) {
      if (row.id == '') {
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
          this.tasks.id = row.id;
          this.tasks.name = row.name;
          this.tasks.type = row.typeName;
          this.tasks.look = true;
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
          // var cmd = "{'opcode':7,'path':'" + path + "'}";
          // wfapp.start(cmd);

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
    // pdf到详情页面
    handleChange(name, path) {
      this.innerVisibleNewpdf = true;
      if (name != "" && path != "") {
        this.goExamine(name, path);
      } else {
        this.$message.error({
          message: "资源名称或路径不能为空"
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

    go2D(row) {
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
              // type: "info",
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
    // 下载文件
    download33(path, name) {
      download({
        name: name,
        url: path,
      }).then(res => {
        const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, name);
      })
    },
    savePreservation() {
      this.otherAnnexsUpload1(0);//其他附件提交
    },
    otherAnnexsUpload1(item) {
      let length = this.tableData2.length;
      if (item < length) {
        if (this.tableData2[item].file != undefined) {
          let fd = new FormData();
          fd.append("file", this.tableData2[item].file); //传文件
          fd.append("type", "annex");
          uploadFile(fd).then(res => {
            this.tableData2[item].id = res.data.object.id;
            this.tableData2[item].path = res.data.object.path;
            this.tableData2[item].stem = "upload";
            this.tableData2[item].expTypeId = "";
            this.tableData2[item].typeId = "";
            if (item == length) {
              return true
            }
            this.otherAnnexsUpload1(item + 1);
          });
        } else {
          this.otherAnnexsUpload1(item + 1);
        }
      } else if (length == 0 || item == length) {
        this.Preservation();
      }
    },
    //新建保存
    Preservation() {
   
      if (this.newName == '') {
        this.$message({
          message: "请输入模板名称",
          type: "warning"
        });
      } else {
           this.loading=true;
        for (var i = 0; i < this.tableData1.length; i++) {
          this.simulationsData.push({
            id: this.tableData1[i].id,
            name: this.tableData1[i].name,
            path: this.tableData1[i].path,
            stem: this.tableData1[i].stem,
            typeId: this.tableData1[i].typeId,
            expTypeId: this.tableData1[i].expTypeId
          });
        }
        for (var i = 0; i < this.tableData2.length; i++) {
          this.AnnexTemplateData.push({
            id: this.tableData2[i].id,
            name: this.tableData2[i].name,
            path: this.tableData2[i].path,
            stem: this.tableData2[i].stem,
            typeId: this.tableData2[i].typeId,
            expTypeId: this.tableData2[i].expTypeId
          })
        }
        add_template({
          id: this.id,
          name: this.newName,
          description: this.textarea,
          guide: {
            id: this.addFilelable.id,
            stem: this.addFilelable.stem,
          },
          report: {
            id: this.addFilelableTwo.id,
            stem: this.addFilelableTwo.stem,
          },
          simulations: this.simulationsData,
          annexs: this.AnnexTemplateData
        }).then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
          this.$emit('detpage')
        });
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !=
          -1
        );
      };
    },
    //从课程资源库增加模态框中搜索框选择时触发此函数
    handleSelect(item) {
      this.fileAddValue.id = this.fileSearchValue.id = item.address;
      this.fileAddValue.name = this.fileSearchValue.name = item.value;
    },
    /**
     * 从课程资源库增加资源按钮
     */
    addCourseResourcesButton(typeFlag) {
      this.chapterSelectData = [];//章下拉框清空
      this.unitData = [];//节下拉框清空
      this.addfileArray = [];//资料下拉框清空
      this.jieSelectValue = "";//节选择的章内容  
      this.zhangSelectValue = "";//章下拉框内容
      this.fileSelectValue = { id: '', name: '' }; //下拉框内容
      this.fileSearchValue = { id: '', name: '' }; //搜索框内容
      this.fileAddValue = { id: '', name: '' }; //添加框内容
      this.addDialogVisible = true;//从课程资源库增加模态框
      this.typeFlag = typeFlag;
      this.get_chaptersAll(); //获取所有章
      this.getAllMaterials(); //获取所有学习资料
    },
    //获取所有章
    get_chaptersAll() {
      get_chapters().then(res => {
        if (res.data.code == 0) {
          this.chapterSelectData = res.data.object;
        }
      });
    },
    //获取所有节
    get_unit_list_all(chapterId) {
      get_unit_list({
        chapterId: chapterId
      }).then(res => {
        if (res.data.code == 0) {
          this.jieSelectValue = "";
          this.fileSelectValue = { id: '', name: '' };
          this.addfileArray = [];
          this.unitData = res.data.object;
        }
      });
    },
    //获取所有学习资料
    getAllMaterials() {
      get_all_materials({
        offset: 0,
        limit: 100
      }).then(res => {
        if (res.data.code == 0) {
          var obj = res.data.object;
          this.fileArrayPDF = [];
          this.fileArrayWord = [];
          this.fileArray = [];
          this.restaurantsPdf = [];
          this.restaurantsWord = [];
          this.restaurantsAll = [];
          for (var i = 0; i < obj.length; i++) {
            let fileName = obj[i].name.lastIndexOf("."); //取到文件名开始到最后一个点的长度
            let fileNameLength = obj[i].name.length; //取到文件名长度
            let fileFormat = obj[i].name.substring(
              fileName + 1,
              fileNameLength
            ); //截
            this.fileArray.push(obj[i]);
            this.restaurantsAll.push({
              value: obj[i].name,
              address: obj[i].id
            });
            if (fileFormat == "pdf" || fileFormat == "PDF") {
              this.fileArrayPDF.push(obj[i]);
              this.restaurantsPdf.push({
                value: obj[i].name,
                address: obj[i].id
              });
            } else if (
              fileFormat == "DOCX" ||
              fileFormat == "docx" ||
              fileFormat == "DOC" ||
              fileFormat == "doc"
            ) {
              this.fileArrayWord.push(obj[i]);
              this.restaurantsWord.push({
                value: obj[i].name,
                address: obj[i].id
              });
            }
          }
          if (this.typeFlag == 1) {
            this.fileSelectValue = { id: '', name: '' };
            this.addfileArray = this.fileArrayPDF;
            this.restaurants = this.restaurantsPdf;
          } else if (this.typeFlag == 2) {
            this.addfileArray = this.fileArrayWord;
            this.restaurants = this.restaurantsWord;
          } else if (this.typeFlag == 3) {
            this.addfileArray = this.fileArray;
            this.restaurants = this.restaurantsAll;
          }
        }
      });
    },
    //根据节获取学习资料
    get_materials_by_unit(unitId) {
      this.chapterResetId = unitId;
      this.chapterType = 3;
      get_materials_by_unit({
        unitId: unitId,
        offset: 0,
        limit: 50
      }).then(res => {
        if (res.data.code == 0) {
          var obj = res.data.object;
          this.fileArrayPDF = [];
          this.fileArrayWord = [];
          this.fileArray = [];
          for (var i = 0; i < obj.length; i++) {
            let fileName = obj[i].name.lastIndexOf("."); //取到文件名开始到最后一个点的长度
            let fileNameLength = obj[i].name.length; //取到文件名长度
            let fileFormat = obj[i].name.substring(
              fileName + 1,
              fileNameLength
            ); //截
            this.fileArray.push(obj[i]);
            if (fileFormat == "pdf" || fileFormat == "PDF") {
              this.fileArrayPDF.push(obj[i]);
            } else if (
              fileFormat == "DOCX" ||
              fileFormat == "docx" ||
              fileFormat == "DOC" ||
              fileFormat == "doc"
            ) {
              this.fileArrayWord.push(obj[i]);
            }
          }
          if (this.typeFlag == 1) {
            this.fileSelectValue = { id: '', name: '' };
            this.addfileArray = this.fileArrayPDF;
            this.restaurants = this.restaurantsPdf;
          } else if (this.typeFlag == 2) {
            this.addfileArray = this.fileArrayWord;
            this.restaurants = this.restaurantsWord;
          } else if (this.typeFlag == 3) {
            this.addfileArray = this.fileArray;
            this.restaurants = this.restaurantsAll;
          }
        }
      });
    },
    //下拉选择文件后，将文件添加到添加内容输入框
    addFileInput(id) {
      for (var i = 0; i < this.addfileArray.length; i++) {
        if (this.addfileArray[i].id == id) {
          this.fileAddValue = { id: this.addfileArray[i].id, name: this.addfileArray[i].name };
        }
      }
    },
    //选择完资源文件确认添加到输入框
    addFile5() {
      if (this.typeFlag == 1) {//=1 实验指导书模态框        
        this.addFilelable.name = this.fileAddValue.name;
        this.addFilelable.id = this.fileAddValue.id;
        this.addFilelable.stem = 'course';//course表示实验指导书从课程资源库选择
      } else if (this.typeFlag == 2) {//=2 实验报告模板模态框
        this.addFilelableTwo.name = this.fileAddValue.name;
        this.addFilelableTwo.id = this.fileAddValue.id;
        this.addFilelableTwo.stem = 'course';//course表示实验指导书从课程资源库选择
        //   }
        // }
      } else if (this.typeFlag == 3) {//=3 参考附件模态框
        this.tableData2.push({
          id: this.fileAddValue.id,
          name: this.fileAddValue.name,
          path: '',
          typeName: this.fileAddValue.name.substring(this.fileAddValue.name.lastIndexOf(".") + 1, this.fileAddValue.name.length),
          stem: 'course',
          expTypeId: '',
          typeId: ''
        });
      }
      this.addDialogVisible = false; //模态框关闭
    },
    //模态框点击取消按钮
    addFileFalse() {
      this.addDialogVisible = false; //模态框关闭
    },
    // 上传文件
    beforeUploadFile(file, id, item) {
      let fd = new FormData();
      fd.append("file", file); //传文件
      if (this.typeFlag == 1) {
        fd.append("type", "guide");
      } else if (this.typeFlag == 2) {
        fd.append("type", "report");
      }
      uploadFile(fd).then(res => {
        let url = res.data.object.path;
        let source = url.substring(url.lastIndexOf(".") + 1, url.length);
        if (this.typeFlag == 1) {
          // 实验指导书
          if (source == "pdf" || source == "PDF") {
            this.addFilelable.name = res.data.object.name;
            this.addFilelable.id = res.data.object.id;
            this.addFilelable.stem = "upload"; //upload表示课程指导书是文件上传方式
            this.$message({
              message: "上传实验指导成功",
              type: "success"
            });
          } else {
            this.$message.error("仅限上传pdf格式，上传失败");
          }
        } else if (this.typeFlag == 2) {
          // 实验报告模板
          if (
            source == "DOCX" ||
            source == "docx" ||
            source == "DOC" ||
            source == "doc"
          ) {
            this.addFilelableTwo.name = res.data.object.name;
            this.addFilelableTwo.id = res.data.object.id;
            this.addFilelableTwo.stem = "upload"; //upload表示课程指导书是文件上传方式
            this.$message({
              message: "上传实验报告成功",
              type: "success"
            });
          } else {
            this.$message.error("仅限上传word格式，上传失败");
          }
        } else {
          this.$message.error("上传失败");
        }
      });
      return false; //屏蔽了action的默认上传
    },
    // 点击删除按钮 实验指导书 内容清空
    deleteContent() {
      this.addFilelable.name = "";
      this.addFilelable.id = "";
      this.addFilelable.stem = "";
    },
    // 点击删除按钮 实验报告模板清空
    deleteContentTwo() {
      this.addFilelableTwo.name = "";
      this.addFilelableTwo.id = "";
      this.addFilelableTwo.stem = "";
    },
    //从仿真资源库增加按钮
    addingSimulation(flag) {
      this.addSimulationVisible = true;
      this.flag = flag; //从课程资源库增加，标记是添加到仿真实验题附件还是参考附件
      this.simulationResourcesAll = []; //清空我的仿真资源列表和内置仿真资源列表
      this.mySimulationResources(); // 获取我的仿真资源列表
      this.innerSimulationResources(); // 获取内置仿真资源列表
    },
    // 获取我的仿真资源列表
    mySimulationResources() {
      getSimulation({
        offset: 0,
        limit: 50,
        inner: false
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.simulationResourcesAll.push(res.data.object[i]);
        }
      });
    },
    // 获取内置仿真资源列表
    innerSimulationResources() {
      getSimulation({
        offset: 0,
        limit: 50,
        inner: true
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.simulationResourcesAll.push(res.data.object[i]);
        }
      });
    },
    //从仿真资源库增加确定按钮
    addSimulationResources() {
      this.addSimulationVisible = false; //关闭弹出框
      for (var i = 0; i < this.simulationResourcesAll.length; i++) {
        //将选中的仿真资源添加到仿真实验题附件列表
        if (
          this.addSimulationResourcesValue == this.simulationResourcesAll[i].id
        ) {
          if (this.flag == 1) {
            this.tableData1.push({
              id: this.simulationResourcesAll[i].id,
              name: this.simulationResourcesAll[i].name,
              path: this.simulationResourcesAll[i].path,
              typeName: this.simulationResourcesAll[i].typeName,
              stem: "simulation", //从仿真资源库增加仿真实验题附件
              typeId: this.simulationResourcesAll[i].typeId,
              expTypeId: this.simulationResourcesAll[i].expTypeId,
              simType: this.simulationResourcesAll[i].simType
            });
          } else if (this.flag == 2) {
            this.tableData2.push({
              id: this.simulationResourcesAll[i].id,
              name: this.simulationResourcesAll[i].name,
              path: this.simulationResourcesAll[i].path,
              typeName: this.simulationResourcesAll[i].typeName,
              expTypeId: this.simulationResourcesAll[i].expTypeId,
              typeId: this.simulationResourcesAll[i].typeId,
              stem: "simulation", //从仿真资源库增加仿真实验题附件
              simType: this.simulationResourcesAll[i].simType,
            });
          }
        }
      }
      this.addSimulationResourcesValue = ""; //清空弹出框内容
    },
    //从仿真资源库增加取消按钮
    addSimulationResourcesCancel() {
      this.addSimulationVisible = false; //关闭弹出框
      this.addSimulationResourcesValue = ""; //清空弹出框内容
    },
    // 从试验台添加按钮
    experimentalStation() {
      this.addexperimentalStation = true;
    },
    // 从试验台添加取消按钮
    addexperimentalStationcesCancel() {
      this.addexperimentalStation = false;
    },
    // 从试验台添加确定按钮
    addexperimentalStationResources() {
      this.addexperimentalStation = false;
    },
    // 上传仿真资源
    beforeUploadSimulation(file) {
      let fd = new FormData();
      fd.append("file", file); //传文件
      fd.append("type", "simulation");
      uploadFile(fd).then(res => {
        let url = res.data.object.path;
        let source = url.substring(url.lastIndexOf(".") + 1, url.length);
        if (source == "cc3d" || source == "cc2d") {
          this.tableData1.push({
            id: res.data.object.id,
            name: res.data.object.name,
            path: res.data.object.path,
            typeName: res.data.object.typeName,
            stem: "upload", //上传仿真资源库增加仿真实验题附件
            expTypeId: res.data.object.expTypeId,
            expTypeName: res.data.object.expTypeName,
            simType: res.data.object.simType,
            typeId: res.data.object.typeId
          });
          this.$message({
            message: "上传实仿真资源成功",
            type: "success"
          });
        } else {
          this.$message.error("仅限上传.cc3d,.cc2d格式，上传失败");
        }
      });
      return false; //屏蔽了action的默认上传
    },

    // 上传参考附件
    beforeUploadReference(file) {
      this.tableData2.push({
        id: '',
        file: file,
        name: file.name,
        typeName: file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length)
      });

      this.$message({
        message: "上传文件成功",
        type: "success",
        duration:2000
      });
    },
    //上传处理事件
    UploadTheSource(typeFlag) {
      this.typeFlag = typeFlag;
    },
    //删除仿真实验题附件
    deleteTaskFormwork(id) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        for (var i = 0; i < this.tableData1.length; i++) {
          if (this.tableData1[i].id == id) {
            this.tableData1.splice(i, 1);
            break;
          }
        }
      });
    },
    //删除参考附件
    deleteFeferenceAttachments(id) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        for (var i = 0; i < this.tableData2.length; i++) {
          if (this.tableData2[i].id == id) {
            this.tableData2.splice(i, 1);
            break;
          }
        }
      });
    },
    initData() {
      if (this.row.id != undefined && this.row.id != "") {
        let Id = '';
        if (this.row.templateId != null) {
          Id = this.row.templateId;
        } else {
          Id = this.row.id;
        }
        getTemplate({
          id: Id
        }).then(res => {
          console.log(res.data.object);
          
          let data = res.data.object;
          this.id = this.row.id;
          this.newName = data.name;
          this.textarea = data.description;
          let addFilelable = {
            name: data.guideName,
            path: data.guidePath,
            id: data.guideId,
            stem: data.guideStem,
          }
          this.addFilelable = addFilelable;
          let addFilelableTwo = {
            name: data.reportName,
            id: data.reportId,
            stem: data.reportStem
          }
          this.addFilelableTwo = addFilelableTwo;
          this.tableData1 = data.simulations;
          this.tableData2 = data.annexs;
        });
      }
    }
  },
  created() {
    this.initData();
  }
};
</script>
<style lang="less" scoped>
.ffd {
  margin-left: 20px;
  margin-top: 2px;
}
.searchimg {
  width: 100%;
  height: 50px;
  .searchres {
    float: left;
  }
  .searchresmin {
    float: left;
    position: relative;
    width: 250px;
    overflow: hidden;
    .inline-input {
      width: 100%;
      .el-input__inner {
        padding-right: 43px;
        padding-left: 15px;
      }
    }
    img {
      height: 22px;
      width: 20px;
      right: 10px;
      top: 10px;
      position: absolute;
    }
  }
}
.content {
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: 15px;
  .addcontent {
    display: inline-block;
  }
  .inputContent {
    width: 250px;
  }
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
.f18 > :first-child {
  font-size: 16px;
}
.newPop-upBox {
  width: 96%;
  margin: 0 2%;
  height: 100%;
  overflow: hidden;
  .modalFrameTemplateLibrary {
    // height: 78vh;
    height: 90%;
    width: 102%;
    overflow: auto;
    .input-with-select {
      height: 35px;
      width: 244px;
      margin-left: 110px;
      margin-bottom: 20px;
    }
    .modalFrameInputBox {
      min-width: 100px;
      span {
        display: inline;
        line-height: 80px;
        font-family: "微软雅黑";
        font-size: 18px;
      }
      .inputBox {
        margin-left: 145px;
        width: 70.5%;
        font-size: 16px;
        font-family: "微软雅黑";
      }
    }
    .laboratoryInstructions {
      padding-top: 50px;
      .laboratoryBook {
        border: 1px solid #dddddd;
        width: 260px;
        height: 37px;
        padding-left: 8px;
        cursor: pointer;
        margin-left: 105px;
        border-radius: 5px;
        display: inline-block;
      }
      .laboratoryTemplate {
        height: 37px;
        padding-left: 8px;
        padding-right: 20px;
        width: 260px;
        cursor: pointer;
        overflow: hidden;
        margin-left: 80px;
        border-radius: 5px;
        border: 1px solid #dddddd;
        position: relative;
      }
      .upload {
        height: 40px;
      }
      .questions {
        margin-top: 30px;
      }
      .el-icon-close {
        position: absolute;
      }
    }
    .closeButton {
      float: right;
      margin-right: 115px;
    }
    .preservation {
      float: right;
      margin-top: 0px;
      margin-right: 15px;
    }
  }
}
</style>
<style>
.el-input__inner {
  padding-right: 36px;
  padding-left: 15px;
}
</style>


   