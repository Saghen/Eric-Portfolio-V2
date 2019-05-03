import Vue from 'vue';
import store from './store';
import router from './router';

import axios from './axios';
import App from './App.vue';

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

import VModal from 'vue-js-modal';

//Vue.use(VModal);
Vue.use(VModal, { dialog: true })

import Toasted from 'vue-toasted';

Vue.use(Toasted);
Vue.prototype.$sendToast = function(text, opts) {
  const defaultOpts = {
    type: 'success',
    duration: 4000
  };

  if (typeof opts !== 'object') opts = {};

  opts = {
    ...defaultOpts,
    ...opts
  }

  this.$toasted.show(text, opts);
};

Vue.prototype.$sendToastError = function(text, opts) {
  if (typeof opts !== 'object') opts = {};

  opts.type = 'error';

  this.$sendToast(text, opts);
}

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
