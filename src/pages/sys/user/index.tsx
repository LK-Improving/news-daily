import React, { useState } from 'react';
import { Button, Form, Input, Pagination, Table, Tooltip } from 'antd';
import { reqSysLogList } from '@/services/api';
import { ColumnsType } from 'antd/es/table';
import { API } from '@/services/typings';
import { useMount } from 'ahooks';
import { PaginationConfig } from 'antd/es/pagination';
import Styles from './index.less';

interface DataType {
  createDate: string;
  id: number;
  ip: string;
  method: string;
  operation: string;
  params: string;
  time: number;
  username: string;
}

type sysLogResType = {
  page: {
    currPage: number;
    list: Array<DataType>;
    pageSize: number;
    totalCount: number;
    totalPage: number;
  };
} & API.ResultType;

const Log: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: [10, 20, 50, 100],
  });
  const [form] = Form.useForm();

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户操作',
      dataIndex: 'operation',
      key: 'operation',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      ellipsis: {
        showTitle: false,
      },
      render: (params) => (
        <Tooltip placement="topLeft" title={params}>
          {params}
        </Tooltip>
      ),
    },
    {
      title: '请求参数',
      dataIndex: 'params',
      key: 'params',
      ellipsis: {
        showTitle: false,
      },
      render: (params) => (
        <Tooltip placement="topLeft" title={params}>
          {params}
        </Tooltip>
      ),
    },
    {
      title: '执行时长（毫秒）',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      // render: text => <a>{text}</a>,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
    },
  ];

  useMount(() => {
    form.submit();
  });

  const onFinish = async (values: {
    key?: string;
    limit?: number;
    page?: number;
  }) => {
    values['limit'] = pagination.pageSize;
    values['page'] = pagination.current;
    setLoading(true);
    const res = (await reqSysLogList(values)) as sysLogResType;
    setData(res.page.list);
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

  return (
    <div className={Styles.container}>
      <Form
        name="basic"
        form={form}
        layout={'inline'}
        onFinish={onFinish}
        initialValues={{ key: '' }}
        autoComplete="off"
      >
        <Form.Item name="key">
          <Input placeholder={'用户名 / 用户操作'} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            查询
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        loading={loading}
        pagination={false}
        className={Styles.table}
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
    </div>
  );
};

export default Log;
