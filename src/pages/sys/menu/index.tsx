import React, { useState } from 'react';
import { Button, message, Popconfirm, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { reqMenuDel, reqMenuList } from '@/services/api';
import { useMount } from 'ahooks';
import MenuAddOrUpdate from '@/pages/sys/menu/components/menu-add-or-update';
import Styles from './index.less';
import { treeDataTranslate } from '@/utils';

export interface DataType {
  menuId?: number;
  icon?: string;
  list?: Array<DataType>;
  name?: string;
  open?: string;
  orderNum?: number;
  parentId?: number;
  parentName?: string;
  perms?: any;
  type?: number;
  url?: string;
  children?: Array<DataType>;
}

const menu: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const [dataForm, setDataForm] = useState<DataType>({
    icon: '',
    name: '',
    orderNum: 0,
    parentId: 0,
    type: 1,
    url: '',
  });

  const [menuList, setMenuList] = useState<Array<DataType>>([]);

  const confirm = async (val: number) => {
    const res = await reqMenuDel(val);
    if (res && res.code === 0) {
      message.success('删除成功！');
      getMenuList();
    }
  };

  const cancel = () => {
    message.warning('您取消了操作！');
  };

  const getMenuList = async () => {
    const res = (await reqMenuList()) as Array<DataType>;
    const tempList = res.filter((item) => item.type !== 2);
    console.log(tempList);
    setMenuList(treeDataTranslate(tempList, 'menuId'));
  };

  useMount(() => {
    getMenuList();
  });

  const columns: ColumnsType<DataType> = [
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
              setDataForm(params);
              setVisible(true);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title={`您确定要对[id = ${params.menuId}]进行删除操作码？`}
            onConfirm={() => {
              confirm(params.menuId);
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
          setVisible(true);
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
      {visible ? (
        <MenuAddOrUpdate
          dataForm={dataForm}
          setDataForm={setDataForm}
          visible={visible}
          setVisible={setVisible}
          menuList={menuList}
          getMenuList={getMenuList}
        />
      ) : null}
    </div>
  );
};

export default menu;
