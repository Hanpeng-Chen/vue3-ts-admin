<template>
  <div class="navbar">
    <hamburger @toggleClick="toggleSidebar" :is-active="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import { useStore } from '@/store/index'

export default defineComponent({
  name: 'Navbar',
  components: {
    Hamburger,
    Breadcrumb
  },
  setup() {
    const store = useStore()
    const sidebar = computed(() => store.getters.sidebar)
    const toggleSidebar = () => {
      store.dispatch('app/toggleSidebar')
    }
    return {
      sidebar,
      toggleSidebar
    }
  }
})
</script>

<style lang="scss">
.navbar {
  height: 50px;
  background: #FFF;
  border-bottom: 1px solid rgb(0 21 41 / 8%);
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
</style>
