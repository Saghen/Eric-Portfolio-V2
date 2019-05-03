<template>
  <div id="blog-manage">
    <router-link to='/blog/manage/insert' class="button">New Post</router-link>
    <div id="drafts">
      <h2>Drafts</h2>
      <div class="post-container">
        <router-link v-for="(draft, key) in drafts.posts" :key="key" :to="`/blog/manage/edit?id=${draft._id}`">
          <card-small :data="draft"></card-small>
        </router-link>
      </div>
      <pagination v-if="drafts.maxPage > 1" v-model="drafts.page" :maxPage="drafts.maxPage"></pagination>
    </div>
    <div id="published">
      <h2>Published</h2>
      <div class="post-container">
        <router-link v-for="(post, key) in published.posts" :key="key" :to="`/blog/manage/edit?id=${post._id}`">
          <card-small :data="post"></card-small>
        </router-link>
      </div class="post-container">
      <pagination
        v-if="published.maxPage > 1"
        v-model="published.page"
        :maxPage="published.maxPage"
      ></pagination>
    </div>
  </div>
</template>

<script>
import CardSmall from '@/components/blog/manage/CardSmall.vue';
import Pagination from '@/components/blog/Pagination.vue';

export default {
  components: {
    CardSmall,
    Pagination
  },
  data() {
    return {
      drafts: {
        posts: [],
        page: 1,
        maxPage: 1
      },
      published: {
        posts: [],
        page: 1,
        maxPage: 1
      },
      countPerPage: 20
    };
  },
  created() {
    this.updateDrafts();
    this.updatePublished();
  },
  watch: {
    drafts: {
      page() {
        this.updateDrafts();
      }
    },
    published: {
      page() {
        this.updatePublished();
      }
    }
  },
  methods: {
    updateDrafts() {
      this.$http
        .get(`/api/blog/list?draft=true&page=${this.drafts.page}`)
        .then(res => {
          const data = res.data.data;

          this.drafts.posts = data.posts;
          this.drafts.maxPage = Math.ceil(data.count / this.countPerPage);
        });
    },
    updatePublished() {
      this.$http.get(`/api/blog/list?page=${this.published.page}`).then(res => {
        const data = res.data.data;

        this.published.posts = data.posts;
        this.published.maxPage = Math.ceil(data.count / this.countPerPage);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#blog-manage {
  padding: 32px;
}

.post-container {
  display: flex;
  flex-wrap: wrap;

  > a {
    margin: 16px;
  }
}
</style>
