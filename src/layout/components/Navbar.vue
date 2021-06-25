<template>
  <div class="navbar">
    <hamburger @toggleClick="toggleSidebar" :is-active="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <div class="right-menu">
      <!-- 设置 -->
      <div @click="openShowSetting" class="setting right-menu-item hover-effect">
        <i class="el-icon-s-tools"></i>
      </div>
      <screen-full id="screenfull" class="right-menu-item hover-effect"></screen-full>
      <el-tooltip content="Global Size" effect="dark" placement="bottom">
        <size-select class="right-menu-item hover-effect"></size-select>
      </el-tooltip>
      <avatar />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store/index'
import Hamburger from '@/components/Hamburger/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import ScreenFull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import Avatar from './Avatar/index.vue'

export default defineComponent({
  name: 'Navbar',
  components: {
    Hamburger,
    Breadcrumb,
    ScreenFull,
    SizeSelect,
    Avatar
  },
  emits: ['showSetting'],
  setup(props, { emit }) {
    const store = useStore()
    const sidebar = computed(() => store.getters.sidebar)
    const toggleSidebar = () => {
      store.dispatch('app/toggleSidebar')
    }

    // 打开设置面板
    const openShowSetting = () => {
      emit('showSetting', true)
    }
    return {
      sidebar,
      toggleSidebar,
      openShowSetting
    }
  }
})
</script>

<style lang="scss">
.navbar {
  display: flex;
  height: 50px;
  background: #FFF;
  border-bottom: 1px solid rgb(0 21 41 / 8%);
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  .right-menu {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 15px;
    .setting {
      font-size: 26px;
    }
    &-item {
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
  }
}
</style>
