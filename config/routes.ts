export default [
  {
    path: '/',
    component: '@/pages/dashboard',
    redirect: '/dashboard',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        icon: 'smile',
        path: '/user/login',
        component: '@/pages/user/Login',
      },
    ],
  },
  {
    name: 'dashboard',
    icon: 'smile',
    path: '/dashboard',
    component: '@/pages/dashboard',
  },
];
