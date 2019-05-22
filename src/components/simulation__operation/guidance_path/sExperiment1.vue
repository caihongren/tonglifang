<template>
    <div class="banner">
       <el-container>
      <el-header v-if="herdernone" height="80px">
          <router-link to="/sExperiment1/unity">
            <div>
              <img src="./../../../image/vivo.png" @click="SendExperimentExerciseInstanceEditor()">
            </div>
          </router-link>
         
          <div class="action__bar">
            <ul>
              <li>
                <router-link :to="'/sExperiment1/guidance/'+id">
                  <div class="el-icon-view"></div>
                  <span>实验指导 </span>
                </router-link>
              </li>
              <li>
                <router-link :to="'/sExperiment1/Presentation/'+id">
                  <div class="el-icon-document-copy"></div>
                  <span>实验报告</span>
                </router-link>
              </li>
              <li>
                <router-link :to="'/sExperiment1/Enclosure/'+id">
                  <div class="el-icon-document-copy"></div>
                  <span>附件材料</span>
                </router-link>
              </li>
              <li>
                <router-link :to="'/sExperiment1/snapshot/'+id">
                  <div class="el-icon-document-add"></div>
                  <span>实验快照</span>
                </router-link>
              </li>
              <li>
                <router-link :to="'/sExperiment1/exportData/'+id">
                  <div class="el-icon-position"></div>
                  <span>导出数据</span>
                </router-link>
              </li>
            </ul>
          </div>
        </el-header>
 </el-container>
        <div class="Arrow" @click="Arrow">
          <i class="el-icon-caret-top" v-show="Arrowshow"></i>
          <i class="el-icon-caret-bottom" v-show="!Arrowshow"></i>
        </div>
        <el-main>
         {{id}}
          <router-view/>
        </el-main> 
    </div>
</template>


<script>
import { log } from 'util';
export default {
 data() {
   return {
      id:this.$route.params.id,
      // imgswiper:true,
      Arrowshow: true,
      herdernone: true,
   }
 },
 methods:{
   Arrow() {
      (this.Arrowshow = !this.Arrowshow), (this.herdernone = !this.herdernone);
    },
     },
  watch:{
        '$route.params.id':function(newval,oldval){
           this.id=newval;
        }
    }
  
};
</script>


<style lang="less" scoped>
img{
  margin: 0;
}
.banner{
width: 100%;

.el-header {
  background-color: #313539;
  color: #333;
  a{
  > div {
    width: 60px;
    height: 60px;
    margin: 10px 0 0 10px;
    // background-color: #b3c0d1;
    > img {
      width: 100%;
      height: 100%;
    }
  }
  }
}
 .action__bar {
    width: 50%;
    height: 100%;
    float: right;
    > ul {
      width: 90%;
      margin-left: 31%;
      margin-top: -10px;
      > li {
        width: 15%;
        display: inline-block;
        margin-top: 5px;
        div {
          width: 100%;
          height: 50px;
          font-size: 30px;
          line-height: 50px;
          // text-align: center;
          display: block;
          color: #f0f0f0;
        }
        div:hover{
           color: #ffd04b;
        }
        span {
          width: 100%;
          font-size: 14px;
          text-align: center;
        }
        span:hover{
          color: #ffd04b;
        }
        
      }
      
    }
  }
}

//点击显示隐藏herader盒子
.Arrow {
  width: 100px;
  text-align: center;
  position: absolute;
  top: 47px;
  left: 55%;
  .el-icon-caret-top {
    margin-top: 68px;
    color: #fff;
  }
  i {
    font-size: 30px;
  }
}
.el-main {
  background-color: #f0f0f0;
  color: #333;
  // text-align: center;
  // line-height: 160px;
  display: block;
  margin-top: 20px;
}
body > .el-container {
  margin-bottom: 40px;
}
</style>
