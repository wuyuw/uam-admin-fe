import MuiTheme from '@/components/MuiTheme';
import * as services from '@/services/permission';
import { PageContainer } from '@ant-design/pro-layout';
import { Search as MuiSearchIcon } from '@mui/icons-material';
import {
  Button as MuiButton,
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
  Popconfirm as AntdPopconfirm,
  Select as AntdSelect,
  Table as AntdTable,
  Tag as AntdTag,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.less';

const { Option: AntdOption } = AntdSelect;
const { TextArea: AntdTextarea } = AntdInput;

const { getPermPagList, addPerm, updatePerm, deletePerm } = services;

// 添加权限
const handleAddPerm = async (payload: PERM.AddPermPayload) => {
  const hide = message.loading('正在添加...');
  try {
    const resp = await addPerm({ ...payload });
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

// 更新客户端
const handleUpdatePerm = async (payload: PERM.UpdatePermPayload) => {
  const hide = message.loading('正在更新...');
  try {
    const resp = await updatePerm({ ...payload });
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

// 删除客户端
const handleDeletePerm = async (id: number) => {
  const hide = message.loading('正在删除...');
  try {
    const resp = await deletePerm(id);
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

const PermissionManage: React.FC = () => {
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
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedEditable, setSelectedEditable] = useState<string>('');
  const [localSearch, setLocalSearch] = useState<string>('');

  const [form] = AntdForm.useForm();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [isAddForm, setIsAddForm] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const {
    data: listData,
    loading: listLoading,
    run: getList,
  } = useRequest(
    () =>
      getPermPagList({
        page,
        pageSize,
        client_id: typeof selectedClient === 'number' ? selectedClient : 0,
        type: selectedType,
        editable: selectedEditable,
        search,
      }),
    {
      refreshDeps: [
        page,
        pageSize,
        selectedClient,
        selectedType,
        selectedEditable,
        search,
      ],
    },
  );

  useEffect(() => {
    fetchClientOptions();
  }, []);

  useEffect(() => {
    if (typeof selectedClient !== 'number' && clientOptions.length > 0) {
      setSelectedClient(clientOptions[0].id);
    }
  }, [clientOptions]);

  // 权限类型可选项
  const permTypeOptions = useMemo(() => {
    if (typeof selectedClient !== 'number' || clientOptions.length === 0) {
      return [];
    }
    for (const client of clientOptions) {
      if (client.id === selectedClient) {
        return client.permTypes;
      }
    }
    return [];
  }, [selectedClient, clientOptions]);

  const clientNameMap = useMemo(() => {
    const map = new Map<number, string>();
    if (clientOptions.length > 0) {
      clientOptions.forEach((client) => {
        map.set(client.id, client.name);
      });
    }
    return map;
  }, [clientOptions]);

  // 回车
  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSearch(localSearch);
      getList();
    }
  };
  // 点击搜索
  const handleSearch = () => {
    setSearch(localSearch);
    getList();
  };

  const handleChangeClient = (value: string | number) => {
    if (typeof value === 'number') {
      setSelectedClient(value);
      setSelectedType('');
    }
  };

  const handleClickAdd = () => {
    setIsAddForm(true);
    setModalVisible(true);
    form.setFieldsValue({
      id: 0,
      client_id: selectedClient,
      key: '',
      name: '',
      desc: '',
    });
  };

  const handleClickEdit = (record: PERM.Perm) => {
    const { id, client_id, key, type, name, desc } = record;
    setIsAddForm(false);
    setModalVisible(true);
    form.setFieldsValue({ id, client_id, key, type, name, desc });
  };

  const handleDelete = async (id: number) => {
    const ok = await handleDeletePerm(id);
    if (ok) {
      getList();
      fetchClientOptions();
    }
  };

  // 提交表单且数据验证成功后回调事件
  const formOnFinished = async (values: any) => {
    const { id, client_id, type, key, name, desc } = values;
    let ok: boolean;
    setFormLoading(true);
    if (isAddForm) {
      const payload = { client_id, type, key, name, desc };
      ok = await handleAddPerm(payload);
    } else {
      const payload = { id, client_id, type, key, name, desc };
      ok = await handleUpdatePerm(payload);
    }
    if (ok) {
      setModalVisible(false);
      getList();
      fetchClientOptions();
    }
    setFormLoading(false);
  };

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

  const columns: ColumnsType<PERM.Perm> = [
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
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: 'Key',
      dataIndex: 'key',
      render: (key: string) => (
        <AntdTag style={{ fontSize: 14 }}>{key}</AntdTag>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'create_time',
    //   align: 'center',
    //   width: 160,
    // },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: 'center',
      width: 160,
    },
    {
      title: '操作',
      render: (record: PERM.Perm) => {
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
              title="确定删除该权限?"
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
                  <MuiInputLabel>类型</MuiInputLabel>
                  <MuiSelect
                    className={styles.typeSelect}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    label="类型"
                  >
                    {permTypeOptions.map((item: string) => (
                      <MuiMenuItem value={item} key={item}>
                        <em>{item}</em>
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
                添加权限
              </MuiButton>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <MuiPaper>
              <AntdTable<PERM.Perm>
                scroll={{ x: 1200 }}
                rowKey="id"
                pagination={paginationProps}
                loading={listLoading}
                columns={columns}
                dataSource={listData?.data.list}
                className={styles['ant-table']}
              />
            </MuiPaper>
          </div>
          <AntdModal
            width={600}
            centered={true}
            title={`${isAddForm ? '添加' : '更新'}权限`}
            visible={modalVisible}
            onOk={() => form.submit()}
            confirmLoading={formLoading}
            onCancel={() => setModalVisible(false)}
            okButtonProps={{ type: 'primary' }}
          >
            <AntdForm
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              form={form}
              autoComplete="off"
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
                <AntdSelect placeholder="请选择应用" disabled={true}>
                  {clientOptions.map((item) => (
                    <AntdOption key={item.id} value={item.id}>
                      {item.name}
                    </AntdOption>
                  ))}
                </AntdSelect>
              </AntdForm.Item>
              <AntdForm.Item
                name="type"
                label="类型"
                rules={[{ required: true, message: '请输入类型' }]}
              >
                <AntdInput />
              </AntdForm.Item>
              <AntdForm.Item
                name="key"
                label="Key"
                rules={[{ required: true, message: '请输入Key' }]}
              >
                <AntdInput disabled={!isAddForm} />
              </AntdForm.Item>
              <AntdForm.Item
                name="name"
                label="名称"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <AntdInput />
              </AntdForm.Item>
              <AntdForm.Item
                name="desc"
                label="描述"
                rules={[{ required: true, message: '请输入描述' }]}
              >
                <AntdTextarea />
              </AntdForm.Item>
            </AntdForm>
          </AntdModal>
        </MuiPaper>
      </MuiTheme>
    </PageContainer>
  );
};

export default PermissionManage;
