<template>
  <div class="login">
    <div class='lll' id="wxlogin_containerweixing"></div>
  </div>
</template>
<script>
import { wechat_binding } from "../API/api";
export default {
  data() {
    return {};
  },
  components: {},
  mounted() {
    var time = new Date();
    var obj = new WxLogin({
      self_redirect: false,
      id: "wxlogin_containerweixing",
      appid: "wx7822838b8a525873",
      scope: "snsapi_login",
      //  redirect_uri: 'http%3A%2F%2Fsso.icubespace.com%2Fchangping%2F#%2Fweixinglogin',
      redirect_uri: "http://projects.icubespace.com/wutie/?type=binding#/login",
      state: this.DEFAULT_LICENCE_ID
        ? this.DEFAULT_LICENCE_ID
        : "b4b22724034e42539eea7542354cbed2",
      style: "black"
    });
  },

  computed: {},
  methods: {
    // 接受内容
    params() {
      let url = window.location.href;
      url = url.split("#")[0];
      if (url.indexOf("?") == -1) {
        return;
      }
      url = url.split("?")[1];
      url = url.split("&");
      let params = {};
      for (let i = 0; i < url.length; i++) {
        let name = url[i].split("=")[0];
        params[name] = url[i].split("=")[1];
      }
      if (localStorage.getItem("code") == params.code) {
        return;
      } else {
        localStorage.setItem("code", params.code);
        wechat_binding({
          code: params.code
        }).then(res => {
          // 微信登录
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              duration: 3000,
              message: "绑定成功",
              type: "success"
            });
            this.$router.push("/user");
          } else {
            this.$message.error({
              showClose: true,
              message: res.data.msg,
              type: "warning",
              duration: 3000
            });
             this.$router.push("/user");
          }
        });
      }
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        this.params();
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    this.params();
  }
};
</script>
<style lang="less" scoped>
.login{
  height: 100%;
  background: url(./../image/weixing.jpg);
}
.lll{
  padding-top: 100px;
  text-align: center;
}
</style>
