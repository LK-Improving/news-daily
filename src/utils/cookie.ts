// 一、下载
//
// npm install react-cookies
// 二、导入
//
// import cookie from 'react-cookies'

import cookie from 'react-cookies';

export const setCookie = (key: string, val: string, config?: object) => {
  cookie.save(key, val, config);
};

export const getCookie = (key: string): string => {
  return cookie.load(key);
};

export const removeCookie = (key: string, config?: object): string => {
  return cookie.remove(key);
};
