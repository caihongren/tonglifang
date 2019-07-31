<template>
  <div class="box">
    <el-row type="flex" class="row-bg Libraryrow">
      <el-col :span="4" style="width:300px">
        <div class="grid-content bg-purple left">
          <div class="search">
            <el-input v-model="search" placeholder="请输入搜索内容" @keyup.enter.native="nowSearch()"></el-input>
            <img src="./../../image/search .png" @click="nowSearch()" />
          </div>
          <div class="menu elementList">
            <el-menu class="el-menu-vertical-demo" default-active="0">
              <el-menu-item index="0" @click="handleOpen()" @close="handleClose()">
                <span slot="title">全部</span>
              </el-menu-item>

              <el-menu-item v-bind:index="String(index+1)" @click="handleOpen(item)" v-for="(item,index) in original" :key="item.id">
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
            </el-menu>
            <div style="height:200px"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="20" style="overflow: auto;">
        <!-- 卡片化 -->
        <div>
          <h2 style="margin:20px;" v-show="boxlist.length>0?false:true">没有相关元件。。。</h2>
          <ul class="ul">
            <li v-for="(item) in boxlist" :key="item.id" class="li" @click="innerVisible=true,get_component_by_id(item.id)">
              <div style>
                <el-card :body-style="{ padding: '0px' }">
                  <div style="width:70%;height:180px;margin:30px 15%;border:0px solid #ccc">
                    <img :src="item.icon" class="image" />
                  </div>
                  <div style="padding: 5px;heigth:50px;">
                    <p style=" text-align: center">{{item.name}}</p>
                  </div>
                </el-card>
              </div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <el-dialog width="90%" title="元器件详情" top="7vh" :visible.sync="innerVisible" @close="detdialog">
      <div style="height:75vh">
        <div class="grid-content bg-purple-light right" style="display:balck">
          <div class="details">
            <div style=" overflow:auto;height: 100%;">
              <div class="details-t">
                <div class="introductionComponents-t">元件介绍</div>
                <p class="introduce">{{ elementObj.introduction}}</p>
                <el-image :src="elementObj.schematic" class="detailslmg" style="width:80%"></el-image>
                <el-button size="small" class="introduceButton-c" type="primary" round @click="introductionRevisionButton()" v-show="teacherStudentShow">修改</el-button>
                <el-dialog title="修改元件介绍" :visible.sync="modifyIntroduceVisible" class="modifyIntroduceForm" @open="detdialog" @close="on_click_show_unity_window" append-to-body>
                  <el-input type="textarea" :rows="5" v-model="introductionComponentsInput" autocomplete="off"></el-input>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="modifyIntroduceVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyComponentIntroduction()">确 定</el-button>
                  </div>
                </el-dialog>
              </div>
              <div class="para">
                <div class="introductionComponents-t">元件规格</div>
                <table>
                  <tr>
                    <th>厂商</th>
                    <!-- <td>西门子</td> -->
                    <td>{{elementObj.vendor}}</td>
                  </tr>
                  <tr>
                    <th>规格参数</th>
                    <td>{{elementObj.parameter}}</td>
                  </tr>
                </table>
                <!-- <el-button size="small" class="parameterButton-c" type="primary" round @click="modifyParametersButton()" v-show="teacherStudentShow">修改</el-button> 
                <el-dialog title="修改元件参数" :visible.sync="modifyParametersVisible" class="modifyParameterForm" @open="detdialog" @close="on_click_show_unity_window" append-to-body>
                  <el-input type="textarea" :rows="5" v-model="modifyParametersInput" autocomplete="off"></el-input>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="modifyParametersVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyComponentParameter()">确 定</el-button>
                  </div>
                </el-dialog> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
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
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      search: "", //搜索框内容
      original: [{ id: null, name: "", components: "[]" }], //所有元件组和元件
      boxlist: [],
      innerVisible: false,
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
      elementObjTable: [],
      modifyIntroduceVisible: false, //修改元件介绍弹出框是否显示
      formLabelWidth: "120px",
      introductionComponentsInput: "", //修改元件介绍编辑框
      modifyParametersVisible: false, //修改元件参数弹出框是否显示
      modifyParametersInput: "", //修改元件参数编辑框
      teacherStudentShow: false //老师还是学生是否显示编组件
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
    //获取元件组和元件
    getGroupAndComponent() {
      get_group_and_component()
        .then(res => {
          if (res.data.code == 0) {
            this.original = res.data.object;
            this.getGroupAndComponentbox(res.data.object);
            this.element(res.data.object);
            // console.log(res.data.object,'---');
            
          }
        })
        .catch(function (error) {
        });
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
    //点击元件时触发此函数
    get_component_by_id(id) {
      get_component_by_id({
        componentId: id
      })
        .then(res => {
          if (res.data.code == 0) {
            this.elementObj = res.data.object;
            this.elementObj.parameter = res.data.object.parameter.replace(
              /\n/g,
              ""
            );
            this.elementObjTable = [];
            this.elementObjTable.push({ manufacturer: this.elementObj.name, parameter: this.elementObj.parameter, vendor: this.elementObj.vendor });

            // 打开3d
            this.go3D(res.data.object.type);
          } else {
          }
        })
        .catch(function (error) {
        });
    },
    nowSearch() {
      if (this.search != "") {
        search_component({
          name: this.search
        })
          .then(res => {
            if (res.data.code == 0) {
              this.getGroupAndComponentbox(res.data.object);

              // this.original = res.data.object;
            } else {
            }
          })
          .catch(function (error) {
          });
      } else {
        this.$message.error("请输入搜索内容！");
      }
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
            this.$message.error("修改失败！");
          }
        })
        .catch(function (error) {
        });
    },
    //修改元件参数弹出框显示
    // modifyParametersButton() {
    //   this.modifyParametersVisible = true;
    //   this.modifyParametersInput = this.elementObj.parameter;
    //   this.modifyParametersInput = this.elementObj.parameter.replace(
    //     /<br \/>/g,
    //     " "
    //   );
    // },
    //修改元件参数方法
    // modifyComponentParameter() {
    //   this.modifyParametersVisible = false; //点击确定修改元件参数 取消模态框
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
    // 获取元件组件
    get_component_group() {
      get_component_group({}).then(res => {
      });
    },
    //菜单展开时调用
    handleOpen(row) {
      if (row) {
        this.boxlist = row.components;
      } else {
        this.getGroupAndComponentbox(this.original);
      }
    },
    //菜单关闭时调用


    detdialog() {
      this.on_click_hide_unity_window();
    },
    on_click_show_unity_window() {
      let cmd =
        // "{'opcode':4,'LocationX': 300,'LocationY':200, 'SizeX': 808,'SizeY':539}";
        "{'opcode':4,'LocationX': 575,'LocationY':165,'LocationX_Right': 135,'LocationY_Buttom':80,'SizeX': 1210,'SizeY':700}";
      // "{'opcode':4,'LocationX': 755,'LocationY':135,'LocationX_Right': 15,'LocationY_Buttom':10,'SizeX': 1620,'SizeY':760}";
      // "{'opcode':4,'LocationX': 950,'LocationY':150,'LocationX_Right': 10,'LocationY_Buttom':100,}";

    if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
    },

    on_click_hide_unity_window() {
      var cmd = "{'opcode':3}";

      if (typeof wfapp !== "undefined") {
        wfapp.start(cmd);
      }
    }
  },
  created() {
    if (this.elementList.length > 0) {
      this.original = this.elementList;
      this.getGroupAndComponentbox(this.elementList);
      // this.get_component_by_id(this.original[1].components[0].id); //默认获取第一个元件
    } else {
      this.getGroupAndComponent(); //获取元件组和元件
    }
    // this.get_component_group() //元件组名

    //判断学生/老师，隐藏/显示菜单操作按钮
    let role = JSON.parse(sessionStorage.getItem("user")).role;
    if (role == "student") {
      this.teacherStudentShow = false;
    } else {
      this.teacherStudentShow = true;
    }
  },
  mounted() { },
  destroyed() {
    // this.on_click_hide_unity_window();
  }
};
</script>

<style lang="less" scoped>
table {
  border-collapse: collapse;
  margin-top: 20px;
  margin-left: 13px;
  width: 400px;
  height: 115px;
}

th {
  width: 50px;
  height: 40px;
  border: 1px solid rgb(190, 184, 184);
  font-size: 16px;
  text-align: center;
}
td {
  width: 100px;
  height: 40px;
  border: 1px solid rgb(190, 184, 184);
  font-size: 14px;
  text-align: center;
}
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
  height: 97%;
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
    overflow: hidden;

    .details-t {
      position: relative;
      // height: 60%;
      padding: 10px;
      border-bottom: 1px solid #dddddd;
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
      }
      .introduceButton-c {
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
    .para {
      // height: 30%;
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
        top: 10px;
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
.li {
  width: 250px;
  // height: 400px;
  float: left;
  margin: 20px;
  cursor: pointer;
}

.image {
  width: 100%;
  // height: 100%;
  display: block;
}

h4 {
  color: rgba(48, 110, 180, 0.867);
}
</style>

<style>
.elementList .el-menu-item {
  /* min-height: 170px; */
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
</style>


