import Vue from 'vue';
import store from './store';
import router from './router';

import axios from './axios';
import App from './App.vue';

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

import VModal from 'vue-js-modal'

Vue.use(VModal)

import Toasted from 'vue-toasted';

Vue.use(Toasted)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');