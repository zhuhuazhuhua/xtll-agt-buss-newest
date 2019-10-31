// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import http from './http';
import store from './store/index';
import router from './router/index';
import Root from './Root.vue';

// 引入公共样式表
import 'normalize.css';
import 'animate.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import 'src/assets/styles/variable.scss';
import 'src/assets/styles/base.scss';
import 'src/assets/styles/common.scss';
import 'src/assets/styles/iconfont.css';
import allArea from 'src/data/city.json';
import { $override } from 'zrender/lib/core/util';
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})
Vue.use(ElementUI);

Vue.config.productionTip = true;

/* eslint-disable no-new */

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = http;
new Vue({
  el: '#app',
  store,
  router,
  template: '<Root/>',
  components: { Root }
});
