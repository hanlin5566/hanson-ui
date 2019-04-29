<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 10px;">
      <el-button class="filter-item" type="primary" @click="onSubmit" :loading="saveLoading">保存</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="onCancel">返回</el-button>
    </div>

    <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="left" style="margin-top: 10px;">
      <el-form-item label="经销商名称" prop="ddealer">
        <el-input v-model="form.ddealer" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="经销商城市" prop="ddealerCity">
        <el-input v-model="form.ddealerCity" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="经销商等级" prop="dealerLevel">
        <el-select v-model="form.dealerLevel" placeholder="请选择">
          <el-option label="一级经销商" value="level1"></el-option>
          <el-option label="二级经销商" value="level2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经销商邮箱" prop="ddealerMail">
        <el-input v-model="form.ddealerMail" style="width: 250px;"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { saveDealer, getDealer } from '@/api/dealer'

export default {
  data() {
    return {
      saveLoading: false,
      form: {
        ddealer: '',
        ddealerCity: '',
        dealerLevel: null,
        ddealerMail: ''
      },
      rules: {
        ddealer: { required: true, message: '请输入经销商名称', trigger: 'blur' },
        dealerLevel: { required: true, message: '请选择经销商等级', trigger: 'blur' },
        ddealerMail: [
          { required: true, message: '请输入经销商邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      const id = this.$route.params.id
      if (id !== 'add') {
        getDealer(id).then(response => {
          this.form = response
        })
      }
    },
    onSubmit() {
      this.saveLoading = true
      this.$refs['form'].validate((valid) => {
        if (valid) {
          saveDealer(this.form).then(response => {
            this.$message.success('保存成功!')
            this.saveLoading = false
            this.$router.push({
              path: '/dealer/list'
            })
          }).catch(result => {
            this.saveLoading = false
          })
        } else {
          this.saveLoading = false
          return false
        }
      })
    },
    onCancel() {
      this.$router.push({
        path: '/dealer/list'
      })
    }
  }
}
</script>

