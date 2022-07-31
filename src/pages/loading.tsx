import React from 'react';
import { Spin } from 'antd';

const Loading: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '600px' }}>
      <Spin style={{ margin: 'auto' }} size="large" />
    </div>
  );
};

export default Loading;
