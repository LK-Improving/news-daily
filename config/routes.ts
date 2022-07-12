import { API } from '@/services/typings';

const defaultRoutes: Array<object> = [
  {
    path: 'user',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: '@/pages/user/login',
        title: '后台登录',
      },
      {
        component: '404',
        name: '404',
        title: '404未找到',
      },
    ],
  },
];

export const layoutRoutes = {
  // path: '/',
  // redirect: '/dashboard',
  exact: true,
  component: '@/layouts/DefaultLayout',
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      name: 'dashboard',
      title: '工作台',
      path: '/dashboard',
      component: '@/pages/dashboard',
    },
    {
      name: 'foo',
      title: 'foo',
      path: '/foo',
      component: '@/pages/foo',
    },
    // {
    //   path: '/sys',
    //   title: '系统管理',
    //   routes: [
    //     // { path: '/sys/user', title: '管理员列表', component: '@/pages/sys/user'  },
    //     // { path: '/sys/role', title: '角色管理', component: '@/pages/sys/role'},
    //     // { path: '/sys/menu', title: '菜单管理', component: '@/pages/sys/menu'  },
    //     { path: '/sys/log', title: '系统日志', component: '@/pages/sys/log' },
    //   ],
    // },
    {
      component: '404',
      name: '404',
      title: '404未找到',
    },
  ],
};

export default defaultRoutes.concat(layoutRoutes);
