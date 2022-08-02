import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useMount } from 'ahooks';
import { articleApi, articleCategoryApi, defaultApi } from '@/services/api';
import { PaginationConfig } from 'antd/es/pagination';
import { Tabs } from 'antd';
import { API } from '@/services/typings';

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
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: [10, 20, 50, 100],
  });
  const [form] = Form.useForm();
  useMount(() => {
    form.submit();
  });

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
      const res = (await articleApi.reqArticleList(
        values,
      )) as API.ResultType & {
        article: DataType;
      };
      if (res && res.code === 0) {
        console.log(res);
        // setData(res.page.list);
        // setPagination({
        //   current: res.page.currPage,
        //   pageSize: res.page.pageSize,
        //   total: res.page.totalCount,
        // });
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
    <div>
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
          message.success(key);
          form.setFieldsValue({
            catId: key,
          });
          form.submit();
        }}
      >
        <TabPane tab="全部" key="0">
          全部
        </TabPane>
        {categoryList.length >= 1
          ? categoryList.map((item) => (
              <TabPane tab={item.catName} key={item.catId.toString()}>
                {item.catName}
              </TabPane>
            ))
          : null}
      </Tabs>
    </div>
  );
};

export default Audit;
