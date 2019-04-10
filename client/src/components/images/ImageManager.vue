<template>
  <div id="manager">
    <image-uploader></image-uploader>
    <div class="seperator"></div>
    <image-picker></image-picker>
  </div>
</template>

<script>
import ImagePicker from './ImagePicker.vue';
import ImageUploader from './ImageUploader.vue';

export default {
  components: {
    ImagePicker,
    ImageUploader
  }
}
</script>

<style lang="scss" scoped>
#manager {
  margin: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
