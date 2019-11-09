<template>
  <div style="width:100%;height:100%">
    <div class="box">
      <div class="head">
        <el-input placeholder="请输入行" v-model="input10" clearable class="input"></el-input>
        <i class="el-icon-close"></i>
        <el-input placeholder="请输入列" v-model="input10" clearable class="input"></el-input>
        <el-input placeholder="请输入雷数量" v-model="input10" clearable class="input"></el-input>
        <el-button type="primary" icon="el-icon-caret-right">开始</el-button>
      </div>
      <div class="com">
        <ul class="ul" v-for="(item,index) in list" v-bind:key="index">
          <li
            class="li"
            v-for="(items,indexs) in item"
            v-bind:key="indexs"
          >{{items==9?'炸':items}}</li>
        </ul>
      </div>
      <div class="data"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      line: 10,
      list: 10,
      sum: 10,
      list: [
        [1, 2, 3, 4, 5, 9, , 1, 1, 1, 1],
        [1, 2, 3, 4, 5, 9, , 1, 1, 1, 1],
        [1, 2, 3, 4, 5, 9, , 1, 1, 1, 1],
        [1, 2, 3, 4, 5, 9, , 1, 1, 1, 1],
        [1, 2, 3, 4, 5, 9, , 1, 1, 1, 1],
        [1, 2, 3, 4, 5, 9, , 1, 1, 1, 1],
        [1, 2, 3, 4, 5, 9, , 1, 1, 1, 1],
        [1, 2, 3, 4, 5, 9, , 1, 1, 1, 1],
        [1, 2, 3, 4, 5, 9, , 1, 1, 1, 1],
        [1, 2, 3, 4, 5, 9, , 1, 1, 1, 1],
        [1, 2, 3, 4, 5, 9, , 1, 1, 1, 1]
      ]
    };
  },
  methods:{
      play(){

      },
  },

};
</script>


<style lang="less" scoped>
.box {
  margin: 2% 10%;
  width: 80%;
  height: 85%;
  border: 1px solid black;
}
.input {
  width: 300px;
  margin: 5px 30px;
}
.ul {
  height: 50px;
  .li {
    float: left;
    width: 50px;
    height: 50px;
    border: 1px solid black;
    line-height: 50px;
    text-align: center;
    font-size: 30px;
  }
}
</style>