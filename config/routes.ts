export const defaultRoutes = [
  {
    path: '/user',
    routes: [
      {
        name: 'login',
        icon: 'smile',
        path: '/user/login',
        component: '@/pages/user/Login',
      },
      {
        component: '404',
      },
    ],
  },
];

const layoutRoutes = [
  {
    exact: true,
    component: '@/layouts/DefaultLayout',
    routes: [
      {
        path: '/',
        redirect: '/dashboard',
      },
      {
        name: 'dashboard',
        icon: 'smile',
        path: '/dashboard',
        component: '@/pages/dashboard',
      },
      {
        name: 'foo',
        icon: 'smile',
        path: '/foo',
        component: '@/pages/foo',
      },
      {
        component: '404',
      },
    ],
  },
];

export default defaultRoutes.concat(layoutRoutes);
