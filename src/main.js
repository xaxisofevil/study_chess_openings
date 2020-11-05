import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
// Import the Auth0 configuration
import { domain, clientId } from "../auth_config.json";

import VueTextTransition from 'vue-text-transition'
Vue.component('vue-text-transition', VueTextTransition)

// Import the plugin here
import { Auth0Plugin } from "./auth";


// Install the authentication plugin here

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    ).catch(()=>{});
  }
});

Vue.config.productionTip = false;

window.eventBus = new Vue ()

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
