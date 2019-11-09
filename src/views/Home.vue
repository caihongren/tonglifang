<template>
  <div class="home">
    <el-container>
      <el-aside width="250px">
        <p>选择进入课程</p>
      </el-aside>
      <el-main>

        <div class="leftcoures">
           <div style="margin-top:10px;padding-right:150px;">
            <h2 style="text-align: center">公告</h2>

            <el-input type="textarea" :disabled="true" :autosize="{ minRows: 2}" v-model="notice" autocomplete="off"></el-input>
          </div>
          <div class="container" v-for="(item,index) in curlist" :key="item.index" @click="goClass(index)">

            <div class="btn btn-1">
              <svg>
                <rect x="0" y="0" fill="none" width="100%" height="100%" />
              </svg>
              {{item.course}}
            </div>

          </div>
          <!-- <div class="mini" v-for="(item,index) in curlist" :key="item.index" @click="goClass(index)">
            <p class="bcourse" style="font-size:18px;">{{item.course}}</p>
          </div> -->
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
      curlist: [],
      notice:'这是公告。。。。。 -2019-10-1 这是公告。。。。。 -2019-10-1这是公告。。。。。 -2019-10-1'
    };
  },
  methods: {
    ...mapActions(["element", "task", "course"]),
    goClass(index) {
      let user = JSON.parse(sessionStorage.getItem("user"));
      console.log(user, '555', index)
      let course = this.curlist[index];
      sessionStorage.setItem("course", JSON.stringify(course));
      if (user.role == "teacher") {
        this.$router.push("/relayteacher/study/courseIntroduction");
      } else if (user.role == "student") {
        this.$router.push("/relay/study/courseIntroduction");
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
      for (let i = 0; i < res.data.object.length; i++) {
        res.data.object[i].module = [];
        res.data.object[i].componentGroup = [];

      }
      this.curlist = res.data.object;

      // this.gofirst();
    });
  }
};
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  width: 101%;
  .el-container {
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
  .leftcoures {
    background-color: #fff;
    width: 98%;
    height: 100%;
    padding-left: 120px;
    overflow: auto;
    margin-right: 9px;
    .mini {
      cursor: pointer;
      display: inline-block;
      width: 250px;
      height: 80px;
      margin: 80px 35px;
      line-height: 80px;
      :hover {
        transform: scale(1.2);
        border: 1px solid #797777;
        border-radius: 0px;
      }
    }
    p {
      transition: all 0.6s;
      width: 255px;
      height: 85px;
      border: 1px solid #f6efef;
      color: rgb(43, 42, 42);
      text-align: center;
      border-radius: 10px;
      background: url(../image/timg.jpg);
    }
  }
}
.container {
  display: flex;
  display: inline-block;
  margin: 85px 35px;
  text-align: center;
}
.btn {
  color: rgb(49, 43, 43);
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  line-height: 105px;
 
  margin: 0 0 2em;
  max-width: 220px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  width: 100%;
}
.btn-1 {
  background: url(../image/timg.jpg);
  /* background: rgb(14, 13, 13); */
  font-weight: 500;
}

.btn-1 svg {
  height: 105px;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.btn-1 rect {
  fill: none;
  stroke: rgb(14, 13, 13);
  stroke-width: 2;
  stroke-dasharray: 422, 0;
  transition: all 0.35s linear;
}

.btn-1:hover {
  background: rgba(225, 51, 45, 0);
  font-weight: 900;
  letter-spacing: 1px;
}

.btn-1:hover rect {
  stroke-width: 5;
  stroke-dasharray: 15, 300;
  stroke-dashoffset: 48;
  transition: all 1.35s cubic-bezier(0.19, 1, 0.22, 1);
}
@media (min-width: 1200px) {
  .container {
    width: 259px;
  }
}
</style>

