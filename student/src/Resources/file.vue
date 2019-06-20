<template>
  <div>
    {{id}}
    <el-row>
      <el-col :span="24" class="colbg">
        <el-button type="info" size="small" icon="el-icon-upload el-icon--right">上传</el-button>
        <el-button type="info" size="small" icon="el-icon-download">下载</el-button>
        <el-button type="info" size="small" icon="el-icon-delete">删除</el-button>
        <el-button type="info" size="small" icon="el-icon-folder-add">新建文件夹</el-button>
      </el-col>
      <el-col :span="24" class="colbg2">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/Resources/Files/file' }">资源列表</el-breadcrumb-item>
          <el-breadcrumb-item>文件</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="fr">
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
          <el-button type="primary" icon="el-icon-search"></el-button>
        </div>
      </el-col>
      <el-col class="colbg3">
        <ul>
          <li
            v-for="item in itemArr"
            :key="item.resourceName"
            :class="{active : active == item.resourceName}"
            @click="Highlight(item.resourceName)"
          >
            <img src="./../assets/image/file.png" alt>
            <p>{{item.resourceTypeId}}-{{item.resourceName}}</p>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { filelist, typelist } from "@/API/api";
// import axios from "axios"
import { log } from "util";
export default {
  data() {
    return {
      id: this.$route.params.id,
      restaurants: [],
      state: "",
      timeout: null,
      multipleSelection: [],
      itemArr: [
        {
          resourceTypeId: "",
          resourceName: "文件1",
          file: ""
        },
        {
          resourceTypeId: "",
          resourceName: "文件2",
          file: ""
        },
        {
          resourceTypeId: "",
          resourceName: "文件3",
          file: ""
        },
        {
          resourceTypeId: "",
          resourceName: "文件4",
          file: ""
        }
      ],

      active: ""
    };
  },
  methods: {
    loadAll() {
      return [
        { value: "文件一", address: "123456798" },
        { value: "仿真实验说明", address: "987654321" }
      ];
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
    },
    Highlight(resourceName) {

      this.active = resourceName;
    }
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  created() {},

  watch: {
    "$route.params.id": function(newval, oldval) {
      this.id = newval;
    }
  }
};
</script>

<style lang="less" scoped>
.colbg {
  height: 60px;
  background-color: rgb(0, 173, 212);
  .el-button {
    margin: 15px 0 0 4%;
    background-color: rgb(57, 61, 49);
  }
}
.colbg2 {
  padding: 0 10px;
  height: 40px;
  .el-breadcrumb {
    margin-top: 20px;
    font-size: 16px;
  }
  .fr {
    margin: -25px 0 0 0;
    float: right;
  }
}
.colbg3 {
  margin-top: 50px;
  ul {
    li {
      list-style: none;
      display: inline-block;
      width: 10%;
      height: 120px;
      margin-left: 20px;
      margin-top: 20px;
      background-color: #ccc;
      img {
        display: inline-block;
        width: 60%;
        height: 90px;
        margin: 0 20%;
      }
      p {
        width: 100%;
        text-align: center;
      }
    }
  }
}
.active {
  background: #fd7522;
  border: 1px solid #fd7522;
  color: #fff;
}
</style>