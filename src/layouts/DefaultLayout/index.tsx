import React from 'react';
import styles from './index.less';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import SideBar from '@/components/SideBar';
import Header from '@/components/Header';
import RightContent from '@/components/RightContent';
import { useMount } from 'ahooks';
import { patchRoutes, render } from '@/app';
import { history } from 'umi';

export type RouteProps = {
  children: React.ReactElement;
  route: {
    exact: true;
    component: {};
    routes: Array<any>;
  };
  routes: Array<any>;
};

const DefaultLayout: React.FC<RouteProps> = (props) => {
  useMount(async () => {
    console.log(props);
    render(() => {});
    // await patchRoutes({routes:props.routes})
  });
  return (
    <div className={styles.container}>
      <div className={styles.sideBar}>
        <SideBar routes={props.routes} />
      </div>
      <div className={styles.body}>
        <div className={styles.header}>
          <Header routes={props.routes} />
        </div>
        <div className={styles.rightContent}>
          <ConfigProvider locale={zhCN}>
            <RightContent children={props.children} />
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
