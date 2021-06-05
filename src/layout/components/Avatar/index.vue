<template>
  <el-dropdown
    class="avatar-container"
  >
    <div class="avatar-wrapper">
      <img :src="avatar" alt="" class="user-avatar">
      <i class="el-icon-caret-bottom"></i>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/">
          <el-dropdown-item>首页</el-dropdown-item>
        </router-link>
        <router-link to="/profile/index">
          <el-dropdown-item>个人设置</el-dropdown-item>
        </router-link>
        <el-dropdown-item @click="logout" divided>退出登录</el-dropdown-item>
        <router-link to="/">
        </router-link>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import avatar from '@/assets/avatar.jpg'

export default defineComponent({
  setup() {
    const logout = () => {
      console.log('退出登录')
    }
    return {
      logout,
      avatar
    }
  }
})
</script>

<style lang="scss" scoped>
.avatar-container {
  margin-right: 30px;
  .avatar-wrapper {
    margin-top: 5px;
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      cursor: pointer;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      font-size: 12px;
    }
  }
}
</style>
