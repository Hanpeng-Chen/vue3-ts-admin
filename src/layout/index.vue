<template>
  <div class="app-wrapper">
    <div class="sidebar-container">
      <sidebar />
    </div>
    <div class="main-container">
      <div class="header">
        <navbar></navbar>
        <div class="tags-view">tags view</div>
      </div>
      <app-main></app-main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'

export default defineComponent({
  components: {
    Sidebar,
    Navbar,
    AppMain
  }
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    .header {
      .navbar {
        height: 50px;
        position: relative;
        background: #FFF;
        box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
      }
      .tags-view {
        height: 34px;
      }
    }
    .app-main {
      min-height: calc(100vh - 84px);
      background: #FFF;
    }
  }
}
</style>
