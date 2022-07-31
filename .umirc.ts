import { defineConfig } from 'umi';
import routes from './config/routes';

export default defineConfig({
  mfsu: {},
  nodeModulesTransform: {
    type: 'none',
  },
  routes: routes,
  theme: {
    // 春梅红
    'primary-color': '#e98e97',
  },
  // define: {
  //   loginPath: '/user/login',
  // },
  fastRefresh: {},
  dynamicImport: {
    loading: '@/pages/loading',
  },
});
