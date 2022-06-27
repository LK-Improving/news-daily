import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';
import { login } from '@/services/api';
import { history, useModel } from 'umi';
import { ReactComponent as Logo } from '@/assets/images/login/undraw_newspaper_re_syf5 (1).svg';
import { getUUID } from '@/utils';
import { baseUrl } from '@/utils/http';
import { setToken } from '@/utils/cookie';
import { useMount } from 'ahooks';

type LoginResType = {
  expire: number;
  token: string;
} & {
  [P in keyof API.ResultType]: API.ResultType[P];
};

const Login: React.FC = () => {
  const [captchaPath, setCaptchaPath] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');
  const { initialState, setInitialState } = useModel('@@initialState');

  useMount(() => {
    getCaptcha();
  });

  // 获取验证码
  const getCaptcha = async () => {
    let value = getUUID();
    setUuid(value);
    setCaptchaPath(`${baseUrl}/captcha.jpg?uuid=${value}`);
  };

  const getUserInfo = async () => {
    const userInfo = await initialState?.queryCurrentUser?.();
    if (userInfo) message.success(`欢迎回来，${userInfo.username}!`);
    await setInitialState((s: any) => {
      return {
        ...s,
        currentUser: userInfo,
      };
    });
  };

  const handleSubmit = async (values: API.LoginParams) => {
    values.uuid = uuid;
    const res = (await login({ ...values })) as LoginResType;
    if (res && res.code === 0) {
      if (!history) return;
      const { query } = history.location;
      const { redirect } = query as { redirect: string };
      const expire = new Date(new Date().getTime() + res.expire * 1000);
      setToken('token', res.token, { path: '/', expire });
      getUserInfo();
      history.push(redirect || '/');
    } else {
      getCaptcha();
      message.error(res.msg);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Logo width={500} height={300} className={styles.loginImg} />
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          style={{ width: 300 }}
        >
          <div className={styles.title}>
            <h2>后台登录</h2>
          </div>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入您的用户名!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
              allowClear={true}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入您的密码!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
              allowClear={true}
            />
          </Form.Item>
          <Form.Item
            name="captcha"
            rules={[{ required: true, message: '请输入验证码!' }]}
          >
            <div className={styles.captcha}>
              <Input
                prefix={<PictureOutlined />}
                placeholder="验证码"
                allowClear={true}
              />
              <img src={captchaPath} onClick={getCaptcha} alt="" />
            </div>
          </Form.Item>
          <Form.Item>
            <Form.Item
              // name="remember"
              valuePropName="checked"
              noStyle
            >
              <Checkbox>记住密码</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" shape="round">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
