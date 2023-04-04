import MuiTheme from '@/components/MuiTheme';
import TableTransfer from '@/components/TableTransfer';
import * as services from '@/services/user';
import { PageContainer } from '@ant-design/pro-layout';
import { Search as MuiSearchIcon } from '@mui/icons-material';
import {
  Chip as MuiChip,
  FormControl as MuiFormControl,
  IconButton as MuiIconButton,
  InputBase as MuiInputBase,
  InputLabel as MuiInputLabel,
  MenuItem as MuiMenuItem,
  Paper as MuiPaper,
  Select as MuiSelect,
} from '@mui/material';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import {
  Button as AntdButton,
  Form as AntdForm,
  Input as AntdInput,
  InputNumber as AntdInputNumber,
  message,
  Modal as AntdModal,
  Select as AntdSelect,
  Table as AntdTable,
  Tooltip as AntdTooltip,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.less';

const { Option: AntdOption } = AntdSelect;

const { getUserPageList, updateUserPerms } = services;

// 更新用户权限
const handleUpdateUserPerms = async (payload: USER.UpdateUserPermsPayload) => {
  const hide = message.loading('正在更新...');
  try {
    const resp = await updateUserPerms({ ...payload });
    hide();
    if (resp.code !== 0) {
      message.error('更新失败');
      return false;
    }
    message.success('更新成功');
    return true;
  } catch (error) {
    return false;
  }
};

const UserManage: React.FC = () => {
  const {
    clientOptions,
    fetchClientOptions,
    selectedClient,
    setSelectedClient,
  } = useModel('global', (model) => ({
    clientOptions: model.clientOptions,
    fetchClientOptions: model.fetchClientOptions,
    selectedClient: model.selectedClient,
    setSelectedClient: model.setSelectedClient,
  }));

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedGroupId, setSelectedGroupId] = useState<number | string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<number | string>('');

  const [form] = AntdForm.useForm();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formChanged, setFormChanged] = useState<boolean>(false);
  const [groupTargetKeys, setGroupTargetKeys] = useState<string[]>([]);
  const [roleTargetKeys, setRoleTargetKeys] = useState<string[]>([]);

  useEffect(() => {
    fetchClientOptions();
  }, []);

  useEffect(() => {
    if (typeof selectedClient !== 'number' && clientOptions.length > 0) {
      setSelectedClient(clientOptions[0].id);
    }
  }, [clientOptions]);

  const {
    data: listData,
    loading: listLoading,
    run: getList,
  } = useRequest(
    () =>
      getUserPageList({
        page,
        pageSize,
        client_id: typeof selectedClient === 'number' ? selectedClient : 0,
        group_id: typeof selectedGroupId === 'number' ? selectedGroupId : 0,
        role_id: typeof selectedRoleId === 'number' ? selectedRoleId : 0,
        search,
      }),
    {
      refreshDeps: [
        page,
        pageSize,
        selectedClient,
        selectedGroupId,
        selectedRoleId,
        search,
      ],
      ready: typeof selectedClient === 'number',
    },
  );

  // 组可选项
  const {
    groupOptions,
    roleOptions,
  }: {
    groupOptions: GROUP.Group[];
    roleOptions: ROLE.Role[];
  } = useMemo(() => {
    if (typeof selectedClient !== 'number' || clientOptions.length === 0) {
      return { groupOptions: [], roleOptions: [] };
    }
    for (const client of clientOptions) {
      if (client.id === selectedClient) {
        return { groupOptions: client.groups, roleOptions: client.roles };
      }
    }
    return { groupOptions: [], roleOptions: [] };
  }, [selectedClient, clientOptions]);

  // 组可选项 ID Map
  const groupIdMap = useMemo(() => {
    const map = new Map<number, GROUP.Group>();
    if (groupOptions.length > 0) {
      groupOptions.forEach((item) => {
        map.set(item.id, item);
      });
    }
    return map;
  }, [groupOptions]);

  // 角色可选项 ID Map
  const roleIdMap = useMemo(() => {
    const map = new Map<number, ROLE.Role>();
    if (roleOptions.length > 0) {
      roleOptions.forEach((item) => {
        map.set(item.id, item);
      });
    }
    return map;
  }, [roleOptions]);

  // 回车
  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSearch(localSearch);
    }
  };

  // 点击搜索
  const handleSearch = () => {
    setSearch(localSearch);
  };

  const handleChangeClient = (value: string | number) => {
    if (typeof value === 'number') {
      setSelectedClient(value);
    }
  };

  const handleClickEdit = (record: USER.User) => {
    const { uid, userName, nickname, groups, roles } = record;
    const strGroupIds = groups.map((value) => value.toString());
    const strRoleIds = roles.map((value) => value.toString());
    setModalVisible(true);
    setGroupTargetKeys(strGroupIds);
    setRoleTargetKeys(strRoleIds);
    form.setFieldsValue({
      uid,
      userName,
      nickname,
      client_id: selectedClient,
      groups: strGroupIds,
      roles: strRoleIds,
    });
  };

  // 角色改变
  const OnRolesChange = (nextTargetKeys: string[]) => {
    setRoleTargetKeys(nextTargetKeys);
    form.setFieldsValue({
      roles: nextTargetKeys,
    });
  };

  // 组改变
  const OnGroupsChange = (nextTargetKeys: string[]) => {
    setGroupTargetKeys(nextTargetKeys);
    form.setFieldsValue({
      groups: nextTargetKeys,
    });
  };

  // 提交表单且数据验证成功后回调事件
  const formOnFinished = async (values: any) => {
    if (!formChanged) {
      setModalVisible(false);
      return;
    }

    const { uid, client_id, groups, roles } = values;
    const numGroupIds = groups.map((value: string) => parseInt(value));
    const numRoleIds = roles.map((value: string) => parseInt(value));
    let ok: boolean;
    setFormLoading(true);

    const payload = { uid, client_id, groups: numGroupIds, roles: numRoleIds };
    ok = await handleUpdateUserPerms(payload);
    if (ok) {
      setModalVisible(false);
      getList();
    }
    setFormLoading(false);
  };

  const columns: ColumnsType<USER.User> = [
    {
      title: '序号',
      render: (value, record, index) => <em>{index + 1}</em>,
      width: 80,
    },
    {
      title: 'UID',
      dataIndex: 'uid',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
    },
    {
      title: '花名',
      dataIndex: 'nickname',
    },
    {
      title: '关联组',
      dataIndex: 'groups',
      render: (value: number[]) => (
        <div className={styles.tagStackColumn}>
          {value.map((groupId) => (
            <MuiChip
              key={groupId}
              label={groupIdMap.get(groupId)?.name}
              color="default"
              variant="filled"
            />
          ))}
        </div>
      ),
    },
    {
      title: '关联角色',
      dataIndex: 'roles',
      render: (value: number[]) => (
        <div className={styles.tagStackColumn}>
          {value.map((roleId) => (
            <MuiChip
              key={roleId}
              label={roleIdMap.get(roleId)?.name}
              color="default"
              variant="filled"
            />
          ))}
        </div>
      ),
    },
    {
      title: '操作',
      render: (record: USER.User) => (
        <div>
          <AntdButton type="link" onClick={() => handleClickEdit(record)}>
            编辑
          </AntdButton>
        </div>
      ),
      align: 'center',
      width: 160,
    },
  ];

  const paginationProps: TablePaginationConfig = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: pageSize,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: () => `共${listData?.data?.total}条`,
    current: page,
    total: listData?.data?.total,
    onShowSizeChange: (current: number, size: number) => setPageSize(size),
    onChange: (current: number) => setPage(current),
  };

  const rolesLeftTableColumns: ColumnsType<ROLE.Role> = [
    {
      title: '角色',
      dataIndex: 'name',
      render: (value, record: ROLE.Role) => (
        <AntdTooltip title={record.desc}>
          <span>{record.name}</span>
        </AntdTooltip>
      ),
    },
  ];
  const rolesRightTableColumns = rolesLeftTableColumns;

  const groupsLeftTableColumns: ColumnsType<GROUP.Group> = [
    {
      title: '组',
      dataIndex: 'name',
      render: (value, record: GROUP.Group) => (
        <AntdTooltip title={record.desc}>
          <span>{record.name}</span>
        </AntdTooltip>
      ),
    },
  ];
  const groupsRightTableColumns = groupsLeftTableColumns;

  return (
    <PageContainer>
      <MuiTheme>
        <MuiPaper className={styles.paper}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderLeft}>
              <MuiPaper className={styles.searchControl}>
                <MuiInputBase
                  className={styles.searchInput}
                  placeholder="🔍 搜索..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyPress={handleEnterPress}
                />
                <MuiIconButton
                  className={styles.iconButton}
                  onClick={handleSearch}
                >
                  <MuiSearchIcon />
                </MuiIconButton>
              </MuiPaper>
              <MuiPaper>
                <MuiFormControl variant="outlined">
                  <MuiInputLabel>应用</MuiInputLabel>
                  <MuiSelect
                    className={styles.clientSelect}
                    value={selectedClient}
                    onChange={(e) => handleChangeClient(e.target.value)}
                    label="应用"
                  >
                    {clientOptions.map((item) => (
                      <MuiMenuItem value={item.id} key={item.id}>
                        <em>{item.name}</em>
                      </MuiMenuItem>
                    ))}
                    <MuiMenuItem value="" key={0}>
                      <em>None</em>
                    </MuiMenuItem>
                  </MuiSelect>
                </MuiFormControl>
              </MuiPaper>
              <MuiPaper>
                <MuiFormControl variant="outlined">
                  <MuiInputLabel>组</MuiInputLabel>
                  <MuiSelect
                    className={styles.groupSelect}
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    label="组"
                  >
                    {groupOptions.map((item) => (
                      <MuiMenuItem value={item.id} key={item.id}>
                        <em>{item.name}</em>
                      </MuiMenuItem>
                    ))}
                    <MuiMenuItem value="" key={0}>
                      <em>None</em>
                    </MuiMenuItem>
                  </MuiSelect>
                </MuiFormControl>
              </MuiPaper>
              <MuiPaper>
                <MuiFormControl variant="outlined">
                  <MuiInputLabel>角色</MuiInputLabel>
                  <MuiSelect
                    className={styles.roleSelect}
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    label="角色"
                  >
                    {roleOptions.map((item) => (
                      <MuiMenuItem value={item.id} key={item.id}>
                        <em>{item.name}</em>
                      </MuiMenuItem>
                    ))}
                    <MuiMenuItem value="" key={0}>
                      <em>None</em>
                    </MuiMenuItem>
                  </MuiSelect>
                </MuiFormControl>
              </MuiPaper>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <MuiPaper>
              <AntdTable<USER.User>
                scroll={{ x: 1200 }}
                rowKey="uid"
                loading={listLoading}
                columns={columns}
                dataSource={listData?.data.list}
                className={styles['ant-table']}
                pagination={paginationProps}
              />
            </MuiPaper>
          </div>
          <AntdModal
            width={1200}
            centered={true}
            title={`更新用户权限`}
            visible={modalVisible}
            onOk={() => form.submit()}
            confirmLoading={formLoading}
            onCancel={() => setModalVisible(false)}
            okButtonProps={{ type: 'primary' }}
          >
            <AntdForm
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 20 }}
              form={form}
              autoComplete="off"
              onValuesChange={() => setFormChanged(true)}
              onFinish={formOnFinished}
            >
              <AntdForm.Item name="uid" hidden={true}>
                <AntdInputNumber />
              </AntdForm.Item>
              <AntdForm.Item
                name="client_id"
                label="应用"
                rules={[{ required: true, message: '请选择应用' }]}
              >
                <AntdSelect
                  placeholder="请选择应用"
                  disabled={true}
                  style={{ width: 500 }}
                >
                  {clientOptions.map((item) => (
                    <AntdOption key={item.id} value={item.id}>
                      {item.name}
                    </AntdOption>
                  ))}
                </AntdSelect>
              </AntdForm.Item>
              <AntdForm.Item name="userName" label="姓名">
                <AntdInput disabled={true} style={{ width: 500 }} />
              </AntdForm.Item>
              <AntdForm.Item name="nickname" label="花名">
                <AntdInput disabled={true} style={{ width: 500 }} />
              </AntdForm.Item>
              <AntdForm.Item name="groups" label="关联组">
                <TableTransfer<GROUP.Group>
                  pagination={false}
                  scroll={{ y: 400 }}
                  rowKey={(record) => `${record.id}`}
                  dataSource={groupOptions}
                  targetKeys={groupTargetKeys}
                  showSearch={true}
                  titles={['未授权', '已授权']}
                  operations={['添加', '移除']}
                  onChange={(nextTargetKeys) => OnGroupsChange(nextTargetKeys)}
                  filterOption={(inputValue, item) =>
                    item.name.indexOf(inputValue) !== -1
                  }
                  leftColumns={groupsLeftTableColumns}
                  rightColumns={groupsRightTableColumns}
                />
              </AntdForm.Item>
              <AntdForm.Item name="roles" label="角色">
                <TableTransfer<ROLE.Role>
                  pagination={false}
                  scroll={{ y: 400 }}
                  rowKey={(record) => `${record.id}`}
                  dataSource={roleOptions}
                  targetKeys={roleTargetKeys}
                  showSearch={true}
                  titles={['未授权', '已授权']}
                  operations={['添加', '移除']}
                  onChange={(nextTargetKeys) => OnRolesChange(nextTargetKeys)}
                  filterOption={(inputValue, item) =>
                    item.name.indexOf(inputValue) !== -1
                  }
                  leftColumns={rolesLeftTableColumns}
                  rightColumns={rolesRightTableColumns}
                />
              </AntdForm.Item>
            </AntdForm>
          </AntdModal>
        </MuiPaper>
      </MuiTheme>
    </PageContainer>
  );
};

export default UserManage;
