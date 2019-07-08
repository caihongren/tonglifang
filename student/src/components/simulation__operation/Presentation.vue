<template>
  <div style="margin-top:20px;padding:20px">
    <el-row>
      <el-col :span="20">
        <div class="grid-content bg-purple-light">
          <!-- 重置下载按钮 -->
          <div style="width:100%;margin:20px 0">
            <el-row>
              <el-col :span="8">
                <div class="center">
                  <el-button
                    type="warning"
                    style="width:90%"
                    @click="initialize"
                    :disabled="status"
                  >将实验报告进行重置</el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="center">
                  <el-upload
                    class="upload-demo"
                    action="/img/add_resource"
                    :before-upload="beforeUploadword"
                    :on-change="handleChange"
                    style="width:100%"
                  >
                    <el-button type="primary" style="width:100%" :disabled="status">更改实验报告</el-button>
                  </el-upload>
                  <!-- <el-button type="warning" style="width:90%" >更改实验报告</el-button> -->
                </div>
              </el-col>
              <el-col :span="8">
                <div class="center">
                  <el-button
                    type="info"
                    style="width:90%"
                    @click="download(downloadSrc,name)"
                    :disabled="status"
                  >实验报告下载</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 实验快照 -->
          <h3 style="padding-left:100px">请选择提交的实验快照</h3>
          <div style class="project">
            <template>
              <el-select v-model="projectId" placeholder="请选择实验快照" :disabled="status">
                <el-option
                  v-for="item in TheSnapshotList"
                  :key="item.id"
                  :label="item.updatedAt|dateformat"
                  :value="item.id"
                >{{item.updatedAt|dateformat}}</el-option>
              </el-select>
            </template>
          </div>
          <div class="snapshoot">
            <!-- 上传附件 -->
            <div class="accessory">
              <!-- <p>上传附件</p>
              <div style="height:100px;" class="twoDiv"></div>
              <div style="height:30px;">
                <span style="margin:0 5px;">备注:</span>
                <input type="text" placeholder="备注最多20字" maxlength="20" style="border:0px solid red;height:25px" v-model='remark'>
              </div>-->

              <el-upload
                class="upload-demo twoDiv"
                action="/img/add_resource"
                :before-upload="beforeUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                multiple
                :limit="5"
                :on-exceed="handleExceed"
                :file-list="fileList"
              >
                <el-button size="medium" type="primary" style="width:100%" :disabled="status">点击上传附件</el-button>
                <div slot="tip" class="el-upload__tip">当前限制只能上传5个文件，文件数量多请打包上传。。。</div>
              </el-upload>
              <!-- :before-remove="beforeRemove" -->
            </div>
          </div>

          <el-row :gutter="20">
            <el-col :span="6" :offset="12">
              <div class="grid-content bg-purple">
                <el-button
                  type="success"
                  style="width:90%;"
                  class="go"
                  @click="saveWord('save')"
                  :loading="isSave"
                  :disabled="status"
                >保存</el-button>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-button
                  type="primary"
                  class="go"
                  @click="saveWord('submit')"
                  :loading="isSubmit"
                  :disabled="status"
                >提交</el-button>
              </div>
            </el-col>
          </el-row>
          <!-- 保存按钮 -->
          <!-- <div>
            <el-button type="success" style="width:90%;margin:10% 5%" @click="saveWord('save')" :loading="isSave">保存</el-button>
          </div>-->
          <!-- 提交按钮 -->
          <!-- <div>
            <el-button type="primary" style class="go"  @click="saveWord('submit')" :loading="isSubmit" > 提交</el-button>
          </div>-->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  guidelist,
  demo,
  reportlist,
  snalist,
  resource,
  report,
  tostring,
  tonumber
} from "../../API/api";
import { promises } from "fs";
import { parse } from "path";
export default {
  data() {
    return {
      id: this.$route.params.id,
      remark: "11",
      name: "实验报告",
      downloadId: "",
      downloadSrc: "",
      fileList: [],
      saveTestTure: [],
      TheSnapshotList: [],
      value: "",
      projectId: "",
      status: false,
      isSave: false,
      isSubmit: false,
      downloadhttp:
        "192.168.2.223:8081/static/advising/7a403d640a24426a85f00d8f96cf3c68实验二：电机点动控制实验指导书.pdf"
    };
  },
  methods: {
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
        console.log(this.fileList)
        this.fileList.push({
          
          name: res.data.object.name,
          id: res.data.object.id
        });
      });
      return false; //屏蔽了action的默认上传
    },
    handleChange() {},
    // 上传实验报告
    beforeUploadword(file) {
      let fd = new FormData();
      fd.append("file", file); //传文件
      console.log(file);
      fd.append("resourceTypeId", "");
      fd.append("resourceTypeName", "annex");
      // fd.append('id',this.srid);//传其他参数
      resource(fd).then(res => {
        this.downloadId = res.data.object.id;
        this.$message({
          message: "实验报告更改成功",
          type: "success"
        });
      });
      return false; //屏蔽了action的默认上传
    },

    handleClick() {
      // alert('button click');
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    // 下载文件
    download(src, name) {
      let data = src;

      if (!data) {
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
    // 重置
    initialize() {
      console.log("初始化");
      this.$confirm("此操作将重置报告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          report({
            taskExperimentId: this.id,
            projectId: this.projectId,
            resourceId: this.downloadId,
            annexs: this.fileList,
            remark: this.remark,
            status: "reset"
          }).then(res => {
            if (res.data.msg == "SUCCESS") console.log("重置成功");
            this.$message({
              type: "success",
              message: "重置成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置"
          });
        });
    },
    // 保存报告
    saveWord(type) {
      console.log("保存报告");
      // 先提交word实验报告(假设提交成功)
      // console.log(
      //   this.id,
      //   this.projectId,
      //   this.downloadId,
      //   this.fileList,
      //   this.remark,
      //   type
      // );
      // 判断附件信息和快照信息
      console.log(this.fileList);
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

      // 判断附件信息和快照信息
      this.isSubmit = true;
      report({
        taskExperimentId: this.id,
        projectId: this.projectId,
        resourceId: this.downloadId,
        annexs: this.fileList,
        remark: this.remark,
        status: type
      }).then(res => {
        if (res.data.msg == "SUCCESS") {
          this.isSubmit = false;
          // 提交报告后不准点击
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.reportlistNew();
          this.snalistNew();
          // console.log("提交成功");
        }
      });
    },
    reportlistNew() {
      // 获取实验报告
      reportlist({
        taskExperimentId: this.id
      }).then(res => {
        console.log(res, 22222);
        this.name = res.data.object.report.name;
        this.downloadId = res.data.object.report.id;
        this.downloadSrc = res.data.object.report.path;
        this.remark = res.data.object.remark;

        // 判断提交状态
        if (res.data.object.status == "submit") {
          this.status = true;
        } else {
          this.status = false;
        }
        // 判断附件存在
        if (this.fileList.length > 0) {
        } else {
          this.fileList = tonumber(res.data.object.annexs);
        }

        //  this.projectId = tostring(res.data.object.report.id);
      });
    },
    snalistNew() {
      // 获取实验快照
      snalist({
        taskExperimentId: this.id,
        offset: 0,
        limit: 10
      }).then(res => {
        // console.log(res, 22223);
        this.TheSnapshotList = res.data.object;
      });
    }
  },
  created() {
    this.reportlistNew();
    this.snalistNew();
  }
};
</script>

<style lang="less" scoped>
.box {
  overflow: hidden;
  border: 1px solid pink;
  border-radius: 5px;
  margin: 10px;
  height: 750px;

  > .min {
    width: 102%;
    height: 750px;
    overflow: scroll;
  }
}
.bg-purple-light {
  height: 700px;
  margin: 10px 20px;
}
.center {
  margin: 5% 5%;

  > el-button {
    width: 90%;
  }
}

.snapshoot {
  width: 90%;
  margin: 5%;
  height: 210px;
  // border: 1px solid pink;
  > el-dropdown-item {
    width: 100px;
  }
}
p {
  // text-align: center;
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  padding-left: 100px;
}
.accessory {
  border: 1px solid black;
  border-radius: 5px;
  > .twoDiv {
    // border-top: 1px solid black;
    // border-bottom: 1px solid black;
    height: 200px;
  }
  .el-upload {
    width: 100%;
  }
}
.go {
  width: 90%;
  height: 100px;
  margin: 5%;
  font-size: 20px;
}
.WordNmae {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
}
</style>

<style>
.twoDiv .el-upload {
  width: 100%;
}
.project .el-select {
  width: 90%;
  padding-left: 32px;
}
.el-upload--text {
  width: 100%;
}
</style>


