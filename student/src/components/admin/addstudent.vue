<template>
  <div class="box">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple left">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            
            
          >
            <el-menu-item index="1">
              <span slot="title">
                <h3 @click="inter(1)">教师管理</h3>
              </span>
            </el-menu-item>
            <el-menu-item index="2">
              <span slot="title">
                <h3 @click="inter(2)">学生管理</h3>
              </span>
            </el-menu-item>
            <el-menu-item index="3">
              <span slot="title">
                <h3 @click="inter(3)">班级管理</h3>
              </span>
            </el-menu-item>
            <el-menu-item index="4">
              <span slot="title">
                <h3 @click="inter(4)">课程管理</h3>
              </span>
            </el-menu-item>
          </el-menu>
          <!-- <ul class="ul">
            <li @click="inter(1)">
              <router-link to="/addstudent/teacher">
                <el-button>
                  <h3>教师管理</h3>
                </el-button>
              </router-link>
            </li>
            <li @click="inter(2)">
              <router-link to="/addstudent/student">
                <el-button>
                  <h3>学生管理</h3>
                </el-button>
              </router-link>
            </li>
            <li @click="inter(3)">
              <router-link to="/addstudent/Myclass">
                <el-button>
                  <h3>班级管理</h3>
                </el-button>
              </router-link>
            </li>
            <li @click="inter(4)">
              <router-link to="/addstudent/course">
                <el-button>
                  <h3>课程管理</h3>
                </el-button>
              </router-link>
            </li>
          </ul> -->
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple right">
          <router-view/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    inter(id) {
      let url=["/addstudent/teacher","/addstudent/student","/addstudent/Myclass","/addstudent/course"]
      if(id>0){
        this.$router.push(url[id-1]);
      }
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.box {
  width: 99%;
  margin: 5px 0.5%;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 100%;
}
h3 {
  // color: rgb(43, 40, 40);
  margin: 6px 30px;
  font-size: 21px;
  text-align: center;
}
.left {
  border: 2px solid #ccc;
  margin: 5px;
  height: 500px;
  .ul {
    width: 100%;
    padding: 0;
    li {
      width: 95%;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      //   border: 1px solid black;
      margin: 15px 2.5%;
      text-align: center;
      border-radius: 5px;

      h3 {
        color: rgb(43, 40, 40);
        margin: 6px 30px;
        font-size: 21px;
        text-align: center;
      }
    }
  }
}
.right {
  min-height: 750px;
}
</style>
