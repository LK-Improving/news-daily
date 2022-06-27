import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { reqSideBarMenu, reqUserInfo } from './services/api';
import { history } from 'umi';
import { loginPath } from '@/utils/http';
import { dynamic } from 'umi';

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
  collapsed?: boolean;
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

    const collapsed = false;

    return {
      currentUser,
      queryCurrentUser,
      collapsed,
    };
  }

  return {
    queryCurrentUser,
  };
}

type routeType = {
  path: string;
  title: string;
  exact: boolean;
  component?: any;
};

export async function render(oldRender: () => void) {
  const { menuList } = (await reqSideBarMenu()) as MenuResType;
  extraRoutes = menuList.map((item: API.menuType) => {
    return {
      path: `/${item.url}`,
      title: `${item.name}`,
      routes: item.list.map((item2: API.menuType) => {
        // isPathExist(item2.url)
        let value: routeType = {
          path: `/${item2.url}`,
          title: `${item2.name}`,
          exact: true,
        };
        // 动态加载组件
        value.component = dynamic({
          loader: () => import(`@/pages/${item2.url}`) || null,
        });
        // require('@/extraRoutes/foo').default  || null

        return value;
      }),
    };
  });
  oldRender();
}
let extraRoutes: object[] = [];

// 动态路由
export function patchRoutes({ routes }: any) {
  console.log(extraRoutes);
  routes[1].routes.splice(3, 0, ...extraRoutes);
}
