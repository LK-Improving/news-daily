import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, message, Image } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';
import { queryCurrentUser, login, reqCaptcha } from '@/services/api';
import { history, useModel } from 'umi';
import { ReactComponent as Logo } from '@/assets/images/login/undraw_newspaper_re_syf5 (1).svg';
import { getUUID } from '@/utils';
import { baseUrl } from '@/utils/http';
import { setToken } from '@/utils/cookie';

const Login: React.FC = () => {
  const [captchaPath, setCaptchaPath] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');

  useEffect(() => {
    getCaptcha();
  }, []);

  // 获取验证码
  const getCaptcha = async () => {
    let value = getUUID();
    setUuid(value);
    setCaptchaPath(`${baseUrl}/captcha.jpg?uuid=${value}`);
  };

  const getUserInfo = async () => {
    // const userInfo = await initialState?.reqUserInfo?.();
    // console.log(userInfo);
    // if (userInfo) {
    //   await setInitialState((s) => ({
    //     ...s,
    //     currentUser: userInfo
    //   }));
  };

  // queryCurrentUser().then((res:any) => {
  //   console.log(res);
  // }).catch((err) => {
  //   message.error('查询用户失败。请重试！')
  // });
  // }

  const handleSubmit = async (values: API.LoginParams) => {
    values.uuid = uuid;
    console.log('Success:', values);
    await login({ ...values }).then((res: any) => {
      if (res && res.code === 0) {
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        const expire = new Date(new Date().getTime() + res.expire * 6000);
        console.log(expire);
        setToken('token', res.token, { path: '/', expire });
        // getUserInfo()
        history.push(redirect || '/');
      } else {
        getCaptcha();
        message.error(res.msg);
      }
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
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
