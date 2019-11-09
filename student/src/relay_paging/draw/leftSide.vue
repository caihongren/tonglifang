<template>
  <div class="leftSide" :style="myStyle">
    <div class="searchBar">
      <v-input style="margin-left: 20px">
        <span slot="after"><v-icon type="search" /></span>
      </v-input>
    </div>
  
   <!-- <img :src="img(srcpath)" alt=""> -->
    <div class="nodeList" >
      <v-collapse @change="onNodeChange" v-model="nodeIndex" :bordered="false">

        <v-panel :header="bm.title" :index="bm.index" v-for="(bm, bmIndex) in bom" v-bind:key=bmIndex>
          <v-row>
            <v-col span="6" v-for="(item, index) in bm.objList" v-bind:key=index>
              <img :id="item.id" class="bom-img draw-component" :src="img(item.imgSrc)" />
            </v-col>
          </v-row>

        </v-panel>

      </v-collapse>
    </div>
  </div>
</template>
<script type="text/javascript">

  import bomJson from './bom.json'
  import mxgraph from './graph/index';
  import { genGraph, destroyGraph, Graph } from './graph/Graph';

  const {
    mxGraph,
    mxOutline,
    mxEvent,
    mxCell,
    mxGeometry,
    mxUtils,
    mxEventObject,
    mxConnectionHandler,
  } = mxgraph;

  export default{
    name: 'leftSide',
    data(){
      return{
        nodeIndex: ['0'],
        bom: [],
         srcpath:'../../static/images/bom/../../../public/img/icons/android-chrome-192x192.png',
           a:'dwadadw'
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
      myStyle(){
        let myTop = document.documentElement.clientHeight-120;
        return {
          height: myTop+'px',
          width: this.param.width + 'px', left: this.param.left + 'px',
        };
      }
    },
    created: function(){

    },
    mounted: function(){

      let index = 0;
      let allComponents = [];
      for (let bj in bomJson){
        let bjObj = bomJson[bj];
        let list = bjObj.list;
        let objList = [];
        for(let i=0; i<list.length; i++){
          let d = list[i];
          let p = {id: d.id, type: d.id, name: d.name, index: index, source: 'leftSide', imgSrc: "../../../static/images/bom/"+bjObj.path + d.fileName,
            size: d.size, childrens: d.childrens, directionPoints: d.directionPoints};
          objList.push(p);
          allComponents.push(p);
          index ++;
        }
        this.bom.push({title: bjObj.name, index: bj, objList: objList})
        this.nodeIndex.push(bjObj.index);

      }
      this.$emit('mounted', allComponents);
    },
    
    methods: {
      onNodeChange(index, status) {
        console.log(`第${index}个面板发生变化，目前状态: ${status}`);
      },
      componentActive(o){

      },
      // 处理图片
      img(src){
        let SRC=src.split("../../static/images/bom/")[1]
        let path=require("../../static/images/bom/"+SRC)
     
         return path
      }

    },
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">


  .leftSide {

    position: absolute;
    left: 0px;
    top: 50px;

    height: 100%;
    overflow-y: auto;

    .searchBar {
      width: 90%;
      margin-top: 10px;

    }

    .bom-img {
      max-height: 46px;
      max-width: 46px;
    }
    .nodeList {
      margin-top: 20px;
      text-align: left;
    }
  }


</style>
