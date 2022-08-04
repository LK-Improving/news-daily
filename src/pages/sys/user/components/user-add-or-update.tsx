import React, { MutableRefObject, useImperativeHandle, useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
} from 'antd';
import { useBoolean, useGetState, useMount } from 'ahooks';
import { roleApi, userApi } from '@/services/api';
import { API } from '@/services/typings';
import { isEmail, isMobile } from '@/utils/validate';

export type event = { init: (id: number) => void };

interface ModelProps {
  event: MutableRefObject<event>;
  refreshDataList: Function;
}

const UserAddOrUpdate: React.FC<ModelProps> = (props) => {
  const [confirmLoading, { set: setConfirmLoading }] = useBoolean(false);

  const [visible, setVisible] = useState<boolean>(false);

  const [roleList, setRoleList] = useState<Array<API.RoleType>>([]);

  const [dataForm, setDataForm, getDataForm] = useGetState<
    {
      [P in keyof API.UserInfoType]?: API.UserInfoType[P];
    } & { checkPassword: string }
  >({
    email: '',
    mobile: '',
    password: '',
    checkPassword: '',
    roleIdList: [],
    status: 1,
    userId: 0,
    username: '',
  });

  const [form] = Form.useForm();

  // 查询所有角色
  const selectRoleList = async () => {
    const res = (await roleApi.reqRoleSelect()) as API.ResultType & {
      list: Array<API.RoleType>;
    };
    setRoleList(res.list);
  };

  // 初始化
  const init = async (id: number) => {
    setDataForm({ ...dataForm, userId: id | 0 });
    await selectRoleList();
    if (getDataForm().userId) {
      const res = (await userApi.reqUserInfo(
        getDataForm().userId!,
      )) as API.ResultType & {
        user: API.UserInfoType;
      };
      if (res && res.code === 0) {
        form.setFieldsValue({
          userId: res.user.userId,
          username: res.user.username,
          email: res.user.email,
          mobile: res.user.mobile,
          roleIdList: res.user.roleIdList,
        });
      }
    }
    setVisible(true);
  };

  useImperativeHandle(props.event, () => ({
    init,
  }));

  const onFinish = async (val: typeof dataForm) => {
    if ('checkPassword' in val) {
      Reflect.deleteProperty(val, 'checkPassword');
    }
    if (!val.userId) {
      setConfirmLoading(true);
      const res: any = await userApi.reqUserSave(val);
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
      const res: any = await userApi.reqUserUpdate(val);
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
      title={dataForm.userId ? '修改' : '添加'}
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
        <Form.Item name="userId" hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '用户名不嫩为空!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={
            !dataForm.userId ? [{ required: true, message: '请输入密码!' }] : []
          }
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="checkPassword"
          rules={
            !dataForm.userId
              ? [
                  { required: true, message: '请重新输入密码！' },
                  {
                    validator: (rule, value) => {
                      const { password } = form.getFieldsValue();
                      if (value !== password) {
                        Promise.reject('两次密码不一致哦，亲！');
                      }
                      Promise.resolve();
                    },
                  },
                ]
              : [
                  {
                    validator: (rule, value) => {
                      const { password } = form.getFieldsValue();
                      console.log(value, password);
                      if (value !== password) {
                        Promise.reject('两次密码不一致哦，亲！');
                      }
                      Promise.resolve();
                    },
                  },
                ]
          }
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱！' },
            {
              validator: (rule, value, callback) => {
                if (!isEmail(value)) {
                  Promise.reject('邮箱格式不对哦，亲！');
                }
                Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="mobile"
          rules={[
            { required: true, message: '请输入手机号！' },
            {
              validator: (rule, value, callback) => {
                if (!isMobile(value)) {
                  Promise.reject('手机号格式不对哦，亲！');
                }
                Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        {roleList.length > 0 ? (
          <Form.Item
            label="角色"
            name="roleIdList"
            rules={[{ required: true, message: '请选择角色!' }]}
          >
            <Checkbox.Group>
              <Row>
                {roleList.map((item) => {
                  return (
                    <Col key={item.roleId} span={8}>
                      <Checkbox
                        value={item.roleId}
                        style={{ lineHeight: '32px' }}
                      >
                        {item.roleName}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        ) : null}

        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value={0}>禁用</Radio>
            <Radio value={1}>正常</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserAddOrUpdate;
