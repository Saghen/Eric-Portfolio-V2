<template>
  <div class="blog-item" :class="{ dark: dark, light: !dark }">
    <router-link
      class="sub-item"
      :to="`/blog/post/${titleUrl}`"
    >{{ data.postedBy.fullName }} • {{ relativeDate }}</router-link>
    <h2>
      <router-link :to="`/blog/post/${titleUrl}`">{{ data.title }}</router-link>
    </h2>
    <p>{{ data.description }}</p>
    <div class="other-buttons">
      <router-link class="sub-item" :to="`/blog/post/${titleUrl}`">COUNTING READING...</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/_globals.scss';

.blog-item {
  position: relative;
  padding: 100px;

  .sub-item {
    transition: color 0.4s;
  }

  > h2 {
    font-size: 1.9em;
  }

  > p {
    line-height: 2em;
    font-size: 1.1em;
  }

  a {
    @extend %anchor-reset;
  }
}

.light {
  color: #363636;

  .sub-item {
    color: #999;

    &:hover {
      color: #111;
    }
  }

  h2 a {
    color: #000;
  }
}

.dark {
  background: url('/images/blog-dark-bg.jpg');
  background-size: cover;
  color: #eee;

  .sub-item {
    color: #ccc;
  }

  .sub-item:hover {
    color: #eee;
  }
}

@media only screen and (max-width: 768px) {
  .blog-item {
    padding: 40px;
  }
}
</style>

<script>
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en);

const timeAgo = new TimeAgo('en-US');

export default {
  props: ['data', 'dark'],
  computed: {
    titleUrl() {
      return this.data.title;
    },
    relativeDate() {
      return timeAgo.format(new Date(this.data.date));
    }
  }
};
</script>
