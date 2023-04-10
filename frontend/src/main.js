import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import axios from 'axios';
import VueQrcodeReader from 'vue-qrcode-reader';

Vue.use(VueQrcodeReader);

Vue.config.productionTip = false;
axios.defaults.baseURL = 'http://localhost:5005/api';

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
