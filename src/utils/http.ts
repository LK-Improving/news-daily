import axios from 'axios';
import { getCookie } from '@/utils/cookie';
import { message } from 'antd';
import { history } from 'umi';
import { API } from '@/services/typings';
import { LOGIN_PATH } from '@/models/contant';
// import QS from 'qs' // 引入qs模块，用来序列化post类型的数据

// 环境的变化
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:88/api'; // 'http://ip:port/v1.0.0/api/app'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://api-haoke-web.itheima.net'; // 'http://49.235.10.43:8880/v1.0.0/api/app'
}
export const baseUrl = axios.defaults.baseURL;

// 设置请求超时
axios.defaults.timeout = 5000;

// 将token添加至请求头
// axios.defaults.headers['token'] = getToken('token')

// 请求拦截器
axios.interceptors.request.use(
  (config: any) => {
    // 每次发送请求之前判断cookie中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = getCookie('token');
    if (token) config.headers.token = token;
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    const { code, msg } = response.data;
    if (response.status === 200) {
      switch (code) {
        case 0:
          return Promise.resolve(response);
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          const redirect = history.location.pathname;
          message.destroy(msg);
          message.error({
            content: '您还未登录，请先登录！',
            duration: 1,
            key: msg,
          });
          setTimeout(() => {
            history.push({
              pathname: LOGIN_PATH,
              query: {
                redirect,
              },
            });
          }, 500);
          return Promise.resolve(response);
        default:
          return Promise.resolve(response);
      }
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  (error) => {
    const redirect = history.location.pathname;
    message.error({
      content: '请求错误，请重新登录!',
      duration: 1,
    });
    history.push({
      pathname: LOGIN_PATH,
      query: {
        redirect,
      },
    });
    return Promise.reject(error);
  },
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url: string, params?: unknown): Promise<API.ResultType> {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url: string, params?: unknown): Promise<API.ResultType> {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}
