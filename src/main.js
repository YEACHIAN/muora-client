import Vue from 'vue'
import App from './App'
import router from '@/router'
import Install from '@/Install'

Vue.use(Install)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')