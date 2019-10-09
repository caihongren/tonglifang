<template>
  <div class="home">
    <el-container>
      <el-aside width="250px">
        <p>选择进入课程</p>
      </el-aside>
      <el-main>
             <div class="leftcoures">
          <p v-for="(item,index) in curlist" :key="item.index" @click="goClass(index)" class="bcourse" style="font-size:18px;">{{item.course}}</p>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { curlist } from "@/API/api.js";
import { log } from "util";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      curlist: []
      // {curlist:"继电保护"},
      // {curlist:"继电"}
    };
  },
  methods: {
    ...mapActions(["element", "task", "course"]),
    goClass(index) {
      let user = JSON.parse(sessionStorage.getItem("user"));
      let course = this.curlist[index];
      sessionStorage.setItem("course", JSON.stringify(course));

      if (user.role == "teacher") {
        this.$router.push("/relayteacher/study/courseIntroduction");
      } else if (user.role == "student") {
        this.$router.push("/relay/study");
      } else {
        this.$router.push("/login");
      }
    },
    //默认跳转到第一个
    gofirst() {
      if (this.curlist.length > 0) {
        this.goClass(0);
      }
    }
  },
  mounted() { },
  created() {
    if (sessionStorage.getItem("user") == null) {
      this.$router.push("/login");
    }
    this.element([]);
    this.task([]);
    this.course([]);
    curlist().then(res => {
      this.curlist = res.data.object;
      // this.gofirst();
    });
  }
};
</script>
<style lang="less" scoped>
.home{
  height: 100%;
  width: 101%;
  .el-container{
    height: 100%;
  }
}
.el-aside {

  background-color: #313131;
  p {
    cursor: pointer;
    margin-top: 20px;
    color: #ffd04b;
    font-size: 20px;
    text-align: center;
  }
}
.el-main {
  background-color: #f1f1f1;
  padding-right: 30px;
  .leftcoures {
    background-color: #fff;
    height: 875px;
    padding-left: 120px;
    margin-bottom: 60px;
    overflow: auto;
    margin-right: 9px;
    p {
      cursor: pointer;
      list-style: none;
      display: inline-block;
      width: 250px;
      height: 80px;
      margin: 80px 35px;
      line-height: 80px;
      color: rgb(43, 42, 42);
      text-align: center;
      border-radius: 10px;
      background-color: #f1f1f1;
    }
  }
}
</style>

