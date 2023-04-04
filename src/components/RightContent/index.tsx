import { Space } from 'antd';
import React from 'react';
import Avatar from './AvatarDropdown';
import styles from './index.less';
export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  let className = styles.right;

  return (
    <Space className={className}>
      <Avatar menu />
    </Space>
  );
};

export default GlobalHeaderRight;
