import React from 'react';
import { history } from 'umi';
import { Button } from 'antd';
import styles from './index.less';

const dashboard: React.FC = () => {
  return (
    <div>
      <Button
        onClick={() => {
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
