import { defineConfig } from 'umi';
import routes from './config/routes';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  theme: {
    // 春梅红
    'primary-color': '#e98e97',
  },
  fastRefresh: {},
});
