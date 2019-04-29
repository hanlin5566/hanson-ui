<template>
  <div class="main_container">
    <div class="filter-container">
      <div class="input">
        <!--输入框-->
        <el-input  v-model="listQuery.thirdRecordId" size="small" clearable placeholder="第三方ID" @keyup.enter.native="search"></el-input>
        <el-input  v-model="listQuery.company" size="small"  clearable placeholder="开发商" @keyup.enter.native="search"></el-input>
        <!--下拉列表-->
        <!--<el-autocomplete placeholder="所在区" v-model="selectShow" size="mini" :fetch-suggestions="queryDict" @select="handlerSelect" @keyup.enter.native="search"></el-autocomplete>-->
        <el-select v-model="listQuery.district" size="small" clearable placeholder="市区">
          <el-option
            v-for="item in selectArray"
            :key="item.name"
            :label="item.text"
            :value="item.name">
          </el-option>
        </el-select>
        <!--日期选择-->
        <el-date-picker
          size="small"
          v-model="listQuery.salesDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="search">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="default" size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="list_container">
      <el-table v-loading="loading" :data="tableData" element-loading-text="加载中.." stripe border highlight-current-rowstripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="楼盘 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="品牌方">
                <span>{{ props.row.companyFriendly }}</span>
              </el-form-item>
              <el-form-item label="楼盘地址">
                <span>{{ props.row.programLocaltion }}</span>
              </el-form-item>
              <el-form-item label="楼盘描述">
                <span>{{ props.row.programDescription }}</span>
              </el-form-item>
              <el-form-item label="建筑栋数">
                <span>{{ props.row.buildCount }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ props.row.updateTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="thirdRecordId"label="第三方ID" sortable></el-table-column>
        <el-table-column align="center" prop="company" label="开发商"></el-table-column>
        <el-table-column align="center" prop="programNameFriendly" label="名称"></el-table-column>
        <el-table-column align="center" prop="programLocaltion" label="地址"></el-table-column>
        <el-table-column align="center" prop="district" label="区域"></el-table-column>
        <el-table-column align="center" prop="salesDate" label="预售日期"></el-table-column>
        <!--<el-table-column align="center" prop="salesDate" :formatter="dateFormat" label="预售日期"></el-table-column>-->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" circle size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" circle size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :current-page="listQuery.pageNum"
        :page-size="listQuery.limit"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
  import { list, get, save, del, update }  from "@/api/community";
  import { getEnums}  from "@/api/common";
  export default {
    data() {
      return {
        tableData: [],
        dialogVisible: false,
        loading: false,
        totalCount: 0,
        selectArray: [],//下拉列表显示
        listQuery: {
          limit: 10,
          offset: 0,
          thirdRecordId: null,
          company: null,
          salesDate: null,
          district: null
        }
      };
    },
    props: {},
    components: {},
    created() {
      this.getList();
      this.queryDropdown();
    },
    methods: {
      getList() {
        this.loading = true;
        list(this.listQuery).then(response =>{
          this.tableData = response.data;
          this.totalCount = response.pageInfo.totalCount;
          this.loading = false;
        });
      },
      search() {
        //查询置为首页开始
        this.listQuery.offset = 0;
        this.getList();
      },
      reset() {
        this.listQuery.offset = 0;
        this.listQuery.thirdRecordId = null;
        this.listQuery.company = null;
        this.listQuery.district = null;
        this.getList();
      },
      handleDelete(row) {
        this.$confirm('是否确认删除此数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(row.id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList()
          })
        }).catch(() => {
         /* this.$message({
            type: 'info',
            message: '已取消删除'
          });*/
        })
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      /*查询下拉列表*/
      queryDropdown(){
        let dictionaries = "district";
        getEnums(dictionaries).then(response => {
          this.selectArray = response.data;
        })
      },
      // dateFormat(row, column, cellValue) {
      //   return cellValue ? fecha.format(new Date(cellValue), 'YYYY-MM-DD') : '';
      // }
      //el-autocomplete方式获取下拉列表字典
      // queryDict(item, callback){
      //   let dictionaries = "district";
      //   getEnums(dictionaries).then(response => {
      //     callback(response.data)
      //   })
      // },
      //处理下拉事件
      // handlerSelect(item){
      //   this.listQuery.district = item.name;
      // }
    }
  };
</script>

<style lang="scss">
  .main_container {
    padding: 32px;
    .filter-container {
      border: 1px solid #f2f2f2;
      padding: 5px 3px;
      & > div {
        display: inline-block;
      }
      .el-input{
        width: 200px;
        height: 28px;;
        margin-right: 10px;
      }
      .search {
        margin-right: 40px;
      }
    }
    .list_container {
      margin-top: 20px;
      & > .el-pagination {
        display: flex;
        justify-content: center;
      }
      .table-expand {
        font-size: 0;
      }
      .table-expand label {
        width: 90px;
        color: #99a9bf;
      }
      .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
      }
    }
    .popup {
      .el-dialog__footer {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .container {
        & > div {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          .el-input {
            width: auto;
            display: inline-block;
            &:nth-child(2) {
              margin-top: 20px;
            }
            .el-input__inner {
              width: auto;
            }
          }
          p {
            width: 185px;
            padding: 10px 15px;
            margin: 0;
            border: 1px solid #f2f2f2;
          }
        }
      }
    }
  }
</style>
