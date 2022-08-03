import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tooltip,
} from 'antd';
import { useMount } from 'ahooks';
import { articleApi, articleCategoryApi, defaultApi } from '@/services/api';
import { PaginationConfig } from 'antd/es/pagination';
import { Tabs, Image } from 'antd';
import { API } from '@/services/typings';
import Styles from './index.less';
import { ColumnsType } from 'antd/es/table';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons/lib';

interface DataType {
  articleId: number;
  authorId: number;
  catName: string;
  content: string;
  coverList: [];
  createTime: string;
  isAudit: number;
  publishTime: string;
  readCount: number;
  tag: number;
  title: string;
  user: number;
  userId: number;
}

interface CategoryType {
  catId: Number;
  catName: string;
  createTime: string;
  modifyTime: string;
  showStatus: number;
}

const { TabPane } = Tabs;

const Audit: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [visibleValue, setVisibleValue] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: [10, 20, 50, 100],
  });
  const [form] = Form.useForm();

  const columns: ColumnsType<DataType> = [
    {
      title: '文章ID',
      dataIndex: 'articleId',
      key: 'articleId',
    },
    {
      title: '用户ID',
      dataIndex: 'authorId',
      key: 'authorId',
    },
    {
      title: '分类',
      dataIndex: 'catName',
      key: 'catName',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
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
      title: '内容',
      dataIndex: 'content',
      key: 'content',
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
      title: '封面',
      dataIndex: '',
      width: 280,
      key: 'articleId',
      render: (params) =>
        params.coverList.length >= 1 ? (
          <div>
            <Image
              preview={{ visible: false }}
              width={200}
              src={params.coverList[0].imgUrl}
              onClick={() => setVisibleValue(params.articleId)}
            />
            <div style={{ display: 'none' }}>
              <Image.PreviewGroup
                preview={{
                  visible: visibleValue === params.articleId,
                  onVisibleChange: (vis) => setVisibleValue(0),
                }}
              >
                {params.coverList.map((item: any) => {
                  return <Image key={item.id} width={200} src={item.imgUrl} />;
                })}
              </Image.PreviewGroup>
            </div>
          </div>
        ) : (
          '暂无'
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
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
          <Tooltip title="审核通过">
            <Button
              type="default"
              shape="circle"
              icon={<CheckOutlined />}
              onClick={() => {
                Modal.confirm({
                  content: `您确定要对[id = ${params.articleId}]的文章进行审核通过操作吗？`,
                  title: '提示',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () => {
                    audit(params.articleId, 1);
                  },
                  onCancel: cancel,
                });
              }}
            />
          </Tooltip>
          <Tooltip title="审核不通过">
            <Button
              type="primary"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => {
                Modal.confirm({
                  content: `您确定要对[id = ${params.articleId}]的文章进行审核不通过操作吗？`,
                  title: '提示',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () => {
                    audit(params.articleId, 2);
                  },
                  onCancel: cancel,
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  useMount(() => {
    form.submit();
  });

  const audit = async (articleId: number, isAudit: number) => {
    const res = await articleApi.reqArticleUpdate({ articleId, isAudit });
    if (res && res.code === 0) {
      message.success({
        content: '操作成功',
        duration: 1,
        onClose: form.submit(),
      });
    } else {
      message.error(res.msg);
    }
  };

  const cancel = () => {
    message.warning('您取消了操作！');
  };

  const getCategoryList = async () => {
    const res =
      (await articleCategoryApi.reqCategorySelect()) as API.ResultType & {
        categoryList: Array<any>;
      };
    setCategoryList(res.categoryList);
    console.log(res);
  };

  const onFinish = async (values: {
    title?: string;
    limit?: number;
    page?: number;
  }) => {
    if (!loading) {
      values['limit'] = pagination.pageSize;
      values['page'] = pagination.current;
      setLoading(true);
      const res = (await articleApi.reqAuditList(values)) as API.ResultType & {
        page: {
          currPage: number;
          list: DataType[];
          pageSize: number;
          totalCount: number;
          totalPage: number;
        };
      };
      if (res && res.code === 0) {
        setData(res.page.list);
        setPagination({
          current: res.page.currPage,
          pageSize: res.page.pageSize,
          total: res.page.totalCount,
        });
        setLoading(false);
      }
    }
  };

  useMount(() => {
    form.submit();
    getCategoryList();
  });

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
        initialValues={{ catId: 0, title: '' }}
        autoComplete="off"
      >
        <Form.Item name="catId" hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item name="title">
          <Input placeholder={'文章标题'} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            查询
          </Button>
        </Form.Item>
      </Form>

      <Tabs
        defaultActiveKey="0"
        style={{ height: 220 }}
        onTabClick={(key) => {
          form.setFieldsValue({
            catId: key,
          });
          form.submit();
        }}
      >
        <TabPane tab="全部" key="0">
          <Table
            columns={columns}
            rowKey={(record) => record.articleId}
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
        </TabPane>
        {categoryList.length >= 1
          ? categoryList.map((item) => (
              <TabPane tab={item.catName} key={item.catId.toString()}>
                <Table
                  columns={columns}
                  rowKey={(record) => record.articleId}
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
              </TabPane>
            ))
          : null}
      </Tabs>
    </div>
  );
};

export default Audit;
