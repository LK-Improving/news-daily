import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popover,
  Radio,
  TreeSelect,
} from 'antd';
import { useBoolean, useMount } from 'ahooks';
import { reqMenuSave, reqMenuUpdate } from '@/services/api';
import { MenuType } from '@/pages/sys/menu';

interface ModelProps {
  dataForm: MenuType;
  visible: boolean;
  setVisible: Function;
  setDataForm: Function;
  item?: object;
  menuList?: Array<any>;
  getMenuList: Function;
}

const MenuAddOrUpdate: React.FC<ModelProps> = (props) => {
  const [confirmLoading, { set: setConfirmLoading }] = useBoolean(false);
  const [type, setType] = useState<number>(props.dataForm.type!);
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
    props.setDataForm({
      icon: '',
      name: '',
      orderNum: 0,
      parentId: 0,
      type: 1,
      url: '',
    });
  };

  const onFinish = async (val: any) => {
    if (val.menuId === undefined) {
      setConfirmLoading(true);
      const res: any = await reqMenuSave(val);
      setTimeout(() => {
        if (res && res.code === 0) {
          message.success({
            content: '添加成功',
            duration: 1,
            onClose: props.getMenuList(),
          });
          handleCancel();
        } else {
          message.error(res.msg);
        }
        setConfirmLoading(false);
      }, 1000);
    } else {
      setConfirmLoading(true);
      const res: any = await reqMenuUpdate(val);
      setTimeout(() => {
        if (res && res.code === 0) {
          message.success({
            content: '修改成功',
            duration: 1,
            onClose: props.getMenuList(),
          });
          handleCancel();
        } else {
          message.error(res.msg);
        }
        setConfirmLoading(false);
      }, 1000);
    }
  };

  const handleCancel = () => {
    props.setVisible(false);
    setConfirmLoading(false);
    onReset();
  };

  return (
    <Modal
      title={props.dataForm.menuId ? '修改' : '添加'}
      visible={props.visible}
      onCancel={handleCancel}
      footer={
        <Form.Item>
          <Button
            type="primary"
            loading={confirmLoading}
            onClick={form.submit}
            htmlType="submit"
          >
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={handleCancel}>
            取消
          </Button>
        </Form.Item>
      }
      confirmLoading={confirmLoading}
    >
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={props.dataForm}
      >
        <Form.Item name="menuId" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item label="类型" name="type">
          <Radio.Group
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <Radio value={0}>目录</Radio>
            <Radio value={1}>菜单</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="菜单名称"
          name="name"
          rules={[{ required: true, message: '菜单名称不嫩为空!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="上级菜单"
          name="parentId"
          rules={[{ required: true, message: '上级菜单不能为空!' }]}
        >
          <TreeSelect
            style={{ width: '100%' }}
            // value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={[
              {
                name: '一级菜单',
                menuId: '0',
                children: props.menuList,
              },
            ]}
            placeholder="Please select"
            treeDefaultExpandAll
            fieldNames={{
              label: 'name',
              value: 'menuId',
              children: 'children',
            }}
          ></TreeSelect>
        </Form.Item>

        <Form.Item
          label="菜单URL"
          name="url"
          rules={[{ required: true, message: '菜单URl不能为空!' }]}
          hidden={type === 0}
        >
          <Input />
        </Form.Item>

        <Form.Item label="排序号" name="orderNum">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="菜单图标" name="icon">
          <Popover
            content={<div>23</div>}
            title="选一个喜欢的图标吧！"
            placement={'topLeft'}
          >
            <Input defaultValue={props.dataForm.icon} />
          </Popover>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuAddOrUpdate;
