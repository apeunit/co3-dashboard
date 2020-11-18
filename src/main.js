import Vue from 'vue'
import Apollo from './plugins/apollo'
import Axios from './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
Vue.use(Axios)
Vue.use(Apollo)

import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";
const SENTRY_DSN = process.env.VUE_APP_SENTRY_DSN
Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [new VueIntegration({ Vue, attachProps: true })],
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
