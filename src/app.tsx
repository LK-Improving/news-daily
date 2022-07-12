import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { reqSideBarMenu, reqUserInfo } from './services/api';
import { history, dynamic } from 'umi';
import { loginPath } from '@/utils/http';
import { API } from '@/services/typings';

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
  defaultOpenKeys?: string[];
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

    const defaultOpenKeys = [''];

    return {
      currentUser,
      queryCurrentUser,
      defaultOpenKeys,
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

export async function render(oldRender: () => void) {
  if (history.location.pathname != '/user/login') {
    const { menuList } = (await reqSideBarMenu()) as MenuResType;
    // 根据后端返回数据，创建额外路由结构
    extraRoutes = menuList.map((item: API.menuType) => {
      return {
        path: `/${item.url}`,
        title: `${item.name}`,
        routes: item.list.map((item2: API.menuType) => {
          let value: routeType = {
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
                  // 如果页面存在则正常返回页面路径
                  return import(`@/pages/${item2.url}`);
                })
                .catch((e) => {
                  // 页面不存在，默认返回404页面
                  return import(
                    /* webpackChunkName: 'p__404' */ 'E:/Git_Repositories/news-daily/src/pages/404'
                  );
                });
              // import(`@/pages/${item2.url}`) ||
              // return import(/* webpackChunkName: 'p__404' */'E:/Git_Repositories/news-daily/src/pages/404')
            },
          });
          // value.component = require('@/extraRoutes/foo').default  || null

          return value;
        }),
      };
    });
  }
  oldRender();
}

// 动态路由
export function patchRoutes({ routes }: any) {
  if (extraRoutes.length > 0) {
    console.log(extraRoutes);
    routes[1].routes.splice(3, 0, ...extraRoutes);
  }
}
