import { EffectsCommandMap, SubscriptionAPI } from 'dva';
import { AnyAction } from 'redux';
import { API } from '@/services/typings';
import { LOGIN_PATH } from '@/models/contant';

type MenuResType = API.ResultType & {
  menuList: Array<API.menuType>;
  permissions: Array<object>;
};

// 侧柏栏
export default {
  state: {
    // 侧柏栏 菜单
    defaultOpenKeys: sessionStorage.getItem('defaultOpenKeys')
      ? JSON.parse(<string>sessionStorage.getItem('defaultOpenKeys'))
      : [],

    menuList: JSON.parse(<string>sessionStorage.getItem('menuList')) || [],

    // 侧边栏, 折叠状态
    collapsed: false,
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
      // history.listen((({pathname}) => {
      //   if (pathname !== LOGIN_PATH)
      //     console.log(JSON.parse(sessionStorage.getItem('menuList')!))
      //   dispatch({
      //     type: "queryMenu",
      //     payload: true
      //   })
      // }))
    },
  },

  effects: {
    *queryMenu(
      { payload }: AnyAction,
      { call, put, select }: EffectsCommandMap,
    ) {},
  },

  reducers: {
    resetStore() {
      return {
        // 侧柏栏 菜单
        defaultOpenKeys: [],

        menuList: [],

        // 侧边栏, 折叠状态
        collapsed: false,
      };
    },
    setMenuList(state: AnyAction, { payload }: AnyAction) {
      location.reload();
      console.log(payload);
      return {
        ...state,
        menuList: payload,
      };
    },
    setDefaultOpenKeys(state: AnyAction, { payload }: AnyAction) {
      console.log(payload);
      sessionStorage.setItem('defaultOpenKeys', JSON.stringify(payload));
      return {
        ...state,
        defaultOpenKeys: payload,
      };
    },

    setCollapsed(state: AnyAction) {
      return {
        ...state,
        collapsed: !state.collapsed,
      };
    },
  },
};
