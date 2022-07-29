const defaultRoutes: Array<React.ReactNode> = [
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
      redirect: 'dashboard',
    },
    {
      name: 'dashboard',
      title: '工作台',
      path: 'dashboard',
      component: '@/pages/dashboard',
    },
    {
      name: 'foo',
      title: 'foo',
      path: 'foo',
      component: '@/pages/foo',
    },
    {
      component: '404',
      name: '404',
      title: '404未找到',
    },
  ],
};

export default defaultRoutes.concat(layoutRoutes);
