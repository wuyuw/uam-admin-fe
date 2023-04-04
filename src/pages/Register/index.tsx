import uamLogo from '@/assets/uam-logo.png';
import SignForm from '@/components/SignForm';
import { STATUS_OK } from '@/constants';
import { register } from '@/services/core';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Form, Space } from 'antd';
import React from 'react';

const handleRegister = async (payload: API.RegisterPayload) => {
  try {
    const resp = await register(payload);
    if (resp.code === STATUS_OK) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const Register: React.FC = () => {
  const [form] = Form.useForm();

  // 提交表单且数据验证成功后回调事件
  const formOnFinished = async (values: any) => {
    const { username, password, dupPassword } = values;
    const payload = { username, password, dupPassword };
    const ok = await handleRegister(payload);
    if (ok) {
      history.push('/login');
    }
  };

  return (
    <SignForm
      logo={uamLogo}
      title="UAM"
      subTitle="统一访问管理中心"
      submitText="注册"
      formProps={{
        form: form,
        onFinish: formOnFinished,
      }}
      actions={
        <>
          <Space>其他登录方式</Space>
          <a style={{ float: 'right' }} href="/login">
            登录
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
          {
            min: 4,
            max: 12,
            message: '密码长度4~12位',
          },
        ]}
      />
      <ProFormText.Password
        name="dupPassword"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />,
        }}
        placeholder={'确认密码:'}
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入密码不一致'));
            },
          }),
        ]}
      />
    </SignForm>
  );
};

export default Register;
