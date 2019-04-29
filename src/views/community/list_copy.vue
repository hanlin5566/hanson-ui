@<template>
  <div id="main_container">
    <div class="filter-container">
      <div class="input">
        <el-input placeholder="第三方ID" v-model="thirdRecordId" @keyup.enter.native="search"></el-input>
        <el-input placeholder="开发商" v-model="company" @keyup.enter.native="search"></el-input>
      </div>
      <div class="search">
        <el-button size="mini" @click="search">查询</el-button>
        <el-button size="mini" @click="resetTable">重置</el-button>
      </div>
      <div class="add">
        <el-button type="primary" size="mini" @click="addUser">添加坐席</el-button>
      </div>
    </div>
    <div class="userList">
      <el-table v-loading="loading" :data="tableData" element-loading-text="加载中.." border fit highlight-current-rowstripe style="width: 100%">
        <el-table-column align="center" prop="thirdRecordId"label="第三方ID" sortable width="80"></el-table-column>
        <el-table-column align="center" prop="company" label="开发商"></el-table-column>
        <el-table-column align="center" prop="programNameFriendly" label="名称"></el-table-column>
        <el-table-column align="center" prop="programLocaltion" label="地址"></el-table-column>
        <el-table-column align="center" prop="district" label="区域"></el-table-column>
        <el-table-column align="center" prop="salesDate" label="预售日期"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="setPermission(scope.row)" type="text" size="small">设置权限</el-button>
            <el-button @click="resetPwd(scope.row)" type="text" size="small">重置密码</el-button>
            <el-button
              type="text"
              size="small"
              @click="onOff(scope.row.onOff, scope.$index)"
            >{{scope.row.dataStatus === 1 ? '关闭' : '启用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :current-page="paginationData.pageNum"
        :page-size="paginationData.limit"
        :total="totalCount"
      ></el-pagination>
    </div>

    <el-dialog
      class="popup"
      :title="title"
      :before-close="beforeClose"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <div class="container">
        <div v-if="popupType === 'add'">
          <el-input placeholder="坐席账号" v-model="add.username"></el-input>
          <el-input placeholder="坐席密码" v-model="add.password"></el-input>
        </div>
        <div v-else-if="popupType === 'reset'">
          <p>{{reset.username}}</p>
          <el-input placeholder="新密码" v-model="reset.password"></el-input>
        </div>
        <div v-else-if="popupType === 'permission'" class="permission">
          <div class="levelItem">第一层：
            <el-input v-model="permission.level1" @input="inputLimit('level1')"></el-input>%
          </div>
          <div class="levelItem">第二层：
            <el-input v-model="permission.level2" @input="inputLimit('level2')"></el-input>%
          </div>
          <div class="levelItem">第三层：
            <el-input v-model="permission.level3" @input="inputLimit('level3')"></el-input>%
          </div>
        </div>
        <div v-else>异常</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">{{buttonName}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getList,
    userAdd,
    userOnOff,
    permissionEdit,
    permissionDetail,
    setPermission,
    resetPwd
  } from "@/api/community/list.js";
  export default {
    data() {
      return {
        tableData: [],
        dialogVisible: false,
        thirdRecordId: undefined,
        company: undefined,
        //  popup
        title: "添加坐席",
        buttonName: "添加",
        popupType: "add", // 添加坐席: add   重置密码: reset   设置权限: 'permission'
        _popupType: "add",
        add: {
          username: "",
          password: ""
        },
        reset: {
          userId: "",
          username: "",
          password: ""
        },
        permission: {
          userId: "",
          level1: "",
          level2: "",
          level3: ""
        },
        loading: false,
        //  pagination
        totalCount: 0,
        paginationData: {
          limit: 10,
          offset: 0
        }
      };
    },
    props: {},
    components: {},
    async created() {
      this.bindPopupType();
      this.getList();
    },
    methods: {
      async getList() {
        this.loading = true;
        let res = await getList(this.paginationData);
        let list = res.data;
        list.forEach(v => {
          v.onOffName = v.dataStatus === 1 ? "已启动" : "未启动";
          v._onOff = v.dataStatus;
        });
        this.tableData = list;
        this.bindOnOff();
        this.totalCount = res.pageInfo.totalCount;
        this.loading = false;
      },
      async setPermission(data) {
        this._popupType = "permission";
        this.dialogVisible = true;
        this.permission.userId = data.id;
        let res = await permissionDetail(data.id);
        let permissionData = res.data;
        let permission = JSON.parse(permissionData.moduleOperation);
        let { level1, level2, level3 } = permission;
        this.permission.level1 = level1;
        this.permission.level2 = level2;
        this.permission.level3 = level3;
      },
      search() {
        this.getList({ userName: this.searchUsername });
      },
      resetTable() {
        this.paginationData.pageNum = 1;
        this.searchUsername = void 0;
        this.getList(this.paginationData);
      },
      resetPwd(data) {
        this._popupType = "reset";
        this.dialogVisible = true;
        this.reset.username = data.userName;
        this.reset.userId = data.id;
      },
      addUser() {
        this._popupType = "add";
        this.dialogVisible = true;
      },
      onOff(onOff, index) {
        let item = this.tableData[index];
        userOnOff(item.id).then(res => {
          if (res.code === 200) {
            item._onOff = item.dataStatus === 1 ? 2 : 1;
          }
        });
      },
      submit() {
        switch (this.popupType) {
          case "add":
            this.addUserInSubmit();
            break;
          case "reset":
            this.resetPwdInSubmit();
            break;
          case "permission":
            this.setPermissionInSubmit();
            break;
          default:
            break;
        }
      },
      addUserInSubmit() {
        let { username, password } = this.add;
        userAdd(username, password).then(res => {
          if (res.code === 200) this.popupInitAndClose();
          this.getUsers();
        });
      },
      resetPwdInSubmit() {
        let { userId, password } = this.reset;
        resetPwd(userId, password).then(res => {
          if (res.code === 200) this.popupInitAndClose();
        });
      },
      setPermissionInSubmit() {
        let { userId, level1, level2, level3 } = this.permission;
        permissionEdit(userId, level1, level2, level3).then(res => {
          if (res.code === 200) this.popupInitAndClose();
        });
      },
      beforeClose(done) {
        this.popupInitAndClose();
        done();
      },
      popupInitAndClose() {
        this.add = {
          username: "",
          password: ""
        };
        this.reset = {
          userId: "",
          username: "",
          password: ""
        };
        this.permission = {
          userId: "",
          level1: "",
          level2: "",
          level3: ""
        };
        this.dialogVisible = false;
      },
      handleCurrentChange(val) {
        this.paginationData.pageNum = val;
        this.getUsers(this.paginationData);
      },
      inputLimit(type) {
        let value = window.event.target.value;
        let reg, regG;
        reg = /^[0-9]*$/;
        regG = /[^0-9]/g;
        this.$nextTick(() => {
          value = value.replace(regG, "");
          if (Number(value) > 100) value = 100;
          if (Number(value) < 0) value = 0;
          this.permission[type] = value;
        });
      },
      bindOnOff() {
        this.tableData.forEach(v => {
          Object.defineProperty(v, "_onOff", {
            set: function(nv) {
              v.onOffName = nv === 1 ? "已启动" : "未启动";
              v.dataStatus = nv;
            },
            enumerable: true,
            configurable: true
          });
        });
      },
      bindPopupType() {
        const that = this;
        Object.defineProperty(this, "_popupType", {
          set: function(nv) {
            switch (nv) {
              case "add":
                that.title = "添加坐席";
                that.buttonName = "添 加";
                break;
              case "reset":
                that.title = "重置密码";
                that.buttonName = "重 置";
                break;
              case "permission":
                that.title = "设置权限";
                that.buttonName = "设 置";
                break;
              default:
                break;
            }
            that.popupType = nv;
          },
          enumerable: true,
          configurable: true
        });
      }
    }
  };
</script>

<style lang="scss">
  #main_container {
    padding: 32px;
    .filter-container {
      border: 1px solid #f2f2f2;
      padding: 5px 3px;
      & > div {
        display: inline-block;
      }
      .input {
        width: 200px;
        margin-right: 80px;
      }
      .search {
        margin-right: 40px;
      }
    }
    .userList {
      & > .el-pagination {
        display: flex;
        justify-content: center;
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
        .permission {
          .levelItem {
            display: flex;
            align-items: center;
            & + .levelItem {
              margin-top: 10px;
            }
            .el-input {
              margin: 0 5px;
            }
          }
        }
      }
    }
  }
</style>
