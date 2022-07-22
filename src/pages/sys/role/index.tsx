import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { reqSysLogList, roleApi } from '@/services/api';
import { useBoolean, useMount, useUpdateEffect } from 'ahooks';
import Styles from './index.less';
import { PaginationConfig } from 'antd/es/pagination';
import RoleAddOrUpdate, {
  event,
} from '@/pages/sys/role/components/role-add-or-update';
import Login from '@/pages/user/login';

export interface RoleType {
  createTime: string;
  createUserId: number;
  menuIdList: Array<any>;
  remark: string;
  roleId: number;
  roleName: string;
}

const Role: React.FC = () => {
  const [addOrUpdateVisible, { set: setAddOrUpdateVisible }] =
    useBoolean(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: [10, 20, 50, 100],
  });
  const [form] = Form.useForm();

  const [roleList, setRoleList] = useState<Array<RoleType>>([]);

  let event = useRef({} as event);

  // 添加/修改
  const addOrUpdateHandle = async (id: number) => {
    await setAddOrUpdateVisible(true);
    event.current.init(id);
  };

  // 删除操作
  const deleteHandle = async (val: number[]) => {
    setLoading(true);
    const res = await roleApi.reqRoleDel(val);
    setTimeout(() => {
      if (res && res.code === 0) {
        message.success({
          content: '删除成功',
          duration: 1,
          onClose: getRoleList(),
        });
      } else {
        message.error(res.msg);
      }
      setLoading(false);
    }, 1000);
  };

  const cancel = () => {
    message.warning('您取消了操作！');
  };
  // 获取角色列表
  const getRoleList = async () => {
    let params = {
      page: 1,
      limit: 10,
      roleName: '',
    };
    const res = (await roleApi.reqRoleList(params)) as any;

    console.log(res);
    setRoleList(res.page.list);
  };

  // 提交表单
  const onFinish = async (values: {
    key?: string;
    limit?: number;
    page?: number;
  }) => {
    values['limit'] = pagination.pageSize;
    values['page'] = pagination.current;
    setLoading(true);
    const res = (await roleApi.reqRoleList(values)) as any;
    setRoleList(res.page.list);
    setPagination({
      current: res.page.currPage,
      pageSize: res.page.pageSize,
      total: res.page.totalCount,
    });
    setLoading(false);
  };

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination({
      current: page,
      pageSize,
    });
    form.submit();
  };

  useMount(() => {
    form.submit();
  });

  const columns: ColumnsType<RoleType> = [
    { title: 'ID', dataIndex: 'roleId', key: 'roleId' },
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
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
              addOrUpdateHandle(params.roleId);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title={`您确定要对[id = ${params.roleId}]进行删除操作码？`}
            onConfirm={() => {
              deleteHandle([params.roleId]);
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
      <Form
        name="basic"
        form={form}
        layout={'inline'}
        onFinish={onFinish}
        initialValues={{ roleName: '' }}
        autoComplete="off"
      >
        <Form.Item name="roleName">
          <Input placeholder={'角色名称'} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 2, span: 20 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              查询
            </Button>

            <Button
              type={'default'}
              onClick={() => {
                addOrUpdateHandle(0);
              }}
            >
              新增
            </Button>

            <Button
              danger={true}
              disabled={!hasSelected}
              loading={loading}
              onClick={() => {
                deleteHandle(
                  selectedRowKeys.map((item) => parseInt(item as string)),
                );
              }}
            >
              批量删除
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        rowKey={(record) => record.roleId!.toString()}
        bordered={true}
        rowSelection={rowSelection}
        loading={loading}
        dataSource={roleList}
        pagination={false}
        className={Styles.table}
        scroll={{ x: 800 }}
      />

      <Pagination
        total={pagination.total}
        onChange={handleTableChange}
        showSizeChanger
        showQuickJumper
        pageSizeOptions={pagination.pageSizeOptions}
        current={pagination.current}
        pageSize={pagination.pageSize}
        showTotal={(total) => `共 ${total} 条`}
        className={Styles.Pagination}
      />
      {addOrUpdateVisible ? (
        <RoleAddOrUpdate event={event} refreshDataList={getRoleList} />
      ) : null}
    </div>
  );
};

export default Role;
