<template>
  <div class="navbar">
    <hamburger @toggleClick="toggleSidebar" :is-active="sidebar.opened"></hamburger>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Hamburger from '@/components/Hamburger/index.vue'
import { useStore } from '@/store/index'

export default defineComponent({
  name: 'Navbar',
  components: {
    Hamburger
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
