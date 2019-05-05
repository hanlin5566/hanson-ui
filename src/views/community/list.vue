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
      <!--条件按钮-->
      <div class="search">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="default" size="mini" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
      </div>
    </div>
    <!--工具按钮-->
    <div class="toolbar_container">
      <el-button type="success" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      <el-button type="primary" size="small" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>
    <!--列表-->
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
    <!--新增&修改弹窗-->
    <div class="editor-container">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="formData" :rules="validateForm" :model="formData" label-position="left" label-width="120px" style="width: 400px; margin-left:70px;">
          <el-form-item label="开发商">
            <el-input v-model="formData.company"></el-input>
          </el-form-item>
          <el-form-item label="第三方主键" prop="thirdRecordId">
            <el-input v-model="formData.thirdRecordId"></el-input>
          </el-form-item>
          <el-form-item label="品牌方">
            <el-input v-model="formData.companyFriendly"></el-input>
          </el-form-item>
          <el-form-item label="项目全称">
            <el-input v-model="formData.programName"></el-input>
          </el-form-item>
          <el-form-item label="项目简称">
            <el-input v-model="formData.programNameFriendly"></el-input>
          </el-form-item>
         <el-form-item label="市区">
            <el-select v-model="formData.district" class="filter-item">
              <el-option v-for="item in selectArray" :key="item.code" :label="item.text" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="预售日期" prop="salesDate">
            <el-date-picker v-model="formData.salesDate" type="date" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="项目地址">
            <el-input v-model="formData.programLocaltion" />
          </el-form-item>
          <el-form-item label="建筑栋数" >
            <el-input-number v-model="formData.buildCount" :min="1" :max="999" ></el-input-number>
          </el-form-item>
          <el-form-item label="楼盘描述">
            <el-input v-model="formData.programDescription" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?save():update()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { list, get, save, del, update }  from "@/api/community";
  import { getEnums}  from "@/api/common";
  export default {
    data() {
      return {
        /*列表数据*/
        tableData: [],
        dialogVisible: false,
        loading: false,
        totalCount: 0,
        selectArray: [],//下拉列表显示
        /*查询参数*/
        listQuery: {
          limit: 10,
          offset: 0,
          thirdRecordId: null,
          company: null,
          salesDate: null,
          district: null
        },

        /*弹窗form相关*/
        formData: {
          id: undefined,
          thirdRecordId: undefined,
          company: '',
          companyFriendly: '',
          programName: '',
          programNameFriendly: '',
          programLocaltion: '',
          programDescription: '',
          district: '',
          buildCount: 0,
          salesDate: '',
          remark: ''
        },
        dialogStatus: '',//弹窗状态
        dialogFormVisible: false,//弹窗是否隐藏
        /*新增或修改显示的文字*/
        textMap: {
          update: '修改',
          create: '新增'
        },
        /*表单验证 在item上添加相应的prop="下面json中的name规则"*/
        validateForm: {
          salesDate: [{ type: 'date', required: true, message: 'salesDate is required', trigger: 'change' }],
          thirdRecordId: [{required: true,message: '请输入第三方ID',trigger: 'blur'},{pattern:/^[0-9]*$/, message: '第三方ID只能为数字'}],
        },
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
      save() {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            save(this.formData).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            })
          }
        });
      },
      update() {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            update(this.formData).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            })
          }
        });
      },
      handleDownload() {
        this.$message({
          type: 'error',
          message: '待开发!'
        });
      },
      resetSearch() {
        this.listQuery.offset = 0;
        this.listQuery.thirdRecordId = null;
        this.listQuery.company = null;
        this.listQuery.district = null;
        this.getList();
      },
      /*清空formdata数据*/
      resetFormData() {
       this.formData = {
          id: undefined,
          company: '',
          companyFriendly: '',
          programName: '',
          programNameFriendly: '',
          programLocaltion: '',
          programDescription: '',
          district: '',
          buildCount: 0,
          salesDate: '',
          remark: ''
        }
      },
      /*页面按钮事件*/
      handleCreate() {
        this.resetFormData();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.formData = Object.assign({}, row) // copy obj
        this.formData.timestamp = new Date(this.formData.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
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
      margin-top: 10px;
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
    .toolbar_container {
      margin-top: 10px;
    }

    .editor-container{

    }
 }
</style>
