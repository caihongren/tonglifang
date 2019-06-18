<template>
  <div class="box">
    <el-row type="flex" class="row-bg Libraryrow">
      <el-col :span="4" style="width:300px">
        <div class="grid-content bg-purple left" >
          <div class="search">
            <el-input  v-model="search" placeholder="请输入搜索内容" @keyup.enter.native="nowSearch()"></el-input> 
            <img src="./../../image/search .png" @click="nowSearch()">
          </div>
          <div class=" menu elementList">
            <el-menu @open="handleOpen" @close="handleClose" v-for="item in original" :key="item.id">
              <el-submenu index="item.id">
                <template slot="title">
                  <p style="font-size:16px">{{item.name}}</p>
                  
                  </template>
                <el-menu-item index="item.id" v-for="items in item.components" :key="items.id" @click="get_component_by_id(items.id)">
                  <div class="element">
                    <img :src="items.icon">
                    <p style="padding-left:20px">{{items.name}}</p>
                  </div>
                </el-menu-item>
              </el-submenu>
            </el-menu>
            <div style="height:200px"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light right">
          <div class="details">
            <div class="details-t">
              <div class="introductionComponents-t"> 元件介绍</div>
              <p class="introduce">{{ elementObj.introduction}}</p> 
                <el-image :src="elementObj.schematic" class="detailslmg" style="width:80%"></el-image>
              <el-button  class="introduceButton-c" type="primary" round  @click="introductionRevisionButton()" v-show="teacherStudentShow">修改</el-button>
              <el-dialog title="修改元件介绍" :visible.sync="modifyIntroduceVisible" class="modifyIntroduceForm">
                <el-input type="textarea" :rows="5" v-model="introductionComponentsInput" autocomplete="off"></el-input>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="modifyIntroduceVisible = false">取 消</el-button>
                  <el-button type="primary" @click="modifyComponentIntroduction()">确 定</el-button>
                </div>
              </el-dialog>
            </div>
            <!-- <div class="picture"> -->
            
            <!-- </div> -->
            <div class="para">
              <div class="introductionComponents-t"> 元件参数</div>
              <p class="introducetwo" v-html="elementObj.parameter"></p> 
                <el-button  class="parameterButton-c"  type="primary" round  @click="modifyParametersButton()" v-show="teacherStudentShow">修改</el-button>
              <el-dialog title="修改元件参数" :visible.sync="modifyParametersVisible" class="modifyParameterForm">
                <el-input type="textarea" :rows="5" v-model="modifyParametersInput" autocomplete="off"></el-input>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="modifyParametersVisible = false">取 消</el-button>
                  <el-button type="primary" @click="modifyComponentParameter()">确 定</el-button>
                </div>
              </el-dialog>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  get_component_group, //获取原件组件
  get_component_by_group, //根据元件组获取元件
  get_group_and_component, //获取元件组和元件
  get_component_by_id, //根据元件id获取元件
  modify_component_introduction, //修改元件介绍
  modify_component_parameter, // 修改元件参数
  rename_component, //元件重命名
  delete_component, //元件删除
  search_component //元件搜索
} from "@/API/api";
export default {
  data() {
    return {
      search: "", //搜索框内容
      original: [{ id: null, name: "", components: "[]" }], //所有元件组和元件
      elementObj: {
        //元件对象
        aliasChinese: "", //中文别名
        aliasEnglish: "", //英文别名
        groupId: "", //组id
        id: "", //元件id
        introduction: "", //元件介绍
        name: "", //名字
        parameter: "", //参数
        schematic: "", //元件介绍图标路径
        type: ""
      },
      modifyIntroduceVisible: false, //修改元件介绍弹出框是否显示
      formLabelWidth: "120px",
      introductionComponentsInput: "", //修改元件介绍编辑框
      modifyParametersVisible: false, //修改元件参数弹出框是否显示
      modifyParametersInput: "", //修改元件参数编辑框
      teacherStudentShow: false //老师还是学生是否显示编组件
    };
  },
  methods: {
    //获取元件组和元件
    getGroupAndComponent() {
      get_group_and_component()
        .then(res => {
          if (res.data.code == 0) {
            this.original = res.data.object;
            this.get_component_by_id(this.original[1].components[0].id); //默认获取第一个元件
          } else {
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    go3D(type) {
      this.$emit("yuangounity", type);
    },
    //点击元件时触发此函数
    get_component_by_id(id) {
      get_component_by_id({
        id: id
      })
        .then(res => {
          if (res.data.code == 0) {
            console.log("----------");
            console.log(res.data.object);
            this.elementObj = res.data.object;
            this.elementObj.parameter = res.data.object.parameter.replace(
              /\n/g,
              "<br />"
            );
            // 打开3d
            this.go3D(res.data.object.type);
          } else {
            console.log("获取元件失败");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    nowSearch() {
      search_component({
        name: this.search
      })
        .then(res => {
          if (res.data.code == 0) {
            this.original = res.data.object;
          } else {
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //修改元件介绍弹出框显示
    introductionRevisionButton() {
      this.modifyIntroduceVisible = true;
      this.introductionComponentsInput = this.elementObj.introduction;
    },
    //修改元件介绍方法
    modifyComponentIntroduction() {
      this.modifyIntroduceVisible = false;
      modify_component_introduction({
        componentId: this.elementObj.id,
        introduction: this.introductionComponentsInput
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message("修改成功！");
            this.get_component_by_id(this.elementObj.id);
          } else {
            this.$message("修改失败！");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //修改元件参数弹出框显示
    modifyParametersButton() {
      this.modifyParametersVisible = true;
      this.modifyParametersInput = this.elementObj.parameter;
      this.modifyParametersInput = this.elementObj.parameter.replace(
        /<br \/>/g,
        " "
      );
    },
    //修改元件参数方法
    modifyComponentParameter() {
      this.modifyParametersVisible = false; //点击确定修改元件参数 取消模态框
      modify_component_parameter({
        componentId: this.elementObj.id,
        parameter: this.modifyParametersInput
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message("修改成功！");
            this.get_component_by_id(this.elementObj.id);
          } else {
            this.$message("修改失败！");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //菜单展开时调用
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    //菜单关闭时调用
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    on_click_hide_unity_window() {
      var cmd = "{'opcode':3}";

      wfapp.start(cmd);
    }
  },
  created() {
    this.getGroupAndComponent(); //获取元件组和元件
    //判断学生/老师，隐藏/显示菜单操作按钮
    let role = JSON.parse(sessionStorage.getItem("user")).role;
    if (role == "student") {
      this.teacherStudentShow = false;
    } else {
      this.teacherStudentShow = true;
    }
  },
  mounted() {},
  destroyed() {
    console.log("元件库关闭3D");
    this.on_click_hide_unity_window();
  }
};
</script>

<style lang="less" scoped>
.introductionComponents-t {
  font-size: 20px;
  font-family: "微软雅黑";
  font-weight: 700;
  padding-left: 15px;
}
.search {
  position: relative;

  img {
    height: 22px;
    right: 15px;
    top: 10px;
    position: absolute;
  }
}
.box {
  height: 95%;
  margin-top: -1px;
  .Libraryrow {
    height: 100%;
  }
}
.left {
  border: 1px solid rgb(142, 150, 132);
  height: 100%;
  overflow: hidden;
  .menu {
    height: 100%;
    overflow: auto;
    width: 318px;
    overflow-y: scroll;
    .element {
      border-radius: 5px;
      margin: 0 10%;
    }
  }
}
.right {
  height: 100%;
  margin-left: 10px;

  margin-left: 10px;
  .details {
    height: 100%;
    width: 440px;
    border-right: 1px solid #dddddd;
    .details-t {
      position: relative;
      height: 60%;
      padding: 10px;
      border-bottom: 1px solid #dddddd;
      .modifyIntroduceForm {
        width: 1000px;
        height: 600px;
        left: 0px;
        top: 100px;
      }
      .introduce {
        width: 90%;
        text-indent: 2em;
      }
      .introduceButton-c {
        margin-right: 5px;
        right: 0px;
        position: absolute;
        top: 5px;
      }
    }
    .picture {
      border-bottom: 1px solid #dddd;
      padding-left: 20px;
    }
    .para {
      height: 30%;
      width: 100%;
      position: relative;
      padding-top: 15px;
      .modifyParameterForm {
        width: 1000px;
        height: 600px;
        left: 0px;
        top: 100px;
      }
      .introducetwo {
        padding: 0 20px;
      }

      .parameterButton-c {
        position: absolute;
        top: 5px;
        right: 5px;
      }
    }
  }
}
.enter {
  width: 50%;
  height: 500px;
  img {
    vertical-align: text-top;
  }
}

h4 {
  color: rgba(48, 110, 180, 0.867);
}
</style>

<style>
.elementList .el-menu-item {
  min-height: 170px;
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
.search .el-input__inner{
  border-radius: 0px;
  border-right: none;
  border-top: none;
}

</style>


