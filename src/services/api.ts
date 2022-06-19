import { post, get } from '@/utils/http';

// 获取验证码
export const reqCaptcha = (value: string) => get(`/captcha.jpg?uuid=${value}`);

// 登录
export const login = (value: API.LoginParams) => post('/sys/login', value);

// 获取用户信息
export const reqUserInfo = () => get('/sys/user/info');

// 查询当前用户
export const queryCurrentUser = () => get('/currentUser');
