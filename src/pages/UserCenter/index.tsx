import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import React from 'react';
import styles from './index.less';

const UserCenter: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer ghost>
      <div className={styles.welcome}>
        欢迎 {initialState?.currentUser?.nickname}
      </div>
    </PageContainer>
  );
};

export default UserCenter;
