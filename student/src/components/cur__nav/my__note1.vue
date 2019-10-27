<template>
  <div class="box">
    <div>
      <div class="add">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid-content bg-purple" style="padding:15px 30px">
              <!-- <el-button type="primary" @click="dialogFormVisibleadd = true" >新增教师</el-button> -->
            </div>
          </el-col>
          <el-col :span="14">
            <div class="grid-content bg-purple">
              <h2>我的笔记</h2>
            </div>
          </el-col>
        </el-row>
      </div>
      <template>
        <el-table :data="tableData" border style="width: 90%;margin:5px 3%">
          <el-table-column fixed type="index" label="序号" :index="indexMethod" min-width="100"></el-table-column>
          <el-table-column fixed prop="name" label="笔记名称" min-width="200"></el-table-column>
          <el-table-column prop="gender" label="修改时间" min-width="120"></el-table-column>
          <el-table-column prop="age" label="笔记信息" min-width="120"></el-table-column>
          <el-table-column prop="phone" label="批阅情况" min-width="200"></el-table-column>
          <el-table-column prop="email" label="任务信息" min-width="400"></el-table-column>

          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button @click="compileClick(scope.row)" type="primary" size="small">编辑</el-button>
              <el-button type="primary" @click="det(scope.row.id)" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div style="margin:50px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length"></el-pagination>
      </div>
      <!-- 新增加 -->
      <el-dialog title="新增教师" :visible.sync="dialogFormVisibleadd">
        <el-form :model="formadd" :rules="rules">
          <el-form-item label="教师名称：" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formadd.name" auto-complete="off" focus="true" placeholder="请输入名称（必填）"></el-input>
          </el-form-item>
          <el-form-item label="性别：" :label-width="formLabelWidth">
            <el-select v-model="formadd.gender" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄：" :label-width="formLabelWidth">
            <el-input v-model="formadd.age" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话：" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="formadd.phone" auto-complete="off" maxlength="11" placeholder="请输入电话号码（必填）"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" :label-width="formLabelWidth">
            <el-input v-model="formadd.email" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
          <el-button type="primary" @click="addteacher">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog title="编辑教师" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules">
          <el-form-item label="教师名称*：" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入名称（必填）"></el-input>
          </el-form-item>
          <el-form-item label="性别：" :label-width="formLabelWidth">
            <el-select v-model="form.gender" placeholder="请选择性别">
              <el-option label="男" value="man"></el-option>
              <el-option label="女" value="woman"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄：" :label-width="formLabelWidth">
            <el-input v-model="form.age" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话*：" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="form.phone" auto-complete="off" placeholder="请输入电话号码（必填）"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" :label-width="formLabelWidth">
            <el-input v-model="form.email" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyTeacher">确 定</el-button>
        </div>
      </el-dialog>
    </div>
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
      this.limit = val;
      this.getTeacherListNew();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.getTeacherListNew();
    },
    interface(id) {
    },
    handleClick(row) { },
    // addteacher
    addteacher() {
      let mReg = /^1(3|5|7|8)\d{9}$/;
      let pReg = /^\w{6,12}$/;
      if (this.formadd.name != "" && mReg.test(this.formadd.phone)) {
        this.dialogFormVisibleadd = false;
        this.formadd.age = Number(this.formadd.age);
        addTeacher(this.formadd)
          .then(res => {
            this.getTeacherListNew();
          })
          .catch(() => {
            this.$message.error({
              showClose: true,
              duration: 1000,
              message: "手机号码重复或者错误",
              type: "warning"
            });
          });
      } else {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "名称或电话号码错误",
          type: "warning"
        });
      }
    },
    // 编辑
    compileClick(row) {
      let froms = {
        id: row.id,
        name: row.name,
        gender: row.gender,
        age: row.age,
        phone: row.phone,
        email: row.email
      };
      this.form = froms;
      this.dialogFormVisible = true;
    },
    modifyTeacher() {
      let mReg = /^1(3|5|7|8)\d{9}$/;
      let pReg = /^\w{6,12}$/;
      if (this.form.name != "" && mReg.test(this.form.phone)) {
        this.dialogFormVisible = false;

        this.form.age = Number(this.form.age);
        modifyTeacher(this.form)
          .then(res => {
            this.getTeacherListNew();
          })
          .catch(() => {
            this.$message.error({
              showClose: true,
              duration: 1000,
              message: "手机号码重复或者错误",
              type: "warning"
            });
          });
      } else {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: "名称或电话号码错误",
          type: "warning"
        });
      }
    },
    // 删除
    det(id) {
      this.$confirm("此操作将永久删除该教师, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletedaTeacher({
            id: id
          }).then(res => {
            this.getTeacherListNew();
            this.$message({
              showClose: true,
              duration: 1000,
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            duration: 1000,
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 加载教师列表
    getTeacherListNew() {
      getTeacherList({
        offset: this.offset,
        limit: this.limit
      }).then(res => {
        this.tableData = res.data.object;
        this.length = res.data.length;
      });
    }
  },
  mounted() { },
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
  overflow: auto;
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
