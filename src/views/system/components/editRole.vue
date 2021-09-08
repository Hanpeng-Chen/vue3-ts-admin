<template>
  <div class="app-container">
    <el-form
      ref="editFormRef"
      :model="editData"
      :rules="editFormRules"
      label-width="100px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="editData.name"
          placeholder="请输入角色名称"
        />
      </el-form-item>
      <el-form-item label="说明" prop="description">
        <el-input
          v-model="editData.description"
          placeholder="请输入角色说明"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否默认角色" prop="is_default">
        <el-switch v-model="editData.is_default"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submit"
          :loading="loading"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { IRole } from '@/store/modules/role'
import { ElForm } from 'element-plus'
import { defineComponent, PropType, ref, watchEffect } from 'vue'

type FormInstance = InstanceType<typeof ElForm>

export default defineComponent({
  name: 'EditRole',
  props: {
    type: {
      type: Number,
      required: true
    },
    data: {
      type: Object as PropType<IRole>
    }
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const loading = ref(false)

    const editFormRef = ref<FormInstance|null>(null)
    const editData = ref({
      name: '',
      description: '',
      is_default: false
    })

    const editFormRules = {
      name: {
        required: true,
        message: '请输入角色名称',
        trigger: 'blur'
      },
      description: {
        required: true,
        message: '请输入说明',
        trigger: 'blur'
      }
    }

    const defaultProps = {
      name: '',
      description: '',
      is_default: false
    }

    watchEffect(() => {
      if (props.data) {
        editFormRef.value?.clearValidate()
        editData.value = { ...defaultProps, ...props.data }
      }
    })

    const submit = () => {
      (editFormRef.value as FormInstance).validate(valid => {
        if (valid) {
          emit('submit', editData.value)
        }
      })
    }

    return {
      loading,
      editData,
      editFormRef,
      editFormRules,
      submit
    }
  }
})
</script>
