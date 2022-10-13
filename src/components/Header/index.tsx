import React, { useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';
import { Avatar, Button, Dropdown, Menu, Modal } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons/lib';
import styles from './index.less';
import { useBoolean, useMount } from 'ahooks';
import FormModal from '@/components/FormModal';
import { getDvaApp, useDispatch, useSelector } from '@@/plugin-dva/exports';
import { history } from 'umi';
import { API } from '@/services/typings';
import { clearLoginInfo } from '@/utils';
import { defaultApi } from '@/services/api';
import { LOGIN_PATH } from '@/models/contant';

type PropsType = {
  routes: Array<API.routeType>;
};

const Header: React.FC<PropsType> = (props) => {
  const { initialState } = useModel('@@initialState');

  const [visible, { set: setVisible }] = useBoolean(false);

  const { collapsed, menuList } = useSelector(
    ({ menu }: { menu: { collapsed: boolean; menuList: [] } }) => menu,
  );
  const dispatch = useDispatch();
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <span
              onClick={() => {
                showModal();
              }}
            >
              修改密码
            </span>
          ),
        },
        {
          key: '2',
          label: (
            <span
              onClick={() => {
                logout();
              }}
            >
              登出
            </span>
          ),
        },
      ]}
    />
  );

  // 登出
  const logout = () => {
    Modal.confirm({
      content: `确定进行[退出]操作?`,
      title: '提示',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await defaultApi.logout();
        if (res && res.code === 0) {
          clearLoginInfo();
        }
      },
    });
  };

  // 侧边菜单是否缩放
  const toggleCollapsed = () => {
    dispatch({
      type: 'menu/setCollapsed',
    });
  };

  const showModal = () => {
    // @ts-ignore
    setVisible(true);
  };

  return (
    <div className={styles.container}>
      <Button type="primary" onClick={toggleCollapsed}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <div>
        <Dropdown overlay={menu} placement="bottom" arrow>
          <div>
            <Avatar
              style={{ backgroundColor: '#e98e97' }}
              icon={<UserOutlined />}
            />
            &nbsp;
            {initialState?.currentUser?.username}
          </div>
        </Dropdown>
      </div>
      <FormModal
        title={'修改密码'}
        visible={visible}
        setVisible={setVisible}
        username={initialState?.currentUser?.username}
      />
    </div>
  );
};

export default Header;
