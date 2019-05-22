<template>
  <div class="home">
    
    <div class="conter">
      <div class="top">请选择要进入的课程</div>
      <ul>
        <li v-for="(item,index) in curlist" :key="item.index">
          <router-link to="/relay">课程{{index+1}}------{{item.course}}</router-link>
        </li>
       
      </ul>
    </div>
  </div>
</template>

<script>
import {curlist} from "@/API/api.js"
import { log } from 'util';

export default {

  data() {
    return {
      curlist:[

      ]
        // {curlist:"继电保护"},
        // {curlist:"继电"}
    
    }
  },

created(){
  curlist().then(res=>{
    console.log(res.data.object);
    this.curlist=res.data.object
    
  })
}
}
</script>

<style lang="less" scoped>

.home {
  .conter {
    width: 100%;
    .top {
      width: 100%;
      height: 60px;
      line-height: 60px;
      padding-left: 20px;
      background-color: #334157;
      color: #fff;
    }
    ul {
      margin-left: 150px;
      li {
        list-style: none;
        display: inline-block;
        width: 20%;
        height: 100px;
        line-height: 100px;
        color: #fff;
        text-align: center;
        margin: 100px 10% 0 0;
        background-color: #063279;
      }
    }
  }
}
</style>

