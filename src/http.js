import axios from 'axios';
import {
  Loading,
  Message,
  MessageBox
} from 'element-ui';
import store from './store/index';
import router from './router/index';
// import { sessionStorage } from 'src/assets/js/storage';

// if (!store.state.token) {
//   store.commit('SET_TOKEN', sessionStorage.getItem('token'));
// }

// axios 配置
// axios.defaults.withCredentials=true;
const http = axios.create({
  baseURL: '/api',
  // baseURL: 'http://192.168.0.113:8050',
  // baseURL: 'https://www.xtll.top:8050',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  withCredentials: true
  // transformRequest: [function (data, headers) {
  //   console.log(data, headers['Content-type']);
  //   // headers.token = store.state.token;
  //   if (headers['Content-type'] === 'multipart/form-data') {
  //     return data;
  //   } else {
  //     // return JSON.stringify(data);
  //     return data;
  //   }
  // }]
});


var loadingInstance;

// 请求拦截器
http.interceptors.request.use(config => {
  loadingInstance = Loading.service({
    fullscreen: true,
    lock: true,
    text: '正在请求数据...'
  });
  // 开发环境下，如果请求是 post,put,patch,则打印数据体，方便调试
  if (process.env.NODE_ENV === 'development') {
    const { method } = config;
    if (method === 'post' || method === 'put' || method === 'patch') {
      
    }
  }
  if(config.url != '/login') {
    config.headers['Authorization'] = localStorage.getItem('token') ? localStorage.getItem('token') : '';
  }
  return config;
}, error => {
  loadingInstance.close();
  Message.error({
    message: '请求失败'
  });
  return Promise.reject(error);
});

// 响应拦截器
http.interceptors.response.use(res => {
  loadingInstance.close();
  if(res.config.url == '/login') {
    return false
  } else {
    if(res.data.code == '2' || res.data.code == '401') {
      MessageBox.alert('身份信息已过期，请重新登陆', '提示', {
        confirmButtonText: '重新登陆',
        showClose: false,
        type: 'error',
        callback: action => {
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
        }
      });
      return false;
    }
  }
  return res.data;
}, error => {
  loadingInstance.close();
  if (error && error.response) {
    console.log(error.response);
    // switch (error.response.status) {
    //   // 401 token失效
    //   case 401:
    //     MessageBox.alert('身份信息已过期，请重新登陆', '提示', {
    //       confirmButtonText: '重新登陆',
    //       showClose: false,
    //       type: 'error',
    //       callback: action => {
    //         router.replace({
    //           path: '/login',
    //           query: {
    //             redirect: router.currentRoute.fullPath
    //           }
    //         });
    //       }
    //     });
    //     break;
    //   // 403 服务器拒绝访问
    //   case 403:
    //     router.push('/error/403');
    //     break;
    //   // 404 访问的资源不存在
    //   case 404:
    //     router.push('/error/404');
    //     break;
    //   // 500 服务器错误
    //   case 500:
    //     router.push('/error/500');
    //     break;
    // }
    return Promise.reject(error);
  }
});

export default http;
