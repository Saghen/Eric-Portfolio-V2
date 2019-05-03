<template>
  <div class="card-small">
    <img :src="`${data.image}?size=512`" alt class="card-image">
    <h2 class="card-title">{{ data.title }}</h2>
    <span class="card-author">{{ data.postedBy.fullName }}</span>
    <div class="card-date" :datetime="data.date" ref="date"></div>
  </div>
</template>

<script>
import { render } from 'timeago.js';

import TrashIcon from '@/components/icons/Trash-Icon.vue';

export default {
  props: ['data'],
  components: { TrashIcon },
  mounted() {
    render(this.$refs.date);
  }
};
</script>

<style lang="scss" scoped>
.card-small {
  position: relative;
  padding: 16px;
  box-shadow: 0 0 8px 2px rgba(0,0,0, 0.3);
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  width: 256px;

  > .card-image {
    height: 256px;
    width: 100%;
    object-fit: cover;
  }

  &:hover {
    box-shadow: 0 0 16px 2px rgba(0,0,0, 0.3);
  }

  > *:not(.card-author) {
    color: #000;
  }

  .card-title {
    margin: 16px 0;
  }

  .card-author {
    margin-bottom: 8px;
  }
}
</style>
