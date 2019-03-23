<template>
  <div>
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
  </div>
</template>


<style lang="scss" scoped>
@import '@/styles/_globals.scss';
</style>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Plugins
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';

import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';

import Heading from '@ckeditor/ckeditor5-heading/src/heading';

import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';

import Link from '@ckeditor/ckeditor5-link/src/link';

export default {
  name: 'insert',
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        plugins: [
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Code,
          Subscript,
          Superscript,
          Highlight,
          Heading,
          Image,
          ImageToolbar,
          ImageCaption,
          Link
        ]
      }
    };
  },
  created() {
    this.$store.commit('changeStuck', true);
  },
  destroyed() {
    this.$store.commit('changeStuck', false);
  }
};
</script>
