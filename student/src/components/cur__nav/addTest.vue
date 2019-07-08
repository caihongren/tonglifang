<template>
  <div class="box addTest">
    <div class="interior">
      <!-- 表格 -->
      <el-form label-position="left" label-width="100px" :model="form" style="width:90%">
        <el-form-item label="要求">
          <el-input type="textarea" :rows="2" v-model="form.region" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="实验指导书">
          <span class="span">{{guidename}}</span>
          <span></span>
          <el-button icon="el-icon-plus" size="small" @click="handleChange(guideid)">打开</el-button>
        </el-form-item>
        <el-form-item label="参考附件">
          <template>
            <el-table
              :data="tableData"
              border
              style="width: 100%;margin:5px 0;text-align:center"
              stripe
              :header-cell-style="{background:'#ccc',height:'50px'}"
            >
              <el-table-column prop="name" label="附件名称" min-width="120"></el-table-column>
              <el-table-column prop="name" label="类型" min-width="200"></el-table-column>

              <el-table-column label="操作" min-width="150">
                <template slot-scope="scope">
                  <el-button @click="lookover(scope.row)" size="small" icon="el-icon-search">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
        <div style="width:110%;border:1px solid #ccc;margin:5px 0"></div>
        <el-form-item label="实验报告">
          <span class="span">{{form.reportname}}</span>
          <span></span>
          <el-button size="small" v-if="islook">在线编辑</el-button>
          <el-button
            size="small"
            icon="el-icon-download"
            @click="download(form.reportpath,form.reportname)"
          >导出</el-button>
          <el-button size="small" icon="el-icon-date" @click="download(reportpath,reportname)">下载模板</el-button>
        </el-form-item>
        <el-form-item label="仿真实验题">
          <template>
            <el-table
              :data="snapshoot"
              border
              style="width: 100%;margin:5px 0"
              stripe
              :header-cell-style="{background:'#ccc'}"
            >
              <el-table-column prop="name" label="附件名称" min-width="120"></el-table-column>
              <el-table-column prop="name" label="类型" min-width="150"></el-table-column>
              <el-table-column prop="name" label="原题" min-width="150">
                <template slot-scope="scope">
                  <el-button
                    @click="compileClick(scope.row)"
                    size="small"
                    type="text"
                  >{{scope.row.name}}</el-button>
                </template>
              </el-table-column>

              <el-table-column label="快照" min-width="550">
                <template slot-scope="scope">
                  <span
                    v-bind:key="item.id"
                    v-for="(item) in scope.row.list"
                    style="padding-right: 30px;"
                  >
                    <el-radio
                      v-model="snapshoot[scope.$index].radio"
                      :label="item.name"
                    >{{item.name}}</el-radio>

                    <!-- <el-button @click="compileClick(scope.row)" size="small" type="text">{{item.name}}</el-button> -->

                    <el-button type="text" @click="compileClick(scope.row)">
                      <span class="icon iconfont">&#xe643;</span>
                    </el-button>
                    <el-button type="text" @click="eacher(item.sim_path)">
                      <span class="icon iconfont">&#xeb99;</span>
                    </el-button>
                    <el-button
                      icon="el-icon-delete"
                      v-if="islook"
                      type="text"
                      @click="det(scope.row.id)"
                    ></el-button>
                  </span>
                  <!-- <span >
                       <el-button @click="compileClick(scope.row)" size="small">查看</el-button>
                  <el-button @click="det(scope.row.id)" size="small">删除</el-button>
                  </span>-->
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
        <el-form-item label="其他附件">
          <template>
            <el-row v-if="islook">
              <el-col :span="5">
                <div class="grid-content bg-purple"></div>
                <el-button
                  @click="testTemplateLibrary=!testTemplateLibrary"
                  size="small"
                  icon="el-icon-plus"
                >新建二维仿真</el-button>
                <el-button
                  @click="dialogVisiblecopyscene=!dialogVisiblecopyscene"
                  size="small"
                  icon="el-icon-plus"
                >新建三维仿真</el-button>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple">
                  <el-upload
                    class="upload-demo"
                    action="/img/add_resource"
                    :before-upload="beforeUpload"
                    style
                    :limit="5"
                  >
                    <el-button @click="compileClick()" size="small" icon="el-icon-upload">上传文件</el-button>
                  </el-upload>
                </div>
              </el-col>
            </el-row>

            <el-table
              :data="form.annexs"
              border
              style="width: 100%;margin:5px 0"
              stripe
              :header-cell-style="{background:'#ccc'}"
            >
              <el-table-column prop="name" label="附件名称" min-width="150"></el-table-column>
              <el-table-column prop="name" label="类型" min-width="120"></el-table-column>

              <el-table-column label="操作" min-width="150">
                <template slot-scope="scope">
                  <el-button @click="lookover(scope.row)" size="small" icon="el-icon-search">查看</el-button>
                  <el-button
                    @click="det(scope.row.id)"
                    v-if="islook"
                    size="small"
                    icon="el-icon-delete"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
        <el-form-item label="老师批阅" v-if="isapproved">
          <div>分数：{{teacherScore}}</div>
          <div>
            <el-input type="textarea" :rows="2" v-model="teacherComment" :disabled="true"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="operation">
        <el-button @click="compileClick()" v-if="islook" type="success">保存</el-button>
        <el-button @click="submit()" v-if="islook" type="danger">提交</el-button>
        <el-button @click="$emit('detpage')" v-if="!islook">确定</el-button>
      </div>

      <!-- 弹窗 -->
      <!-- 新建2D弹出框 -->
      <el-dialog :visible.sync="testTemplateLibrary" class="newBulletWindowFrame" width="30%">
        <div>
          <el-input placeholder="请输入新增二维名称" v-model="dimensionality.name" class="input-with-select">
            <el-select
              v-model="dimensionality.type"
              slot="prepend"
              placeholder="请选泽二维模式"
              style="width:180px"
            >
              <el-option label="二维设计图" value="shanghai"></el-option>
              <el-option label="二维接线图" value="beijing"></el-option>
              <el-option label="二维布局图" value="shen"></el-option>
            </el-select>
          </el-input>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="testTemplateLibrary = false">取 消</el-button>
          <el-button type="primary" @click="go2D(dimensionality)">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新建3d场景文件 -->
      <el-dialog title="新建场景文件" :visible.sync="dialogVisiblecopyscene" width="30%">
        <div>
          <el-input placeholder="请输入新增场景名称" v-model="tasks.name" class="input-with-select">
            <el-select
              v-model="tasks.type"
              slot="prepend"
              placeholder="请选泽场景模式"
              style="width:180px"
            >
              <el-option
                :label="item.name"
                :value="item.name"
                v-for="(item) in pattern"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblecopyscene = false">取 消</el-button>
          <el-button type="primary" @click="go3D(tasks)">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 指导文件查看 -->
      <el-dialog
        width="90%"
        title="指导文件"
        top="8vh"
        append-to-body
        :visible.sync="innerVisibleNewpdf"
      >
        <div style="height:75vh">
          <Examine ref="child"></Examine>
        </div>
      </el-dialog>
      <!-- 视屏文件查看 -->
      <el-dialog
        width="90%"
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
        title="实验快照折线图"
        top="8vh"
        append-to-body
        :visible.sync="innerVisiblePolyline"
      >
        <div style="height:55vh">
          <div id="myChart2" :style="{width: '800px', height: '600px'}"></div>
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
import {
  guidelist,
  demo,
  reportlist,
  snalist,
  resource,
  report,
  tostring,
  tonumber,
  getResource_by_id
} from "../../API/api";
export default {
  data() {
    return {
      id: "",
      offset: 0,
      limit: 100,
      currentPage4: 1,
      length: 40,
      innerVisible: false,
      innerVisibleNewpdf: false,
      innerVisiblevideo: false,
      testTemplateLibrary: false,
      innerVisiblePolyline: false,
      dialogVisiblecopyscene: false,
      islook: true,
      isapproved: false,
      previewPath: "",
      form: {
        name: "minziu",
        region: "dawdad",
        reportid: "",
        reportname: "",
        reportpath: "",
        annexs: []
      },
      snapshoot: [
        {
          name: "快照实验demo",
          radio: "1",
          list: [
            {
              name: "demo1",
              path: "dadad",
              id: "dawd1ada"
            },
            {
              name: "demo2",
              path: "dadad",
              id: "dawd1addawdawdadaa"
            }
          ]
        }
      ],
      dimensionality: {
        dimensionality: "2D",
        name: "",
        type: ""
      },
      tasks: {
        id: "",
        name: "",
        path: "",
        type: "",
        look:false,
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
      ],
      guideid: "",
      guidepath: "",
      guidename: "",
      reportid: "",
      reportname: "",
      reportpath: "",
      teacherScore: "未评分",
      teacherComment: "暂无评论。。。",
      tableData: [],

      series: [], //折线图部分
      duration: "",
      stepLength: "",
      stepLengthlist: [],
      legend: []
    };
  },
  components: {
    // Unity3D,
    Examine
  },
  props: {
    row: Object,
    showheight:String
  },
  methods: {
    ...mapActions(["task"]),

    // pdf到详情页面
    handleChange(id) {
      // console.log(id);
      this.innerVisibleNewpdf = true;
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
        .catch(() => {});
    },
    // 查看
    lookover(row) {
      // 对row来源进行判断
      console.log(row);
      this.preview(row.path, row);
    },

    preview(path, row) {
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
        this.innerVisiblevideo = true;
        // 播放视频
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
        this.handleChange(row.id);
      } else if (
        source == "gif" ||
        source == "jpg" ||
        source == "jpeg" ||
        source == "png" ||
        source == "tif"
      ) {
        this.handleChange(row.id);
      } else {
        this.$confirm("文件暂不支持，请下载", "提示", {
          confirmButtonText: "确定",
          type: "info"
        }).then(() => {});
      }
    },
    compileClick(row) {
      console.log(row);
    },
    go2D(row) {
      console.log(row);
      if ((row.type == "" || row.name == "")&&row.id=='') {
        this.$message.error({
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
    },
    go3D(row) {
      console.log(row);
      if ((row.type == "" || row.name == "")&&row.id=='') {
        this.$message.error({
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
    // 上传文件
    beforeUpload(file) {
      let fd = new FormData();
      fd.append("file", file); //传文件
      console.log(file);
      fd.append("resourceTypeId", "");
      fd.append("resourceTypeName", "");
      // fd.append('id',this.srid);//传其他参数
      resource(fd).then(res => {
        console.log(res, 2224);
        this.form.annexs.push(res.data.object);
      });
      return false; //屏蔽了action的默认上传
    },
    // 下载
    // 下载文件
    download(src, name) {
      let data = src;

      if (!data || data == "" || data == null) {
        this.$message.error({
          message: "不存在该文件"
        });

        return;
      }
      let courseUrl = "";
      if (JSON.parse(sessionStorage.getItem("course"))) {
        courseUrl = JSON.parse(sessionStorage.getItem("course")).url;
        console.log(courseUrl, "课程服");
      } else {
        this.$message.error({
          message: "下载失败"
        });
      }
      const fileName = name;
      let url = courseUrl + "/download_test?url=" + data + "&name=" + fileName;
      console.log(url);
      const elink = document.createElement("a");
      // elink.download = fileName;
      elink.style.display = "none";
      elink.href = url;
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
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
    },
    // 状态
    completionStatusc(row, column) {
      //   console.log(row.status)
      if (row.status == "new") {
        return "未开始";
      } else if (row.status == "save") {
        return "进行中";
      } else if (row.status == "submit") {
        return "已提交";
      }
    },
    // 删除附件
    det(id) {
      console.log(id);
      for (let i = 0; i < this.form.annexs.length; i++) {
        if (this.form.annexs[i].id == id) {
          this.form.annexs.splice(i, 1);
          break;
          return;
        }
      }
    },
    // 保存报告
    saveWord(type) {
      console.log("保存报告");

      this.isSave = true;
      report({
        taskExperimentId: this.id,
        projectId: this.projectId,
        resourceId: this.downloadId,
        annexs: this.fileList,
        remark: this.remark,
        status: type
      }).then(res => {
        if (res.data.msg == "SUCCESS") {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.isSave = false;
          this.reportlistNew();
          this.snalistNew();
        }
      });
    },
    // 提交报告
    submit(type) {
      console.log("提交报告");
      // 先提交word实验报告(假设提交成功)
      this.$confirm("提交实验报告后将不可更改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "提交成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
        });
    },

    handleClose(row) {},

    // 打开快照折线图详情
    eacher(path) {
      this.innerVisiblePolyline = true;
      // console.log("dianji ");
      let data = {};
      // "http://192.168.2.223:8081/static/sim/a3c22184-b8de-4819-9f07-ec20a16866de.CreatorSim"
      this.$http
        .get(path)
        .then(res => {
          console.log(res.body);
          data = res.body.SimData;
          this.duration = res.body.duration;
          this.stepLength = res.body.stepLength;
          let one = (this.duration / this.stepLength).toFixed(4);
          let two = [];
          // console.log(one);
          for (let i = 0; i < this.stepLength; i++) {
            two[i] = one * i;
          }
          // console.log(two);
          this.stepLengthlist = two;
          // this.stepLengthlist.push(this.duration)
          for (var item in data) {
            // console.log(item, data[item], "qq");
            this.series.push({
              name: data[item].Name,
              type: "line",
              data: data[item].data
            });
            this.legend.push(data[item].Name);
          }

          // console.log(this.series);
          // console.log(this.stepLengthlist);

          // this.sdawd = this.series[0];
          // console.log(this.sdawd);
          this.visible2 = true;
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById("myChart2"));
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
    // 获取实验指导
    guidelist() {
      guidelist({
        taskExperimentId: this.id
      }).then(res => {
        console.log(res, "实验指导");
        this.guideid = res.data.object.id;
        this.guidepath = res.data.object.path;
        this.guidename = res.data.object.name;
      });
    },

    reportlistNew() {
      // 获取实验报告
      reportlist({
        taskExperimentId: this.id
      }).then(res => {
        console.log(res, "实验报告");
        this.form.reportname = res.data.object.name;
        this.form.reportid = res.data.object.id;
        this.form.reportpath = res.data.object.path;
        this.form.annexs = res.data.object.annexs;
        if (!res.data.object.id) {
          this.form.reportname = res.data.object.report.name;
        } else {
          this.form.reportname = res.data.object.id;
        }

        this.reportname = res.data.object.report.name;
        this.reportid = res.data.object.report.id;
        this.reportpath = res.data.object.report.path;
      });
    },
    //  加载快照列表
    getListNew() {
      snalist({
        taskExperimentId: this.id,
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        console.log(res.data, "实验快照");
        this.length = res.data.length;
        if (res.data.object.length > 0) {
          // this.id = res.data.object[0].id;
          console.log(res.data.object);
          this.snapshoot[0].list = res.data.object;
          // this.length=res.data.length;
        }
      });
    }
  },
  computed: {
    ...mapState(["taskList"])
  },
  created() {
    console.log(this.row,this.showheight);
    this.tableData[0] = this.row;

    this.id = this.row.id;
    this.reportlistNew();
    this.guidelist();
    this.getListNew();
    if (this.row.status == "new") {
      return "未开始";
    } else if (this.row.status == "save") {
      return "进行中";
    } else if (this.row.status == "submit") {
      this.islook = false;
      return "已提交";
    } else if (this.row.status == "approved") {
      this.islook = false;
      this.idapproved = false;
      return "已批阅";
    } else if (this.row.status == "expired") {
      this.islook = false;
      return "已过期";
    }
  },

  mounted() {}
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .interior {
    width: 102%;
    height: 100%;
    overflow: auto;
  }
}
.span {
  padding-right: 100px;
}
.operation {
  padding-left: 70%;
  margin: 10px 0;
  height: 100px;
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
    width: 0%;
  }
  .el-radio {
    margin-right: 10px;
  }
}
</style>


