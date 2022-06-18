import cookie from 'react-cookies';

export const setToken = (key: string, val: string, config: object) => {
  cookie.save(key, val, config);
};

export const getToken = (key: string): string => {
  return cookie.load(key);
};

export const removeToken = (key: string, config: object): string => {
  return cookie.remove(key, config);
};
