import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起，您访问的页面不存在！"
    extra={
      <Button type="primary" onClick={() => history.push('/home')}>
        返回首页
      </Button>
    }
  />
);

export default NoFoundPage;
