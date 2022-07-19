import React from 'react';
import { history } from 'umi';
import { Button } from 'antd';
import styles from './index.less';
import { removeCookie } from '@/utils/cookie';

const dashboard: React.FC = () => {
  return (
    <div>
      <Button
        onClick={() => {
          removeCookie('token');
          history.push({
            pathname: '/user/login',
            query: { redirect: history.location.pathname },
          });
        }}
      >
        退出登录
      </Button>
      dashboard
    </div>
  );
};
export default dashboard;
