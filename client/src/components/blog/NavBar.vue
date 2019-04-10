<template>
  <header ref="header" :class="{ dark: theme == 'dark', block }">
    <div>
      <router-link to="/blog/" id="header-logo">
        <svg viewBox="0 0 105 95">
          <g>
            <path
              style="fill:#fff;"
              d="M 1.2027119,18.371517 H 66.149217 l -8.55263,14.699824 H 26.459683 L 60.402917,91.469733 H 43.030394 Z"
            ></path>
            <path
              style="fill:#fff;"
              d="M 46.237625,34.541327 H 28.865105 L 61.471997,90.400663 103.56695,17.436072 94.747052,3.00352 61.471997,60.867371 Z"
            ></path>
            <path
              style="fill:#fff;"
              d="M 9.7553378,1.800805 1.3363469,16.7679 68.955537,17.035169 53.186627,43.494851 61.605617,58.595571 93.945242,2.068077 Z"
            ></path>
          </g>
        </svg>
        <span id="header-title">Sea of Electrons</span>
      </router-link>
    </div>
    <div>
      <a class="header-link" @click.prevent="displayLogin()">Login</a>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import '@/styles/_globals.scss';

/* Header */

header {
  display: flex;
  justify-content: space-between;
  position: fixed;
  width: 100vw;
  padding: 16px;
  box-sizing: border-box;
  transition: background 0.2s;
  letter-spacing: 0.1em;
  transform: translateZ(0);
  z-index: 10;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: $width;
  }
}

.header-link {
  color: #fff;
}

.block {
  position: relative;
}

#header-logo {
  display: flex;
  align-items: center;
  @extend %anchor-reset;

  svg {
    height: 65px;

    path {
      transition: 0.2s fill;
    }
  }

  > span {
    margin-left: 10px;
  }
}

.scrolled-header, .dark {
  background-color: #fff !important;
  color: #000;
  box-shadow: 0 0 10px 0 #aaa;

  path {
    fill: #222 !important;
  }

  a {
    color: #000 !important;
  }

  nav a:hover {
    color: #666 !important;
  }
}
</style>


<script>
function scrolledHeader(elem, className) {
  return function run() {
    if (window.scrollY > 10) elem.classList.add(className);
    else elem.classList.remove(className);
  };
}

export default {
  name: 'nav-bar',
  mounted() {
    window.addEventListener(
      'scroll',
      scrolledHeader(this.$refs.header, 'scrolled-header')
    );
  },
  computed: {
    theme() {
      return this.$store.state.navBarTheme;
    },
    block() {
      return this.$store.state.navBarStuck;
    }
  },
  methods: {
    displayLogin() {
      this.$modal.show('login')
    }
  }
};
</script>