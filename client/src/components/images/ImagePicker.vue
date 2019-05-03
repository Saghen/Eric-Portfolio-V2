<template>
  <div id="picker">
    <a @click="refresh" class="button">Refresh</a>
    <div id="images">
      <a
        v-for="(image, key) of activeImages"
        :key="key"
        @click="copyToClipboard(`/images/${image}`)"
      >
        <img :src="`/images/${image}?size=512`">
      </a>
    </div>
    <pagination v-if="maxPage > 1" v-model="page" :maxPage="maxPage"></pagination>
  </div>
</template>

<script>
import Pagination from '@/components/blog/Pagination.vue';

export default {
  components: {
    Pagination
  },
  data() {
    return {
      images: [],
      page: 1,
      countPerPage: 16
    };
  },
  methods: {
    refresh() {
      this.$http
        .get('/api/images/list')
        .then(res => (this.images = res.data.data));
    },
    copyToClipboard(str) {
      const el = document.createElement('textarea');
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.sendToast('Copied to clipboard');
    },
    sendToast(text) {
      this.$toasted.show(text, {
        type: 'success',
        duration: 5000
      });
    }
  },
  computed: {
    activeImages() {
      const activeImages = [];
      const countPerPage = this.countPerPage;
      const page = this.page - 1;

      const startIndex = page * countPerPage;
      const endIndex = Math.min(
        this.images.length,
        page * countPerPage + countPerPage
      );

      for (let i = startIndex; i < endIndex; i++) {
        activeImages.push(this.images[i]);
      }

      return activeImages;
    },
    maxPage() {
      return Math.ceil(this.images.length / this.countPerPage);
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>

<style lang="scss" scoped>
#picker {
  display: flex;
  flex-direction: column;
  align-items: center;

  > * + * {
    margin-top: 16px;
  }
}

#images {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  margin-top: 0;

  > a {
    display: block;
    margin: 16px 8px 0 8px;
    cursor: pointer;

    > img {
      max-height: 200px;
      height: 100%;
    }
  }
}
</style>
