<template>
  <div class="box">
    <div class="box-top">
      <!-- 实训名称 -->
      <div>
        <h1 style="text-align: center;">{{name}}</h1>
      </div>
      <!-- 教考练选择 -->
      <div class="paging">
        <div class="grid-content bg-purple" style=" margin-left: 30px;">
          <el-button :type="page==1?'primary': ''" @click="page=1,pagenum()" v-if="isteaching">教学模式</el-button>
          <el-button :type="page==2?'primary': ''" @click="page=2,pagenum()" v-if="ispractice">练习模式</el-button>
          <el-button :type="page==3?'primary': ''" @click="page=3,pagenum()" v-if="isexamine">考核模式</el-button>
        </div>

        <div class="grid-content bg-purple" v-if="isteacher" style="margin-right:30px">
          <div style="width:80px;padding:10px">
            <el-button type="success" round icon="el-icon-plus" @click="dialogVisible=true"></el-button>
          </div>
        </div>
      </div>

      <!-- 教学模式****************************** -->

      <div v-show="page==1?true:false">
        <!-- 实验目的，实验要求，实验原理，相关知识与技能 -->
        <div class="strip" v-for="(item,index) in teaching.descriptions" v-bind:key="item.name">
          <div class="name">
            <p>{{item.name}}：</p>
          </div>
          <div class="value">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入内容"
              :disabled="!isteacher"
              v-model="item.value"
            ></el-input>
          </div>
          <div class="det">
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              @click="detstrip('teaching.descriptions',index)"
              v-if="isteacher"
            ></el-button>
          </div>
        </div>
        <!-- 实验指导书 -->
        <div class="strip">
          <div class="name">
            <p>实验指导书：</p>
          </div>
          <div class="value">
            <div class="btu">
              <el-upload
                v-if="isteacher"
                class="upload-demo"
                action="/img/add_training_resource"
                :before-upload="( file )=>{return uploading( file, 'guidance')}"
              >
                <el-button type="info">点击上传</el-button>
              </el-upload>

              <el-button
                type="info"
                @click="lookwork(teaching.guidancepath,teaching.guidancename)"
              >查看</el-button>
              <el-button
                type="info"
                @click="download(teaching.guidancepath,teaching.guidancename)"
              >下载</el-button>
              <el-button type="info" @click="detguidance()" v-if="isteacher">删除</el-button>
            </div>
            <el-input placeholder="请选择实验指导书" v-model="teaching.guidancename" :disabled="true"></el-input>
          </div>
        </div>
        <!-- 参考附件 -->
        <div class="strip">
          <div class="name">
            <p>参考附件：</p>
          </div>
          <div class="value">
            <div class="btu">
              <el-upload
                v-if="isteacher"
                class="upload-demo"
                action="/img/add_training_resource"
                :before-upload="( file)=>{return uploading(file,'annex')}"
              >
                <el-button type="info">点击上传</el-button>
              </el-upload>
            </div>
            <template>
              <el-table
                :data="teaching.annex"
                stripe
                :header-cell-style="{background:'#ebeffb'}"
                :row-class-name="tableRowClassName"
                style="width: 100%"
              >
                <el-table-column prop="name" label="附件名称" min-width="120"></el-table-column>
                <el-table-column prop="suffix" label="类型" min-width="120"></el-table-column>
                <el-table-column prop="size" label="大小" min-width="120"></el-table-column>

                <el-table-column label="操作" min-width="100">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="lookover(scope.row)">打开查看</el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="download(scope.row.path,scope.row.name)"
                    >下载</el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="detaccessory(scope)"
                      v-if="isteacher"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>

        <!-- 保存 -->
        <div class="save">
          <el-button type="danger" v-if="isteacher" @click="save('teaching')" :loading="isupload">保存</el-button>
        </div>
      </div>

      <!-- 练习模式*********************** -->
      <div v-show="page==2?true:false">
        <!-- 实训内容，实训步骤，实训原理 -->
        <div class="strip" v-for="(item,index) in exercise.descriptions" v-bind:key="item.name">
          <div class="name">
            <p>{{item.name}}：</p>
          </div>
          <div class="value">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入内容"
              :disabled="!isteacher"
              v-model="item.value"
            ></el-input>
          </div>
          <div class="det">
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              @click="detstrip('exercise.descriptions',index)"
              v-if="isteacher"
            ></el-button>
          </div>
        </div>
        <!-- 练习资料 -->
        <div class="strip">
          <div class="name">
            <p>练习资料：</p>
          </div>
          <div class="value">
            <div class="btu">
              <el-upload
                class="upload-demo"
                action="/img/add_training_resource"
                :before-upload="( file)=>{return uploading( file, 'material')}"
              >
                <el-button type="info" v-if="isteacher">点击上传</el-button>
              </el-upload>
            </div>
            <template>
              <el-table
                :data="exercise.material"
                stripe
                :header-cell-style="{background:'#ebeffb'}"
                :row-class-name="tableRowClassName"
                style="width: 100%"
              >
                <el-table-column prop="name" label="名称" min-width="120"></el-table-column>
                <el-table-column prop="suffix" label="类型" min-width="120"></el-table-column>
                <el-table-column prop="size" label="大小" min-width="120"></el-table-column>

                <el-table-column label="操作" min-width="100">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="lookover(scope.row)">打开查看</el-button>
                    <el-button
                      @click="download(scope.row.path,scope.row.name)"
                      type="text"
                      size="small"
                    >下载</el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="detinformation(scope)"
                      v-if="isteacher"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>
        <!-- 实训练习 -->
        <div class="strip">
          <div class="name">
            <p>实训练习：</p>
          </div>
          <div class="value">
            <div class="btu">
              <el-button type="info" @click=" addSimulation('simPractice')" v-if="isteacher">从仿真资源库选择</el-button>
            </div>
            <template>
              <el-table
                :data="exercise.simPractice"
                stripe
                :header-cell-style="{background:'#ebeffb'}"
                :row-class-name="tableRowClassName"
                style="width: 100%"
              >
                <el-table-column prop="simName" label="实训名称" min-width="120"></el-table-column>
                <el-table-column prop="typeName" label="类型" min-width="120"></el-table-column>
                <!-- <el-table-column prop="size" label="大小" min-width="120"></el-table-column> -->

                <el-table-column label="操作" min-width="100">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="lookover(scope.row)">打开查看</el-button>

                    <el-button
                      type="text"
                      size="small"
                      @click="dettrainingPractice(scope)"
                      v-if="isteacher"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>
        <!-- 保存 -->
        <div class="save">
          <el-button type="danger" v-if="isteacher" @click="save('exercise')" :loading="isupload">保存</el-button>
        </div>
      </div>
      <!-- 考核模式************************ -->
      <div v-show="page==3?true:false">
        <!-- 实验要求 -->
        <div class="strip" v-for="(item,index) in examine.descriptions" v-bind:key="item.name">
          <div class="name">
            <p>{{item.name}}：</p>
          </div>
          <div class="value">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入内容"
              :disabled="!isteacher"
              v-model="item.value"
            ></el-input>
          </div>
          <div class="det">
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              @click="detstrip('examine.descriptions',index)"
              v-if="isteacher"
            ></el-button>
          </div>
        </div>
        <!-- 实训报告 -->
        <div class="strip">
          <div class="name">
            <p>实验报告：</p>
          </div>
          <div class="value">
            <div class="btu">
              <el-upload
                class="upload-demo"
                action="/img/add_training_resource"
                :before-upload="( file )=>{return uploading( file, 'report')}"
              >
                <el-button type="info" v-if="isteacher">点击上传</el-button>
                  <el-button type="info" v-if="isstudent">点击上传</el-button>
              </el-upload>

              <el-button type="info" @click="lookwork(examine.reportpath,examine.reportname)">查看</el-button>
              <el-button type="info" @click="download(examine.reportpath,examine.reportname)">下载</el-button>
              <el-button type="info" @click="detreport()" v-if="isteacher">删除</el-button>
            </div>
            <el-input placeholder="请选择实验报告" v-model="examine.reportname" :disabled="true"></el-input>
          </div>
        </div>
        <!-- 实训考核 -->
        <div class="strip">
          <div class="name">
            <p>实训考核：</p>
          </div>
          <div class="value">
            <div class="btu">
              <el-button type="info" @click="addSimulation('simExam')" v-if="isteacher">从仿真资源库选择</el-button>
            </div>
            <template>
              <el-table
                :data="examine.simExam"
                stripe
                :header-cell-style="{background:'#ebeffb'}"
                :row-class-name="tableRowClassName"
                style="width: 100%"
              >
                <el-table-column prop="simName" label="实训名称" min-width="120"></el-table-column>
                <el-table-column prop="typeName" label="类型" min-width="120"></el-table-column>
                <!-- <el-table-column prop="size" label="大小" min-width="120"></el-table-column> -->

                <el-table-column label="操作" min-width="100">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="lookover(scope.row)">打开查看</el-button>

                    <el-button
                      type="text"
                      size="small"
                      @click="dettrainingEvaluation(scope)"
                      v-if="isteacher"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>
        <!-- 成绩查看 -->
        <div class="strip" v-if="isapproved">
          <div class="name">
            <p>评分评语：</p>
          </div>
          <div class="value">
            <div class="btu">
              <p>
                <span style="font-size:18px">分数：</span>
                <span style="font-size:18px">{{score}}</span>
              </p>
            </div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入内容"
              :disabled="true"
              v-model="comment"
            ></el-input>
          </div>
        </div>

        <!-- 保存 -->
        <div class="save">
          <el-button type="danger" v-if="isteacher" @click="save('examine')" :loading="isupload">保存</el-button>
          <el-button
            type=" success"
            v-if="isstudent"
            style="margin:0 10px;"
            @click="saveorsubmittask('save')"
          >保存</el-button>
          <el-button type="danger" v-if="isstudent" @click="  submitstudent() ">提交</el-button>
        </div>
      </div>
      <!-- 考核模式end************************ -->
    </div>
    <!-- 弹出层************************ -->
    <!-- 新增类 -->
    <el-dialog
      title="新增内容"
      :visible.sync="dialogVisible"
      width="60%"
      @open="addvalue"
      close-on-press-escape
    >
      <div>
        <div class="strip">
          <div class="name">
            <p>添加新内容的名称：</p>
          </div>
          <div class="value">
            <el-input v-model="addinput.name" placeholder="请输入名称"></el-input>
          </div>
        </div>
        <div class="strip">
          <div class="name">
            <p>添加新内容的内容：</p>
          </div>
          <div class="value">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, }"
              placeholder="请输入内容"
              v-model="addinput.value"
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="info" @click="addstrip()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 从仿真资源库添加弹窗 -->
    <el-dialog
      :visible.sync="addSimulationVisible"
      append-to-body
      width="25%"
      top="15vh"
      title="仿真资源库"
      class="modify"
    >
      仿真资源库：
      <el-select v-model="addSimulationResourcesValue" placeholder="请选择" style="width:70%;">
        <el-option
          v-for="(item,index) in simulationResourcesAll"
          :key="item.id"
          :label="item.name"
          :value="index"
          :disabled="item.disabled"
        ></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="info"
          size="mini"
          @click="addSimulationVisible=false"
          class="closeButton"
        >取 消</el-button>
        <el-button
          type="info"
          size="mini"
          @click="addSimulationResources()"
          class="preservation"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 指导文件查看 -->
    <el-dialog width="74%" top="6vh" append-to-body :visible.sync="innerVisibleNewpdf">
      <div style="height:85vh">
        <Examine ref="child" v-if="innerVisibleNewpdf"></Examine>
      </div>
    </el-dialog>
    <!-- 视屏文件查看 -->
    <el-dialog title :visible.sync="innerVisiblevideo">
      <video id="player" width="100%" height="100%" controls autoplay="autoplay">
        您的浏览器不支持HTML5
        <source :src="previewPath" />
        <!-- 提供默认的播放视频  -->
      </video>
    </el-dialog>
  </div>
</template>


<script>
import {
  download,
  getSimulation,
  add_training_resource, //上传文件
  training_details,
  edit_training, //编辑实训内容
  Anarrayofobjects, //处理对象
  get_exam_details, //获取考核内容
  save_or_submit_task, //保存或者提交
  Size //计算大小
} from "../../API/api";
import Examine from "../../views/Examine";
import FileSaver from "file-saver";
export default {
  components: {
    // Unity3D,
    Examine
  },
  data() {
    name: "experimentDetails";
    return {
      page: 1, //类型
      dialogVisible: false,
      innerVisibleNewpdf: false,
      innerVisiblevideo: false,
      addSimulationVisible: false,
      previewPath: "",
      row: "", //接受值
      id: "", //实训id
      type: "", //
      name: "", //实训名称
      isapproved: false, //是否批阅
      score: "", //评分
      comment: "", //评语
      isteaching: true, //是否有练习模式
      ispractice: true, //是否有考核模式
      isexamine: true, //是否有考核
      isstudent: false, //是否使学生
      isteacher: false, //判断是否是老师
      isupload: false, //上传中。
      addSimulationResourcesValue: "", //从仿真资源库添加的内容
      addSimulationResourcestype: "", //从仿真资源库添加的类型
      simulationResourcesAll: [], //从仿真资源库添加
      addinput: {
        index: "",
        name: "",
        value: ""
      },

      teaching: {
        //教学模式
        descriptions: [],
        guidancename: "",
        guidancepath: "",
        guidancefile: "",
        guidanceid: "",
        annex: []
      },
      exercise: {
        //练习模式
        descriptions: [],
        material: [],
        simPractice: []
      },
      examine: {
        //考核模式
        descriptions: [],
        reportname: "",
        reportid: "",
        reportpath: "",
        reportfile: "",

        simExam: []
      },
      tasks: {
        taskExperimentId: ""
      }
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return "warning-row";
      } else if (rowIndex % 2 == 0) {
        return "success-row";
      }
      return "";
    },
    // 打开新增多条弹出框
    addvalue() {
      this.addinput = {
        index: "",
        name: "",
        value: ""
      };
    },

    // 新增类
    addstrip() {
      let addinput = this.addinput;
      if (addinput.name == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "名称不能为空",
          type: "warning"
        });
        return;
      }
      if (this.page == 1) {
        console.log(this.teaching.descriptions);
        this.teaching.descriptions.push({
          name: addinput.name,
          value: addinput.value
        });
      } else if (this.page == 2) {
        this.exercise.descriptions.push({
          name: addinput.name,
          value: addinput.value
        });
      } else if (this.page == 3) {
        this.examine.descriptions.push({
          name: addinput.name,
          value: addinput.value
        });
      }
      this.dialogVisible = false;
    },
    // 删除多条的值
    detstrip(item, index) {
      this.$confirm("此操作将删除该类型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (item == "teaching.descriptions") {
            this.teaching.descriptions.splice(index, 1);
          } else if (item == "exercise.descriptions") {
            this.exercise.descriptions.splice(index, 1);
          } else if (item == "examine.descriptions") {
            this.examine.descriptions.splice(index, 1);
          }
          this.$message({
            type: "success",
            message: "删除成功!",
            duration: 1000
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    },
    // 删除实验指导书
    detguidance() {
      this.$confirm("此操作将删除实验指导书, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.teaching.guidancefile = null;
          this.teaching.guidancename = null;
          this.teaching.guidanceid = null;
          this.teaching.guidancepath = null;
          this.$message({
            type: "success",
            message: "删除成功!",
            duration: 1000
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    },
    //删除参考附件
    detaccessory(row) {
      this.$confirm("此操作将删除附件资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.teaching.annex.splice(row.$index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
            duration: 1000
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    },
    // 删除练习资料
    detinformation(row) {
      this.$confirm("此操作将删除练习资料, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.exercise.material.splice(row.$index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
            duration: 1000
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    },

    // 删除练习资源
    dettrainingPractice(row) {
      this.$confirm("此操作将删除练习资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.exercise.simPractice.splice(row.$index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
            duration: 1000
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    },
    // 删除实验报告
    detreport() {
      this.$confirm("此操作将删除实验报告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.examine.reportname = null;
          this.examine.reportid = null;
          this.examine.reportpath = null;
          this.examine.reportfile = null;
          this.$message({
            type: "success",
            message: "删除成功!",
            duration: 1000
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    },
    //  删除实训考核
    dettrainingEvaluation(row) {
      this.$confirm("此操作将删除实训考核, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.examine.simExam.splice(row.$index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
            duration: 1000
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    },

    //从仿真资源库添加
    addSimulation(type) {
      this.addSimulationResourcesValue = "";
      this.simulationResourcesAll = [];
      this.addSimulationResourcestype = type;
      this.addSimulationVisible = true;
      this.mySimulationResources(); // 获取我的仿真资源列表
      // this.innerSimulationResources(); // 获取内置仿真资源列表
    },
    // 判断添加的是练习还是考核
    addSimulationResources() {
      if (this.addSimulationResourcestype == "") {
        this.$message({
          type: "info",
          message: "不确定添加位置。"
        });
        return;
      } else if (this.addSimulationResourcestype == "simPractice") {
        let row = this.simulationResourcesAll[this.addSimulationResourcesValue];
        row.simName = row.name;
        this.exercise.simPractice.push(row);
        this.addSimulationResourcesValue = "";
        this.addSimulationVisible = false;
      } else if (this.addSimulationResourcestype == "simExam") {
        let row = this.simulationResourcesAll[this.addSimulationResourcesValue];
        row.simName = row.name;
        this.examine.simExam = [];
        this.examine.simExam.push(row);
        this.addSimulationResourcesValue = "";
        this.addSimulationVisible = false;
      }
    },

    // 保存
    save(type) {
      // 保存类型
      console.log(type, "保存");
      this.isupload = true;
      // 老师教学模式
      if (type == "teaching") {
        // 先上传实验指导书
        console.log("上传实验指导书", this.teaching.guidancefile);
        if (
          this.teaching.guidancefile != "" &&
          this.teaching.guidancefile != null &&
          this.teaching.guidancefile != undefined
        ) {
          this.$message({
            showClose: true,
            message: "正在上传实验指导书",

            duration: 1000
          });
          let fd = new FormData();
          fd.append("file", this.teaching.guidancefile); //传文件
          fd.append("type", "guide"); //传类型
          add_training_resource(fd).then(res => {
            console.log(res);
            if (res.data.code == "0") {
              this.$message({
                showClose: true,
                message: "实验指导书上传成功",
                type: "success",
                duration: 1000
              });
              this.teaching.guidancefile = "";
              this.teaching.guidanceid = res.data.object;
              // 再上传附件资料
              this.uploadClass(this.teaching.annex, "annex", "teaching");
            }
          });
        } else {
          // 再上传附件资料
          this.uploadClass(this.teaching.annex, "annex", "teaching");
        }
      }

      // 老师练习模式
      if (type == "exercise") {
        // 上传练习资料
        this.uploadClass(this.exercise.material, "material", "exercise");
      }

      // 考核提交
      if (type == "examine") {
        // 上传实验报告
        if (
          this.examine.reportfile != "" &&
          this.examine.reportfile != null &&
          this.examine.reportfile != undefined
        ) {
          let fd = new FormData();
          fd.append("file", this.examine.reportfile); //传文件
          fd.append("type", "report"); //传类型
          add_training_resource(fd).then(res => {
            if (res.data.code == 0) {
              // console.log(res);
              this.$message({
                showClose: true,
                message: "实验报告上传成功",
                type: "success",
                duration: 1000
              });
              this.examine.reportid = res.data.object;
              this.examine.reportfile = "";
              edit_training({
                trainingId: this.id, //实训id
                mode: "EXAM", //模式
                description: this.examine.descriptions, //说明
                report:
                  this.examine.reportid == null
                    ? null
                    : [this.examine.reportid], //实验报告
                examSim: Anarrayofobjects(this.examine.simExam, "id") //实训考核
              }).then(res => {
                // console.log(res);
                if (res.data.code == "0") {
                  this.$message({
                    showClose: true,
                    message: "保存成功",
                    type: "success",
                    duration: 1000
                  });
                  this.trainingdetails();
                }
              });
            }
            this.isupload = false;
          });
        } else {
          edit_training({
            trainingId: this.id, //实训id
            mode: "EXAM", //模式
            description: this.examine.descriptions, //说明
            report:
              this.examine.reportid == null ? null : [this.examine.reportid], //实验报告
            examSim: Anarrayofobjects(this.examine.simExam, "id") //实训考核
          }).then(res => {
            // console.log(res);
            if (res.data.code == "0") {
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success",
                duration: 1000
              });
              this.trainingdetails();
            }
            this.isupload = false;
          });
        }
      }
    },
    // 列表上传
    uploadClass(row, type, source, i) {
      let oldrow = row;
      let length = row.length;
      if (i == null || i == "") {
        i = 0;
      }
      console.log(i, row);
      // console.log(oldrow[i]);
      if (
        i < length &&
        row[i].file != "" &&
        row[i].file != null &&
        row[i].file != undefined &&
        row.length > 0
      ) {
        this.$message({
          showClose: true,
          message:
            "正在上传文件" + i + "/" + row.length + "中，请不要关闭当前页面。",
          duration: 3000
        });
        let fd = new FormData();
        fd.append("file", row[i].file); //传文件
        fd.append("type", type); //传类型
        add_training_resource(fd).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            oldrow[i].file = "";
            oldrow[i].id = res.data.object;
            this.$message({
              showClose: true,
              message: "文件" + i + "/" + row.length + "上传成功",
              type: "success",
              duration: 1000
            });
          }

          if (i < length) {
            this.uploadClass(oldrow, type, source, i + 1);
          }
        });
      } else {
        if (i < length) {
          this.uploadClass(oldrow, type, source, i + 1);
        }
      }
      if (i == row.length || row.length == 0) {
        if (row.length == 0) {
          this.$message({
            showClose: true,
            message: "文件上传成功",
            type: "success",
            duration: 1000
          });
        }
        if (source == "teaching") {
          // console.log(oldrow);
          this.teaching.annex = oldrow;
          // console.log("上传", this.teaching.annex);
          // console.log(Anarrayofobjects(oldrow, "id"));
          // return;
          // console.log([this.teaching.guidanceid]);
          edit_training({
            trainingId: this.id, //实训id
            mode: "TEACHING", //模式
            description: this.teaching.descriptions, //说明
            guide:
              this.teaching.guidanceid == null
                ? null
                : [this.teaching.guidanceid],
            annex: Anarrayofobjects(this.teaching.annex, "id") //参考附件
          }).then(res => {
            // console.log(res);
            if (res.data.code == "0") {
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success",
                duration: 1000
              });
              this.trainingdetails();
            }
            this.isupload = false;
          });
        } else if (source == "exercise") {
          this.exercise.material = oldrow;

          edit_training({
            trainingId: this.id, //实训id
            mode: "PRACTICE", //模式
            description: this.exercise.descriptions, //说明
            practiceSim: Anarrayofobjects(this.exercise.simPractice, "id"), //实训练习
            material: Anarrayofobjects(this.exercise.material, "id") //练习资料
          }).then(res => {
            // console.log(res);
            if (res.data.code == "0") {
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success",
                duration: 1000
              });
              this.trainingdetails();
            }
            this.isupload = false;
          });
        }
        //再次保存
        // this.save(source)
      }
    },

    // 上传文件钩子---
    uploading(file, type) {
      console.log(file, type);
      let sort = file.name.split(".")[1];
      let size = Size(file.size);
      if (size == "0") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "不允许空文件上传。",
          type: "warning"
        });
        return;
      }
      // console.log(size);
      if (type == "guidance") {
        //指导书
        if (sort == "pdf" || sort == "PDF") {
          this.teaching.guidancefile = file;
          this.teaching.guidancename = file.name;
          this.teaching.guidanceid = null;
          this.teaching.guidancepath = null;
        } else {
          this.$message.error({
            showClose: true,
            duration: 2000,
            message: "实验指导书只能上传pdf格式文件。",
            type: "warning"
          });
          return;
        }
      } else if (type == "annex") {
        //参考附件
        this.teaching.annex.push({
          name: file.name,
          suffix: sort,
          size: size,
          file: file,
          id: ""
        });
      } else if (type == "material") {
        //练习资料
        this.exercise.material.push({
          name: file.name,
          suffix: sort,
          size: size,
          file: file,
          id: ""
        });
      } else if (type == "report") {
        //老师实验报告
        if (this.isteacher) {
          if (
            sort == "docx" ||
            sort == "DOCX" ||
            sort == "doc" ||
            sort == "DOC"
          ) {
            console.log(this.examine);
            this.examine.reportname = file.name;
            this.examine.reportfile = file;
            this.examine.reportid = null;
            this.examine.reportpath = null;
          } else {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: "实验报告模板只能上传docx格式文件。",
              type: "warning"
            });
            return;
          }
        } else {
          //学生提交实验报告
          if (sort == "pdf" || sort == "PDF") {
            this.examine.reportname = file.name;
            this.examine.reportfile = file;
          } else {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: "考核实验报告只能上传pdf格式文件。",
              type: "warning"
            });
            return;
          }
        }
      }
    },
    // 下载文件
    download(path, name) {
      console.log(path, name);
      if (
        path == "" ||
        name == "" ||
        path == null ||
        name == null ||
        path == undefined ||
        name == undefined
      ) {
        this.$message.error({
          showClose: true,
          duration: 2000,
          message: "文件路径错误，请上传后下载。",
          type: "warning"
        });
        return;
      }
      download({
        name: name,
        url: path
      }).then(res => {
        console.log(res);
        const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, name);
      });
    },
    // 查看
    lookover(row) {
      console.log(row);
      if (row.id == "" || row.path == "") {
        this.$confirm("新上传的文件请先保存后查看此文件", "提示", {
          confirmButtonText: "确定",
          type: "info"
        });
      } else {
        if (row.alias == "2d") {
          this.dimensionality.id = row.id;
          this.dimensionality.name = row.name;
          this.dimensionality.type = row.typeName;
          this.dimensionality.look = false;
          this.go2D(this.dimensionality);
        } else if (row.alias == "3d") {
          this.tasks.id = row.simId;
          this.tasks.name = row.name;
          this.tasks.type = row.typeName;
          this.tasks.look = true;
          this.tasks.taskExperimentId = this.id;
          this.go3D(this.tasks);
        } else if (row.simType == "3d") {
          this.tasks.id = row.id;
          this.tasks.name = row.name;
          this.tasks.type = row.typeName;
          this.tasks.look = true;
          this.tasks.taskExperimentId = this.id;
          this.go3D(this.tasks);
        } else if (row.suffix == "pdf" || row.suffix == "PDF") {
          this.innerVisibleNewpdf = true;
          this.handleChange(row.name, row.path);
        } else if (
          row.suffix == "gif" ||
          row.suffix == "jpg" ||
          row.suffix == "jpeg" ||
          row.suffix == "png" ||
          row.suffix == "tif"
        ) {
          this.innerVisibleNewpdf = true;
          this.handleChange(row.name, row.path);
        } else if (
          row.suffix == "AVI" ||
          row.suffix == "avi" ||
          row.suffix == "MOV" ||
          row.suffix == "QT" ||
          row.suffix == "ASF" ||
          row.suffix == "RM" ||
          row.suffix == "NAVI" ||
          row.suffix == "DivX" ||
          row.suffix == "MPEG" ||
          row.suffix == "MPG" ||
          row.suffix == "DAT" ||
          row.suffix == "mp4" ||
          row.suffix == "wmv"
        ) {
          var cmd = "{'opcode':7,'path':'" + row.path + "'}";
          console.log(cmd, "视屏发送");
          wfapp.start(cmd);

          // this.previewPath = row.path;
          // this.innerVisiblevideo = true;
        } else {
          this.$confirm("文件暂不支持，请下载", "提示", {
            confirmButtonText: "确定",
            type: "info"
          });
        }
      }
    },

    // 实验指导书和实验报告查看
    lookwork(path, name) {
      console.log(path, name);
      if (path == "" || name == "" || path == undefined || path == null) {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "名称或文件路径不能为空,请先保存后查看"
        });
        return;
      }

      let sort = path.split(".");
      sort = sort[sort.length - 1];
      if (sort == "pdf" || sort == "PDF") {
        this.handleChange(name, path);
      } else {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "仅支持pdf格式的文件，请下载查看"
        });
        return;
      }
    },
    // pdf到详情页面
    handleChange(name, path) {
      if (name != "" && path != "" && name != null && path != null) {
        this.innerVisibleNewpdf = true;
        this.goExamine(name, path);
      } else if (path == "") {
        this.$confirm("新上传的文件请先保存后查看此文件", "提示", {
          confirmButtonText: "确定",
          type: "info"
        });
      } else {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "资源名称或路径不能为空"
        });
        this.innerVisibleNewpdf = false;
        return;
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
              showClose: true,
              duration: 1000,
              type: "info",
              message: "已取消删除"
            });
          });
        return;
      }

      if ((row.type == "" || row.name == "") && row.id == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
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
              showClose: true,
              message: "删除失败！",
              duration: 1000
            });
            this.$message({
              showClose: true,
              message: "已取消删除",
              duration: 1000
            });
          });
        return;
      }
      if ((row.type == "" || row.name == "") && row.id == "") {
        this.$message.error({
          showClose: true,
          message: "没有名称或类型",
          duration: 1000
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

        this.row.page = this.page;
        sessionStorage.setItem(
          "TrainingModule",
          JSON.stringify({
            row: this.row
          })
        );
        this.$emit("handleSelect", 11);
        this.$router.push("/relayteacher/Dimension3");
      }
    },
    //学生提交实验报告
    submitstudent() {
      this.$confirm("提交后将不可更改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.saveorsubmittask("submit");
        })
        .catch(() => {
          return false;
        });
    },
    //学生保存实验报告
    saveorsubmittask(type) {
      if (
        this.examine.reportfile != "" &&
        this.examine.reportfile != null &&
        this.examine.reportfile != undefined
      ) {
        this.isupload = true;
        let fd = new FormData();
        fd.append("file", this.examine.reportfile); //传文件
        fd.append("type", "reports"); //传类型
        add_training_resource(fd).then(res => {
          if (res.data.code == 0) {
            // console.log(res);
            this.$message({
              showClose: true,
              message: "实验报告上传成功",
              type: "success",
              duration: 1000
            });
            this.examine.reportid = res.data.object;
            this.examine.reportfile = "";
            save_or_submit_task({
              taskId: this.row.id, //任务id
              accountTaskId: this.row.accountTaskId, // accountTaskId
              operating: type, // 操作  save  或  submit
              reportId: this.examine.reportid // 报告id
            }).then(res => {
              // console.log(res);
              if (res.data.code == "0") {
                this.$message({
                  showClose: true,
                  message: type == "save" ? "保存成功" : "提交成功",
                  type: "success",
                  duration: 1000
                });
                this.trainingdetails();
              } else {
                this.$message.error({
                  showClose: true,
                  message: res.data.msg,
                  duration: 1000
                });
              }
            });
          } else {
            this.$message.error({
              showClose: true,
              message: res.data.msg,
              duration: 1000
            });
          }
          this.isupload = false;
        });
      } else {
        let sort = "";
        if (this.examine.reportid == "" || this.examine.reportid == null) {
          sort = "pdf";
        } else {
          sort = this.examine.reportpath.split(".");
          sort = sort[sort.length - 1];
        }
        console.log(sort);
        if (sort != "pdf" && sort != "PDF" && type == "submit") {
          this.$message.error({
            showClose: true,
            message: "不能提交空实验报告",
            duration: 1000
          });

          return;
        }

        save_or_submit_task({
          taskId: this.row.id, //任务id
          accountTaskId: this.row.accountTaskId, // accountTaskId
          operating: type, // 操作  save  或  submit
          reportId: sort == "pdf" || sort == "PDF" ? this.examine.reportid : "" // 报告id
        }).then(res => {
          if (res.data.code == "0") {
            this.$message({
              showClose: true,
              message: type == "save" ? "保存成功" : "提交成功",
              type: "success",
              duration: 1000
            });
            this.trainingdetails();
          } else {
            this.$message.error({
              showClose: true,
              message: res.data.msg,
              duration: 1000
            });
          }
        });
      }
    },
    // 获取我的仿真资源列表
    mySimulationResources() {
      getSimulation({
        offset: 0,
        limit: 1000,
        inner: false
      }).then(res => {
        this.simulationResourcesAll.push({
          id: 311232,
          name: "我的仿真资源",
          disabled: true
        });
        for (let i = 0; i < res.data.object.length; i++) {
          this.simulationResourcesAll.push(res.data.object[i]);
        }
        this.innerSimulationResources(); // 获取内置仿真资源列表
      });
    },
    // 获取内置仿真资源列表
    innerSimulationResources() {
      getSimulation({
        offset: 0,
        limit: 1000,
        inner: true
      }).then(res => {
        this.simulationResourcesAll.push({
          id: 123122312231,
          name: "——————————————",
          disabled: true
        });
        this.simulationResourcesAll.push({
          id: 123412313213,
          name: "内置仿真资源",
          disabled: true
        });
        for (let i = 0; i < res.data.object.length; i++) {
          this.simulationResourcesAll.push(res.data.object[i]);
        }
      });
    },
    // 接受内容
    params() {
      if (this.$route.params.type != null) {
        this.row = this.$route.params;
        this.id = this.$route.params.id;
        this.ispractice = this.$route.params.practice;
        this.isteaching = this.$route.params.teaching;
        this.isexamine = this.$route.params.examine;
        this.isteacher = this.$route.params.isteacher;
        if (this.$route.params.type == "teaching") {
          this.page = 1;
        } else if (this.$route.params.type == "exercise") {
          this.page = 2;
        } else if (this.$route.params.type == "examine") {
          this.page = 3;
        } else {
        }
        sessionStorage.setItem(
          "TrainingModule",
          JSON.stringify({
            row: this.row
          })
        );

        // console.log(this.page);
      }
    },
    //   //row存储数据来源。
    TrainingModule() {
      if (sessionStorage.getItem("TrainingModule")) {
        let row = JSON.parse(sessionStorage.getItem("TrainingModule")).row;
        // console.log(row,row.row.id);
        this.row = row;
        this.id = row.id;

        this.ispractice = row.practice;
        this.isteaching = row.teaching;
        this.isexamine = row.examine;
        this.isteacher = row.isteacher;
        if (row.type == "teaching") {
          this.page = 1;
        } else if (row.type == "exercise") {
          this.page = 2;
        } else if (row.type == "examine") {
          this.page = 3;
        } else {
        }
        if (row.page) {
          this.page = row.page;
        }
        // sessionStorage.removeItem('TrainingModule');
      }
    },
    // page钩子保存
    pagenum() {
      this.row.page = this.page;
      sessionStorage.setItem(
        "TrainingModule",
        JSON.stringify({
          row: this.row
        })
      );
    },
    //判断教导主任
    supervisor() {
      let user = JSON.parse(sessionStorage.getItem("user"));

      if (user.position == "supervisor" && user.role == "teacher") {
        this.isteacher = true;
      } else {
        //  return false;
      }
      if (user.role == "student") {
        this.isstudent = true;
      } else {
        this.isstudent = false;
      }
    },
    // 获取模板详情
    trainingdetails() {
      training_details({
        trainingId: this.id
      }).then(res => {
        console.log(res, "列表");
        let data = res.data.object;
        if (res.data.code == 0) {
          // 教学模式
          // this.teaching.descriptions = data.teachMode.descriptions;
          this.name = res.data.object.name;
          this.teaching.descriptions =
            data.teachMode.descriptions == null
              ? []
              : data.teachMode.descriptions;
          this.teaching.guide = data.teachMode.guide;
          this.teaching.annex =
            data.teachMode.annex == null ? [] : data.teachMode.annex;
          if (data.teachMode.guide != null && data.teachMode.guide != "") {
            this.teaching.guidancename = data.teachMode.guide[0].name;
            this.teaching.guidancepath = data.teachMode.guide[0].path;
            this.teaching.guidanceid = data.teachMode.guide[0].id;
          }

          // 练习模式
          this.exercise.descriptions =
            data.practiceMode.descriptions == null
              ? []
              : data.practiceMode.descriptions;
          this.exercise.material =
            data.practiceMode.material == null
              ? []
              : data.practiceMode.material;
          this.exercise.simPractice =
            data.practiceMode.simPractice == null
              ? []
              : data.practiceMode.simPractice;
          // 考核模式
          // console.log( this.examine)
          this.examine.descriptions =
            data.examMode.descriptions == null
              ? []
              : data.examMode.descriptions;
          this.examine.report = data.examMode.report;
          this.examine.simExam =
            data.examMode.simExam == null ? [] : data.examMode.simExam;
          if (
            data.examMode.report != null &&
            data.examMode.report != "" &&
            data.examMode.report != []
          ) {
            this.examine.reportname = data.examMode.report[0].name;
            this.examine.reportpath = data.examMode.report[0].path;
            this.examine.reportid = data.examMode.report[0].id;
          }
          // console.log( this.examine)
          this.getexamdetails();
        } else {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: res.data.msg
          });
        }
      });
    },
    // 学生考核模式信息
    getexamdetails() {
      // 判断是否是学生
      let user = JSON.parse(sessionStorage.getItem("user"));
      if (user.role == "student") {
        get_exam_details({
          taskId: this.row.id, //任务id
          accountTaskId: this.row.accountTaskId // accountTaskId
        }).then(res => {
          console.log(res, "学生考核信息");
          let data = res.data.object;
          if (res.data.code == 0) {
            //覆盖学生的实验报告
            if (data.report != null && data.report != [] && data.report != "") {
              this.examine.reportname = data.report[0].name;
              this.examine.reportpath = data.report[0].path;
              this.examine.reportid = data.report[0].id;
            }
            //覆盖学生的实训考核
            if (
              data.simExam != null &&
              data.simExam != "" &&
              data.simExam != []
            ) {
            }

            // 判断学生的提交状态
            if (data.statu == "new" || data.statu == "save") {
              this.isstudent = true;
            } else if (
              data.statu == "submit" ||
              data.statu == "approved" ||
              data.statu == "expired"
            ) {
              this.isstudent = false;
            }
            //判断是否批阅
            if (data.statu == "approved") {
              this.isapproved = true;
              this.comment = data.comment;
              this.score = data.score;
            }else{
               this.isapproved = false;
            }
          } else {
          }
        });
      }
    }
  },

  created() {
    // console.log(this.examine)
    this.TrainingModule();
    this.params();
    this.supervisor();
    this.trainingdetails();
  }
};
</script>
<style lang="less" scoped>
.box {
  margin-left: 20px;
  height: 97.5%;
  width: 95.3%;
  padding-top: 20px;
  background-color: #fff;
  margin-top: 20px;
  overflow: auto;
}
.box-top {
  padding-left: 30px;
  padding-bottom: 20px;
}
.paging {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.strip {
  width: 100%;
  padding: 0px 30px;
  margin: 30px 0px;
  display: flex;
  flex-direction: row;
  .name {
    width: 200px;

    p {
      font-size: 18px;
      line-height: 50px;
    }
  }
  .value {
    width: calc(100% - 280px);
    .btu {
      padding: 10px 0px;
      display: flex;
      flex-direction: row;
      .upload-demo {
        margin-right: 10px;
      }
    }
  }
  .det {
    width: 80px;
    padding: 10px;
  }
}
.save {
  width: 100%;
  padding: 0px 110px;
  display: flex;
  flex-direction: row-reverse;
}
</style>
<style>
.el-table .warning-row {
  background: #f7faff;
}
.box .el-button {
  border-radius: 0px;
}
</style>

