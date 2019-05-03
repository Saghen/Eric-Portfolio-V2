<template>
  <div class="editable-topic">
    <div>
      <input v-if="editing" type="text" v-model="value">
      <span @click="editing = true" v-else>{{ value }}</span>
    </div>
    <div class="editable-topic-controls">
      <a v-if="editing" @click="updateTopic">
        <v-icon name="check"></v-icon>
      </a>
      <a v-else @click="editing = true">
        <v-icon name="pen"></v-icon>
      </a>
      <a @click="deleteTopic">
        <v-icon name="trash-alt"></v-icon>
      </a>
    </div>
  </div>
</template>
  
<script>
import 'vue-awesome/icons/trash-alt';
import 'vue-awesome/icons/pen';
import 'vue-awesome/icons/check';

import VIcon from 'vue-awesome/components/Icon';

export default {
  props: ['id', 'topic'],
  components: {
    VIcon
  },
  data() {
    return {
      editing: false,
      value: this.topic
    };
  },
  methods: {
    updateTopic() {
      this.editing = false;
      this.$http
        .patch('/api/blog/topics/update', {
          id: this.id,
          topic: this.value
        })
        .catch(err => {
          this.$sendToastError('An error occured while updating the topic');
        });
    },
    deleteTopic() {
      this.$modal.show('dialog', {
        title: 'Alert!',
        text: 'Removing this topic is an irreversable action',
        buttons: [
          {
            title: 'Cancel',
            default: true
          },
          {
            title: 'Continue',
            handler: () => {
              this.$modal.hide('dialog');
              this.$http
                .delete(`/api/blog/topics/delete?id=${this.id}`)
                .then(res => {
                  this.$emit('changed');
                })
                .catch(err => {
                  console.error(err.response)
                  this.$sendToastError(
                    'An error occured while removing the topic'
                  );
                });
            }
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/_globals.scss';

.editable-topic {
  padding: 16px;
  display: inline-flex;
  transition: 0.2s box-shadow;
  box-shadow: $boxShadow;

  &:hover {
    box-shadow: $boxShadowHover;
  }

  .editable-topic-controls {
    display: flex;
    align-items: center;
    margin-left: 16px;

    a {
      cursor: pointer;
    }

    > * + * {
      margin-left: 8px;
    }
  }
}

</style>

 