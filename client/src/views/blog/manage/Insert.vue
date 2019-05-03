<template>
  <div id="insert">
    <image-manager></image-manager>
    <post-editor v-model="post"></post-editor>
    <a class="button" @click.prevent="insertPost()">Save Changes</a>
  </div>
</template>

<script>
import PostEditor from '@/components/blog/manage/PostEditor.vue';

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
        draft: true
      }
    };
  },
  methods: {
    insertPost() {
      return this.$http
        .put('/api/blog/insert', this.post)
        .then(({ data }) => {
          this.$sendToast('Successfully uploaded');
          this.$router.push('/blog/manage');
        })
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