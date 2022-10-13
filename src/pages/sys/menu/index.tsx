import React, { useRef, useState } from 'react';
import { Button, message, Popconfirm, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useBoolean, useMount } from 'ahooks';
import MenuAddOrUpdate, {
  event,
} from '@/pages/sys/menu/components/menu-add-or-update';
import Styles from './index.less';
import { treeDataTranslate } from '@/utils';
import { menuApi } from '@/services/api';
import { API } from '@/services/typings';

export interface MenuType {
  menuId?: number;
  icon?: string;
  list?: Array<MenuType>;
  name?: string;
  open?: string;
  orderNum?: number;
  parentId?: number;
  parentName?: string;
  perms?: any;
  type?: number;
  url?: string;
  children?: Array<MenuType>;
}

const Menu: React.FC = () => {
  const [addOrUpdateVisible, { set: setAddOrUpdateVisible }] =
    useBoolean(false);

  const [menuList, setMenuList] = useState<Array<MenuType>>([]);

  let event = useRef({} as event);

  // 添加/修改操作
  const addOrUpdateHandle = async (id: number) => {
    await setAddOrUpdateVisible(true);
    event.current.init(id);
  };

  // 删除操作
  const deleteHandle = async (val: number) => {
    const res = await menuApi.reqMenuDel(val);
    if (res && res.code === 0) {
      message.success({
        content: '删除成功',
        duration: 1,
        onClose: getMenuList(),
      });
      getMenuList();
    }
  };

  const cancel = () => {
    message.warning('您取消了操作！');
  };

  const getMenuList = async () => {
    const res = (await menuApi.reqMenuList()) as Array<MenuType>;
    if (res && res.length >= 1) {
      const tempList = res.filter((item) => item.type !== 2);
      setMenuList(treeDataTranslate(tempList, 'menuId'));
    }
  };

  useMount(() => {
    getMenuList();
  });

  const columns: ColumnsType<MenuType> = [
    { title: '名称', width: 130, dataIndex: 'name', key: 'name' },
    {
      title: '上级菜单',
      align: 'center',
      width: 130,
      dataIndex: 'parentName',
      key: 'parentName',
    },
    { title: '图标', width: 80, dataIndex: 'icon', key: 'icon' },
    {
      title: '类型',
      width: 90,
      align: 'center',
      dataIndex: 'type',
      key: 'type',
      render: (params) => (
        <Tag color={params === 0 ? 'blue' : params === 1 ? 'green' : 'default'}>
          {params === 0 ? '目录' : params === 1 ? '菜单' : '按钮'}
        </Tag>
      ),
    },
    {
      title: '排序号',
      width: 80,
      align: 'center',
      dataIndex: 'orderNum',
      key: 'orderNum',
    },
    {
      title: '菜单URL',
      width: 150,
      align: 'center',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '操作',
      dataIndex: '',
      width: 130,
      align: 'center',
      fixed: 'right',
      key: 'menuId',
      render: (params) => (
        <Space>
          <a
            onClick={() => {
              addOrUpdateHandle(params.menuId);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title={`您确定要对[id = ${params.menuId}]进行删除操作码？`}
            onConfirm={() => {
              deleteHandle(params.menuId);
            }}
            onCancel={cancel}
            okText="删除"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={Styles.container}>
      <Button
        type={'primary'}
        onClick={() => {
          addOrUpdateHandle(0);
        }}
      >
        新增
      </Button>
      <Table
        columns={columns}
        rowKey={(record) => record.menuId!.toString()}
        bordered={true}
        dataSource={menuList}
        pagination={false}
        className={Styles.table}
      />
      {addOrUpdateVisible ? (
        <MenuAddOrUpdate event={event} refreshDataList={getMenuList} />
      ) : null}
    </div>
  );
};

export default Menu;
