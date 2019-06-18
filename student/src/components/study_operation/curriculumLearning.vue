<template>
  <div class="introduceBox">
    <!-- 下拉菜单 -->
    <el-row type="flex" class="row-bg">
      <!-- 左侧目录块 -->
      <el-col :span="5" class="leftCol">
        <div class="twoButton">
          <!-- 目录操作按钮 -->
          <el-row :gutter="10">
            <el-col :span="10" >
              <div class="grid-content bg-purple-dark" style="padding-left:20px">
                <el-button type="primary" @click="get_all_materials()" class="whole">全部</el-button>
              </div>
            </el-col>
            <el-col :span="13" class="eeeeee">
              <div class="grid-content bg-purple-dark" v-show="teacherStudentShow">
                <el-button type="primary" @click="addDialog()" class="addButton">新增</el-button>

                <el-button type="primary" @click="showEdit = !showEdit" class="edit" v-show="!showEdit">编辑</el-button>
                <el-button type="primary" @click="showEdit = !showEdit"  class="edit"  v-show="showEdit" >完成</el-button>
              </div>
            </el-col>
          </el-row>

          <!-- 新增章节弹出框 -->
          <el-dialog title="新增章节" :visible.sync="addDialogVisible" class="newlyAddedForm">
            <el-form :model="addForm">
              <el-form-item label="新增类型" :label-width="formLabelWidth">
                <el-select v-model="addForm.type" placeholder="请选择" @change="appendSelect()">
                  <el-option
                    v-for="item in typeselectData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="章" :label-width="formLabelWidth" v-if="chapterSelectVisible">
                <el-select v-model="addForm.chapter" placeholder="请选择" @change="chapterChange()">
                  <el-option
                    v-for="item in chapterSelectData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="addForm.name" autocomplete="off" class="addInput"></el-input>
              </el-form-item>
              <el-form-item label="位置" :label-width="formLabelWidth">
                <el-select v-model="addForm.level" placeholder="请选择">
                  <el-option v-for="item in levelLength" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="() => append()">立即添加</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="menu1">
          <!-- 目录顶部操作按钮 -->

          <!-- 章节目录 -->
          <!-- v-show=true表示显示，v-show=false表示隐藏 -->
          <!-- <img src="./../../image/mulu.png" alt=""> -->
          <el-button size="small" class="Catalog-t" @click="openCloseAllMenu()">目录</el-button>
          <div class="chapter">
            <!-- 章节目录 -->
            <el-tree
              :data="data"
              node-key="id"
              :default-expanded-keys="[data[0].id]"
              :expand-on-click-node="false"
              ref="menuTree"
            >
              <span
                class="custom-tree-node"
                slot-scope="{ node, data }"
                @click="handleNodeClick(node)"
              >
                <span>{{ node.label }}</span>
                <!-- 目录右侧修改删除操作按钮 -->
                <span v-show="showEdit">
                  <!-- 修改章节 -->
                  <el-button
                    type="text"
                    size="mini"
                    @click="updateDialogVisible = true, updateNode = node"
                    class="updateButton"
                  ></el-button>
                  <!-- 删除章节 -->
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)"
                    class="deleteButton"
                  ></el-button>
                  <!-- 修改章节弹出框form表单 -->
                  <el-dialog title="修改章节" :visible.sync="updateDialogVisible" class="modifyForm">
                    <el-form :model="updateForm">
                      <el-form-item label="名称" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.name" autocomplete="off" class="addInput"></el-input>
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="updateDialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click="() => update(updateNode)">立即修改</el-button>
                    </div>
                  </el-dialog>
                </span>
              </span>
            </el-tree>
          </div>
           <div style="height:200px"></div>
        </div>
      </el-col>
      <!-- 右侧内容展示块 -->
      <el-col :span="19">
        <div class="grid-content bg-purple right" id="right">
          <!-- 顶部文件操作按钮 -->
          <div class="operationButtons">
            <el-button type="primary" @click="fileUpdateBlock()" v-show="teacherStudentShow">
              重命名
              <i class="el-icon-edit el-icon--edit"></i>
            </el-button>
            <el-button type="primary" @click="fileDelete()" v-show="teacherStudentShow">
              删除
              <i class="el-icon-delete el-icon--right"></i>
            </el-button>
            <el-button type="primary" @click="fileDowload()" class="fileUploadButton">
              下载
              <i class="el-icon-download"></i>
            </el-button>
            <div class="uploadDiv" v-show="teacherStudentShow">
              <el-upload
                class="upload-demo"
                action="/img/upload_material"
                :before-upload="beforeUpload"
              >
                <el-button size="small" type="primary">
                  上传
                  <i class="el-icon-upload el-icon--right"></i>
                </el-button>
              </el-upload>
            </div>
          </div>
          <!-- 文件内容主体 -->
          <div class="fileContext">
            <!-- 文件罗列卡片 -->
            <div
              class="fileCard"
              v-for="item in fileArray"
              :key="item.id"
              align="center"
              @mouseover="fileCardMouseover(item.id)"
              @mouseout="fileCardMouseout(item.id)"
            >
              <!-- 文件图标 -->
              <img :src="judge(item.path)">
              <!-- 文件名 -->
              <el-tooltip :content="item.name" placement="bottom" effect="light">
                <span class="text" :id="'span'+item.id" style="display:block;">{{ item.name }}</span>
              </el-tooltip>
              <!-- <input
                :value="item.name"
                :id="'input'+item.id"
                @blur="fileUpdate(item.id)"
                style="display:none;"
              >-->
              <!-- 遮罩层 -->
              <div :id="'bmbox'+item.id" class="bmbox" align="left">
                <input
                  type="checkbox"
                  :id="'checkbox'+item.id"
                  @change="fileCheckboxChange(item.id)"
                >
                <div style="width:100px;height:60px;" @click="preview(item.path)"></div>
              </div>
            </div>
            <!-- 文件重命名弹出框 -->
            <el-dialog title="重命名" :visible.sync="fileUpdateVisible" class="fileUpdateDialog">
              <el-form :model="fileUpdateForm">
                <el-form-item label="文件名" @keyup.enter="fileUpdate()">
                  <el-input v-model="fileUpdateForm.name" autocomplete="off" id="fileUpdateInput"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="fileUpdateVisible = false">取 消</el-button>
                <el-button type="primary" @click="fileUpdate()">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 文件预览失败警告框 -->
            <el-dialog title :visible.sync="previewVisible">
              <video id="player" width="100%" height="100%" controls>
                您的浏览器不支持HTML5
                <source :src="previewPath">
                <!-- 提供默认的播放视频  -->
              </video>
            </el-dialog>
          </div>
        </div>

        <div class="filePreview" id="filePreview">
          <el-button type="primary" @click="cancelPreview()">返回</el-button>
          <iframe :src="pdfPreviewPath" class="iframe" style="width:100%;height:100%"></iframe>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  get_chapter_and_unit_list, //获取所有章节
  get_chapters, //获取所有章
  get_unit_list, //获取所有节
  add_chapter, //添加章
  add_unit, //添加节
  delete_chapter, //删除章
  delete_unit, //删除节
  modify_chapter_name, // 修改章
  modify_unit_name, //修改节
  get_all_materials, //获取全部学习资料
  get_materials_by_chapter, //根据章获取学习资料
  get_materials_by_unit, //根据节获取学习资料
  delete_material, //删除文件
  upload_material, //资料上传
  modify_material_name, //修改文件名
  fileDownload //资源下载
} from "@/API/api";
let id = 1000;
export default {
  data() {
    return {
      showEdit: false, //目录模块顶部编辑编辑按钮是否显示(是否处于编辑状态)
      data: [{ id: null, name: "" }], //章节目录数据
      isExpanded: false, //展开/关闭所有目录
      typeselectData: [{ id: 1, name: "新增章" }, { id: 2, name: "新增节" }], //新增章节时，选择新增章还是节的下拉框内容
      addDialogVisible: false, //新增章节form表单弹出框
      updateDialogVisible: false, //修改章节弹出框是否显示
      updateNode: null, //修改章节弹出框缓存修改位置节点
      chapterSelectVisible: false, //新增章节时是否显示章选择下拉框
      chapterSelectData: [{ id: null, name: "" }], //章下拉框内容
      unitData: [{ id: null, name: "" }], //所有节内容
      levelLength: 1,
      addForm: {
        type: "",
        chapter: "",
        name: "",
        level: null
      },
      node: "",
      updateForm: {
        name: ""
      },
      formLabelWidth: "80px",
      fileArray: [{ id: null, name: "", path: "" }],
      fileOperationArray: [], //文件多选框已选中文件id
      currentChapter: null,
      currentUnit: null,
      previewVisible: false, //是否显示文件预览弹出框
      previewPath: "", //预览文件路径
      fileUpdateForm: {
        //文件重命名弹出框form表单
        name: ""
      },
      fileUpdateVisible: false, //文件重命名form表单弹出框
      pdfPreviewPath: "", //pdf预览路径
      teacherStudentShow: false //学生还是老师是否显示相关信息
    };
  },
  methods: {
    //获取所有章
    get_chaptersAll() {
      get_chapters().then(res => {
        if (res.data.code == 0) {
          this.chapterSelectData = res.data.object;
          this.levelLength = this.chapterSelectData.length + 1;
        } else {
        }
      });
    },
    //获取某一章下的所有节
    get_unit_list_all() {
      get_unit_list({
        chapterId: this.addForm.chapter
      }).then(res => {
        if (res.data.code == 0) {
          this.unitData = res.data.object;
          this.levelLength = this.unitData.length;
        } else {
        }
      });
    },
    openCloseAllMenu() {
      // console.log("----------------");
      // console.log(this.$refs.menuTree.store.defaultExpandAll);
      // this.$refs.menuTree.store.defaultExpandAll = true;
      for (
        var i = 0;
        i < this.$refs.menuTree.store._getAllNodes().length;
        i++
      ) {
        this.$refs.menuTree.store._getAllNodes()[i].expanded = this.isExpanded;
      }
      this.isExpanded = !this.isExpanded;
    },
    //单击新增按钮时调用此方法
    addDialog() {
      this.addDialogVisible = true;
      this.get_chaptersAll();
    },
    // 新增章节模态框时，改变新增类型时调用方法
    appendSelect() {
      if (this.addForm.type == 1) {
        this.chapterSelectVisible = false;
        this.levelLength = this.chapterSelectData.length;
      } else if (this.addForm.type == 2) {
        this.chapterSelectVisible = true;
        this.addForm.chapter = this.chapterSelectData[0].id;
        this.get_unit_list_all();
      } else {
      }
    },
    //新增章节模态框时，改变章下拉时出发此方法
    chapterChange() {
      this.get_unit_list_all();
    },
    // 添加章节
    append() {
      this.addDialogVisible = false;
      if (this.addForm.type == 1) {
        add_chapter({
          //添加章
          chapterName: this.addForm.name,
          level: this.addForm.level
        }).then(res => {
          if (res.data.code == 0) {
            this.$message("添加章成功");
            this.get_chaptersMy(); //获取所有章节
            this.addForm.name = "";
          } else {
            this.$message("添加章失败");
          }
        });
      } else if (this.addForm.type == 2) {
        add_unit({
          //添加节
          chapterId: this.addForm.chapter,
          unitName: this.addForm.name,
          level: this.addForm.level
        }).then(res => {
          if (res.data.code == 0) {
            this.$message("添加节成功");
            this.get_chaptersMy();
            this.addForm.name = "";
          } else {
            this.$message("添加节失败");
          }
        });
      }
    },
    // 修改章
    update(node) {
      this.updateDialogVisible = false;
      if (node.level == 1) {
        modify_chapter_name({
          chapterId: node.key,
          chapterName: this.updateForm.name
        }).then(res => {
          if (res.data.code == 0) {
            this.$message("修改章成功！");

            this.updateForm.name = "";
          } else {
            this.$message("修改章失败！");
          }
          this.get_chaptersMy();
        });
      } else if (node.level == 2) {
        //修改节
        modify_unit_name({
          unitId: node.key,
          unitName: this.updateForm.name
        }).then(res => {
          if (res.data.code == 0) {
            this.$message("修改节成功！");

            this.updateForm.name = "";
          } else {
            this.$message("修改节失败！");
          }
          this.get_chaptersMy();
        });
      }
    },
    //删除章节
    remove(node, data) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //node.level == 1删除章
          if (node.level == 1) {
            delete_chapter({
              chapterId: node.key
            }).then(res => {
              if (res.data.code == 0) {
                this.$message("删除章成功！");
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
              } else {
                this.$message("删除章失败！");
              }
              this.get_chaptersMy();
            });
          } else if (node.level == 2) {
            //node.level == 2删除节
            delete_unit({
              unitId: node.key
            }).then(res => {
              if (res.data.code == 0) {
                this.$message("删除节成功！");
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
              } else {
                this.$message("删除节失败！");
              }
            });
          }
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },

    //获取所有章节
    get_chaptersMy() {
      get_chapter_and_unit_list().then(res => {
        let obj = res.data.object;
        let databox = [];
        for (let i = 0; i < obj.length; i++) {
          let item = res.data.object[i];
          databox[i] = {};

          databox[i].id = item.id;
          databox[i].label = item.name;
          let units = [];

          for (let j = 0; j < item.units.length; j++) {
            units[j] = {};
            units[j].id = item.units[j].id;
            units[j].label = item.units[j].name;
          }
          databox[i].children = units;
        }
        if (databox.length > 0) {
          this.data = databox;
        }
      });
    },
    //获取全部学习资料
    get_all_materials() {
      this.currentChapter = "";
      this.currentUnit = "";
      get_all_materials({
        offset: 0,
        limit: 100
      }).then(res => {
        this.fileArray = res.data.object;
      });
    },

    //删除文件
    fileDelete() {
      if (this.fileOperationArray.length != 0) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            for (var i = 0; i < this.fileOperationArray.length; i++) {
              delete_material({
                materialId: this.fileOperationArray[i]
              }).then(res => {
                if (res.data.code == 0) {
                  this.$message("删除成功！");
                  this.fileOperationArray = [];
                  if (this.currentUnit != "") {
                    this.get_materials_by_unit(this.currentUnit); //根据当前所在的节获取学习资料
                  } else if (this.currentChapter != "") {
                    this.get_materials_by_chapter(this.currentChapter); //根据当前所在的章获取学习资料
                  } else {
                    this.get_all_materials(); //获取所有学习资料
                  }
                } else {
                  this.$message("删除失败！");
                }
              });
            }
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      } else {
        this.$message("请选择文件");
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
        ).style.display =
          "none";
      }
      this.fileOperationArray = []; //清空已选中文件
    },
    //  下载文件
    fileDowload() {
      if (this.fileOperationArray.length > 1) {
        this.$message("只能下载一个文件");
      } else if (this.fileOperationArray.length == 0) {
        this.$message("请选择文件");
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

    // 下载文件
    Dowload(src, name) {
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
      elink.style.display = "none";
      elink.href = url;
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
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
    //修改文件名按钮
    fileUpdateBlock() {
      if (this.fileOperationArray.length != 0) {
        this.fileUpdateVisible = true;
        for (var i = 0; i < this.fileArray.length; i++) {
          if (
            this.fileOperationArray[this.fileOperationArray.length - 1] ==
            this.fileArray[i].id
          ) {
            this.fileUpdateForm.name = this.fileArray[i].name;
          }
        }
      } else {
        this.$message("请选择文件");
      }
    },
    //修改文件名
    fileUpdate() {
      this.fileUpdateVisible = false; //隐藏修改文件名form表单弹出框和
      //遍历所有已选中文件，取消多选框选中及隐藏遮罩层
      console.log("-------------" + this.fileOperationArray.length);
      for (var i = 0; i < this.fileOperationArray.length; i++) {
        document.getElementById(
          "checkbox" + this.fileOperationArray[i]
        ).checked = false;
        document.getElementById(
          "bmbox" + this.fileOperationArray[i]
        ).style.display =
          "none";
      }
      //调用接口修改文件名
      modify_material_name({
        materialId: this.fileOperationArray[this.fileOperationArray.length - 1],
        materialName: document.getElementById("fileUpdateInput").value
      }).then(res => {
        if (res.data.code == 0) {
          this.$message("修改成功");
          if (this.currentUnit != "") {
            this.get_materials_by_unit(this.currentUnit); //根据当前所在的节获取学习资料
          } else if (this.currentChapter != "") {
            this.get_materials_by_chapter(this.currentChapter); //根据当前所在的章获取学习资料
          } else {
            this.get_all_materials(); //获取所有学习资料
          }
        } else {
          this.$message("修改失败");
        }
      });
      this.fileOperationArray = []; //清空已选中文件
    },
    //获取学习资料
    handleNodeClick(node) {
      this.node = node;
      if (node.level == 1) {
        this.get_materials_by_chapter(node.key);
        this.currentChapter = node.parent.key;
        this.currentChapter = node.key;
        this.currentUnit = "";
      } else if (node.level == 2) {
        this.get_materials_by_unit(node.key);
        this.currentChapter = node.parent.key;
        this.currentUnit = node.key;
      }
    },
    //根据章获取学习资料
    get_materials_by_chapter(chapterId) {
      get_materials_by_chapter({
        chapterId: chapterId,
        offset: 0,
        limit: 50
      }).then(res => {
        if (res.data.code == 0) {
          this.fileArray = res.data.object;
        } else {
        }
      });
    },
    //根据节获取学习资料
    get_materials_by_unit(unitId) {
      get_materials_by_unit({
        unitId: unitId,
        offset: 0,
        limit: 50
      }).then(res => {
        if (res.data.code == 0) {
          this.fileArray = res.data.object;
        } else {
        }
      });
    },
    //文件上传
    beforeUpload(file) {
      if (this.currentUnit != "") {
        let fd = new FormData();
        fd.append("file", file); //传文件
        fd.append("chapterId", this.currentChapter); //传其他参数
        fd.append("unitId	", this.currentUnit); //传其他参数
        upload_material(fd).then(res => {
          if (res.data.code == 0) {
            this.$message("上传成功");
            this.handleNodeClick(this.node);
            if (this.currentUnit != "") {
              this.get_materials_by_unit(this.currentUnit); //根据当前所在的节获取学习资料
            } else if (this.currentChapter != "") {
              this.get_materials_by_chapter(this.currentChapter); //根据当前所在的章获取学习资料
            } else {
              this.get_all_materials(); //获取所有学习资料
            }
          } else {
            this.$message("添加失败，请重试");
          }
        });
      } else {
        this.$message("请选择上传的节");
      }
      return false; //屏蔽了action的默认上传
    },
    newSubmitForm() {
      //确定上传
      this.$refs.newupload.submit();
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
        return require("./../../image/PPT.png");
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
        return require("./../../image/img.png");
      } else if (source == "rar" || source == "zip" || source == "7z") {
        return require("./../../image/rar.png");
      } else {
        return require("./../../image/unrecognizable.png");
      }
    },
    //文件预览
    preview(path) {
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
        console.log("视屏播放3D", cmd);
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
        }).then(() => {});
      }
    },
    //取消文件预览
    cancelPreview() {
      document.getElementById("right").style.display = "block";
      document.getElementById("filePreview").style.display = "none";
    }
  },
  mounted() {
    //判断学生/老师，隐藏/显示菜单操作按钮
    let role = JSON.parse(sessionStorage.getItem("user")).role;
    if (role == "student") {
      this.teacherStudentShow = false;
    } else {
      this.teacherStudentShow = true;
    }
    this.get_chaptersMy(); //获取所有章节
    this.get_all_materials(); //获取全部学习资料
    this.addForm.type = this.typeselectData[0].id; //新增章节时，默认新增章
  }
};
</script>
<style lang="less" scoped>
.box .row-bg .right {
  margin: 0;
}
.el-button el-button--primary {
  margin-left: 14px;
}
.el-upload {
  .el-button--small {
    padding: 0 0;
    font-size: 14px;
    // border-radius: 5px;
    height: 39px;
    width: 90px;
  }
}
.el-dialog__wrapper {
  left: 20%;
  top: 10%;
}
.fileUpdateDialog {
  width: 800px;
  height: 600px;
}
.introduceBox {
  height: 100%;
  .row-bg {
    height: 100%;
    .leftCol {
      min-width: 350px;
      overflow: hidden;
      .menu1 {
        border-right: 1px solid #dddddd;
        height: 100%;
        min-width: 366px;
        overflow-y: scroll;
        .twoButton {
          height: 50px;
          // .newlyAddedForm {
          //   width: 600px;
          //   height: 600px;
          // }
          .whole {
            float: left;
            margin-left: 10px;
          }
          .addButton {
            float: right;
            margin-right: 10px;
          }
          .edit {
            float: right;
            margin-right: 10px;
          }
        }
        .addInput {
          width: 220px;
        }
        .el-dialog {
          width: 30%;
        }
        .Catalog-t {
          border: none;
          font-size: 20px;
          margin-left: 17px;
        }
        .chapter {
          margin-top: 10px;
          .modifyForm {
            width: 800px;
            height: 600px;
          }
          .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
            .updateButton {
              background-image: url(./../../image/update.png);
              width: 20px;
              height: 20px;
            }
            .deleteButton {
              background-image: url(./../../image/delete.png);
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }
    .right {
      height: 100%;
      margin-left: 10px;
      margin-top: -1px;
      .operationButtons {
        padding: 0 30px;
        .fileUploadButton {
          margin-right: 10px;
        }
        .uploadDiv {
          display: inline-block;
        }
      }
      .fileContext {
        padding: 10px;
        .fileCard {
          float: left;
          width: 115px;
          height: 120px;
          cursor: pointer;
          position: relative;
          padding-right: 10px;
          margin-top: 35px;
          .bmbox {
            width: 100px;
            height: 70px;
            background: #dddddd;
            background: rgba(67, 67, 71, 0.116);

            display: none;
            position: absolute;
            // border: 1px solid rgb(224, 217, 217);
            border-top: 0px;
            top: -10px;
          }
          img {
            width: 50px;
            height: 50px;
            display: block;
            padding-bottom: 20px;
          }
        }
      }
    }
    .filePreview {
      width: 100%;
      height: 100%;
      display: none;
      margin-left: 10px;
      .iframe {
        height: 93%;
        width: 98%;
      }
    }
  }
  .text {
    width:75px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    height: 40px;
    table-layout: fixed;
    font-family: "微软雅黑"
  }
}
</style>
