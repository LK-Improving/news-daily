import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import { useDispatch, useSelector } from '@@/plugin-dva/exports';
import { history } from 'umi';
import { API } from '@/services/typings';
import { useModel } from '@@/plugin-model/useModel';
import { useMount } from 'ahooks';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

type PropsType = {
  routes: Array<API.routeType>;
};

const SideBar: React.FC<PropsType> = (props) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const dispatch = useDispatch();

  const menu = useSelector(
    ({
      menu,
    }: {
      menu: {
        collapsed: boolean;
        defaultOpenKeys: [];
        menuList: API.menuType[];
      };
    }) => menu,
  );

  // 获取子菜单
  const getSubMenu = (
    menuList: API.menuType[] = [],
    itemList: MenuItem[] = [],
  ): any => {
    for (let i = 0; i < menuList.length; i++) {
      if (menuList[i].list && menuList[i].list.length >= 1) {
        itemList.push(
          getItem(
            menuList[i].name,
            menuList[i].menuId,
            <DesktopOutlined />,
            getSubMenu(menuList[i].list),
          ),
        );
      } else {
        itemList.push(
          getItem(
            menuList[i].name,
            `/${menuList[i].url.replace(/^\//, '')}`,
            <DesktopOutlined />,
          ),
        );
      }
    }
    return itemList;
  };

  const items: MenuItem[] = [
    getItem('工作台', '/home', <DesktopOutlined />),
  ].concat(
    menu.menuList.map((item, index) => {
      if (item.list.length >= 1) {
        return getItem(
          item.name,
          item.menuId,
          <DesktopOutlined />,
          getSubMenu(item.list),
        );
      } else {
        return getItem(
          item.name,
          `/${item.url.replace(/^\//, '')}`,
          <DesktopOutlined />,
        );
      }
    }),
  );
  //   props.routes[1].routes!.map((value, index) => {
  //   if (index > 0 && index  < props.routes[1].routes!.length - 1){
  //     if (value.routes !== undefined ) {
  //       return  getItem(value.title, index, <DesktopOutlined />, value.routes.map(value1 => {
  //         return getItem(value1.title, value1.path)
  //       }))
  //     }
  //     else {
  //       return  getItem(value.title, value.path, <DesktopOutlined />)
  //     }
  //   }
  //     return null
  // })

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key !== history.location.pathname) {
      console.log('click ', e);
      console.log(menu.defaultOpenKeys);
      console.log(props.routes);
      dispatch({
        type: 'menu/setDefaultOpenKeys',
        payload: e.keyPath,
      });
      history.push(e.key);
    }
  };

  return (
    <div style={menu.collapsed ? {} : { width: 210 }}>
      <div className={styles.logo}>
        <div className={styles.img}>logo</div>
      </div>
      <Menu
        defaultSelectedKeys={[history.location.pathname]}
        selectedKeys={[history.location.pathname]}
        defaultOpenKeys={menu.defaultOpenKeys}
        mode="inline"
        theme="light"
        onClick={onClick}
        inlineCollapsed={menu.collapsed}
        items={items}
      />
    </div>
  );
};

export default SideBar;
