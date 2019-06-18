<template>
  <div class="txt">
    <span>{{txt}}</span>
  </div>
</template>
<script>
import { get_unit_list } from "@/API/api";
export default {
  data() {
    return {

      txt:'',
    };
  },
  methods: {},
  created() {
    get_unit_list({
      courseId: "7c6684b1-b41c-467a-8706-8b5ebb31d3a0"
    })
      .then(res => {
        console.log(res, "ajax成功");
        this.txt=res.data.object.name
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>





