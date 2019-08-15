<template>
  <div class="home">
    <div class="conter">
      <div class="top">请选择要进入的课程</div>
      <ul>
        <li
          v-for="(item,index) in curlist"
          :key="item.index"
          @click="goClass(index)"
          style="font-size:18px;"
        >{{item.course}}</li>
      </ul>
    </div>
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
  mounted() {},
  created() {
    if (sessionStorage.getItem("user") == null) {
      this.$router.push("/login");
    }
    this.element([]);
    this.task([]);
    this.course([]);
    curlist().then(res => {
      this.curlist = res.data.object;
      this.gofirst();
    });
  }
};
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
      background-color: #fff;
      color: #00a0e9;
      font-size: 20px;
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
        background-color: #313131;
      }
    }
  }
}
</style>

