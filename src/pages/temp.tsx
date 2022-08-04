import React from 'react';
import { Button, Empty } from 'antd';
import { history } from '@@/core/history';

// 路由在导入页面未创建时使用的临时空白页
const Temp: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '600px' }}>
      <Empty
        style={{ margin: 'auto' }}
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={<span>页面施工中，请联系管理员</span>}
      >
        <Button type="primary" onClick={() => history.push('/home')}>
          返回首页
        </Button>
      </Empty>
    </div>
  );
};

export default Temp;
