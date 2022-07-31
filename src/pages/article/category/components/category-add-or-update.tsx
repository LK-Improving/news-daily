import React, {
  forwardRef,
  MutableRefObject,
  Ref,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popover,
  Radio,
  Switch,
  Tree,
  TreeSelect,
} from 'antd';
import { useBoolean, useGetState, useMount } from 'ahooks';
import { articleCategoryApi, menuApi, roleApi } from '@/services/api';
import { RoleType } from '@/pages/sys/role';
import { treeDataTranslate } from '@/utils';
import { MenuType } from '@/pages/sys/menu';
import { API } from '@/services/typings';
import { CategoryType } from '@/pages/article/category';

export type event = { init: (id: number) => void };

interface ModelProps {
  event: MutableRefObject<event>;
  refreshDataList: Function;
}

const CategoryAddOrUpdate: React.FC<ModelProps> = (props) => {
  const [confirmLoading, { set: setConfirmLoading }] = useBoolean(false);

  const [visible, setVisible] = useState<boolean>(false);

  const [dataForm, setDataForm, getDataForm] = useGetState<{
    [P in keyof CategoryType]?: CategoryType[P];
  }>({
    catId: 0,
    catName: '',
    showStatus: 1,
  });

  const [form] = Form.useForm();

  // 初始化
  const init = async (id: number) => {
    setDataForm({ ...dataForm, catId: id | 0 });
    if (getDataForm().catId) {
      const res = (await articleCategoryApi.reqCategoryInfo(
        getDataForm().catId!,
      )) as API.ResultType & {
        articleCategory: CategoryType;
      };
      if (res && res.code === 0) {
        form.setFieldsValue({
          catId: res.articleCategory.catId,
          catName: res.articleCategory.catName,
          showStatus: res.articleCategory.showStatus,
        });
      }
    }
    setVisible(true);
  };

  useImperativeHandle(props.event, () => ({
    init,
  }));

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
    form.setFieldsValue({
      showStatus: checked ? 1 : 0,
    });
  };

  const onFinish = async (val: typeof dataForm) => {
    val['showStatus'] = val['showStatus'] ? 1 : 0;
    if (!val.catId) {
      setConfirmLoading(true);
      const res: any = await articleCategoryApi.reqCategorySave(val);
      setTimeout(() => {
        if (res && res.code === 0) {
          message.success({
            content: '添加成功',
            duration: 1,
            onClose: props.refreshDataList(),
          });
          handleCancel();
        } else {
          message.error(res.msg);
        }
        setConfirmLoading(false);
      }, 1000);
    } else {
      setConfirmLoading(true);
      const res: any = await articleCategoryApi.reqCategoryUpdate(val);
      setTimeout(() => {
        if (res && res.code === 0) {
          message.success({
            content: '修改成功',
            duration: 1,
            onClose: props.refreshDataList(),
          });
          handleCancel();
        } else {
          message.error(res.msg);
        }
        setConfirmLoading(false);
      }, 1000);
    }
  };

  // 取消操作
  const handleCancel = () => {
    setConfirmLoading(false);
    form.resetFields();
    setVisible(false);
  };

  return (
    <Modal
      title={dataForm.catId ? '修改' : '添加'}
      visible={visible}
      onCancel={handleCancel}
      footer={
        <Form.Item>
          <Button
            type="primary"
            loading={confirmLoading}
            onClick={form.submit}
            htmlType="submit"
          >
            确定
          </Button>
          <Button type="link" htmlType="button" onClick={handleCancel}>
            取消
          </Button>
        </Form.Item>
      }
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={dataForm}
      >
        <Form.Item name="catId" hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="分类名称"
          name="catName"
          rules={[{ required: true, message: '分类名称不嫩为空!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="显示状态" name="showStatus" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryAddOrUpdate;
