import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    navBarTheme: 'dark',
    navBarStuck: false,
    accessToken:  localStorage.getItem('access_token') ||  '',
    currentUser: {}
  },
  mutations: {
    changeTheme(state, theme) {
      state.navBarTheme = theme;
    },
    changeStuck(state, stuck) {
      state.navBarStuck = !!stuck;
    }
  }
});
