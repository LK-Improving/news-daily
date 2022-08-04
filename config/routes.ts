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
  // redirect: '/home',
  exact: true,
  component: '@/layouts/DefaultLayout',
  routes: [
    {
      path: '/',
      redirect: 'home',
    },
    {
      name: 'home',
      title: '首页',
      path: 'home',
      component: '@/pages/home',
    },
    {
      component: '404',
      name: '404',
      title: '404未找到',
    },
  ],
};

export default defaultRoutes.concat(layoutRoutes);
