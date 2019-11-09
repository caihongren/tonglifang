<template>
  <div class="resourceDownload">
    <el-container>
      <el-header class="top">
        <h1>资源下载</h1>
        <!-- <el-button type="info" style @click="login()">退出登录</el-button> -->
      </el-header>
      <el-container class="botton">
        <el-aside width="250px" class="botton-left">
          <!-- <div class="chapter">
                        <el-tree :data="data" node-key="id" :default-expanded-keys="expandedKeys" :expand-on-click-node="false" :props="defaultProps" ref="menuTree" :default-expand-all="true">
                            <span class="custom-tree-node" :title="node.label" slot-scope="{ node, data }">
                                <span @click="handleNodeClick(node)" class="menuContext">{{ node.data.section}}{{"."}}{{ node.label }}</span>
                            </span>
                        </el-tree>
          </div>-->
          <div class="chapter">
            <el-button type="primary" style="margin:10px 10%;width:80%" @click="dialogVisible=true,zone()">版本控制</el-button>
            <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false" @node-click="renderContent" :props="defaultProps"></el-tree>
          </div>
        </el-aside>

        <el-main class="botton-right">
          <div style="margin:10px;height:50px">
            <div style="  float:left;padding:0px 20px;">
              <h2>{{versionName}}/{{name}}</h2>
            </div>
            <div style="  float:right;">
              <el-upload class="upload-demo" action="/img/add_training_resource" :before-upload="( file)=>{return uploading(file)}" :disabled="isupload">
                <el-button type="primary" :loading="isupload">上传文件到该版本</el-button>
              </el-upload>
            </div>

            <el-button type="primary" style="  float:right;margin:0 40px;" @click="noticeVisible=true,newnotice=notice">编辑公告</el-button>
          </div>
          <div style="margin:10px;padding:0 20px;" v-show="notice==''?false:true">
            <h2 style="text-align: center">公告</h2>

            <el-input type="textarea" :disabled="true" :autosize="{ minRows: 2}" v-model="notice" autocomplete="off"></el-input>
          </div>

          <el-table ref="singleTable" :data="tableDataFalse" stripe border highlight-current-row :header-cell-style="{background:'#b2e2f8'}" class="tabletop">
            <el-table-column prop="name" label="名称" min-width="120"></el-table-column>
            <el-table-column prop="type" label="类型" min-width="120"></el-table-column>
            <el-table-column prop="size" label="大小" min-width="100"></el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button type="text" @click="download(scope.row.path,scope.row.name)" size="small">下载</el-button>
                <el-button type="text" @click="resourceDelete(scope.row.id)" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <!-- 弹出层 -->
    <el-dialog title="版本控制" :visible.sync="dialogVisible" width="40%">
      <div>
        <!-- 新增项目 -->
        <div>
          <div class="addclasses">
            <p class="writtenWords">新增项目：</p>
            <el-input placeholder="请输入内容" v-model="addmodule" clearable style="width:60%"></el-input>
            <el-button type="primary" style="margin-left:30px;" @click="addmodules">确认新增项目</el-button>
          </div>
        </div>
        <!-- 删除项目 -->
        <div>
          <p class="writtenWords" style="width:300px">注：项目内容为空才能删除。</p>
          <div class="addclasses">
            <p class="writtenWords">删除项目:</p>
            <el-select v-model="detmodule" slot="prepend" placeholder="请选择项目" style="width:435px">
              <el-option :label="item.itemName" :value="item.itemId" v-for="(item) in data" :key="item.itemId" :disabled="item.versions.length>0?true:false"></el-option>
            </el-select>
            <el-button type="danger" style="margin-left:30px;" @click="detmodules">确认删除项目</el-button>
          </div>
        </div>
        <!-- 新增类别 -->
        <div style="margin:10px 0px;">
          <div class="addclasses">
            <p class="writtenWords">新增版本：</p>
            <el-select v-model="additemId" slot="prepend" placeholder="请选择项目" style="width:200px">
              <el-option :label="item.itemName" :value="item.itemId" v-for="(item) in data" :key="item.itemId"></el-option>
            </el-select>
            <el-input placeholder="请输入内容" v-model="addtype" clearable style="width:235px"></el-input>
            <el-button type="primary" style="margin-left:30px;" @click="addtypes()">确认新增版本</el-button>
          </div>
        </div>
        <!-- 删除类别： -->
        <div style="margin:10px 0px;">
          <div class="addclasses">
            <p class="writtenWords">删除版本：</p>
            <el-select v-model="detitemId" slot="prepend" placeholder="请选择项目" style="width:200px">
              <el-option :label="item.itemName" :value="item.versions" v-for="(item) in data" :key="item.itemId"></el-option>
            </el-select>
            <el-select v-model="dettype" slot="prepend" placeholder="请选择版本" style="width:235px">
              <el-option :label="item.versionName" :value="item.versionId" v-for="(item) in detitemId" :key="item.versionId"></el-option>
            </el-select>

            <el-button type="danger" style="margin-left:30px;" @click="dettypes()">确认删除版本</el-button>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false" class="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false" class="Sure" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改公告弹框 -->
    <el-dialog title="修改课程概述" :visible.sync="noticeVisible" class="modify">
      <el-input type="textarea" :rows="8" v-model="newnotice" autocomplete="off"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" class="cancel" @click="noticeVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" class="Sure" @click="courseOverviewUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
import {
  delete_document, //删除
  download, //下载
  get_item_and_version, //获取所有项目
  upload_document,
  get_document_by_version,
  delete_version,
  add_version,
  delete_item,
  add_item,
  modify_bulletin,
  Size
} from "@/API/api.js";
export default {
  data() {
    return {
      index: 1,
      data: [], //章节目录数据
      defaultProps: {
        children: "versions",
        label: "versionName"
      },
      id: "", //当前版本id
      name: "",
      versionName: "",
      // data: JSON.parse(JSON.stringify(data)),
      noticeVisible: false,
      notice: "", // 公告
      newnotice: "",
      trainingModule: [], //项目
      addmodule: "",
      detmodule: "",
      additemId: "",
      addtype: "",
      detitemId: "",
      dettype: "",
      tableDataFalse: [],
      input10: "",
      isupload: false,
      dialogVisible: false
    };
  },

  methods: {
    // 切换tabs
    tabs(index) {
      if (!index) {
        index = this.index;
      }
      this.index = index;
    },
    login() {
      // 退出清除缓存信息
      // localStorage.removeItem("token");
      sessionStorage.removeItem("user");

      this.$router.push("/login");
    },
    zone() {
      this.addmodule = "";
      this.detmodule = "";
      this.additemId = "";
      this.addtype = "";
      this.detitemId = "";
      this.dettype = "";
    },
    //编辑公告
    courseOverviewUpdate() {
      modify_bulletin({
        versionId: this.id,
        bulletin: this.newnotice
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.noticeVisible = false;
          this.getdocumentbyversion();
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: res.data.msg,
            duration: 1000
          });
        }
      });
    },
    // 增加项目
    addmodules() {
      if (this.addmodule == "" || this.addmodule == null) {
        this.$message({
          showClose: true,
          type: "danger",
          message: "请选择项目。",
          duration: 1000
        });
        return;
      }
      add_item({
        itemName: this.addmodule
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            type: "success",
            message: "添加成功",
            duration: 1000
          });
          this.addmodule = "";
          this.dialogVisible = false;
          this.get_chaptersMy();
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: res.data.msg,
            duration: 1000
          });
        }
      });
    },
    //删除项目
    detmodules() {
      if (this.detmodule == "" || this.detmodule == null) {
        this.$message({
          showClose: true,
          type: "danger",
          message: "请选择项目。",
          duration: 1000
        });
        return;
      }
      delete_item({
        itemId: this.detmodule
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            type: "success",
            message: "删除成功",
            duration: 1000
          });
          this.detmodule = "";
          this.dialogVisible = false;
          this.get_chaptersMy();
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: res.data.msg,
            duration: 1000
          });
        }
      });
    },
    //增加版本
    addtypes() {
      if (this.addtype == "" || this.addtype == null) {
        this.$message({
          showClose: true,
          type: "danger",
          message: "请选择项目。",
          duration: 1000
        });
        return;
      }
      add_version({
        itemId: this.additemId,
        versionName: this.addtype
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            type: "success",
            message: "增加成功",
            duration: 1000
          });
          this.addtype = "";
          (this.additemId = ""), (this.dialogVisible = false);
          this.get_chaptersMy();
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: res.data.msg,
            duration: 1000
          });
        }
      });
    },
    // 删除版本
    dettypes() {
      if (this.dettype == "" || this.dettype == null) {
        this.$message({
          showClose: true,
          type: "danger",
          message: "请选择项目。",
          duration: 1000
        });
        return;
      }
      delete_version({
        versionId: this.dettype
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            type: "success",
            message: "删除成功",
            duration: 1000
          });
          this.detitemId = "";
          this.dettype = "";
          this.dialogVisible = false;
          this.get_chaptersMy();
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: res.data.msg,
            duration: 1000
          });
        }
      });
    },
    renderContent(data) {
      if (data.versionId) {
        // console.log(data)
        this.id = data.versionId;
        this.name = data.versionName;
        this.getdocumentbyversion();
        let oiddata = this.data;
        for (let i = 0; i < oiddata.length; i++) {
          for (let j = 0; j < oiddata[i].versions.length; j++) {
            if (data.versionId == oiddata[i].versions[j].versionId) {
              this.versionName = oiddata[i].itemName;
              break;
            }
          }
        }
      }
    },

    //获取获取项目及版本列表
    get_chaptersMy() {
      get_item_and_version().then(res => {
        // console.log(res);
        if (res.data.code == 0) {
          let oiddata = res.data.object;
          let newdata = [];
          for (let i = 0; i < oiddata.length; i++) {
            oiddata[i].versionName = oiddata[i].itemName;
          }
          this.data = oiddata;
          for (let i = 0; i < oiddata.length; i++) {
            if (this.name == "" && oiddata[i].versions.length > 0) {
              this.renderContent(oiddata[i].versions[0]);
              break;
            }
          }
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: res.data.msg,
            duration: 1000
          });
        }
      });
    },
    //获取版本内容
    getdocumentbyversion() {
      get_document_by_version({
        versionId: this.id
      }).then(res => {
        // console.log(res);
        if (res.data.code == 0) {
          this.notice =
            res.data.object.bulletin == null ? "" : res.data.object.bulletin;
          this.tableDataFalse = res.data.object.documents;
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: res.data.msg,
            duration: 1000
          });
        }
      });
    },
    //资源下载
    resourceDownload() {
      download({
        name: name,
        url: path
      }).then(res => {
        const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, name);
      });
    },
    // 大文件a标签下载
    download(path, name) {
      let src = path;
      // window.location.href = this.downloadSrc;
      // window.open(this.downloadSrc, '_blank'); // 新开窗口下载
      if (src == "" || src == null) {
        return;
      }
      // let url = window.URL.createObjectURL(new Blob([src]));
      let url = src;
      let link = document.createElement("a");
      link.style.display = "none";
      // link.target = "_Blank";
      link.href = url;
      // link.href = src;
      // 获取文件名
      // download 属性定义了下载链接的地址而不是跳转路径
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    },
    // 上传文件钩子---
    uploading(file) {
      this.isupload = true;
      console.log(file);
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
      this.$message.error({
        showClose: true,
        duration: 3000,
        message: "正在上传文件，请稍后，不要关闭当前页面",
        type: "warning"
      });
      let fd = new FormData();
      fd.append("document", file); //传文件
      fd.append("versionId", this.id); //传类型
      upload_document(fd).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            message: "文件上传成功",
            type: "success",
            duration: 1000
          });
          this.isupload = false;
          this.getdocumentbyversion();
        } else {
          this.$message({
            showClose: true,
            type: "danger",
            message: res.data.msg,
            duration: 1000
          });
          this.isupload = false;
        }
      });
    },
    //资源删除
    resourceDelete(id) {
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delete_document({
            documentId: id
          }).then(res => {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.getdocumentbyversion();
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    }
  },
  created() {
    this.get_chaptersMy();
  }
};
</script>
<style lang="less" scoped>
.resourceDownload {
  position: relative;
}
.top {
  margin-top: -61px;
  width: 10%;
  margin-left: 45%;
  height: 61px;
  // background-color: #409eff;
  display: flex;
  flex-direction: row;
  h1 {
    // color: #fff;
    line-height: 60px;
    width: 93%;
    text-align: center;
  }
}
.botton {
  width: 100%;
  height: 1000px;
  background-color: #f1f1f1;
  .botton-left {
    float: left;
    height: 100%;
    background-color: #313131;
  }
  .botton-right {
    padding-top: 20px;
    margin-left: 20px;
    height: 87%;
    width: 83%;
    background-color: #fff;
    margin-top: 20px;
    margin-right: 100px;
    .tabletop {
      width: 95%;
      margin: 0 30px;
    }
  }
}
.addclasses {
  display: flex;
}
.writtenWords {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  // padding-top: 20px;
  display: inline-block;
  width: 120px;
}
</style>
<style >
.resourceDownload .chapter .el-tree {
  background-color: #313131;
  margin-top: 30px;
  margin-left: 15px;
  color: #dddd;
}
.resourceDownload .el-tree-node__content:hover {
  background-color: #282828;
}
.resourceDownload .el-tree-node:focus > .el-tree-node__content {
  background-color: #282828 !important;
}
</style>


