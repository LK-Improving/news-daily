import { post, get } from '@/utils/http';
import { API } from '@/services/typings';

// 登录
export const login = (value: API.LoginParams) => post('/sys/login', value);

// 获取用户信息
export const reqUserInfo = () => get('/sys/user/info');

// 登录
export const updatePassword = (value: object) =>
  post('/sys/user/password', value);

// 获取侧边栏菜单
export const reqSideBarMenu = () => get('/sys/menu/nav');

// 获取系统日志列表
export const reqSysLogList = (value: object) => get('/sys/log/list', value);

// 获取菜单
export const reqMenuList = () => get('/sys/menu/list');

// 添加菜单
export const reqMenuSave = (value: object) => post('/sys/menu/save', value);

// 删除菜单
export const reqMenuDel = (id: number) => post(`/sys/menu/delete/${id}`);

// 修改菜单
export const reqMenuUpdate = (value: object) => post('/sys/menu/update', value);
