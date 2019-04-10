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
      <blog-card v-for="(card, i) in visibleBlogData" :key="i" :data="card"></blog-card>
      <pagination v-model="page" :maxPages="maxPages"></pagination>
    </div>
  </div>
</template>

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

<script>
import BlogCard from '@/components/blog/Card.vue';
import Pagination from '@/components/blog/Pagination.vue';

const countPerPage = 20;

export default {
  name: 'Home',
  created() {
    this.$store.commit('changeTheme', 'light');

    this.$http.get(`/api/blog/list?maxitems=${999}`).then(res => {
      const data = res.data.data;
      for (let i = 0; i < data.length; i++) {
        data[i].dark = i % 2 == 1;
      }
      this.blogData = data;
    });
  },
  data() {
    return {
      blogData: [],
      page: +this.$route.query.page || 1,
      countPerPage: 6
    };
  },
  computed: {
    visibleBlogData() {
      const newData = [];
      const offset = (this.page - 1) * this.countPerPage;

      for (let i = 0; i < Math.min(this.countPerPage, this.blogData.length - offset); i++) {
        newData.push(this.blogData[i + offset]);
      }

      return newData;
    },
    maxPages() {
      console.log(this.blogData);
      return Math.ceil(this.blogData.length / this.countPerPage)
    }
  },
  watch: {
    page() {
      this.$router.replace({query: {page: this.page}})
    }
  },
  components: {
    'blog-card': BlogCard,
    pagination: Pagination
  }
};
</script>

