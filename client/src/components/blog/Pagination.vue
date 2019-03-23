<template>
  <div class="pagination">
    <button :class="{'pagination-inactive': value == 1 }" v-on:click="decrease()">
      <i class="fas fa-arrow-left"></i>
    </button>
    <span>{{ value }}</span>
    <button :class="{'pagination-inactive': value >= maxPages}" v-on:click="increase();">
      <i class="fas fa-arrow-right"></i>
    </button>
  </div>
</template>

<style lang="scss" scoped>
/* Pagination */

.pagination {
  margin: 20px auto;

  * {
    margin: 0 5px;
  }

  button {
    cursor: pointer;
    background: transparent;
    border: 0;
    padding: 5px;
    transition: 0.2s all;
    outline: none !important;
  }

  button:hover:not(.pagination-inactive) {
    background: #000;
    color: #fff;
  }
}

.pagination-inactive {
  color: #999;
}
</style>


<script>
export default {
  name: 'pagination',
  props: {
    maxPages: Number,
    value: Number
  },
  methods: {
    increase(val = 1) {
      if (this.value + val <= this.maxPages) this.$emit('input', this.value + val);
    },
    decrease(val = 1) {
      if (this.value - val > 0) this.$emit('input', this.value - val);
    }
  }
};
</script>

