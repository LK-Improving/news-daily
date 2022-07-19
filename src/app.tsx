import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { reqSideBarMenu, reqUserInfo } from './services/api';
import { history, dynamic } from 'umi';
import { API } from '@/services/typings';
import { layoutRoutes } from '../config/routes';

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
      const data = (await reqUserInfo()) as resUserInfoType;
      return data.user;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
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
let extraRoutes: object[] = [];

const fnCurrentRouteType = (path: string, routes: routeType) => {
  console.log(path, routes);
};
// 定义全局变量表示是否已添加动态路由
// @ts-ignore
global.isAddDynamicMenuRoutes = false;
/*
 * todo
 *  问题描述： 首次渲染组件加载失败，登陆后进入主页先渲染而非修改路由
 * */
export async function onRouteChange({ routes }: any) {}

export async function render(oldRender: Function) {
  // 判断是否添加动态路由且当前路由部位登录页
  // @ts-ignore
  if (
    !global.isAddDynamicMenuRoutes &&
    history.location.pathname != '/user/login'
  ) {
    // @ts-ignore
    global.isAddDynamicMenuRoutes = true;
    const { menuList } = (await reqSideBarMenu()) as MenuResType;
    // 根据后端返回数据，创建额外路由结构
    extraRoutes = menuList.map((item: API.menuType) => {
      let route: API.routeType = {
        path: `/${item.url}`,
        title: `${item.name}`,
      };
      // 判断该菜单路由是否存在子路由
      if (item.list.length > 0) {
        route.routes = item.list.map((item2: API.menuType) => {
          let value: API.routeType = {
            path: `/${item2.url}`,
            title: `${item2.name}`,
            exact: true,
          };
          // 动态加载组件
          value.component = dynamic({
            loader: () => {
              let result = import(`@/pages/${item2.url}`);
              return result
                .then((res) => {
                  if (res) {
                    // 如果页面存在则正常返回页面路径
                    return import(`@/pages/${item2.url}`);
                  }
                })
                .catch((e) => {
                  if (e) {
                    // 页面不存在，默认返回404页面
                    return import(
                      /* webpackChunkName: 'p__temp' */ 'E:/Git_Repositories/news-daily/src/pages/temp'
                    );
                  }
                });
              // import(`@/pages/${item2.url}`) ||
              // return import(/* webpackChunkName: 'p__404' */'E:/Git_Repositories/news-daily/src/pages/404')
            },
          });
          // value.component = require('@/extraRoutes/foo').default  || null

          return value;
        });
      } else {
        route.name = 'foo';
        route.component = dynamic({
          loader: () => {
            let result = import(`@/pages/${item.url}`);
            return result
              .then((res) => {
                if (res) {
                  // 如果页面存在则正常返回页面路径
                  return import(`@/pages/${item.url}`);
                }
              })
              .catch((e) => {
                if (e) {
                  // 页面不存在，默认返回404页面
                  return import(
                    /* webpackChunkName: 'p__404' */ 'E:/Git_Repositories/news-daily/src/pages/temp'
                  );
                }
              });
            // import(`@/pages/${item2.url}`) ||
            // return import(/* webpackChunkName: 'p__404' */'E:/Git_Repositories/news-daily/src/pages/404')
          },
        });
      }

      return route;
    });
  }
  oldRender();
}

// 动态路由
export function patchRoutes({ routes }: any, isReset = false) {
  console.log(routes);
  if (isReset) {
    routes[1] = layoutRoutes;
  }
  if (extraRoutes.length > 0) {
    routes[1].routes.splice(3, 0, ...extraRoutes);
  }
  extraRoutes = [];
}
