<template>
  <div class="propertyBox" :style="myStyle">
    <v-row v-show="param.width > 0">
      <div class="topBar">
        <div class="title">
          {{bomObj.name==null?"未选中元件属性":(bomObj.name+'属性')}}
        </div>
        <div class="closeButton">
          <v-button type="ghost" icon="close" class="iconButton" @click="hideProperty"></v-button>
        </div>
      </div>
    </v-row>
    <v-row v-show="param.width > 0">

      <v-collapse @change="onChange" :active-index="activeProperty" :bordered="false" class="propertyNodeList">
        <v-panel header="通用" index="1">
          <v-form direction="horizontal" class="propertyForm">
            <v-form-item v-if="bomObj.id" label="ID"  :label-col="labelCol" :wrapper-col="wrapperCol" class="propertyItem">
              <v-input placeholder="请输入名称" v-model="bomObj.id" size="normal"></v-input>
            </v-form-item>
            <v-form-item v-if="bomObj.name" label="名称"  :label-col="labelCol" :wrapper-col="wrapperCol" class="propertyItem">
              <v-input placeholder="请输入名称" v-model="bomObj.name" size="normal"></v-input>
            </v-form-item>
          </v-form>
        </v-panel>
        <v-panel header="特殊" index="2">

        </v-panel>

      </v-collapse>
    </v-row>
  </div>
</template>
<script type="text/javascript">

  import {mapState, mapMutations} from 'vuex'
  export default{
    name: 'propertyBox',
     data(){
      return{
        labelCol: {span: 6}, wrapperCol: {span: 14 },
        activeProperty: ['1'],
        bomObj: {id: null,  type: null, name: null,},

      }
    },
    components: {

    },
    props: {

      param: {
        type: Object,
        required: true
      },
    },
    computed: {
      ...mapState(['action']),
      myStyle(){
        return {
          height: (document.documentElement.clientHeight-120)+'px',
          width: this.param.width + 'px', left: this.param.left + 'px',
        };
      }
    },
    watch: {
      action: {
        deep: true,
        handler(n, old){
          if(n ){
            let actionName = n.name;
            if(actionName == 'componentSelect'){
              this.showItem(n.value);
            }
          }
        }
      },
    },
    created: function(){

    },
    mounted: function(){

    },
   
    methods: {
      onChange(index, status) {
        console.log(`第${index}个面板发生变化，目前状态: ${status}`);
      },
      hideProperty(){
        this.$emit('hideProperty');
      },
      showItem(o){
        if(o){
          this.bomObj.id = o.id;
          this.bomObj.type = o.type;
          this.bomObj.name = o.name;
        }
      },
    },
  }
</script>
<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">


  .propertyBox {
    border:solid gainsboro 1px;
    position: absolute;
    top: 50px;
    .topBar{
      border-bottom:solid gainsboro 1px;
      .title {
        font-size: 14px;
        font-weight: bold;
        margin-top: 4px;
        text-align: center;
        display: inline-block;
      }
      .closeButton {
        flex: 1;
        display: inline-block;
        float: right;
        button {
          border: none;
        }
      }
    }
    .propertyNodeList {
      text-align: left;
    }
    .propertyForm {

    }
    .propertyItem {
      margin-bottom: 1px;
    }
  }


</style>
