import React, { useState } from 'react';
import { useBoolean, useDebounce, useMount, useThrottle } from 'ahooks';
import { Button, Form, Input, message, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form/hooks/useForm';
import { updatePassword } from '@/services/api';

export type ModelProps = {
  title: string;
  visible: boolean;
  setVisible: undefined | Function;
  username?: string;
  item?: object | undefined;
};

const FormModal: React.FC<ModelProps> = (props) => {
  const [confirmLoading, { set: setConfirmLoading }] = useBoolean(false);

  const [form] = Form.useForm();

  useMount(() => {
    // console.log(props);
  });

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async ({ password, newPassword }: any) => {
    // console.log(val);
    setConfirmLoading(true);
    const res: any = await updatePassword({ password, newPassword });
    setTimeout(() => {
      if (res && res.code === 0) {
        message.success('修改成功');
        handleCancel();
      } else {
        message.error(res.msg);
        setConfirmLoading(false);
      }
    }, 2000);
  };

  const handleCancel = () => {
    // @ts-ignore
    props.setVisible(false);
    setConfirmLoading(false);
    onReset();
  };

  // @ts-ignore
  return (
    <Modal
      title={props.title}
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
      >
        <Form.Item label="用户名" name="username">
          {props.username}
        </Form.Item>

        <Form.Item
          label="原密码"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="新密码"
          name="newPassword"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="newPassword2"
          rules={[
            { required: true, message: 'Please input your password!' },
            {
              validator: (rule, value, callback) => {
                const { newPassword } = form.getFieldsValue();
                if (value !== newPassword) {
                  callback('两次密码不一致哦，亲！');
                }
                callback();
              },
            },
          ]}
        >
          <Input.Password />
          {/*{debounceValue}*/}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormModal;
