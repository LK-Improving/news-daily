import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { defaultApi } from './services/api';
import { history, dynamic } from 'umi';
import { API } from '@/services/typings';
import { layoutRoutes } from '../config/routes';
import { LOGIN_PATH } from '@/models/contant';
import React from 'react';
import Loading from '@/pages/loading';

type resUserInfoType = {
  user: API.UserInfoType;
} & API.ResultType;

type MenuResType = API.ResultType & {
  menuList: Array<API.menuType>;
  permissions: Array<object>;
};

export async function getInitialState(): Promise<{
  setting?: Partial<LayoutSettings>;
  currentUser?: API.UserInfoType;
  queryCurrentUser?: () => Promise<API.UserInfoType | undefined>;
}> {
  const queryCurrentUser = async () => {
    try {
      const data = (await defaultApi.reqUserInfo()) as resUserInfoType;
      return data.user;
    } catch (error) {
      history.push(LOGIN_PATH);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== LOGIN_PATH) {
    const currentUser = await queryCurrentUser();

    return {
      currentUser,
      queryCurrentUser,
    };
  }

  return {
    queryCurrentUser,
  };
}

// 路由类型
export type routeType = {
  path: string;
  title: string;
  exact: boolean;
  component?: Promise<Function>;
};
// 额外的理由
let extraRoutes: API.routeType[] = [];

// 定义全局变量表示是否已添加动态路由
// @ts-ignore
global.isAddDynamicMenuRoutes = false;

export async function onRouteChange({ routes }: any) {}

export async function render(oldRender: Function) {
  // 判断是否添加动态路由且当前路由部位登录页
  if (
    // @ts-ignore
    !global.isAddDynamicMenuRoutes &&
    history.location.pathname !== LOGIN_PATH
  ) {
    const { currentUser } = await getInitialState();
    if (currentUser) {
      const { code, menuList, permissions } =
        (await defaultApi.reqSideBarMenu()) as MenuResType;
      if (code !== undefined && code === 0) {
        fnAddDynamicMenuRoutes(menuList);
        // @ts-ignore
        global.isAddDynamicMenuRoutes = true;
        sessionStorage.setItem('menuList', JSON.stringify(menuList || '[]'));
        sessionStorage.setItem(
          'permissions',
          JSON.stringify(permissions || '[]'),
        );
      } else {
        sessionStorage.setItem('menuList', '[]');
        sessionStorage.setItem('permissions', '[]');
      }
    }
    setTimeout(oldRender(), 500);
  } else {
    oldRender();
  }
}

/**
 *
 * @param menuList 菜单列表
 * @param routes 涤葵创建的动态(菜单)路由
 */
const fnAddDynamicMenuRoutes = (
  menuList: API.menuType[],
  routes: API.routeType[] = [],
) => {
  let temp: API.menuType[] = [];
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list);
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '');
      var route: API.routeType = {
        path: `/${menuList[i].url}`,
        component: null,
        title: menuList[i].name,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          isDynamic: true,
        },
      };
      try {
        route['component'] = dynamic({
          loader: () => {
            let result = import(`@/pages/${menuList[i].url}`);
            return result
              .then((result) => {
                // 如果页面存在则正常返回页面路径
                return import(
                  /* webpackChunkName: "dynamic_component" */ `@/pages/${menuList[i].url}`
                );
              })
              .catch((e) => {
                // 页面不存在，默认返回temp页面
                return import(/* webpackChunkName: "temp" */ `@/pages/temp`);
              });
          },
          loading: Loading,
        });
      } catch (e) {}
      routes.push(route);
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes);
  } else {
    extraRoutes = routes;
    sessionStorage.setItem(
      'dynamicMenuRoutes',
      JSON.stringify(extraRoutes || '[]'),
    );
  }
};

// 动态路由
export function patchRoutes({ routes }: any, isReset = false) {
  console.log(routes);
  console.log(extraRoutes);
  if (isReset) {
    routes[1] = layoutRoutes;
  }

  if (extraRoutes.length > 0) {
    routes[1].routes.splice(3, 0, ...extraRoutes);
  }
}
