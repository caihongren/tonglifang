<template>
  <div class="horizontalSplit" :style="myStyle" @click="click">
    <span>{{flag}}</span>
  </div>
</template>
<script type="text/javascript">

  export default{
    name: 'horizontalSplit',
    components: {
    },
    computed: {
      myStyle(){
        let myTop = document.documentElement.clientHeight-120;
        return {
          height: myTop+'px',
          width: this.param.width + 'px', left: this.param.left + 'px',
        };
      }
    },
    props: {
      param: {
        type: Object,
        required: true
      },
    },
    data(){
      return{
        flag: '<',
      }
    },
    methods: {
      click(){
        let r = 0;
        if(this.param.left > 0){
          r = 1;
          this.flag = '>';
        }else{
          r = 0;
          this.flag = '<';
        }
        this.$emit('change', r);
      }
    },
    mounted: function(){

    }
  }
</script>
<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">


  .horizontalSplit {
    width: 8px;
    border:solid gainsboro 1px;
    position: absolute;
    left: 300px;
    top: 50px;
    float: left;
    cursor: pointer;
    span {
      position: absolute;
      top: 50%;
      margin-left: -4px;
      transform: translateY(-50%);
      font-size: 12px;
    }
  }


</style>
