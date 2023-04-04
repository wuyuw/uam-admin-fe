import defaultAvatar from '@/assets/goku.jpeg';
import HeaderDropdown from '@/components/HeaderDropdown';
import { STATUS_OK } from '@/constants';
import { logout } from '@/services/core';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const MenuList = [
  {
    key: 'center',
    label: (
      <span>
        <UserOutlined />
        用户中心
      </span>
    ),
  },
  {
    key: 'logout',
    label: (
      <span>
        <LogoutOutlined />
        退出登录
      </span>
    ),
  },
];

const handleLogout = async () => {
  try {
    const resp = await logout();
    if (resp.code === STATUS_OK) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState } = useModel('@@initialState');

  const onMenuClick: MenuProps['onClick'] = async (event) => {
    const { key } = event;
    if (key === 'logout') {
      const ok = await handleLogout();
      if (ok) {
        history.push('/login');
      }
    } else if (key === 'center') {
      history.push(`/user/${key}`);
    }
  };

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.nickname) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu
      className={styles.menu}
      selectedKeys={[]}
      items={menu ? MenuList : undefined}
      onClick={onMenuClick}
    ></Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="default"
          className={styles.avatar}
          src={defaultAvatar}
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>{currentUser.nickname}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
