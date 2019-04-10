<template>
  <div id="post">
    <div id="upper">
      <div>
        <span id="post-topic">{{ topic }}</span>
        <h1 id="post-title">{{ title }}</h1>
      </div>
    </div>
    <div id="lower">
      <div id="author">
        <img id="author-image" :src="postedBy.profileImage">
        <span id="author-name">{{ postedBy.firstName }} {{ postedBy.lastName }}</span>
        <span>{{ relativeDate }}</span>
      </div>
      <img id="splashimage" :src="image">
      <div id="content">
        <div class="ql-container ql-snow" v-html="content">
          <div id="blog-content" class="ql-editor"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/_globals.scss';

#post {
  > div:nth-child(2n + 1) {
    background: #f6f6f6;
  }
}

#post > div > * + *,
#author > * + * {
  margin-top: 20px;
}

#upper {
  text-align: center;
  padding: 140px 40px;

  > div {
    max-width: $width;
    margin: auto;
  }

  #post-topic {
    color: #888;
    text-transform: capitalize;
  }

  #post-title {
    font-size: 6em;
    text-align: center;
    margin: 20px 0;
  }
}

#lower {
  > div {
    max-width: $width;
    margin: auto;
  }

  #author {
    transform: translateY(-60px);
    display: flex;
    flex-direction: column;
    align-items: center;

    #author-image {
      border-radius: 60px;
      width: 120px;
    }

    #author-name {
      margin-top: 20px;
      color: #2a967b;
      line-height: 2em;
      display: flex;
      flex-direction: column;
      text-align: center;
    }
  }

  #splashimage {
    @extend %responsive-image;
  }
}

#content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  box-sizing: border-box;
}

@media only screen and (max-width: 768px) {
  #post-title {
    font-size: 3em;
    margin: 0 20px;
  }
}

@import '@/styles/posts/ql-editor.scss';

@import '@/styles/posts/hljs.scss';
</style>

<script>
import axios from '@/axios';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en);

const timeAgo = new TimeAgo('en-US');

export default {
  name: 'post',
  created() {
    this.$store.commit('changeTheme', 'dark');

    axios(
      `/api/blog/get?title=${this.$route.params.title}`
    ).then(({ data }) => {
      Object.assign(this, data.data);
      document.title = this.title;
    });
  },
  data() {
    return {
      topic: 'general',
      date: new Date(),
      hidden: false,
      views: 0,
      title: '',
      description: '',
      image: '',
      content: '',
      postedBy: {
        profileImage: '',
        firstName: '',
        lastName: ''
      }
    };
  },
  computed: {
    relativeDate() {
      return timeAgo.format(new Date(this.date));
    }
  }
};
</script>

