<template>
  <div>
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import '@/styles/blog.scss';
</style>

<script>
import NavBar from '@/components/blog/NavBar.vue';

export default {
  name: 'blog',
  components: {
    'nav-bar': NavBar
  }
}
</script>
