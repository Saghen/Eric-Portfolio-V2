<template>
  <div id="insert">
    <image-manager></image-manager>
    <post-editor v-model="post"></post-editor>
    <a class="button" @click.prevent="submit()">Save Changes</a>
  </div>
</template>

<script>
import PostEditor from '@/components/blog/PostEditor.vue';

import ImageManager from '@/components/images/ImageManager.vue';

export default {
  name: 'insert',
  components: {
    PostEditor,
    ImageManager
  },
  data() {
    return {
      post: {
        id: undefined,
        title: '',
        description: '',
        image: '',
        content: '',
        topic: '',
        draft: true,
        hidden: false
      },
      saved: false
    };
  },
  created() {
    this.$store.commit('changeStuck', true);
    this.$store.commit('changeTheme', 'dark');

    this.$http.get('/');
  },
  destroyed() {
    this.$store.commit('changeStuck', false);
    this.$store.commit('changeTheme', 'light');
  },
  watch: {
    post: {
      handler: function(post) {},
      deep: true
    }
  },
  methods: {
    sendToast(text) {
      this.$toasted.show(text, {
        type: 'success'
      });
    },

    sendError(text) {
      this.$toasted.show(text, {
        type: 'error'
      });
    },

    submit() {
      let request;
      if (this.saved) request = this.updatePost(post);
      else request = this.insertPost();

      request.catch(err => {
          console.error(err.response);
          if (err.response.status === 401)
            this.sendError('Please login to submit');
          else this.sendError(err.response.data.errors[0].message);
        });
    },

    insertPost() {
      return this.$http
        .put('/api/blog/insert', this.post)
        .then(({ data }) => {
          this.post.id = data.id;
          this.sendToast('Successfully uploaded');
        })
    },

    updatePost(post) {
      return this.$http
        .update('/api/blog/update', post)
        .then(() => this.sendToast('All changes saved.'))
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/_globals.scss';

#insert {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 16px;
}

.button {
  margin: 16px auto;
}
</style>