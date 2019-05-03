<template>
  <div>
    <div id="hero">
      <div id="hero-text">
        <h1>Sea of Electrons</h1>
        <span>
          Some pitch about your blog. Just gonna fill in some text here so you can see what it looks like when
          there is some text to fill in the space.
        </span>
      </div>
    </div>
    <div id="card-container">
      <blog-card v-for="(card, i) in posts" :key="i" :dark="i % 2 == 1" :data="card"></blog-card>
      <pagination v-model="page" :maxPage="maxPage"></pagination>
    </div>
  </div>
</template>

<script>
import BlogCard from '@/components/blog/Card.vue';
import Pagination from '@/components/blog/Pagination.vue';

export default {
  data() {
    return {
      posts: [],
      page: +this.$route.query.page || 1,
      countPerPage: 10,
      maxPage: 1
    };
  },
  created() {
    this.updatePosts();
  },
  watch: {
    page() {
      this.$router.replace({ query: { page: this.page } });
      
      this.updatePosts();
    }
  },
  methods: {
    updatePosts() {
      this.$http
        .get(`/api/blog/list?page=${this.page}&maxitems=${this.countPerPage}`)
        .then(res => {
          const data = res.data.data;
          this.maxPage = Math.ceil(data.count / this.countPerPage);

          this.posts = data.posts;
        });
    }
  },
  components: {
    BlogCard,
    Pagination
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/_globals.scss';

/* Splash page */

#hero {
  position: relative;
  height: 600px;
  background: url('/images/blog-bg.jpg');
  background-size: cover;
  color: #fff;
}

#hero-text {
  position: absolute;
  max-width: 700px;
  max-height: 270px;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 20px;
  right: 20px;
  text-align: center;
}

#hero-text span {
  font-size: 1.6em;
  line-height: 1.6em;
}

#hero-text h1 {
  font-size: 3em;
}

/* Blog Items */

#card-container {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: $width;
}
</style>
