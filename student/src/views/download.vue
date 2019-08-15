<template>
  <div class="login">
    <div class="top">
      <div class="downloadlogo">
        <img src="../image/downloadlogo.png" alt />
      </div>
      <div class="logo">
        <h1>建筑智能化虚拟仿真实训软件</h1>
      </div>
    </div>

    <div class="button">
      <div class="button1">
        <a href="http://api.icubespace.com/chongqing/用户使用手册.pdf" download="用户使用手册.pdf">
          <el-link target="_blank" :underline="false" class="buttonCont1">用户使用手册</el-link>
          <!-- <img src alt id="img" /> -->
        </a>
      </div>
      <div class="button2">
        <a href="http://api.icubespace.com/chongqing/PLC仿真软件.zip" download="PLC仿真软件.zip">
          <el-link :underline="false" class="buttonCont2">PLC仿真软件下载</el-link>
        </a>
      </div>
      <div class="button3">
        <a href="http://api.icubespace.com/chongqing/建筑智能化虚拟仿真实训软件.exe" download="建筑智能化虚拟仿真实训软件.exe">
          <el-link :underline="false" class="buttonCont3">实训软件下载</el-link>
        </a>
      </div>
      <div class="loginimTion">
        <p class="briefIntroduction">简介：</p>
        <p class="content">虚拟仿真实训软件是以3D技术为依托，以实训任务为中心，结合行业规范、贯穿教学重点难点，实现施工场景仿真模拟演示，集人机交互式操作的综合性仿真应用。</p>
      </div>
      <div class="imgone">
        <img src="../image/one.png" alt class="one" />
      </div>
      <div class="imgtwo">
        <img src="../image/two.png" alt class="two" />
      </div>
      <div class="imgthree">
        <img src="../image/three.png" alt class="three" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "../static/mxgraph/PLC仿真软件.zip"
    };
  },
  methods: {},
  created() {}
};
</script>

<style lang="less" scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  position: relative;
  top: -60px;
  .top {
    background-color: #82c0e4;
    height: 110px;
    padding-top: 10px;

    .downloadlogo {
      padding-left: 50px;
      padding-top: 40px;
      padding-bottom: 20px;
      display: inline;
    }
    .logo {
      margin-top: -70px;
      text-align: right;
      font-size: 20px;
      font-style: italic;
      margin-right: 200px;
      text-shadow: 4px 6px 5px rgb(2, 33, 43);
      h1 {
        color: #eaecf1;
      }
    }
  }
  .button {
    background: url(./../image/login_02.png);
    height: 100%;
    width: 100%;
    position: relative;
    background-size: 100% 100%;
    .button1 {
      position: absolute;
      top: 40px;
      right: 100px;
      .buttonCont1 {
        border-radius: 18px;
        color: #fff;
        box-shadow: 0px 5px 3px #edebf3;
        width: 200px;
        height: 60px;
        background: rgba(0, 120, 215, 0.8);
        border: none;
        padding: 0 20px;
        font-size: 22px;
        :hover {
          color: #190bdb;
        }
      }
    }
    .button2 {
      position: absolute;
      top: 40px;
      right: 330px;
      a:link {
        text-decoration: none;
      }
        a:active {
        text-decoration: none;
      }
        a:hover {
        text-decoration: none;
      }
        a:visited {
        text-decoration: none;
      }
        .buttonCont2 {
        border-radius: 18px;
        color: #fff;
        box-shadow: 0px 5px 3px #edebf3;
        width: 230px;
        height: 60px;
        background: rgba(0, 120, 215, 0.8);
        border: none;
        padding: 0 20px;
        font-size: 22px;
        :hover {
          color: #190bdb;
        }
      }
    }
    .button3 {
      position: absolute;
      top: 40px;
      right: 590px;
      a:link {
        text-decoration: none;
      }
        a:active {
        text-decoration: none;
      }
        a:hover {
        text-decoration: none;
      }
        a:visited {
        text-decoration: none;
      }
      .buttonCont3 {
        border-radius: 18px;
        color: #fff;
        box-shadow: 0px 5px 3px #edebf3;
        width: 200px;
        height: 60px;
        background: rgba(0, 120, 215, 0.8);
        border: none;
        padding: 0 20px;
        font-size: 22px;
        :hover {
          color: #190bdb;
        }
      }
    }
  }

  .loginimTion {
    padding-top: 120px;
    padding-left: 1120px;
    padding-right: 20px;
  }
  .briefIntroduction {
    padding-top: 20px;
    font-size: 26px;
    color: white;
    font-weight: 1000;
    font-style: italic;
    text-shadow: 2px 3px 1px rgb(14, 101, 182);
  }
  .content {
    font-size: 18px;
    color: rgb(236, 241, 245);
    font-weight: 1000;
    letter-spacing: 10px;
    text-indent: 3em;
    font-style: italic;
    text-shadow: 2px 3px 1px rgb(14, 101, 182);
  }

  .imgone {
    position: absolute;
    top: 230px;
    right: 500px;
    :hover {
      transform: scale(1.2);
    }
    .one {
      width: 300px;
      height: 200px;
      margin-top: 100px;
      box-shadow: 17px 7px #1370bb;
      transition: all 0.6s;
    }
  }
  .imgthree {
    position: absolute;
    top: 280px;
    right: 50px;

    :hover {
      transform: scale(1.2);
    }
    .three {
      width: 300px;
      height: 200px;
      margin-top: 100px;
      box-shadow: 15px 10px #1370bb;
      transition: all 0.6s;
    }
  }
  .imgtwo {
    position: absolute;
    top: 360px;
    right: 260px;

    :hover {
      transform: scale(1.2);
    }
    .two {
      width: 440px;
      height: 290px;
      margin-top: 100px;
      box-shadow: 15px 10px #1370bb;
      transition: all 0.6s;
    }
  }
}
</style>
<style >
</style>
