<template>
  <div class="side-nav" :class="{ open }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  computed: {
    open() {
      return this.$store.state.sideNav.open;
    }
  }
};
</script>


<style lang="scss">
@import '@/styles/_globals.scss';

$width: 250px;

.side-nav {
  width: $width;
  flex-shrink: 0;
  background: #fff;
  box-shadow: 0 0 10px 0px #aaa;
  padding: 20px 0;
  height: calc(100% - 40px);
  transition: 0.2s left;
  will-change: left;
  overflow: auto;
  z-index: 100;
  a {
    > span {
      display: block;
      padding: 10px 30px;
      color: #000;
      transition: 0.2s;
      border-left: 0 solid $primary;
      white-space: nowrap;
    }
    span:hover {
      background-color: #eee;
    }
    &.router-link-exact-active, &.router-link-active:only-of-type {
      > span {
        border-left-width: 5px;
        background-color: #eee;
      }
    }
    &.router-link-active > .sub-nav {
      height: auto;
    }
  }

  .sub-nav {
    margin-left: 20px;
    height: 0;
    overflow: hidden;
  }
}

@media screen and (max-width: 1000px) {
  .side-nav {
    position: absolute;
    top: 0;
    left: -$width;
    bottom: 0;
    &.open {
      left: 0;
    }
  }
}
</style>
