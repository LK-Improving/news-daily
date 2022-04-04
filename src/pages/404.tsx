import React from 'react';
import { Result, Button } from 'antd';

const notFound: React.FC = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="不好意思，您访问的页面不存在.."
      extra={<Button type="primary">Back Home</Button>}
    />
  );
};

export default notFound;
