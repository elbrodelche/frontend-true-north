import Vue from 'vue';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle, faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


library.add(faPlusCircle);
library.add(faPlus);
library.add(faMinus);
library.add(faTrash);


Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
