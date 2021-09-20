<template>
  <div class="app-container">
    <el-form
      ref="editFormRef"
      :model="editData"
      :rules="editFormRules"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editData.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editData.mobile" placeholder="请输入手机号" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editData.email" placeholder="请输入邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="初始密码" prop="password" v-if="type === 0">
        <el-input
          v-model="editData.password"
          placeholder="请设置初始密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="editData.status"></el-switch>
      </el-form-item>
      <el-form-item label="角色分配" prop="roleIds">
        <el-select
          v-model="editData.roleIds"
          multiple
          placeholder="请选择角色"
        >
          <el-option
            v-for="item in editData.roles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="说明" prop="description">
        <el-input
          type="textarea"
          :rows="3"
          v-model="editData.description"
          placeholder="请输入说明"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitEditForm" :loading="loading">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Profile } from '@/store/modules/user'
import { ElForm } from 'element-plus'
import { defineComponent, PropType, ref, watchEffect } from 'vue'

type FormInstance = InstanceType<typeof ElForm>

export default defineComponent({
  name: 'EditUser',
  props: {
    type: { // 1-编辑   0-新增
      type: Number,
      required: true
    },
    data: {
      type: Object as PropType<Profile>
    }
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const loading = ref(false)
    const editFormRef = ref<FormInstance | null>(null)
    const editData = ref<Partial<Profile>>({
      username: '',
      email: '',
      mobile: '',
      status: true,
      description: ''
    })

    const validateMobile = (
      rule: unknown,
      value: string,
      callback: (arg?: Error) => void
    ) => {
      if (!isNaN(Number(value)) && value.length === 11) {
        callback()
      }
      callback(new Error('请输入正确格式手机号'))
    }

    const validateRoles = (
      rule: unknown,
      value: number[],
      callback: (arg?: Error) => void
    ) => {
      if (value.length < 0) {
        callback(new Error('请至少选择一个角色'))
      }
      callback()
    }

    const editFormRules = {
      username: {
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
      },
      mobile: [
        {
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
        {
          message: '请输入正确的11位手机号',
          tirgger: 'blur',
          validator: validateMobile
        }
      ],
      email: [
        {
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        },
        {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change']
        }
      ],
      password: [
        {
          required: true,
          message: '请设置用户初始密码',
          trigger: 'blur'
        }
      ],
      roleIds: {
        required: true,
        message: '请至少选择一个角色',
        validator: validateRoles,
        trigger: 'blur'
      }
    }

    const defaultProps = {
      username: '',
      password: '',
      mobile: '',
      email: '',
      status: true,
      description: ''
    }

    watchEffect(() => {
      if (props.data) {
        // 移除之前表单校验的结果
        editFormRef.value?.clearValidate()
        editData.value = { ...defaultProps, ...props.data }
      }
    })

    const submitEditForm = () => {
      (editFormRef.value as FormInstance).validate(valid => {
        if (valid) {
          emit('submit', editData.value)
        }
      })
    }

    return {
      loading,
      editFormRef,
      editData,
      editFormRules,
      submitEditForm
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
