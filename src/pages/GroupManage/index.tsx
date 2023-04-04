import MuiTheme from '@/components/MuiTheme';
import TableTransfer from '@/components/TableTransfer';
import * as services from '@/services/group';
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

const { getGroupList, addGroup, updateGroup, deleteGroup } = services;

// 添加组
const handleAddGroup = async (payload: GROUP.AddGroupPayload) => {
  const hide = message.loading('正在添加...');
  try {
    const resp = await addGroup({ ...payload });
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

// 更新组
const handleUpdateGroup = async (payload: GROUP.UpdateGroupPayload) => {
  const hide = message.loading('正在更新...');
  try {
    const resp = await updateGroup({ ...payload });
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

// 删除组
const handleDeleteGroup = async (id: number) => {
  const hide = message.loading('正在删除...');
  try {
    const resp = await deleteGroup(id);
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

const GroupManage: React.FC = () => {
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
      getGroupList({
        client_id: typeof selectedClient === 'number' ? selectedClient : 0,
        editable: selectedEditable,
      }),
    {
      refreshDeps: [selectedClient, selectedEditable],
      ready: typeof selectedClient === 'number',
    },
  );

  // 角色可选项
  const roleOptions = useMemo(() => {
    if (typeof selectedClient !== 'number' || clientOptions.length === 0) {
      return [];
    }
    for (const client of clientOptions) {
      if (client.id === selectedClient) {
        return client.roles;
      }
    }
    return [];
  }, [selectedClient, clientOptions]);

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
      roles: [],
    });
  };

  const handleClickEdit = (record: GROUP.Group) => {
    const { id, client_id, name, desc, roles } = record;
    const strIds = roles.map((value) => value.toString());
    setIsAddForm(false);
    setModalVisible(true);

    setTargetKeys(strIds);
    form.setFieldsValue({ id, client_id, name, desc, roles: strIds });
  };

  // 角色改变
  const OnRolesChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
    form.setFieldsValue({
      roles: nextTargetKeys,
    });
  };

  const handleDelete = async (id: number) => {
    const ok = await handleDeleteGroup(id);
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

    const { id, client_id, name, desc, roles } = values;
    const numRoleIds = roles.map((value: string) => parseInt(value));
    let ok: boolean;
    setFormLoading(true);
    if (isAddForm) {
      const payload = { client_id, name, desc, roles: numRoleIds };
      ok = await handleAddGroup(payload);
    } else {
      const payload = { id, client_id, name, desc, roles: numRoleIds };
      ok = await handleUpdateGroup(payload);
    }
    if (ok) {
      setModalVisible(false);
      getList();
      fetchClientOptions();
    }
    setFormLoading(false);
  };

  const columns: ColumnsType<GROUP.Group> = [
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
      title: '组名',
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
      render: (record: GROUP.Group) => (
        <div>
          <AntdButton type="link" onClick={() => handleClickEdit(record)}>
            编辑
          </AntdButton>
          |
          <AntdPopconfirm
            title="确定删除该组? 删除组会同步将其关联的用户和角色移除该组"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <AntdButton type="link">删除</AntdButton>
          </AntdPopconfirm>
        </div>
      ),
      align: 'center',
      width: 160,
    },
  ];

  const expandedRowRender = (row: GROUP.Group) => {
    return (
      <AntdForm
        labelCol={{ xs: { span: 24 }, sm: { span: 2 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 20 } }}
      >
        <AntdForm.Item label="组名">
          <span>{row.name}</span>
        </AntdForm.Item>
        <AntdForm.Item label="描述">
          <span>{row.desc}</span>
        </AntdForm.Item>
        <AntdForm.Item label="角色">
          <div className={styles.tagStackColumn}>
            {row.roles.map((roleId) => (
              <MuiChip
                key={roleId}
                label={roleIdMap.get(roleId)?.name}
                color="default"
                variant="filled"
              />
            ))}
          </div>
        </AntdForm.Item>
      </AntdForm>
    );
  };

  const changeExpandRow = (expanded: boolean, record: GROUP.Group) => {
    if (expanded) {
      setExpandedRow([record.id]);
    } else {
      setExpandedRow([]);
    }
  };

  const leftTableColumns: ColumnsType<ROLE.Role> = [
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
                添加组
              </MuiButton>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <MuiPaper>
              <AntdTable<GROUP.Group>
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
            title={`${isAddForm ? '添加' : '更新'}组`}
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
                label="组名"
                rules={[{ required: true, message: '请输入组名' }]}
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
              <AntdForm.Item name="roles" label="角色">
                <TableTransfer<ROLE.Role>
                  pagination={false}
                  scroll={{ y: 400 }}
                  rowKey={(record) => `${record.id}`}
                  dataSource={roleOptions}
                  targetKeys={targetKeys}
                  showSearch={true}
                  titles={['未授权', '已授权']}
                  operations={['添加', '移除']}
                  onChange={(nextTargetKeys) => OnRolesChange(nextTargetKeys)}
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

export default GroupManage;
