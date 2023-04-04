import uamLogo from '@/assets/uam-logo.png';
import SignForm from '@/components/SignForm';
import { STATUS_OK } from '@/constants';
import { login } from '@/services/core';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Form as AntdForm, Space } from 'antd';
import React from 'react';

const handleLogin = async (payload: API.LoginPayload) => {
  try {
    const resp = await login(payload);
    if (resp.code === STATUS_OK) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const Login: React.FC = () => {
  const [form] = AntdForm.useForm();

  // 提交表单且数据验证成功后回调事件
  const formOnFinished = async (values: any) => {
    const { username, password } = values;
    const payload = { username, password };
    const ok = await handleLogin(payload);
    if (ok) {
      history.push('/');
    }
  };

  return (
    <SignForm
      logo={uamLogo}
      title="UAM"
      subTitle="统一访问管理中心"
      submitText="登录"
      formProps={{
        form: form,
        onFinish: formOnFinished,
      }}
      actions={
        <>
          <Space>其他登录方式</Space>
          <a style={{ float: 'right' }} href="/register">
            注册
          </a>
        </>
      }
    >
      <ProFormText
        name="username"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined className={'prefixIcon'} />,
        }}
        placeholder={'用户名:'}
        rules={[
          {
            required: true,
            message: '请输入用户名!',
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />,
        }}
        placeholder={'密码:'}
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      />
    </SignForm>
  );
};

export default Login;
