import { defineConfig } from 'umi';
import routes from './routes';
import defaultSettings from './defaultSettings';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // // antdPro配置
  // layout: {
  //   ...defaultSettings,
  // },
  routes: routes,
  fastRefresh: {},
  mfsu: {},
});
