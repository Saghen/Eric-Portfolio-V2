<template>
  <div id="edit-post">
    <image-manager></image-manager>
    <post-editor v-model="post"></post-editor>
    <a class="button" @click.prevent="updatePost()">Save Changes</a>
  </div>
</template>

<script>
import PostEditor from '@/components/blog/manage/PostEditor.vue';

import ImageManager from '@/components/images/ImageManager.vue';

export default {
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
        draft: true
      }
    };
  },
  created() {
    this.$http
      .get(`/api/blog/get?id=${this.$route.query.id}`)
      .then(res => {
        let post = res.data.data;

        this.post = {
          id: post._id,
          title: post.title,
          description: post.description,
          image: post.image,
          content: post.content,
          topic: (post.topic && post.topic._id) || undefined,
          draft: post.draft
        };
      })
      .catch(err => {
        console.error(err.response);
        if (err.response.status === 401)
          this.$sendToastError('Please login and reload');
        else this.$sendToastError(err.response.data.errors[0].message);
      });
  },
  methods: {
    updatePost(post) {
      return this.$http
        .patch('/api/blog/update', this.post)
        .then(() => this.$sendToast('All changes saved.'))
        .catch(err => {
          console.error(err.response);
          try {
            if (err.response && err.response.status === 401)
              this.$sendToastError('Please login to submit');
            else this.$sendToastError(err.response.data.errors[0].message);
          } catch {
            this.$sendToastError('An unkown error occured');
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/_globals.scss';

#edit-post {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 16px;
}

.button {
  margin: 16px auto;
}
</style>