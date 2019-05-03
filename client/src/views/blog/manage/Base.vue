<template>
  <div id="manage-base">
    <side-nav id="members-side-nav">
      <router-link to="/blog/manage">
        <span>Home</span>
        <div class="sub-nav">
          <router-link to="/blog/manage/insert">
            <span>Insert Post</span>
          </router-link>
        </div>
        <div class="sub-nav">
          <router-link to="/blog/manage/edit">
            <span>Edit Post</span>
          </router-link>
        </div>
      </router-link>
      <router-link to="/blog/manage/authors">
        <span>Authors</span>
      </router-link>
      <router-link to="/blog/manage/topics">
        <span>Topics</span>
      </router-link>
      <router-link to="/blog/manage/images">
        <span>Images</span>
      </router-link>
    </side-nav>
    <div id="manage-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SideNav from '@/components/base/SideNav.vue';

export default {
  components: {
    SideNav
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/_globals.scss';

#manage-base {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  height: calc(100vh - #{$navBarHeight});
  overflow: hidden;

  > #manage-view {
    overflow: auto;
  }
}

@media screen and (max-width: 1000px) {
  #manage-base {
    grid-template-columns: auto;
  }
}
</style>

