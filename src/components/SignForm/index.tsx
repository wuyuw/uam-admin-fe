import type { FormProps } from 'antd';
import { Button, Form } from 'antd';
import React from 'react';
import styles from './index.less';

interface SignProps {
  logo?: string;
  title: string;
  subTitle?: string;
  formProps: FormProps;
  submitText: string;
  actions: React.ReactNode;
  children: React.ReactNode;
}

// login/register form
const SignForm: React.FC<SignProps> = (props) => {
  const { logo, title, subTitle, formProps, submitText, actions, children } =
    props;

  return (
    <div className={styles['sign-container']}>
      <div className={styles['sign-top']}>
        <div className={styles['sign-top-header']}>
          <span className={styles['sign-top-logo']}>
            <img src={logo} />
          </span>
          <span className={styles['sign-top-title']}>{title}</span>
        </div>
        <div className={styles['sign-top-desc']}>{subTitle}</div>
      </div>
      <div className={styles['sign-form']}>
        <Form {...formProps}>
          {children}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {submitText}
            </Button>
            <div style={{ marginBlockStart: 8, overflow: 'hidden' }}>
              {actions}
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignForm;
