// 一、下载
//
// npm install react-cookies
// 二、导入
//
// import cookie from 'react-cookies'

import cookie from 'react-cookies';

export const setToken = (
  key: string = 'token',
  val: string,
  config?: object,
) => {
  cookie.save(key, val, config);
};

export const getToken = (key: string = 'token'): string => {
  return cookie.load(key);
};

export const removeToken = (key: string = 'token', config?: object): string => {
  return cookie.remove(key, config);
};
