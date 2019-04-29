<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="padding-bottom: 10px;">
      <el-autocomplete style="width: 200px;" v-model="listQuery.dDealer" :fetch-suggestions="queryDealerAsync" placeholder="经销商名称" @select="handleSelectDealer" @keyup.enter.native="handleFilter"></el-autocomplete>
      <el-input style="width: 140px;" class="filter-item" v-model="listQuery.dDealerCity" placeholder="城市" @keyup.enter.native="handleFilter"></el-input>
      <el-select clearable style="width: 140px" class="filter-item" v-model="listQuery.dealerLevel" placeholder="供应商等级">
        <el-option label="一级供应商" value="level1"></el-option>
        <el-option label="二级供应商" value="level2"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" icon="el-icon-refresh-right" @click="handleFilterRest">重置</el-button>
      <el-button class="filter-item" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
      <el-button class="filter-item" style="float: right;" @click="handleCreate" type="primary" icon="el-icon-edit">新增</el-button>
    </div>

    <el-table ref="multipleTable"  :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="加载中" border fit highlight-current-row style="width: 100%"
              :default-sort = "{ order: 'descending' }"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" sortable label="名称"  prop="ddealer"></el-table-column>
      <el-table-column align="center" sortable label="城市"  prop="ddealerCity"></el-table-column>
      <el-table-column align="center" sortable label="等级">
        <template slot-scope="scope">
          {{
          scope.row.dealerLevel === 'level1' ? '一级经销商' : '' ||
          scope.row.dealerLevel === 'level2' ? '二级经销商' : ''
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" sortable label="邮箱"  prop="ddealerMail"></el-table-column>
      <el-table-column align="center" sortable label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="margin-top: 30px;">
      <el-pagination background @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { list, get, del } from '@/api/building'
  import { getToken } from '@/utils/auth'

  export default {
    data() {
      return {
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        downloadLoading: false,
        listQuery: {
          limit: 10,
          offset: 0,
          dDealer: '',
          dDealerCity: '',
          dealerLevel: null
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        list(this.listQuery).then(response => {
          this.list = response.data;
          this.total = response.pageInfo.totalCount;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleFilterRest() {
        this.listQuery.page = 1
        this.listQuery.size = 20
        this.listQuery.dDealer = ''
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.page = 1
        this.listQuery.size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleCreate() {
        this.$router.push({ path: '/dealer/detail/add' })
      },
      queryDealerAsync(queryString, cb) {
        getAllDealer(queryString).then(response => {
          cb(response)
        })
      },
      handleSelectDealer(item) {
        this.listQuery.ddealer = item.value
        this.handleFilter()
      },
      handleUpdate(row) {
        const id = row.id
        this.$router.push({ path: '/dealer/detail/' + id })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDealer(row.id).then(response => {
            this.$message.success('删除成功!')
            this.getList()
          })
        }).catch(() => {})
      },
      handleDownload() {
        let baseURL = process.env.BASE_API + '/admin/IDealer/exportDealer?X-Token=' + getToken()
        if (this.listQuery.dDealer) baseURL = baseURL + '&dDealer=' + this.listQuery.dDealer
        if (this.listQuery.dDealerCity) baseURL = baseURL + '&dDealerCity=' + this.listQuery.dDealerCity
        if (this.listQuery.dealerLevel) baseURL = baseURL + '&dealerLevel=' + this.listQuery.dealerLevel
        window.open(baseURL)
      }
    }
  }
</script>
