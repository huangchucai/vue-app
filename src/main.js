import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import fastclick from 'fastclick'

import 'common/stylus/index.styl'

Vue.config.productionTip = false
// 消除移动端点击300毫秒延迟
fastclick.attach(document.body)
// 图片懒加载
Vue.use(VueLazyload, {
  error: require('common/image/default.png'),
  loading: require('common/image/default.png'),
  attempt: 1
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
