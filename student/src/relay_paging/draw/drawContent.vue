<template>
  <div class="drawContent" ref="drawContent" :style="myStyle" >
    <!-- <div class="layer" ref="designerLayer" :style="layerStyle"></div> @drop.prevent="drop" @dragover.prevent-->
    <div id="canvas" class="layer" ref="layer" :style="layerStyle"   >



    </div>
  
  </div>
</template>
<script type="text/javascript">

  import uuid from 'uuid'
  import bomJson from './bom.json'
  import XEUtils from 'xe-utils'
  import {mapState, mapMutations} from 'vuex'

  export default{
    name: 'drawContent',
    data(){
        return{
          
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
    compments:{

    },
    computed: {
      // ...mapState({
      //   action: state => state.user.action,
      // }),
      myStyle(){
        return {
          right: this.param.right + 'px', top: this.param.top + 'px',
          bottom: this.param.bottom + 'px', left: this.param.left + 'px',
         
          // height: (document.documentElement.clientHeight-100)+'px',
          height:'95%',
          top:'50px'
        };
      },
      layerStyle(){
        return { width: (document.documentElement.clientWidth-50) + 'px'}
      }
    },
    watch: {

    },
    mounted: function(){
      this.isMounted = true;
      this.$refs.drawContent.scrollTo(400, 800);
      // var inner=document.getElementsByClassName('layer')

    },
    data(){
      return{
        jsPlumb: null,
        isMounted: false, isDowm: false,

        selectNode: {},
        property: { anchors: [{ name: '1', left: -2, top: 20 }] }
      }
    },
    methods: {

      hideProperty(){
        this.$emit('hideProperty');
      },


      componentActive(o){
        console.log('componentActive', o)

      },
      componentRotate(o){

      },
      selectComponent(o){ //选中元器件
        this.selectNode = o;
      },
      selectClockwise(o){ //旋转
        if(this.selectNode.id){
          this.$refs[this.selectNode.id][0].clockwise(o);
        }
      },
    },
  }
</script>
<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">


  .drawContent {
    position: absolute;
    overflow: auto;
    display: block;
    outline: none;
    overflow: auto;
    // top:100px;
    .layer{
      left: 831px; top: 696px; height: 1168px;
      border-width: 1px;
      border-color: rgb(255, 255, 255);
      border-style: solid;
      background-color: rgb(255, 255, 255);
      background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=");
      background-position: -1px -1px;
      overflow: hidden;
      position: absolute;
      box-shadow: 0px 0px 2px 1px #e9e9e9;
    }

    #canvas {
      left: 0px;
      top: 0px;
      /*width: 600px;*/
      height: 100%;
      display: block;
      min-width: 2000px;
      min-height: 2561px;
      position: relative;
      /*background-image: none;
      background-position: -9px -24px;*/

      border-width: 1px;
      border-color: rgb(255, 255, 255);
      border-style: solid;
      background-color: rgb(255, 255, 255);
      background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=");
      background-position: -1px -1px;
      box-shadow: 0px 0px 2px 1px #e9e9e9;
    }
    .testMove {
      position: absolute;
      left: 100px;
      top: 100px;
      z-index: 3;
      width: 200px;
      height: 200px;
      border: 1px solid #e6e6e6;
      background-color: #f2f2f2;
      box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.25);
      overflow: auto;
    }
    .test-svg{
      position: absolute;
      left: 100px;
      top: 200px;
      z-index: 3;
    }
  }


</style>
