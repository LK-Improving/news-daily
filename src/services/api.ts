import { post, get } from '@/utils/http';
import { API } from '@/services/typings';

export const defaultApi = {
  // 登录
  login: (value: API.LoginParams) => post('/sys/login', value),

  // 登出
  logout: () => post('/sys/logout'),

  // 获取用户信息
  reqUserInfo: () => get('/sys/user/info'),

  // 修改密码
  updatePassword: (value: object) => post('/sys/user/password', value),

  // 获取侧边栏菜单
  reqSideBarMenu: () => get('/sys/menu/nav'),

  // 获取系统日志列表
  reqSysLogList: (value: object) => get('/sys/log/list', value),
};

// 菜单管理相关Api
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

// 角色管理相关Api
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

// 文章管理相关接口
export const articleApi = {
  // 获取管理员列表
  reqAuditList: (value: object) => get('/article/audit/list', value),

  // 获取管理员列表
  reqArticleList: (value: object) => get('/article/list', value),

  // 添加管理员
  reqArticleSave: (value: object) => post('/article/save', value),

  // 删除管理员
  reqArticleDel: (value: number[]) => post(`/article/delete`, value),

  // 修改管理员
  reqArticleUpdate: (value: object) => post('/article/update', value),

  // 获取管理员信息
  reqArticleInfo: (value: number) => get(`/article/info/${value}`),
};

// 文章分类相关接口
export const articleCategoryApi = {
  // 获取管理员列表
  reqCategoryList: (value: object) => get('/article/category/list', value),

  // 查询所有分类
  reqCategorySelect: () => get('/article/category/select'),

  // 添加管理员
  reqCategorySave: (value: object) => post('/article/category/save', value),

  // 删除管理员
  reqCategoryDel: (value: number[]) => post(`/article/category/delete`, value),

  // 修改管理员
  reqCategoryUpdate: (value: object) => post('/article/category/update', value),

  // 获取管理员信息
  reqCategoryInfo: (value: number) => get(`/article/category/info/${value}`),
};
