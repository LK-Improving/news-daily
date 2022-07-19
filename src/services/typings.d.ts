import React from 'react';

declare namespace API {
  // 登录传参
  type LoginParams = {
    username?: string;
    password?: string;
    uuid?: string;
    remember?: boolean;
    captcha?: string;
  };
  // 返回类型
  type ResultType = {
    code?: number;
    msg?: string;
  };
  // 路由
  type routeType = {
    component?: Promise<React.FC> | string;
    exact?: boolean;
    name?: string;
    path: string;
    title?: string;
    routes?: Array<routeType>;
  };
  // 管理员信息
  type UserInfoType = {
    createTime: string;
    createUserId: number;
    email: string;
    mobile: string;
    password: string;
    roleIdList: null | string;
    salt: string;
    status: number;
    userId: number;
    username: string;
  };
  // 菜单信息
  type menuType = {
    icon: string;
    list: Array<menuType>;
    menuId: number;
    name: string;
    open?: string;
    orderNum: number;
    parentId: number;
    parentName?: string;
    perms?: string;
    type: number;
    url: string;
  };
}
