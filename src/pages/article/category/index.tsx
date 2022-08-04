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
import { articleCategoryApi, roleApi } from '@/services/api';
import { useBoolean, useMount } from 'ahooks';
import Styles from './index.less';
import { PaginationConfig } from 'antd/es/pagination';
import CategoryAddOrUpdate, {
  event,
} from '@/pages/article/category/components/category-add-or-update';
import { API } from '@/services/typings';

const Category: React.FC = () => {
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

  const [categoryList, setCategoryList] = useState<Array<API.CategoryType>>([]);

  let event = useRef({} as event);

  // 添加/修改
  const addOrUpdateHandle = async (id: number) => {
    await setAddOrUpdateVisible(true);
    event.current.init(id);
  };

  // 删除操作
  const deleteHandle = async (val: number[]) => {
    setLoading(true);
    const res = await articleCategoryApi.reqCategoryDel(val);
    setTimeout(() => {
      if (res && res.code === 0) {
        message.success({
          content: '删除成功',
          duration: 1,
          onClose: form.submit(),
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

  // 提交表单
  const onFinish = async (values: {
    key?: string;
    limit?: number;
    page?: number;
  }) => {
    values['limit'] = pagination.pageSize;
    values['page'] = pagination.current;
    setLoading(true);
    const res = (await articleCategoryApi.reqCategoryList(values)) as any;
    setCategoryList(res.page.list);
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

  const columns: ColumnsType<API.CategoryType> = [
    { title: 'ID', dataIndex: 'catId', key: 'catId' },
    { title: '分类名称', dataIndex: 'catName', key: 'catName' },
    {
      title: '显示状态',
      dataIndex: 'showStatus',
      key: 'showStatus',
      render: (params) => (
        <Tag color={params === 1 ? 'green' : 'default'}>
          {params === 1 ? '显示' : '隐藏'}
        </Tag>
      ),
    },
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
              addOrUpdateHandle(params.catId);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title={`您确定要对[id = ${params.catId}]进行删除操作码？`}
            onConfirm={() => {
              deleteHandle([params.catId]);
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
        initialValues={{ catName: '' }}
        autoComplete="off"
      >
        <Form.Item name="catName">
          <Input placeholder={'分类名称'} />
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
        rowKey={(record) => record.catId!.toString()}
        bordered={true}
        rowSelection={rowSelection}
        loading={loading}
        dataSource={categoryList}
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
        <CategoryAddOrUpdate event={event} refreshDataList={form.submit} />
      ) : null}
    </div>
  );
};

export default Category;
