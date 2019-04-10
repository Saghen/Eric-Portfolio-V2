<template>
  <div id="post-editor">
    <div class="input" id="title">
      <input type="text" name="title" v-model="value.title" maxlength="120" placeholder="Title">
    </div>

    <div class="input" id="description">
      <input
        type="text"
        name="description"
        v-model="value.description"
        maxlength="400"
        placeholder="Description"
      >
    </div>

    <div class="input" id="image">
      <input
        type="text"
        name="image"
        v-model="value.image"
        maxlength="400"
        placeholder="Image Url"
      >
    </div>

    <div class="input">
      <select name="topic" v-model="value.topic" required>
        <option value disabled selected hidden>Select a Topic</option>
        <option v-for="topic in topics" :key="topic" :value="topic">{{ topic.capitalize() }}</option>
      </select>
    </div>

    <div id="content">
      <ckeditor :editor="editor" v-model="value.content" :config="config"></ckeditor>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/_globals.scss';

#post-editor {
  display: flex;
  align-items: center;
  flex-direction: column;
  > * + * {
    margin-top: 32px;
  }
}

#title {
  font-size: 2em;
  input {
    text-align: center;
  }
}

#description, #image {
  input {
    text-align: center;
  }
}

#content {
  width: 100%;
  max-width: $width;
}
</style>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: 'post-editor',
  components: {
    ckeditor: CKEditor.component
  },
  props: ['title', 'id', 'value'],
  data() {
    return {
      editor: ClassicEditor,
      config: {
      },
      topics: []
    };
  },
  created() {
    this.$http
      .get('/api/blog/topics')
      .then(topics => (this.topics = topics.data));
  },
  watch: {
    value: {
      handler() {
        this.$emit('input', this.value)
      },
      deep: true
    }
  }
};
</script>

