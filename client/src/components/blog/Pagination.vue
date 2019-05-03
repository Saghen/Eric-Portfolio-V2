<template>
  <div class="pagination">
    <button :class="{'pagination-inactive': value == 1 }" v-on:click="decrease()">
      <svg viewBox="0 0 448 512">
        <path
          d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"
        ></path>
      </svg>
    </button>
    <span>{{ value }}</span>
    <button :class="{'pagination-inactive': value >= maxPage}" v-on:click="increase();">
      <svg viewBox="0 0 448 512">
        <path
          d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
/* Pagination */

.pagination {
  margin: 20px auto;
  text-align: center;

  * {
    margin: 0 5px;
  }

.pagination-inactive > svg > path {
  fill: #999;
}

  button {
    cursor: pointer;
    background: transparent;
    border: 0;
    padding: 5px;
    transition: 0.2s all;
    outline: none !important;

    > svg {
      width: 10px;

      > path {
        fill: #000;
        transition: 0.2s fill;
      }
    }
  }

  button:hover:not(.pagination-inactive) {
    background: #000;
    > svg > path {
      fill: #fff;
    }
  }
}
</style>


<script>
export default {
  name: 'pagination',
  props: {
    maxPage: Number,
    value: Number
  },
  methods: {
    increase(val = 1) {
      if (this.value + val <= this.maxPage)
        this.$emit('input', this.value + val);
    },
    decrease(val = 1) {
      if (this.value - val > 0) this.$emit('input', this.value - val);
    }
  }
};
</script>

