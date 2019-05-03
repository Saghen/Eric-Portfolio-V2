import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    navBarTheme: 'dark',
    navBarStuck: false,
    accessToken:  localStorage.getItem('access_token') ||  '',
    currentUser: {},
    sideNav: {
      open: false,
      exists: false
    }
  },
  mutations: {
    changeTheme(state, theme) {
      state.navBarTheme = theme;
    },
    changeStuck(state, stuck) {
      state.navBarStuck = !!stuck;
    },
    changeSideNavOpen(state, value) {
      state.sideNav.open = !!value;
    },
    changeSideNavExists(state, value) {
      state.sideNav.exists = !!value;
    }
  }
});
