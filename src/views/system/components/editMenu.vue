<template>
  <div class="app-container">
    <el-form
      ref="editFormRef"
      :model="editData"
      :rules="editFormRules"
      label-width="100px"
    >
      <el-form-item label="菜单名称" prop="title">
        <el-input
          v-model="editData.title"
          placeholder="请输入菜单名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input
          v-model="editData.path"
          placeholder="请输入路由路径"
        ></el-input>
      </el-form-item>
      <el-form-item label="路由Name" prop="name">
        <el-input
          v-model="editData.name"
          placeholder="请输入路由Name"
        ></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input
          v-model="editData.icon"
          placeholder="请输入icon名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="loading"
        >编辑菜单</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { updateMenuById } from '@/api/menu'
import { useStore } from '@/store'
import { MenuData } from '@/store/modules/menu'
import { ElForm } from 'element-plus'
import { defineComponent, getCurrentInstance, PropType, ref, watch } from 'vue'
import { useReloadPage } from '@/hooks/useReload'

type FormInstance = InstanceType<typeof ElForm>

export default defineComponent({
  name: 'EditMenu',
  props: {
    data: {
      type: Object as PropType<MenuData>
    }
  },
  emits: ['updateEdit'],
  setup(props) {
    const store = useStore()
    const { proxy } = getCurrentInstance()!
    const loading = ref(false)
    const editFormRef = ref<FormInstance|null>(null)
    const editData = ref({
      id: '',
      title: '',
      name: '',
      path: '',
      icon: ''
    })

    const editFormRules = {
      title: {
        required: true,
        message: '请输入菜单名称',
        trigger: 'blur'
      },
      path: {
        required: true,
        message: '请输入路由路径',
        trigger: 'blur'
      },
      name: {
        required: true,
        message: '请输入路由名称',
        trigger: 'blur'
      }
    }

    watch(() => props.data, (val) => {
      if (val) {
        resetFormData(val)
      }
    })

    const resetFormData = (data: MenuData) => {
      if (data) {
        const { id, title, path, name, icon } = data
        editData.value = { id: String(id), title, path, name, icon }
      }
    }

    const handleReset = () => {
      resetFormData(props.data as MenuData)
    }

    // 刷新系统
    const { reloadPage } = useReloadPage()

    const handleSubmit = () => {
      (editFormRef.value as FormInstance).validate(valid => {
        if (valid) {
          loading.value = true
          updateMenuById(Number(editData.value.id), editData.value).then(res => {
            if (res.code === 0) {
              proxy?.$message.success('菜单编辑成功')
              store.dispatch('menu/getAllMenuList')
              reloadPage()
            }
          }).finally(() => {
            loading.value = false
          })
        }
      })
    }

    return {
      editFormRef,
      loading,
      editData,
      editFormRules,
      handleReset,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
