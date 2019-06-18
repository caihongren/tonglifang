<template>
  <div class="Presentation">
    <router-link to="/task/DetailedList">
      <el-button type="primary" size="small" icon="el-icon-back" style="margin-top:20px">返回</el-button>
    </router-link>
    <div class="taskname">任务名称</div>
    <el-container>
      <el-container>
        <el-aside class="asidebox" width="20%">
          <el-col :span="24">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-folder"></i>
                  <span>展开文件夹一</span>
                </template>

                <el-submenu index="1-2">
                  <template slot="title">一班</template>
                  <el-menu-item index="1-2-1">学生1</el-menu-item>
                  <el-menu-item index="1-2-2">学生2</el-menu-item>
                  <el-menu-item index="1-2-3">学生3</el-menu-item>
                  <el-menu-item index="1-2-4">学生4</el-menu-item>
                  <el-menu-item index="1-2-5">学生5</el-menu-item>
                </el-submenu>

                <el-submenu index="1-3">
                  <template slot="title">二班</template>
                  <el-menu-item index="1-3-1">学生a</el-menu-item>
                  <el-menu-item index="1-3-2">学生b</el-menu-item>
                  <el-menu-item index="1-3-3">学生c</el-menu-item>
                  <el-menu-item index="1-3-4">学生d</el-menu-item>
                  <el-menu-item index="1-3-5">学生e</el-menu-item>
                </el-submenu>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>
        <!-- main内容部分 -->
        <el-container>
          <el-aside width="200px">
            <div style="margin: 20px;"></div>
            <el-form :label-position="labelPosition" label-width="120px" :model="Presentation">
              <el-form-item label="实验开始时间:">
                <span>{{Presentation.start}}</span>
              </el-form-item>
              <el-form-item label="实验结束时间:">
                <span>{{Presentation.over}}</span>
              </el-form-item>
              <el-form-item label="实验提交时间:">
                <span>{{Presentation.Submission}}</span>
              </el-form-item>
              <div class="Enclosure">附件列表</div>
              <div class="dataList">数据列表</div>
              <div class="unity">
                <button  type="button" @click="intounity">查看实验(进入unity)</button>
              </div>
              <el-input type="textarea" class="Comment" :rows="4" placeholder="评语：" v-model="textarea"></el-input>
              <div><span>得分：</span><input type="text" v-model="Fractions"></div>
              <el-button type="primary" size="mini">批阅完成</el-button>
            </el-form>
          </el-aside>
          <el-main>
            <div class="mainbox">
              <div class="browse">报告浏览</div>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textarea:'',
      Fractions:'90',
      Presentation: {
        start: "05/05/13:10",
        over: "05/05/15:10",
        Submission: "点击提交"
      }
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //点击按钮进入untiy
    intounity(){
      
     },
  }
};
</script>

<style lang="less" scoped>
.Presentation {
  background-color: #fff;
}
.taskname {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #cdc673;
  margin-top: 20px;
}
.asidebox {
  height: 700px;
  border: 1px solid #ccc;
}
// 附件列表
.Enclosure,
.dataList {
  width: 100px;
  height: 100px;
  margin: 0 30%;
  border: 1px solid #ccc;
}
.dataList {
  margin-top: 5px;
}
.unity > button {
  width: 100px;
  height: 100px;
  background-color: skyblue;
  margin-left: 30%;
  margin-top: 5px;
}
.Comment{
  width: 100px;
  margin-left: 30%;
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 35px;
}
.el-form{
  >.el-button{
    margin: 10px 0 0 80px ;
  }
}
.mainbox{
  border: 1px solid #ccc;
  height: 600px;
  >.browse{
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    border-bottom:1px solid #ccc 
  }
}
</style>


