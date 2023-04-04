import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import React, { useEffect } from 'react';
import styles from './index.less';

const Welcome: React.FC = () => {
  const { refresh } = useModel('@@initialState');
  useEffect(() => {
    refresh();
  }, []);
  return (
    <PageContainer ghost>
      <div className={styles.welcome}>welcome</div>
    </PageContainer>
  );
};

export default Welcome;
