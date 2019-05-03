<template>
  <div id="manage-topics">
    <a class="button" @click="insertTopic">New Topic</a>
    <h2>Topics</h2>
    <div id="manage-topics-list">
      <a class="button" @click="updateTopics">Refresh</a>
      <editable-topic
        v-for="topic in topics"
        :key="topic._id"
        :id="topic._id"
        :topic="topic.topic"
        @changed="updateTopics"
      ></editable-topic>
    </div>
  </div>
</template>

<script>
import EditableTopic from '@/components/blog/manage/EditableTopic.vue';

export default {
  components: {
    EditableTopic
  },
  data() {
    return {
      topics: []
    };
  },
  created() {
    this.updateTopics();
  },
  methods: {
    updateTopics() {
      this.$http
        .get('/api/blog/topics/list')
        .then(res => {
          this.topics = res.data.data;
        })
        .catch(err => {
          this.$sendToastError('An error occured while getting the topics');
        });
    },
    insertTopic() {
      let topic = 'New Topic';
      let counter = 0;

      while (
        this.topics.find(
          val => val.topic == (counter == 0 ? topic : `${topic} ${counter}`)
        )
      ) {
        counter++;
      }

      if (counter > 0) topic = `${topic} ${counter}`;

      this.$http
        .put('/api/blog/topics/insert', { topic })
        .then(res => {
          this.updateTopics();
        })
        .catch(err => {
          this.$sendToastError(
            'An error occured while inserting the new topic'
          );
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#manage-topics {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 32px;

  > #manage-topics-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    > * + * {
      margin-top: 16px;
    }
  }
}
</style>
