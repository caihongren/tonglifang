<template>
  <div>
    <el-container>
      <el-aside width="250px">
        <div class="Choice" >选择实验</div>
       <ul>
          <li  v-for="(item) in itemArr" :key="item.id">
            <!-- <template slot-scope="scope"> -->
             <router-link  :to="'/guidance/sExperiment1/'+item.id">
            <img src="./../../image/nisfunbduhf.png">  
           <span>{{item.name}}</span></router-link>
            <!-- </template>  -->
          </li>
        </ul>
          <!-- <template slot-scope="scope">
             <router-link :to="'/student/studentinfo/'+scope.row.id" >
            查看</router-link>
          </template> -->
      </el-aside>
      <el-container>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {simulist} from '@/API/api'
import { log } from 'util';
export default {
  data() {
    return {
      itemArr:[
        {
          id:'',
          name:""
        }
      ],
      limit: 3,
      offset: 0,
    };
  },
  methods: {
  
  },
  created(){
    simulist({
      offset: this.offset,
      limit: this.limit
    }).then(res=>{
      console.log(res);
      this.itemArr=res.data.object
    })
  }
};
</script>

<style lang="less" scoped>
a {
  color: #f0f0f0;
  font-size: 14px;
}
.el-aside {
  background-color: #232629;
  color: #333;
  text-align: center;
  height: 1200px;
  > ul {
    > li {
      margin: 40px 20% 0 0;
      a{
      > img {
        display: inline-block;
        width: 90%;
        border-radius: 8px;
        background-color: #ccc;
      }
      }
    }
    
    
  }
}
.Choice{
      width: 100%;
      height: 60px;
      line-height: 60px;
      color: #f0f0f0;
      font-size: 18px;
      font-weight: 700;
      text-align: center;
      margin: 10px 0 -10px 0;
    }

body > .el-container {
  margin-bottom: 40px;
}
</style>
