<template>
  <div class="box">
    <h2>我的笔记</h2>
  </div>
</template>
 
<script>
import {
  getTeacherList,
  addTeacher,
  modifyTeacher,
  deletedaTeacher
} from "../../API/api";
export default {
  data() {
    return {
      offset: 0,
      limit: 10,
      currentPage4: 1,
      length: 40,
      tableData: [
       
      ],
      rules: {
        name: [{ required: true, message: "请输入教师名称", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "长度为11 个字符的电话号码",
            trigger: "blur"
          }
        ]
      },
      dialogFormVisible: false,
      dialogFormVisibleadd: false,
      formadd: {
        name: "",
        gender: "男",
        age: "",
        phone: "",
        email: ""
      },

      form: {
        id: "",
        name: "",
        gender: "男",
        age: "",
        phone: "",
        email: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getTeacherListNew();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.offset = (val-1) * this.limit;
      this.getTeacherListNew();
    },
    interface(id) {
      console.log(id);
    },
    handleClick(row) {},
    // addteacher
    addteacher() {
      let mReg = /^1(3|5|7|8)\d{9}$/;
      let pReg = /^\w{6,12}$/;
      if (this.formadd.name != "" && mReg.test(this.formadd.phone)) {
        this.dialogFormVisibleadd = false;
        console.log(this.formadd);
        this.formadd.age = Number(this.formadd.age);
        addTeacher(this.formadd)
          .then(res => {
            console.log();
            this.getTeacherListNew();
          })
          .catch(() => {
            this.$message.error({
              message: "手机号码重复或者错误",
              type: "warning"
            });
          });
      } else {
        this.$message.error({
          message: "名称或电话号码错误",
          type: "warning"
        });
      }
    },
    // 编辑
    compileClick(row) {
      // console.log(row);
      let froms = {
        id: row.id,
        name: row.name,
        gender: row.gender,
        age: row.age,
        phone: row.phone,
        email: row.email
      };
      // console.log(this.from);
      this.form = froms;
      this.dialogFormVisible = true;
    },
    modifyTeacher() {
      let mReg = /^1(3|5|7|8)\d{9}$/;
      let pReg = /^\w{6,12}$/;
      if (this.form.name != "" && mReg.test(this.form.phone)) {
        this.dialogFormVisible = false;

        this.form.age = Number(this.form.age);
        console.log(this.form);
        modifyTeacher(this.form)
          .then(res => {
            console.log();
            this.getTeacherListNew();
          })
          .catch(() => {
            this.$message.error({
              message: "手机号码重复或者错误",
              type: "warning"
            });
          });
      } else {
        this.$message.error({
          message: "名称或电话号码错误",
          type: "warning"
        });
      }
    },
    // 删除
    det(id) {
      this.$confirm("此操作将永久删除该老师, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletedaTeacher({
            id: id
          }).then(res => {
            console.log(res);
            this.getTeacherListNew();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 加载老师列表
    getTeacherListNew() {
      getTeacherList({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        console.log(res);
        this.tableData = res.data.object;
        this.length = res.data.length;
      });
    }
  },
  mounted() {},
  created() {
    // this.getTeacherListNew();
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 90%;
  margin: 5px 5%;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 800px;
  overflow: auto
}
.add {
  margin: 10px;
  padding: 10px;
}
h2 {
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
      border: 1px solid black;
      margin: 2.5%;
      text-align: center;
      border-radius: 5px;
      h3 {
        margin: 0;
      }
    }
  }
}
</style>
