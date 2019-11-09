<template>
  <div class="box">
    <el-row type="flex" class="Libraryrow">
      <el-col :span="3" style="width:250px;height:100%;">
        <div class="left">
          <div class="search">
            <el-input v-model="search" placeholder="请输入搜索内容" @keyup.enter.native="nowSearch()"></el-input>
            <img src="./../../image/search .png" alt="暂无图片" @click="nowSearch()" />
          </div>
          <div v-if="isposition">
            <el-button type="primary" class="addelement" @click="addcomponent()">添加设备</el-button>
          </div>
          <div v-if="isposition">
            <el-button type="primary" class="addelement" @click="isElemenType=true">编辑设备组</el-button>
          </div>
          <div v-if="isposition">
            <el-button type="primary" class="addelement" @click="isElemenType=true">选择元件到课程</el-button>
          </div>
          <div class="menu elementList">
            <el-menu
              default-active="0"
              background-color="#313131"
              text-color="#fff"
              active-text-color="#ffd04b"
            >
              <el-menu-item index="0" @click="handleOpen()">
                <span slot="title">全部</span>
              </el-menu-item>

              <el-menu-item
                v-bind:index="String(index+1)"
                @click="handleOpen(item)"
                v-for="(item,index) in original"
                :key="item.id"
              >
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
      </el-col>
      <el-col :span="21" style="overflow: auto;">
        <div style="margin:20px 30px 0 40px" v-if="isposition">
          <el-button type="primary" @click="addcomponent()">添加设备</el-button>
          <el-button type="primary" @click="isElemenType=true">编辑设备组</el-button>
          <el-button type="primary" @click="isElemenselect=true">选择设备到课程</el-button>
        </div>
        <!-- 卡片化 -->
        <ul>
          <li v-for="(item) in boxlist" :key="item.id" class="li">
            <div>
              <el-card :body-style="{ padding: '0px' }">
                <div style="width:70%;height:180px;margin:30px 15%;">
                  <img :src="item.icon" alt="暂无图片" class="image" />
                </div>
                <div style="padding: 5px;height:50px;">
                  <p style=" text-align: center">{{item.name}}</p>
                </div>
              </el-card>
            </div>

            <!-- <div class="mask">
              <el-button
                class="btn"
                type="warning"
                plain
                @click="innerVisible=true,get_component_by_id(item.id)"
              >进入元件</el-button>
            </div>-->
            <div class="mask" style="width:600px">
              <div style="height:20px;  float: right;">
                <i
                  class="el-icon-edit-outline"
                  style="font-size:25px;margin:5px;"
                  @click="isaddspecification=true"
                ></i>
              </div>
              <ul>
                <li
                  v-for="(item,index) in boxlist"
                  :key="item.id"
                  class="lis"
                  @click="innerVisible=true,get_component_by_id(item.id)"
                >
                  <el-card :body-style="{ padding: '0px' }">
                    <div style="width:70%;height:180px;margin:30px 15%;">
                      <!-- <img :src="item.icon" alt="暂无图片" class="image" /> -->
                      <p>这是型号说明。。。。。。</p>
                    </div>
                    <div style="padding: 5px;height:50px;">
                      <p style=" text-align: center">热继电器{{index}}</p>
                    </div>
                  </el-card>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>
    <!-- 设备详情弹框 -->
    <el-dialog width="90%" title="设备详情" top="7vh" :visible.sync="innerVisible" @close="detdialog">
      <div class="line"></div>
      <div style="height:75vh">
        <div class="right" style="display:balck">
          <div class="details">
            <div style=" overflow:auto;height: 100%;">
              <div class="details-t">
                <div class="introductionComponents-t">设备介绍</div>
                <p class="introduce" v-html="Trim( elementObj.introduction)"></p>
                <el-image
                  :src="elementObj.schematic"
                  class="detailslmg chongqing"
                  style="width:80%"
                ></el-image>
                <el-button
                  size="small"
                  class="introduceButton-c"
                  type="primary"
                  style="right:70px"
                  v-if="isposition"
                  round
                  @click="Deletecomponent(elementObj.id)"
                  v-show="teacherStudentShow"
                >删除设备</el-button>
                <el-button
                  size="small"
                  class="introduceButton-c"
                  type="primary"
                  round
                  @click="isVisibleres=true"
                  v-show="teacherStudentShow"
                >修改</el-button>
                <el-dialog
                  title="修改设备介绍"
                  :visible.sync="modifyIntroduceVisible"
                  class="modifyIntroduceForm newlyAddedForm"
                  @open="detdialog"
                  @close="on_click_show_unity_window"
                  append-to-body
                >
                  <el-input
                    type="textarea"
                    :rows="5"
                    v-model="introductionComponentsInput"
                    autocomplete="off"
                  ></el-input>
                  <div slot="footer" class="dialog-footer">
                    <el-button
                      type="primary"
                      @click="modifyIntroduceVisible = false"
                      size="mini"
                      class="cancel"
                    >取 消</el-button>
                    <el-button
                      type="primary"
                      @click="modifyComponentIntroduction()"
                      size="mini"
                      class="Sure"
                    >确 定</el-button>
                  </div>
                </el-dialog>
              </div>
              <template>
                <div class="introductionComponents-t">设备规格</div>
                <el-table
                  :data="elementObjTable"
                  border
                  style="width: 100%"
                  :header-cell-style="{background:'#ebeffb'}"
                >
                  <el-table-column fixed prop="vendor" label="厂商" min-width="20"></el-table-column>
                  <el-table-column label="规格参数" min-width="40">
                    <template slot-scope="scope">
                      <p v-html="Trim(scope.row.parameter)" style="white-space: pre-wrap;"></p>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <div class="Model" v-if="isposition">添加模型ID</div>
              <div style="margin-top:20px;" v-if="isposition">
                <el-input placeholder="请输入模型ID" v-model="modelID" class="input-with-select option">
                  <el-button
                    slot="append"
                    @click="modify_component_model(modelID)"
                    class="bottom"
                  >添加</el-button>
                </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 增加设备弹窗 -->
    <el-dialog width="60%"  :close-on-click-modal="false" title="增加设备" top="7vh" :visible.sync="isVisible" class="modify">
      <div>
        <el-form :model="form" ref="form" label-width="80px" :rules="rules">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="设备组别">
            <el-select v-model="form.groupId" multiple placeholder="请选择添加类型">
              <!-- <el-option label="全部" value="全部"></el-option> -->
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in original"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备图片" prop="icon">
            <el-upload
              class="avatar-uploader"
              action="/img/add_resource"
              :show-file-list="false"
              :on-progress="handleAvatarSuccessicon"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="elementUrl" :src="elementUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="设备介绍" prop="introduction">
            <el-input type="textarea" v-model="form.introduction"></el-input>
          </el-form-item>
          <el-form-item label="二维符号图">
            <el-upload
              class="avatar-uploader"
              action="/img/add_resource"
              :show-file-list="false"
              :on-progress="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="circuitUrl" :src="circuitUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="设备厂商">
            <el-input v-model="form.vendor"></el-input>
          </el-form-item>
          <el-form-item label="规格参数">
            <el-input type="textarea" v-model="form.parameter"></el-input>
          </el-form-item>

          <el-form-item class="dialog-footer">
            <el-button
              type="primary"
              style="float: right;margin-right:10px;"
              class="preservation"
              size="mini"
              @click="add_component('form')"
            >添 加</el-button>
            <el-button
              type="primary"
              style="float: right;margin-right:10px;"
              @click="isVisible=false"
              class="closeButton"
              size="mini"
            >取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 编辑设备类型弹窗 -->
    <el-dialog
      width="40%"
      title="编辑设备组"
      :close-on-click-modal="false"
      top="7vh"
      :visible.sync="isElemenType"
      class="modify"
    >
      <div>
        <div style="height:120px">
          <!-- <p style="height:40px">删除类别： 注*设备组内设备没有清空，不能删除。</p> -->
          <p style="height:40px">删除类别：</p>
          <el-select v-model="detcomponentvalue" placeholder="请选择空设备组">
            <el-option
              v-for="item in original"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.components.length>0?true:false"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            style="margin:0 40px"
            @click="detcomponent()"
            class="confirm"
          >确认删除</el-button>
        </div>
        <div style="height:120px">
          <p style="height:40px">添加设备组：</p>

          <el-input
            placeholder="请输入设备组名称"
            v-model="addcomponentinpit"
            class="input-with-select"
            style="width:50%"
          ></el-input>
          <el-button
            type="primary"
            style="margin:0 40px"
            class="confirm"
            @click="addcomponentgroup()"
          >确认添加设备组</el-button>
        </div>
        <div style="height:80px">
          <el-button type="primary" @click="isElemenType=false" class="closebutton">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 编辑设备弹窗 -->
    <el-dialog width="60%"  :close-on-click-modal="false" title="修改设备" top="7vh" :visible.sync="isVisibleres" class="modify">
      <div>
        <el-form :model="form" ref="form" label-width="80px" :rules="rules">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="设备组别" prop="groupId">
            <el-select v-model="form.groupId" placeholder="请选择添加类型">
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in original"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备图片" prop="icon">
            <el-upload
              class="avatar-uploader"
              action="/img/add_resource"
              :show-file-list="false"
              :on-progress="handleAvatarSuccessicon"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="elementUrl" :src="elementUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="设备介绍" prop="introduction">
            <el-input type="textarea" v-model="form.introduction"></el-input>
          </el-form-item>
          <el-form-item label="二维符号图">
            <el-upload
              class="avatar-uploader"
              action="/img/add_resource"
              :show-file-list="false"
              :on-progress="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="circuitUrl" :src="circuitUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="设备厂商">
            <el-input v-model="form.vendor"></el-input>
          </el-form-item>
          <el-form-item label="规格参数">
            <el-input type="textarea" v-model="form.parameter"></el-input>
          </el-form-item>
          <el-form-item class="dialog-footer">
            <el-button
              type="primary"
              style="float: right;margin-right:10px;"
              class="preservation"
              size="mini"
            >添 加</el-button>
            <el-button
              type="primary"
              style="float: right;margin-right:10px;"
              @click="isVisibleres=false"
              class="closeButton"
              size="mini"
            >取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 选择设备到课程 -->
    <el-dialog :visible.sync="isElemenselect "  :close-on-click-modal="false" width="40%" title="选择设备到课程">
      <div>
        <!-- <div style="margin:20px 0px">
          <span style="width:150px;display: inline-flex;">选中的设备：</span>
          <el-select v-model="addform.name" multiple placeholder="请选择设备" style="width:70%">
            <el-option v-for="item in original" :key="item.value" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>-->
        <div>
          <span style="width:150px;display: inline-flex;">载入的课程：</span>
          <el-select v-model="addform.type" placeholder="请选择课程" style="width:70%">
            <el-option
              v-for="item in original"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div style="margin:20px 0px">
          <span style="width:150px;display: inline-flex;height:50px">选中的设备：</span>
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入实训名称"
            v-model="value2"
            :titles="['设备库', '选中的设备']"
            :button-texts="['移除设备', '选中设备']"
            :data="data2"
            width
          ></el-transfer>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isElemenselect = false" class="cancel" size="mini">取 消</el-button>
        <el-button type="primary" class="Sure" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 增加型号说明 -->
    <el-dialog :visible.sync="isaddspecification " width="40%" title="编辑型号">
      <div>
        <div style="margin:20px 0px">
          <span style="width:150px;display: inline-flex;">删除设备型号：</span>
          <el-select v-model="addform.name" multiple placeholder="请选择设备" style="width:50%">
            <el-option
              v-for="item in original"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type="danger" style="margin:0 20px">确认删除</el-button>
        </div>
        <div style="margin:20px 0px">
          <span style="width:150px;display: inline-flex;">添加型号名称：</span>
          <el-input placeholder="请输入规格名称" v-model="input10" style="width:50%" clearable></el-input>
          <el-button type="success" style="margin:0 20px">确认添加型号</el-button>
        </div>
        <div>
          <span style="width:150px;display: inline-flex;height:50px">添加型号说明：</span>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2}"
            placeholder="请输入内容"
            v-model="textarea3"
            style="width:50%"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isaddspecification = false" class="cancel" size="mini">取 消</el-button>
        <el-button type="primary" class="Sure" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  get_component_group, //获取原件组件
  get_component_by_group, //根据设备组获取设备
  get_group_and_component, //获取设备组和设备
  get_component_by_id, //根据设备id获取设备
  modify_component_introduction, //修改设备介绍
  modify_component_parameter, // 修改设备参数
  modify_component_model, //修改设备模型
  rename_component, //设备重命名
  add_component, //设备添加
  delete_component, //设备删除
  search_component, //设备搜索
  add_component_group, //添加设备组
  delete_component_group, //删除设备组
  uploadFile, // 上传,
  Trim
} from "@/API/api";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    const generateData2 = _ => {
      const data = [];
      const cities = ["plc", "设备", "plc", "plc", "plc", "plc", "plc"];
      const pinyin = ["plc", "设备", "plc", "plc", "plc", "plc", "plc"];
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        });
      });
      return data;
    };
    return {
      data2: generateData2(),
      value2: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      value: "",
      type: "", //当前服务商代号
      search: "", //搜索框内容
      original: [{ id: null, name: "", components: "[]" }], //所有设备组和设备
      boxlist: [],
      boxlistJson: [], //序列化后
      innerVisible: false,
      isVisible: false, //设备增加
      isVisibleres: false, //设备修改
      isElemenType: false, //编辑设备类型
      isElemenselect: false, //编辑设备类型
      isaddspecification: false, //增加型号说明
      isposition: false, //教导主任，特殊老师权限。
      addform: {
        name: "",
        id: "",
        type: ""
      },
      elementObj: {
        //设备对象
        aliasChinese: "", //中文别名
        aliasEnglish: "", //英文别名
        groupId: "", //组id
        id: "", //设备id
        introduction: "", //设备介绍
        name: "", //名字
        parameter: "", //参数
        schematic: "", //设备介绍图标路径
        type: "",
        vendor: ""
      },
      elementObjTable: [
        {
          parameter: ""
        }
      ],
      modifyIntroduceVisible: false, //修改设备介绍弹出框是否显示
      formLabelWidth: "120px",
      introductionComponentsInput: "", //修改设备介绍编辑框
      modifyParametersVisible: false, //修改设备参数弹出框是否显示
      modifyParametersInput: "", //修改设备参数编辑框
      teacherStudentShow: false, //教师还是学生是否显示编组件
      modelID: "", //模型ID
      elementUrl: "",
      circuitUrl: "",
      form: {
        name: "",
        icon: "",
        introduction: "",
        schematic: "",
        vendor: "",
        parameter: "",
        groupId: ""
      },
      addcomponentinpit: "", //新增加类别名称。
      detcomponentvalue: "", //删除的类别ID
      rules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        icon: [{ required: true, message: "请选择图片", trigger: "change" }],
        introduction: [
          { required: true, message: "请输入设备介绍", trigger: "blur" }
        ],
        vendor: [
          { required: true, message: "请输入设备厂商", trigger: "blur" }
        ],
        parameter: [
          { required: true, message: "请输入设备规格参数", trigger: "blur" }
        ],
        groupId: [
          { required: true, message: "请输入设备规格参数", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    ...mapState(["elementList"])
    // boxlist:function (){
    //   let box=[];
    //   for(let i=0;i<this.original.length;i++){
    //     let item =this.original[i]
    //     for(let j=0;j<item.length;j++){
    //         box.push(item[j])
    //     }
    //   }
    //   // this.boxlist=box;
    //   return box;

    // }
  },
  methods: {
    ...mapActions(["element"]),
    Trim,

    handleAvatarSuccessicon(res, file) {
      this.elementUrl = URL.createObjectURL(file.raw);
      this.form.icon = file.raw;
    },
    handleAvatarSuccess(res, file) {
      this.circuitUrl = URL.createObjectURL(file.raw);
      this.form.schematic = file.raw;
    },
    beforeAvatarUpload(file, res) {
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传图片只能是 JPG 格式!");
      //   return;
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传图片大小不能超过 2MB!");

      // }
      //  this.imageUrl = URL.createObjectURL(file.raw);

      // return isJPG && isLt2M;
      return;
    },
    //提交设备
    // add_component(formName) {
    //   console.log(formName);
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       console.log(this.from);
    //       this.$message({
    //         showClose: true,
    //         duration: 1000,
    //         message: "新增成功",
    //         type: "success"
    //       });
    //     } else {
    //       this.$message.error({
    //         showClose: true,
    //         duration: 1000,
    //         message: "输入异常，请看错误提示",
    //         type: "warning"
    //       });
    //       return false;
    //     }
    //   });
    // },
    //编辑设备确认删除
    // isElemenType() {
    //   this.isElemenType = false; //关闭弹窗
    // },
    //获取设备组和设备
    getGroupAndComponent() {
      get_group_and_component()
        .then(res => {
          if (res.data.code == 0) {
            this.original = res.data.object;
            if (this.$route.query.type != null) {
              let list = res.data.object;
              for (let i = 0; i < list.length; i++) {
                if (this.$route.query.type == list[i].id) {
                  this.boxlist = list[i].components;
                  break;
                }
              }
            } else {
              this.getGroupAndComponentbox(res.data.object);
            }
            this.element(res.data.object);
          }
        })
        .catch(function(error) {});
    },
    getGroupAndComponentbox(row) {
      let box = [];
      for (let i = 0; i < row.length; i++) {
        let item = row[i];
        for (let j = 0; j < item.components.length; j++) {
          box.push(item.components[j]);
        }
      }
      this.boxlist = box;
    },
    go3D(type) {
      this.$emit("yuangounity", type);
    },
    //点击设备时触发此函数
    get_component_by_id(id) {
      get_component_by_id({
        componentId: id
      }).then(res => {
        if (res.data.code == 0) {
          this.elementObj = res.data.object;
          this.elementObj.parameter = res.data.object.parameter.replace(
            /\n/g,
            "<br>"
          );
          this.elementObjTable = [];
          this.elementObjTable.push({
            manufacturer: this.elementObj.name,
            parameter: this.elementObj.parameter,
            vendor: this.elementObj.vendor
          });
          // 打开3d
          // 处理类型
          let type = res.data.object.type;
          // type += "/" + res.data.object.aliasChinese;
          this.go3D(type);
          this.type = res.data.object.aliasChinese;
          this.on_click_show_unity_window();
        }
      });
    },
    nowSearch() {
      if (this.search != "") {
        search_component({
          name: this.search
        }).then(res => {
          if (res.data.code == 0) {
            this.getGroupAndComponentbox(res.data.object);
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: "请输入搜索内容！",
          duration: 1000,
          type: "error"
        });
      }
    },
    // 编辑模型ID
    modify_component_model() {
      if (this.modelID.length == null || this.modelID.length == "") {
        this.$message({
          showClose: true,
          message: "添加模型ID为空",
          duration: 1000,
          type: "error"
        });
      } else {
        modify_component_model({
          id: this.elementObj.id,
          type: this.modelID
        })
          .then(res => {
            this.$message({
              type: "success",
              message: "添加模型ID成功!"
            });
            // this.modelID=""
            this.get_component_by_id(this.elementObj.id);
          })
          .catch(() => {
            this.$message({
              showClose: true,
              message: "添加模型ID失败",
              duration: 1000,
              type: "error"
            });
          });
      }
    },

    // 添加设备
    addcomponent() {
      this.isVisible = true;
      this.form = {
        name: "",
        icon: "",
        introduction: "",
        schematic: "",
        vendor: "",
        parameter: "",
        groupId: ""
      };
      this.elementUrl = "";
      this.circuitUrl = "";
    },
    //提交新增设备
    add_component(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let from = this.form;
          let fd = new FormData();
          fd.append("name", from.name); //传文件
          fd.append("icon", from.icon);
          fd.append("introduction", from.introduction);
          fd.append("schematic", from.schematic);
          fd.append("vendor", from.vendor);
          fd.append("parameter", from.parameter);
          fd.append("groupId	", from.groupId);
          // return;
          add_component(fd).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.detcomponentvalue = "";
              this.isVisible = false;
              this.getGroupAndComponent();
            } else {
              this.$message.error({
                showClose: true,
                duration: 1000,
                message: res.data.msg,
                type: "warning"
              });
            }
          });
        } else {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: "输入异常，请看错误提示",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 编辑类别
    //删除类别设备组
    detcomponent() {
      if (this.detcomponentvalue == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "设备组名称为空",
          type: "warning"
        });
        return;
      }
      delete_component_group({
        groupId: this.detcomponentvalue
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.detcomponentvalue = "";
            this.isElemenType = false;
            this.getGroupAndComponent();
          } else {
            this.$message.error({
              showClose: true,
              duration: 1000,
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: "删除失败",
            type: "warning"
          });
        });
    },
    // 添加设备组
    addcomponentgroup() {
      if (this.addcomponentinpit == "") {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "设备组名称为空",
          type: "warning"
        });
        return;
      } else {
        add_component_group({
          groupName: this.addcomponentinpit
        })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "新增加设备组成功!"
              });
              this.addcomponentinpit = "";
              this.isElemenType = false;
              this.getGroupAndComponent();
            } else {
              this.$message.error({
                showClose: true,
                duration: 1000,
                message: res.data.msg,
                type: "warning"
              });
            }
          })
          .catch(() => {
            this.$message.error({
              showClose: true,
              duration: 1000,
              message: "新增失败",
              type: "warning"
            });
          });
      }
    },

    // 删除设备
    Deletecomponent(id) {
      this.$confirm("此操作将永久删除该设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delete_component({
            componentId: id
          }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            (this.innerVisible = false), this.getGroupAndComponent();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //修改设备介绍弹出框显示
    introductionRevisionButton() {
      this.modifyIntroduceVisible = true;
      this.introductionComponentsInput = this.elementObj.introduction;
    },
    //修改设备介绍方法
    modifyComponentIntroduction() {
      this.modifyIntroduceVisible = false;
      modify_component_introduction({
        componentId: this.elementObj.id,
        introduction: this.introductionComponentsInput
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            duration: 1000,
            message: "修改成功！",
            type: "success"
          });
          this.get_component_by_id(this.elementObj.id);
        } else {
          this.$message({
            showClose: true,
            message: "修改失败！",
            duration: 1000,
            type: "error"
          });
        }
      });
    },
    //修改设备参数弹出框显示
    // modifyParametersButton() {
    //   this.modifyParametersVisible = true;
    //   this.modifyParametersInput = this.elementObj.parameter;
    //   this.modifyParametersInput = this.elementObj.parameter.replace(
    //     /<br \/>/g,
    //     " "
    //   );
    // },
    //修改设备参数方法
    // modifyComponentParameter() {
    //   this.modifyParametersVisible = false; //点击确定修改设备参数 取消模态框
    //   modify_component_parameter({
    //     componentId: this.elementObj.id,
    //     parameter: this.modifyParametersInput
    //   })
    //     .then(res => {
    //       if (res.data.code == 0) {
    //         this.$message("修改成功！");
    //         this.get_component_by_id(this.elementObj.id);
    //       } else {
    //         this.$message.error("修改失败！");
    //       }
    //     })
    //     .catch(function (error) {
    //     });
    // },
    // 获取设备组件
    get_component_group() {
      get_component_group({}).then(res => {});
    },
    //菜单展开时调用
    handleOpen(row) {
      if (row) {
        this.boxlist = row.components;
      } else {
        this.getGroupAndComponentbox(this.original);
      }
    },

    // 选择设备到课程调用
    generateData2() {
      console.log("121", this.isVisible);
      const data = [];
      const cities = ["plc", "电器", "广州", "深圳", "南京", "西安", "成都"];
      const pinyin = [
        "shanghai",
        "beijing",
        "guangzhou",
        "shenzhen",
        "nanjing",
        "xian",
        "chengdu"
      ];
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        });
      });
      return data;
    },
    //菜单关闭时调用

    detdialog() {
      this.on_click_hide_unity_window();
      this.modelID = ""; //关闭弹窗 清空添加模型Id
    },
    on_click_show_unity_window() {
      let type = this.type;
      let cmd = "";
      if (type == "gxdl") {
        cmd =
          "{'opcode':8,'LocationX': 575,'LocationY':150,'LocationX_Right': 135,'LocationY_Buttom':95,'SizeX': 1210,'SizeY':700}";
      } else if (type == "zjxf") {
        cmd =
          "{'opcode':9,'LocationX': 575,'LocationY':150,'LocationX_Right': 135,'LocationY_Buttom':95,'SizeX': 1210,'SizeY':700}";
      } else {
        cmd =
          // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
          "{'opcode':4,'LocationX': 575,'LocationY':150,'LocationX_Right': 135,'LocationY_Buttom':95,'SizeX': 1210,'SizeY':700}";
        // "{'opcode':4,'LocationX': 755,'LocationY':135,'LocationX_Right': 15,'LocationY_Buttom':10,'SizeX': 1620,'SizeY':760}";
        // "{'opcode':4,'LocationX': 950,'LocationY':150,'LocationX_Right': 10,'LocationY_Buttom':100,}";
      }
      if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
    },

    on_click_hide_unity_window() {
      var cmd = "{'opcode':3}";

      if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
    },
    //判断教导主任
    supervisor() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      if (user.position == "supervisor" && user.role == "teacher") {
        this.isposition = true;
      } else {
        this.isposition = false;
      }
    },
    // 接受内容
    params() {
      if (this.$route.query != null) {
        this.getGroupAndComponent(); //获取设备组和设备
      }
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        this.params();
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    //特殊教导主任权限
    this.supervisor();

    // 缓存机制
    // if (this.elementList.length > 0) {
    //   this.original = this.elementList;
    //   this.getGroupAndComponentbox(this.elementList);
    // } else {
    //   this.getGroupAndComponent(); //获取设备组和设备
    // }
    this.getGroupAndComponent(); //获取设备组和设备
    // this.get_component_group() //设备组名

    //判断学生/教师，隐藏/显示菜单操作按钮
    let role = JSON.parse(sessionStorage.getItem("user")).role;
    if (role == "student") {
      this.teacherStudentShow = false;
    } else {
      this.teacherStudentShow = true;
    }
  },
  mounted() {},
  destroyed() {
    // this.on_click_hide_unity_window();
  }
};
</script>

<style lang="less" scoped>
.box {
  height: 100%;
  .Libraryrow {
    height: 100%;
    width: 101%;
    .left {
      background-color: #313131;
      height: 100%;
      overflow: hidden;
      .search {
        position: relative;
        height: 30px;
        width: 200px;
        margin-top: 10px;
        margin-left: 25px;

        img {
          height: 22px;
          right: 10px;
          top: 5px;
          position: absolute;
        }
      }
      .menu {
        height: 100%;
        overflow: auto;
        width: 270px;
        overflow: auto;
        margin-top: 10px;

        .el-menu-item {
          font-size: 18px;
        }
        .element {
          border-radius: 5px;
          margin: 0 10%;
        }
      }
    }
  }
  .line {
    margin: -30px 1250px 20px 0px;
    height: 1px;
    background-color: #d9d9d9;
  }
  .introductionComponents-t {
    font-size: 20px;
    padding-bottom: 20px;
    font-family: "Microsoft YaHei";
    font-weight: 500;
    padding-left: 15px;
    color: #00a0e9;
  }
  .Model {
    margin-top: 20px;
    font-size: 20px;
    font-family: "Microsoft YaHei";
    font-weight: 500;
    padding-left: 15px;
    color: #00a0e9;
  }
}
.bottom :hover {
  color: #fff;
}
.confirm {
  margin: 0 40px;
  background-color: #00a0e9;
  border: none;
}
.closebutton {
  background-color: #66c6f2;
  border: none;
  float: right;
  margin-right: 60px;
  margin-top: 30px;
}
.addelement {
  background-color: #282828;
  border-radius: 0px;
  border: none;
  width: 80%;
  margin: 10px 10%;
}

.right {
  height: 100%;
  margin-left: 10px;
  .details {
    height: 100%;
    width: 440px;
    overflow: hidden;

    .details-t {
      position: relative;
      padding: 10px;
      .modifyIntroduceForm {
        width: 1000px;
        height: 600px;
        left: 20px;
        top: 100px;
        margin: 0px;
      }
      .introduce {
        width: 90%;
        text-indent: 2em;
        white-space: pre-wrap;
      }
      .introduceButton-c {
        background-color: #00a0e9;
        border: none;
        border-radius: 0px;
        margin-right: 5px;
        right: 0px;
        position: absolute;
        top: 10px;
      }
    }
    .picture {
      border-bottom: 1px solid #dddd;
      padding-left: 20px;
    }
  }
}
.enter {
  img {
    vertical-align: text-top;
  }
}
.li {
  position: relative;
  width: 238.5px;
  float: left;
  margin: 20px;
  cursor: pointer;

  // overflow: hidden;
  .mask {
    position: absolute;
    top: 101%;
    left: 0;
    display: none;
    z-index: 99;
    // width: 238.5px;
    min-width: 238.5px;
    height: 340px;
    background: rgba(101, 101, 101, 0.6);
    color: #ffffff;
    .btn {
      margin-left: 70px;
      margin-top: 120px;
      border-radius: 20px;
    }
  }
}
.lis {
  position: relative;
  width: 238.5px;
  float: left;
  margin: 20px;
  cursor: pointer;
}
.li:hover .mask {
  // top: 0;
  display: block;
  transition-duration: 0.5s;
}
.image {
  width: 100%;
  display: block;
}
</style>

<style>
.elementList .el-menu-item {
  padding: 10px;
}
.elementList .el-menu-item p {
  text-align: center;
  line-height: 20px;
}
.elementList .el-menu-item img {
  padding-left: 10%;
  width: 100px;
  height: 100px;
}
.details-t .el-image__inner {
  padding-left: 30px;
}
.search .el-input__inner {
  border-radius: 0px;
  border-right: none;
  border-top: none;
}
.el-upload-list--text {
  display: none;
}
.left .el-menu {
  background-color: #313131;
  margin-bottom: 200px;
}

.Libraryrow .el-input__inner {
  color: white;
  background-color: #282828;
  border: 0px solid #282828;
  height: 30px;
}
.Libraryrow .el-menu-item {
  line-height: 36px;
}
.dialog-footer .cancel {
  background-color: #66c6f2;
  border-radius: 0px;
  width: 70px;
  height: 30px;
  border: none;
}
.dialog-footer .Sure {
  background-color: #00a0e9;
  border: none;
  width: 70px;
  height: 30px;
  border-radius: 0px;
}
.newlyAddedForm .el-dialog__title {
  color: #00a0e9;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader {
  width: 180px;
}
.left .el-button--primary:hover {
  background-color: #282828;
}
.left .el-button--primary:focus {
  background-color: #282828;
  color: #ffd04b;
}
.box .option .el-button {
  background-color: #b2e2f8;
  border-radius: 0px;
}
.box .option .el-button:hover {
  background-color: #66c6f2;
  border-radius: 0px;
}
.box .el-transfer-panel {
  width: 35%;
}
</style>


