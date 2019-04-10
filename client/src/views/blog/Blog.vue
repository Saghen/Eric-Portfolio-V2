<template>
  <div>
    <nav-bar></nav-bar>
    <router-view></router-view>
    <modal id="login" name="login" height="auto">
      <login></login>
    </modal>
    
    <toast position="se"></toast>
  </div>
</template>

<style lang="scss">
@import '@/styles/blog.scss';
</style>

<script>
import NavBar from '@/components/blog/NavBar.vue';

import 'vuex-toast/dist/vuex-toast.css';
import { Toast } from 'vuex-toast';

import Login from '@/components/blog/Login.vue';

export default {
  name: 'blog',
  components: {
    'nav-bar': NavBar,
    Toast,
    Login
  }
}
</script>
