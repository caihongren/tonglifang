<template>
  <div class="toolbar">
    <div class="toolLeft">
      <v-button type="ghost" icon="save" class="iconButton">保存</v-button>
      <div class="split"></div>
      <v-button type="ghost" icon="plus-circle-o" class="iconButton" @click="zoomClick(1)">放大</v-button>
      <v-button type="ghost" icon="minus-circle-o" class="iconButton" @click="zoomClick(0)">缩小</v-button>
      <div class="split"></div>
      <!--<v-button type="ghost" icon="minus-circle-o" class="iconButton" @click="">左对齐</v-button>-->
      <!--<v-button type="ghost" icon="minus-circle-o" class="iconButton" @click="">居中</v-button>-->
      <v-button type="ghost" icon="api" class="iconButton" @click="exportClick">导出</v-button>
      <v-button type="ghost" icon="setting" class="iconButton" @click="settingClick">设置</v-button>
      <v-button type="ghost" icon="setting" class="iconButton" @click="importFile">导入</v-button>
      <v-button type="ghost" icon="setting" class="iconButton" @click="importFilexml">导出xml文件</v-button>
      <input @change="readFile" ref="importInput" class="hide" type="file" />
    </div>
    <!--<div class="fileName">-->
    <!--未命名-->
    <!--</div>-->
    <div class="toolRight">
      <v-button type="success" size="large">链接虚拟场景</v-button>
      <v-button type="ghost" icon="appstore-o" class="iconButton" @click="showProperty"></v-button>
    </div>
  </div>
</template>
<script type="text/javascript">
import FileSaver from "file-saver";
import { mapState, mapMutations } from "vuex";
import {download} from '../../API/api'
export default {
  name: "toolbar",
  components: {},
  created: function() {},
  mounted: function() {},
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      activeProperty: ["1"]
    };
  },
  methods: {
    ...mapMutations(["setAction"]),

    showProperty() {
      this.$emit("showProperty");
    },
    settingClick() {
      download({
    name: "你好.docx",
    url: "http://192.168.2.223:8080/course/static/icon/123.docx",
      }).then(res=>{
         const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, "你好.docx");
      })
    },
    zoomClick(v) {
      this.setAction({ name: "zoom", value: v });
    },
    exportClick() {
      this.setAction({ name: "export", value: "XML" });
    },
    readFile(evt) {
      this.setAction({ name: "readFile", value: evt });
    },
      importFilexml(){
 this.setAction({ name: "importFilexml", value:  "XML" });
    },
   
    importFile() {
      // this.readFile()
      this.$refs.importInput.click();
    }
  }
};
</script>
<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
.toolbar {
  height: 40px;
  width: 100%;
  vertical-align: middle;
  font-size: 20px;
  border-bottom: solid gainsboro 1px;
  position: absolute;
  .split {
    float: left;
    width: 1px;
    height: 35px;
    background: #e5e5e5;
    margin-left: 6px;
    margin-right: 6px;
    margin-top: -2px;
  }
  .iconButton {
    border: none;
    padding: 0 10px;
    float: left;
    /deep/ span {
      margin-left: 1px;
    }
  }
  .fileName {
    width: 300px;
    font-size: 14px;
    text-align: left;
    margin-top: 8px;
    margin-left: 20px;
    border-bottom: solid gainsboro 1px;
  }
  .toolLeft {
    display: inline-block;
    float: left;
    margin-left: 20px;
  }
  .toolRight {
    float: right;
  }
}
</style>
