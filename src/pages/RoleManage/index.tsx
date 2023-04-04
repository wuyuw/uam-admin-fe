import MuiTheme from '@/components/MuiTheme';
import TableTransfer from '@/components/TableTransfer';
import * as services from '@/services/role';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button as MuiButton,
  Chip as MuiChip,
  FormControl as MuiFormControl,
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
  Popconfirm as AntdPopconfirm,
  Select as AntdSelect,
  Table as AntdTable,
  Tooltip as AntdTooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.less';

const { Option: AntdOption } = AntdSelect;
const { TextArea: AntdTextarea } = AntdInput;

const { getRoleList, addRole, updateRole, deleteRole } = services;

// 添加角色
const handleAddRole = async (payload: ROLE.AddRolePayload) => {
  const hide = message.loading('正在添加...');
  try {
    const resp = await addRole({ ...payload });
    hide();
    if (resp.code !== 0) {
      message.error('添加失败');
      return false;
    }
    message.success('添加成功');
    return true;
  } catch (error) {
    return false;
  }
};

// 更新角色
const handleUpdateRole = async (payload: ROLE.UpdateRolePayload) => {
  const hide = message.loading('正在更新...');
  try {
    const resp = await updateRole({ ...payload });
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

// 删除角色
const handleDeleteRole = async (id: number) => {
  const hide = message.loading('正在删除...');
  try {
    const resp = await deleteRole(id);
    hide();
    if (resp.code !== 0) {
      message.error('删除失败');
      return false;
    }
    message.success('删除成功');
    return true;
  } catch (error) {
    return false;
  }
};

const RoleManage: React.FC = () => {
  const {
    clientNameMap,
    clientOptions,
    fetchClientOptions,
    selectedClient,
    setSelectedClient,
  } = useModel('global', (model) => ({
    clientNameMap: model.clientNameMap,
    clientOptions: model.clientOptions,
    fetchClientOptions: model.fetchClientOptions,
    selectedClient: model.selectedClient,
    setSelectedClient: model.setSelectedClient,
  }));

  const [search, setSearch] = useState<string>('');
  const [selectedEditable, setSelectedEditable] = useState<string>('');
  const [expandedRow, setExpandedRow] = useState<number[]>([]);

  const [form] = AntdForm.useForm();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [isAddForm, setIsAddForm] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formChanged, setFormChanged] = useState<boolean>(false);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

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
      getRoleList({
        client_id: typeof selectedClient === 'number' ? selectedClient : 0,
        editable: selectedEditable,
      }),
    {
      refreshDeps: [selectedClient, selectedEditable],
      ready: typeof selectedClient === 'number',
    },
  );

  // 权限可选项
  const permOptions = useMemo(() => {
    if (typeof selectedClient !== 'number' || clientOptions.length === 0) {
      return [];
    }
    for (const client of clientOptions) {
      if (client.id === selectedClient) {
        return client.perms;
      }
    }
    return [];
  }, [selectedClient, clientOptions]);

  // 权限可选项 key Map
  const permKeyMap = useMemo(() => {
    const map = new Map<string, PERM.Perm>();
    if (permOptions.length > 0) {
      permOptions.forEach((item) => {
        map.set(item.key, item);
      });
    }
    return map;
  }, [permOptions]);

  const filteredListData = useMemo(() => {
    if (typeof selectedClient !== 'number') {
      return [];
    }
    if (search === '') {
      return listData?.data;
    }
    return listData?.data.filter(
      (value) =>
        value.name.indexOf(search) !== -1 || value.desc.indexOf(search) !== -1,
    );
  }, [search, listData, selectedClient]);

  const handleChangeClient = (value: string | number) => {
    if (typeof value === 'number') {
      setSelectedClient(value);
    }
  };

  const handleClickAdd = () => {
    setIsAddForm(true);
    setModalVisible(true);
    setTargetKeys([]);
    form.setFieldsValue({
      id: 0,
      client_id: selectedClient,
      name: '',
      desc: '',
      permissions: [],
    });
  };

  const handleClickEdit = (record: ROLE.Role) => {
    const { id, client_id, name, desc, permissions } = record;
    setIsAddForm(false);
    setModalVisible(true);
    setTargetKeys(permissions);
    form.setFieldsValue({ id, client_id, name, desc, permissions });
  };

  // 权限改变
  const OnPermissionsChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
    form.setFieldsValue({
      permissions: nextTargetKeys,
    });
  };

  const handleDelete = async (id: number) => {
    const ok = await handleDeleteRole(id);
    if (ok) {
      getList();
      fetchClientOptions();
    }
  };

  // 提交表单且数据验证成功后回调事件
  const formOnFinished = async (values: any) => {
    if (!formChanged) {
      setModalVisible(false);
      return;
    }

    const { id, client_id, name, desc, permissions } = values;
    let ok: boolean;
    setFormLoading(true);
    if (isAddForm) {
      const payload = { client_id, name, desc, permissions };
      ok = await handleAddRole(payload);
    } else {
      const payload = { id, client_id, name, desc, permissions };
      ok = await handleUpdateRole(payload);
    }
    if (ok) {
      setModalVisible(false);
      getList();
      fetchClientOptions();
    }
    setFormLoading(false);
  };

  const columns: ColumnsType<ROLE.Role> = [
    {
      title: '序号',
      render: (value, record, index) => <em>{index + 1}</em>,
      width: 80,
    },
    {
      title: '应用',
      dataIndex: 'client_id',
      render: (client_id: number) => clientNameMap.get(client_id),
    },
    {
      title: '角色',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      align: 'center',
      width: 160,
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: 'center',
      width: 160,
    },
    {
      title: '备注',
      render: (record: ROLE.Role) => {
        if (record.editable === 0) {
          return '';
        }
        return (
          <div>
            <AntdButton type="link" onClick={() => handleClickEdit(record)}>
              编辑
            </AntdButton>
            |
            <AntdPopconfirm
              title="确定删除该角色? 删除角色会同步将其从关联组移除"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <AntdButton type="link">删除</AntdButton>
            </AntdPopconfirm>
          </div>
        );
      },
      align: 'center',
      width: 160,
    },
  ];

  const expandedRowRender = (row: ROLE.Role) => {
    return (
      <AntdForm
        labelCol={{ xs: { span: 24 }, sm: { span: 2 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 20 } }}
      >
        <AntdForm.Item label="角色名称">
          <span>{row.name}</span>
        </AntdForm.Item>
        <AntdForm.Item label="角色描述">
          <span>{row.desc}</span>
        </AntdForm.Item>
        <AntdForm.Item label="权限">
          <div className={styles.tagStackColumn}>
            {row.permissions.map((perm) => (
              <MuiChip
                key={perm}
                label={permKeyMap.get(perm)?.name}
                color="default"
                variant="filled"
              />
            ))}
          </div>
        </AntdForm.Item>
      </AntdForm>
    );
  };

  const changeExpandRow = (expanded: boolean, record: ROLE.Role) => {
    if (expanded) {
      setExpandedRow([record.id]);
    } else {
      setExpandedRow([]);
    }
  };

  const leftTableColumns: ColumnsType<PERM.Perm> = [
    {
      dataIndex: 'type',
      title: '类型',
    },
    {
      title: '名称',
      dataIndex: 'name',
      render: (value, record: PERM.Perm) => (
        <AntdTooltip title={record.desc}>
          <span>{record.name}</span>
        </AntdTooltip>
      ),
    },
  ];
  const rightTableColumns = leftTableColumns;

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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
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
                  <MuiInputLabel>可编辑</MuiInputLabel>
                  <MuiSelect
                    className={styles.editableSelect}
                    value={selectedEditable}
                    onChange={(e) => setSelectedEditable(e.target.value)}
                    label="可编辑"
                  >
                    <MuiMenuItem value="">
                      <em>全部</em>
                    </MuiMenuItem>
                    <MuiMenuItem value="1">
                      <em>是</em>
                    </MuiMenuItem>
                    <MuiMenuItem value="0">
                      <em>否</em>
                    </MuiMenuItem>
                  </MuiSelect>
                </MuiFormControl>
              </MuiPaper>
            </div>
            <div className={styles.tableHeaderRight}>
              <MuiButton
                className={styles.tagButton}
                variant="contained"
                color="primary"
                onClick={handleClickAdd}
                disabled={typeof selectedClient !== 'number'}
              >
                添加角色
              </MuiButton>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <MuiPaper>
              <AntdTable<ROLE.Role>
                scroll={{ x: 1200 }}
                rowKey="id"
                loading={listLoading}
                columns={columns}
                dataSource={filteredListData}
                className={styles['ant-table']}
                expandable={{
                  expandedRowRender: (record) => expandedRowRender(record),
                  onExpand: (expanded, record) =>
                    changeExpandRow(expanded, record),
                  expandedRowKeys: expandedRow,
                }}
              />
            </MuiPaper>
          </div>
          <AntdModal
            width={1200}
            centered={true}
            title={`${isAddForm ? '添加' : '更新'}角色`}
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
              <AntdForm.Item name="id" hidden={true}>
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
              <AntdForm.Item
                name="name"
                label="名称"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <AntdInput style={{ width: 500 }} />
              </AntdForm.Item>
              <AntdForm.Item
                name="desc"
                label="描述"
                rules={[{ required: true, message: '请输入描述' }]}
              >
                <AntdTextarea style={{ width: 500 }} />
              </AntdForm.Item>
              <AntdForm.Item name="permissions" label="权限">
                <TableTransfer<PERM.Perm>
                  pagination={false}
                  scroll={{ y: 400 }}
                  rowKey={(record) => `${record.key}`}
                  dataSource={permOptions}
                  targetKeys={targetKeys}
                  showSearch={true}
                  titles={['未授权', '已授权']}
                  operations={['添加', '移除']}
                  onChange={(nextTargetKeys) =>
                    OnPermissionsChange(nextTargetKeys)
                  }
                  filterOption={(inputValue, item) =>
                    item.name.indexOf(inputValue) !== -1
                  }
                  leftColumns={leftTableColumns}
                  rightColumns={rightTableColumns}
                />
              </AntdForm.Item>
            </AntdForm>
          </AntdModal>
        </MuiPaper>
      </MuiTheme>
    </PageContainer>
  );
};

export default RoleManage;
