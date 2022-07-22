import { post, get } from '@/utils/http';
import { API } from '@/services/typings';
import Role from '@/pages/sys/role';

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

// 菜单相关Api
export const menuApi = {
  // 获取菜单
  reqMenuList: () => get('/sys/menu/list'),

  // 添加菜单
  reqMenuSave: (value: object) => post('/sys/menu/save', value),

  // 删除菜单
  reqMenuDel: (id: number) => post(`/sys/menu/delete/${id}`),

  // 修改菜单
  reqMenuUpdate: (value: object) => post('/sys/menu/update', value),

  // 获取菜单信息
  reqMenuInfo: (value: number) => get(`/sys/menu/info/${value}`),
};

// 角色相关Api
export const roleApi = {
  // 获取角色列表
  reqRoleList: (value: object) => get('/sys/role/list', value),

  // 查询所有角色
  reqRoleSelect: () => get('/sys/role/select'),

  // 添加角色
  reqRoleSave: (value: object) => post('/sys/role/save', value),

  // 删除角色
  reqRoleDel: (value: number[]) => post(`/sys/role/delete`, value),

  // 修改角色
  reqRoleUpdate: (value: object) => post('/sys/role/update', value),

  // 获取角色信息
  reqRoleInfo: (value: number) => get(`/sys/role/info/${value}`),
};

// 管理员相关Api
export const userApi = {
  // 获取管理员列表
  reqUserList: (value: object) => get('/sys/user/list', value),

  // 添加管理员
  reqUserSave: (value: object) => post('/sys/user/save', value),

  // 删除管理员
  reqUserDel: (value: number[]) => post(`/sys/user/delete`, value),

  // 修改管理员
  reqUserUpdate: (value: object) => post('/sys/user/update', value),

  // 获取管理员信息
  reqUserInfo: (value: number) => get(`/sys/user/info/${value}`),
};
