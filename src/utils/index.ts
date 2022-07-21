import { removeCookie } from '@/utils/cookie';
import { patchRoutes } from '@/app';
import { history } from 'umi';

const routes = require('/config/routes').default;

/**
 * 获取uuid
 */
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    return (
      c === 'x' ? (Math.random() * 16) | 0 : (<any>'r&0x3') | (<any>'0x8')
    ).toString(16);
  });
}

/**
 * 树形结构转换
 * @param data
 * @param id
 * @param pid
 */
export function treeDataTranslate(data: any[], id = 'id', pid = 'parentId') {
  var res = [];
  var temp: any = {};
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i];
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = [];
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1;
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1;
      temp[data[k][pid]]['children'].push(data[k]);
    } else {
      res.push(data[k]);
    }
  }
  return res;
}

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
  patchRoutes({ routes }, true);
  removeCookie('token');
  // @ts-ignore
  global.isAddDynamicMenuRoutes = false;
  history.push({
    pathname: '/user/login',
  });
}
