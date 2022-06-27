import { post, get } from '@/utils/http';

// 登录
export const login = (value: API.LoginParams) => post('/sys/login', value);

// 获取用户信息
export const reqUserInfo = () => get('/sys/user/info');

// 登录
export const updatePassword = (value: object) =>
  post('/sys/user/password', value);

// 获取侧边栏菜单
export const reqSideBarMenu = () => get('/sys/menu/nav');
